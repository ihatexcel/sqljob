// @ts-nocheck
/**
 * Store Zustand principal — remplace notebookApp.ts + tous les mixins Alpine.
 *
 * Stratégie de migration :
 * - On réutilise les 9 fichiers mixin existants tels quels via un proxy "this"
 *   qui mappe this.xxx → get().xxx (lecture) et this.xxx = val → set({xxx:val}) (écriture)
 * - Un shim Alpine minimal (window.Alpine) permet aux mixins d'utiliser
 *   Alpine.store('confirmModal') sans modification
 * - forceUpdate() déclenche un re-render React après des mutations profondes
 */
import { create } from 'zustand'
import '@iconify/iconify'
import { pagesMixin } from '../mixins/pagesMixin'
import { helpersMixin } from '../mixins/helpersMixin'
import { groupsMixin } from '../mixins/groupsMixin'
import { cellsMixin } from '../mixins/cellsMixin'
import { filesMixin } from '../mixins/filesMixin'
import { executionMixin } from '../mixins/executionMixin'
import { parametersMixin } from '../mixins/parametersMixin'
import { editorsMixin } from '../mixins/editorsMixin'
import { exportImportMixin } from '../mixins/exportImportMixin'
import { ConfigManager } from '../../lib/ConfigManager'
import { DuckDBManager } from '../../lib/DuckDBManager'
import { CellConfigService, initializeCell } from '../../lib/CellConfigService'
import { CellRenderer } from '../../lib/CellRenderer'
import { CellBodyRenderer, CELL_BODY_FAMILIES } from '../../lib/CellBodyRenderer'
import { EChartSqlParser } from '../../lib/EChartSqlParser'
import { GistEncrypt } from '../../lib/GistEncrypt'
import { GitHubGistManager } from '../../lib/GitHubGistManager'
import { FileHandler } from '../../lib/FileHandler'
import { CDNManager } from '../../lib/CDNManager'
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from '../../lib/cellTypeSchemas'
import { formatValueForInputType } from '../../lib/utils'
import { useConfirmModal, useTemplateModal } from './uiStores'

// ─── Shim Alpine pour compatibilité mixins ───────────────────────────────────
// Les mixins appellent Alpine.store('confirmModal').show(...) et Alpine.initTree()
// On fournit un shim minimal pour que ce code fonctionne sans Alpine.js
if (typeof window !== 'undefined' && !window.Alpine) {
    window.Alpine = {
        store: (name: string) => {
            if (name === 'confirmModal') return useConfirmModal.getState()
            if (name === 'templateModal') return useTemplateModal.getState()
            return null
        },
        initTree: () => {}
    }
}

// ─── Expose globals (nécessaire pour les expressions dans les templates HTML) ─
export function exposeGlobals() {
    Object.assign(window, {
        ConfigManager,
        CellConfigService,
        initializeCell,
        CellRenderer,
        CellBodyRenderer,
        CELL_BODY_FAMILIES,
        EChartSqlParser,
        GistEncrypt,
        GitHubGistManager,
        FileHandler,
        DuckDBManager,
        CDNManager,
        CELL_TYPE_SCHEMAS,
        CELL_TYPE_HANDLERS,
        formatValueForInputType,
    })
}

// ─── Proxy this → Zustand get/set ────────────────────────────────────────────
function createThisProxy(get: () => any, set: (p: any) => void): any {
    return new Proxy(Object.create(null), {
        get(_, prop: string) {
            // Alpine-specific helpers
            if (prop === '$nextTick') return (fn: () => void) => setTimeout(fn, 0)

            // Computed getters (remplacent les get() d'Alpine)
            if (prop === 'activePage') {
                const s = get()
                return s.pages[s.activePageIndex] || s.pages[0]
            }
            if (prop === 'groups') {
                const s = get()
                const ap = s.pages[s.activePageIndex] || s.pages[0]
                return ap?.groups || []
            }
            if (prop === 'linkGroups') {
                const s = get()
                const ap = s.pages[s.activePageIndex] || s.pages[0]
                return ap?.linkGroups || []
            }

            const state = get()
            const val = state[prop]
            if (typeof val === 'function') {
                // Bind les méthodes pour que leur `this` pointe vers le proxy
                return (...args: any[]) => val.apply(createThisProxy(get, set), args)
            }
            return val
        },
        set(_, prop: string, value: any) {
            set({ [prop]: value })
            return true
        }
    })
}

// ─── Construction de l'état initial (repris de notebookApp.ts) ───────────────
function buildInitialState() {
    const config = (typeof window !== 'undefined' && window._loadedConfig)
        ? window._loadedConfig
        : ConfigManager.getDefaultConfig()

    const initCell = (cell: any, cellIndex: number) => initializeCell(cell, cellIndex)

    const initGroup = (group: any, groupIndex: number): any => {
        const ng = ConfigManager.normalizeGroup({ ...group })
        const newGroup: any = {
            _id: ng.id || ConfigManager.generateGroupId(),
            _type: ng.type || 'core',
            direction: ng.direction || 'row',
            style: ng.style || '',
            _order: ConfigManager.normalizeOrder(ng.order, groupIndex),
            cells: (ng.cells || []).map((cell: any, ci: number) =>
                initCell(ConfigManager.normalizeCell({ ...cell }), ci)),
            loop: ng.loop ? {
                enabled: ng.loop.enabled || false,
                query: ng.loop.query || '',
                zip: ng.loop.zip || false,
                zipQuery: ng.loop.zipQuery || ''
            } : { enabled: false, query: '', zip: false, zipQuery: '' },
            accordion: ng.accordion || false,
            title: ng.title || '',
            accordionOpen: ng.accordionOpen !== false
        }
        newGroup.tabsChild = ng.tabsChild || false
        newGroup.name = ng.name || ''
        if (Array.isArray(ng.queries) && ng.queries.length > 0) {
            newGroup.queries = ng.queries.map((q: any) => ({
                name: q.name || 'main',
                sql: q.sql || '',
                engine: q.engine || 'sql',
                clientVisible: q.clientVisible === true
            }))
        } else {
            newGroup.queries = []
        }
        if (ng.children && ng.children.length > 0) {
            newGroup.children = ng.children.map((child: any, ci: number) => {
                const init = initGroup(child, ci)
                init._order = ConfigManager.normalizeOrder(child.order, ci)
                return init
            })
        }
        return newGroup
    }

    let initPages: any[] = (config.job?.pages || []).map((page: any, pi: number) => {
        const allGroups = (page.groups || []).map((g: any, gi: number) => initGroup(g, gi))
        return {
            _id: page.id || ConfigManager.generatePageId(),
            name: page.name || `Feuille ${pi + 1}`,
            groups: allGroups.filter((g: any) => g._type === 'core'),
            linkGroups: allGroups.filter((g: any) => g._type === 'link')
        }
    })

    if (initPages.length === 0) {
        initPages = [{
            _id: ConfigManager.generatePageId(),
            name: 'Feuille 1',
            groups: [],
            linkGroups: []
        }]
    }

    const devMode = config.ui?.devMode !== false
    const showLayout = (config.ui?.showLayout ?? config.ui?.displaySettings) !== false
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('sqljob-theme') : null
    const currentTheme = config.ui?.theme || savedTheme || 'light'
    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', currentTheme)
    }
    const savedDbEngine = typeof localStorage !== 'undefined' ? localStorage.getItem('sqljob-dbEngine') : null
    const initialDbEngine = config.ui?.dbEngine || savedDbEngine || 'duckdb-wasm'
    DuckDBManager.setEngine(initialDbEngine)

    return {
        pages: initPages,
        activePageIndex: 0,
        isLoading: false,
        status: '',
        statusType: '',
        devMode,
        showLayout,
        availableThemes: [
            'light', 'dark', 'cupcake', 'bumblebee', 'emerald', 'corporate',
            'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween',
            'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy',
            'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn',
            'business', 'acid', 'lemonade', 'night', 'coffee', 'winter',
            'dim', 'nord', 'sunset'
        ],
        currentTheme,
        dbEngine: initialDbEngine,
        showDbEngineModal: false,
        directedAcyclicGraph: config.ui?.directedAcyclicGraph === true,

        // GitHub Gist
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

        // Export modal
        exportModal: {
            show: false,
            type: '',
            fileName: 'notebook-config.json',
            description: 'sqljob Notebook Configuration',
            devMode: null,
            showLayout: null,
            encryptGist: false,
            gistPassphrase: ''
        },

        // DAG
        _dagDebounceTimer: null,
        _dagDebounceDelay: 200,
        _pagesInitialized: new Set(),

        // Drag & drop pages
        draggedPageIndex: null,
        dragOverPageIndex: null,

        // Modals
        showAddGroupModal: false,
        addCellToGroupModal: { open: false, path: null },
        insertGroupModal: { open: false, atIndex: null },
        insertCellModal: { open: false, groupIndex: null, atCellIndex: null },
        cellConfigModal: { open: false, path: null, cellIndex: null },
        childGroupModal: { open: false, path: null, cellIndex: null, group: null },
        loopConfigModal: { open: false, path: null },
        groupSettingsModal: { open: false, path: null },
        exportDropdownOpen: false,

        // Loop
        _currentLoopValue: null,
        _zipFiles: [],
        _zipMode: false,

        // Drag & drop cells/groups
        draggedCellPath: null,
        dragOverCellPath: null,
        dragOverGroup: null,
        draggedChildPath: null,
        dragOverChildPath: null,
        draggedTopGroup: null,

        // Cell types
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

        _tables: {},
        _rev: 0,  // compteur de version pour forcer les re-renders
    }
}

// ─── Store Zustand ────────────────────────────────────────────────────────────
export const useNotebookStore = create<any>((set, get) => {
    const initialState = buildInitialState()

    // Fusionner toutes les méthodes des mixins
    const allMixinMethods: any = {
        ...pagesMixin(),
        ...helpersMixin(),
        ...groupsMixin(),
        ...cellsMixin(),
        ...filesMixin(),
        ...executionMixin(),
        ...parametersMixin(),
        ...editorsMixin(),
        ...exportImportMixin(),
    }

    // Wrapper chaque méthode pour qu'elle utilise le proxy "this"
    const wrappedActions: any = {}
    for (const [key, value] of Object.entries(allMixinMethods)) {
        if (typeof value === 'function') {
            wrappedActions[key] = (...args: any[]) => {
                const proxy = createThisProxy(get, set)
                return (value as Function).apply(proxy, args)
            }
        }
        // Les propriétés non-function des mixins (ex: draggedPageIndex) sont dans initialState
    }

    return {
        ...initialState,
        ...wrappedActions,

        // Overrides de méthodes mixin qui font des mutations profondes (this.X.Y = val)
        // que le proxy ne peut pas intercepter — on remplace par des set() Zustand directs.
        closeCellConfig: () => set((s: any) => ({ cellConfigModal: { ...s.cellConfigModal, open: false } })),

        // Déclenche un re-render React (utile après mutations profondes)
        forceUpdate() {
            set((s: any) => ({ _rev: s._rev + 1 }))
        },

        // Ré-initialise le store depuis une config chargée (ex: après déchiffrement Gist)
        initFromConfig(loadedConfig: any) {
            if (typeof window !== 'undefined') {
                window._loadedConfig = loadedConfig
            }
            const newState = buildInitialState()
            set({ ...newState })
        },

        // Setters directs pour le state exposé aux composants React
        setPages: (pages: any[]) => set({ pages }),
        setActivePageIndex: (i: number) => set({ activePageIndex: i }),
        setIsLoading: (v: boolean) => set({ isLoading: v }),
        setDevMode: (v: boolean) => set({ devMode: v }),
        setShowLayout: (v: boolean) => set({ showLayout: v }),

        // Getters computés (exposés pour les composants React)
        getActivePage: () => {
            const s = get()
            return s.pages[s.activePageIndex] || s.pages[0]
        },
        getGroups: () => {
            const ap = get().getActivePage()
            return ap?.groups || []
        },
        getLinkGroups: () => {
            const ap = get().getActivePage()
            return ap?.linkGroups || []
        },
    }
})
