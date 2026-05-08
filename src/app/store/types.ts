/**
 * types.ts — Types partagés pour le store Zustand sqljob.
 *
 * NotebookStoreState est composé par intersection des slice state types sqlrooms
 * et de CustomNotebookState (état propre à sqljob).
 * Les types NotebookCell, NotebookGroup, NotebookPage modélisent les entités métier.
 */

import type { PivotConfig, PivotField } from '@sqlrooms/pivot'
import type { RoomShellSliceState } from '@sqlrooms/room-shell'
import type { SqlEditorSliceState } from '@sqlrooms/sql-editor'
import type { CellsSliceState } from '@sqlrooms/cells'
import type { NotebookSliceState } from '@sqlrooms/notebook'
import type { CanvasSliceState } from '@sqlrooms/canvas'

// ─── Entités métier ────────────────────────────────────────────────────────────

/** Informations sur une table DuckDB (DataSourcesPanel, PivotBody) */
export type DuckdbTableInfo = {
    rowCount: number
    columns: PivotField[]
    schema?: string
}

/** Requête associée à une cellule (SQL, moteur, affichage) */
export type CellQuery = {
    name: string
    sql: string
    engine: string
    showQueryEditor?: boolean
    showQueryResult?: boolean
    ast?: Record<string, unknown>
    degraded?: boolean
    manualSql?: string
}

/** Option d'un paramètre dropdown */
export type DropdownOption = {
    value: string
    label: string
}

/** Cellule notebook — propriétés persistées + propriétés runtime (préfixées _) */
export type NotebookCell = {
    _id: string
    type: string
    name?: string
    title?: string
    buttonLabel?: string
    queries?: CellQuery[]
    json?: Record<string, unknown>
    materialized?: string
    maxRows?: number
    paramType?: string
    inputType?: string
    rangeMin?: number
    rangeMax?: number
    rangeStep?: number
    userVisible?: boolean
    userEditable?: boolean
    preserveUserValue?: boolean
    referenceName?: string
    childGroupId?: string
    docxTemplateBase64?: string | null
    docxTemplateFileName?: string
    snapshot?: string
    readOnly?: boolean
    icon?: string
    subtitle?: string

    // Runtime (mutable, non persisté)
    _status?: string | null
    _results?: Record<string, unknown>[] | null
    _resultInfo?: string | null
    _rev?: number
    _markdownContent?: string
    _htmlContent?: string
    _statValue?: string
    _echartsOption?: unknown
    _kpiHtml?: string | null
    _kpiLabel?: string | null
    _sublabel?: string | null
    _kpiIcon?: string | null
    _columnTypes?: Record<string, string>
    _schemaTypes?: Record<string, string>
    _value?: unknown
    _options?: DropdownOption[]
    _initialized?: boolean
    _userModified?: boolean
    _paramError?: string | null
    _fileName?: string
    _currentFile?: File | null
    _isDragging?: boolean
    _loaded?: boolean
    _importFailed?: boolean
    _loadedViaFallback?: boolean
    _mainQueryError?: string | null
    _fallbackQueryError?: string | null
    _rejectErrorsCount?: number
    _rejectedCellsCount?: number
    _rowCount?: number
    _queryBuilder?: string | null
    _pendingFileLoad?: boolean
    _perspectiveReady?: boolean
    _perspectiveScheduled?: boolean
    _perspectiveRendering?: boolean
    _perspectiveWorker?: unknown
    _perspectiveTable?: unknown
    _perspectiveQuery?: string
    _arrowTable?: unknown
    _univerReady?: boolean
    _univerRunId?: number
    _univerRows?: Record<string, unknown>[] | null
    _univerCellTypes?: number[] | null
    _univerColumnFormats?: (string | null)[] | null
    _univerSnapshotPending?: string | null
    _univerModified?: boolean
    _univerAPI?: unknown
    _easyMDEcli?: unknown
    _easyMDE?: unknown
    _renderedHtml?: string
    _order?: number
    [key: string]: unknown
}

/** Configuration de boucle d'un groupe */
export type GroupLoop = {
    enabled: boolean
    query: string
    zip: boolean
    zipQuery: string
}

/** Groupe de cellules */
export type NotebookGroup = {
    _id: string
    _type?: string
    direction: 'row' | 'column'
    style?: string
    _order?: number
    cells: NotebookCell[]
    children?: NotebookGroup[]
    loop?: GroupLoop
    accordion?: boolean
    title?: string
    accordionOpen?: boolean
    tabsChild?: boolean
    name?: string
    queries?: CellQuery[]
    _ifQueryResult?: boolean | null
    [key: string]: unknown
}

/** Page du notebook */
export type NotebookPage = {
    _id: string
    name: string
    groups: NotebookGroup[]
    linkGroups: NotebookGroup[]
}

/** Fichier chargé (dropzone ou cellule source) */
export type RoomFile = {
    name: string
    tableName: string
    size: number
    source: 'dropzone' | 'source-cell'
}

/** Type d'une cellule (icône + label) */
export type CellTypeDescriptor = {
    type: string
    label: string
    icon: string
}

/** Modal d'export */
export type ExportModal = {
    show: boolean
    type: string
    fileName: string
    description: string
    devMode: boolean | null
    showLayout: boolean | null
    encryptGist: boolean
    gistPassphrase: string
    includeFiles?: boolean
}

// ─── État custom sqljob (hors slices sqlrooms) ────────────────────────────────

/**
 * CustomNotebookState — propriétés propres à sqljob non couvertes par les slice
 * state types sqlrooms (buildInitialState + 9 slices Zustand purs).
 */
export interface CustomNotebookState {
    // ── État initial (buildInitialState) ──────────────────────────────────────
    pages: NotebookPage[]
    activePageIndex: number
    isLoading: boolean
    status: string
    statusType: string
    devMode: boolean
    showLayout: boolean
    availableThemes: string[]
    currentTheme: string
    dbEngine: string
    showDbEngineModal: boolean
    directedAcyclicGraph: boolean

    // GitHub Gist
    githubToken: string
    gistShareUrl: string
    showGistModal: boolean
    gistWasEncrypted: boolean
    gistPassphraseToShare: string
    showGistTokenModal: boolean
    showJsonPassphraseModal: boolean
    jsonPassphrase: string
    jsonPassphraseError: string
    jsonPassphraseLoading: boolean
    _pendingEncryptedJson: unknown

    // Export modal
    exportModal: ExportModal

    // DAG
    _dagDebounceTimer: ReturnType<typeof setTimeout> | null
    _dagDebounceDelay: number
    _pagesInitialized: Set<string>

    // Drag & drop pages
    draggedPageIndex: number | null
    dragOverPageIndex: number | null

    // Modals
    showAddGroupModal: boolean
    addCellToGroupModal: { open: boolean; path: number[] | null; groupIndex?: number | null }
    insertGroupModal: { open: boolean; atIndex: number | null }
    insertCellModal: { open: boolean; groupIndex?: number | null; atCellIndex: number | null; path?: number[] | null }
    cellConfigModal: { open: boolean; path: number[] | null; cellIndex: number | null }
    childGroupModal: { open: boolean; path: number[] | null; cellIndex: number | null; group: NotebookGroup | null }
    loopConfigModal: { open: boolean; path: number[] | null }
    groupSettingsModal: { open: boolean; path: number[] | null }
    exportDropdownOpen: boolean

    // Loop
    _currentLoopValue: unknown
    _zipFiles: { filename: string; content: unknown; type: string }[]
    _zipMode: boolean

    // Drag & drop cells/groups
    draggedCellPath: number[] | null
    dragOverCellPath: number[] | null
    dragOverGroup: unknown
    draggedChildPath: unknown
    dragOverChildPath: unknown
    draggedTopGroup: unknown

    // Cell types registry
    cellTypes: CellTypeDescriptor[]

    // Runtime tables
    _tables: Record<string, unknown>
    _duckdbTables: Record<string, DuckdbTableInfo>
    _roomFiles: RoomFile[]
    _rev: number

    // Clipboard
    _clipboardItem: { type: 'sqljob-cell' | 'sqljob-group'; data: unknown } | null

    // ── Overrides / méthodes store ────────────────────────────────────────────
    addRoomFile: (file: File, tableName: string) => Promise<void>
    closeCellConfig: () => void
    forceUpdate: () => void
    saveToLocalStorage?: () => void
    initFromConfig: (loadedConfig: unknown) => void
    setPages: (pages: NotebookPage[]) => void
    setActivePageIndex: (i: number) => void
    setIsLoading: (v: boolean) => void
    setDevMode: (v: boolean) => void
    setShowLayout: (v: boolean) => void
    getActivePage: () => NotebookPage
    getGroups: () => NotebookGroup[]
    getLinkGroups: () => NotebookGroup[]

    // ── Slices Zustand purs — méthodes ───────────────────────────────────────

    // pagesSlice
    addPage: () => void
    deletePage: (index: number) => Promise<void>
    startPageDrag: (index: number, event: DragEvent) => void
    onPageDragOver: (index: number, event: DragEvent) => void
    onPageDragLeave: () => void
    onPageDrop: (targetIndex: number, event: DragEvent) => void
    endPageDrag: () => void
    switchPage: (index: number) => void
    activatePage: (index: number) => Promise<void>
    refreshMarkdownCellsForPage: (pageIndex: number) => void
    shouldShowCell: (cell: NotebookCell) => boolean
    shouldShowGroup: (group: NotebookGroup) => boolean

    // helpersSlice
    hasSourceCells: () => boolean
    canUseDucklings: () => boolean
    switchDbEngine: (newEngine: string) => Promise<void>
    refreshDuckdbTables: () => Promise<void>
    refreshDuckdbSchema: () => Promise<void>
    init: () => Promise<void>
    evaluateGroupIfQuery: (group: NotebookGroup) => Promise<boolean>
    evaluateAllGroupIfQueries: () => Promise<void>
    setStatus: (message: string, type: string) => void
    syncMarkdownToEditor: (path: number[], cellIndex: number) => void
    getCellIcon: (type: string) => string
    generateCellId: () => string
    generateGroupId: () => string
    generatePageId: () => string
    isNameUniqueAcrossPages: (name: string, type: string, excludePageIndex?: number | null, excludePath?: unknown, excludeCellIndex?: number | null) => boolean
    getAllNamesOfType: (type: string) => string[]
    getCell: (groupIndex: number, cellIndex: number) => NotebookCell | undefined
    downloadSourceFile: (pathOrIndex: number | number[], cellIndex: number) => void

    // parametersSlice
    getParameters: () => Record<string, unknown>
    parseQueryWithParameters: (query: string, extraParams?: Record<string, unknown>) => string
    findReferencedParams: (query: string) => string[]
    findDependentCells: (paramName: string) => { cell: NotebookCell; path: number[]; cellIndex: number }[]
    findDependentGroups: (paramName: string) => { group: NotebookGroup; path: number[] }[]
    detectCycleInDAG: () => boolean
    onParameterValueChange: (cell: NotebookCell) => Promise<void>
    _executeDAGRefresh: (paramName: string) => Promise<void>
    generateUniqueParamName: () => string
    isParamNameUsed: (paramName: string, excludeId: string) => boolean
    validateParamName: (pathOrIndex: unknown, cellIndex: number) => void

    // exportSlice
    setTheme: (themeName: string) => void
    buildExportConfig: (options?: { devMode?: boolean; showLayout?: boolean; includeFileData?: boolean }) => Promise<unknown>
    openExportModal: (type: string) => void
    executeExport: () => Promise<void>
    exportHTMLWithConfig: (config: unknown, fileName?: string, passphrase?: string | null, includeFiles?: boolean) => Promise<void>
    copyExportJson: () => Promise<boolean>
    cancelExport: () => void
    saveGithubToken: () => void
    cancelGithubToken: () => void
    copyGistUrl: () => void
    copyGistPassphrase: () => void
    closeGistModal: () => void
    openGistUrl: () => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadConfig: (event: any) => Promise<void>
    cancelJsonPassphraseModal: () => void
    unlockJsonConfig: () => Promise<void>
    applyImportedConfig: (config: unknown) => Promise<void>

    // groupsSlice
    getFlattenedGroups: () => unknown[]
    getFlattenedGroupsForAllPages: () => unknown[]
    getGroupItems: (group: NotebookGroup) => unknown[]
    getGroupAtPath: (path: number[]) => NotebookGroup | null
    getParentGroup: (path: number[]) => NotebookGroup | null
    getCellAtPath: (path: number[], cellIndex: number) => NotebookCell | undefined
    createNewGroup: (direction?: 'row' | 'column') => NotebookGroup
    addNestedGroup: (path: number[]) => void
    toggleGroupDirection: (path: number[]) => void
    openLoopConfigModal: (path: number[]) => void
    openGroupSettingsModal: (path: number[]) => void
    testGroupIfQuery: (path: number[]) => Promise<void>
    toggleAccordion: (path: number[]) => void
    getDefaultLoopQuery: () => string
    getDefaultZipQuery: () => string
    deleteGroupAtPath: (path: number[]) => Promise<void>
    getLinkGroupById: (groupId: string) => NotebookGroup | undefined
    openChildGroupModal: (path: number[], cellIndex: number) => Promise<void>
    closeChildGroupModal: () => void
    deleteChildGroupModal: () => Promise<void>
    moveGroupAtPath: (path: number[], direction: number) => void
    moveCellInGroupAtPath: (path: number[], cellIndex: number, direction: number) => void
    getGroupElementId: (path: number[]) => string
    openAddGroupModal: () => void
    getNextOrder: (group: NotebookGroup) => number
    getSortedCells: (group: NotebookGroup) => { cell: NotebookCell; originalIndex: number }[]
    getSortedChildren: (group: NotebookGroup) => { child: NotebookGroup; originalIndex: number }[]
    getAllItemsSorted: (group: NotebookGroup) => { type: string; item: NotebookCell | NotebookGroup; originalIndex: number; order: number }[]
    getTabName: (tabItem: unknown, tabIdx: number) => string
    moveItemInGroup: (path: number[], itemType: string, originalIndex: number, direction: number) => void
    isFirstInGroup: (group: NotebookGroup, itemType: string, originalIndex: number) => boolean
    isLastInGroup: (group: NotebookGroup, itemType: string, originalIndex: number) => boolean
    getSortedIndex: (group: NotebookGroup, itemType: string, originalIndex: number) => number

    // cellsSlice
    hasCellMinSize: (cell: NotebookCell) => boolean
    hasCellMaxSize: (cell: NotebookCell) => boolean
    hasCellHeight: (cell: NotebookCell) => boolean
    isSqlCellWithEditor: (type: string) => boolean
    bodyDisplayShouldShowSkeleton: (cell: NotebookCell) => boolean
    bodyDisplayShouldShowContent: (cell: NotebookCell) => boolean
    getCellHeightVars: (cell: NotebookCell) => string
    getCellSizeOuterClass: (cell: NotebookCell, isColumn: boolean) => string
    getCellWrapperStyle: (cell: NotebookCell, isColumn: boolean, order: number) => Record<string, unknown>
    getCellSizeInnerClass: () => string
    createNewCell: (type: string) => NotebookCell
    addGroup: (cellType: string) => void
    addCellToGroup: (pathOrIndex: number | number[], cellType: string) => void
    openAddCellToGroupModal: (pathOrIndex: number | number[]) => void
    openInsertGroupModal: (atIndex: number) => void
    insertGroupAt: (atIndex: number, cellType: string) => void
    openInsertCellModal: (pathOrIndex: number | number[], atCellIndex: number) => void
    insertCellAt: (pathOrIndex: number | number[], atCellIndex: number, cellType: string) => void
    deleteGroup: (pathOrIndex: number | number[]) => void
    moveGroup: (pathOrIndex: number | number[], direction: number) => void
    deleteCellAt: (pathOrIndex: number | number[], cellIndex: number) => Promise<void>
    moveCellInGroup: (pathOrIndex: number | number[], cellIndex: number, direction: number) => void
    ensureCellName: (pathOrIndex: number | number[], cellIndex: number) => void
    ensureAllCellsHaveNames: () => void
    openCellConfig: (pathOrIndex: number | number[], cellIndex: number) => void
    getCommonParamsForType: (type: string) => unknown[]
    getCommonParamsExcludingName: (type: string) => unknown[]
    getCommonParamDef: (paramKey: string, type: string) => unknown
    getSpecificParamsForType: (type: string) => unknown[]
    isSpecificParamVisible: (param: unknown, cell: NotebookCell) => boolean
    getQueryLabelForType: (type: string, indexOrName: string | number) => string
    getQueryCountForType: (type: string) => number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getCellValueByPath: (cell: NotebookCell, path: string) => any
    setCellValueByPath: (cell: NotebookCell, path: string, value: unknown) => void
    onCellTypeChange: (pathOrIndex: number | number[], cellIndex: number, oldType: string) => void
    generateUniqueCellName: (type: string, excludeId?: string | null) => string
    isCellNameUsed: (name: string, excludeId?: string | null) => boolean
    generateUniqueSourceName: () => string
    validateCellName: (path: number[], cellIndex: number) => void
    validateSingleSourceName: (pathOrIndex: number | number[], cellIndex: number) => void

    // filesSlice
    loadEmbeddedFiles: () => Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSingleSourceDrop: (e: any, path: number[], cellIndex: number) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSingleSourceFileSelect: (e: any, path: number[], cellIndex: number) => void
    loadSingleSourceFile: (file: File, path: number[], cellIndex: number, options?: Record<string, unknown>) => Promise<void>
    executeSourceCell: (cell: NotebookCell, path: number[], cellIndex: number) => Promise<void>
    cleanupSourceCell: (cell: NotebookCell) => Promise<void>
    removeSingleSourceFile: (path: number[], cellIndex: number) => Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleDocxTemplateDrop: (e: any, path: number[], cellIndex: number) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleDocxTemplateFileSelect: (e: any, path: number[], cellIndex: number) => void
    loadDocxTemplate: (file: File, path: number[], cellIndex: number) => Promise<void>
    downloadDocxTemplate: (path: number[], cellIndex: number) => void
    removeDocxTemplate: (path: number[], cellIndex: number) => void
    loadPendingSourceFiles: () => Promise<void>

    // executionSlice
    runGroupAtPath: (path: number[]) => Promise<{ stopped: boolean; reason?: string; cellName?: string }>
    isCellSkippedInAutoFlow: (cell: NotebookCell) => boolean
    runGroupOnce: (path: number[], group: NotebookGroup) => Promise<{ stopped: boolean }>
    addFileToZip: (filename: string, content: unknown, type?: string) => boolean
    downloadOrZipFile: (filename: string, content: unknown, mimeType?: string) => boolean
    runGroupWithLoop: (path: number[], group: NotebookGroup) => Promise<{ stopped: boolean }>
    generateAndDownloadZip: (group: NotebookGroup) => Promise<void>
    runCellAt: (pathOrIndex: number | number[], cellIndex: number) => Promise<void>
    runGroup: (pathOrIndex: number | number[]) => Promise<{ stopped: boolean }>
    executeSqlRecursiveParseCell: (cell: NotebookCell) => Promise<void>
    showSqlEditorVisible: (cell: NotebookCell) => boolean
    showQueryResult: (cell: NotebookCell) => boolean
    isSqlResultTabular: (cell: NotebookCell) => boolean
    isSqlResultText: (cell: NotebookCell) => boolean
    getSqlResultAsText: (cell: NotebookCell) => string
    executeMarkdownCell: (cell: NotebookCell) => Promise<void>
    executeIframeCell: (cell: NotebookCell) => Promise<void>
    renderIframeInContainer: (cell: NotebookCell) => void
    executeSqlStatCell: (cell: NotebookCell) => Promise<void>
    executePivotCell: (cell: NotebookCell) => Promise<void>
    executeUiParameterCell: (cell: NotebookCell) => Promise<void>
    executePublipostageWordCell: (cell: NotebookCell) => Promise<void>
    executePdfmeCell: (cell: NotebookCell) => Promise<void>
    executePerspectiveCell: (cell: NotebookCell) => Promise<void>
    renderPerspectiveInContainer: (cell: NotebookCell) => Promise<void>
    executeUniverSheetCell: (cell: NotebookCell) => Promise<void>
    captureUniverSnapshot: (cell: NotebookCell, univerAPI: unknown) => Promise<void>
    exportUniverToXlsx: (univerAPI: unknown, cellName: string) => Promise<void>
    runGroupsFromIndex: (startGroupIndex: number) => Promise<void>
    runGroupsFromIndexWithStopConditions: (startGroupIndex: number) => Promise<{ stopped: boolean }>
    runGroupWithStopConditions: (path: number[]) => Promise<{ stopped: boolean; reason?: string }>
    runCellsAfterWithStopConditions: (path: number[], cellIndex: number, cellId?: string | null) => Promise<{ stopped: boolean }>
    runCellsAfter: (path: number[], cellIndex: number) => Promise<void>
    runAllGroups: () => Promise<void>

    // copyPasteSlice
    hasClipboardItem: () => boolean
    _safeSerialize: (obj: unknown) => unknown
    _cloneCellForCopy: (cell: NotebookCell) => Partial<NotebookCell>
    _cloneGroupForCopy: (group: NotebookGroup) => Partial<NotebookGroup>
    _collectUsedCellNames: () => Set<string>
    _makeUniqueName: (baseName: string, usedNames: Set<string>) => string
    _prepareGroupForPaste: (group: NotebookGroup, usedNames: Set<string>) => void
    copyCellAt: (pathOrIndex: number | number[], cellIndex: number) => void
    copyGroupAtPath: (pathOrIndex: number | number[]) => void
    pasteToGroup: (pathOrIndex: number | number[]) => void

    // ── Index signature pour les méthodes sqlrooms non réexportées ───────────
    [key: string]: unknown
}

// ─── Type public du store ──────────────────────────────────────────────────────

/**
 * NotebookStoreState — type complet du store Zustand sqljob.
 *
 * Composé par intersection :
 *   - Slice state types sqlrooms (roomShell, sqlEditor, cells, notebook, canvas)
 *   - CustomNotebookState (état propre à sqljob)
 *
 * Ce pattern suit les exemples officiels sqlrooms (ex: notebook/src/store.ts)
 * où RoomState = RoomShellSliceState & ArtifactsSliceState & ... & { custom }
 */
export type NotebookStoreState =
    RoomShellSliceState &
    SqlEditorSliceState &
    CellsSliceState &
    NotebookSliceState &
    CanvasSliceState &
    CustomNotebookState
