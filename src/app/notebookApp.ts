// @ts-nocheck

export function notebookApp() {
            // Utiliser la config chargée depuis le Gist si disponible, sinon la config par défaut
            const config = window._loadedConfig || ConfigManager.getDefaultConfig();

            const initCell = (cell, cellIndex) => initializeCell(cell, cellIndex);

            // Fonction récursive pour initialiser un groupe et ses enfants
            const initGroup = (group, groupIndex) => {
                const ng = ConfigManager.normalizeGroup({ ...group });
                const newGroup = {
                    _id: ng.id || ConfigManager.generateGroupId(),
                    _type: ng.type || 'core',
                    direction: ng.direction || 'row',
                    style: ng.style || '',
                    _order: ConfigManager.normalizeOrder(ng.order, groupIndex),
                    cells: (ng.cells || []).map((cell, cellIndex) => initCell(ConfigManager.normalizeCell({ ...cell }), cellIndex)),
                    // Config de loop
                    loop: ng.loop ? {
                        enabled: ng.loop.enabled || false,
                        query: ng.loop.query || '',
                        zip: ng.loop.zip || false,
                        zipQuery: ng.loop.zipQuery || ''
                    } : { enabled: false, query: '', zip: false, zipQuery: '' },
                    // Config accordion
                    accordion: ng.accordion || false,
                    title: ng.title || '',
                    accordionOpen: ng.accordionOpen !== false // true par défaut
                };

                // Ajouter tabsChild et name
                newGroup.tabsChild = ng.tabsChild || false;
                newGroup.name = ng.name || '';

                if (Array.isArray(ng.queries) && ng.queries.length > 0) {
                    newGroup.queries = ng.queries.map((q, i) => ({
                        name: q.name || 'main',
                        sql: q.sql || '',
                        engine: q.engine || 'sql',
                        clientVisible: q.clientVisible === true
                    }));
                } else {
                    newGroup.queries = [];
                }

                if (ng.children && ng.children.length > 0) {
                    newGroup.children = ng.children.map((child, childIndex) => {
                        const initializedChild = initGroup(child, childIndex);
                        initializedChild._order = ConfigManager.normalizeOrder(child.order, childIndex);
                        return initializedChild;
                    });
                }

                return newGroup;
            };

            // Initialiser les pages depuis la config
            let initPages = [];

            initPages = (config.job?.pages || []).map((page, pageIndex) => {
                    const allGroups = (page.groups || []).map((group, groupIndex) => initGroup(group, groupIndex));
                    const initGroups = allGroups.filter(g => g._type === 'core');
                    const initLinkGroups = allGroups.filter(g => g._type === 'link');

                    return {
                        _id: page.id || ConfigManager.generatePageId(),
                        name: page.name || `Feuille ${pageIndex + 1}`,
                        groups: initGroups,
                        linkGroups: initLinkGroups
                    };
                });

            // Si aucune page n'existe, créer une page par défaut
            if (initPages.length === 0) {
                initPages = [{
                    _id: ConfigManager.generatePageId(),
                    name: 'Feuille 1',
                    groups: [],
                    linkGroups: []
                }];
            }

            // Mode développeur (true = affichage complet, false = mode utilisateur simplifié)
            const devMode = config.ui?.devMode !== false;

            // Affichage du layout (navbar et boutons bottom-left) - rétrocompat: displaySettings
            const showLayout = (config.ui?.showLayout ?? config.ui?.displaySettings) !== false;

            // Liste des thèmes daisyUI disponibles
            const availableThemes = [
                'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
                'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween',
                'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
                'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn',
                'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
                'dim', 'nord', 'sunset'
            ];

            // Gestion du thème (priorité: config > localStorage > light)
            const savedTheme = localStorage.getItem('sqljob-theme');
            const configTheme = config.ui?.theme;
            const currentTheme = configTheme || savedTheme || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);

            // Moteur DB (priorité: config > localStorage > duckdb-wasm)
            const savedDbEngine = localStorage.getItem('sqljob-dbEngine');
            const configDbEngine = config.ui?.dbEngine;
            const initialDbEngine = configDbEngine || savedDbEngine || 'duckdb-wasm';
            DuckDBManager.setEngine(initialDbEngine);

            // DAG (Directed Acyclic Graph) - rafraîchissement automatique des cellules dépendantes
            const initialDirectedAcyclicGraph = config.ui?.directedAcyclicGraph === true;

            return {
                pages: initPages,
                activePageIndex: 0,
                isLoading: false,
                status: '',
                statusType: '',
                devMode: devMode,
                showLayout: showLayout,
                availableThemes: availableThemes,
                currentTheme: currentTheme,
                dbEngine: initialDbEngine,
                showDbEngineModal: false,
                directedAcyclicGraph: initialDirectedAcyclicGraph,

                // GitHub Gist - variables d'état
                githubToken: '',
                gistShareUrl: '',
                showGistModal: false,
                gistWasEncrypted: false,
                gistPassphraseToShare: '',
                showGistTokenModal: false,
                showJsonPassphraseModal: false,
                jsonPassphrase: '',
                jsonPassphraseError: '',
                jsonPassphraseLoading: false,
                _pendingEncryptedJson: null,

                // Export unifié - variables d'état
                exportModal: {
                    show: false,
                    type: '', // 'gist', 'json', 'base64', 'html', 'html-client'
                    fileName: 'notebook-config.json',
                    description: 'sqljob Notebook Configuration',
                    devMode: null, // null = utiliser la valeur actuelle
                    showLayout: null, // null = utiliser la valeur actuelle
                    encryptGist: false,
                    gistPassphrase: ''
                },

                // DAG debounce timer
                _dagDebounceTimer: null,
                _dagDebounceDelay: 200, // 500ms de délai avant rafraîchissement
                _pagesInitialized: new Set(), // Pages dont les cellules ont déjà été exécutées (par _id)

                // Getters pour la page active
                get activePage() {
                    return this.pages[this.activePageIndex] || this.pages[0];
                },
                get groups() {
                    return this.activePage?.groups || [];
                },
                get linkGroups() {
                    return this.activePage?.linkGroups || [];
                },

                // Gestion des pages
                addPage() {
                    const newPage = {
                        _id: ConfigManager.generatePageId(),
                        name: `Feuille ${this.pages.length + 1}`,
                        groups: [],
                        linkGroups: []
                    };
                    this.pages.push(newPage);
                    this.activePageIndex = this.pages.length - 1;
                },

                deletePage(index) {
                    if (this.pages.length <= 1) {
                        this.setStatus('Impossible de supprimer la dernière page', 'error');
                        return;
                    }
                    if (confirm(`Supprimer la page "${this.pages[index].name}" ?`)) {
                        this.pages.splice(index, 1);
                        if (this.activePageIndex >= this.pages.length) {
                            this.activePageIndex = this.pages.length - 1;
                        }
                    }
                },

                // Drag & drop pour réorganiser les pages
                draggedPageIndex: null,
                dragOverPageIndex: null,

                startPageDrag(index, event) {
                    if (!this.devMode) return;
                    this.draggedPageIndex = index;
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', index);
                },

                onPageDragOver(index, event) {
                    if (this.draggedPageIndex === null || this.draggedPageIndex === index) return;
                    event.preventDefault();
                    this.dragOverPageIndex = index;
                },

                onPageDragLeave() {
                    this.dragOverPageIndex = null;
                },

                onPageDrop(targetIndex, event) {
                    event.preventDefault();
                    if (this.draggedPageIndex === null || this.draggedPageIndex === targetIndex) {
                        this.draggedPageIndex = null;
                        this.dragOverPageIndex = null;
                        return;
                    }
                    const [movedPage] = this.pages.splice(this.draggedPageIndex, 1);
                    this.pages.splice(targetIndex, 0, movedPage);
                    // Ajuster l'index actif si nécessaire
                    if (this.activePageIndex === this.draggedPageIndex) {
                        this.activePageIndex = targetIndex;
                    } else if (this.draggedPageIndex < this.activePageIndex && targetIndex >= this.activePageIndex) {
                        this.activePageIndex--;
                    } else if (this.draggedPageIndex > this.activePageIndex && targetIndex <= this.activePageIndex) {
                        this.activePageIndex++;
                    }
                    this.draggedPageIndex = null;
                    this.dragOverPageIndex = null;
                    this.saveToLocalStorage();
                },

                endPageDrag() {
                    this.draggedPageIndex = null;
                    this.dragOverPageIndex = null;
                },

                switchPage(index) {
                    if (index >= 0 && index < this.pages.length) {
                        this.activePageIndex = index;
                    }
                },

                // Active une page et exécute ses cellules à la première ouverture (stop si source vide, bouton, etc.)
                async activatePage(index) {
                    if (index < 0 || index >= this.pages.length) return;
                    const page = this.pages[index];
                    this.activePageIndex = index;
                    if (!this._pagesInitialized.has(page._id)) {
                        this._pagesInitialized.add(page._id);
                        await this.runAllGroups();
                    }
                    this.$nextTick(() => setTimeout(() => this.refreshMarkdownCellsForPage(index), 50));
                },

                // Rafraîchit les hauteurs des cellules markdown en mode client (EasyMDE _easyMDEcli uniquement)
                // Pas _easyMDE (dev) : cm.refresh() casse l'édition
                refreshMarkdownCellsForPage(pageIndex) {
                    const page = this.pages[pageIndex];
                    if (!page) return;
                    const refreshCells = (groups) => {
                        (groups || []).forEach(group => {
                            (group.cells || []).forEach(cell => {
                                if (cell.type === 'markdown') {
                                    const inst = cell._easyMDEcli;
                                    const cm = inst?.codemirror || inst?.cm;
                                    if (cm?.refresh) cm.refresh();
                                }
                            });
                            if (group.children) refreshCells(group.children);
                        });
                    };
                    refreshCells(page.groups || []);
                    refreshCells(page.linkGroups || []);
                },

                // Détermine si une cellule doit être affichée (fix pour les cases vides en mode view)
                shouldShowCell(cell) {
                    if (this.devMode) return true;

                    // Si clientVisible est activé pour les cellules SQL, forcer l'affichage
                    if (ConfigManager.getCellQueryClientVisible(cell, 0)) {
                        return true;
                    }

                    // Bouton : affiché uniquement si buttonLabel est non vide (refacto.md)
                    if (cell.type === 'buttonRunNextCells') return !!cell.buttonLabel;
                    // SQL : caché car pas d'output visuel utile en mode view
                    if (cell.type === 'sqlRecursiveParse') return false;
                    // Table, Iframe, SqlStat : cachés sauf si résultat ou en cours d'exécution
                    if (['table', 'iframe', 'sqlStat'].includes(cell.type)) {
                        return cell._status === 'success' || cell._status === 'running' || (cell._results && cell._results.length > 0);
                    }
                    return true;
                },

                // Détermine si un groupe doit être affiché (récursif)
                shouldShowGroup(group) {
                    if (this.devMode) return true;

                    // Si queries[0] (condition d'affichage) est défini, _ifQueryResult doit être true pour afficher
                    if (ConfigManager.getGroupIfQuery(group)) {
                        if (group._ifQueryResult === false || group._ifQueryResult === null) {
                            return false;
                        }
                        if (group._ifQueryResult !== true) {
                            return false; // pas encore évalué ou erreur
                        }
                    }

                    // Vérifier si une des cellules du groupe est visible
                    if (group.cells && group.cells.some(cell => this.shouldShowCell(cell))) {
                        return true;
                    }

                    // Vérifier si un des enfants est visible
                    if (group.children && group.children.some(child => this.shouldShowGroup(child))) {
                        return true;
                    }

                    // Si rien n'est visible, on cache le groupe
                    return false;
                },

                // Modals & Dropdowns
                showAddGroupModal: false,
                addCellToGroupModal: { open: false, path: null },
                insertGroupModal: { open: false, atIndex: null },
                insertCellModal: { open: false, groupIndex: null, atCellIndex: null },
                cellConfigModal: { open: false, path: null, cellIndex: null },
                childGroupModal: { open: false, path: null, cellIndex: null, group: null },
                loopConfigModal: { open: false, path: null },
                groupSettingsModal: { open: false, path: null },
                exportDropdownOpen: false,

                // Variable $loop courante (utilisée pendant l'exécution d'un groupe en boucle)
                _currentLoopValue: null,

                // Fichiers collectés pendant une loop avec zip activé
                _zipFiles: [],
                _zipMode: false,

                // Drag & Drop state (unifié avec path)
                draggedCellPath: null, // { path: [], cellIndex }
                dragOverCellPath: null, // { path: [], cellIndex, position: 'left'|'right' }
                dragOverGroup: null, // { groupIndex, position: 'top'|'bottom' }
                draggedChildPath: null, // { parentPath: [], childIndex }
                dragOverChildPath: null, // { parentPath: [], childIndex, position: 'left'|'right' }
                draggedTopGroup: null, // groupIndex du groupe niveau 0 en cours de drag

                // Types de cellules disponibles
                cellTypes: [
                    { type: 'markdown', label: 'Markdown', icon: '📝' },
                    { type: 'source', label: 'Source', icon: '📄' },
                    { type: 'uiParameter', label: 'Paramètre UI', icon: '🎛️' },
                    { type: 'buttonRunNextCells', label: 'Bouton Exécuter', icon: '🚀' },
                    { type: 'sqlRecursiveParse', label: 'SQL', icon: '🗄️' },
                    { type: 'table', label: 'Tableau', icon: '📊' },
                    { type: 'iframe', label: 'HTML/Iframe', icon: '🖼️' },
                    { type: 'sqlStat', label: 'Stat SQL', icon: '📊' },
                    { type: 'publipostageWord', label: 'Publipostage Word', icon: '📄' },
                    { type: 'pdfme', label: 'PDF (pdfme)', icon: '📑' },
                    { type: 'perspective', label: 'Perspective Viewer', icon: '🔍' }
                ],

                // Tables simple-datatables par cellule
                _tables: {},

                // ─────────────────────────────────────────────────────────────────
                // GESTION DU MOTEUR DB
                // ─────────────────────────────────────────────────────────────────
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
                    } catch (error) {
                        this.setStatus('Erreur d\'initialisation: ' + error.message, 'error');
                    } finally {
                        // Remettre la page 1 ouverte une fois tout chargé
                        this.activePageIndex = 0;
                    }
                },

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

                // Évaluer la requête conditionnelle du groupe (queries.main, retourne true/false/null)
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
                            const result = eval(jsCode);
                            const finalResult = result === true || (result !== null && result !== false && result !== undefined);
                            return finalResult;
                        } else {
                            // parseQueryRecursively attend une cellule avec queries.main (getCellQuery)
                            const cellLike = { queries: [{ name: 'main', sql, engine: langType, clientVisible: false }], _parseLevels: [] };
                            const finalQuery = await this.parseQueryRecursively(cellLike);
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

                // Toggle entre mode édition et vue parsée pour les cellules SQL
                toggleSqlView(cell) {
                    cell._showParsedQuery = !cell._showParsedQuery;
                },

                // Obtenir la requête SQL parsée (avec les paramètres remplacés)
                // Gère les deux types de parsing : {variable} et $parametre
                // Pour source : {name} = nom de la table, {fileNameUpload} = fichier déposé (variable interne à la cellule)
                getParsedSqlQuery(query, context = {}) {
                    if (!query) return '';
                    let parsed = query;

                    // 1. Parser les variables {xxx} avec le contexte fourni
                    if (context.name != null && context.name !== '') {
                        parsed = parsed.replace(/\{name\}/g, String(context.name));
                    }
                    if (context.fileNameUpload != null && context.fileNameUpload !== '') {
                        parsed = parsed.replace(/\{fileNameUpload\}/g, String(context.fileNameUpload));
                    }
                    if (context.fileName) {
                        parsed = parsed.replace(/\{fileName\}/g, context.fileName);
                    }

                    // 2. Parser les paramètres $xxx
                    parsed = this.parseQueryWithParameters(parsed);

                    return parsed;
                },

                /** Remplace uniquement {name}, {fileNameUpload}, {fileName} (sans $param ni {{}}). Pour passer à parseQueryRecursively. */
                replaceSourceContext(query, context = {}) {
                    if (!query) return '';
                    let parsed = query;
                    if (context.name != null && context.name !== '') parsed = parsed.replace(/\{name\}/g, String(context.name));
                    if (context.fileNameUpload != null && context.fileNameUpload !== '') parsed = parsed.replace(/\{fileNameUpload\}/g, String(context.fileNameUpload));
                    if (context.fileName) parsed = parsed.replace(/\{fileName\}/g, context.fileName);
                    return parsed;
                },

                getCellIcon(type) {
                    const found = this.cellTypes.find(ct => ct.type === type);
                    return found ? found.icon : '📄';
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

                // ─────────────────────────────────────────────────────────────────
                // GESTION DES GROUPES (structure plate avec chemins)
                // ─────────────────────────────────────────────────────────────────

                // Retourne uniquement les groupes de niveau 0 (les sous-groupes sont rendus dans le template)
                getFlattenedGroups() {
                    const result = [];
                    if (!this.groups) return result;

                    for (let i = 0; i < this.groups.length; i++) {
                        const group = this.groups[i];
                        result.push({
                            group,
                            path: [i],
                            depth: 0,
                            pathKey: String(i),
                            isFirst: i === 0,
                            isLast: i === this.groups.length - 1,
                            siblingCount: this.groups.length
                        });
                    }
                    return result;
                },

                // Retourne tous les groupes de toutes les pages (pour conservation du DOM au changement de page)
                getFlattenedGroupsForAllPages() {
                    const result = [];
                    for (let pi = 0; pi < (this.pages || []).length; pi++) {
                        const page = this.pages[pi];
                        const groups = page?.groups || [];
                        for (let i = 0; i < groups.length; i++) {
                            const group = groups[i];
                            result.push({
                                pageIndex: pi,
                                pageId: page._id,
                                uniqueKey: page._id + '_' + i,
                                group,
                                path: [i],
                                depth: 0,
                                pathKey: String(i),
                                isFirst: i === 0,
                                isLast: i === groups.length - 1,
                                siblingCount: groups.length
                            });
                        }
                    }
                    return result;
                },

                // Retourne les items (cellules + sous-groupes) d'un groupe, combinés dans l'ordre
                // Chaque item a un type ('cell' ou 'group'), un index local et les données
                getGroupItems(group) {
                    const items = [];
                    const cells = group.cells || [];
                    const children = group.children || [];

                    // Ajouter les cellules
                    cells.forEach((cell, idx) => {
                        items.push({
                            type: 'cell',
                            data: cell,
                            cellIndex: idx,
                            itemKey: 'cell-' + cell._id
                        });
                    });

                    // Ajouter les sous-groupes
                    children.forEach((child, idx) => {
                        items.push({
                            type: 'group',
                            data: child,
                            childIndex: idx,
                            itemKey: 'group-' + (child._id || idx)
                        });
                    });

                    return items;
                },

                // Récupérer un groupe par son chemin [index1, index2, ...]
                getGroupAtPath(path) {
                    if (!path || path.length === 0) return null;

                    // Handle modal context ([-1] refers to childGroupModal.group)
                    if (path.length >= 1 && path[0] === -1) {
                        if (path.length === 1) {
                            // Simple case: [-1] = modal group itself
                            return this.childGroupModal.group;
                        } else {
                            // Nested case: [-1, 0] = first child of modal group, [-1, 0, 1] = second child of that, etc.
                            let current = this.childGroupModal.group;
                            for (let i = 1; i < path.length; i++) {
                                if (!current || !current.children) return null;
                                current = current.children[path[i]];
                            }
                            return current;
                        }
                    }

                    let current = this.groups[path[0]];
                    for (let i = 1; i < path.length; i++) {
                        if (!current || !current.children) return null;
                        current = current.children[path[i]];
                    }
                    return current;
                },

                // Récupérer le parent d'un groupe
                getParentGroup(path) {
                    if (!path || path.length <= 1) return null;
                    return this.getGroupAtPath(path.slice(0, -1));
                },

                // Récupérer une cellule par chemin de groupe + index de cellule
                getCellAtPath(path, cellIndex) {
                    if (!path || !Array.isArray(path)) return null;
                    // Handle modal context directly for performance
                    if (path.length === 1 && path[0] === -1) {
                        if (!this.childGroupModal.group?.cells) return null;
                        return this.childGroupModal.group.cells[cellIndex];
                    }

                    const group = this.getGroupAtPath(path);
                    return group?.cells?.[cellIndex];
                },

                // Créer un nouveau groupe (pour imbrication)
                createNewGroup(direction = 'row') {
                    return {
                        _id: this.generateGroupId(),
                        direction: direction,
                        style: '',
                        cells: [],
                        children: [],
                        _order: 0, // Sera ajusté lors de l'ajout au parent
                        loop: { enabled: false, query: '', zip: false, zipQuery: '' },
                        accordion: false,
                        title: '',
                        accordionOpen: true
                    };
                },

                // Ajouter un sous-groupe à un groupe
                addNestedGroup(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return;

                    if (!group.children) {
                        group.children = [];
                    }

                    const newChild = this.createNewGroup('row');
                    newChild._order = this.getNextOrder(group);
                    const firstCell = this.createNewCell('markdown');
                    firstCell._order = 0;
                    newChild.cells = [firstCell];
                    group.children.push(newChild);

                    this.setStatus('Sous-groupe ajouté', 'success');
                },

                // Changer la direction d'un groupe par chemin
                toggleGroupDirection(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        group.direction = group.direction === 'column' ? 'row' : 'column';
                    }
                },

                // Ouvrir la modale de configuration de loop
                openLoopConfigModal(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        // S'assurer que loop existe avec tous les champs
                        if (!group.loop) {
                            group.loop = { enabled: false, query: '', zip: false, zipQuery: '' };
                        } else if (group.loop.zip === undefined) {
                            group.loop.zip = false;
                            group.loop.zipQuery = group.loop.zipQuery || '';
                        }
                        this.loopConfigModal = { open: true, path: path };
                    }
                },

                // Ouvrir la modale de paramètres du groupe (accordion, title, accordionOpen)
                openGroupSettingsModal(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        ConfigManager.ensureGroupQueries(group);
                        this.groupSettingsModal = { open: true, path: path };
                    }
                },

                // Tester la requête conditionnelle d'un groupe (affiche le résultat)
                async testGroupIfQuery(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group || !ConfigManager.getGroupIfQuery(group)) return;
                    try {
                        const result = await this.evaluateGroupIfQuery(group);
                        this.setStatus(`ifQuery: ${result === true ? 'true → groupe affiché' : (result === false ? 'false' : 'null') + ' → groupe masqué'}`, result ? 'success' : 'info');
                    } catch (err) {
                        this.setStatus('Erreur ifQuery: ' + err.message, 'error');
                    }
                },

                // Basculer l'état ouvert/fermé d'un accordion
                toggleAccordion(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        group.accordionOpen = !group.accordionOpen;
                    }
                },

                // Générer la requête par défaut pour la loop
                getDefaultLoopQuery() {
                    return `SELECT DISTINCT {{ SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'source1'
    ORDER BY ordinal_position
    LIMIT 1}}
FROM source1 LIMIT 10;`;
                },

                // Générer la requête par défaut pour le nom du fichier zip
                getDefaultZipQuery() {
                    return `SELECT 'export_' || current_timestamp::text || '.zip' as filename;`;
                },

                // Supprimer un groupe par chemin
                deleteGroupAtPath(path) {
                    if (!path || path.length === 0) return;

                    if (!confirm('Supprimer ce groupe et tout son contenu ?')) return;

                    if (path.length === 1) {
                        // Groupe de premier niveau
                        this.groups.splice(path[0], 1);
                    } else {
                        // Sous-groupe : récupérer le parent
                        const parentPath = path.slice(0, -1);
                        const childIndex = path[path.length - 1];
                        const parent = this.getGroupAtPath(parentPath);
                        if (parent && parent.children) {
                            parent.children.splice(childIndex, 1);
                        }
                    }
                    this.setStatus('Groupe supprimé', 'success');
                },

                // ─────────────────────────────────────────────────────────────────
                // GESTION DES GROUPES ENFANTS (childGroup liés aux cellules)
                // ─────────────────────────────────────────────────────────────────

                // Récupérer un groupe link par son ID
                getLinkGroupById(groupId) {
                    return this.linkGroups.find(g => g._id === groupId);
                },

                // Ouvrir la modale du groupe enfant pour une cellule
                async openChildGroupModal(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    // Récupérer ou créer le groupe enfant
                    let childGroup = null;
                    if (cell.childGroupId) {
                        // Le groupe existe déjà
                        childGroup = this.getLinkGroupById(cell.childGroupId);
                    }

                    if (!childGroup) {
                        // Créer un nouveau groupe link
                        childGroup = this.createNewGroup('row');
                        childGroup._type = 'link';

                        // Ajouter une première cellule markdown pour démarrer
                        const firstCell = this.createNewCell('markdown');
                        firstCell._order = 0;
                        childGroup.cells = [firstCell];

                        // Ajouter le groupe aux linkGroups
                        this.linkGroups.push(childGroup);

                        // Lier le groupe à la cellule
                        cell.childGroupId = childGroup._id;
                    }

                    // Ouvrir la modale avec le groupe
                    this.childGroupModal = {
                        open: true,
                        path: path,
                        cellIndex: cellIndex,
                        group: childGroup
                    };

                    // Exécuter automatiquement tout le contenu du groupe link
                    await this.runGroupAtPath([-1]);
                },

                // Fermer la modale du groupe enfant
                closeChildGroupModal() {
                    this.childGroupModal = { open: false, path: null, cellIndex: null, group: null };
                },

                // Supprimer le groupe enfant (link group) et fermer la modale
                deleteChildGroupModal() {
                    if (!this.childGroupModal.group) return;

                    if (!confirm('Supprimer ce groupe enfant ?')) return;

                    const groupId = this.childGroupModal.group._id;

                    // Retirer le groupe de linkGroups
                    const linkIndex = this.linkGroups.findIndex(g => g._id === groupId);
                    if (linkIndex !== -1) {
                        this.linkGroups.splice(linkIndex, 1);
                    }

                    // Retirer le childGroupId de la cellule parente
                    if (this.childGroupModal.path && this.childGroupModal.cellIndex !== null) {
                        const cell = this.getCellAtPath(this.childGroupModal.path, this.childGroupModal.cellIndex);
                        if (cell && cell.childGroupId === groupId) {
                            delete cell.childGroupId;
                        }
                    }

                    // Fermer la modale
                    this.closeChildGroupModal();
                },


                // Exécuter toutes les cellules d'un groupe par chemin
                async runGroupAtPath(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    // Vérifier si le groupe a une loop activée
                    const useLoop = !!(group.loop && group.loop.enabled && group.loop.query);

                    if (useLoop) {
                        return await this.runGroupWithLoop(path, group);
                    } else {
                        return await this.runGroupOnce(path, group);
                    }
                },

                /** Cellule à exécuter manuellement (buttonLabel non vide) : sautée dans le flux auto. En mode boucle+zip, on exécute toutes les cellules productrices de fichiers. */
                isCellSkippedInAutoFlow(cell) {
                    if (!cell || cell.type === 'buttonRunNextCells') return false;
                    if (this._zipMode) return false; // En boucle avec zip, exécuter toutes les cellules productrices de fichiers
                    return !!(cell.buttonLabel && String(cell.buttonLabel).trim() !== '');
                },

                // Exécuter un groupe une seule fois (sans loop)
                // Retourne { stopped: true } si arrêt (ex: source sans fichier chargé), sinon { stopped: false }
                async runGroupOnce(path, group) {
                    // Évaluer queries[0] (condition d'affichage) au début de l'exécution du groupe
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false }; // Skip l'exécution du groupe
                        }
                    }

                    this.setStatus('Exécution du groupe...', 'loading');

                    // Exécuter selon l'ordre visuel (_order) en intercalant cellules et sous-groupes
                    const orderedItems = this.getAllItemsSorted(group);
                    for (const item of orderedItems) {
                        if (item.type === 'child') {
                            const result = await this.runGroupAtPath([...path, item.originalIndex]);
                            if (result?.stopped) return result;
                            continue;
                        }

                        const cell = item.item;
                        if (cell.type === 'buttonRunNextCells') {
                            this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;
                        // Cellule source sans fileInput chargé : interrompre le flux
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            continue;
                        }
                        await this.runCellAt(path, item.originalIndex);
                    }

                    this.setStatus('Groupe exécuté', 'success');
                    return { stopped: false };
                },

                // Parser une requête de loop (avec paramètres et imbrications {{ }})
                async parseLoopQuery(query) {
                    // Parse la requête avec les paramètres d'abord
                        let currentQuery = this.parseQueryWithParameters(query);
                    const maxLevels = 10;
                    let level = 0;

                    // Fonction récursive : traiter la requête la plus profonde (innermost) en premier
                    const parseRecursive = async (q) => {
                        if (level >= maxLevels) {
                            throw new Error('Nombre maximum de niveaux d\'imbrication atteint (10)');
                        }

                        const posClose = q.indexOf('}}');
                        if (posClose === -1) return q;
                        const posOpen = q.lastIndexOf('{{', posClose);
                        if (posOpen === -1) {
                            return q;
                        }

                        const innerQuery = q.substring(posOpen + 2, posClose).trim();
                        level++;

                        const resolvedInnerQuery = await parseRecursive(innerQuery);
                        const results = await DuckDBManager.executeQuery(resolvedInnerQuery);

                        if (!results || results.length === 0) {
                            throw new Error(`Niveau ${level}: La requête n'a retourné aucun résultat`);
                        }

                        const firstRow = results[0];
                        const replacement = Object.values(firstRow)[0];

                        if (replacement === null || replacement === undefined) {
                            throw new Error(`Niveau ${level}: Le résultat est null ou undefined`);
                        }

                        const replStr = String(replacement).replace(/\$/g, '$$$$');
                        const newQuery = q.substring(0, posOpen) + replStr + q.substring(posClose + 2);
                        return await parseRecursive(newQuery);
                    };

                    return await parseRecursive(currentQuery);
                },

                // Ajouter un fichier à la collection zip (utilisé par les cellules de génération de fichiers)
                addFileToZip(filename, content, type = 'blob') {
                    if (this._zipMode) {
                        this._zipFiles.push({ filename, content, type });
                        return true; // Fichier ajouté au zip, ne pas télécharger
                    }
                    return false; // Mode normal, télécharger directement
                },

                // Télécharger un fichier (ou l'ajouter au zip si mode zip actif)
                downloadOrZipFile(filename, content, mimeType = 'application/octet-stream') {
                    if (this._zipMode) {
                        this._zipFiles.push({ filename, content, type: 'blob' });
                        return true;
                    }
                    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    return false;
                },

                // Exécuter un groupe avec loop
                // Retourne { stopped: true } si arrêt (ex: source sans fichier chargé), sinon { stopped: false }
                async runGroupWithLoop(path, group) {
                    // Évaluer queries[0] (condition d'affichage) au début de l'exécution du groupe
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false }; // Skip l'exécution du groupe
                        }
                    }

                    this.setStatus('Initialisation de la boucle...', 'loading');

                    // Activer le mode zip si configuré
                    const zipEnabled = group.loop.zip === true;
                    if (zipEnabled) {
                        this._zipMode = true;
                        this._zipFiles = [];
                    }

                    try {
                        // Exécuter la requête de loop pour obtenir les valeurs
                        const loopQuery = group.loop.query;
                        const parsedLoopQuery = await this.parseLoopQuery(loopQuery);
                        const loopResults = await DuckDBManager.executeQuery(parsedLoopQuery);

                        if (!loopResults || loopResults.length === 0) {
                            this.setStatus('Boucle: aucune valeur trouvée', 'warning');
                            this._zipMode = false;
                            this._zipFiles = [];
                            return { stopped: false };
                        }

                        // Récupérer la première colonne pour les valeurs de loop
                        const firstColumnName = Object.keys(loopResults[0])[0];
                        const loopValues = loopResults.map(row => row[firstColumnName]);

                        this.setStatus(`Boucle: ${loopValues.length} itérations`, 'loading');

                        // Exécuter le groupe pour chaque valeur de loop
                        for (let i = 0; i < loopValues.length; i++) {
                            const loopValue = loopValues[i];
                            this._currentLoopValue = loopValue;
                            this.setStatus(`Boucle ${i + 1}/${loopValues.length}: $loop = ${loopValue}`, 'loading');

                            // Exécuter le contenu du groupe
                            const orderedItems = this.getAllItemsSorted(group);
                            for (const item of orderedItems) {
                                if (item.type === 'child') {
                                    const result = await this.runGroupAtPath([...path, item.originalIndex]);
                                    if (result?.stopped) return result;
                                    continue;
                                }

                                const cell = item.item;
                                if (cell.type === 'buttonRunNextCells') {
                                    this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                                    return { stopped: true, reason: 'buttonRunNextCells' };
                                }
                                if (this.isCellSkippedInAutoFlow(cell)) continue;
                                // Cellule source sans fileInput chargé : interrompre le flux
                                if (cell.type === 'source') {
                                    if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                        return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                                    }
                                    if (cell._status === 'error') {
                                        return { stopped: true, reason: 'source_error', cellName: cell.name };
                                    }
                                    continue;
                                }
                                await this.runCellAt(path, item.originalIndex);
                            }
                        }

                        // Réinitialiser la valeur de loop
                        this._currentLoopValue = null;

                        // Générer le ZIP si mode zip actif et fichiers collectés
                        if (zipEnabled && this._zipFiles.length > 0) {
                            await this.generateAndDownloadZip(group);
                        }

                        this.setStatus(`Boucle terminée: ${loopValues.length} itérations` + (zipEnabled ? ` - ${this._zipFiles.length} fichier(s) zippé(s)` : ''), 'success');
                        return { stopped: false };

                    } catch (error) {
                        this._currentLoopValue = null;
                        this.setStatus('Erreur boucle: ' + error.message, 'error');
                        return { stopped: true };
                    } finally {
                        // Toujours réinitialiser le mode zip
                        this._zipMode = false;
                        this._zipFiles = [];
                    }
                },

                // Générer et télécharger le fichier ZIP
                async generateAndDownloadZip(group) {
                    this.setStatus('Génération du fichier ZIP...', 'loading');

                    try {
                        // Déterminer le nom du fichier ZIP
                        let zipFilename = 'export.zip';
                        if (group.loop.zipQuery) {
                            const parsedZipQuery = await this.parseLoopQuery(group.loop.zipQuery);
                            const zipResults = await DuckDBManager.executeQuery(parsedZipQuery);
                            if (zipResults && zipResults.length > 0) {
                                const firstValue = Object.values(zipResults[0])[0];
                                if (firstValue) {
                                    zipFilename = String(firstValue);
                                    if (!zipFilename.toLowerCase().endsWith('.zip')) {
                                        zipFilename += '.zip';
                                    }
                                }
                            }
                        }

                        // Créer le ZIP avec PizZip
                        await CDNManager.loadPizZip();
                        const zip = new PizZip();

                        for (const file of this._zipFiles) {
                            if (file.content instanceof Blob) {
                                // Convertir le Blob en ArrayBuffer pour PizZip
                                const arrayBuffer = await file.content.arrayBuffer();
                                zip.file(file.filename, arrayBuffer);
                            } else if (file.content instanceof ArrayBuffer) {
                                zip.file(file.filename, file.content);
                            } else if (typeof file.content === 'string') {
                                zip.file(file.filename, file.content);
                            } else {
                                zip.file(file.filename, file.content);
                            }
                        }

                        // Générer et télécharger le ZIP
                        const zipBlob = zip.generate({ type: 'blob' });
                        const url = URL.createObjectURL(zipBlob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = zipFilename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);

                        this.setStatus(`ZIP généré: ${zipFilename} (${this._zipFiles.length} fichiers)`, 'success');
                    } catch (error) {
                        console.error('Erreur lors de la génération du ZIP:', error);
                        throw new Error('Erreur ZIP: ' + error.message);
                    }
                },

                // Déplacer un groupe par chemin
                moveGroupAtPath(path, direction) {
                    if (!path || path.length === 0) return;

                    if (path.length === 1) {
                        // Groupe de premier niveau
                        const index = path[0];
                        const newIndex = index + direction;
                        if (newIndex >= 0 && newIndex < this.groups.length) {
                            const temp = this.groups[index];
                            this.groups[index] = this.groups[newIndex];
                            this.groups[newIndex] = temp;
                        }
                    } else {
                        // Sous-groupe
                        const parentPath = path.slice(0, -1);
                        const childIndex = path[path.length - 1];
                        const parent = this.getGroupAtPath(parentPath);
                        if (parent && parent.children) {
                            const newIndex = childIndex + direction;
                            if (newIndex >= 0 && newIndex < parent.children.length) {
                                const temp = parent.children[childIndex];
                                parent.children[childIndex] = parent.children[newIndex];
                                parent.children[newIndex] = temp;
                            }
                        }
                    }
                },

                // Déplacer une cellule dans un groupe par chemin
                moveCellInGroupAtPath(path, cellIndex, direction) {
                    const group = this.getGroupAtPath(path);
                    if (!group || !group.cells) return;

                    const newIndex = cellIndex + direction;
                    if (newIndex >= 0 && newIndex < group.cells.length) {
                        const temp = group.cells[cellIndex];
                        group.cells[cellIndex] = group.cells[newIndex];
                        group.cells[newIndex] = temp;
                    }
                },

                // Génère l'ID unique pour un groupe basé sur son path
                getGroupElementId(path) {
                    return 'group-' + path.join('-');
                },

                // ─────────────────────────────────────────────────────────────────
                // GESTION DES GROUPES (unifié avec path)
                // ─────────────────────────────────────────────────────────────────
                openAddGroupModal() {
                    this.showAddGroupModal = true;
                },


                // ─────────────────────────────────────────────────────────────────
                // GESTION DE L'ORDRE UNIFIÉ (cellules + sous-groupes)
                // ─────────────────────────────────────────────────────────────────

                // Obtient le prochain _order disponible dans un groupe (cellules + children)
                getNextOrder(group) {
                    if (!group) return 0;
                    const cells = group.cells || [];
                    const children = group.children || [];
                    const allOrders = [
                        ...cells.map(c => c._order ?? 0),
                        ...children.map(c => c._order ?? 0)
                    ];
                    return allOrders.length > 0 ? Math.max(...allOrders) + 1 : 0;
                },

                // Retourne les cellules triées par _order avec leur index original
                getSortedCells(group) {
                    if (!group || !group.cells) return [];
                    return group.cells
                        .map((cell, originalIndex) => ({ cell, originalIndex }))
                        .sort((a, b) => (a.cell._order ?? 0) - (b.cell._order ?? 0));
                },

                // Helpers factorisés pour la taille des cellules (minSizePx/Percent, maxSizePx/Percent optionnels)
                hasCellMinSize(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.minSizePx) || v(cell.minSizePercent));
                },
                hasCellMaxSize(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.maxSizePx) || v(cell.maxSizePercent));
                },
                hasCellHeight(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.minHeightPx) || v(cell.minHeightPercent) || v(cell.maxHeightPx) || v(cell.maxHeightPercent));
                },
                isSqlCellWithEditor(type) {
                    return ['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective', 'pdfme', 'publipostageWord'].includes(type);
                },
                /** Logique d'affichage pilotée par le schéma (bodyDisplay) */
                bodyDisplayShouldShowSkeleton(cell) {
                    if (!cell) return false;
                    // Markdown engine text : contenu chargé directement, aucune exécution → jamais de skeleton
                    if (cell.type === 'markdown' && ConfigManager.getCellEngine(cell, 'main') === 'text') return false;
                    const schema = CELL_TYPE_SCHEMAS.types[cell.type];
                    const disp = schema?.bodyDisplay?.showSkeleton ?? { when: 'running', excludeTypes: ['uiParameter'] };
                    if (disp.when === 'never') return false;
                    if (disp.excludeTypes?.includes(cell.type)) return false;
                    if (disp.excludeWhenSqlEditor && this.isSqlCellWithEditor(cell.type) && this.showSqlEditorVisible(cell)) return false;
                    if (cell._status === 'running') return true;
                    if (disp.sourceLoading && cell.type === 'source' && cell._fileName && !cell._loaded) return true;
                    return false;
                },
                bodyDisplayShouldShowContent(cell) {
                    if (!cell) return false;
                    return !this.bodyDisplayShouldShowSkeleton(cell);
                },
                /** Retourne les variables CSS pour la hauteur (à utiliser avec style). Utilise max/min en CSS. */
                getCellHeightVars(cell) {
                    if (!cell) return '';
                    const toPx = v => {
                        if (v == null || String(v).trim() === '') return '';
                        const s = String(v).trim();
                        return /^\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
                    };
                    const toPct = v => {
                        if (v == null || String(v).trim() === '') return '';
                        const s = String(v).trim();
                        return /^\d+(\.\d+)?$/.test(s) ? s + '%' : s;
                    };
                    const parts = [];
                    const mhp = toPx(cell.minHeightPx); const mhc = toPct(cell.minHeightPercent);
                    if (mhp) parts.push(`--cell-min-h-px:${mhp}`);
                    if (mhc) parts.push(`--cell-min-h-pct:${mhc}`);
                    const mxp = toPx(cell.maxHeightPx); const mxc = toPct(cell.maxHeightPercent);
                    if (mxp) parts.push(`--cell-max-h-px:${mxp}`);
                    if (mxc) parts.push(`--cell-max-h-pct:${mxc}`);
                    return parts.length ? parts.join(';') : '';
                },
                getCellSizeOuterClass(cell, isColumn) {
                    if (isColumn) return 'flex-col w-full';
                    return this.hasCellMinSize(cell) ? '' : 'min-w-[200px]';
                },
                // Style pour le wrapper (flex child) : order + min/max width/height. Combinaison px et % via max()/min() CSS.
                getCellWrapperStyle(cell, isColumn, order) {
                    const s = { order: order ?? 0 };
                    const toPx = v => {
                        if (v === undefined || v === null) return null;
                        const str = String(v).trim();
                        if (str === '') return null;
                        return /^\d+(\.\d+)?$/.test(str) ? str + 'px' : str;
                    };
                    const toPct = v => {
                        if (v === undefined || v === null) return null;
                        const str = String(v).trim();
                        if (str === '') return null;
                        return /^\d+(\.\d+)?$/.test(str) ? str + '%' : str;
                    };
                    if (!isColumn) {
                        const minPx = toPx(cell?.minSizePx) ?? toPx(cell?.minSize);
                        const minPct = toPct(cell?.minSizePercent);
                        if (minPx && minPct) s.minWidth = `max(${minPx}, ${minPct})`;
                        else if (minPx) s.minWidth = minPx;
                        else if (minPct) s.minWidth = minPct;
                        const maxPx = toPx(cell?.maxSizePx) ?? toPx(cell?.maxSize);
                        const maxPct = toPct(cell?.maxSizePercent);
                        if (maxPx && maxPct) s.maxWidth = `min(${maxPx}, ${maxPct})`;
                        else if (maxPx) s.maxWidth = maxPx;
                        else if (maxPct) s.maxWidth = maxPct;
                    }
                    return s;
                },
                getCellSizeInnerClass() {
                    return 'w-full';
                },

                // Retourne les children triés par _order avec leur index original
                getSortedChildren(group) {
                    if (!group || !group.children) return [];
                    return group.children
                        .map((child, originalIndex) => ({ child, originalIndex }))
                        .sort((a, b) => (a.child._order ?? 0) - (b.child._order ?? 0));
                },

                // Génère le HTML d'un sous-groupe (récursif, illimité)
                renderChildGroupHTML(childGroup, childPath, parentGroup, originalIndex) {
                    // Convertir le path en expression JSON pour l'utiliser dans les bindings
                    const pathJSON = JSON.stringify(childPath);
                    const parentPathJSON = JSON.stringify(childPath.slice(0, -1));

                    // Header du sous-groupe
                    const header = `
                        <div class="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300" x-show="devMode">
                            <div class="join">
                                <button class="btn btn-xs join-item" @click="toggleGroupDirection(${pathJSON})" :title="getGroupAtPath(${pathJSON})?.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'">
                                    <span x-text="getGroupAtPath(${pathJSON})?.direction === 'column' ? '⇵' : '⇄'"></span>
                                </button>
                                <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.loop?.enabled ? 'btn-info' : ''" @click="openLoopConfigModal(${pathJSON})" title="Configurer la boucle">🔁</button>
                                <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.accordion ? 'btn-accent' : ''" @click="openGroupSettingsModal(${pathJSON})" title="Paramètres du groupe">⚙️</button>
                                <button class="btn btn-xs btn-success join-item" @click="runGroupAtPath(${pathJSON})" :disabled="isLoading" title="Exécuter">▶️</button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, -1)" :disabled="isFirstInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Monter">⬆️</button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, 1)" :disabled="isLastInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Descendre">⬇️</button>
                                <button class="btn btn-xs join-item" @click="addNestedGroup(${pathJSON})" title="Ajouter un sous-groupe">📁</button>
                                <button class="btn btn-xs join-item" @click="openAddCellToGroupModal(${pathJSON})" title="Ajouter une cellule">➕</button>
                                <button class="btn btn-xs btn-error join-item" @click="deleteGroupAtPath(${pathJSON})" title="Supprimer">🗑️</button>
                            </div>
                            <div class="dropdown dropdown hidden">
                                <div tabindex="0" role="button" class="btn btn-xs">⋮</div>
                                <ul tabindex="-1" class="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-48 p-2 shadow-sm">
                                    <li><button @click="toggleGroupDirection(${pathJSON})"><span x-text="getGroupAtPath(${pathJSON})?.direction === 'column' ? '⇵ Passer en ligne' : '⇄ Passer en colonne'"></span></button></li>
                                    <li><button @click="openLoopConfigModal(${pathJSON})">🔁 Configurer la boucle</button></li>
                                    <li><button @click="openGroupSettingsModal(${pathJSON})">⚙️ Paramètres du groupe</button></li>
                                    <li><button @click="runGroupAtPath(${pathJSON})" :disabled="isLoading">▶️ Exécuter</button></li>
                                    <li><button @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, -1)" :disabled="isFirstInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})">⬆️ Monter</button></li>
                                    <li><button @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, 1)" :disabled="isLastInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})">⬇️ Descendre</button></li>
                                    <li><button @click="addNestedGroup(${pathJSON})">📁 Ajouter un sous-groupe</button></li>
                                    <li><button @click="openAddCellToGroupModal(${pathJSON})">➕ Ajouter une cellule</button></li>
                                    <li><button class="text-error" @click="deleteGroupAtPath(${pathJSON})">🗑️ Supprimer</button></li>
                                </ul>
                            </div>
                        </div>`;

                    // Bande accordion pour sous-groupe
                    const accordionBand = `
                        <div x-show="getGroupAtPath(${pathJSON})?.accordion" 
                             @click="toggleAccordion(${pathJSON})"
                             class="flex items-center gap-2 py-2 px-4 bg-base-200 border-b border-base-300 cursor-pointer select-none hover:bg-base-300 transition-colors duration-200">
                            <span class="text-sm transition-transform duration-200" :class="getGroupAtPath(${pathJSON})?.accordionOpen ? 'rotate-90' : ''">▶</span>
                            <span class="font-semibold text-sm" x-text="getGroupAtPath(${pathJSON})?.title || ''"></span>
                        </div>`;

                    // Contenu du sous-groupe (cellules + sous-groupes récursifs)
                    const content = `
                        <div class="p-2" x-show="!getGroupAtPath(${pathJSON})?.accordion || getGroupAtPath(${pathJSON})?.accordionOpen" x-collapse
                             x-data="{ _activeTabKey: null }"
                             x-init="if (getGroupAtPath(${pathJSON})?.tabsChild) { const items = getAllItemsSorted(getGroupAtPath(${pathJSON})); if (items.length > 0) _activeTabKey = (items[0].type === 'cell' ? 'c-' : 'g-') + items[0].originalIndex; }">
                            <!-- Barre d'onglets (mode client + tabsChild) -->
                            <div x-show="!devMode && getGroupAtPath(${pathJSON})?.tabsChild" role="tablist" class="tabs tabs-box mb-2">
                                <template x-for="(tabItem, tabIdx) in getAllItemsSorted(getGroupAtPath(${pathJSON}))" :key="'tab-' + (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex">
                                    <a role="tab" class="tab"
                                       :class="{ 'tab-active': _activeTabKey === ((tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex) }"
                                       @click="_activeTabKey = (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex"
                                       x-text="getTabName(tabItem, tabIdx)"></a>
                                </template>
                            </div>
                            <div class="flex gap-2" :class="(!devMode && getGroupAtPath(${pathJSON})?.tabsChild) ? 'flex-col' : ((getGroupAtPath(${pathJSON})?.direction || 'row') === 'row' ? 'flex-row flex-wrap' : 'flex-col')">
                                <!-- Cellules du groupe -->
                                <template x-for="cellItem in getSortedCells(getGroupAtPath(${pathJSON}))" :key="cellItem.cell._id">
                                    <div class="flex flex-1 min-w-0" 
                                        :class="(getGroupAtPath(${pathJSON})?.direction || 'row') === 'column' ? 'flex-col w-full' : ''"
                                        style="display: contents;">
                                        <div class="bg-base-100 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-200 flex-1 cell-container"
                                             x-show="shouldShowCell(cellItem.cell) && (devMode || !getGroupAtPath(${pathJSON})?.tabsChild || _activeTabKey === ('c-' + cellItem.originalIndex))"
                                             :class="[getCellSizeInnerClass(), cellItem.cell.border !== false ? 'border border-base-300 shadow-sm hover:border-primary hover:shadow-lg' : 'border-0 shadow-none', {
                                                 'border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)]': cellItem.cell.border !== false && cellItem.cell._status === 'running',
                                                 'border-success': cellItem.cell.border !== false && cellItem.cell._status === 'success',
                                                 'border-error': cellItem.cell.border !== false && cellItem.cell._status === 'error'
                                             }]"
                                             :style="getCellWrapperStyle(cellItem.cell, (getGroupAtPath(${pathJSON})?.direction || 'row') === 'column', cellItem.cell._order ?? 0)">
                                            ${CellRenderer.renderCell(pathJSON, 'cellItem.originalIndex', `getGroupAtPath(${pathJSON})`)}
                                        </div>
                                    </div>
                                </template>
                                
                                <!-- Sous-groupes récursifs -->
                                <template x-for="subChild in getSortedChildren(getGroupAtPath(${pathJSON}))" :key="subChild.child._id || ('child-' + subChild.originalIndex)">
                                    <div class="flex-1 bg-base-100 border border-base-300 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md"
                                         x-show="shouldShowGroup(subChild.child) && (devMode || !getGroupAtPath(${pathJSON})?.tabsChild || _activeTabKey === ('g-' + subChild.originalIndex))"
                                         :style="'order: ' + (subChild.child._order ?? 0)"
                                         x-data="{ _subPath: [...${pathJSON}, subChild.originalIndex] }"
                                         x-html="renderChildGroupHTML(subChild.child, _subPath, getGroupAtPath(${pathJSON}), subChild.originalIndex)"
                                         x-effect="$nextTick(() => Alpine.initTree($el))">
                                    </div>
                                </template>
                            </div>
                        </div>`;

                    return header + accordionBand + content;
                },

                // Retourne tous les items (cellules + children) triés par _order avec leur type
                getAllItemsSorted(group) {
                    if (!group) return [];
                    const cells = (group.cells || []).map((c, i) => ({
                        type: 'cell',
                        item: c,
                        originalIndex: i,
                        order: c._order ?? 0
                    }));
                    const children = (group.children || []).map((c, i) => ({
                        type: 'child',
                        item: c,
                        originalIndex: i,
                        order: c._order ?? 0
                    }));
                    return [...cells, ...children].sort((a, b) => a.order - b.order);
                },

                // Retourne le nom d'onglet pour un item (cellule ou groupe enfant)
                getTabName(tabItem, tabIdx) {
                    if (tabItem.type === 'cell') {
                        const cell = tabItem.item;
                        return cell.name || ConfigManager.getCellReferenceName(cell) || cell.title || `Cellule ${tabIdx + 1}`;
                    } else {
                        const child = tabItem.item;
                        return child.name || child.title || `Groupe ${tabIdx + 1}`;
                    }
                },


                // Déplace un item (cellule ou child) dans un groupe de façon unifiée
                moveItemInGroup(path, itemType, originalIndex, direction) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return;

                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length < 2) return;

                    // Trouver l'item actuel dans la liste triée
                    const currentSortedIndex = allItems.findIndex(
                        item => item.type === itemType && item.originalIndex === originalIndex
                    );
                    if (currentSortedIndex === -1) return;

                    const newSortedIndex = currentSortedIndex + direction;
                    if (newSortedIndex < 0 || newSortedIndex >= allItems.length) return;

                    // Échanger les _order des deux éléments
                    const currentItem = allItems[currentSortedIndex];
                    const targetItem = allItems[newSortedIndex];

                    const tempOrder = currentItem.item._order;
                    currentItem.item._order = targetItem.item._order;
                    targetItem.item._order = tempOrder;
                },

                // Vérifie si un item est le premier dans l'ordre unifié
                isFirstInGroup(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length === 0) return true;
                    const first = allItems[0];
                    return first.type === itemType && first.originalIndex === originalIndex;
                },

                // Vérifie si un item est le dernier dans l'ordre unifié
                isLastInGroup(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length === 0) return true;
                    const last = allItems[allItems.length - 1];
                    return last.type === itemType && last.originalIndex === originalIndex;
                },

                // Trouve l'index de l'item dans la liste triée
                getSortedIndex(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    return allItems.findIndex(
                        item => item.type === itemType && item.originalIndex === originalIndex
                    );
                },

                createNewCell(type) {
                    const newCell = {
                        _id: this.generateCellId(),
                        _status: null,
                        _results: null,
                        _resultInfo: null,
                        _order: 0,
                        type
                    };
                    const baseName = this.generateUniqueCellName(type);
                    newCell.name = baseName;
                    CellConfigService.ensureCellFromSchema(newCell, type, { baseName });
                    if (type === 'source') {
                        newCell._fileName = '';
                        newCell._currentFile = null;
                        newCell._isDragging = false;
                        newCell._loaded = false;
                    }
                    if (type === 'uiParameter') {
                        newCell._value = '';
                        newCell._options = [];
                        newCell._initialized = false;
                        newCell._userModified = false;
                    }
                    if (type === 'publipostageWord') {
                        newCell.docxTemplateBase64 = null;
                        newCell.docxTemplateFileName = '';
                        newCell._showParsedQuery = false;
                        newCell._showParsedQuery2 = false;
                        newCell._parseLevels = [];
                        newCell._parseLevels2 = [];
                        newCell._isDragging = false;
                    }
                    if (type === 'pdfme') {
                        if (!newCell.json || typeof newCell.json !== 'string' || newCell.json.length < 50) {
                            newCell.json = JSON.stringify({
                                basePdf: { width: 210, height: 297, padding: [20, 20, 9, 20], staticSchema: [
                                    { name: 'page_header', type: 'text', position: { x: 20, y: 5 }, width: 170, height: 8, content: '{date}', fontSize: 9, fontColor: '#888888', alignment: 'right', readOnly: true },
                                    { name: 'footer', type: 'text', position: { x: 20, y: 288 }, width: 170, height: 10, content: 'PIED DE PAGE - Page {currentPage} / {totalPages}', fontSize: 10, fontColor: '#888888', alignment: 'center', readOnly: true }
                                ]},
                                schemas: [[
                                    { name: 'header', type: 'text', position: { x: 20, y: 20 }, width: 170, height: 10, content: 'ENTÊTE DU DOCUMENT', fontSize: 16, fontColor: '#6366f1', alignment: 'center' },
                                    { name: 'datatable', type: 'table', position: { x: 20, y: 35 }, width: 170, height: 50, content: '[[\"A\",\"B\",\"C\"]]', showHead: true, repeatHead: true, head: ['Col1', 'Col2', 'Col3'], headWidthPercentages: [33, 33, 34], tableStyles: { borderWidth: 0.3, borderColor: '#000000' }, headStyles: { fontSize: 10, fontColor: '#ffffff', backgroundColor: '#6366f1' }, bodyStyles: { fontSize: 9, fontColor: '#333333', alternateBackgroundColor: '#f5f5f5' }, columnStyles: {} }
                                ]]
                            }, null, 2);
                        }
                        newCell._showParsedQuery = false;
                        newCell._showParsedQuery2 = false;
                        newCell._parseLevels = [];
                        newCell._parseLevels2 = [];
                    }
                    if (['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective'].includes(type)) newCell._showParsedQuery = false;
                    if (type === 'perspective') {
                        newCell._perspectiveReady = false;
                        newCell._perspectiveWorker = null;
                        newCell._perspectiveTable = null;
                    }
                    return newCell;
                },

                addGroup(cellType) {
                    const newGroup = this.createNewGroup('row');
                    newGroup.cells = [this.createNewCell(cellType)];
                    this.groups.push(newGroup);
                    this.showAddGroupModal = false;
                },

                // Ajouter une cellule à un groupe (accepte path ou groupIndex)
                addCellToGroup(pathOrIndex, cellType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        if (!group.cells) group.cells = [];
                        const newCell = this.createNewCell(cellType);
                        newCell._order = this.getNextOrder(group);
                        group.cells.push(newCell);
                    }
                    this.addCellToGroupModal = { open: false, path: null };
                },

                // Ouvrir le modal pour ajouter une cellule à un groupe (accepte path ou groupIndex)
                openAddCellToGroupModal(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.addCellToGroupModal = { open: true, path };
                },

                // Ouvrir le modal pour insérer un groupe à une position
                openInsertGroupModal(atIndex) {
                    this.insertGroupModal = { open: true, atIndex: atIndex };
                },

                // Insérer un groupe à une position spécifique
                insertGroupAt(atIndex, cellType) {
                    const newGroup = this.createNewGroup('row');
                    newGroup.cells = [this.createNewCell(cellType)];
                    this.groups.splice(atIndex, 0, newGroup);
                    this.insertGroupModal = { open: false, atIndex: null };
                },

                // Ouvrir le modal pour insérer une cellule à une position (accepte path ou groupIndex)
                openInsertCellModal(pathOrIndex, atCellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.insertCellModal = { open: true, path, atCellIndex };
                },

                // Insérer une cellule à une position spécifique (accepte path ou groupIndex)
                insertCellAt(pathOrIndex, atCellIndex, cellType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        if (!group.cells) group.cells = [];
                        const newCell = this.createNewCell(cellType);
                        newCell._order = this.getNextOrder(group);
                        group.cells.splice(atCellIndex, 0, newCell);
                    }
                    this.insertCellModal = { open: false, path: null, atCellIndex: null };
                },

                // Supprimer un groupe (wrapper pour deleteGroupAtPath)
                deleteGroup(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.deleteGroupAtPath(path);
                },

                // Déplacer un groupe (wrapper pour moveGroupAtPath)
                moveGroup(pathOrIndex, direction) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.moveGroupAtPath(path, direction);
                },

                // ─────────────────────────────────────────────────────────────────
                // GESTION DES CELLULES (unifié avec path)
                // ─────────────────────────────────────────────────────────────────

                // Supprimer une cellule (accepte path ou groupIndex)
                deleteCellAt(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (!group || !group.cells) return;

                    const hasChildren = group.children && group.children.length > 0;

                    if (group.cells.length === 1 && !hasChildren) {
                        // Si c'est la dernière cellule et pas d'enfants, supprimer le groupe
                        this.deleteGroupAtPath(path);
                    } else {
                        if (confirm('Supprimer cette cellule ?')) {
                            const cell = group.cells[cellIndex];
                            _rawTableDataStore.delete(cell._id);
                            if (this._tables && this._tables[cell._id]) {
                                this._tables[cell._id].destroy();
                                delete this._tables[cell._id];
                            }
                            group.cells.splice(cellIndex, 1);
                        }
                    }
                },

                // Déplacer une cellule dans un groupe (accepte path ou groupIndex)
                moveCellInGroup(pathOrIndex, cellIndex, direction) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.moveCellInGroupAtPath(path, cellIndex, direction);
                },


                /** S'assure qu'une cellule a un nom unique (génération auto si absent). Rétrocompat : uiParameter referenceName → name. */
                ensureCellName(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || !cell.type) return;
                    if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                        cell.name = String(cell.referenceName).trim();
                    }
                    const n = cell.name != null ? String(cell.name).trim() : '';
                    if (!n) cell.name = this.generateUniqueCellName(cell.type, cell._id);
                },

                /** Parcourt toutes les cellules et assigne un nom unique à celles qui n'en ont pas. Rétrocompat : uiParameter referenceName → name. */
                ensureAllCellsHaveNames() {
                    const visit = (groups, pathPrefix) => {
                        for (let gi = 0; gi < (groups || []).length; gi++) {
                            const group = groups[gi];
                            const groupPath = [...pathPrefix, gi];
                            for (let ci = 0; ci < (group.cells || []).length; ci++) {
                                const cell = group.cells[ci];
                                if (!cell || !cell.type) continue;
                                if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                                    cell.name = String(cell.referenceName).trim();
                                }
                                if (!cell.name || !String(cell.name).trim()) {
                                    cell.name = this.generateUniqueCellName(cell.type, cell._id);
                                }
                            }
                            if (group.children) visit(group.children, groupPath);
                        }
                    };
                    for (let pi = 0; pi < this.pages.length; pi++) {
                        visit(this.pages[pi].groups || [], [pi]);
                        if (this.pages[pi].linkGroups) visit(this.pages[pi].linkGroups, [-1, pi]);
                    }
                },

                // Ouvrir la config d'une cellule (accepte path ou groupIndex)
                openCellConfig(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.ensureCellName(path, cellIndex);
                    this.cellConfigModal = { open: true, path, cellIndex };
                    // Forcer la mise à jour des selects après le rendu (Type cellule + Type langage pour markdown)
                    setTimeout(() => {
                        const modal = document.querySelector('[aria-labelledby="modal-cell-config-title"]');
                        const cell = this.getCellAtPath(path, cellIndex);
                        if (!modal || !cell) return;
                        const selects = modal.querySelectorAll('select');
                        if (selects[0]) selects[0].value = cell.type;
                        if (['markdown', 'iframe', 'uiParameter'].includes(cell.type) && selects[1]) {
                            const engine = ConfigManager.getCellEngine(cell, 'main');
                            if (engine && selects[1].value !== engine) selects[1].value = engine;
                        }
                    }, 50);
                },

                closeCellConfig() {
                    this.cellConfigModal.open = false;
                    // Ne pas mettre path/cellIndex à null pour éviter les erreurs Alpine
                    // lors de la transition de fermeture (getCellAtPath(null) → crash)
                },

                getCommonParamsForType(type) { return CellConfigService.getCommonParamsForType(type); },
                getCommonParamsExcludingName(type) { return (CellConfigService.getCommonParamsForType(type) ?? []).filter(p => p !== 'name'); },
                getCommonParamDef(paramKey, type) { return CellConfigService.getCommonParamDef(paramKey, type); },
                getSpecificParamsForType(type) { return CellConfigService.getSpecificParamsForType(type); },
                isSpecificParamVisible(param, cell) { return CellConfigService.isSpecificParamVisible(param, cell); },
                getQueryLabelForType(type, indexOrName) { const schema = CELL_TYPE_SCHEMAS.types[type]; const name = typeof indexOrName === 'string' ? indexOrName : schema?.queryNames?.[indexOrName]; return schema?.queryLabels?.[name] || schema?.queryLabels?.[indexOrName] || CELL_TYPE_SCHEMAS.common.queries?.label || 'Requête SQL'; },
                getQueryCountForType(type) { return CELL_TYPE_SCHEMAS.types[type]?.queryCount ?? 1; },
                getCellValueByPath(cell, path) { return CellConfigService.getCellValueByPath(cell, path); },
                setCellValueByPath(cell, path, value) { CellConfigService.setCellValueByPath(cell, path, value); },

                onCellTypeChange(pathOrIndex, cellIndex, oldType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    _rawTableDataStore.delete(cell._id);
                    cell._results = null;
                    cell._resultInfo = null;

                    const newType = cell.type;
                    const baseName = cell.name && String(cell.name).trim() ? cell.name : this.generateUniqueCellName(newType);
                    if (!cell.name || !String(cell.name).trim()) cell.name = baseName;

                    CellConfigService.applyDefaultsOnTypeChange(cell, newType, { oldType, baseName });

                    if (cell.type === 'source') {
                        if (!cell.name) cell.name = this.generateUniqueSourceName();
                        else if (!ConfigManager.getCellQuery(cell, 'main')?.trim()) ConfigManager.setCellQuery(cell, 'main', `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM '{fileNameUpload}'`);
                        if (!ConfigManager.getCellQuery(cell, 'fallback')?.trim()) ConfigManager.setCellQuery(cell, 'fallback', (CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.find(q => q.name === 'fallback')?.sql || CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.[1]?.sql || `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM read_csv('{fileNameUpload}', HEADER=true, AUTO_DETECT=true, SAMPLE_SIZE=-1, IGNORE_ERRORS=true)`));
                        if (cell._fileName === undefined) cell._fileName = '';
                        if (cell._currentFile === undefined) cell._currentFile = null;
                        if (cell._isDragging === undefined) cell._isDragging = false;
                        if (cell._loaded === undefined) cell._loaded = false;
                        if (cell._showParsedQuery2 === undefined) cell._showParsedQuery2 = false;
                    }
                    if (cell.type === 'uiParameter') {
                        if (cell.referenceName && (!cell.name || !String(cell.name).trim())) cell.name = String(cell.referenceName).trim();
                        if (!ConfigManager.getCellReferenceName(cell)) cell.name = this.generateUniqueCellName('uiParameter', cell._id);
                        if (cell._value === undefined) cell._value = '';
                        if (!cell._options) cell._options = [];
                        cell._initialized = false;
                        cell._userModified = false;
                    }
                    if (cell.type === 'publipostageWord') {
                        if (cell.docxTemplateBase64 === undefined) cell.docxTemplateBase64 = null;
                        if (cell.docxTemplateFileName === undefined) cell.docxTemplateFileName = '';
                        if (cell._showParsedQuery === undefined) cell._showParsedQuery = false;
                        if (cell._showParsedQuery2 === undefined) cell._showParsedQuery2 = false;
                        if (!cell._parseLevels) cell._parseLevels = [];
                        if (!cell._parseLevels2) cell._parseLevels2 = [];
                        if (cell._isDragging === undefined) cell._isDragging = false;
                    }
                    if (['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective'].includes(cell.type)) {
                        if (cell._showParsedQuery === undefined) cell._showParsedQuery = false;
                    }
                    if (cell.type === 'perspective') {
                        cell._perspectiveReady = false;
                        cell._perspectiveWorker = null;
                        cell._perspectiveTable = null;
                    }
                },

                // ─────────────────────────────────────────────────────────────────
                // GESTION DES SOURCES
                // ─────────────────────────────────────────────────────────────────

                /** Génère un nom unique pour une cellule (tous types confondus). excludeId = _id de la cellule à exclure. */
                generateUniqueCellName(type, excludeId = null) {
                    const existingNames = new Set();
                    const collectNames = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell.name && String(cell.name).trim() && cell._id !== excludeId) {
                                    existingNames.add(String(cell.name).trim());
                                }
                            }
                            if (group.children) collectNames(group.children);
                        }
                    };
                    for (const page of this.pages) {
                        collectNames(page.groups || []);
                        if (page.linkGroups) collectNames(page.linkGroups);
                    }
                    const prefix = CELL_TYPE_SCHEMAS?.types[type]?.defaultNamePrefix ?? 'cell';
                    let num = 1;
                    while (existingNames.has(prefix + num)) num++;
                    return prefix + num;
                },

                /** Vérifie si un nom est déjà utilisé par une autre cellule (tous types). */
                isCellNameUsed(name, excludeId = null) {
                    const trimmed = name && String(name).trim();
                    if (!trimmed) return false;
                    const collectFromGroups = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell._id !== excludeId && cell.name && String(cell.name).trim() === trimmed) return true;
                            }
                            if (group.children && collectFromGroups(group.children)) return true;
                        }
                        return false;
                    };
                    for (const page of this.pages) {
                        if (collectFromGroups(page.groups || [])) return true;
                        if (page.linkGroups && collectFromGroups(page.linkGroups)) return true;
                    }
                    return false;
                },

                generateUniqueSourceName() {
                    return this.generateUniqueCellName('source');
                },



                // ─────────────────────────────────────────────────────────────────
                // GESTION DE LA CELLULE SOURCE (simple)
                // ─────────────────────────────────────────────────────────────────
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

                // ─────────────────────────────────────────────────────────────────
                // EXÉCUTION DES CELLULES (unifié avec path)
                // ─────────────────────────────────────────────────────────────────

                // Exécuter une cellule (accepte path ou groupIndex)
                async runCellAt(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) {
                        console.error('❌ Cell not found!');
                        return;
                    }

                    cell._status = 'running';
                    this.isLoading = true;
                    this.setStatus(`Exécution de ${cell.name || cell.type}...`, 'loading');

                    try {
                        const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                        const handler = schema?.executeHandler;
                        if (handler && typeof this[handler] === 'function') {
                            await this[handler](cell);
                        } else if (handler !== null) {
                            console.warn('⚠️ Unknown cell type or missing handler:', cell.type);
                        }

                        cell._status = 'success';
                        this.setStatus(`${cell.name || cell.type} exécuté`, 'success');
                    } catch (error) {
                        cell._status = 'error';
                        cell._resultInfo = 'Erreur: ' + error.message;
                        this.setStatus('Erreur: ' + error.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },

                // Exécuter toutes les cellules d'un groupe (accepte path ou groupIndex)
                async runGroup(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    return await this.runGroupAtPath(path);
                },

                // ─────────────────────────────────────────────────────────────────
                // PARSING RÉCURSIF PARTAGÉ (utilisé par SQL et Table)
                // ─────────────────────────────────────────────────────────────────

                // Parser une requête de manière récursive et remplir cell._parseLevels ou cell._parseLevels2
                // queryIndex: 0 = query principale, 1 = query2 (ex: noms de fichiers publipostage)
                // allowEmpty: si true, les résultats vides sont remplacés par '' au lieu de lever une erreur
                async parseQueryRecursively(cell, queryIndex = 0, allowEmpty = false) {
                    const levelsKey = queryIndex === 1 ? '_parseLevels2' : '_parseLevels';
                    cell[levelsKey] = [];

                    let currentQuery = this.parseQueryWithParameters(ConfigManager.getCellQuery(cell, queryIndex) || '');
                    let level = 0;
                    const maxLevels = 10;

                    const parseRecursive = async (query) => {
                        if (level >= maxLevels) {
                            throw new Error('Nombre maximum de niveaux d\'imbrication atteint (10)');
                        }

                        const posClose = query.indexOf('}}');
                        if (posClose === -1) return query;
                        const posOpen = query.lastIndexOf('{{', posClose);
                        if (posOpen === -1) return query;

                        const innerQuery = query.substring(posOpen + 2, posClose).trim();
                        level++;

                        const statusSuffix = queryIndex === 1 ? ' (query2)' : '';
                        this.setStatus(`Parsing niveau ${level}${statusSuffix}...`, 'loading');

                        const resolvedInnerQuery = await parseRecursive(innerQuery);
                        const results = await DuckDBManager.executeQuery(resolvedInnerQuery);

                        let replacement;
                        if (allowEmpty) {
                            const firstVal = results.length > 0 ? Object.values(results[0])[0] : null;
                            replacement = (firstVal !== null && firstVal !== undefined) ? String(firstVal) : '';
                        } else {
                            if (!results || results.length === 0) {
                                throw new Error(`Niveau ${level}: La requête n'a retourné aucun résultat`);
                            }
                            const firstVal = Object.values(results[0])[0];
                            if (firstVal === null || firstVal === undefined) {
                                throw new Error(`Niveau ${level}: Le résultat est null ou undefined`);
                            }
                            replacement = String(firstVal);
                        }

                        cell[levelsKey].push({
                            level: level,
                            innerQuery: resolvedInnerQuery,
                            replacement: replacement
                        });

                        const replStr = String(replacement).replace(/\$/g, '$$$$');
                        const newQuery = query.substring(0, posOpen) + replStr + query.substring(posClose + 2);
                        return await parseRecursive(newQuery);
                    };

                    const finalQuery = await parseRecursive(currentQuery);
                    cell[levelsKey].push({ level: 'final', innerQuery: finalQuery, replacement: null });
                    return finalQuery;
                },

                async executeSqlRecursiveParseCell(cell) {

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.warn('❌ cell.query est vide ou undefined!');
                        return;
                    }

                    this.setStatus('Parsing récursif...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');

                        // Détecter si la requête finale est un COPY ([\s\S] au lieu de . pour traverser les retours à la ligne)
                        const copyRegex = /COPY\s+[\s\S]+\bTO\s+'([^']+)'/i;
                        const copyMatch = finalQuery.match(copyRegex);

                        if (copyMatch) {
                            // Mode export : la requête finale contient un COPY
                            this.setStatus('Export du fichier...', 'loading');

                            const fileName = copyMatch[1];

                            try {
                                // Exécuter le COPY
                                await DuckDBManager.executeQuery(finalQuery);

                                // Déterminer l'extension pour adapter les paramètres de retry
                                const fileExt = fileName.toLowerCase().split('.').pop();
                                const isBinaryFormat = ['xlsx', 'xls', 'parquet', 'pq', 'arrow', 'ipc', 'avro'].includes(fileExt);
                                
                                // Les formats binaires complexes (notamment XLSX) nécessitent plus de tentatives
                                const maxRetries = isBinaryFormat ? 15 : 10;
                                const delayMs = isBinaryFormat ? 300 : 200;

                                // Attendre que le fichier soit disponible avec retry
                                const buffer = await DuckDBManager.waitForFile(fileName, maxRetries, delayMs);
                                
                                const bufLen = buffer?.byteLength ?? 0;
                                if (bufLen > 0) {
                                    const view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer || buffer);
                                    if (fileExt === 'xlsx' && (view[0] !== 0x50 || view[1] !== 0x4B)) {
                                        console.warn(`⚠️ [EXPORT] XLSX invalide: doit commencer par PK (0x50 0x4B), trouvé: 0x${view[0]?.toString(16)} 0x${view[1]?.toString(16)}`);
                                    }
                                }

                                // Déterminer le MIME type selon l'extension du fichier
                                let mime = 'text/csv;charset=utf-8;'; // par défaut CSV
                                
                                switch (fileExt) {
                                    // Formats Parquet
                                    case 'parquet':
                                    case 'pq':
                                        mime = 'application/octet-stream';
                                        break;
                                    
                                    // Format Excel
                                    case 'xlsx':
                                        mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                                        break;
                                    case 'xls':
                                        mime = 'application/vnd.ms-excel';
                                        break;
                                    
                                    // Formats JSON
                                    case 'json':
                                    case 'jsonl':
                                    case 'ndjson':
                                        mime = 'application/json;charset=utf-8;';
                                        break;
                                    
                                    // Formats texte
                                    case 'txt':
                                        mime = 'text/plain;charset=utf-8;';
                                        break;
                                    case 'tsv':
                                        mime = 'text/tab-separated-values;charset=utf-8;';
                                        break;
                                    case 'csv':
                                        mime = 'text/csv;charset=utf-8;';
                                        break;
                                    
                                    // Formats XML
                                    case 'xml':
                                        mime = 'application/xml;charset=utf-8;';
                                        break;
                                    
                                    // Formats binaires génériques
                                    case 'bin':
                                    case 'dat':
                                    case 'blob':
                                        mime = 'application/octet-stream';
                                        break;
                                    
                                    // Format Arrow
                                    case 'arrow':
                                    case 'ipc':
                                        mime = 'application/vnd.apache.arrow.stream';
                                        break;
                                    
                                    // Format Avro
                                    case 'avro':
                                        mime = 'application/avro';
                                        break;
                                    
                                    // Formats compressés
                                    case 'gz':
                                    case 'gzip':
                                        mime = 'application/gzip';
                                        break;
                                    case 'zip':
                                        mime = 'application/zip';
                                        break;
                                    case 'zst':
                                    case 'zstd':
                                        mime = 'application/zstd';
                                        break;
                                    
                                    // Valeur par défaut pour autres formats
                                    default:
                                        mime = 'application/octet-stream';
                                        break;
                                }

                                // Télécharger le fichier (ou l'ajouter au zip si mode zip actif)
                                // Copier dans un nouveau Uint8Array pour éviter problèmes SharedArrayBuffer / mémoire partagée
                                let view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer ?? buffer, buffer.byteOffset ?? 0, buffer.byteLength);
                                // Corriger bug DuckDB: copyFileToBuffer préfixe parfois 1 octet parasite avant les fichiers XLSX (ZIP)
                                if (fileExt === 'xlsx' && view.length >= 3 && view[0] !== 0x50 && view[1] === 0x50 && view[2] === 0x4B) {
                                    view = view.slice(1);
                                }
                                const dataForBlob = view.slice(0);
                                const blob = new Blob([dataForBlob], { type: mime });
                                const downloadFileName = fileName.split('/').pop();
                                this.downloadOrZipFile(downloadFileName, blob, mime);

                                cell._results = [];
                                cell._resultInfo = `✅ Fichier exporté: ${fileName} (${buffer.byteLength} octets) - ${cell._parseLevels.length - 1} niveau(x) de parsing`;
                            } catch (copyError) {
                                console.error('❌ Erreur lors de la récupération du fichier exporté:', copyError);

                                // Si copyFileToBuffer échoue, essayer d'exporter directement les résultats
                                this.setStatus('Récupération alternative des résultats...', 'loading');

                                // Extraire la requête SELECT de la commande COPY
                                const copyContentMatch = finalQuery.match(/COPY\s+\(([\s\S]+)\)\s+TO\s+/i);

                                if (copyContentMatch) {
                                    const selectQuery = copyContentMatch[1];
                                    const results = await DuckDBManager.executeQuery(selectQuery);

                                    // Convertir en TSV
                                    if (results.length > 0) {
                                        const headers = Object.keys(results[0]);
                                        const tsvContent = [
                                            headers.join('\t'),
                                            ...results.map(row => headers.map(h => row[h] ?? '').join('\t'))
                                        ].join('\n');

                                        const blob = new Blob([tsvContent], { type: 'text/plain;charset=utf-8;' });
                                        const downloadFileName = fileName.split('/').pop();
                                        this.downloadOrZipFile(downloadFileName, blob, 'text/plain;charset=utf-8;');

                                        cell._results = [];
                                        cell._resultInfo = `✅ Fichier exporté (mode alternatif): ${fileName} - ${results.length} ligne(s)`;
                                    } else {
                                        throw new Error('Aucun résultat à exporter');
                                    }
                                } else {
                                    throw copyError;
                                }
                            } finally {
                                // Supprimer le fichier du VFS pour éviter que la prochaine exécution écrase/échoue
                                await DuckDBManager.dropFile(fileName);
                            }
                        } else {
                            // Mode normal : exécuter et stocker les résultats
                            const finalResults = await DuckDBManager.executeQuery(finalQuery);
                            cell._results = finalResults;
                            cell._resultInfo = `✅ ${finalResults.length} ligne(s) - ${cell._parseLevels.length - 1} niveau(x) de parsing`;
                            // Si tabular, stocker dans _rawTableDataStore et rendre le tableau (comme type 'table')
                            if (this.isSqlResultTabular(cell)) {
                                const maxRows = cell.maxRows || 100000;
                                const truncated = finalResults.length > maxRows;
                                const rawResults = finalResults.slice(0, maxRows);
                                _rawTableDataStore.set(cell._id, rawResults);
                                cell._results = rawResults;
                                if (truncated) cell._resultInfo = `✅ ${finalResults.length} ligne(s) (limité à ${maxRows})` + (cell._parseLevels?.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                                await this.$nextTick();
                                await this.$nextTick(); // Double tick pour laisser Alpine rendre le template x-if du conteneur table
                                await this.renderTableInContainer(cell, true);
                            }
                        }

                        this.setStatus('SQL Recursive Parse exécuté', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                async executeTableCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return;

                    this.setStatus('Chargement tableau...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');

                        // Exécuter la requête finale
                        const results = await DuckDBManager.executeQuery(finalQuery);

                        const maxRows = cell.maxRows || 100000;
                        const truncated = results.length > maxRows;
                        const rawResults = results.slice(0, maxRows);
                        // Stocker les données brutes hors Alpine pour éviter le freeze
                        // dû aux millions de traps Proxy lors de l'itération
                        _rawTableDataStore.set(cell._id, rawResults);
                        cell._results = rawResults;
                        cell._resultInfo = `${results.length} ligne(s)` + (truncated ? ` (limité à ${maxRows})` : '') +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');

                        await this.$nextTick();

                        // Rendre le tableau (fromExecute=true lève le garde anti-cascade)
                        await this.renderTableInContainer(cell, true);

                        this.setStatus('Tableau chargé', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                // Afficher l'éditeur SQL (devMode ou clientVisible sur queries[0])
                showSqlEditorVisible(cell) {
                    return this.devMode || ConfigManager.getCellQueryClientVisible(cell, 0);
                },
                // Helpers pour distinguer résultat tabular vs texte/JSON (cells sqlRecursiveParse)
                isSqlResultTabular(cell) {
                    const r = cell?._results;
                    if (!r || !Array.isArray(r) || r.length === 0) return false;
                    const row = r[0];
                    const keys = Object.keys(row);
                    if (keys.length > 1) return true;
                    if (r.length > 1) return true;
                    const val = row[keys[0]];
                    return typeof val !== 'string';
                },
                isSqlResultText(cell) {
                    const r = cell?._results;
                    if (!r || !Array.isArray(r) || r.length !== 1) return false;
                    const keys = Object.keys(r[0]);
                    return keys.length === 1 && typeof r[0][keys[0]] === 'string';
                },
                getSqlResultAsText(cell) {
                    if (!this.isSqlResultText(cell)) return '';
                    const keys = Object.keys(cell._results[0]);
                    return cell._results[0][keys[0]] ?? '';
                },

                // Fonction pour rendre un tableau dans son conteneur (appelée aussi par x-init)
                async renderTableInContainer(cell, fromExecute = false) {
                    const containerId = 'table-' + cell._id;
                    const container = document.getElementById(containerId);

                    // Si le conteneur a été recréé (ex: changement de page), réinitialiser le garde
                    // pour permettre le rendu du SimpleDataTable dans le nouveau DOM.
                    if (container && !container.querySelector('.datatable-wrapper')) {
                        cell._tableRenderGuard = false;
                    }

                    // Garde anti-cascade : les mutations DOM du DataTable déclenchent
                    // le MutationObserver Alpine → x-init re-fire → boucle infinie.
                    // Seul executeTableCell peut lever ce garde (fromExecute = true).
                    if (cell._tableRenderGuard && !fromExecute) return;
                    // Utiliser les données brutes du store (hors Proxy Alpine) pour éviter
                    // le freeze lors de l'itération sur des grands jeux de données.
                    // Fallback sur cell._results si le store est vide (ex: x-init au chargement).
                    const rawResults = _rawTableDataStore.get(cell._id) || cell._results;

                    if (container && rawResults && rawResults.length > 0) {
                        await CDNManager.loadSimpleDatatables();
                        if (this._tables[cell._id]) {
                            this._tables[cell._id].destroy();
                        }

                        const columns = Object.keys(rawResults[0]).map(key => ({
                            title: key,
                            field: key
                        }));

                        const tableData = {
                            headings: Object.keys(rawResults[0]),
                            data: rawResults.map(row => Object.values(row))
                        };

                        const dataTable = new simpleDatatables.DataTable('#' + containerId, {
                            data: tableData,
                            perPage: 10,
                            perPageSelect: [5, 10, 25, 50],
                            searchable: cell.type === 'table',
                            sortable: true,
                            labels: {
                                placeholder: "Rechercher...",
                                perPage: "entrées par page",
                                noRows: "Aucune donnée",
                                info: "Affichage de {start} à {end} sur {rows} entrées"
                            },
                            template: (options) => {
                                const c = options.classes;
                                const top = options.searchable
                                    ? `<div class="${c.top}"><div class="${c.search}"><input class="${c.input}" placeholder="${options.labels.placeholder || ''}" type="search"></div></div>`
                                    : `<div class="${c.top}"></div>`;
                                const bottom = options.paging
                                    ? `<div class="${c.bottom}" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;">
<div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">${options.perPageSelect ? `<div class="${c.dropdown}" style="display:flex;align-items:center;gap:0.5rem;"><label>${options.labels.perPage}</label><select class="${c.selector}"></select></div>` : ''}<div class="${c.info}"></div></div><nav class="${c.pagination}"></nav></div>`
                                    : '';
                                return `${top}<div class="${c.container}"></div>${bottom}`;
                            },
                            tableRender: (_data, table, type) => {
                                if (type === "print") {
                                    return table;
                                }

                                // Classes DaisyUI/Tailwind sur la table
                                table.attributes = table.attributes || {};
                                table.attributes.class = "table table-zebra table-pin-rows w-full";

                                const tHead = table.childNodes[0];
                                const tBody = table.childNodes[1];

                                // Style header
                                if (tHead && tHead.childNodes) {
                                    tHead.childNodes.forEach((tr, trIndex) => {
                                        tr.attributes = tr.attributes || {};
                                        tr.attributes.class = "bg-base-200";
                                        if (tr.childNodes) {
                                            tr.childNodes.forEach((th, thIndex) => {
                                                th.attributes = th.attributes || {};
                                                const stickyClass = thIndex === 0 ? " sticky left-0 z-10 bg-base-200" : "";
                                                th.attributes.class = "text-base-content font-semibold text-sm px-3 py-2" + stickyClass;
                                            });
                                        }
                                    });
                                }

                                // Style body rows
                                if (tBody && tBody.childNodes) {
                                    tBody.childNodes.forEach((tr, trIndex) => {
                                        tr.attributes = tr.attributes || {};
                                        const isEven = trIndex % 2 === 0;
                                        const rowClass = isEven ? "bg-base-100" : "bg-base-200/50";
                                        tr.attributes.class = `${rowClass} hover:bg-base-300/50 transition-colors`;
                                        if (tr.childNodes) {
                                            tr.childNodes.forEach((td, tdIndex) => {
                                                td.attributes = td.attributes || {};
                                                const stickyClass = tdIndex === 0 ? ` sticky left-0 z-10 ${isEven ? "bg-base-100" : "bg-base-200"}` : "";
                                                td.attributes.class = "text-base-content text-sm px-3 py-2" + stickyClass;
                                            });
                                        }
                                    });
                                }

                                // Ajouter ligne de filtres par colonne
                                const filterHeaders = {
                                    nodeName: "TR",
                                    attributes: { class: "bg-base-100 filter-row" },
                                    childNodes: tHead.childNodes[0].childNodes.map(
                                        (_th, index) => ({
                                            nodeName: "TH",
                                            attributes: {
                                                class: "px-2 py-1" + (index === 0 ? " sticky left-0 z-10 bg-base-100" : "")
                                            },
                                            childNodes: [
                                                {
                                                    nodeName: "INPUT",
                                                    attributes: {
                                                        class: "input input-bordered input-xs w-full column-filter",
                                                        type: "search",
                                                        placeholder: "Filtrer...",
                                                        "data-column-index": index
                                                    }
                                                }
                                            ]
                                        })
                                    )
                                };
                                tHead.childNodes.push(filterHeaders);
                                return table;
                            }
                        });

                        this._tables[cell._id] = dataTable;

                        // Ajouter les event listeners pour les filtres de colonne
                        dataTable.on('datatable.init', () => {
                            const filterInputs = container.querySelectorAll('.column-filter');
                            const columnFilters = {};

                            filterInputs.forEach(input => {
                                input.addEventListener('input', (e) => {
                                    const columnIndex = parseInt(e.target.dataset.columnIndex);
                                    const value = e.target.value.trim();

                                    // Stocker la valeur du filtre pour cette colonne
                                    if (value) {
                                        columnFilters[columnIndex] = value;
                                    } else {
                                        delete columnFilters[columnIndex];
                                    }

                                    // Construire les queries pour multiSearch
                                    const queries = Object.entries(columnFilters).map(([col, term]) => ({
                                        terms: [term],
                                        columns: [parseInt(col)]
                                    }));

                                    // Appliquer le filtre multi-colonnes
                                    dataTable.multiSearch(queries);
                                });
                            });
                        });

                        // Garde anti-cascade : les mutations DOM du DataTable déclenchent
                        // Alpine MutationObserver → x-init re-fire → on bloque les appels suivants.
                        cell._tableRenderGuard = true;
                    }
                },

                async executeMarkdownCell(cell) {
                    const languageType = ConfigManager.getCellEngine(cell, 'main');
                    if (languageType === 'text') {
                        cell._markdownContent = ConfigManager.getCellEditableContent(cell);
                        cell._resultInfo = '✅ Markdown (texte)';
                        return;
                    }
                    const cellQuery = ConfigManager.getCellQuery(cell, 'main');
                    if (!cellQuery?.trim()) return;

                    this.setStatus('Chargement Markdown...', 'loading');

                    try {
                        let mdContent;
                        if (languageType === 'js') {
                            cell._parseLevels = [];
                            let jsCode = this.parseQueryWithParameters(cellQuery || '');
                            cell._parseLevels.push({ level: 'final', innerQuery: jsCode, replacement: null });
                            try {
                                const result = eval(jsCode);
                                mdContent = typeof result === 'string' ? result : String(result);
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                        } else {
                            const cellLike = { queries: [{ name: 'main', sql: cellQuery, engine: 'sql', clientVisible: false }], _parseLevels: [] };
                            const finalQuery = await this.parseQueryRecursively(cellLike);
                            cell._parseLevels = cellLike._parseLevels || [];
                            this.setStatus('Exécution de la requête...', 'loading');
                            const results = await DuckDBManager.executeQuery(finalQuery);
                            mdContent = results.map(row => Object.values(row).join('')).join('\n');
                        }
                        cell._markdownContent = mdContent;
                        this.setStatus('Markdown chargé', 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                async executeIframeCell(cell) {
                    const cellQuery = ConfigManager.getCellQuery(cell, 0);
                    if (!cellQuery?.trim()) return;

                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    this.setStatus('Chargement HTML...', 'loading');

                    try {
                        let htmlContent;

                        if (languageType === 'text') {
                            htmlContent = (cellQuery || '').trim();
                            cell._parseLevels = [];
                            cell._resultInfo = '✅ Texte utilisé tel quel';
                        } else if (languageType === 'js') {
                            cell._parseLevels = [];
                            let jsCode = this.parseQueryWithParameters(cellQuery || '');
                            cell._parseLevels.push({ level: 'final', innerQuery: jsCode, replacement: null });
                            try {
                                const result = eval(jsCode);
                                htmlContent = typeof result === 'string' ? result : String(result);
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                            cell._resultInfo = '✅ HTML généré (JavaScript)';
                        } else {
                            const finalQuery = await this.parseQueryRecursively(cell);
                            this.setStatus('Exécution de la requête finale...', 'loading');
                            const results = await DuckDBManager.executeQuery(finalQuery);
                            htmlContent = results.map(row => Object.values(row).join('')).join('\n');
                            cell._resultInfo = `✅ HTML généré` + (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                        }

                        cell._htmlContent = htmlContent;
                        await this.$nextTick();
                        this.renderIframeInContainer(cell);
                        this.setStatus('HTML chargé', 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                // Fonction pour rendre un iframe dans son conteneur (appelée aussi par x-init)
                renderIframeInContainer(cell) {
                    const iframe = document.getElementById('iframe-' + cell._id);
                    if (iframe && cell._htmlContent) {
                        const doc = iframe.contentDocument || iframe.contentWindow.document;
                        doc.open();
                        doc.write(cell._htmlContent);
                        doc.close();
                    }
                },

                async executeSqlStatCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return;

                    this.setStatus('Exécution de la stat SQL...', 'loading');

                    try {
                        // Utiliser la fonction partagée pour le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête finale...', 'loading');
                        const results = await DuckDBManager.executeQuery(finalQuery);

                        if (!results || results.length === 0) {
                            cell._results = [];
                            cell._statValue = '-';
                            cell._resultInfo = 'Aucun résultat';
                            return;
                        }

                        // Prendre la première colonne de la première ligne
                        const firstRow = results[0];
                        const statValue = Object.values(firstRow)[0];

                        cell._results = results;
                        cell._statValue = statValue !== null && statValue !== undefined ? String(statValue) : '-';
                        cell._resultInfo = `✅ Stat calculée` + (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');

                        this.setStatus('Stat SQL exécutée', 'success');
                    } catch (error) {
                        // En cas d'erreur, on garde les niveaux déjà parsés pour debug
                        throw error;
                    }
                },

                async executeUiParameterCell(cell) {
                    cell._paramError = null;

                    // Si preserveUserValue est activé et que l'utilisateur a modifié la valeur, ne pas ré-exécuter
                    if (cell.preserveUserValue && cell._userModified) {
                        this.setStatus(`${ConfigManager.getCellReferenceName(cell)} : valeur utilisateur préservée`, 'success');
                        return;
                    }

                    try {
                        const languageType = ConfigManager.getCellEngine(cell, 0);
                        let results;

                        if (languageType === 'text') {
                            // Mode Texte : le contenu est retourné directement, pas d'engine
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} : texte utilisé tel quel`, 'success');
                            const textValue = (ConfigManager.getCellQuery(cell, 0) || '').trim();
                            if (cell.paramType === 'dropdown') {
                                const lines = textValue.split('\n').filter(Boolean);
                                results = lines.map(line => ({ col1: line, col2: line }));
                            } else {
                                results = [{ value: textValue }];
                            }
                        } else if (languageType === 'js') {
                            // Mode JavaScript
                            this.setStatus('Exécution du code JavaScript...', 'loading');

                            // Initialiser _parseLevels
                            cell._parseLevels = [];

                            // Parser les paramètres $param dans le code JS
                            let jsCode = ConfigManager.getCellQuery(cell, 0) || '';
                            const originalCode = jsCode;
                            jsCode = this.parseQueryWithParameters(jsCode);


                            // Stocker le code final
                            cell._parseLevels.push({
                                level: 'final',
                                innerQuery: jsCode,
                                replacement: null
                            });

                            // Exécuter le code JavaScript
                            try {
                                const jsResult = eval(jsCode);

                                // Convertir le résultat en format compatible
                                if (cell.paramType === 'dropdown') {
                                    // Pour dropdown, on attend un tableau
                                    if (Array.isArray(jsResult)) {
                                        results = jsResult.map(item => {
                                            if (Array.isArray(item)) {
                                                // Tableau à 2 colonnes : [valeur, libellé]
                                                return {
                                                    col1: String(item[0] || ''),
                                                    col2: item.length > 1 ? String(item[1]) : String(item[0] || '')
                                                };
                                            } else {
                                                // Valeur simple : une seule colonne
                                                return { col1: String(item) };
                                            }
                                        });
                                    } else {
                                        throw new Error('Le code JS doit retourner un tableau pour un dropdown');
                                    }
                                } else {
                                    // Pour input et range, on attend une valeur simple
                                    results = [{ value: jsResult }];
                                }
                            } catch (jsError) {
                                throw new Error(`Erreur JS: ${jsError.message}`);
                            }
                        } else {
                            // Mode SQL (par défaut)
                            const finalQuery = await this.parseQueryRecursively(cell);
                            this.setStatus('Exécution de la requête finale...', 'loading');
                            results = await DuckDBManager.executeQuery(finalQuery);
                        }

                        if (cell.paramType === 'dropdown') {
                            if (results.length === 0) {
                                cell._options = [];
                                cell._value = '';
                                cell._paramError = 'La requête n\'a retourné aucun résultat';
                                return;
                            }

                            // Déterminer les colonnes disponibles
                            const columnKeys = Object.keys(results[0]);
                            const firstColumnKey = columnKeys[0];
                            const secondColumnKey = columnKeys.length > 1 ? columnKeys[1] : null;

                            // Construire les options avec value et label
                            cell._options = results.map(row => {
                                const value = String(row[firstColumnKey]);
                                const label = secondColumnKey ? String(row[secondColumnKey]) : value;
                                return { value, label };
                            });

                            // Initialiser avec la première valeur si pas déjà défini
                            const currentValues = cell._options.map(opt => opt.value);
                            if (!cell._value || !currentValues.includes(cell._value)) {
                                cell._value = cell._options[0]?.value || '';
                            }

                            cell._initialized = true;
                            this.setStatus(`Options ${ConfigManager.getCellReferenceName(cell)} chargées`, 'success');

                        } else if (cell.paramType === 'input') {
                            // Charger la valeur initiale si une requête est définie
                            if (results.length > 0) {
                                const firstColumnKey = Object.keys(results[0])[0];
                                const rawValue = results[0][firstColumnKey];
                                // Formater la valeur selon le type d'input (date, time, etc.)
                                cell._value = formatValueForInputType(rawValue, cell.inputType);
                            }

                            cell._initialized = true;
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success');

                        } else if (cell.paramType === 'range') {
                            // Charger la valeur initiale si une requête est définie
                            if (results.length > 0) {
                                const firstColumnKey = Object.keys(results[0])[0];
                                const rawValue = results[0][firstColumnKey];
                                const numValue = Number(rawValue);
                                const min = cell.rangeMin ?? 0;
                                const max = cell.rangeMax ?? 100;
                                // Clamper la valeur entre min et max
                                cell._value = Math.min(max, Math.max(min, isNaN(numValue) ? min : numValue));
                            } else if (cell._value === '' || cell._value === undefined) {
                                // Valeur par défaut = min
                                cell._value = cell.rangeMin ?? 0;
                            }

                            cell._initialized = true;
                            this.setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success');
                        }

                        // Réinitialiser le flag _userModified après une exécution réussie
                        cell._userModified = false;
                    } catch (error) {
                        cell._paramError = 'Erreur: ' + error.message;
                        this.setStatus('Erreur: ' + error.message, 'error');
                    }
                },

                async executePublipostageWordCell(cell) {
                    // Charger PizZip et Docxtemplater à la demande
                    await CDNManager.loadDocxtemplater();

                    if (!cell.docxTemplateBase64) {
                        console.error('❌ No template loaded');
                        throw new Error('Aucun template Word chargé');
                    }

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.error('❌ No data query');
                        throw new Error('Requête de données manquante');
                    }

                    if (!ConfigManager.getCellQuery(cell, 1)?.trim()) {
                        console.error('❌ No filename query');
                        throw new Error('Requête de nom de fichier manquante');
                    }

                    this.setStatus('Exécution du publipostage Word...', 'loading');

                    try {
                        // Parser et exécuter query (données)
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Récupération des données...', 'loading');
                        const dataResults = await DuckDBManager.executeQuery(finalQuery);

                        if (!dataResults || dataResults.length === 0) {
                            cell._resultInfo = 'Aucune donnée à traiter';
                            return;
                        }

                        // Parser et exécuter query2 (noms de fichiers)
                        const finalQuery2 = await this.parseQueryRecursively(cell, 1, true);

                        this.setStatus('Récupération des noms de fichiers...', 'loading');
                        const filenameResults = await DuckDBManager.executeQuery(finalQuery2);

                        if (!filenameResults || filenameResults.length === 0) {
                            throw new Error('La requête de nom de fichier n\'a retourné aucun résultat');
                        }

                        // Vérifier que le nombre de lignes correspond
                        if (dataResults.length !== filenameResults.length) {
                            throw new Error(`Nombre de lignes différent: ${dataResults.length} données vs ${filenameResults.length} noms de fichiers`);
                        }

                        // Décoder le template
                        const templateArrayBuffer = FileHandler.base64ToUint8Array(cell.docxTemplateBase64).buffer;

                        // Générer les documents
                        this.setStatus('Génération des documents Word...', 'loading');
                        let generatedCount = 0;

                        for (let i = 0; i < dataResults.length; i++) {
                            const rowData = dataResults[i];
                            const filenameRow = filenameResults[i];
                            const filename = Object.values(filenameRow)[0] || `document_${i + 1}.docx`;

                            // Parser les données JSON si nécessaire
                            let templateData = rowData;

                            // Si la ligne contient une seule colonne avec du JSON, le parser
                            const keys = Object.keys(rowData);
                            if (keys.length === 1) {
                                const value = rowData[keys[0]];
                                if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                                    try {
                                        templateData = JSON.parse(value);
                                    } catch (e) {
                                        console.warn('⚠️ Failed to parse JSON, using raw data:', e);
                                    }
                                }
                            }

                            // Créer une nouvelle instance du template pour chaque document
                            const zip = new PizZip(templateArrayBuffer);
                            const doc = new window.docxtemplater(zip, {
                                paragraphLoop: true,
                                linebreaks: true,
                            });

                            // Injecter les données
                            doc.render(templateData);

                            // Générer le blob
                            const blob = doc.getZip().generate({
                                type: 'blob',
                                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            });

                            // Télécharger le fichier (ou l'ajouter au zip si mode zip actif)
                            this.downloadOrZipFile(filename, blob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
                            generatedCount++;

                            this.setStatus(`Génération ${generatedCount}/${dataResults.length}...`, 'loading');
                        }

                        cell._resultInfo = `✅ ${generatedCount} document(s) généré(s)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing (query)` : '') +
                            (cell._parseLevels2.length > 1 ? ` - ${cell._parseLevels2.length - 1} niveau(x) de parsing (query2)` : '');
                        this.setStatus(`${generatedCount} documents générés`, 'success');
                    } catch (error) {
                        throw error;
                    }
                },

                async executePdfmeCell(cell) {

                    // Charger pdfme à la demande (ESM dynamic import)
                    this.setStatus('Chargement de pdfme...', 'loading');
                    try {
                        var pdfme = await CDNManager.loadPdfme();
                    } catch (loadErr) {
                        console.error('[pdfme] ERREUR chargement CDN:', loadErr);
                        throw loadErr;
                    }

                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        console.error('[pdfme] Requête SQL manquante');
                        throw new Error('Requête SQL manquante');
                    }

                    const pdfmeTemplate = typeof cell.json === 'string' ? cell.json : (cell.json ? JSON.stringify(cell.json) : null);
                    if (!pdfmeTemplate?.trim()) {
                        console.error('[pdfme] Template pdfme manquant');
                        throw new Error('Template pdfme manquant');
                    }

                    this.setStatus('Exécution de la requête SQL...', 'loading');

                    try {
                        // Parser et exécuter la requête SQL
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Récupération des données...', 'loading');
                        const data = await DuckDBManager.executeQuery(finalQuery);

                        if (!data || data.length === 0) {
                            console.warn('[pdfme] Aucune donnée retournée par la requête');
                            cell._resultInfo = 'Aucune donnée à exporter';
                            return;
                        }

                        // Récupérer le nom du fichier depuis query2 si défini
                        let pdfFileName = 'export.pdf'; // Sera écrasé par query 2
                        if (ConfigManager.getCellQuery(cell, 1)?.trim()) {
                            this.setStatus('Récupération du nom de fichier...', 'loading');

                            const finalQuery2 = await this.parseQueryRecursively(cell, 1, true);
                            const filenameResults = await DuckDBManager.executeQuery(finalQuery2);

                            if (filenameResults && filenameResults.length > 0) {
                                const filenameValue = Object.values(filenameResults[0])[0];
                                if (filenameValue) {
                                    pdfFileName = String(filenameValue);
                                }
                            }
                        }

                        this.setStatus('Génération du PDF (pdfme)...', 'loading');

                        // Parser le template JSON
                        let template;
                        try {
                            template = JSON.parse(pdfmeTemplate);
                        } catch (parseErr) {
                            console.error('[pdfme] ERREUR parsing template JSON:', parseErr);
                            throw new Error('Template JSON invalide: ' + parseErr.message);
                        }

                        // Résoudre les plugins depuis @pdfme/schemas
                        let pluginsConfig;
                        try {
                            pluginsConfig = JSON.parse('{"Text": "text", "Table": "table"}'); // Chargés automatiquement
                        } catch (parseErr) {
                            console.error('[pdfme] ERREUR parsing plugins JSON:', parseErr);
                            throw new Error('Plugins JSON invalide: ' + parseErr.message);
                        }

                        const plugins = {};
                        for (const [name, path] of Object.entries(pluginsConfig)) {
                            const parts = String(path).split('.');
                            let obj = pdfme.schemas;
                            for (const part of parts) {
                                if (obj && obj[part] !== undefined) {
                                    obj = obj[part];
                                } else {
                                    console.error(`[pdfme] Plugin introuvable: "${path}" partie "${part}"`, 'Clés disponibles:', obj ? Object.keys(obj) : 'obj est null/undefined');
                                    throw new Error(`Plugin introuvable: "${path}" (partie "${part}" non trouvée dans @pdfme/schemas). Clés disponibles: ${obj ? Object.keys(obj).join(', ') : 'aucune'}`);
                                }
                            }
                            plugins[name] = obj;
                        }

                        // Chaque ligne SQL = 1 input (1 page). Les noms de colonnes = noms des schemas
                        // Les valeurs JSON (arrays, objects) sont parsées automatiquement

                        // Extraire tous les noms de champs du template pour les valeurs par défaut
                        const fieldNames = new Set();
                        if (template.schemas && Array.isArray(template.schemas)) {
                            template.schemas.forEach(pageSchemas => {
                                if (Array.isArray(pageSchemas)) {
                                    pageSchemas.forEach(s => {
                                        if (s.name) fieldNames.add(s.name);
                                    });
                                }
                            });
                        }

                        const inputs = data.map((row, i) => {
                            const input = {};

                            // 1. Initialiser avec le contenu statique du template comme valeur par défaut
                            template.schemas.forEach(pageSchemas => {
                                pageSchemas.forEach(s => {
                                    if (s.name) {
                                        let val = s.content || '';
                                        try {
                                            const parsed = JSON.parse(val);
                                            input[s.name] = (Array.isArray(parsed) || typeof parsed === 'object') ? parsed : String(val);
                                        } catch {
                                            input[s.name] = String(val);
                                        }
                                    }
                                });
                            });

                            // 2. Surcharger avec les données SQL
                            for (const [key, value] of Object.entries(row)) {
                                if (typeof value === 'string') {
                                    // Tenter de parser les valeurs JSON (ex: [[...]] pour table)
                                    try {
                                        const parsed = JSON.parse(value);
                                        if (Array.isArray(parsed) || typeof parsed === 'object') {
                                            input[key] = parsed;
                                        } else {
                                            input[key] = String(value);
                                        }
                                    } catch {
                                        input[key] = String(value);
                                    }
                                } else {
                                    input[key] = String(value ?? '');
                                }
                            }
                            return input;
                        });
                        
                        if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
                            console.warn('[pdfme] Aucun input généré par le mapping');
                            cell._resultInfo = 'Aucun input généré par le mapping';
                            return;
                        }

                        // Générer le PDF avec pdfme
                        let pdf;
                        try {
                            pdf = await pdfme.generator.generate({ template, inputs, plugins });
                        } catch (genErr) {
                            console.error('[pdfme] ERREUR generate():', genErr);
                            console.error('[pdfme] generate() stack:', genErr.stack);
                            throw genErr;
                        }
                        // Télécharger ou zipper
                        // Utiliser pdf directement (Uint8Array) plutôt que pdf.buffer (ArrayBuffer partagé potentiellement plus grand)
                        const pdfBlob = new Blob([pdf], { type: 'application/pdf' });

                        if (this._zipMode) {
                            this.downloadOrZipFile(pdfFileName, pdfBlob, 'application/pdf');
                        } else {
                            const url = URL.createObjectURL(pdfBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = pdfFileName;
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }

                        cell._resultInfo = `✅ PDF généré: ${pdfFileName} (${inputs.length} page(s), ${data.length} ligne(s) SQL)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '') +
                            (cell._parseLevels2?.length > 1 ? ` - ${cell._parseLevels2.length - 1} niveau(x) de parsing (query2)` : '');
                        this.setStatus('PDF généré avec succès (pdfme)', 'success');
                    } catch (error) {
                        console.error('[pdfme] === ERREUR executePdfmeCell ===', error);
                        console.error('[pdfme] Stack:', error.stack);
                        throw error;
                    }
                },

                async executePerspectiveCell(cell) {
                    if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
                        throw new Error('Requête SQL manquante');
                    }

                    // Charger Perspective CDN à la demande
                    this.setStatus('Chargement de Perspective...', 'loading');
                    await CDNManager.loadPerspective();

                    this.setStatus('Parsing de la requête SQL...', 'loading');

                    try {
                        // Parser et exécuter la requête SQL avec le parsing récursif
                        const finalQuery = await this.parseQueryRecursively(cell);

                        this.setStatus('Exécution de la requête...', 'loading');

                        // Récupérer les données en format Arrow (non converti en array)
                        const arrowTable = await DuckDBManager.executeQueryArrow(finalQuery);

                        // Stocker la table Arrow pour le rendu
                        cell._arrowTable = arrowTable;
                        cell._perspectiveReady = true;

                        // Attendre le prochain tick pour que le DOM soit prêt
                        await this.$nextTick();

                        // Rendre le viewer Perspective
                        await this.renderPerspectiveInContainer(cell);

                        const rowCount = arrowTable.numRows;
                        cell._resultInfo = `✅ ${rowCount} ligne(s)` +
                            (cell._parseLevels.length > 1 ? ` - ${cell._parseLevels.length - 1} niveau(x) de parsing` : '');
                        this.setStatus('Perspective chargé', 'success');
                    } catch (error) {
                        cell._perspectiveReady = false;
                        throw error;
                    }
                },

                async renderPerspectiveInContainer(cell) {
                    const containerId = 'perspective-' + cell._id;
                    const viewer = document.getElementById(containerId);

                    if (!viewer || !cell._arrowTable) {
                        console.warn('Perspective viewer ou données Arrow manquantes');
                        return;
                    }

                    // Éviter les exécutions concurrentes
                    if (cell._perspectiveRendering) {
                        console.warn('Rendu Perspective déjà en cours pour cette cellule');
                        return;
                    }

                    cell._perspectiveRendering = true;

                    try {
                        // Vérifier que le moteur est duckdb-wasm (Perspective ne supporte pas ducklings)
                        if (DuckDBManager.getEngine() !== 'duckdb-wasm') {
                            throw new Error('Perspective nécessite le moteur DuckDB WASM. Veuillez changer de moteur dans les paramètres.');
                        }

                        // Obtenir la connexion DuckDB
                        const conn = DuckDBManager.getConnection();
                        const perspective = window.perspectiveClient;

                        // Parser la configuration JSON si présente (string ou objet déjà parsé)
                        let config = { theme: 'Pro Light' };
                        const perspectiveConfig = cell.json?.perspectiveConfig;
                        if (perspectiveConfig != null && perspectiveConfig !== '') {
                            try {
                                const userConfig = typeof perspectiveConfig === 'string'
                                    ? JSON.parse(perspectiveConfig.trim())
                                    : perspectiveConfig;
                                config = { ...config, ...userConfig };
                            } catch (e) {
                                console.warn('Configuration Perspective invalide, utilisation des valeurs par défaut:', e);
                            }
                        }

                        // Récupérer la requête finale
                        const finalQuery = cell._parseLevels?.find(l => l.level === 'final')?.innerQuery || ConfigManager.getCellQuery(cell, 0);

                        // Flux natif : DuckDB requête → Arrow → Perspective
                        const arrowResult = await conn.query(finalQuery);
                        const batches = [];
                        for await (const batch of arrowResult) {
                            batches.push(batch);
                        }

                        if (!cell._perspectiveWorker) {
                            cell._perspectiveWorker = await perspective.worker();
                        }
                        const table = await cell._perspectiveWorker.table(batches);

                        // Laisser le custom element perspective-viewer (WASM) s'initialiser complètement
                        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

                        if (typeof viewer.resetThemes === 'function') {
                            await viewer.resetThemes(['Pro Light', 'Pro Dark']);
                        }
                        await viewer.load(table);
                        await viewer.restore(config);

                        cell._perspectiveTable = table;

                    } catch (error) {
                        console.error('Erreur lors du rendu Perspective:', error);
                        throw error;
                    } finally {
                        cell._perspectiveRendering = false;
                    }
                },

                // Collecter tous les paramètres définis dans les cellules uiParameter
                getParameters() {
                    const params = {};
                    const collectFromGroup = (group) => {
                        for (const cell of (group?.cells || [])) {
                            const refName = ConfigManager.getCellReferenceName(cell);
                            if (cell.type === 'uiParameter' && refName) {
                                params[refName] = cell._value || '';
                            }
                        }
                        for (const child of (group?.children || [])) {
                            collectFromGroup(child);
                        }
                    };

                    for (const group of (this.groups || [])) {
                        collectFromGroup(group);
                    }

                    // Ajouter la variable $loop si elle est définie (pendant l'exécution d'une boucle)
                    if (this._currentLoopValue !== null && this._currentLoopValue !== undefined) {
                        params['loop'] = this._currentLoopValue;
                    }

                    return params;
                },

                // Parser une requête SQL et remplacer les $paramètre par leurs valeurs
                parseQueryWithParameters(query) {
                    if (!query) return query;

                    const params = this.getParameters();
                    let parsedQuery = query;

                    // Remplacer tous les $paramName par leurs valeurs
                    // Pattern: $suivi de caractères alphanumériques ou underscore
                    for (const [paramName, paramValue] of Object.entries(params)) {
                        // Échapper les caractères spéciaux pour la regex
                        const escapedName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        // Pattern qui match $paramName mais pas si suivi d'un caractère alphanumérique
                        const regex = new RegExp('\\$' + escapedName + '(?![a-zA-Z0-9_])', 'g');
                        // Échapper les apostrophes dans la valeur pour éviter les injections SQL
                        const escapedValue = String(paramValue).replace(/'/g, "''");
                        parsedQuery = parsedQuery.replace(regex, escapedValue);
                    }

                    return parsedQuery;
                },

                // ─────────────────────────────────────────────────────────────────
                // DAG (Directed Acyclic Graph) - Rafraîchissement automatique
                // ─────────────────────────────────────────────────────────────────

                // Trouver tous les paramètres référencés dans une query ($paramName)
                findReferencedParams(query) {
                    if (!query) return [];
                    const params = [];
                    // Pattern: $suivi de caractères alphanumériques ou underscore
                    const regex = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g;
                    let match;
                    while ((match = regex.exec(query)) !== null) {
                        if (!params.includes(match[1])) {
                            params.push(match[1]);
                        }
                    }
                    return params;
                },

                // Trouver toutes les cellules qui dépendent d'un paramètre donné
                // Retourne un tableau de {cell, path, cellIndex} pour les types DAG-compatibles
                findDependentCells(paramName) {
                    const dependents = [];
                    const dagTypes = ['uiParameter', 'sqlRecursiveParse', 'table', 'perspective', 'sqlStat'];

                    const searchInGroup = (group, path) => {
                        for (let cellIndex = 0; cellIndex < (group.cells || []).length; cellIndex++) {
                            const cell = group.cells[cellIndex];
                            if (!dagTypes.includes(cell.type)) continue;

                            // Vérifier si la query référence le paramètre
                            const query = ConfigManager.getCellQuery(cell, 0) || '';
                            const referencedParams = this.findReferencedParams(query);

                            if (referencedParams.includes(paramName)) {
                                dependents.push({ cell, path: [...path], cellIndex });
                            }
                        }
                        // Récursif sur les enfants
                        if (group.children) {
                            for (let i = 0; i < group.children.length; i++) {
                                searchInGroup(group.children[i], [...path, i]);
                            }
                        }
                    };

                    // Chercher dans tous les groupes de la page active
                    for (let gi = 0; gi < this.groups.length; gi++) {
                        searchInGroup(this.groups[gi], [gi]);
                    }

                    return dependents;
                },

                // Trouver tous les groupes qui dépendent d'un paramètre donné (via ifQuery)
                // Retourne un tableau de {group, path}
                findDependentGroups(paramName) {
                    const dependents = [];

                    const searchInGroup = (group, path) => {
                        // Vérifier si queries[0] du groupe référence le paramètre
                        const q = ConfigManager.getGroupIfQuery(group);
                        if (q && q.sql) {
                            const referencedParams = this.findReferencedParams(q.sql);
                            if (referencedParams.includes(paramName)) {
                                dependents.push({ group, path: [...path] });
                            }
                        }
                        // Récursif sur les enfants
                        if (group.children) {
                            for (let i = 0; i < group.children.length; i++) {
                                searchInGroup(group.children[i], [...path, i]);
                            }
                        }
                    };

                    // Chercher dans tous les groupes de la page active
                    for (let gi = 0; gi < this.groups.length; gi++) {
                        searchInGroup(this.groups[gi], [gi]);
                    }

                    return dependents;
                },

                // Détecter les cycles dans le DAG
                // Retourne true si un cycle est détecté
                detectCycleInDAG() {
                    // Construire le graphe de dépendances
                    const graph = new Map(); // paramName -> [paramNames dépendants]
                    const allParams = new Set();

                    const collectFromGroup = (group) => {
                        for (const cell of (group.cells || [])) {
                            const refName = ConfigManager.getCellReferenceName(cell);
                            if (cell.type === 'uiParameter' && refName) {
                                allParams.add(refName);
                                // Trouver les paramètres référencés dans la query de ce uiParameter
                                const refs = this.findReferencedParams(ConfigManager.getCellQuery(cell, 0) || '');
                                if (!graph.has(refName)) {
                                    graph.set(refName, []);
                                }
                                // Ce paramètre dépend des paramètres référencés
                                for (const ref of refs) {
                                    if (!graph.has(ref)) {
                                        graph.set(ref, []);
                                    }
                                    graph.get(ref).push(refName);
                                }
                            }
                        }
                        for (const child of (group.children || [])) {
                            collectFromGroup(child);
                        }
                    };

                    for (const group of this.groups) {
                        collectFromGroup(group);
                    }

                    // Détection de cycle avec DFS
                    const visited = new Set();
                    const recStack = new Set();

                    const hasCycle = (node) => {
                        if (recStack.has(node)) return true;
                        if (visited.has(node)) return false;

                        visited.add(node);
                        recStack.add(node);

                        for (const neighbor of (graph.get(node) || [])) {
                            if (hasCycle(neighbor)) return true;
                        }

                        recStack.delete(node);
                        return false;
                    };

                    for (const param of allParams) {
                        if (hasCycle(param)) {
                            return true;
                        }
                    }

                    return false;
                },

                // Callback appelé lorsqu'une valeur de paramètre UI est modifiée par l'utilisateur
                async onParameterValueChange(cell) {

                    // Si le DAG n'est pas activé, ne rien faire
                    if (!this.directedAcyclicGraph) {
                        return;
                    }

                    const paramName = ConfigManager.getCellReferenceName(cell);
                    if (!paramName) {
                        return;
                    }

                    // Annuler le timer précédent (debounce)
                    if (this._dagDebounceTimer) {
                        clearTimeout(this._dagDebounceTimer);
                        this._dagDebounceTimer = null;
                    }

                    // Démarrer un nouveau timer
                    this._dagDebounceTimer = setTimeout(async () => {
                        this._dagDebounceTimer = null;

                        try {
                            await this._executeDAGRefresh(paramName);
                        } catch (error) {
                            console.error('❌ [DAG] Erreur lors du rafraîchissement:', error);
                            this.setStatus('❌ Erreur DAG: ' + error.message, 'error');
                        }
                    }, this._dagDebounceDelay);
                },

                // Exécuter le rafraîchissement DAG (appelé après le debounce)
                async _executeDAGRefresh(paramName) {
                    // Vérifier les cycles avant de procéder
                    if (this.detectCycleInDAG()) {
                        console.error('🔴 [DAG] Cycle détecté dans le DAG');
                        this.setStatus('⚠️ Cycle détecté dans le DAG - rafraîchissement automatique désactivé', 'error');
                        this.directedAcyclicGraph = false;
                        return;
                    }

                    // Trouver toutes les cellules qui dépendent de ce paramètre
                    const dependentCells = this.findDependentCells(paramName);

                    // Trouver tous les groupes qui dépendent de ce paramètre (via ifQuery)
                    const dependentGroups = this.findDependentGroups(paramName);

                    const totalDependents = dependentCells.length + dependentGroups.length;

                    if (totalDependents === 0) {
                        return;
                    }

                    this.setStatus(`🔄 Rafraîchissement de ${dependentCells.length} cellule(s) et ${dependentGroups.length} groupe(s) dépendant(s) de $${paramName}...`, 'loading');

                    // Réévaluer les ifQuery des groupes dépendants
                    for (let i = 0; i < dependentGroups.length; i++) {
                        const dep = dependentGroups[i];
                        try {
                            const previousResult = dep.group._ifQueryResult;
                            const newResult = await this.evaluateGroupIfQuery(dep.group);
                            dep.group._ifQueryResult = newResult;
                        } catch (error) {
                            console.error(`  ❌ [DAG] Erreur évaluation groupe ${i + 1}:`, error);
                        }
                    }

                    // Exécuter les cellules dépendantes dans l'ordre
                    for (let i = 0; i < dependentCells.length; i++) {
                        const dep = dependentCells[i];
                        const depCell = dep.cell;

                        // Pour les uiParameter avec preserveUserValue et _userModified, ne pas re-exécuter
                        if (depCell.type === 'uiParameter' && depCell.preserveUserValue && depCell._userModified) {
                            continue;
                        }

                        try {
                            await this.runCellAt(dep.path, dep.cellIndex);
                        } catch (error) {
                            console.error(`  ❌ [DAG] Erreur cellule ${i + 1}:`, error);
                        }
                    }

                    this.setStatus(`✅ ${dependentCells.length} cellule(s) et ${dependentGroups.length} groupe(s) rafraîchi(s)`, 'success');
                },

                // Générer le HTML de l'éditeur pour les cellules uiParameter (SQL, JS ou Texte)
                renderUiParameterEditor(cell) {
                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const placeholder = isJs ? 'return ["Option 1", "Option 2"]; // Pour dropdown\nreturn "Valeur"; // Pour input' : isText ? 'Saisir le texte (une ligne par option pour dropdown)' : 'SELECT * from source1';
                    const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL';
                    const languageIcon = isJs ? '⚡' : isText ? '📝' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info';

                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass);
                },

                // Générer l'éditeur condition d'affichage (queries.main) pour les groupes
                renderGroupIfQueryEditor(group) {
                    if (!group) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>';
                    const q0 = ConfigManager.ensureGroupQueries(group);
                    if (!q0) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>';
                    const groupId = 'ifquery-' + (group.id || 'g');
                    const langType = q0.engine || 'sql';
                    const isJs = langType === 'js';
                    const placeholder = isJs ? 'return true;  // ou return false; pour masquer le groupe' : 'SELECT true  -- ou SELECT false pour masquer le groupe';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    const badgeIcon = isJs ? '⚡' : '🗄️';
                    const badgeLabel = isJs ? 'JavaScript' : 'SQL';
                    if (isJs) {
                        return `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                placeholder="${placeholder}"></textarea>
                        </div>`;
                    }
                    return `<div>
                        <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                        <div class="codemirror-sql-container" x-ref="cm_${groupId}"
                            x-init="$nextTick(async () => {
                                const container = $refs['cm_${groupId}'];
                                if (!container || !group) return;
                                const q0 = ConfigManager.ensureGroupQueries(group);
                                const existingEditor = group._cmEditor_ifQuery;
                                if (existingEditor && document.body.contains(existingEditor.dom)) return;
                                if (existingEditor) { existingEditor.destroy(); group._cmEditor_ifQuery = null; }
                                try {
                                    await CDNManager.loadCodeMirrorSQL();
                                    const schema = {};
                                    if (notebookApp && notebookApp.tablesData) {
                                        for (const [tableName, data] of Object.entries(notebookApp.tablesData)) {
                                            if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                                        }
                                    }
                                    group._cmEditor_ifQuery = CDNManager.createSqlEditor(container, q0.sql || '', (v) => { q0.sql = v; }, { schema, dialect: 'duckdb' });
                                } catch (err) {
                                    console.error('Erreur CodeMirror condition groupe:', err);
                                    container.innerHTML = '<textarea class=&quot;textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm&quot; placeholder=&quot;${placeholder}&quot;></textarea>';
                                    const ta = container.querySelector('textarea');
                                    if (ta) { ta.value = q0.sql || ''; ta.addEventListener('input', e => { q0.sql = e.target.value; }); }
                                }
                            })"></div>
                    </div>`;
                },

                // Initialiser l'éditeur condition d'affichage dans la modale (queries.main)
                renderGroupIfQueryEditorInit(group, container) {
                    if (!group || !container) return;
                    const q0 = ConfigManager.ensureGroupQueries(group);
                    if (!q0) return;
                    const langType = q0.engine || 'sql';
                    const isJs = langType === 'js';
                    const placeholder = isJs ? 'return true;  // ou return false; pour masquer le groupe' : 'SELECT true  -- ou SELECT false pour masquer le groupe';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    const badgeIcon = isJs ? '⚡' : '🗄️';
                    const badgeLabel = isJs ? 'JavaScript' : 'SQL';

                    // Nettoyer l'éditeur existant
                    if (group._cmEditor_ifQuery) {
                        group._cmEditor_ifQuery.destroy();
                        group._cmEditor_ifQuery = null;
                    }

                    if (isJs) {
                        container.innerHTML = `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                placeholder="${placeholder}"></textarea>
                        </div>`;
                        const textarea = container.querySelector('textarea');
                        if (textarea) {
                            textarea.value = q0.sql || '';
                            textarea.addEventListener('input', (e) => { q0.sql = e.target.value; });
                        }
                    } else {
                        container.innerHTML = `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <div class="codemirror-sql-container"></div>
                        </div>`;
                        const cmContainer = container.querySelector('.codemirror-sql-container');
                        if (cmContainer) {
                            CDNManager.loadCodeMirrorSQL().then(() => {
                                const schema = {};
                                if (notebookApp && notebookApp.tablesData) {
                                    for (const [tableName, data] of Object.entries(notebookApp.tablesData)) {
                                        if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                                    }
                                }
                                group._cmEditor_ifQuery = CDNManager.createSqlEditor(cmContainer, q0.sql || '', (v) => { q0.sql = v; }, { schema, dialect: 'duckdb' });
                            }).catch(err => {
                                console.error('Erreur CodeMirror condition groupe:', err);
                                cmContainer.innerHTML = `<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm" placeholder="${placeholder}"></textarea>`;
                                const textarea = cmContainer.querySelector('textarea');
                                if (textarea) {
                                    textarea.value = q0.sql || '';
                                    textarea.addEventListener('input', (e) => { q0.sql = e.target.value; });
                                }
                            });
                        }
                    }
                },

                // Générer le HTML de l'éditeur SQL partagé (unifié pour tous les types de requêtes)
                // queryType: 'query'|'query2' -> queryName: 'main'|'fallback'|'filename' selon le type de cellule
                // applySourceDefaultIfEmpty: si true et cell.type==='source', charge la requête par défaut du schéma à l'init si vide (placeholder reste simple)
                renderSqlQueryEditor(cell, placeholder, showResultInfo, queryType = 'query', showParsedQueryProp = '_showParsedQuery', languageLabel = null, languageIcon = null, badgeClass = null, pathExpr = null, cellIdxExpr = null, applySourceDefaultIfEmpty = false) {
                    const cellId = cell._id;
                    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main';
                    const queryIndex = ConfigManager.getQueryIndexByName(cell, queryName);
                    const showParsedQuery = cell[showParsedQueryProp];
                    const parseLevelsProp = queryType === 'query2' ? '_parseLevels2' : '_parseLevels';

                    const languageType = ConfigManager.getCellEngine(cell, queryName);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const finalLanguageLabel = languageLabel || (isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL');
                    const finalLanguageIcon = languageIcon || (isJs ? '⚡' : isText ? '📝' : '🗄️');
                    const finalBadgeClass = badgeClass || (isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info');

                    return `
                        <div>
                            <div class="relative w-full">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs text-base-content/70 flex items-center gap-2">
                                        <span class="badge badge-soft ${finalBadgeClass}">${finalLanguageIcon} ${finalLanguageLabel}</span>
                                        ${this.devMode && !isText ? `
                                            <label class="label cursor-pointer justify-start gap-2 py-0 min-h-0">
                                                <input type="checkbox" class="toggle toggle-sm"
                                                       x-model="cellItem.cell.${showParsedQueryProp}" />
                                                <span class="label-text text-xs">Parsé</span>
                                            </label>
                                        ` : ''}
                                    </span>
                                    <div class="flex gap-1 items-center">
                                        ${!showParsedQuery && this.devMode && !isText ? `
                                            <button 
                                                @click="$store.templateModal.open('${cellId}', '${queryType}', '${languageType}')"
                                                class="px-2 py-1 border border-base-300 bg-base-200 text-base-content/70 rounded cursor-pointer text-xs transition-all hover:border-primary hover:text-base-content" 
                                                title="Insérer un template ${isJs ? 'JavaScript' : 'SQL'}">
                                                📋 Templates
                                            </button>
                                        ` : ''}
                                        ${!showParsedQuery && pathExpr != null && (cellIdxExpr === 0 || cellIdxExpr) ? `
                                            <button 
                                                @click="runCellAt(${pathExpr}, ${cellIdxExpr})"
                                                :disabled="isLoading"
                                                class="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                                title="Exécuter la requête">
                                                <span x-show="cellItem.cell._status === 'running'" class="loading loading-spinner loading-sm"></span>
                                                <svg x-show="cellItem.cell._status !== 'running'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            </button>
                                        ` : ''}
                                        ${!showParsedQuery ? `
                                            <button 
                                                x-ref="copyBtn_${cellId}_${queryType}"
                                                @click="(() => {
                                                    const text = ConfigManager.getCellQuery(cellItem.cell, '${queryName}') || '';
                                                    const btn = $refs['copyBtn_${cellId}_${queryType}'];
                                                    if (!btn) return;
                                                    navigator.clipboard.writeText(text).then(() => {
                                                        const originalHTML = btn.innerHTML;
                                                        btn.innerHTML = '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><polyline points=&quot;20 6 9 17 4 12&quot;></polyline></svg>';
                                                        btn.classList.add('text-success');
                                                        setTimeout(() => {
                                                            btn.innerHTML = originalHTML;
                                                            btn.classList.remove('text-success');
                                                        }, 1500);
                                                    }).catch(err => console.error('Erreur copie:', err));
                                                })()"
                                                class="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer" 
                                                title="Copier le code">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path></svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                ${!showParsedQuery ? (isJs || isText ? `
                                    <textarea 
                                        class="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                        x-model="cellItem.cell.queries[${queryIndex}].sql"
                                        placeholder="${placeholder}"></textarea>
                                ` : `
                                    <div 
                                        class="codemirror-sql-container"
                                        id="cm-${cellId}-${queryType}"
                                        x-ref="cm_${cellId}_${queryType}"
                                        x-init="$nextTick(() => initCodeMirrorForCell(cellItem, '${cellId}', '${queryType}', '${queryName}', ${queryIndex}, ${applySourceDefaultIfEmpty}, '${String(placeholder || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')}', typeof $root !== 'undefined' ? $root : null))"
                                        x-effect="(() => {
                                            const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cellItem.cell) : cellItem.cell;
                                            const editor = rawCell._cmEditor_${queryType};
                                            if (editor && editor.state && document.body.contains(editor.dom)) {
                                                const currentDoc = editor.state.doc.toString();
                                                const cellValue = ConfigManager.getCellQuery(cellItem.cell, '${queryName}') || '';
                                                if (currentDoc !== cellValue && !editor.hasFocus) {
                                                    editor.dispatch({
                                                        changes: { from: 0, to: currentDoc.length, insert: cellValue }
                                                    });
                                                }
                                            }
                                        })()"
                                    ></div>
                                `) : `
                                    <div>
                                        ${(function() {
                                            const raw = cell[parseLevelsProp] || [];
                                            if (raw.length > 0) return raw;
                                            if (cell.type === 'source') {
                                                const q = ConfigManager.getCellQuery(cell, '${queryName}') || '';
                                                const parsed = this.getParsedSqlQuery(q, { name: cell.name || 'source1', fileNameUpload: cell._fileName || undefined });
                                                return [{ level: 'final', innerQuery: parsed, replacement: null }];
                                            }
                                            return [];
                                        }.call(this)).map((parseLevel, idx) => `
                                            <div class="relative w-full" style="margin-bottom: 0.75rem;">
                                                <div class="flex justify-between items-center mb-2">
                                                    <span class="text-xs text-base-content/70 flex items-center gap-2">
                                                        <span class="badge badge-soft badge-primary">${parseLevel.level === 'final' ? 'Final' : 'Niveau ' + parseLevel.level}</span>
                                                        <span>${parseLevel.level === 'final' ? (isJs ? 'Code final exécuté' : 'Requête finale exécutée') : (isJs ? 'Code niveau ' + parseLevel.level : 'Requête niveau ' + parseLevel.level)}</span>
                                                    </span>
                                                </div>
                                                <div class="w-full min-h-20 max-h-72 p-3 bg-base-200 border border-primary rounded-lg text-base-content font-mono text-sm overflow-auto whitespace-pre-wrap break-words">${(parseLevel.innerQuery || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')}</div>
                                                ${parseLevel.replacement ? `
                                                    <div style="margin-top: 0.1rem; padding: 0.5rem; background: var(--success-bg); border-left: 3px solid var(--success); font-family: monospace; font-size: 0.85rem;">
                                                        <strong>→ ${isJs ? 'Parsé en' : 'Résultat'}:</strong> <span>${(parseLevel.replacement || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>
                            ${showResultInfo && cell._resultInfo ? `
                                <div class="mt-2 p-2 bg-base-200 rounded text-sm text-base-content/70">${cell._resultInfo}</div>
                            ` : ''}
                        </div>
                    `;
                },

                // Rendu sécurisé de l'éditeur SQL : ne re-render que si les propriétés pertinentes changent
                // Cela évite que x-for ou d'autres effets Alpine ne détruisent les instances CodeMirror
                safeRenderSqlEditor(el, cell, placeholder, showResultInfo, queryType = 'query', showParsedQueryProp = '_showParsedQuery', languageLabel = null, languageIcon = null, badgeClass = null, pathExpr = null, cellIdxExpr = null, applySourceDefaultIfEmpty = false) {
                    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main';
                    const queryIndex = ConfigManager.getQueryIndexByName(cell, queryName);
                    ConfigManager.ensureCellQueries(cell, queryName);
                    // Lire uniquement les propriétés réactives qui doivent déclencher un re-rendu
                    const showParsed = cell[showParsedQueryProp];
                    const langType = ConfigManager.getCellEngine(cell, queryName);
                    const devModeVal = this.devMode;

                    // Construire une clé à partir de ces propriétés
                    const key = `${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    // Si la clé n'a pas changé et que le contenu existe déjà, ne pas re-render
                    // Cela préserve les instances CodeMirror existantes
                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    // Générer le HTML et l'injecter
                    const html = this.renderSqlQueryEditor(cell, placeholder, showResultInfo, queryType, showParsedQueryProp, languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr, applySourceDefaultIfEmpty);
                    el.innerHTML = html;

                    // Initialiser les directives Alpine dans le nouveau DOM
                    // _x_ignoreSelf empêche la ré-initialisation de l'élément lui-même (qui a déjà x-effect)
                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Version sécurisée pour l'éditeur uiParameter
                safeRenderUiParameterEditor(el, cell) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 0);
                    const devModeVal = this.devMode;

                    const key = `${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    const html = this.renderUiParameterEditor(cell);
                    el.innerHTML = html;

                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Générer l'éditeur pour les cellules markdown (SQL ou JS — requête qui retourne du markdown)
                renderMarkdownQueryEditor(cell, pathExpr, cellIdxExpr) {
                    const languageType = ConfigManager.getCellEngine(cell, 'main');
                    const isJs = languageType === 'js';
                    const placeholder = isJs ? "return '## Titre\\n\\nContenu markdown';" : "SELECT '## Titre' as markdown";
                    const languageLabel = isJs ? 'JavaScript' : 'SQL';
                    const languageIcon = isJs ? '⚡' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr);
                },

                // Init CodeMirror pour une cellule (appelé depuis x-init pour éviter erreurs de parsing Alpine)
                async initCodeMirrorForCell(cellItem, cellId, queryType, queryName, queryIndex, applySourceDefaultIfEmpty, placeholder, rootComponent) {
                    const container = document.getElementById('cm-' + cellId + '-' + queryType);
                    if (!container) return;
                    const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cellItem.cell) : cellItem.cell;
                    const existingEditor = rawCell['_cmEditor_' + queryType];
                    if (existingEditor) {
                        if (!document.body.contains(existingEditor.dom)) {
                            existingEditor.destroy();
                            rawCell['_cmEditor_' + queryType] = null;
                        } else return;
                    }
                    try {
                        await CDNManager.loadCodeMirrorSQL();
                        let initialContent = ConfigManager.getCellQuery(cellItem.cell, queryName) || '';
                        if (applySourceDefaultIfEmpty && !initialContent.trim() && cellItem.cell.type === 'source') {
                            const defaultQ = CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.find(q => q.name === queryName)?.sql ?? CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.[queryIndex]?.sql;
                            if (defaultQ) {
                                initialContent = defaultQ.replace(/\{name\}/g, cellItem.cell.name || 'source1');
                                ConfigManager.setCellQuery(cellItem.cell, queryName, initialContent);
                            }
                        }
                        const schema = {};
                        const nb = (rootComponent && rootComponent._x_dataStack ? rootComponent._x_dataStack[0] : rootComponent) || null;
                        if (nb && nb.tablesData) {
                            for (const [tableName, data] of Object.entries(nb.tablesData)) {
                                if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                            }
                        }
                        rawCell['_cmEditor_' + queryType] = CDNManager.createSqlEditor(container, initialContent,
                            (v) => ConfigManager.setCellQuery(cellItem.cell, queryName, v),
                            { schema, dialect: 'duckdb' });
                    } catch (err) {
                        console.error('Erreur init CodeMirror:', err);
                        const ph = String(placeholder || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                        container.innerHTML = '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm" x-model="cellItem.cell.queries[' + queryIndex + '].sql" placeholder="' + ph + '"></textarea>';
                    }
                },

                // Version sécurisée pour l'éditeur markdown (sql/js)
                safeRenderMarkdownQueryEditor(el, cell, pathExpr, cellIdxExpr) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 'main');
                    const devModeVal = this.devMode;
                    const key = `md_${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;
                    if (el._sqlEditorKey === key && el.children.length > 0) return;
                    el._sqlEditorKey = key;
                    const html = this.renderMarkdownQueryEditor(cell, pathExpr, cellIdxExpr);
                    el.innerHTML = html;
                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Générer l'éditeur pour les cellules iframe (SQL, JS ou Texte)
                renderIframeEditor(cell, pathExpr, cellIdxExpr) {
                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const placeholder = isJs
                        ? "return '<html><body><h1>Hello</h1></body></html>';"
                        : isText
                            ? '<html><body><h1>Hello</h1></body></html>'
                            : "SELECT '<html><body><h1>Hello</h1></body></html>' as html";
                    const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL';
                    const languageIcon = isJs ? '⚡' : isText ? '📝' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info';
                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr);
                },

                // Version sécurisée pour l'éditeur iframe
                safeRenderIframeEditor(el, cell, pathExpr, cellIdxExpr) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 0);
                    const devModeVal = this.devMode;

                    const key = `iframe_${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    const html = this.renderIframeEditor(cell, pathExpr, cellIdxExpr);
                    el.innerHTML = html;

                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Générer un nom de paramètre unique (param1, param2, param3...) - vérifie dans TOUTES les pages
                generateUniqueParamName() {
                    const existingNames = new Set();

                    const collectNames = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                const ref = ConfigManager.getCellReferenceName(cell);
                                if (cell.type === 'uiParameter' && ref) {
                                    existingNames.add(ref);
                                }
                            }
                            if (group.children) {
                                collectNames(group.children);
                            }
                        }
                    };

                    // Collecter les noms de toutes les pages
                    for (const page of this.pages) {
                        collectNames(page.groups);
                        if (page.linkGroups) {
                            collectNames(page.linkGroups);
                        }
                    }

                    // Trouver le prochain numéro disponible
                    let num = 1;
                    while (existingNames.has('param' + num)) {
                        num++;
                    }

                    return 'param' + num;
                },

                // Vérifie si un nom de paramètre est déjà utilisé (récursif) - vérifie dans TOUTES les pages
                isParamNameUsed(paramName, excludeId) {
                    let used = false;
                    const checkGroups = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell.type === 'uiParameter' &&
                                    cell._id !== excludeId &&
                                    ConfigManager.getCellReferenceName(cell) === paramName) {
                                    used = true;
                                    return;
                                }
                            }
                            if (group.children && !used) {
                                checkGroups(group.children);
                            }
                            if (used) return;
                        }
                    };

                    // Vérifier dans toutes les pages
                    for (const page of this.pages) {
                        checkGroups(page.groups);
                        if (used) return true;
                        if (page.linkGroups) {
                            checkGroups(page.linkGroups);
                            if (used) return true;
                        }
                    }
                    return used;
                },

                /** Valide le nom d'un uiParameter (alias de validateCellName pour cohérence). */
                validateParamName(pathOrIndex, cellIndex) {
                    this.validateCellName(pathOrIndex, cellIndex);
                },

                // Insérer un template (SQL ou JS) dans une cellule
                insertTemplate(cellId, queryType, templateIndex, languageType = 'sql') {
                    if (languageType === 'text') return; // Pas de templates pour le type Texte
                    // Récupérer les templates appropriés (Alpine.raw pour éviter les soucis Proxy avec chaînes complexes)
                    const store = (typeof Alpine !== 'undefined' && Alpine.raw)
                        ? Alpine.raw(Alpine.store('templateModal'))
                        : Alpine.store('templateModal');
                    const templates = languageType === 'js' ? store.jsTemplates : store.sqlTemplates;

                    // Trouver la cellule par son ID
                    const findCell = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell._id === cellId) {
                                    return cell;
                                }
                            }
                            if (group.children) {
                                const found = findCell(group.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    let cell = null;
                    for (const page of this.pages) {
                        cell = findCell(page.groups);
                        if (cell) break;
                        if (page.linkGroups) {
                            cell = findCell(page.linkGroups);
                            if (cell) break;
                        }
                    }

                    if (!cell) {
                        console.error('Cellule non trouvée:', cellId);
                        return;
                    }

                    // Vérifier que l'index du template est valide
                    if (templateIndex < 0 || templateIndex >= templates.length) {
                        console.error('Index de template invalide:', templateIndex);
                        return;
                    }

                    // Insérer le code du template dans la cellule
                    const template = templates[templateIndex];
                    const newCode = String(template.code);
                    ConfigManager.setCellQuery(cell, queryType === 'query2' ? 1 : 0, newCode);

                    // Mettre à jour l'éditeur CodeMirror si présent (cellules SQL)
                    const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cell) : cell;
                    const editorKey = '_cmEditor_' + queryType;
                    const editor = rawCell[editorKey];
                    if (editor && editor.state && editor.dispatch) {
                        const currentDoc = editor.state.doc.toString();
                        if (currentDoc !== newCode) {
                            editor.dispatch({
                                changes: { from: 0, to: currentDoc.length, insert: newCode }
                            });
                        }
                    }

                    // Afficher un message de confirmation
                    this.setStatus(`✅ Template "${template.name}" inséré`, 'success');
                },

                // Valider l'unicité du nom de source (accepte path ou groupIndex) - vérifie dans TOUTES les pages
                validateSingleSourceName(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'source') return;

                    const currentName = cell.name?.trim();
                    if (!currentName) {
                        this.setStatus('Le nom de la source ne peut pas être vide', 'error');
                        cell.name = this.generateUniqueSourceName();
                        return;
                    }

                    // Vérifier le format (alphanumériques et underscores seulement)
                    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentName)) {
                        this.setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error');
                        cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
                        return;
                    }

                    // Vérifier l'unicité dans toutes les pages
                    if (!this.isNameUniqueAcrossPages(currentName, 'source', this.activePageIndex, path, cellIndex)) {
                        this.setStatus(`Le nom de source "${currentName}" est déjà utilisé dans une autre page`, 'error');
                        cell.name = this.generateUniqueSourceName();
                    }
                },

                // Exécuter les groupes à partir d'un index donné
                async runGroupsFromIndex(startGroupIndex) {
                    for (let groupIndex = startGroupIndex; groupIndex < this.groups.length; groupIndex++) {
                        await this.runGroup(groupIndex);
                    }
                },

                // Exécuter les groupes à partir d'un index avec conditions d'arrêt
                // Retourne {stopped: boolean, reason: string} si arrêté prématurément
                async runGroupsFromIndexWithStopConditions(startGroupIndex) {
                    for (let groupIndex = startGroupIndex; groupIndex < this.groups.length; groupIndex++) {
                        const result = await this.runGroupWithStopConditions([groupIndex]);
                        if (result.stopped) {
                            return result;
                        }
                    }
                    return { stopped: false };
                },

                // Exécuter un groupe avec conditions d'arrêt
                async runGroupWithStopConditions(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    // Évaluer queries[0] (condition d'affichage) avant d'exécuter le groupe (comme dans runGroupOnce)
                    if (ConfigManager.getGroupIfQuery(group)) {
                        this.setStatus('Évaluation de la condition ifQuery...', 'loading');
                        const ifQueryResult = await this.evaluateGroupIfQuery(group);
                        group._ifQueryResult = ifQueryResult;

                        if (!ifQueryResult) {
                            this.setStatus('Groupe ignoré (ifQuery = false)', 'info');
                            return { stopped: false };
                        }
                    }

                    const orderedItems = this.getAllItemsSorted(group);
                    for (const item of orderedItems) {
                        if (item.type === 'child') {
                            const result = await this.runGroupWithStopConditions([...path, item.originalIndex]);
                            if (result.stopped) return result;
                            continue;
                        }

                        const cell = item.item;

                        // Condition d'arrêt : cellule buttonRunNextCells (bloquant)
                        if (cell.type === 'buttonRunNextCells') {
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;

                        // Condition d'arrêt : cellule source sans fichier ou non chargée
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            // Les cellules source sont déjà chargées, on ne les exécute pas
                            continue;
                        }

                        // Exécuter la cellule et vérifier les erreurs
                        try {
                            cell._status = 'running';
                            await this.runCellAt(path, item.originalIndex);

                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                return { stopped: true, reason: 'cell_error' };
                            }
                        } catch (error) {
                            cell._status = 'error';
                            this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                            return { stopped: true, reason: 'execution_error', error: error.message };
                        }
                    }

                    return { stopped: false };
                },

                // Exécuter les cellules après une cellule donnée avec conditions d'arrêt (pour autoRunNextCells)
                async runCellsAfterWithStopConditions(path, cellIndex, cellId = null) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return { stopped: false };

                    const orderedItems = this.getAllItemsSorted(group);
                    const startIndex = orderedItems.findIndex(item =>
                        item.type === 'cell' &&
                        (cellId ? item.item?._id === cellId : item.originalIndex === cellIndex)
                    );
                    if (startIndex === -1) return { stopped: false };

                    for (let i = startIndex + 1; i < orderedItems.length; i++) {
                        const item = orderedItems[i];

                        if (item.type === 'child') {
                            const result = await this.runGroupWithStopConditions([...path, item.originalIndex]);
                            if (result.stopped) return result;
                            continue;
                        }

                        const cell = item.item;

                        // Condition d'arrêt : cellule buttonRunNextCells (bloquant)
                        if (cell.type === 'buttonRunNextCells') {
                            this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                            return { stopped: true, reason: 'buttonRunNextCells' };
                        }
                        if (this.isCellSkippedInAutoFlow(cell)) continue;

                        // Condition d'arrêt : cellule source sans fichier ou non chargée
                        if (cell.type === 'source') {
                            if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                this.setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info');
                                return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                            }
                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                return { stopped: true, reason: 'source_error', cellName: cell.name };
                            }
                            continue;
                        }

                        // Exécuter la cellule et vérifier les erreurs
                        try {
                            cell._status = 'running';
                            await this.runCellAt(path, item.originalIndex);

                            if (cell._status === 'error') {
                                this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                return { stopped: true, reason: 'cell_error' };
                            }
                        } catch (error) {
                            cell._status = 'error';
                            this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                            return { stopped: true, reason: 'execution_error', error: error.message };
                        }
                    }

                    // Remonter la hiérarchie des groupes parents et continuer les items restants
                    let currentPath = [...path];
                    while (currentPath.length > 1) {
                        const childIndexInParent = currentPath[currentPath.length - 1];
                        currentPath = currentPath.slice(0, -1);
                        const parentGroup = this.getGroupAtPath(currentPath);
                        if (!parentGroup) break;

                        const parentOrderedItems = this.getAllItemsSorted(parentGroup);
                        const childPos = parentOrderedItems.findIndex(item =>
                            item.type === 'child' && item.originalIndex === childIndexInParent
                        );
                        if (childPos === -1) break;

                        // Continuer avec les items après le sous-groupe dans le parent
                        for (let i = childPos + 1; i < parentOrderedItems.length; i++) {
                            const item = parentOrderedItems[i];

                            if (item.type === 'child') {
                                const result = await this.runGroupWithStopConditions([...currentPath, item.originalIndex]);
                                if (result.stopped) return result;
                                continue;
                            }

                            const cell = item.item;

                            if (cell.type === 'buttonRunNextCells') {
                                this.setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info');
                                return { stopped: true, reason: 'buttonRunNextCells' };
                            }
                            if (this.isCellSkippedInAutoFlow(cell)) continue;

                            if (cell.type === 'source') {
                                if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                                    this.setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info');
                                    return { stopped: true, reason: 'source_no_file', cellName: cell.name };
                                }
                                if (cell._status === 'error') {
                                    this.setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info');
                                    return { stopped: true, reason: 'source_error', cellName: cell.name };
                                }
                                continue;
                            }

                            try {
                                cell._status = 'running';
                                await this.runCellAt(currentPath, item.originalIndex);
                                if (cell._status === 'error') {
                                    this.setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error');
                                    return { stopped: true, reason: 'cell_error' };
                                }
                            } catch (error) {
                                cell._status = 'error';
                                this.setStatus(`Arrêt : erreur - ${error.message}`, 'error');
                                return { stopped: true, reason: 'execution_error', error: error.message };
                            }
                        }
                    }

                    // Au niveau racine, propager aux groupes suivants
                    if (currentPath.length === 1) {
                        const rootGroupIndex = currentPath[0];
                        const result = await this.runGroupsFromIndexWithStopConditions(rootGroupIndex + 1);
                        if (result.stopped) return result;
                    }

                    return { stopped: false };
                },

                // Exécuter toutes les cellules après une cellule donnée (pour buttonRunNextCells)
                async runCellsAfter(path, cellIndex) {
                    this.isLoading = true;
                    this.setStatus('Exécution des cellules suivantes...', 'loading');

                    try {
                        const group = this.getGroupAtPath(path);
                        if (!group) return;

                        const orderedItems = this.getAllItemsSorted(group);
                        const startIndex = orderedItems.findIndex(
                            item => item.type === 'cell' && item.originalIndex === cellIndex
                        );
                        if (startIndex === -1) return;

                        for (let i = startIndex + 1; i < orderedItems.length; i++) {
                            const item = orderedItems[i];
                            if (item.type === 'child') {
                                await this.runGroupAtPath([...path, item.originalIndex]);
                                continue;
                            }
                            const cell = item.item;
                            if (cell?.type === 'buttonRunNextCells') break;
                            if (this.isCellSkippedInAutoFlow(cell)) continue;
                            await this.runCellAt(path, item.originalIndex);
                        }

                        // Exécuter tous les groupes suivants au niveau racine
                        if (path.length === 1) {
                            const rootGroupIndex = path[0];
                            await this.runGroupsFromIndex(rootGroupIndex + 1);
                        }

                        this.setStatus('Exécution terminée', 'success');
                    } catch (error) {
                        this.setStatus('Erreur: ' + error.message, 'error');
                    } finally {
                        this.isLoading = false;
                    }
                },

                // Exécuter tous les groupes de la page active
                async runAllGroups() {
                    this.isLoading = true;
                    this.setStatus('Exécution de tous les groupes...', 'loading');

                    // Réévaluer les ifQuery avant l'exécution (données à jour)
                    await this.evaluateAllGroupIfQueries();

                    for (let groupIndex = 0; groupIndex < this.groups.length; groupIndex++) {
                        const result = await this.runGroup(groupIndex);
                        if (result?.stopped) {
                            this.isLoading = false;
                            return; // Ne pas exécuter les groupes suivants
                        }
                    }

                    this.isLoading = false;
                    this.setStatus('Toutes les cellules de la page exécutées', 'success');
                },

                // ─────────────────────────────────────────────────────────────────
                // EXPORT / IMPORT
                // ─────────────────────────────────────────────────────────────────
                // THEME MANAGEMENT
                // ─────────────────────────────────────────────────────────────────
                setTheme(themeName) {
                    this.currentTheme = themeName;
                    document.documentElement.setAttribute('data-theme', themeName);
                    localStorage.setItem('sqljob-theme', themeName);
                },

                // ─────────────────────────────────────────────────────────────────
                // Export unifié
                // ─────────────────────────────────────────────────────────────────

                openExportModal(type) {
                    // Pour le gist, vérifier d'abord si un token existe
                    if (type === 'gist' && !GitHubGistManager.hasAccessToken()) {
                        this.showGistTokenModal = true;
                        return;
                    }

                    // Valeur par défaut du nom de fichier (avec date/heure pour tous les types)
                    const now = new Date();
                    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
                    const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, '');
                    const defaultFileName = `sqljob_${yyyymmdd}_${hhmmss}`;

                    // Réinitialiser la modale avec les valeurs par défaut
                    this.exportModal.show = false;
                    this.$nextTick(() => {
                        this.exportModal.type = type;
                        this.exportModal.fileName = defaultFileName;
                        this.exportModal.description = 'sqljob Notebook Configuration';
                        this.exportModal.devMode = false;
                        this.exportModal.showLayout = this.showLayout;
                        this.exportModal.encryptGist = false;
                        this.exportModal.gistPassphrase = '';
                        this.exportModal.show = true;
                    });
                },

                async executeExport() {
                    const type = this.exportModal.type;
                    const fileName = this.exportModal.fileName || 'notebook-config.json';
                    const description = this.exportModal.description || 'sqljob Notebook Configuration';
                    const devMode = this.exportModal.devMode;
                    const showLayout = this.exportModal.showLayout;

                    this.exportModal.show = false;

                    try {
                        this.isLoading = true;

                        // Générer la configuration avec les paramètres choisis
                        const includeFileData = (type === 'gist' || type === 'json' || type === 'base64');
                        const config = await ConfigManager.buildConfigFromState(
                            this.pages,
                            devMode,
                            showLayout,
                            includeFileData,
                            this.currentTheme,
                            this.dbEngine,
                            this.directedAcyclicGraph
                        );

                        switch (type) {
                            case 'gist':
                                this.setStatus('Création du gist GitHub...', 'loading');
                                let passphrase = null;
                                if (this.exportModal.encryptGist) {
                                    passphrase = (this.exportModal.gistPassphrase || '').trim();
                                    if (!passphrase) passphrase = GistEncrypt.generatePassphrase();
                                }
                                const gistUrl = await GitHubGistManager.createGist(config, description, fileName, passphrase);
                                this.gistShareUrl = GitHubGistManager.generateSqljobUrl(gistUrl);
                                this.gistWasEncrypted = !!passphrase;
                                this.gistPassphraseToShare = passphrase || '';
                                this.showGistModal = true;
                                this.setStatus('Gist créé avec succès', 'success');
                                break;

                            case 'json':
                                this.setStatus('Export JSON...', 'loading');
                                let jsonContent;
                                const jsonPassphrase = this.exportModal.encryptGist ? ((this.exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase()) : null;
                                if (jsonPassphrase) {
                                    const jsonString = JSON.stringify(config);
                                    const encrypted = await GistEncrypt.encrypt(jsonString, jsonPassphrase);
                                    jsonContent = JSON.stringify(encrypted);
                                } else {
                                    jsonContent = JSON.stringify(config);
                                }
                                const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
                                const jsonFileName = fileName.endsWith('.json') ? fileName : fileName + '.json';
                                FileHandler.downloadFile(jsonBlob, jsonFileName);
                                this.setStatus('Configuration exportée', 'success');
                                break;

                            case 'base64':
                                this.setStatus('Export Base64...', 'loading');
                                const jsonStr = JSON.stringify(config);
                                const base64String = ConfigManager.encodeUTF8ToBase64(jsonStr);
                                const base64Blob = new Blob([base64String], { type: 'text/plain' });
                                const base64FileName = fileName.endsWith('.txt') ? fileName : fileName + '.txt';
                                FileHandler.downloadFile(base64Blob, base64FileName);
                                this.setStatus('Configuration exportée en Base64', 'success');
                                break;

                            case 'html':
                                this.setStatus('Génération HTML...', 'loading');
                                const htmlFileName = (fileName.endsWith('.html') ? fileName : fileName + '.html');
                                const htmlPassphrase = this.exportModal.encryptGist ? ((this.exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase()) : null;
                                await this.exportHTMLWithConfig(config, htmlFileName, htmlPassphrase);
                                this.setStatus('HTML exporté', 'success');
                                break;
                        }
                    } catch (error) {
                        console.error('Erreur export:', error);
                        this.setStatus('Erreur: ' + error.message, 'error');

                        // Si erreur d'authentification pour gist
                        if (type === 'gist' && (error.message.includes('authentifié') || error.message.includes('Unauthorized'))) {
                            GitHubGistManager.clearAccessToken();
                            this.showGistTokenModal = true;
                        }
                    } finally {
                        this.isLoading = false;
                    }
                },

                _buildExportHTMLEncrypted(fullOuterHTML, configScriptContent) {
                    let html = fullOuterHTML;
                    const openTag = '\x3cscript type="application/octet-stream" id="defaultConfigBase64" data-encrypted="true"\x3e';
                    const closeTag = '\x3c/script\x3e';
                    const encryptedScript = openTag + configScriptContent + closeTag;
                    if (/<script[^>]*\sid="defaultConfigBase64"/i.test(html)) {
                        html = html.replace(/<script[^>]*\sid="defaultConfigBase64"[^>]*>[\s\S]*?<\/script>/i, encryptedScript);
                    } else {
                        html = html.replace(/<\/head>/i, encryptedScript + '</head>');
                    }
                    html = html.replace(/<script[^>]*\sid="sourceFile_[^"]*"[^>]*>[\s\S]*?<\/script>/gi, '');
                    html = html.replace(/<script[^>]*\sid="docxTemplate_[^"]*"[^>]*>[\s\S]*?<\/script>/gi, '');
                    return '<!DOCTYPE html>\n' + html;
                },

                async exportHTMLWithConfig(config, fileName = 'index.sqljob.html', passphrase = null) {
                    const sourceFilesPayload = [];
                    const docxTemplatesPayload = [];

                    // Collecter les fichiers source et templates docx depuis tous les groupes (récursivement)
                    const collectSourceFiles = async (group, groupPath = []) => {
                        for (let cellIndex = 0; cellIndex < (group.cells || []).length; cellIndex++) {
                            const cell = group.cells[cellIndex];
                            if (cell.type === 'source' && cell._currentFile && cell._fileName) {
                                const safeSourceName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_');
                                const arrayBuffer = await cell._currentFile.arrayBuffer();
                                const compressedBuffer = await FileHandler.compressGzip(arrayBuffer);
                                const fileBase64 = FileHandler.arrayBufferToBase64(compressedBuffer);

                                if (passphrase) {
                                    sourceFilesPayload.push({ id: `sourceFile_${safeSourceName}`, sourceName: cell.name, fileName: cell._fileName, base64: fileBase64 });
                                } else {
                                    document.querySelectorAll(`script[id^="sourceFile_${safeSourceName}"]`).forEach(s => s.remove());
                                    const script = document.createElement('script');
                                    script.type = 'application/octet-stream';
                                    script.id = `sourceFile_${safeSourceName}`;
                                    script.dataset.sourceName = cell.name;
                                    script.dataset.fileName = cell._fileName;
                                    script.textContent = fileBase64;
                                    document.head.appendChild(script);
                                }
                            } else if (cell.type === 'source' && !cell._currentFile && !passphrase) {
                                const safeSourceName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_');
                                document.querySelectorAll(`script[id^="sourceFile_${safeSourceName}"]`).forEach(s => s.remove());
                            }

                            if (cell.type === 'publipostageWord' && cell.docxTemplateBase64 && cell.docxTemplateFileName) {
                                const cellPath = [...groupPath, cellIndex].join('_');
                                const stableId = `docxTemplate_${cellPath}`;

                                if (passphrase) {
                                    const docxBytes = FileHandler.base64ToUint8Array(cell.docxTemplateBase64);
                                    const docxCompressed = await FileHandler.compressGzip(docxBytes.buffer || docxBytes);
                                    const docxBase64 = FileHandler.arrayBufferToBase64(docxCompressed);
                                    docxTemplatesPayload.push({ id: stableId, cellPath, fileName: cell.docxTemplateFileName, base64: docxBase64, compressed: true });
                                } else {
                                    document.querySelectorAll(`script[id="${stableId}"]`).forEach(s => s.remove());
                                    const docxBytes = FileHandler.base64ToUint8Array(cell.docxTemplateBase64);
                                    const docxCompressed = await FileHandler.compressGzip(docxBytes.buffer || docxBytes);
                                    const docxBase64 = FileHandler.arrayBufferToBase64(docxCompressed);
                                    const script = document.createElement('script');
                                    script.type = 'application/octet-stream';
                                    script.id = stableId;
                                    script.dataset.cellPath = cellPath;
                                    script.dataset.fileName = cell.docxTemplateFileName;
                                    script.dataset.compressed = 'true';
                                    script.textContent = docxBase64;
                                    document.head.appendChild(script);
                                }
                            } else if (cell.type === 'publipostageWord' && !cell.docxTemplateBase64 && !passphrase) {
                                const cellPath = [...groupPath, cellIndex].join('_');
                                const stableId = `docxTemplate_${cellPath}`;
                                document.querySelectorAll(`script[id="${stableId}"]`).forEach(s => s.remove());
                            }
                        }
                        for (let childIndex = 0; childIndex < (group.children || []).length; childIndex++) {
                            await collectSourceFiles(group.children[childIndex], [...groupPath, childIndex]);
                        }
                    };

                    // Collecter les fichiers de toutes les pages
                    for (let pageIndex = 0; pageIndex < this.pages.length; pageIndex++) {
                        const page = this.pages[pageIndex];
                        for (let groupIndex = 0; groupIndex < page.groups.length; groupIndex++) {
                            await collectSourceFiles(page.groups[groupIndex], [groupIndex]);
                        }
                        for (let groupIndex = 0; groupIndex < (page.linkGroups || []).length; groupIndex++) {
                            await collectSourceFiles(page.linkGroups[groupIndex], [-1, groupIndex]);
                        }
                    }

                    let htmlContent;
                    if (passphrase) {
                        const payload = { config, sourceFiles: sourceFilesPayload, docxTemplates: docxTemplatesPayload };
                        let payloadStr;
                        try { payloadStr = JSON.stringify(payload); } catch (e) { payloadStr = '[stringify error]'; }
                        const encrypted = await GistEncrypt.encrypt(payloadStr, passphrase);
                        const configScriptContent = btoa(JSON.stringify(encrypted));
                        htmlContent = this._buildExportHTMLEncrypted(document.documentElement.outerHTML, configScriptContent);
                    } else {
                        document.getElementById('defaultConfigBase64')?.remove();
                        const configScript = document.createElement('script');
                        configScript.type = 'application/octet-stream';
                        configScript.id = 'defaultConfigBase64';
                        configScript.textContent = ConfigManager.encodeUTF8ToBase64(JSON.stringify(config, null, 2));
                        document.head.appendChild(configScript);
                        htmlContent = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
                    }
                    htmlContent = htmlContent.replace(/<html[^>]*>/i, '<html lang="fr">');

                    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                    FileHandler.downloadFile(blob, fileName);
                },

                cancelExport() {
                    this.exportModal.show = false;
                },

                saveGithubToken() {
                    if (!this.githubToken || this.githubToken.trim() === '') {
                        this.setStatus('Veuillez saisir un token', 'error');
                        return;
                    }

                    try {
                        GitHubGistManager.setAccessToken(this.githubToken.trim());
                        this.showGistTokenModal = false;
                        this.githubToken = '';
                        this.setStatus('Token GitHub enregistré', 'success');

                        // Afficher la modale d'export pour le gist
                        setTimeout(() => this.openExportModal('gist'), 300);
                    } catch (error) {
                        this.setStatus('Erreur: ' + error.message, 'error');
                    }
                },

                cancelGithubToken() {
                    this.showGistTokenModal = false;
                    this.githubToken = '';
                },

                copyGistUrl() {
                    navigator.clipboard.writeText(this.gistShareUrl).then(() => {
                        this.setStatus('URL copiée dans le presse-papiers', 'success');
                    }).catch(() => {
                        this.setStatus('Erreur lors de la copie', 'error');
                    });
                },

                copyGistPassphrase() {
                    navigator.clipboard.writeText(this.gistPassphraseToShare).then(() => {
                        this.setStatus('Mot de passe copié dans le presse-papiers', 'success');
                    }).catch(() => {
                        this.setStatus('Erreur lors de la copie', 'error');
                    });
                },

                closeGistModal() {
                    this.showGistModal = false;
                    this.gistShareUrl = '';
                    this.gistWasEncrypted = false;
                    this.gistPassphraseToShare = '';
                },

                openGistUrl() {
                    if (this.gistShareUrl) {
                        window.open(this.gistShareUrl, '_blank');
                    }
                },

                // ─────────────────────────────────────────────────────────────────

                async loadConfig(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    try {
                        const text = await file.text();
                        const parsed = JSON.parse(text);

                        event.target.value = '';

                        if (GistEncrypt.isEncrypted(parsed)) {
                            this._pendingEncryptedJson = parsed;
                            this.showJsonPassphraseModal = true;
                            this.jsonPassphrase = '';
                            this.jsonPassphraseError = '';
                            return;
                        }

                        await this.applyImportedConfig(parsed);
                    } catch (error) {
                        this.setStatus('Erreur import: ' + error.message, 'error');
                    }
                },

                cancelJsonPassphraseModal() {
                    this.showJsonPassphraseModal = false;
                    this._pendingEncryptedJson = null;
                    this.jsonPassphrase = '';
                    this.jsonPassphraseError = '';
                },

                async unlockJsonConfig() {
                    const pass = (this.jsonPassphrase || '').trim();
                    if (!pass) { this.jsonPassphraseError = 'Veuillez entrer la mot de passe'; return; }
                    this.jsonPassphraseError = '';
                    this.jsonPassphraseLoading = true;
                    try {
                        const decrypted = await GistEncrypt.decrypt(this._pendingEncryptedJson, pass);
                        const config = JSON.parse(decrypted);
                        await ConfigManager.prepareConfigForLoad(config);
                        this._pendingEncryptedJson = null;
                        this.showJsonPassphraseModal = false;
                        this.jsonPassphrase = '';
                        await this.applyImportedConfig(config);
                        this.setStatus('Configuration chargée', 'success');
                    } catch (e) {
                        this.jsonPassphraseError = e.message || 'Mot de passe incorrecte';
                    } finally {
                        this.jsonPassphraseLoading = false;
                    }
                },

                async applyImportedConfig(config) {
                        await ConfigManager.prepareConfigForLoad(config);
                        const initCell = (cell, cellIndex) => initializeCell(cell, cellIndex, { generateId: () => this.generateCellId() });

                        // Helper récursif pour initialiser un groupe et ses enfants
                        const initGroup = (group, groupIndex) => {
                            const newGroup = {
                                _id: group.id || this.generateGroupId(),
                                _type: group.type || 'core',
                                direction: group.direction || 'row',
                                style: group.style || '',
                                _order: ConfigManager.normalizeOrder(group.order, groupIndex),
                                cells: (group.cells || []).map((cell, cellIndex) => initCell(ConfigManager.normalizeCell({ ...cell }), cellIndex)),
                                accordion: group.accordion || false,
                                title: group.title || '',
                                accordionOpen: group.accordionOpen !== false // true par défaut
                            };

                            // Ajouter tabsChild et name
                            newGroup.tabsChild = group.tabsChild || false;
                            newGroup.name = group.name || '';

                            if (Array.isArray(group.queries) && group.queries.length > 0) {
                                newGroup.queries = group.queries.map((q, i) => ({
                                    name: q.name || 'main',
                                    sql: q.sql || '',
                                    engine: q.engine || 'sql',
                                    clientVisible: q.clientVisible === true
                                }));
                            } else {
                                newGroup.queries = [];
                            }

                            if (group.loop) {
                                newGroup.loop = {
                                    enabled: group.loop.enabled || false,
                                    query: group.loop.query || '',
                                    zip: group.loop.zip || false,
                                    zipQuery: group.loop.zipQuery || ''
                                };
                            } else {
                                newGroup.loop = { enabled: false, query: '', zip: false, zipQuery: '' };
                            }

                            if (group.children && group.children.length > 0) {
                                newGroup.children = group.children.map((child, childIndex) => {
                                    const initializedChild = initGroup(child, childIndex);
                                    initializedChild._order = ConfigManager.normalizeOrder(child.order, childIndex);
                                    return initializedChild;
                                });
                            }

                            return newGroup;
                        };

                        // Charger les pages depuis la config
                        let loadedPages = (config.job?.pages || []).map((page, pageIndex) => {
                                const allGroups = (page.groups || []).map((group, groupIndex) => initGroup(group, groupIndex));
                                const initGroups = allGroups.filter(g => g._type === 'core');
                                const initLinkGroups = allGroups.filter(g => g._type === 'link');

                                return {
                                    _id: page.id || this.generatePageId(),
                                    name: page.name || `Feuille ${pageIndex + 1}`,
                                    groups: initGroups,
                                    linkGroups: initLinkGroups
                                };
                            });

                        // Si aucune page n'existe, créer une page par défaut
                        if (loadedPages.length === 0) {
                            loadedPages = [{
                                _id: this.generatePageId(),
                                name: 'Feuille 1',
                                groups: [],
                                linkGroups: []
                            }];
                        }

                        this.pages = loadedPages;
                        this.activePageIndex = 0;
                        this._pagesInitialized.clear();
                        this.ensureAllCellsHaveNames();

                        // Charger les fichiers source en attente (depuis la config JSON)
                        await this.loadPendingSourceFiles();

                        // Évaluer les ifQuery des groupes
                        await this.evaluateAllGroupIfQueries();

                        // Auto-exécution au chargement du notebook (page 0)
                        await this.runAllGroups();
                        if (this.pages[0]) this._pagesInitialized.add(this.pages[0]._id);
                        this.$nextTick(() => setTimeout(() => this.refreshMarkdownCellsForPage(0), 300));

                        // Mettre à jour le moteur DB si différent dans la config importée
                        const configDbEngine = config.ui?.dbEngine;
                        if (configDbEngine && configDbEngine !== this.dbEngine) {
                            await this.switchDbEngine(configDbEngine);
                        }

                        // Mettre à jour le DAG si présent dans la config importée
                        if (config.ui?.directedAcyclicGraph !== undefined) {
                            this.directedAcyclicGraph = config.ui.directedAcyclicGraph === true;
                        }

                        // Mettre à jour devMode si présent dans la config importée
                        if (config.ui?.devMode !== undefined) {
                            this.devMode = config.ui.devMode !== false;
                        }

                        // Mettre à jour showLayout si présent (rétrocompat: displaySettings)
                        if (config.ui?.showLayout !== undefined || config.ui?.displaySettings !== undefined) {
                            this.showLayout = (config.ui?.showLayout ?? config.ui?.displaySettings) !== false;
                        }

                        // Mettre à jour le thème si présent dans la config importée
                        const configTheme = config.ui?.theme;
                        if (configTheme && this.availableThemes.includes(configTheme)) {
                            this.setTheme(configTheme);
                        }

                        this.setStatus('Configuration chargée', 'success');
                },

                // Charger les fichiers source marqués comme _pendingFileLoad (depuis config JSON)
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
