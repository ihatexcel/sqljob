// @ts-nocheck
/**
 * Rendu du body d'une cellule selon son type.
 * Remplace les templates Alpine générés par CellBodyRenderer.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { ConfigManager } from '../../lib/ConfigManager'
import { CDNManager } from '../../lib/CDNManager'
import { dropSqlblockSchema, openSqlblockSession } from './sqlblock/SqlBlockEditor'
import { SqlEditorWidget } from './SqlEditorWidget'
import { SqlDataTable } from './SqlDataTable'
import { Icon } from '../../lib/icons'
import {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent,
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@sqlrooms/ui'
import { DuckDBManager } from '../../lib/DuckDBManager'
import DataTablePaginated from '@sqlrooms/data-table/dist/DataTablePaginated'
import { SqlBlockEditor } from './sqlblock/SqlBlockEditor'
import './UniverSheetElement'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CellBodySkeleton() {
    return (
        <div className="flex min-w-0 w-full flex-col mt-2 gap-4">
            <div className="animate-pulse rounded-md bg-muted h-8 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-2 w-28"></div>
            <div className="animate-pulse rounded-md bg-muted h-2 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-2 w-full"></div>
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="animate-pulse rounded-md bg-muted h-6 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-4 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-4 w-full"></div>
            <div className="animate-pulse rounded-md bg-muted h-4 w-3/4"></div>
        </div>
    )
}

// ─── ResultInfo ───────────────────────────────────────────────────────────────
function ResultInfo({ cell, devOnly = false }: { cell: any, devOnly?: boolean }) {
    const devMode = useNotebookStore(s => s.devMode)
    if (!cell._resultInfo) return null
    if (!String(cell._resultInfo).startsWith('❌')) return null
    if (devOnly && !devMode) return null
    return <div className="mt-2 p-2 bg-muted rounded text-sm text-muted-foreground">{cell._resultInfo}</div>
}

// ─── MarkdownBody ─────────────────────────────────────────────────────────────
function MarkdownBody({ cell, path, cellIndex }: any) {
    const devMode = useNotebookStore(s => s.devMode)
    const easyMDERef = useRef<HTMLTextAreaElement>(null)
    const hasCellHeight = useNotebookStore(s => s.hasCellHeight)

    useEffect(() => {
        const el = easyMDERef.current
        if (!el) return
        let inst: any = null
        const engine = ConfigManager.getCellEngine(cell, 'main')
        const isReadOnly = engine !== 'text'

        CDNManager.loadEasyMDE().then(() => {
            if (!el.parentElement) return
            if (cell._easyMDEcli) {
                try { cell._easyMDEcli.toTextArea() } catch (_) {}
                cell._easyMDEcli = null
            }
            inst = new (window as any).EasyMDE({
                element: el,
                spellChecker: false,
                status: false,
                toolbar: (isReadOnly || !devMode) ? false : ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', '|', 'guide'],
                readOnly: isReadOnly,
                minHeight: hasCellHeight(cell) ? '100%' : '50px',
                autorefresh: { delay: 200 }
            })
            const cm = inst.codemirror || inst.cm
            if (cm && isReadOnly) cm.setOption('readOnly', true)
            if (cm && !isReadOnly) {
                cm.on('change', () => {
                    ConfigManager.setCellEditableContent(cell, inst.value())
                })
            }
            cell._easyMDEcli = inst
            // En clientMode explicitement (devMode === false) : basculer en preview par défaut
            // En devMode (true) ou état indéterminé (null) : rester en mode édition
            if (devMode === false && typeof inst.togglePreview === 'function') {
                try { inst.togglePreview() } catch (_) {}
            }
            setTimeout(() => {
                el.closest('.easymde-client')?.classList.add('easymde-ready')
                if (cm?.refresh) cm.refresh()
            }, 100)
        })
        return () => {
            if (inst) { try { inst.toTextArea() } catch (_) {} }
            if (cell._easyMDEcli === inst) cell._easyMDEcli = null
        }
    }, [cell._id, devMode])

    return (
        <div className={hasCellHeight(cell) ? 'flex-1 min-h-0 flex flex-col' : ''}>
            <ResultInfo cell={cell} devOnly />
            <div className={`easymde-client ${hasCellHeight(cell) ? 'flex-1 min-h-0 flex flex-col' : ''}`}>
                <textarea
                    ref={easyMDERef}
                    defaultValue={ConfigManager.getCellContentDisplay(cell) || ''}
                />
            </div>
        </div>
    )
}

// ─── RejectErrorsModal ────────────────────────────────────────────────────────
function RejectErrorsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [rows, setRows] = useState<any[]>([])
    const [cols, setCols] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 })
    const [sorting, setSorting] = useState([])

    useEffect(() => {
        if (!open) return
        setLoading(true)
        DuckDBManager.executeQuery('SELECT * FROM reject_errors')
            .then(result => {
                const data = result ?? []
                setRows(data)
                setCols(data.length ? Object.keys(data[0]) : [])
            })
            .catch(() => { setRows([]); setCols([]) })
            .finally(() => setLoading(false))
    }, [open])

    const columns = useMemo(() =>
        cols.map(key => ({
            id: key, accessorKey: key, header: key,
            cell: ({ getValue }: any) => { const v = getValue(); return v == null ? '' : String(v) }
        })), [cols])

    const pageData = useMemo(() => {
        const start = pagination.pageIndex * pagination.pageSize
        return rows.slice(start, start + pagination.pageSize)
    }, [rows, pagination])

    return (
        <Dialog open={open} onOpenChange={o => !o && onClose()}>
            <DialogContent className="max-w-5xl max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Lignes rejetées — reject_errors ({rows.length})</DialogTitle>
                </DialogHeader>
                <div className="flex-1 min-h-0 overflow-auto">
                    {loading ? (
                        <div className="p-4 text-sm text-muted-foreground">Chargement…</div>
                    ) : rows.length === 0 ? (
                        <div className="p-4 text-sm text-muted-foreground">Aucune ligne rejetée.</div>
                    ) : (
                        <DataTablePaginated
                            data={pageData}
                            columns={columns}
                            numRows={rows.length}
                            pagination={pagination}
                            sorting={sorting}
                            onPaginationChange={setPagination}
                            onSortingChange={setSorting}
                            fontSize="text-xs"
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── SourceBody (file drop zone) ─────────────────────────────────────────────
function SourceBody({ cell, path, cellIndex }: any) {
    const {
        handleSingleSourceDrop, handleSingleSourceFileSelect,
        downloadSourceFile, removeSingleSourceFile, devMode, forceUpdate
    } = useNotebookStore(useShallow(s => ({
        handleSingleSourceDrop: s.handleSingleSourceDrop,
        handleSingleSourceFileSelect: s.handleSingleSourceFileSelect,
        downloadSourceFile: s.downloadSourceFile,
        removeSingleSourceFile: s.removeSingleSourceFile,
        devMode: s.devMode,
        forceUpdate: s.forceUpdate
    })))

    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [rejectModalOpen, setRejectModalOpen] = useState(false)

    const isFallback = !!cell._loadedViaFallback
    const mainError = cell._mainQueryError || null
    const fallbackError = cell._fallbackQueryError || null
    const rejectCount = cell._rejectErrorsCount ?? 0
    const rejectedCellsCount = cell._rejectedCellsCount ?? 0
    const rowCount = cell._rowCount ?? null
    const queryBuilder = cell._queryBuilder || null

    const fileBorderClass = isFallback
        ? 'border-2 border-solid border-orange-500 bg-orange-500/10 cursor-default'
        : 'border-2 border-solid border-green-500 bg-green-500/10 cursor-default'
    const fileColor = isFallback ? 'text-orange-600' : 'text-green-600'
    const fileIcon = isFallback ? 'warning' : 'check-circle'

    return (
        <div className="flex flex-col gap-2">
            <div
                className={`flex items-center justify-center rounded-lg transition-all duration-200 mt-1 mb-1 min-h-[20px] ${cell._fileName
                    ? fileBorderClass
                    : isDragging
                        ? 'border-2 border-solid border-accent bg-accent/10 cursor-pointer'
                        : 'border-2 border-dashed border-primary bg-primary/5 cursor-pointer hover:border-accent hover:bg-accent/10'
                    }`}
                onClick={() => !cell._fileName && inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleSingleSourceDrop(e, path, cellIndex) }}
            >
                {!cell._fileName ? (
                    // key distinct : force React à démonter/remonter au lieu de recycler le nœud DOM.
                    // Sans ça, iconify ayant remplacé les <span> par des <svg> hors du VDOM React,
                    // React ne sait pas les supprimer → l'ancienne icône persiste après suppression.
                    <div key="no-file" className="flex flex-col items-center gap-1 py-2 w-full">
                        <Icon name="create-new-folder" size={48} />
                        {cell._importFailed && (
                            <p className="m-0 text-destructive text-sm font-semibold">L'import a échoué.</p>
                        )}
                        <p className="m-0 text-muted-foreground text-sm">{cell.title || 'Glissez-déposez ici'}</p>
                        <p className="mt-0 mb-0 text-accent text-xs font-semibold">→ {cell.name}</p>
                    </div>
                ) : (
                    <div key="has-file" className="flex flex-wrap items-center gap-3 px-4 py-3 w-full">
                        <span className={`inline-flex items-center ${fileColor}`}><Icon name={fileIcon} size={20} /></span>
                        <span className={`flex-1 ${fileColor} font-medium truncate`}>{cell._fileName}</span>
                        {rowCount !== null && (
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-muted ${fileColor}`}>
                                <Icon name="check-circle" size={14} />
                                {rowCount.toLocaleString()} ligne{rowCount !== 1 ? 's' : ''} intégrée{rowCount !== 1 ? 's' : ''}
                            </span>
                        )}
                        {cell._fileName && (
                            <button
                                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold ${rejectCount > 0 ? 'bg-destructive/10 text-destructive hover:bg-destructive/20' : 'bg-muted text-muted-foreground'}`}
                                onClick={e => { e.stopPropagation(); setRejectModalOpen(true) }}
                                title="Voir les lignes rejetées"
                            >
                                <Icon name={rejectCount > 0 ? 'warning' : 'check-circle'} size={14} />
                                {rejectCount} ligne{rejectCount !== 1 ? 's' : ''} non intégrée{rejectCount !== 1 ? 's' : ''}
                            </button>
                        )}
                        {cell._fileName && rejectedCellsCount > 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-orange-500/10 text-orange-600">
                                <Icon name="warning" size={14} />
                                {rejectedCellsCount.toLocaleString()} cellule{rejectedCellsCount !== 1 ? 's' : ''} non intégrée{rejectedCellsCount !== 1 ? 's' : ''}
                            </span>
                        )}
                        <span className="text-muted-foreground text-xs">→ {cell.name}</span>
                        <button className="inline-flex items-center justify-center p-2 rounded hover:bg-muted" onClick={e => { e.stopPropagation(); downloadSourceFile(path, cellIndex) }} title="Télécharger">
                            <Icon name="download" size={20} />
                        </button>
                        <button className="inline-flex items-center justify-center p-2 rounded hover:bg-destructive/10 text-destructive" onClick={e => { e.stopPropagation(); removeSingleSourceFile(path, cellIndex) }} title="Supprimer">
                            <Icon name="close" size={24} />
                        </button>
                    </div>
                )}
                <input ref={inputRef} type="file" hidden accept=".csv,.parquet,.xlsx,.xls"
                    onChange={e => handleSingleSourceFileSelect(e, path, cellIndex)} />
            </div>
            {rejectModalOpen && <RejectErrorsModal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} />}
            {devMode && (
                <Accordion type="single" collapsible className="mt-1">
                    <AccordionItem value="import">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            Requête d'import
                        </AccordionTrigger>
                        <AccordionContent>
                            {mainError && (
                                <div className="mb-2 p-2 rounded bg-destructive/10 border border-destructive/30 text-xs text-destructive">
                                    <span className="font-semibold">Erreur :</span>{' '}
                                    <span className="font-mono break-all">{mainError}</span>
                                </div>
                            )}
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query"                                applySourceDefaultIfEmpty={true} />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="fallback">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            Requête de fallback (si erreur)
                        </AccordionTrigger>
                        <AccordionContent>
                            {fallbackError && (
                                <div className="mb-2 p-2 rounded bg-destructive/10 border border-destructive/30 text-xs text-destructive">
                                    <span className="font-semibold">Erreur :</span>{' '}
                                    <span className="font-mono break-all">{fallbackError}</span>
                                </div>
                            )}
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query2"                                applySourceDefaultIfEmpty={true} />
                        </AccordionContent>
                    </AccordionItem>
                    {queryBuilder && (
                        <AccordionItem value="query-builder">
                            <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                                Exemple requête stable
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="relative">
                                    <pre className="text-xs font-mono bg-muted rounded p-3 overflow-x-auto whitespace-pre-wrap break-all">{queryBuilder}</pre>
                                    <button
                                        className="absolute top-2 right-2 p-1 rounded hover:bg-muted-foreground/20"
                                        title="Copier"
                                        onClick={() => navigator.clipboard.writeText(queryBuilder)}
                                    >
                                        <Icon name="copy" size={14} />
                                    </button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            )}
        </div>
    )
}

// ─── ButtonRunBody ────────────────────────────────────────────────────────────
function ButtonRunBody({ cell, path, cellIndex }: any) {
    const { runCellsAfter, isLoading } = useNotebookStore(useShallow(s => ({ runCellsAfter: s.runCellsAfter, isLoading: s.isLoading })))
    return (
        <div className="flex justify-center p-0">
            <button className="inline-flex items-center justify-center px-4 py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50" onClick={() => runCellsAfter(path, cellIndex)} disabled={isLoading}>
                <span>{cell.buttonLabel || 'Exécuter'}</span>
            </button>
        </div>
    )
}

// ─── EChartRenderer — rendu ECharts/KPI partagé ──────────────────────────────
function EChartRenderer({ cell, hasHeight }: { cell: any; hasHeight: boolean }) {
    const { _rev } = useNotebookStore(useShallow(s => ({ _rev: s._rev })))
    const chartRef = useRef<HTMLDivElement>(null)
    const lastRenderedOption = useRef<any>(null)

    useEffect(() => {
        if (!chartRef.current || !cell._echartsOption) return
        if (cell._echartsOption === lastRenderedOption.current) return
        lastRenderedOption.current = cell._echartsOption
        CDNManager.loadECharts?.().then(() => {
            const echarts = (window as any).echarts
            if (!echarts || !chartRef.current) return
            let chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current, null, { renderer: 'svg' })
            chart.clear()
            chart.setOption(cell._echartsOption)
        })
    }, [_rev, cell._echartsOption])

    // Resize ECharts quand le conteneur change de dimensions (responsive)
    useEffect(() => {
        const el = chartRef.current
        if (!el) return
        const ro = new ResizeObserver(() => {
            const echarts = (window as any).echarts
            const chart = echarts?.getInstanceByDom(el)
            chart?.resize()
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    if (cell._kpiHtml) return <div className="w-full" dangerouslySetInnerHTML={{ __html: cell._kpiHtml }} />
    return <div ref={chartRef} className={`w-full ${hasHeight ? 'flex-1 min-h-0' : 'min-h-[300px]'}`} />
}

// ─── SqlTableBody ─────────────────────────────────────────────────────────────
function SqlTableBody({ cell, path, cellIndex, showTextResult = false }: any) {
    const {
        devMode, hasCellHeight,
        showSqlEditorVisible, isSqlResultTabular, isSqlResultText,
        getSqlResultAsText, forceUpdate, runCellAt, refreshDuckdbTables, _rev,
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        hasCellHeight: s.hasCellHeight,
        showSqlEditorVisible: s.showSqlEditorVisible,
        isSqlResultTabular: s.isSqlResultTabular,
        isSqlResultText: s.isSqlResultText,
        getSqlResultAsText: s.getSqlResultAsText,
        forceUpdate: s.forceUpdate,
        runCellAt: s.runCellAt,
        refreshDuckdbTables: s.refreshDuckdbTables,
        _rev: s._rev,
    })))

    // Lu directement depuis la cellule (pas via store) pour éviter les problèmes de ref stale.
    // undefined → true (rétrocompat : les anciennes cellules sans ce champ affichent leurs résultats)
    const showResult = devMode || (cell.queries?.[0]?.showQueryResult !== false)

    const [sqlBlockUiMode, setSqlBlockUiMode] = useState(false)
    const [vizConfigTrigger, setVizConfigTrigger] = useState(0)
    const sqlAtOpenRef = useRef<string>('')

    /** Ferme la modale : rafraîchit seulement si le SQL a changé, puis nettoie les subcells. */
    const handleCloseModal = useCallback(() => {
        const currentSql = ConfigManager.getCellQuery(cell, 'main') || ''
        const modified = currentSql !== sqlAtOpenRef.current
        setSqlBlockUiMode(false)
        if (modified) runCellAt(path, cellIndex)
        // Drop du schéma _sqlblock entier puis rafraîchit l'arborescence DuckDB
        dropSqlblockSchema().then(() => refreshDuckdbTables())
    }, [cell, path, cellIndex, runCellAt, refreshDuckdbTables])

    const hasHeight = hasCellHeight(cell)
    const isRunning = cell._status === 'running'
    const searchable = cell.type === 'table'
    const hasChart = !!(cell._echartsOption || cell._kpiHtml)

    const [vizMode, setVizMode] = useState<'table' | 'chart'>('table')

    // Synchronise vizMode : graphique dès qu'un chart est disponible, table sinon
    useEffect(() => {
        if (hasChart) setVizMode('chart')
        else setVizMode('table')
    }, [hasChart]) // eslint-disable-line react-hooks/exhaustive-deps

    // Mode UI visuel (sqlBlock) pour les cellules sql.
    // IMPORTANT: on utilise display:none au lieu de démontage conditionnel pour éviter
    // le bug React "removeChild not a child" (portals Radix déjà retirés du DOM avant cleanup).
    // L'overlay fixed plein-écran est toujours monté, juste caché quand inactif.
    const showSqlBlockEditor = devMode && cell.type === 'sql'
    const isKpi = !!cell._kpiHtml

    return (
        <div className={`group/sqlbody flex flex-col ${(hasHeight || isKpi) ? 'flex-1 min-h-0' : ''} ${isKpi ? 'justify-center' : ''}`}>
            {/* SqlBlockEditor — modale centrée, toujours montée, cachée via display:none */}
            {showSqlBlockEditor && (
                <div
                    style={sqlBlockUiMode ? undefined : { display: 'none' }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={e => { if (e.target === e.currentTarget) handleCloseModal() }}
                >
                    <div className="bg-background border border-border rounded-xl shadow-2xl flex flex-col w-full max-w-[95vw] max-h-[90dvh] overflow-hidden">
                        {/* Bouton fermer (×) */}
                        <div className="flex items-center justify-end px-3 pt-2 pb-0 shrink-0">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Fermer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
                            <SqlBlockEditor
                                cell={cell}
                                path={path}
                                cellIndex={cellIndex}
                                fromSqlCell={true}
                                skipExecution={true}
                                modalOpen={sqlBlockUiMode}
                                onExitUiMode={handleCloseModal}
                                openVizConfigTrigger={vizConfigTrigger}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Contenu normal — caché quand en mode UI */}
            <div style={sqlBlockUiMode ? { display: 'none' } : undefined}
                className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
            {showSqlEditorVisible?.(cell) && (
                <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                    placeholder="SELECT * FROM source1 LIMIT 100"
                    onEnterUiMode={cell.type === 'sql' ? () => {
                        sqlAtOpenRef.current = ConfigManager.getCellQuery(cell, 'main') || ''
                        openSqlblockSession()
                        setSqlBlockUiMode(true)
                        runCellAt(path, cellIndex)
                    } : null}
                />
            )}
            {showResult && (<>
            {/* Toggle Tableau/Graphique + bouton config visualisation — visible au hover */}
            {cell.type === 'sql' && (cell._echartsOption || cell._kpiHtml) && (
                <div className="opacity-0 group-hover/sqlbody:opacity-100 transition-opacity flex items-center gap-2 mb-1 shrink-0">
                    {cell._echartsOption && (
                        <div className="flex rounded border border-border overflow-hidden text-xs">
                            <button onClick={() => setVizMode('chart')}
                                className={`px-2 py-0.5 transition-colors ${vizMode === 'chart' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                                Graphique
                            </button>
                            <button onClick={() => setVizMode('table')}
                                className={`px-2 py-0.5 transition-colors ${vizMode === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                                Tableau
                            </button>
                        </div>
                    )}
                    {devMode && (
                        <button
                            onClick={() => {
                                sqlAtOpenRef.current = ConfigManager.getCellQuery(cell, 'main') || ''
                                openSqlblockSession()
                                setSqlBlockUiMode(true)
                                setVizConfigTrigger(v => v + 1)
                                runCellAt(path, cellIndex)
                            }}
                            className="inline-flex items-center justify-center h-5 w-5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors ml-auto"
                            title="Configurer la visualisation"
                        >
                            <Icon name="settings" size={13} />
                        </button>
                    )}
                </div>
            )}
            {/* Titre dynamique — centré, sous les boutons */}
            {cell._kpiLabel && (
                <div style={{fontSize:'clamp(1.1rem,3vw,1.5rem)'}} className="font-semibold text-foreground mb-0.5 shrink-0 text-center w-full">{cell._kpiLabel}</div>
            )}
            {/* Mode graphique */}
            {vizMode === 'chart' && hasChart && (
                <div className={`flex flex-col ${hasHeight ? 'flex-1 min-h-0' : ''}`}>
                    <EChartRenderer cell={cell} hasHeight={hasHeight} />
                </div>
            )}
            {/* Mode tableau */}
            {vizMode === 'table' && (showTextResult ? (
                <>
                    {isSqlResultTabular?.(cell) && (
                        <div className={`relative rounded-lg mt-2 ${hasHeight ? 'flex-1 min-h-0 overflow-auto' : ''}`}>
                            {isRunning
                                ? <div className="bg-background rounded-lg overflow-x-auto"><TableSkeleton /></div>
                                : <div className="bg-background rounded-lg overflow-x-auto"><SqlDataTable cell={cell} searchable={searchable} /></div>
                            }
                        </div>
                    )}
                    {isSqlResultText?.(cell) && (
                        <textarea className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono mt-2 min-h-[120px]" readOnly value={getSqlResultAsText?.(cell) || ''} />
                    )}
                </>
            ) : (
                <div className={hasHeight ? 'flex-1 min-h-0 overflow-auto' : ''}>
                    {isRunning
                        ? <div className="bg-background rounded-lg overflow-x-auto"><TableSkeleton /></div>
                        : <div className="bg-background rounded-lg overflow-x-auto"><SqlDataTable cell={cell} searchable={searchable} /></div>
                    }
                </div>
            ))}
            </>)}
            {/* Sous-titre — centré sous la visualisation */}
            {cell._sublabel && (
                <div style={{fontSize:'clamp(0.8rem,2vw,1rem)'}} className="text-muted-foreground text-center w-full mt-1 shrink-0">{cell._sublabel}</div>
            )}
            <ResultInfo cell={cell} devOnly />
            </div>
        </div>
    )
}

// ─── IframeBody ───────────────────────────────────────────────────────────────
function IframeBody({ cell, path, cellIndex }: any) {
    const { devMode, hasCellHeight, showSqlEditorVisible, _rev } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        hasCellHeight: s.hasCellHeight,
        showSqlEditorVisible: s.showSqlEditorVisible,
        _rev: s._rev
    })))

    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        const iframe = iframeRef.current
        if (!iframe || !cell._htmlContent) return
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (doc) {
            doc.open()
            doc.write(cell._htmlContent)
            doc.close()
        }
    }, [cell._htmlContent, _rev])

    const hasHeight = hasCellHeight(cell)

    return (
        <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
            {showSqlEditorVisible?.(cell) && (
                <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                    placeholder="SELECT '<h1>Hello</h1>'" />
            )}
            <iframe
                ref={iframeRef}
                sandbox="allow-scripts allow-same-origin"
                className={`w-full border-0 ${hasHeight ? 'flex-1' : 'min-h-[200px]'}`}
            />
            <ResultInfo cell={cell} devOnly />
        </div>
    )
}

// ─── SqlStatBody ──────────────────────────────────────────────────────────────
function SqlStatBody({ cell, path, cellIndex }: any) {
    const { devMode, showSqlEditorVisible } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        showSqlEditorVisible: s.showSqlEditorVisible
    })))

    const [sqlBlockUiMode, setSqlBlockUiMode] = useState(false)

    return (
        <div>
            {/* SqlBlockEditor — toujours monté, caché via display:none (évite removeChild portal bug) */}
            {devMode && (
                <div style={sqlBlockUiMode ? undefined : { display: 'none' }}>
                    <SqlBlockEditor cell={cell} path={path} cellIndex={cellIndex}
                        fromSqlCell={true} onExitUiMode={() => setSqlBlockUiMode(false)} />
                </div>
            )}
            <div style={sqlBlockUiMode ? { display: 'none' } : undefined}>
                {showSqlEditorVisible?.(cell) && (
                    <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                        placeholder="SELECT 42 AS value, 'Titre' AS title, 'info' AS type"
                        onEnterUiMode={devMode ? () => setSqlBlockUiMode(true) : null} />
                )}
                {cell._results && (
                    <div className="flex flex-col items-center py-1">
                        {cell.icon && (
                            <div className="text-muted-foreground">
                                <span className="iconify inline-block h-8 w-8" data-icon={cell.icon}></span>
                            </div>
                        )}
                        <div className="text-sm text-muted-foreground">{cell.title || 'Stat'}</div>
                        <div className="text-4xl font-bold">{cell._statValue || '-'}</div>
                        <div className="text-xs text-muted-foreground">{cell.subtitle || ''}</div>
                    </div>
                )}
                <ResultInfo cell={cell} devOnly />
            </div>
        </div>
    )
}

// ─── UiParameterBody ──────────────────────────────────────────────────────────
function UiParameterBody({ cell, path, cellIndex }: any) {
    const { devMode, onParameterValueChange } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        onParameterValueChange: s.onParameterValueChange,
    })))
    const languageType = ConfigManager.getCellEngine(cell, 'main')
    const isJs = languageType === 'js'
    const isText = languageType === 'text'
    const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL'
    const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info'
    const placeholder = isJs ? 'return ["Option 1", "Option 2"];' : isText ? 'Saisir le texte' : 'SELECT * from source1'

    const [localValue, setLocalValue] = useState(cell._value ?? '')

    // Sync la valeur locale quand cell._value change suite à une exécution externe
    useEffect(() => {
        setLocalValue(cell._value ?? '')
    }, [cell._value])

    if (!devMode && cell.userVisible === false) return null

    function handleChange(newValue: any) {
        cell._value = newValue
        cell._userModified = true
        setLocalValue(newValue)
        onParameterValueChange?.(cell)
    }

    return (
        <div className="flex flex-col gap-0">
            {devMode && (
                <SqlEditorWidget
                    cell={cell} path={path} cellIndex={cellIndex}
                    placeholder={placeholder}
                    languageLabel={languageLabel}
                    badgeClass={badgeClass}
                />
            )}
            {cell.paramType === 'input' && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">{cell.title}</label>
                    <input
                        type={cell.inputType || 'text'}
                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        value={localValue}
                        onChange={e => handleChange(e.target.value)}
                        disabled={cell.userEditable === false}
                        placeholder={`Valeur de ${ConfigManager.getCellReferenceName(cell) || ''}`}
                    />
                </div>
            )}
            {cell.paramType === 'dropdown' && (cell._options?.length ?? 0) > 0 && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">{cell.title}</label>
                    <select
                        className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                        value={localValue}
                        onChange={e => handleChange(e.target.value)}
                        disabled={cell.userEditable === false}
                    >
                        {(cell._options || []).map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            )}
            {cell.paramType === 'range' && (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-foreground">{cell.title}</label>
                    <div className="flex items-center gap-3 w-full">
                        <span className="text-xs text-muted-foreground min-w-[2rem] text-right">{cell.rangeMin ?? 0}</span>
                        <input
                            type="range"
                            className="flex-1 accent-primary"
                            value={localValue}
                            min={cell.rangeMin ?? 0}
                            max={cell.rangeMax ?? 100}
                            step={cell.rangeStep ?? 1}
                            onChange={e => handleChange(Number(e.target.value))}
                            disabled={cell.userEditable === false}
                        />
                        <span className="text-xs text-muted-foreground min-w-[2rem]">{cell.rangeMax ?? 100}</span>
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-mono bg-primary text-primary-foreground min-w-[3rem]">{localValue}</span>
                    </div>
                </div>
            )}
            <ResultInfo cell={cell} devOnly />
        </div>
    )
}

// ─── PublipostageWordBody ─────────────────────────────────────────────────────
function PublipostageWordBody({ cell, path, cellIndex }: any) {
    const {
        handleDocxTemplateDrop, handleDocxTemplateFileSelect,
        downloadDocxTemplate, removeDocxTemplate,
        runCellAt, isLoading, devMode, forceUpdate
    } = useNotebookStore(useShallow(s => ({
        handleDocxTemplateDrop: s.handleDocxTemplateDrop,
        handleDocxTemplateFileSelect: s.handleDocxTemplateFileSelect,
        downloadDocxTemplate: s.downloadDocxTemplate,
        removeDocxTemplate: s.removeDocxTemplate,
        runCellAt: s.runCellAt,
        isLoading: s.isLoading,
        devMode: s.devMode,
        forceUpdate: s.forceUpdate
    })))

    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div className="flex flex-col gap-3">
            <div
                className={`flex items-center justify-center rounded-lg transition-all duration-200 mt-1 mb-1 ${cell.docxTemplateFileName
                    ? 'border-2 border-solid border-green-500 bg-green-500/10 cursor-default'
                    : isDragging
                        ? 'border-2 border-solid border-accent bg-accent/10 cursor-pointer'
                        : 'border-2 border-dashed border-primary bg-primary/5 cursor-pointer hover:border-accent hover:bg-accent/10'
                    }`}
                onClick={() => !cell.docxTemplateFileName && inputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={e => { e.preventDefault(); setIsDragging(false) }}
                onDrop={e => { e.preventDefault(); setIsDragging(false); handleDocxTemplateDrop(e, path, cellIndex) }}
            >
                {!cell.docxTemplateFileName ? (
                    <div key="no-file" className="text-center p-1">
                        <Icon name="description" size={64} />
                        <p className="m-0 text-muted-foreground text-sm">Glissez-déposez votre template Word (.docx)</p>
                        <p className="mt-0 mb-0 text-accent text-xs font-semibold">Template de publipostage</p>
                    </div>
                ) : (
                    <div key="has-file" className="flex flex-wrap items-center gap-3 px-4 py-3 w-full">
                        <Icon name="check-circle" size={20} className="text-green-600" />
                        <span className="flex-1 text-green-600 font-medium truncate">{cell.docxTemplateFileName}</span>
                        <button className="inline-flex items-center justify-center p-2 rounded hover:bg-muted" onClick={e => { e.stopPropagation(); downloadDocxTemplate(path, cellIndex) }} title="Télécharger">
                            <Icon name="download" size={20} />
                        </button>
                        <button className="inline-flex items-center justify-center p-2 rounded hover:bg-destructive/10 text-destructive" onClick={e => { e.stopPropagation(); removeDocxTemplate(path, cellIndex) }} title="Supprimer">
                            <Icon name="close" size={24} />
                        </button>
                    </div>
                )}
                <input ref={inputRef} type="file" hidden accept=".docx"
                    onChange={e => handleDocxTemplateFileSelect(e, path, cellIndex)} />
            </div>
            {devMode && (
                <Accordion type="multiple" className="mt-1">
                    <AccordionItem value="data">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            Requête de données
                        </AccordionTrigger>
                        <AccordionContent>
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query" />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="filename">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            <span className="flex items-center gap-2">
                                <span>Requête de nom de fichier</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                    <Icon name="storage" size={14} />
                                    SQL
                                </span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query2" />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
            {cell.buttonLabel && (
                <div className="flex justify-center">
                    <button
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        onClick={() => runCellAt(path, cellIndex)}
                        disabled={isLoading || !cell.docxTemplateFileName}
                    >
                        <span>{cell.buttonLabel}</span>
                    </button>
                </div>
            )}
            <ResultInfo cell={cell} devOnly />
        </div>
    )
}

// ─── PdfmeBody ────────────────────────────────────────────────────────────────
function PdfmeBody({ cell, path, cellIndex }: any) {
    const { runCellAt, isLoading, devMode, forceUpdate } = useNotebookStore(useShallow(s => ({
        runCellAt: s.runCellAt,
        isLoading: s.isLoading,
        devMode: s.devMode,
        forceUpdate: s.forceUpdate
    })))

    return (
        <div className="flex flex-col gap-3">
            {devMode && (
                <Accordion type="multiple" className="mt-1">
                    <AccordionItem value="data">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            Requête de données
                        </AccordionTrigger>
                        <AccordionContent>
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query" />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="filename">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            <span className="flex items-center gap-2">
                                <span>Requête nom de fichier PDF</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                    <Icon name="storage" size={14} />
                                    SQL
                                </span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                                queryType="query2" />
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="json">
                        <AccordionTrigger className="text-sm font-semibold text-primary py-1">
                            <span className="flex items-center gap-2">
                                <span>Template pdfme (JSON)</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">Layout</span>
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono"
                                rows={10}
                                style={{ minHeight: '180px' }}
                                placeholder='{"basePdf": {...}, "schemas": [...]}'
                                value={cell.json || ''}
                                onChange={e => { cell.json = e.target.value; forceUpdate() }}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
            {cell.buttonLabel && (
                <div className="flex justify-center">
                    <button
                        className="inline-flex items-center justify-center px-4 py-1.5 rounded text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        onClick={() => runCellAt(path, cellIndex)}
                        disabled={isLoading}
                    >
                        <span>{cell.buttonLabel}</span>
                    </button>
                </div>
            )}
            <ResultInfo cell={cell} devOnly />
        </div>
    )
}

// ─── PerspectiveBody ──────────────────────────────────────────────────────────
function PerspectiveBody({ cell, path, cellIndex }: any) {
    const { devMode, showSqlEditorVisible, hasCellHeight, renderPerspectiveInContainer, runCellAt, refreshDuckdbTables, _rev } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        showSqlEditorVisible: s.showSqlEditorVisible,
        hasCellHeight: s.hasCellHeight,
        renderPerspectiveInContainer: s.renderPerspectiveInContainer,
        runCellAt: s.runCellAt,
        refreshDuckdbTables: s.refreshDuckdbTables,
        _rev: s._rev
    })))

    const [sqlBlockUiMode, setSqlBlockUiMode] = useState(false)
    const sqlAtOpenRef = useRef<string>('')

    /** Ferme la modale : rafraîchit seulement si le SQL a changé, puis nettoie les subcells. */
    const handleCloseModal = useCallback(() => {
        const currentSql = ConfigManager.getCellQuery(cell, 'main') || ''
        const modified = currentSql !== sqlAtOpenRef.current
        setSqlBlockUiMode(false)
        if (modified) runCellAt(path, cellIndex)
        dropSqlblockSchema().then(() => refreshDuckdbTables())
    }, [cell, path, cellIndex, runCellAt, refreshDuckdbTables])

    // Equivalent Alpine x-init: déclencher le rendu quand le viewer est monté et données prêtes
    // (cas rechargement de page où _arrowTable existe déjà, _perspectiveScheduled = false)
    useEffect(() => {
        if (!cell._perspectiveReady) return
        const viewer = document.getElementById('perspective-' + cell._id)
        if (!viewer) return
        if (cell._arrowTable && !cell._perspectiveScheduled && !cell._perspectiveRendering && !cell._perspectiveTable) {
            renderPerspectiveInContainer(cell).catch((e: any) => {
                cell._perspectiveReady = false
                cell._resultInfo = '❌ ' + e.message
            })
        }
    }, [_rev])

    const mh = '400px'
    const hasHeight = hasCellHeight?.(cell)

    return (
        <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
            {/* SqlBlockEditor — modale centrée, toujours montée, cachée via display:none */}
            {devMode && (
                <div
                    style={sqlBlockUiMode ? undefined : { display: 'none' }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    onClick={e => { if (e.target === e.currentTarget) handleCloseModal() }}
                >
                    <div className="bg-background border border-border rounded-xl shadow-2xl flex flex-col w-full max-w-[95vw] max-h-[90dvh] overflow-hidden">
                        {/* Bouton fermer (×) */}
                        <div className="flex items-center justify-end px-3 pt-2 pb-0 shrink-0">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Fermer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
                            <SqlBlockEditor
                                cell={cell}
                                path={path}
                                cellIndex={cellIndex}
                                fromSqlCell={true}
                                skipExecution={true}
                                modalOpen={sqlBlockUiMode}
                                allowedMaterializeModes={['ephemeral']}
                                onExitUiMode={handleCloseModal}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Contenu normal — caché quand en mode UI */}
            <div style={sqlBlockUiMode ? { display: 'none' } : undefined}
                className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : 'flex flex-col gap-2'}>
                {showSqlEditorVisible?.(cell) && (
                    <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                        queryType="query"
                        onEnterUiMode={devMode ? () => {
                            sqlAtOpenRef.current = ConfigManager.getCellQuery(cell, 'main') || ''
                            openSqlblockSession()
                            setSqlBlockUiMode(true)
                            runCellAt(path, cellIndex)
                        } : null} />
                )}
                {cell._status === 'running' && !cell._perspectiveReady && (
                    <div className={hasHeight ? 'flex-1 min-h-0 rounded-lg bg-background overflow-hidden' : 'rounded-lg bg-background overflow-hidden'}
                        style={hasHeight ? {} : { minHeight: mh }}>
                        <div className="animate-pulse h-full w-full bg-muted rounded-lg" style={{ minHeight: mh }}></div>
                    </div>
                )}
                {cell._perspectiveReady && (
                    <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col perspective-fill-height' : ''}
                        style={hasHeight ? {} : { minHeight: mh }}>
                        <perspective-viewer
                            id={`perspective-${cell._id}`}
                            theme="Pro Light"
                            class={hasHeight ? 'flex-1 min-h-0 w-full rounded-lg' : 'w-full rounded-lg'}
                            style={hasHeight ? {} : { minHeight: mh }}
                        ></perspective-viewer>
                    </div>
                )}
                <ResultInfo cell={cell} devOnly />
            </div>
        </div>
    )
}

// ─── GenericHtmlBody (fallback) ───────────────────────────────────────────────
function GenericHtmlBody({ cell, path, cellIndex }: any) {
    const { devMode, showSqlEditorVisible } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        showSqlEditorVisible: s.showSqlEditorVisible
    })))
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (contentRef.current && cell._renderedHtml) {
            contentRef.current.innerHTML = cell._renderedHtml
        }
    }, [cell._renderedHtml])

    return (
        <div>
            {showSqlEditorVisible?.(cell) && (
                <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex}
                    placeholder="SELECT 1" />
            )}
            <div ref={contentRef}></div>
            <ResultInfo cell={cell} devOnly />
        </div>
    )
}

// ─── UniverSheetBody ──────────────────────────────────────────────────────────
function UniverSheetBody({ cell, path, cellIndex }: any) {
    const {
        devMode, showSqlEditorVisible, hasCellHeight,
        captureUniverSnapshot, exportUniverToXlsx, _rev,
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        showSqlEditorVisible: s.showSqlEditorVisible,
        hasCellHeight: s.hasCellHeight,
        captureUniverSnapshot: s.captureUniverSnapshot,
        exportUniverToXlsx: s.exportUniverToXlsx,
        _rev: s._rev,
    })))

    const hasHeight = hasCellHeight(cell)
    const mh = '400px'
    const elementRef = useRef(null)
    const lastInitRunId = useRef(-1)

    // Quand les données sont prêtes (_univerReady=true), appeler initialize()
    // sur le web component Lit qui gère l'initialisation Univer en interne.
    // Guard sur _univerRunId : évite de réinitialiser lors d'un _rev parasite
    // (ex. captureUniverSnapshot incrémente _rev sans changer les données).
    useEffect(() => {
        if (!cell._univerReady || !elementRef.current) return
        if (cell._univerRunId === lastInitRunId.current) return
        lastInitRunId.current = cell._univerRunId ?? 0
        const _univerCfg = cell.json?.univerConfig
        const _materialize = _univerCfg && typeof _univerCfg === 'object' ? !!_univerCfg.materializeAsDuckDB : false
        elementRef.current.initialize({
            rows: cell._univerRows ?? null,
            snapshot: cell._univerSnapshotPending ?? null,
            cellId: cell._id,
            name: cell.name || undefined,
            readonly: !devMode && cell.readOnly !== false,
            config: cell.json?.univerConfig ?? null,
            onModified: () => { cell._univerModified = true },
            onMaterialize: _materialize ? async (csv: string) => {
                const tableName = cell.name || ('univer_' + cell._id)
                const csvFileName = `_univer_${cell._id}.csv`
                console.debug('[UniverSheet] onMaterialize called', { tableName, csvFileName, csvLength: csv.length })
                try {
                    const csvBlob = new Blob([csv], { type: 'text/csv' })
                    await DuckDBManager.registerFile(csvFileName, csvBlob)
                    console.debug('[UniverSheet] CSV registered in DuckDB VFS', { csvFileName })
                    const sql = `CREATE OR REPLACE TABLE "${tableName.replace(/"/g, '""')}" AS SELECT * FROM read_csv('${csvFileName}', HEADER = true, AUTO_DETECT = true, SAMPLE_SIZE = -1)`
                    await DuckDBManager.executeQuery(sql)
                    console.info('[UniverSheet] DuckDB table materialized', { tableName })
                    // Mise à jour arborescence (TableStructurePanel + _duckdbTables)
                    const store = useNotebookStore.getState()
                    await store.refreshDuckdbSchema?.()
                    // DAG : ré-exécuter les cellules qui référencent {{ tableName }} dans leur SQL
                    if (store.directedAcyclicGraph && cell.name) {
                        console.debug('[UniverSheet] DAG refresh triggered for', cell.name)
                        await store._executeDAGRefresh?.(cell.name)
                    }
                } catch (e) { console.error('[UniverSheet] DuckDB materialize error:', e, { tableName, csvFileName }) }
            } : undefined,
        }).catch((e: any) => {
            cell._univerReady = false
            cell._resultInfo = '❌ ' + e.message
        })
    }, [_rev, cell._univerReady])

    const [saving, setSaving] = useState(false)
    const [exporting, setExporting] = useState(false)

    const handleSaveSnapshot = useCallback(async () => {
        if (saving) return
        setSaving(true)
        try { await captureUniverSnapshot(cell, elementRef.current?.getAPI()) } catch (e) { console.error(e) } finally { setSaving(false) }
    }, [cell, captureUniverSnapshot, saving])

    const handleExportXlsx = useCallback(async () => {
        if (exporting) return
        setExporting(true)
        try { await exportUniverToXlsx(elementRef.current?.getAPI(), cell.name) } catch (e) { console.error(e) } finally { setExporting(false) }
    }, [cell, exportUniverToXlsx, exporting])

    const univerActions = cell._univerReady ? (
        <>
            {devMode && (
                <button
                    className="p-1 text-muted-foreground cursor-pointer transition-colors hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSaveSnapshot}
                    disabled={saving}
                    title={saving ? 'Enregistrement...' : 'Enregistrer snapshot'}
                >
                    <Icon name={saving ? 'autorenew' : 'save'} size={14} className={saving ? 'animate-spin' : ''} />
                </button>
            )}
            <button
                className="p-1 text-muted-foreground cursor-pointer transition-colors hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleExportXlsx}
                disabled={exporting}
                title={exporting ? 'Export...' : 'Exporter XLSX'}
            >
                <Icon name={exporting ? 'autorenew' : 'download'} size={14} className={exporting ? 'animate-spin' : ''} />
            </button>
        </>
    ) : null

    return (
        <div className="flex flex-col gap-2">
            {/* Éditeur SQL (avec boutons Univer dans la toolbar) */}
            {showSqlEditorVisible?.(cell) && (
                <SqlEditorWidget cell={cell} path={path} cellIndex={cellIndex} placeholder="SELECT * FROM source1" extraActions={univerActions} />
            )}

            {/* Toolbar standalone quand l'éditeur SQL n'est pas affiché */}
            {!showSqlEditorVisible?.(cell) && cell._univerReady && (
                <div className="flex justify-end gap-1 items-center">
                    {univerActions}
                </div>
            )}

            {/* Skeleton pendant le chargement initial */}
            {cell._status === 'running' && !cell._univerReady && (
                <div
                    className="animate-pulse bg-muted rounded-lg"
                    style={{ minHeight: hasHeight ? undefined : mh, flex: hasHeight ? 1 : undefined }}
                />
            )}

            {/* Web component Lit — initialisation Univer déléguée via ref.initialize() */}
            <univer-sheet
                ref={elementRef}
                class={`rounded-lg border overflow-hidden${hasHeight ? ' flex-1 min-h-0' : ''}`}
                style={{
                    minHeight: hasHeight ? undefined : mh,
                    display: cell._univerReady ? 'block' : 'none',
                }}
            />

            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── CellBody principal ───────────────────────────────────────────────────────
export function CellBody({ cell, path, cellIndex, group }: { cell: any, path: number[], cellIndex: number, group: any }) {
    const {
        devMode, isLoading,
        hasCellHeight, getCellHeightVars,
        bodyDisplayShouldShowSkeleton, bodyDisplayShouldShowContent,
        openChildGroupModal, _rev
    } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        hasCellHeight: s.hasCellHeight,
        getCellHeightVars: s.getCellHeightVars,
        bodyDisplayShouldShowSkeleton: s.bodyDisplayShouldShowSkeleton,
        bodyDisplayShouldShowContent: s.bodyDisplayShouldShowContent,
        openChildGroupModal: s.openChildGroupModal,
        _rev: s._rev
    })))

    const hasHeight = hasCellHeight(cell)
    const heightVars = getCellHeightVars(cell)
    const showSkeleton = bodyDisplayShouldShowSkeleton?.(cell)
    const showContent = bodyDisplayShouldShowContent?.(cell)

    function renderBody() {
        switch (cell.type) {
            case 'markdown': return <MarkdownBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'source': return <SourceBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'buttonRunNextCells': return <ButtonRunBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'sql': return <SqlTableBody cell={cell} path={path} cellIndex={cellIndex} showTextResult={true} />

            case 'iframe': return <IframeBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'sqlStat': return <SqlStatBody cell={cell} path={path} cellIndex={cellIndex} />

            case 'uiParameter': return <UiParameterBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'publipostageWord':
                return <PublipostageWordBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'pdfme':
                return <PdfmeBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'perspective':
                return <PerspectiveBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'univerSheet':
                return <UniverSheetBody cell={cell} path={path} cellIndex={cellIndex} />
            default: return null
        }
    }

    return (
        <div
            className={`pt-1 pb-1 pl-2 pr-2 relative flex-1 flex flex-col min-h-0 cell-body ${hasHeight ? 'cell-body-has-height' : ''}`}
            style={heightVars ? Object.fromEntries(heightVars.split(';').filter(Boolean).map((s: string) => s.split(':'))) : undefined}
        >
            {showSkeleton && <CellBodySkeleton />}
            {showContent && (
                <div className="flex-1 flex flex-col min-h-0">
                    {renderBody()}
                    {/* Client mode: bouton pour ouvrir childGroup */}
                    {!devMode && cell.childGroupId && (
                        <div className="absolute top-2 right-2">
                            <button className="inline-flex items-center justify-center px-2 py-1 rounded text-sm border border-border hover:bg-muted"
                                onClick={() => openChildGroupModal(path, cellIndex)}
                                title="Ouvrir le groupe enfant">
                                <Icon name="export-notes-outline-sharp" size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
