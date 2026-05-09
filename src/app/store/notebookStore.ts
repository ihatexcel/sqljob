/**
 * Store Zustand principal — remplace notebookApp.ts + tous les mixins Alpine.
 *
 * Tous les mixins Alpine ont été convertis en slices Zustand purs.
 * forceUpdate() déclenche un re-render React après des mutations profondes.
 * createRoomShellSlice ajoute le système de layout mosaic (RoomShell).
 */
import { setAutoFreeze } from 'immer'
import { z } from 'zod'
import { createRoomShellSlice, createRoomStore, persistSliceConfigs, LayoutConfig } from '@sqlrooms/room-shell'
import type { NotebookStoreState } from './types'
import { createBaseDuckDbConnector } from '@sqlrooms/duckdb-core'
import { createSqlEditorSlice, createDefaultSqlEditorConfig } from '@sqlrooms/sql-editor'
import { createCellsSlice as createSqlroomsCellsSlice, createDefaultCellRegistry } from '@sqlrooms/cells'
import { createNotebookSlice } from '@sqlrooms/notebook'
import { createCanvasSlice } from '@sqlrooms/canvas'
import { DatabaseIcon } from 'lucide-react'
// Panel components (lazy import safe — utilisés uniquement au rendu, pas à l'évaluation)
import { NotebookPanel } from '../components/NotebookPanel'
import { DataSourcesPanel } from '../components/DataSourcesPanel'
import '@iconify/iconify'
// Slices Zustand purs (convertis depuis les mixins Alpine)
import { createPagesSlice } from './slices/pagesSlice'
import { createHelpersSlice } from './slices/helpersSlice'
import { createParametersSlice } from './slices/parametersSlice'
import { createExportSlice } from './slices/exportSlice'
import { createGroupsSlice } from './slices/groupsSlice'
import { createCellsSlice } from './slices/cellsSlice'
import { createFilesSlice } from './slices/filesSlice'
import { createExecutionSlice } from './slices/executionSlice'
import { createCopyPasteSlice } from './slices/copyPasteSlice'
import { ConfigManager, exportConfigToJson } from '../../lib/ConfigManager'
import { applyThemeFromConfig, initCustomTheme } from '../components/modals/ThemeCustomModal'
import { DuckDBManager } from '../../lib/DuckDBManager'
import { CellConfigService, initializeCell } from '../../lib/CellConfigService'
import { EChartSqlParser } from '../../lib/EChartSqlParser'
import { GistEncrypt } from '../../lib/GistEncrypt'
import { GitHubGistManager } from '../../lib/GitHubGistManager'
import { FileHandler } from '../../lib/FileHandler'
import { CDNManager } from '../../lib/CDNManager'
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from '../../lib/cellTypeSchemas'
import { formatValueForInputType } from '../../lib/utils'


// TODO(produce-migration): setAutoFreeze(false) est un workaround pour permettre les
// mutations directes sur les cellules (cell._status = 'running', cell._results = rows…)
// dans executionSlice et les autres slices. La migration vers produce() dans chaque slice
// permettrait de supprimer cette ligne, mais requiert une refonte architecturale complète.
setAutoFreeze(false)

// ─── Expose globals (nécessaire pour les expressions dans les templates HTML) ─
export function exposeGlobals() {
    Object.assign(window, {
        ConfigManager,
        exportConfigToJson,
        CellConfigService,
        initializeCell,
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
                showQueryEditor: (q.showQueryEditor ?? q.clientVisible) === true
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
    // La barre latérale est cachée par défaut — le logo sqljob dans le header la toggle.
    const showLayout = config.ui?.showLayout ?? false
    const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('sqljob-theme') : null
    const currentTheme = config.ui?.theme || savedTheme || 'light'
    if (typeof document !== 'undefined') {
        const theme = currentTheme === 'dark' ? 'dark' : 'light'
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        localStorage.setItem('sqljob-theme', theme)
        // Appliquer le preset ou CSS custom issu de la config (gist URL, import JSON…)
        if (config.ui?.theme) applyThemeFromConfig(config.ui)
        else initCustomTheme() // config vide → relire le preset/custom depuis localStorage
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
        availableThemes: ['light', 'dark'],
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
        _pagesInitialized: new Set<string>(),

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

        // Cell types — icon = nom material-symbols-light (sans préfixe), rendu par CellTypeIcon (lucide)
        cellTypes: [
            { type: 'markdown',           label: 'Markdown',                icon: 'edit-note' },
            { type: 'source',             label: 'Source',                   icon: 'folder-open' },
            { type: 'uiParameter',        label: 'Paramètre UI',             icon: 'tune' },
            { type: 'buttonRunNextCells', label: 'Bouton Exécuter',          icon: 'play-circle' },
            { type: 'sql',  label: 'SQL',                      icon: 'storage' },

            { type: 'iframe',             label: 'HTML/Iframe',              icon: 'web' },
            { type: 'sqlStat',            label: 'Stat SQL',                 icon: 'monitoring' },
            { type: 'pivot',              label: 'Pivot',                    icon: 'pivot-table-chart' },
            { type: 'publipostageWord',   label: 'Publipostage Word',        icon: 'description' },
            { type: 'pdfme',              label: 'PDF (pdfme)',               icon: 'picture-as-pdf' },
            { type: 'perspective',        label: 'Perspective Viewer',       icon: 'analytics' },
            { type: 'univerSheet',        label: 'Univer Sheet',             icon: 'table-chart' },
        ],

        _tables: {},
        _duckdbTables: {} as Record<string, { rowCount: number, columns: {name: string, type: string}[] }>,
        _roomFiles: [] as {name: string, tableName: string, size: number, source: 'dropzone' | 'source-cell'}[],
        _rev: 0,  // compteur de version pour forcer les re-renders
    }
}

// ─── Panel IDs (Zod enum — typage statique + sécurité à l'exécution) ─────────
export const PanelTypes = z.enum(['main', 'data'] as const)
export type PanelTypes = z.infer<typeof PanelTypes>

// ─── Connecteur DuckDB ponté vers DuckDBManager ───────────────────────────────
// Permet à SqlEditorModal (et state.db) d'utiliser la même instance DuckDB
// que les cells sqljob, sans dupliquer la connexion.
const duckdbManagerConnector = createBaseDuckDbConnector(
    { dbPath: ':memory:' },
    {
        initializeInternal: async () => {
            // Attend que DuckDB soit prêt avant que sqlrooms appelle refreshTableSchemas()
            await DuckDBManager.waitUntilReady()
        },
        executeQueryInternal: async (sql: string) => {
            if (DuckDBManager.currentEngine === 'ducklings') return null
            if (!DuckDBManager.connInstance) {
                // DuckDB pas encore prêt : retourner null permet à refreshTableSchemas()
                // de court-circuiter proprement (le mock partiel causait un crash sur
                // null.getChild() quand sqlrooms itérait les colonnes du résultat Arrow).
                return null
            }
            try {
                const result = await DuckDBManager.executeQueryArrow(sql)
                return result
            } catch (err) {
                console.error('[duckdbBridge] error:', err)
                throw err
            }
        },
    }
)

// ─── Store Zustand ────────────────────────────────────────────────────────────
const { roomStore: _roomStore, useRoomStore: _useNotebookStore } = createRoomStore<NotebookStoreState>(
  persistSliceConfigs(
    {
      name: 'sqljob-layout-state-v1',
      sliceConfigSchemas: { layout: LayoutConfig },
    },
    (set, get, store) => {
    // === Slice SqlEditor ===
    const sqlEditorState = createSqlEditorSlice({ config: createDefaultSqlEditorConfig() })(set, get, store)

    // === Slice RoomShell : layout mosaic + panels ===
    const roomShellState = createRoomShellSlice({
        config: { title: 'SQLjob', dataSources: [] },
        connector: duckdbManagerConnector,
        layout: {
            config: {
                type: 'mosaic',
                nodes: PanelTypes.enum.main,
            } satisfies LayoutConfig,
            panels: {
                [PanelTypes.enum.main]: {
                    title: 'Notebook',
                    icon: () => null,
                    component: NotebookPanel,
                    placement: 'main',
                },
                [PanelTypes.enum.data]: {
                    title: 'Sources',
                    icon: DatabaseIcon,
                    component: DataSourcesPanel,
                    placement: 'sidebar',
                },
            },
        },
    })(set, get, store)

    // === Slices sqlrooms notebook (requis par SheetsTabBar + Notebook de @sqlrooms/cells / @sqlrooms/notebook) ===
    const sqlroomsCellsState = createSqlroomsCellsSlice({ cellRegistry: createDefaultCellRegistry() })(set, get, store)
    const notebookState = createNotebookSlice()(set, get, store)
    const canvasState = createCanvasSlice()(set, get, store)

    const initialState = buildInitialState()

    // Slices Zustand purs (convertis depuis les mixins Alpine)
    const pagesActions = createPagesSlice(set, get)
    const helpersActions = createHelpersSlice(set, get)
    const parametersActions = createParametersSlice(set, get)
    const exportActions = createExportSlice(set, get)
    const groupsActions = createGroupsSlice(set, get)
    const cellsActions = createCellsSlice(set, get)
    const filesActions = createFilesSlice(set, get)
    const executionActions = createExecutionSlice(set, get)
    const copyPasteActions = createCopyPasteSlice(set, get)

    // Helper : vérifie si le panneau 'data' est actuellement visible dans le layout
    function isDataPanelVisible() {
        const nodes = get().layout?.config?.nodes
        if (!nodes) return false
        if (nodes === 'data') return true
        if (typeof nodes === 'object') return JSON.stringify(nodes).includes('"data"')
        return false
    }

    // Override togglePanel pour mobile (< 768px) :
    // ouvre le panneau 'data' en plein écran au lieu du layout splitté
    const originalTogglePanel = roomShellState.layout.togglePanel
    const mobileTogglePanel = (panel: string, show?: boolean) => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
        if (isMobile && panel === PanelTypes.enum.data) {
            const dataVisible = isDataPanelVisible()
            if (dataVisible) {
                set((s: any) => ({ layout: { ...s.layout, config: { ...s.layout.config, nodes: PanelTypes.enum.main } } }))
            } else {
                set((s: any) => ({ layout: { ...s.layout, config: { ...s.layout.config, nodes: PanelTypes.enum.data } } }))
            }
            return
        }
        originalTogglePanel(panel, show)
    }

    return {
        ...sqlEditorState,
        ...roomShellState,
        ...sqlroomsCellsState,
        ...notebookState,
        ...canvasState,
        layout: {
            ...roomShellState.layout,
            togglePanel: mobileTogglePanel,
        },
        ...initialState,
        ...pagesActions,
        ...helpersActions,
        ...parametersActions,
        ...exportActions,
        ...groupsActions,
        ...cellsActions,
        ...filesActions,
        ...executionActions,
        ...copyPasteActions,

        // db.schemaTrees démarre undefined dans DuckDbSlice.
        // deepEquals([], []) bloque la mise à jour si aucune table → schemaTrees reste undefined.
        // On force [] pour que TableStructurePanel render même quand la base est vide.
        db: { ...roomShellState.db, schemaTrees: [] },

        // Override addRoomFile : redirige vers DuckDBManager au lieu du connecteur sqlrooms
        // pour partager une seule instance DuckDB avec toutes les cells sqljob.
        addRoomFile: async (file: File, tableName: string) => {
            const ext = (file.name.split('.').pop() ?? '').toLowerCase();
            await DuckDBManager.registerFile(file.name, file);
            let query: string;
            if (ext === 'csv' || ext === 'tsv') {
                query = `CREATE OR REPLACE TABLE "${tableName}" AS SELECT * FROM read_csv('${file.name}', HEADER = true, AUTO_DETECT = true, SAMPLE_SIZE = -1)`;
            } else if (ext === 'parquet') {
                query = `CREATE OR REPLACE TABLE "${tableName}" AS SELECT * FROM read_parquet('${file.name}')`;
            } else if (ext === 'json') {
                query = `CREATE OR REPLACE TABLE "${tableName}" AS SELECT * FROM read_json_auto('${file.name}')`;
            } else {
                query = `CREATE OR REPLACE TABLE "${tableName}" AS SELECT * FROM '${file.name}'`;
            }
            await DuckDBManager.executeQuery(query);
            set((s: any) => {
                const existing = s._roomFiles ?? [];
                const alreadyPresent = existing.some((f: any) => f.tableName === tableName);
                if (alreadyPresent) return {};
                return { _roomFiles: [...existing, { name: file.name, tableName, size: file.size, source: 'dropzone' }] };
            });
            await get().refreshDuckdbTables();
            if (DuckDBManager.currentEngine !== 'ducklings') {
                try { await get().db.refreshTableSchemas(); } catch { /* ignore */ }
            }
        },

        // Overrides de méthodes mixin qui font des mutations profondes (this.X.Y = val)
        // que le proxy ne peut pas intercepter — on remplace par des set() Zustand directs.
        closeCellConfig: () => set((s: any) => ({ cellConfigModal: { ...s.cellConfigModal, open: false } })),

        // Déclenche un re-render React (utile après mutations profondes)
        forceUpdate() {
            set((s: any) => ({ _rev: s._rev + 1 }))
        },

        // Ré-initialise le store depuis une config chargée (ex: après déchiffrement Gist)
        initFromConfig(loadedConfig: unknown) {
            if (typeof window !== 'undefined') {
                window._loadedConfig = loadedConfig
            }
            const newState = buildInitialState()
            set(newState as Partial<NotebookStoreState>)
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
)

// ─── Exports publics ──────────────────────────────────────────────────────────
export const roomStore = _roomStore
export const useNotebookStore = _useNotebookStore
