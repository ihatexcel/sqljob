// @ts-nocheck

import { pagesMixin } from './mixins/pagesMixin';
import { helpersMixin } from './mixins/helpersMixin';
import { groupsMixin } from './mixins/groupsMixin';
import { cellsMixin } from './mixins/cellsMixin';
import { filesMixin } from './mixins/filesMixin';
import { executionMixin } from './mixins/executionMixin';
import { parametersMixin } from './mixins/parametersMixin';
import { editorsMixin } from './mixins/editorsMixin';
import { exportImportMixin } from './mixins/exportImportMixin';

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
                // ─── État principal ────────────────────────────────────────────────
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

                // ─── Drag & drop pages ─────────────────────────────────────────────
                draggedPageIndex: null,
                dragOverPageIndex: null,

                // ─── Modals & Dropdowns ────────────────────────────────────────────
                showAddGroupModal: false,
                addCellToGroupModal: { open: false, path: null },
                insertGroupModal: { open: false, atIndex: null },
                insertCellModal: { open: false, groupIndex: null, atCellIndex: null },
                cellConfigModal: { open: false, path: null, cellIndex: null },
                childGroupModal: { open: false, path: null, cellIndex: null, group: null },
                loopConfigModal: { open: false, path: null },
                groupSettingsModal: { open: false, path: null },
                exportDropdownOpen: false,

                // ─── Exécution en boucle ───────────────────────────────────────────
                _currentLoopValue: null,
                _zipFiles: [],
                _zipMode: false,

                // ─── Drag & Drop cellules/groupes ──────────────────────────────────
                draggedCellPath: null, // { path: [], cellIndex }
                dragOverCellPath: null, // { path: [], cellIndex, position: 'left'|'right' }
                dragOverGroup: null, // { groupIndex, position: 'top'|'bottom' }
                draggedChildPath: null, // { parentPath: [], childIndex }
                dragOverChildPath: null, // { parentPath: [], childIndex, position: 'left'|'right' }
                draggedTopGroup: null, // groupIndex du groupe niveau 0 en cours de drag

                // ─── Types de cellules disponibles ────────────────────────────────
                cellTypes: [
                    { type: 'markdown', label: 'Markdown', icon: '<span class="iconify" data-icon="material-symbols-light:edit-note" style="font-size:1.25rem"></span>' },
                    { type: 'source', label: 'Source', icon: '<span class="iconify" data-icon="material-symbols-light:folder-open" style="font-size:1.25rem"></span>' },
                    { type: 'uiParameter', label: 'Paramètre UI', icon: '<span class="iconify" data-icon="material-symbols-light:tune" style="font-size:1.25rem"></span>' },
                    { type: 'buttonRunNextCells', label: 'Bouton Exécuter', icon: '<span class="iconify" data-icon="material-symbols-light:play-circle" style="font-size:1.25rem"></span>' },
                    { type: 'sqlRecursiveParse', label: 'SQL', icon: '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:1.25rem"></span>' },
                    { type: 'table', label: 'Tableau', icon: '<span class="iconify" data-icon="material-symbols-light:table" style="font-size:1.25rem"></span>' },
                    { type: 'iframe', label: 'HTML/Iframe', icon: '<span class="iconify" data-icon="material-symbols-light:web" style="font-size:1.25rem"></span>' },
                    { type: 'sqlStat', label: 'Stat SQL', icon: '<span class="iconify" data-icon="material-symbols-light:monitoring" style="font-size:1.25rem"></span>' },
                    { type: 'publipostageWord', label: 'Publipostage Word', icon: '<span class="iconify" data-icon="material-symbols-light:description" style="font-size:1.25rem"></span>' },
                    { type: 'pdfme', label: 'PDF (pdfme)', icon: '<span class="iconify" data-icon="material-symbols-light:picture-as-pdf" style="font-size:1.25rem"></span>' },
                    { type: 'echart', label: 'EChart (Apache ECharts)', icon: '<span class="iconify" data-icon="material-symbols-light:bar-chart" style="font-size:1.25rem"></span>' },
                    { type: 'perspective', label: 'Perspective Viewer', icon: '<span class="iconify" data-icon="material-symbols-light:analytics" style="font-size:1.25rem"></span>' }
                ],

                // ─── Tables simple-datatables par cellule ─────────────────────────
                _tables: {},

                // ─── Getters pour la page active ──────────────────────────────────
                get activePage() {
                    return this.pages[this.activePageIndex] || this.pages[0];
                },
                get groups() {
                    return this.activePage?.groups || [];
                },
                get linkGroups() {
                    return this.activePage?.linkGroups || [];
                },

                // ─── Méthodes par domaine (mixin spread pattern) ──────────────────
                ...pagesMixin(),
                ...helpersMixin(),
                ...groupsMixin(),
                ...cellsMixin(),
                ...filesMixin(),
                ...executionMixin(),
                ...parametersMixin(),
                ...editorsMixin(),
                ...exportImportMixin(),
            };
}
