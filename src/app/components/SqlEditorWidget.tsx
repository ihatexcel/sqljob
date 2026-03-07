// @ts-nocheck
/**
 * Éditeur SQL/JS React.
 * Pour les cellules SQL/DuckDB : utilise SqlMonacoEditor de @sqlrooms/sql-editor
 *   → Monaco chargé depuis jsDelivr CDN (AMD loader configuré dans sqljob-app.ts)
 *   → Autocomplétion DuckDB via tableSchemas (db.schemaTrees du store)
 * Pour JS et texte : textarea simple.
 */
import { useEffect, useState } from 'react'
import { SqlMonacoEditor } from '@sqlrooms/sql-editor'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../store/notebookStore'
import { useTemplateModal } from '../store/uiStores'
import { ConfigManager } from '../../lib/ConfigManager'
import { CELL_TYPE_SCHEMAS } from '../../lib/cellTypeSchemas'

// ─── Parsed query view ────────────────────────────────────────────────────────
function ParsedQueryView({ cell, parseLevelsProp }: any) {
    const levels = cell[parseLevelsProp] || []
    if (levels.length === 0) return <div className="p-3 text-sm text-muted-foreground/50">Aucune requête parsée</div>
    return (
        <div>
            {levels.map((parseLevel: any, idx: number) => (
                <div key={idx} className="relative w-full" style={{ marginBottom: '0.75rem' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                {parseLevel.level === 'final' ? 'Final' : `Niveau ${parseLevel.level}`}
                            </span>
                        </span>
                    </div>
                    <div className="w-full min-h-20 max-h-72 p-3 bg-muted border border-primary rounded-lg text-foreground font-mono text-sm overflow-auto whitespace-pre-wrap break-words">
                        {parseLevel.innerQuery || ''}
                    </div>
                    {parseLevel.replacement && (
                        <div style={{ marginTop: '0.1rem', padding: '0.5rem', borderLeft: '3px solid hsl(var(--chart-2))' }} className="font-mono text-sm bg-green-500/10">
                            <strong>→ Résultat:</strong> {parseLevel.replacement}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// ─── SqlEditorWidget ──────────────────────────────────────────────────────────
export function SqlEditorWidget({
    cell,
    path,
    cellIndex,
    placeholder = 'SELECT * FROM source1',
    queryType = 'query',
    showParsedQueryProp = '_showParsedQuery',
    languageLabel = null,
    languageIcon = null,
    badgeClass = null,
    applySourceDefaultIfEmpty = false,
}: any) {
    const { devMode, isLoading, runCellAt, forceUpdate, db } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        forceUpdate: s.forceUpdate,
        db: s.db,
    })))

    const [copyDone, setCopyDone] = useState(false)

    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main'
    const parseLevelsProp = queryType === 'query2' ? '_parseLevels2' : '_parseLevels'
    const languageType = ConfigManager.getCellEngine(cell, queryName)
    const isJs = languageType === 'js'
    const isText = languageType === 'text'
    const isSql = !isJs && !isText
    const showParsed = !!cell[showParsedQueryProp]

    const finalLanguageLabel = languageLabel || (isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL')
    const finalBadgeClass = badgeClass || (isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info')
    const iconName = isJs ? 'material-symbols-light:bolt' : isText ? 'material-symbols-light:article' : 'material-symbols-light:storage'

    // tableSchemas depuis db.schemaTrees pour l'autocomplétion Monaco DuckDB
    const tableSchemas = db?.schemaTrees ?? []

    // Appliquer la requête source par défaut si vide (cellule source)
    useEffect(() => {
        if (applySourceDefaultIfEmpty && isSql && !ConfigManager.getCellQuery(cell, queryName)?.trim() && cell.type === 'source') {
            const defaultQ = CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.find((q: any) => q.name === queryName)?.sql
            if (defaultQ) {
                const initial = defaultQ.replace(/\{name\}/g, cell.name || 'source1')
                ConfigManager.setCellQuery(cell, queryName, initial)
            }
        }
    }, [cell._id])

    // ─── Handlers ────────────────────────────────────────────────────────────
    function toggleParsed() {
        cell[showParsedQueryProp] = !cell[showParsedQueryProp]
        forceUpdate()
    }

    function copyQuery() {
        const text = ConfigManager.getCellQuery(cell, queryName) || ''
        navigator.clipboard.writeText(text).then(() => {
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 1500)
        }).catch(() => {})
    }

    function openTemplates() {
        useTemplateModal.getState().open(cell._id, queryType, languageType)
    }

    function handleMonacoChange(value: string | undefined) {
        ConfigManager.setCellQuery(cell, queryName, value ?? '')
    }

    return (
        <div>
            <div className="relative w-full">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${finalBadgeClass === "badge-warning" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200" : finalBadgeClass === "badge-ghost" ? "bg-muted text-muted-foreground" : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"}`}>
                            <span className="iconify" data-icon={iconName} style={{ fontSize: '0.875rem' }}></span>
                            {finalLanguageLabel}
                        </span>
                        {devMode && !isText && (
                            <label className="cursor-pointer flex items-center justify-start gap-2 py-0">
                                <input
                                    type="checkbox"
                                    className="accent-primary w-4 h-4"
                                    checked={showParsed}
                                    onChange={toggleParsed}
                                />
                                <span className="text-xs">Parsé</span>
                            </label>
                        )}
                    </span>
                    <div className="flex gap-1 items-center">
                        {!showParsed && devMode && !isText && (
                            <button
                                className="px-2 py-1 border border-border bg-muted text-muted-foreground rounded cursor-pointer text-xs transition-all hover:border-primary hover:text-foreground"
                                title={`Insérer un template ${isJs ? 'JavaScript' : 'SQL'}`}
                                onClick={openTemplates}
                            >
                                📋 Templates
                            </button>
                        )}
                        {!showParsed && path != null && cellIndex != null && (
                            <button
                                className="p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Exécuter la requête"
                                disabled={isLoading}
                                onClick={() => runCellAt(path, cellIndex)}
                            >
                                {cell._status === 'running'
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                }
                            </button>
                        )}
                        {!showParsed && (
                            <button
                                className="p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors cursor-pointer"
                                title="Copier le code"
                                onClick={copyQuery}
                            >
                                {copyDone
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                                }
                            </button>
                        )}
                    </div>
                </div>

                {/* Editor area */}
                {showParsed ? (
                    <ParsedQueryView cell={cell} parseLevelsProp={parseLevelsProp} />
                ) : isSql ? (
                    <SqlMonacoEditor
                        key={cell._id + '_' + queryType}
                        value={ConfigManager.getCellQuery(cell, queryName) || ''}
                        onChange={handleMonacoChange}
                        tableSchemas={tableSchemas}
                        className="border border-border rounded-md overflow-hidden"
                        options={{
                            minimap: { enabled: false },
                            lineNumbers: 'off',
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            fontSize: 13,
                            renderLineHighlight: 'none',
                            overviewRulerLanes: 0,
                            scrollbar: { vertical: 'auto', alwaysConsumeMouseWheel: false },
                        }}
                        height="120px"
                    />
                ) : (
                    <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 font-mono min-h-20 p-3 resize-y text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder={placeholder}
                        defaultValue={ConfigManager.getCellQuery(cell, queryName) || ''}
                        onChange={e => { ConfigManager.setCellQuery(cell, queryName, e.target.value) }}
                    />
                )}
            </div>
        </div>
    )
}
