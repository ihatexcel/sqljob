// @ts-nocheck
import { DuckDBManager } from '../../lib/DuckDBManager';
import { safeEvalJs } from '../../lib/safeEval';

export function helpersMixin() {
    return {
                hasSourceCells() {
                    // Vérifie récursivement si le notebook contient des cellules source (fichiers)
                    const checkGroups = (groups) => {
                        for (const group of groups) {
                            if (group.cells?.some(cell => cell.type === 'source')) return true;
                            if (group.children && checkGroups(group.children)) return true;
                        }
                        return false;
                    };
                    return this.pages.some(page =>
                        checkGroups(page.groups || []) || checkGroups(page.linkGroups || [])
                    );
                },

                canUseDucklings() {
                    // Ducklings ne supporte pas les fichiers
                    return !this.hasSourceCells();
                },

                async switchDbEngine(newEngine) {
                    if (newEngine === this.dbEngine) return;

                    // Validation pour Ducklings
                    if (newEngine === 'ducklings' && !this.canUseDucklings()) {
                        this.setStatus('Ducklings ne supporte pas les notebooks avec fichiers. Supprimez les cellules source pour utiliser Ducklings.', 'error');
                        return;
                    }

                    this.isLoading = true;
                    try {
                        await DuckDBManager.switchEngine(newEngine, (msg, type) => this.setStatus(msg, type));
                        this.dbEngine = newEngine;
                        localStorage.setItem('sqljob-dbEngine', newEngine);
                        this.setStatus(`Moteur changé vers ${newEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}`, 'success');
                    } catch (error) {
                        this.setStatus('Erreur lors du changement de moteur: ' + error.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },

                // ─────────────────────────────────────────────────────────────────
                // INITIALISATION
                // ─────────────────────────────────────────────────────────────────
                async refreshDuckdbTables() {
                    try {
                        const tableRows = await DuckDBManager.executeQuery(`SHOW TABLES`);
                        const result: Record<string, { rowCount: number, columns: {name: string, type: string}[] }> = {};
                        for (const row of tableRows) {
                            const name = row.name ?? row.table_name;
                            if (!name) continue;
                            try {
                                const countRows = await DuckDBManager.executeQuery(`SELECT COUNT(*) as cnt FROM "${name}"`);
                                const descRows = await DuckDBManager.executeQuery(`DESCRIBE "${name}"`);
                                result[name] = {
                                    rowCount: Number(countRows[0]?.cnt ?? 0),
                                    columns: descRows.map((r: any) => ({ name: r.column_name, type: r.column_type })),
                                };
                            } catch {
                                result[name] = { rowCount: 0, columns: [] };
                            }
                        }
                        this._duckdbTables = result;
                    } catch {
                        // DuckDB pas encore prêt, on ignore silencieusement
                    }
                },

                async init() {
                    try {
                        await DuckDBManager.initDuckDB((msg, type) => this.setStatus(msg, type));
                        this.ensureAllCellsHaveNames();
                        // Charger les fichiers embarqués dans le HTML
                        await this.loadEmbeddedFiles();

                        // Charger les fichiers source en attente (depuis la config Gist avec fileBase64)
                        await this.loadPendingSourceFiles();

                        // Évaluer les ifQuery des groupes (condition d'affichage en mode client)
                        await this.evaluateAllGroupIfQueries();

                        // Auto-exécution au chargement du notebook (page 0)
                        await this.runAllGroups();
                        if (this.pages[0]) this._pagesInitialized.add(this.pages[0]._id);
                        this.$nextTick(() => setTimeout(() => this.refreshMarkdownCellsForPage(0), 300));
                        // Rafraîchir le panneau Tables DuckDB après l'exécution initiale
                        await this.refreshDuckdbTables();
                        // Appel room.initialize() comme createRoomStore le fait dans le mosaic example
                        // → db.initialize() → refreshTableSchemas() → peuple db.schemaTrees pour SqlEditorModal
                        try {
                            await this.room.initialize();
                        } catch (err) {
                            console.warn('[sqljob] room.initialize() error:', err);
                        }
                        // db.schemaTrees peut rester vide si deepEquals([],[]) a bloqué la mise à jour initiale.
                        // Un second appel avec des tables créées par runAllGroups() force la synchronisation.
                        try {
                            await this.db.refreshTableSchemas();
                            console.log('[sqljob] schemaTrees:', this.db.schemaTrees);
                        } catch (err) {
                            console.warn('[sqljob] refreshTableSchemas error:', err);
                        }
                        // Signaler à RoomShell que l'init est terminée
                        this.room = { ...this.room, initialized: true };
                    } catch (error) {
                        this.setStatus('Erreur d\'initialisation: ' + error.message, 'error');
                    } finally {
                        // Remettre la page 1 ouverte une fois tout chargé
                        this.activePageIndex = 0;
                    }
                },

                async evaluateGroupIfQuery(group) {
                    const q = ConfigManager.getGroupIfQuery(group);
                    if (!group || !q) {
                
                        return true;
                    }

                    const sql = q.sql;
                    const langType = q.engine || 'sql';

                    try {
                        if (langType === 'js') {
                            const jsCode = this.parseQueryWithParameters(sql);
                            const result = safeEvalJs(jsCode);
                            const finalResult = result === true || (result !== null && result !== false && result !== undefined);
                            return finalResult;
                        } else {
                            const finalQuery = this.parseQueryWithParameters(sql);
                            const results = await DuckDBManager.executeQuery(finalQuery);

                            if (!results || results.length === 0) {
                                return false;
                            }

                            const firstVal = Object.values(results[0])[0];
                            const finalResult = firstVal === true || (firstVal !== null && firstVal !== false && firstVal !== undefined);
                            return finalResult;
                        }
                    } catch (err) {
                        console.error('  ❌ [evaluateGroupIfQuery] Erreur:', err);
                        return false;
                    }
                },

                // Évaluer toutes les requêtes conditionnelles des groupes (récursif) et mettre à jour _ifQueryResult
                async evaluateAllGroupIfQueries() {
                    const evaluateRecursive = async (groups, path = []) => {
                        for (let gi = 0; gi < (groups || []).length; gi++) {
                            const group = groups[gi];
                            const currentPath = [...path, gi];
                            const ifQuery = ConfigManager.getGroupIfQuery(group);
                            if (ifQuery) {
                                group._ifQueryResult = await this.evaluateGroupIfQuery(group);
                            } else {
                                group._ifQueryResult = true;
                            }
                            if (group.children?.length) {
                                await evaluateRecursive(group.children, currentPath);
                            }
                        }
                    };
                    for (const page of this.pages || []) {
                        await evaluateRecursive(page.groups || []);
                        await evaluateRecursive(page.linkGroups || []);
                    }
                },

                // ─────────────────────────────────────────────────────────────────
                // HELPERS
                // ─────────────────────────────────────────────────────────────────
                setStatus(message, type) {
                    // En clientMode, ne pas afficher les confirmations de succès (mais effacer le loading)
                    if (!this.devMode && type === 'success') {
                        this.status = '';
                        this.statusType = '';
                        return;
                    }
                    this.status = message;
                    this.statusType = type;
                    if (type !== 'loading') {
                        setTimeout(() => { this.status = ''; this.statusType = ''; }, 1000);
                    }
                },


                // Synchronise le contenu de la modal vers l'éditeur EasyMDE.
                // Ne rien faire quand engine sql/js : EasyMDE affiche _markdownContent (résultat d'exécution),
                // la modale édite queries.main.sql (la requête source) — ils ne doivent pas être liés.
                syncMarkdownToEditor(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || !cell._easyMDE) return;
                    const engine = ConfigManager.getCellEngine(cell, 'main');
                    if (engine === 'sql' || engine === 'js') return;
                    const currentValue = cell._easyMDE.value();
                    const targetContent = ConfigManager.getCellEditableContent(cell);
                    if (currentValue !== targetContent) {
                        cell._easyMDE.value(targetContent);
                    }
                },

                replaceSourceContext(query, context = {}) {
                    if (!query) return '';
                    let parsed = query;
                    if (context.name != null && context.name !== '') parsed = parsed.replace(/\{name\}/g, String(context.name));
                    if (context.fileNameUpload != null && context.fileNameUpload !== '') parsed = parsed.replace(/\{\{fileNameUpload\}\}/g, String(context.fileNameUpload));
                    if (context.fileName) parsed = parsed.replace(/\{\{fileName\}\}/g, context.fileName);
                    return parsed;
                },

                getCellIcon(type) {
                    const found = this.cellTypes.find(ct => ct.type === type);
                    return found ? found.icon : '<span class="iconify" data-icon="material-symbols-light:description" style="font-size:1rem"></span>';
                },

                generateCellId() {
                    return 'cell_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                },

                generateGroupId() {
                    return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                },

                generatePageId() {
                    return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                },

                // Vérifier si un nom de source/param existe déjà dans toutes les pages
                isNameUniqueAcrossPages(name, type, excludePageIndex = null, excludePath = null, excludeCellIndex = null) {
                    if (!name || !name.trim()) return true;

                    const trimmedName = name.trim();

                    // Types qui doivent être uniques globalement
                    if (type !== 'source' && type !== 'uiParameter') {
                        return true;
                    }

                    // Parcourir toutes les pages
                    for (let pi = 0; pi < this.pages.length; pi++) {
                        const page = this.pages[pi];

                        // Fonction récursive pour chercher dans les groupes
                        const checkInGroups = (groups, currentPath = []) => {
                            for (let gi = 0; gi < groups.length; gi++) {
                                const group = groups[gi];
                                const groupPath = [...currentPath, gi];

                                for (let ci = 0; ci < (group.cells || []).length; ci++) {
                                    const cell = group.cells[ci];

                                    // Vérifier si c'est la cellule à exclure
                                    if (excludePageIndex === pi &&
                                        excludePath &&
                                        JSON.stringify(excludePath) === JSON.stringify(groupPath) &&
                                        excludeCellIndex === ci) {
                                        continue;
                                    }

                                    // Vérifier le type et le nom
                                    if (cell.type === type && cell.name && cell.name.trim() === trimmedName) {
                                        return false;
                                    }
                                }

                                // Vérifier récursivement dans les enfants
                                if (group.children && group.children.length > 0) {
                                    if (!checkInGroups(group.children, groupPath)) {
                                        return false;
                                    }
                                }
                            }
                            return true;
                        };

                        // Vérifier dans les groupes de la page
                        if (!checkInGroups(page.groups)) {
                            return false;
                        }

                        // Vérifier dans les linkGroups de la page
                        if (page.linkGroups && !checkInGroups(page.linkGroups)) {
                            return false;
                        }
                    }

                    return true;
                },

                // Obtenir tous les noms de source/param existants
                getAllNamesOfType(type) {
                    const names = [];

                    if (type !== 'source' && type !== 'uiParameter') {
                        return names;
                    }

                    for (let pi = 0; pi < this.pages.length; pi++) {
                        const page = this.pages[pi];

                        const collectFromGroups = (groups) => {
                            for (const group of groups) {
                                for (const cell of (group.cells || [])) {
                                    if (cell.type === type && cell.name && cell.name.trim()) {
                                        names.push(cell.name.trim());
                                    }
                                }
                                if (group.children) {
                                    collectFromGroups(group.children);
                                }
                            }
                        };

                        collectFromGroups(page.groups);
                        if (page.linkGroups) {
                            collectFromGroups(page.linkGroups);
                        }
                    }

                    return names;
                },

                // Helper pour accéder à une cellule par ses indices
                getCell(groupIndex, cellIndex) {
                    return this.groups[groupIndex]?.cells[cellIndex];
                },

                // Télécharger le fichier source d'une cellule
                downloadSourceFile(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);

                    if (!cell || cell.type !== 'source') {
                        this.setStatus('Cellule source introuvable', 'error');
                        return;
                    }

                    if (!cell._currentFile || !cell._fileName) {
                        this.setStatus('Aucun fichier à télécharger', 'error');
                        return;
                    }

                    try {
                        // Télécharger le fichier
                        FileHandler.downloadFile(cell._currentFile, cell._fileName);
                        this.setStatus('Fichier téléchargé', 'success');
                    } catch (error) {
                        this.setStatus('Erreur lors du téléchargement: ' + error.message, 'error');
                    }
                },
    };
}
