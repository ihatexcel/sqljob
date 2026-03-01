// @ts-nocheck
/**
 * Éditeur SQL/JS React utilisant @marimo-team/codemirror-sql (bundlé, pas de CDN).
 * Remplace l'approche Alpine: x-init="initCodeMirrorForCell(...)"
 */
import { useEffect, useRef, useState } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { sql } from '@codemirror/lang-sql'
import { DuckDBDialect } from '@marimo-team/codemirror-sql/dialects'
import { sqlExtension, cteCompletionSource } from '@marimo-team/codemirror-sql'
import { oneDark } from '@codemirror/theme-one-dark'
import { useNotebookStore } from '../store/notebookStore'
import { useTemplateModal } from '../store/uiStores'
import { ConfigManager } from '../../lib/ConfigManager'
import { CELL_TYPE_SCHEMAS } from '../../lib/cellTypeSchemas'

// ─── Thème CodeMirror adapté DaisyUI ─────────────────────────────────────────
const daisyUITheme = EditorView.theme({
    '&': {
        fontSize: '14px',
        minHeight: '20px',
        border: '1px solid oklch(var(--b3, #d1d5db))',
        borderRadius: '0.5rem',
    },
    '.cm-scroller': {
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        minHeight: '20px',
        maxHeight: '250px',
        overflow: 'auto',
    },
    '.cm-content': { padding: '0.5rem 0' },
    '.cm-gutters': { borderRadius: '0.5rem 0 0 0.5rem' },
    '&.cm-focused': {
        outline: '2px solid oklch(var(--p, #570df8))',
        outlineOffset: '-1px',
    },
})

// ─── Parsed query view ────────────────────────────────────────────────────────
function ParsedQueryView({ cell, parseLevelsProp }: any) {
    const levels = cell[parseLevelsProp] || []
    if (levels.length === 0) return <div className="p-3 text-sm text-base-content/50">Aucune requête parsée</div>
    return (
        <div>
            {levels.map((parseLevel: any, idx: number) => (
                <div key={idx} className="relative w-full" style={{ marginBottom: '0.75rem' }}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-base-content/70 flex items-center gap-2">
                            <span className="badge badge-soft badge-primary">
                                {parseLevel.level === 'final' ? 'Final' : `Niveau ${parseLevel.level}`}
                            </span>
                        </span>
                    </div>
                    <div className="w-full min-h-20 max-h-72 p-3 bg-base-200 border border-primary rounded-lg text-base-content font-mono text-sm overflow-auto whitespace-pre-wrap break-words">
                        {parseLevel.innerQuery || ''}
                    </div>
                    {parseLevel.replacement && (
                        <div style={{ marginTop: '0.1rem', padding: '0.5rem', borderLeft: '3px solid oklch(var(--su))' }} className="font-mono text-sm bg-success/10">
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
    const { devMode, isLoading, runCellAt, forceUpdate, _tables } = useNotebookStore(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        forceUpdate: s.forceUpdate,
        _tables: s._tables,
    }))

    const cmRef = useRef<HTMLDivElement>(null)
    const editorRef = useRef<EditorView | null>(null)
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

    // ─── Init / destroy CodeMirror ──────────────────────────────────────────
    useEffect(() => {
        if (!cmRef.current || !isSql || showParsed) return

        // Destroy previous instance if any
        editorRef.current?.destroy()
        editorRef.current = null

        // Build schema from _tables
        const schema: Record<string, string[]> = {}
        if (_tables) {
            for (const [tableName, data] of Object.entries(_tables as any)) {
                if (Array.isArray(data) && data.length > 0) schema[tableName] = Object.keys(data[0])
            }
        }

        let initialContent = ConfigManager.getCellQuery(cell, queryName) || ''
        if (applySourceDefaultIfEmpty && !initialContent.trim() && cell.type === 'source') {
            const defaultQ = CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.find((q: any) => q.name === queryName)?.sql
            if (defaultQ) {
                initialContent = defaultQ.replace(/\{name\}/g, cell.name || 'source1')
                ConfigManager.setCellQuery(cell, queryName, initialContent)
            }
        }

        const isDark = document.documentElement.getAttribute('data-theme')?.includes('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches

        const extensions: any[] = [
            basicSetup,
            sql({ dialect: DuckDBDialect, schema, upperCaseKeywords: true }),
            daisyUITheme,
            EditorView.updateListener.of(update => {
                if (update.docChanged) {
                    ConfigManager.setCellQuery(cell, queryName, update.state.doc.toString())
                }
            }),
            // CTE completion source
            DuckDBDialect.language.data.of({ autocomplete: cteCompletionSource }),
            // marimo-sql extension (linter, hover, gutter)
            sqlExtension({
                linterConfig: { delay: 300 },
                gutterConfig: { backgroundColor: '#3b82f6', errorBackgroundColor: '#ef4444', hideWhenNotFocused: true },
                enableHover: true,
                hoverConfig: { schema, hoverTime: 300, enableKeywords: true, enableTables: true, enableColumns: true },
            }),
        ]
        if (isDark) extensions.push(oneDark)

        editorRef.current = new EditorView({
            state: EditorState.create({ doc: initialContent, extensions }),
            parent: cmRef.current,
        })

        // Store reference on cell for external sync
        cell[`_cmEditor_${queryType}`] = editorRef.current

        return () => {
            editorRef.current?.destroy()
            editorRef.current = null
            if (cell[`_cmEditor_${queryType}`] === editorRef.current) {
                cell[`_cmEditor_${queryType}`] = null
            }
        }
    }, [cell._id, isSql, showParsed])

    // Sync external value changes into CodeMirror (e.g. template insertion)
    useEffect(() => {
        const editor = editorRef.current
        if (!editor || !isSql || showParsed || editor.hasFocus) return
        const currentDoc = editor.state.doc.toString()
        const cellValue = ConfigManager.getCellQuery(cell, queryName) || ''
        if (currentDoc !== cellValue) {
            editor.dispatch({ changes: { from: 0, to: currentDoc.length, insert: cellValue } })
        }
    })

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

    return (
        <div>
            <div className="relative w-full">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-base-content/70 flex items-center gap-2">
                        <span className={`badge badge-soft ${finalBadgeClass} flex items-center gap-1`}>
                            <span className="iconify" data-icon={iconName} style={{ fontSize: '0.875rem' }}></span>
                            {finalLanguageLabel}
                        </span>
                        {devMode && !isText && (
                            <label className="label cursor-pointer justify-start gap-2 py-0 min-h-0">
                                <input
                                    type="checkbox"
                                    className="toggle toggle-sm"
                                    checked={showParsed}
                                    onChange={toggleParsed}
                                />
                                <span className="label-text text-xs">Parsé</span>
                            </label>
                        )}
                    </span>
                    <div className="flex gap-1 items-center">
                        {!showParsed && devMode && !isText && (
                            <button
                                className="px-2 py-1 border border-base-300 bg-base-200 text-base-content/70 rounded cursor-pointer text-xs transition-all hover:border-primary hover:text-base-content"
                                title={`Insérer un template ${isJs ? 'JavaScript' : 'SQL'}`}
                                onClick={openTemplates}
                            >
                                📋 Templates
                            </button>
                        )}
                        {!showParsed && path != null && cellIndex != null && (
                            <button
                                className="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Exécuter la requête"
                                disabled={isLoading}
                                onClick={() => runCellAt(path, cellIndex)}
                            >
                                {cell._status === 'running'
                                    ? <span className="loading loading-spinner loading-sm"></span>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                }
                            </button>
                        )}
                        {!showParsed && (
                            <button
                                className="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer"
                                title="Copier le code"
                                onClick={copyQuery}
                            >
                                {copyDone
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-success"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
                    <div ref={cmRef} className="codemirror-sql-container" />
                ) : (
                    <textarea
                        className="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        placeholder={placeholder}
                        defaultValue={ConfigManager.getCellQuery(cell, queryName) || ''}
                        onChange={e => { ConfigManager.setCellQuery(cell, queryName, e.target.value) }}
                    />
                )}
            </div>
        </div>
    )
}
