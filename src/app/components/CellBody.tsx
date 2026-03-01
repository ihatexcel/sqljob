// @ts-nocheck
/**
 * Rendu du body d'une cellule selon son type.
 * Remplace les templates Alpine générés par CellBodyRenderer.
 */
import { useEffect, useRef, useState } from 'react'
import { useNotebookStore } from '../store/notebookStore'
import { ConfigManager } from '../../lib/ConfigManager'
import { CDNManager } from '../../lib/CDNManager'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CellBodySkeleton() {
    return (
        <div className="flex min-w-0 w-full flex-col mt-2 gap-4">
            <div className="skeleton h-8 w-full"></div>
            <div className="skeleton h-2 w-28"></div>
            <div className="skeleton h-2 w-full"></div>
            <div className="skeleton h-2 w-full"></div>
        </div>
    )
}

function TableSkeleton() {
    return (
        <div className="flex flex-col gap-2 p-4">
            <div className="skeleton h-6 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
        </div>
    )
}

// ─── ResultInfo ───────────────────────────────────────────────────────────────
function ResultInfo({ cell, devOnly = false }: { cell: any, devOnly?: boolean }) {
    const devMode = useNotebookStore(s => s.devMode)
    if (!cell._resultInfo) return null
    if (devOnly && !devMode) return null
    return <div className="mt-2 p-2 bg-base-200 rounded text-sm text-base-content/70">{cell._resultInfo}</div>
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
                toolbar: isReadOnly ? false : ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', '|', 'guide'],
                readOnly: isReadOnly,
                minHeight: hasCellHeight(cell) ? '100%' : '50px',
                autorefresh: { delay: 200 }
            })
            const cm = inst.codemirror || inst.cm
            if (cm && isReadOnly) cm.setOption('readOnly', true)
            cell._easyMDEcli = inst
            if (typeof inst.togglePreview === 'function') {
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

// ─── SourceBody (file drop zone) ─────────────────────────────────────────────
function SourceBody({ cell, path, cellIndex }: any) {
    const {
        handleSingleSourceDrop, handleSingleSourceFileSelect,
        downloadSourceFile, removeSingleSourceFile, devMode, forceUpdate
    } = useNotebookStore(s => ({
        handleSingleSourceDrop: s.handleSingleSourceDrop,
        handleSingleSourceFileSelect: s.handleSingleSourceFileSelect,
        downloadSourceFile: s.downloadSourceFile,
        removeSingleSourceFile: s.removeSingleSourceFile,
        devMode: s.devMode,
        forceUpdate: s.forceUpdate
    }))

    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)

    return (
        <div className="flex flex-col gap-2">
            <div
                className={`flex items-center justify-center rounded-lg transition-all duration-200 mt-1 mb-1 min-h-[20px] ${cell._fileName
                    ? 'border-2 border-solid border-success bg-success/10 cursor-default'
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
                    <div style={{ width: '100%', textAlign: 'center', padding: '4px' }}>
                        <span className="iconify" data-icon="material-symbols-light:create-new-folder" style={{ fontSize: '3rem', display: 'block', margin: 'auto' }}></span>
                        <p className="m-0 text-base-content/60 text-sm">{cell.title || 'Glissez-déposez ici'}</p>
                        <p className="mt-0 mb-0 text-accent text-xs font-semibold">→ {cell.name}</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center gap-3 px-4 py-3 w-full">
                        <span className="iconify text-success" data-icon="material-symbols-light:check-circle" style={{ fontSize: '1.25rem' }}></span>
                        <span className="flex-1 text-success font-medium truncate">{cell._fileName}</span>
                        <span className="text-base-content/60 text-xs">→ {cell.name}</span>
                        <button className="btn btn-ghost" onClick={e => { e.stopPropagation(); downloadSourceFile(path, cellIndex) }} title="Télécharger">
                            <span className="iconify" data-icon="material-symbols-light:download" style={{ fontSize: '1.25rem' }}></span>
                        </button>
                        <button className="btn btn-ghost btn-error" onClick={e => { e.stopPropagation(); removeSingleSourceFile(path, cellIndex) }} title="Supprimer">
                            <span className="iconify" data-icon="material-symbols-light:close" style={{ fontSize: '1.5rem' }}></span>
                        </button>
                    </div>
                )}
                <input ref={inputRef} type="file" hidden accept=".csv,.parquet,.xlsx,.xls"
                    onChange={e => handleSingleSourceFileSelect(e, path, cellIndex)} />
            </div>
        </div>
    )
}

// ─── ButtonRunBody ────────────────────────────────────────────────────────────
function ButtonRunBody({ cell, path, cellIndex }: any) {
    const { runCellsAfter, isLoading } = useNotebookStore(s => ({ runCellsAfter: s.runCellsAfter, isLoading: s.isLoading }))
    return (
        <div className="flex justify-center p-0">
            <button className="btn btn-primary btn-sm" onClick={() => runCellsAfter(path, cellIndex)} disabled={isLoading}>
                <span>{cell.buttonLabel || 'Exécuter'}</span>
            </button>
        </div>
    )
}

// ─── SqlTableBody ─────────────────────────────────────────────────────────────
function SqlTableBody({ cell, path, cellIndex, showTextResult = false }: any) {
    const {
        devMode, isLoading, hasCellHeight,
        showSqlEditorVisible, isSqlResultTabular, isSqlResultText,
        getSqlResultAsText, renderTableInContainer, safeRenderSqlEditor
    } = useNotebookStore(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        hasCellHeight: s.hasCellHeight,
        showSqlEditorVisible: s.showSqlEditorVisible,
        isSqlResultTabular: s.isSqlResultTabular,
        isSqlResultText: s.isSqlResultText,
        getSqlResultAsText: s.getSqlResultAsText,
        renderTableInContainer: s.renderTableInContainer,
        safeRenderSqlEditor: s.safeRenderSqlEditor
    }))

    const tableRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode && showSqlEditorVisible?.(cell)) {
            safeRenderSqlEditor?.(editorRef.current, cell, 'SELECT * FROM source1 LIMIT 100', false, 'query', '_showParsedQuery', null, null, null, path, cellIndex)
        }
    }, [cell._id, devMode])

    useEffect(() => {
        if (tableRef.current && cell._results?.length > 0 && cell._status !== 'running') {
            renderTableInContainer?.(cell)
        }
    }, [cell._results, cell._status])

    const hasHeight = hasCellHeight(cell)

    return (
        <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
            {showSqlEditorVisible?.(cell) && (
                <div ref={editorRef}></div>
            )}
            {showTextResult ? (
                <>
                    {showSqlEditorVisible?.(cell) && isSqlResultTabular?.(cell) && (
                        <div className={`relative rounded-lg mt-2 ${hasHeight ? 'flex-1 min-h-0 overflow-auto' : ''}`}>
                            {cell._status === 'running'
                                ? <div className="bg-base-100 rounded-lg overflow-x-auto"><TableSkeleton /></div>
                                : <div ref={tableRef} id={`table-${cell._id}`} className="bg-base-100 rounded-lg overflow-x-auto"></div>
                            }
                        </div>
                    )}
                    {showSqlEditorVisible?.(cell) && isSqlResultText?.(cell) && (
                        <textarea className="textarea textarea-bordered w-full mt-2 min-h-[120px] font-mono text-sm" readOnly value={getSqlResultAsText?.(cell) || ''} />
                    )}
                </>
            ) : (
                <div className={hasHeight ? 'flex-1 min-h-0 overflow-auto' : ''}>
                    {cell._status === 'running'
                        ? <div className="bg-base-100 rounded-lg overflow-x-auto"><TableSkeleton /></div>
                        : <div ref={tableRef} id={`table-${cell._id}`} className="bg-base-100 rounded-lg overflow-x-auto"></div>
                    }
                </div>
            )}
            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── IframeBody ───────────────────────────────────────────────────────────────
function IframeBody({ cell, path, cellIndex }: any) {
    const { devMode, hasCellHeight, safeRenderSqlEditor, showSqlEditorVisible } = useNotebookStore(s => ({
        devMode: s.devMode,
        hasCellHeight: s.hasCellHeight,
        safeRenderSqlEditor: s.safeRenderSqlEditor,
        showSqlEditorVisible: s.showSqlEditorVisible
    }))

    const editorRef = useRef<HTMLDivElement>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode) {
            safeRenderSqlEditor?.(editorRef.current, cell, "SELECT '<h1>Hello</h1>'", false, 'query', '_showParsedQuery', null, null, null, path, cellIndex)
        }
    }, [cell._id, devMode])

    useEffect(() => {
        if (iframeRef.current && cell._iframeContent) {
            const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document
            if (doc) {
                doc.open()
                doc.write(cell._iframeContent)
                doc.close()
            }
        }
    }, [cell._iframeContent])

    const hasHeight = hasCellHeight(cell)

    return (
        <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
            {devMode && showSqlEditorVisible?.(cell) && <div ref={editorRef}></div>}
            <iframe
                ref={iframeRef}
                sandbox="allow-scripts allow-same-origin"
                className={`w-full border-0 ${hasHeight ? 'flex-1' : 'min-h-[200px]'}`}
            />
            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── SqlStatBody ──────────────────────────────────────────────────────────────
function SqlStatBody({ cell, path, cellIndex }: any) {
    const { devMode, safeRenderSqlEditor, showSqlEditorVisible } = useNotebookStore(s => ({
        devMode: s.devMode,
        safeRenderSqlEditor: s.safeRenderSqlEditor,
        showSqlEditorVisible: s.showSqlEditorVisible
    }))
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode) {
            safeRenderSqlEditor?.(editorRef.current, cell, "SELECT 42 AS value, 'Titre' AS title, 'info' AS type", false, 'query', '_showParsedQuery', null, null, null, path, cellIndex)
        }
    }, [cell._id, devMode])

    return (
        <div>
            {devMode && showSqlEditorVisible?.(cell) && <div ref={editorRef}></div>}
            {cell._statContent && (
                <div dangerouslySetInnerHTML={{ __html: cell._statContent }} />
            )}
            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── EChartBody ───────────────────────────────────────────────────────────────
function EChartBody({ cell, path, cellIndex }: any) {
    const { devMode, safeRenderSqlEditor, showSqlEditorVisible, hasCellHeight } = useNotebookStore(s => ({
        devMode: s.devMode,
        safeRenderSqlEditor: s.safeRenderSqlEditor,
        showSqlEditorVisible: s.showSqlEditorVisible,
        hasCellHeight: s.hasCellHeight
    }))

    const editorRef = useRef<HTMLDivElement>(null)
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode) {
            safeRenderSqlEditor?.(editorRef.current, cell, 'SELECT 1 AS value', false, 'query', '_showParsedQuery', null, null, null, path, cellIndex)
        }
    }, [cell._id, devMode])

    useEffect(() => {
        if (!chartRef.current || !cell._echartsOption) return
        CDNManager.loadECharts?.().then(() => {
            const echarts = (window as any).echarts
            if (!echarts || !chartRef.current) return
            let chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current)
            chart.setOption(cell._echartsOption)
        })
    }, [cell._echartsOption])

    const hasHeight = hasCellHeight(cell)

    return (
        <div className={hasHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
            {devMode && showSqlEditorVisible?.(cell) && <div ref={editorRef}></div>}
            <div ref={chartRef} className={hasHeight ? 'flex-1 min-h-0' : 'min-h-[300px]'} />
            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── UiParameterBody ──────────────────────────────────────────────────────────
function UiParameterBody({ cell, path, cellIndex }: any) {
    const { devMode, renderUiParameterEditor, forceUpdate } = useNotebookStore(s => ({
        devMode: s.devMode,
        renderUiParameterEditor: s.renderUiParameterEditor,
        forceUpdate: s.forceUpdate
    }))
    const editorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode) {
            const html = renderUiParameterEditor?.(cell)
            if (html) editorRef.current.innerHTML = html
        }
    }, [cell._id, devMode, cell.queries])

    return (
        <div>
            {devMode && (
                <div>
                    <div ref={editorRef}></div>
                </div>
            )}
            {/* Rendu du paramètre en mode client (input/select/etc.) */}
            {cell._uiHtml ? (
                <div dangerouslySetInnerHTML={{ __html: cell._uiHtml }} />
            ) : null}
            <ResultInfo cell={cell} />
        </div>
    )
}

// ─── GenericHtmlBody (perspective, pdfme, publipostageWord) ──────────────────
function GenericHtmlBody({ cell, path, cellIndex }: any) {
    const { devMode, safeRenderSqlEditor, showSqlEditorVisible } = useNotebookStore(s => ({
        devMode: s.devMode,
        safeRenderSqlEditor: s.safeRenderSqlEditor,
        showSqlEditorVisible: s.showSqlEditorVisible
    }))
    const editorRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorRef.current && devMode) {
            safeRenderSqlEditor?.(editorRef.current, cell, 'SELECT 1', false, 'query', '_showParsedQuery', null, null, null, path, cellIndex)
        }
    }, [cell._id, devMode])

    useEffect(() => {
        if (contentRef.current && cell._renderedHtml) {
            contentRef.current.innerHTML = cell._renderedHtml
        }
    }, [cell._renderedHtml])

    return (
        <div>
            {devMode && showSqlEditorVisible?.(cell) && <div ref={editorRef}></div>}
            <div ref={contentRef}></div>
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
        openChildGroupModal
    } = useNotebookStore(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        hasCellHeight: s.hasCellHeight,
        getCellHeightVars: s.getCellHeightVars,
        bodyDisplayShouldShowSkeleton: s.bodyDisplayShouldShowSkeleton,
        bodyDisplayShouldShowContent: s.bodyDisplayShouldShowContent,
        openChildGroupModal: s.openChildGroupModal
    }))

    const hasHeight = hasCellHeight(cell)
    const heightVars = getCellHeightVars(cell)
    const showSkeleton = bodyDisplayShouldShowSkeleton?.(cell)
    const showContent = bodyDisplayShouldShowContent?.(cell)

    function renderBody() {
        switch (cell.type) {
            case 'markdown': return <MarkdownBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'source': return <SourceBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'buttonRunNextCells': return <ButtonRunBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'sqlRecursiveParse': return <SqlTableBody cell={cell} path={path} cellIndex={cellIndex} showTextResult={true} />
            case 'table': return <SqlTableBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'iframe': return <IframeBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'sqlStat': return <SqlStatBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'echart': return <EChartBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'uiParameter': return <UiParameterBody cell={cell} path={path} cellIndex={cellIndex} />
            case 'perspective':
            case 'pdfme':
            case 'publipostageWord':
                return <GenericHtmlBody cell={cell} path={path} cellIndex={cellIndex} />
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
                            <button className="btn btn-sm gap-0"
                                onClick={() => openChildGroupModal(path, cellIndex)}
                                title="Ouvrir le groupe enfant">
                                <span className="iconify" data-icon="material-symbols-light:export-notes-outline-sharp" style={{ fontSize: '1rem' }}></span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
