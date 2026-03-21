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
import { Icon } from '../../lib/icons'
import { sqlToAstSmart } from '../../lib/SqlBlockService'
import { createDefaultSqlBlockConfig } from '../../lib/SqlBlockTypes'

// ─── SqlEditorWidget ──────────────────────────────────────────────────────────
export function SqlEditorWidget({
    cell,
    path,
    cellIndex,
    placeholder = 'SELECT * FROM source1',
    queryType = 'query',
    languageLabel = null,
    languageIcon = null,
    badgeClass = null,
    applySourceDefaultIfEmpty = false,
    onEnterUiMode = null,
}: any) {
    const { devMode, isLoading, runCellAt, db } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        isLoading: s.isLoading,
        runCellAt: s.runCellAt,
        db: s.db,
    })))

    const [copyDone, setCopyDone] = useState(false)

    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main'
    const languageType = ConfigManager.getCellEngine(cell, queryName)
    const isJs = languageType === 'js'
    const isText = languageType === 'text'
    const isSql = !isJs && !isText

    const finalLanguageLabel = languageLabel || (isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL')
    const finalBadgeClass = badgeClass || (isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info')
    const iconName = isJs ? 'bolt' : isText ? 'article' : 'storage'

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

    function enterUiMode() {
        const text = ConfigManager.getCellQuery(cell, queryName) || ''
        const result = sqlToAstSmart(text)
        if (!cell.json) cell.json = createDefaultSqlBlockConfig()
        if (result.compatible && result.ast) {
            cell.json.ast = result.ast
            cell.json.degraded = false
            cell.json.manualSql = null
        } else {
            // SQL incompatible : mode dégradé avec le SQL brut
            cell.json.degraded = true
            cell.json.manualSql = text
        }
        onEnterUiMode?.()
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
                            <Icon name={iconName} size={14} />
                            {finalLanguageLabel}
                        </span>
                    </span>
                    <div className="flex gap-1 items-center">
                        {devMode && isSql && onEnterUiMode && (
                            <button
                                className="p-1 text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                                title="Passer en mode UI visuel"
                                onClick={enterUiMode}
                            >
                                <Icon name="square-mouse-pointer" size={14} />
                            </button>
                        )}
                        {devMode && !isText && (
                            <button
                                className="p-1 text-muted-foreground cursor-pointer transition-colors hover:text-foreground"
                                title={`Insérer un template ${isJs ? 'JavaScript' : 'SQL'}`}
                                onClick={openTemplates}
                            >
                                <Icon name="book-marked" size={14} />
                            </button>
                        )}
                        {path != null && cellIndex != null && (
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
                    </div>
                </div>

                {/* Editor area */}
                {isSql ? (
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
