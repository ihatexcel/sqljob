// @ts-nocheck

export function filesMixin() {
    return {
                async loadEmbeddedFiles() {
                    // Chercher toutes les balises script avec les fichiers embarqués
                    const sourceFileScripts = document.querySelectorAll('script[id^="sourceFile_"]');
                    const docxTemplateScripts = document.querySelectorAll('script[id^="docxTemplate_"]');

                    if (sourceFileScripts.length === 0 && docxTemplateScripts.length === 0) {
                        return; // Pas de fichiers embarqués, c'est normal
                    }

                    console.info('📂 ' + (sourceFileScripts.length + docxTemplateScripts.length) + ' fichier(s) embarqué(s) trouvé(s)');

                    // Helper pour trouver la source récursivement dans toutes les pages
                    const findSourceInAllPages = (sourceName) => {
                        for (let pi = 0; pi < this.pages.length; pi++) {
                            const page = this.pages[pi];
                            const found = findSourceRecursive(page.groups, sourceName, []);
                            if (found) {
                                return { ...found, pageIndex: pi };
                            }
                        }
                        return null;
                    };

                    const findSourceRecursive = (groups, sourceName, currentPath) => {
                        for (let gi = 0; gi < groups.length; gi++) {
                            const group = groups[gi];
                            const groupPath = [...currentPath, gi];

                            for (let ci = 0; ci < (group.cells || []).length; ci++) {
                                const cell = group.cells[ci];
                                if (cell.type === 'source' && cell.name === sourceName) {
                                    return { path: groupPath, cellIndex: ci, source: cell };
                                }
                            }

                            if (group.children && group.children.length > 0) {
                                const found = findSourceRecursive(group.children, sourceName, groupPath);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    // Helper pour trouver une cellule publipostageWord par chemin
                    const findCellByPath = (groups, targetPath) => {
                        try {
                            let current = groups;
                            let group = null;

                            // Naviguer jusqu'au groupe contenant la cellule
                            for (let i = 0; i < targetPath.length - 1; i++) {
                                const index = targetPath[i];
                                if (index === -1) {
                                    // LinkGroups
                                    current = this.linkGroups;
                                    continue;
                                }

                                if (!current[index]) return null;

                                if (i === 0) {
                                    group = current[index];
                                    current = group.children || [];
                                } else {
                                    group = current[index];
                                    current = group.children || [];
                                }
                            }

                            // Récupérer la cellule
                            const cellIndex = targetPath[targetPath.length - 1];
                            const finalGroup = targetPath.length === 1 ? current[targetPath[0]] : group;

                            if (!finalGroup || !finalGroup.cells || !finalGroup.cells[cellIndex]) {
                                return null;
                            }

                            return {
                                cell: finalGroup.cells[cellIndex],
                                cellIndex: cellIndex
                            };
                        } catch (e) {
                            console.error('Error finding cell by path:', e);
                            return null;
                        }
                    };

                    // Charger les fichiers source
                    for (const script of sourceFileScripts) {
                        const sourceName = script.dataset.sourceName;
                        const fileName = script.dataset.fileName;
                        const base64 = script.textContent.trim();

                        if (!sourceName || !fileName || !base64) {
                            console.warn('Script source incomplet:', script.id);
                            continue;
                        }

                        const found = findSourceInAllPages(sourceName);

                        if (!found) {
                            console.warn(`Source "${sourceName}" non trouvée dans les cellules`);
                            continue;
                        }

                        // Basculer temporairement vers la page contenant la source
                        const originalPageIndex = this.activePageIndex;
                        this.activePageIndex = found.pageIndex;

                        try {
                            this.setStatus(`Chargement de ${sourceName}...`, 'loading');

                            // Décoder et décompresser
                            const bytes = FileHandler.base64ToUint8Array(base64);
                            const decompressedBuffer = await FileHandler.decompressGzip(bytes);

                            // Créer un File object
                            const blob = new Blob([decompressedBuffer]);
                            const file = new File([blob], fileName, {
                                type: FileHandler.getMimeTypeFromFileName(fileName)
                            });

                            // Charger le fichier dans la source (pas de runCellsAfter : runAllGroups le fera)
                            await this.loadSingleSourceFile(file, found.path, found.cellIndex, { skipRunNextCells: true });

                        } catch (error) {
                            console.error(`Erreur chargement fichier embarqué ${sourceName}:`, error);
                            this.setStatus(`Erreur: ${error.message}`, 'error');
                        } finally {
                            // Restaurer la page originale
                            this.activePageIndex = originalPageIndex;
                        }
                    }

                    // Charger les templates docx pour publipostageWord
                    for (const script of docxTemplateScripts) {
                        const cellPath = script.dataset.cellPath;
                        const fileName = script.dataset.fileName;
                        let base64 = script.textContent.trim();

                        if (!cellPath || !fileName || !base64) {
                            console.warn('Script docx template incomplet:', script.id);
                            continue;
                        }

                        if (script.dataset.compressed === 'true') {
                            try {
                                const bytes = FileHandler.base64ToUint8Array(base64);
                                const decompressed = await FileHandler.decompressGzip(bytes);
                                base64 = FileHandler.arrayBufferToBase64(decompressed);
                            } catch (e) {
                                console.error('Décompression template docx échouée:', e);
                                continue;
                            }
                        }

                        // Convertir le cellPath en array d'indices
                        const pathArray = cellPath.split('_').map(n => parseInt(n, 10));
                        const found = findCellByPath(this.groups, pathArray);

                        if (!found) {
                            console.warn(`Cellule publipostageWord au chemin "${cellPath}" non trouvée`);
                            continue;
                        }

                        if (found.cell.type !== 'publipostageWord') {
                            console.warn(`La cellule au chemin "${cellPath}" n'est pas de type publipostageWord`);
                            continue;
                        }

                        try {
                            // Charger dans la cellule (structure unifiée files[])
                            ConfigManager.setCellFileData(found.cell, { base64, fileName });

                        } catch (error) {
                            console.error(`Erreur chargement template docx ${cellPath}:`, error);
                        }
                    }

                    this.setStatus('Fichiers embarqués chargés', 'success');
                },

                handleSingleSourceDrop(e, path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'source') return;
                    cell._isDragging = false;
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.loadSingleSourceFile(files[0], path, cellIndex);
                    }
                },

                handleSingleSourceFileSelect(e, path, cellIndex) {
                    const files = e.target.files;
                    if (files.length > 0) {
                        this.loadSingleSourceFile(files[0], path, cellIndex);
                    }
                },

                async loadSingleSourceFile(file, path, cellIndex, options = {}) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'source') return;

                    const skipRunNextCells = options.skipRunNextCells === true;
                    cell._fileName = file.name;
                    cell._currentFile = file;
                    this.isLoading = true;
                    cell._status = 'running';
                    this.setStatus(`Chargement de ${cell.name}...`, 'loading');

                    try {
                        const tableName = cell.name || 'source1';
                        let loadQuery;
                        let executed = false;
                        let fileName = file.name;

                        // Déterminer l'extension logique (gère .csv.gz, .tsv.gz, .txt.gz)
                        const getLogicalExt = (name) => {
                            const lower = name.toLowerCase();
                            if (lower.endsWith('.csv.gz')) return 'csv.gz';
                            if (lower.endsWith('.tsv.gz')) return 'tsv.gz';
                            if (lower.endsWith('.txt.gz')) return 'txt.gz';
                            return lower.split('.').pop();
                        };
                        const logicalExt = getLogicalExt(fileName);

                        // .xls : DuckDB ne supporte pas le format binaire. Conversion obligatoire via SheetJS + config json.xlsx
                        if (logicalExt === 'xls') {
                            this.setStatus(`Conversion Excel (.xls) via SheetJS...`, 'loading');
                            const xlsxConf = cell.json?.xlsx || {};
                            const { csv, csvFileName } = await FileHandler.processExcelFile(
                                file,
                                xlsxConf.options,
                                xlsxConf.toCsvOptions,
                                xlsxConf.sheetSelection
                            );
                            const csvBlob = new Blob([csv], { type: 'text/csv' });
                            await DuckDBManager.registerFile(csvFileName, csvBlob);
                            fileName = csvFileName;
                            loadQuery = `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM read_csv('${fileName}', HEADER = true, AUTO_DETECT = true, SAMPLE_SIZE = -1)`;
                        } else {
                            await DuckDBManager.registerFile(file.name, file);
                            // Tous les autres formats : requête main (par nom) ou queries[0] en fallback
                            const queryTemplate = (ConfigManager.getCellQuery(cell, 'main') || cell.queries?.[0]?.sql || '').trim();
                            if (queryTemplate) {
                                const ctx = { name: tableName, fileNameUpload: fileName, fileName };
                                const replacedSql = this.replaceSourceContext(queryTemplate, ctx);
                                const cellLike = { queries: [{ name: 'main', sql: replacedSql, engine: 'sql', clientVisible: false }], _parseLevels: [] };
                                loadQuery = await this.parseQueryRecursively(cellLike);
                                cell._parseLevels = cellLike._parseLevels || [];
                            } else {
                                loadQuery = `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM '${fileName}'`;
                            }
                        }

                        // Exécuter la requête principale
                        try {
                            await DuckDBManager.executeQuery(loadQuery);
                            executed = true;
                        } catch (primaryError) {
                            // 1. Essayer fallback (par nom) ou queries[1] en fallback
                            const query1Template = (ConfigManager.getCellQuery(cell, 'fallback') || cell.queries?.[1]?.sql || '').trim();
                            if (query1Template) {
                                this.setStatus(`Requête initiale échouée, tentative fallback...`, 'loading');
                                const ctx1 = { name: tableName, fileNameUpload: fileName, fileName };
                                const cellLike1 = { type: 'source', queries: [{ name: 'main', sql: '' }, { name: 'fallback', sql: this.replaceSourceContext(query1Template, ctx1), engine: 'sql', clientVisible: false }], _parseLevels: [] };
                                try {
                                    const fallbackQuery1 = await this.parseQueryRecursively(cellLike1, 1);
                                    await DuckDBManager.executeQuery(fallbackQuery1);
                                    executed = true;
                                    loadQuery = fallbackQuery1;
                                    cell._parseLevels = cellLike1._parseLevels || [];
                                    this.setStatus(`${cell.name} chargé via requête de fallback`, 'success');
                                } catch (query1Error) {
                                    // queries[1] a aussi échoué
                                }
                            }
                            if (!executed) throw primaryError;
                        }
                        cell._loaded = true;
                        cell._status = 'success';
                        cell._pendingFileLoad = false;
                        if (!cell._parseLevels?.length) cell._parseLevels = [{ level: 'final', innerQuery: loadQuery, replacement: null }]; // xls ou requête directe sans template
                        this.setStatus(`${cell.name} chargé!`, 'success');
                        // Référencer le fichier dans _roomFiles pour l'affichage dans DataSourcesPanel
                        const existing = this._roomFiles ?? [];
                        if (!existing.some((f) => f.tableName === tableName)) {
                            this._roomFiles = [...existing, {
                                name: file.name,
                                tableName,
                                size: file.size ?? 0,
                                source: 'source-cell',
                            }];
                        }
                        await this.refreshDuckdbTables();

                        // Exécuter les cellules suivantes (sauf pendant l'init : runAllGroups s'en charge)
                        if (!skipRunNextCells) {
                            const result = await this.runCellsAfterWithStopConditions(path, cellIndex, cell._id);
                            if (!result.stopped) {
                                this.setStatus('Exécution terminée', 'success');
                            }
                        }
                    } catch (error) {
                        cell._status = 'error';
                        this.setStatus('Erreur: ' + error.message, 'error');
                        cell._fileName = '';
                        cell._currentFile = null;
                        if (Array.isArray(cell.files)) cell.files = cell.files.filter(f => f.slot !== 'source');
                        delete cell.fileBase64;
                        delete cell.fileName;
                    } finally {
                        this.isLoading = false;
                    }
                },

                async executeSourceCell(cell, path, cellIndex) {
                    if (cell._currentFile) {
                        await this.loadSingleSourceFile(cell._currentFile, path, cellIndex);
                    } else if (cell._fileName) {
                        const fileEntry = Array.isArray(cell.files) ? cell.files.find(f => f.slot === 'source') : null;
                        const base64 = fileEntry?.base64 || cell.fileBase64;
                        if (base64) {
                            const bytes = FileHandler.base64ToUint8Array(base64);
                            const blob = new Blob([bytes]);
                            const file = new File([blob], cell._fileName, { type: FileHandler.getMimeTypeFromFileName(cell._fileName) });
                            await this.loadSingleSourceFile(file, path, cellIndex);
                        } else {
                            throw new Error('Fichier source non disponible, veuillez le recharger');
                        }
                    }
                },

                async removeSingleSourceFile(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'source') return;

                    // Supprimer le fichier de DuckDB si enregistré
                    if (cell._fileName && DuckDBManager.dbInstance) {
                        try {
                            // Essayer de supprimer le fichier de DuckDB (si l'API le permet)
                            // Note: DuckDB ne permet pas toujours de supprimer directement, mais on peut essayer
                            await DuckDBManager.executeQuery(`DROP TABLE IF EXISTS "${cell.name}"`);
                        } catch (error) {
                            // Ignorer les erreurs de suppression (le fichier peut ne pas exister)
                        }
                    }

                    // Supprimer les scripts existants dans le DOM pour cette source
                    const safeSourceName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_');
                    document.querySelectorAll(`script[id^="sourceFile_${safeSourceName}"]`).forEach(s => s.remove());

                    // Réinitialiser l'élément input file pour permettre le rechargement du même fichier
                    const fileInput = document.getElementById('fileInput_' + cell._id);
                    if (fileInput) {
                        fileInput.value = '';
                    }

                    // Réinitialiser les propriétés de la cellule (structure unifiée + runtime)
                    cell._fileName = '';
                    cell._currentFile = null;
                    cell._loaded = false;
                    cell._status = null;
                    cell._parseLevels = [];
                    if (Array.isArray(cell.files)) cell.files = cell.files.filter(f => f.slot !== 'source');
                    // Supprimer aussi le base64/temporaire pour que l'export config JSON/gist ne l'inclue pas
                    delete cell.fileBase64;
                    delete cell.fileName;

                    this.setStatus(`Fichier supprimé de ${cell.name}`, 'success');
                    this.forceUpdate();
                },

                /** Valide le nom d'une cellule (unicité globale, format SQL pour source). */
                validateCellName(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    let currentName = cell.name != null ? String(cell.name).trim() : '';
                    if (!currentName) {
                        this.setStatus('Le nom ne peut pas être vide', 'error');
                        cell.name = this.generateUniqueCellName(cell.type, cell._id);
                        return;
                    }

                    if (!ConfigManager.isCellNameValid(cell, currentName)) {
                        this.setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error');
                        cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
                        return;
                    }

                    if (this.isCellNameUsed(currentName, cell._id)) {
                        this.setStatus(`Le nom "${currentName}" est déjà utilisé par une autre cellule`, 'error');
                        cell.name = this.generateUniqueCellName(cell.type, cell._id);
                    }
                },

                // ─────────────────────────────────────────────────────────────────
                // GESTION DU TEMPLATE DOCX (publipostageWord)
                // ─────────────────────────────────────────────────────────────────
                handleDocxTemplateDrop(e, path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'publipostageWord') return;

                    cell._isDragging = false;
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.loadDocxTemplate(files[0], path, cellIndex);
                    }
                },

                handleDocxTemplateFileSelect(e, path, cellIndex) {
                    const files = e.target.files;
                    if (files.length > 0) {
                        this.loadDocxTemplate(files[0], path, cellIndex);
                    }
                },

                async loadDocxTemplate(file, path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'publipostageWord') return;

                    if (!file.name.endsWith('.docx')) {
                        this.setStatus('Seuls les fichiers .docx sont acceptés', 'error');
                        return;
                    }

                    try {
                        this.setStatus('Chargement du template Word...', 'loading');

                        // Lire le fichier en ArrayBuffer
                        const arrayBuffer = await file.arrayBuffer();

                        // Encoder en base64
                        const base64 = FileHandler.arrayBufferToBase64(arrayBuffer);

                        // Stocker dans la cellule (structure unifiée files[] + legacy)
                        cell.docxTemplateBase64 = base64;
                        cell.docxTemplateFileName = file.name;
                        ConfigManager.setCellFileData(cell, { base64, fileName: file.name });

                        this.setStatus('Template Word chargé', 'success');
                    } catch (error) {
                        this.setStatus('Erreur lors du chargement du template: ' + error.message, 'error');
                    }
                },

                downloadDocxTemplate(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'publipostageWord') return;

                    if (!cell.docxTemplateBase64 || !cell.docxTemplateFileName) {
                        this.setStatus('Aucun template à télécharger', 'error');
                        return;
                    }

                    try {
                        // Décoder le base64 en Uint8Array
                        const uint8Array = FileHandler.base64ToUint8Array(cell.docxTemplateBase64);

                        // Créer un blob
                        const blob = new Blob([uint8Array], {
                            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        });

                        // Télécharger le fichier
                        FileHandler.downloadFile(blob, cell.docxTemplateFileName);

                        this.setStatus('Template Word téléchargé', 'success');
                    } catch (error) {
                        this.setStatus('Erreur lors du téléchargement: ' + error.message, 'error');
                    }
                },

                removeDocxTemplate(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'publipostageWord') return;

                    // Réinitialiser l'élément input file
                    const fileInput = document.getElementById('docxInput_' + cell._id);
                    if (fileInput) {
                        fileInput.value = '';
                    }

                    // Supprimer les données du template (structure unifiée + legacy)
                    cell.docxTemplateBase64 = null;
                    cell.docxTemplateFileName = '';
                    if (Array.isArray(cell.files)) cell.files = cell.files.filter(f => f.slot !== 'docxTemplate');
                    // Supprimer aussi fileBase64/fileName pour que l'export JSON/gist ne l'inclue pas
                    delete cell.fileBase64;
                    delete cell.fileName;

                    this.setStatus('Template Word supprimé', 'success');
                },

                async loadPendingSourceFiles() {
                    const loadFromGroup = async (group, path) => {
                        for (let ci = 0; ci < (group.cells || []).length; ci++) {
                            const cell = group.cells[ci];
                            if (cell.type === 'source' && cell._pendingFileLoad && cell._currentFile) {
                                try {
                                    this.setStatus(`Chargement de ${cell.name}...`, 'loading');
                                    await this.loadSingleSourceFile(cell._currentFile, path, ci, { skipRunNextCells: true });
                                    cell._pendingFileLoad = false;
                                } catch (error) {
                                    console.error(`Erreur chargement fichier source ${cell.name}:`, error);
                                }
                            }
                        }
                        if (group.children) {
                            for (let gi = 0; gi < group.children.length; gi++) {
                                await loadFromGroup(group.children[gi], [...path, gi]);
                            }
                        }
                    };

                    // Charger les fichiers de toutes les pages (basculer sur chaque page car getCellAtPath utilise this.groups = activePage.groups)
                    const originalPageIndex = this.activePageIndex;
                    try {
                        for (let pi = 0; pi < this.pages.length; pi++) {
                            this.activePageIndex = pi;
                            const page = this.pages[pi];
                            for (let gi = 0; gi < page.groups.length; gi++) {
                                await loadFromGroup(page.groups[gi], [gi]);
                            }
                        }
                    } finally {
                        this.activePageIndex = originalPageIndex;
                    }
                },
    };
}
