// @ts-nocheck
/**
 * MalloyCellEditor — Éditeur pour les cellules de type "malloy".
 *
 * Architecture :
 *   - Éditeur texte pour le code Malloy (source + run:)
 *   - Bouton "Compiler" → compile Malloy → DuckDB SQL via MalloyService
 *   - SQL généré affiché en lecture seule (collapsible)
 *   - Résultats dans SqlDataTable (via cell._results)
 *
 * La cellule stocke :
 *   - cell.malloyText       — source Malloy (persisté)
 *   - cell._compiledSql     — SQL DuckDB généré (runtime)
 *   - cell._malloyLogs      — logs de compilation (runtime)
 *   - cell._results         — résultats DuckDB (runtime, via executeMalloyCell)
 */
import { useState, useCallback } from 'react'
import { SqlMonacoEditor } from '@sqlrooms/sql-editor'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { SqlDataTable } from '../SqlDataTable'
import { compileMalloy, isCompileError } from '../../../lib/MalloyService'

// ─── Icônes inline ────────────────────────────────────────────────────────────

function IconPlay({ size = 14 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
}
function IconSpin({ size = 14 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
}
function IconChevron({ open, size = 14 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} /></svg>
}
function IconCopy({ size = 14 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
}
function IconCheck({ size = 14 }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><polyline points="20 6 9 17 4 12" /></svg>
}

// ─── Constante : template Malloy par défaut ───────────────────────────────────

export const DEFAULT_MALLOY_TEMPLATE = `-- Malloy → DuckDB SQL
-- Inspiré de Malloy Composer (malloydata.github.io)
--
-- 1. Définir une source (remplacez 'ma_table' par votre table DuckDB)
source: ma_source is duckdb.table('ma_table') extend {
  -- Dimensions et mesures
  measure: nb_lignes is count()
}

-- 2. Exécuter une requête
run: ma_source -> {
  group_by: -- votre_colonne
  aggregate: nb_lignes
  limit: 100
}
`

// ─── MalloyCellEditor ─────────────────────────────────────────────────────────

export function MalloyCellEditor({ cell, path, cellIndex }: any) {
    const { devMode, isLoading, runCellAt, _duckdbTables, db, forceUpdate } =
        useNotebookStore(useShallow(s => ({
            devMode: s.devMode,
            isLoading: s.isLoading,
            runCellAt: s.runCellAt,
            _duckdbTables: s._duckdbTables,
            db: s.db,
            forceUpdate: s.forceUpdate,
        })))

    const [compiling, setCompiling] = useState(false)
    const [sqlOpen, setSqlOpen] = useState(false)
    const [copyDone, setCopyDone] = useState(false)

    const malloyText: string = cell.malloyText ?? DEFAULT_MALLOY_TEMPLATE
    const compiledSql: string | null = cell._compiledSql ?? null
    const malloyLogs: any[] = cell._malloyLogs ?? []
    const hasError = malloyLogs.some((l: any) => l.severity === 'error')

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((value: string | undefined) => {
        cell.malloyText = value ?? ''
        // Invalider le SQL compilé quand le code change
        cell._compiledSql = null
        cell._malloyLogs = []
        forceUpdate?.()
    }, [cell, forceUpdate])

    const handleCompile = useCallback(async () => {
        if (!cell.malloyText?.trim()) return
        setCompiling(true)
        try {
            const result = await compileMalloy(cell.malloyText, _duckdbTables)
            if (isCompileError(result)) {
                cell._compiledSql = null
                cell._malloyLogs = result.logs
                cell._resultInfo = `❌ Erreur Malloy : ${result.error}`
            } else {
                cell._compiledSql = result.sql
                cell._malloyLogs = result.logs
                setSqlOpen(true)
            }
        } catch (err: any) {
            cell._compiledSql = null
            cell._malloyLogs = [{ severity: 'error', message: err?.message ?? String(err) }]
            cell._resultInfo = `❌ Erreur inattendue : ${err?.message}`
        } finally {
            setCompiling(false)
            forceUpdate?.()
        }
    }, [cell, _duckdbTables, forceUpdate])

    const handleRunCompiled = useCallback(() => {
        if (!compiledSql) return
        runCellAt(path, cellIndex)
    }, [compiledSql, runCellAt, path, cellIndex])

    const handleCopySql = useCallback(() => {
        if (!compiledSql) return
        navigator.clipboard.writeText(compiledSql).then(() => {
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 1500)
        }).catch(() => {})
    }, [compiledSql])

    const tableSchemas = db?.schemaTrees ?? []
    const isRunning = cell._status === 'running'

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-3">

            {/* ── Éditeur Malloy ── */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200 text-xs font-semibold">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                            Malloy
                        </span>
                        <span className="text-muted-foreground/60">→ DuckDB SQL</span>
                    </span>
                    <div className="flex gap-1 items-center">
                        <button
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-violet-700 dark:bg-violet-950 dark:text-violet-300 dark:hover:bg-violet-900"
                            title="Compiler Malloy → SQL DuckDB (sans exécuter)"
                            disabled={compiling || !cell.malloyText?.trim()}
                            onClick={handleCompile}
                        >
                            {compiling ? <IconSpin size={12} /> : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                            )}
                            Compiler
                        </button>
                        <button
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-green-700 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
                            title={compiledSql ? 'Exécuter le SQL DuckDB généré' : 'Compilez d\'abord pour obtenir le SQL'}
                            disabled={isLoading || !compiledSql}
                            onClick={handleRunCompiled}
                        >
                            {isRunning ? <IconSpin size={12} /> : <IconPlay size={12} />}
                            Exécuter
                        </button>
                    </div>
                </div>

                <SqlMonacoEditor
                    key={cell._id + '_malloy'}
                    value={malloyText}
                    onChange={handleChange}
                    tableSchemas={tableSchemas}
                    language="sql"
                    className="border border-violet-200 dark:border-violet-800 rounded-md overflow-hidden"
                    options={{
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'off',
                        fontSize: 13,
                        renderLineHighlight: 'line',
                        overviewRulerLanes: 0,
                        scrollbar: { vertical: 'auto', alwaysConsumeMouseWheel: false },
                    }}
                    height="200px"
                />
            </div>

            {/* ── Logs de compilation ── */}
            {malloyLogs.length > 0 && (
                <div className={`rounded-md border px-3 py-2 text-xs font-mono max-h-32 overflow-auto ${hasError ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300' : 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300'}`}>
                    {malloyLogs.filter((l: any) => l.severity !== 'info').map((log: any, i: number) => (
                        <div key={i} className="flex gap-1.5">
                            <span className="shrink-0">{log.severity === 'error' ? '❌' : '⚠️'}</span>
                            <span>{log.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* ── SQL généré (collapsible) ── */}
            {compiledSql && (
                <div className="border border-border rounded-md overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-muted/50 hover:bg-muted transition-colors text-left"
                        onClick={() => setSqlOpen(o => !o)}
                    >
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 text-xs">SQL DuckDB généré</span>
                            <span className="text-muted-foreground/60">{compiledSql.split('\n').length} lignes</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <span
                                className="p-1 hover:text-foreground text-muted-foreground/40 transition-colors"
                                title="Copier le SQL"
                                onClick={e => { e.stopPropagation(); handleCopySql() }}
                            >
                                {copyDone ? <IconCheck size={13} /> : <IconCopy size={13} />}
                            </span>
                            <IconChevron open={sqlOpen} size={14} />
                        </div>
                    </button>
                    {sqlOpen && (
                        <pre className="text-xs font-mono p-3 overflow-x-auto bg-background max-h-64 overflow-y-auto whitespace-pre leading-relaxed">{compiledSql}</pre>
                    )}
                </div>
            )}

            {/* ── Résultats ── */}
            {cell._results && Array.isArray(cell._results) && cell._results.length > 0 && (
                <div className="rounded-lg overflow-x-auto">
                    <SqlDataTable cell={cell} searchable />
                </div>
            )}

            {/* ── Info résultat ── */}
            {cell._resultInfo && (
                <div className={`text-xs px-2 py-1 rounded ${cell._resultInfo.startsWith('❌') ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                    {cell._resultInfo}
                </div>
            )}
        </div>
    )
}

// ─── MalloyBody (wrapper selon devMode) ──────────────────────────────────────

export function MalloyBody({ cell, path, cellIndex }: any) {
    const devMode = useNotebookStore(s => s.devMode)
    if (!devMode) {
        return (
            <div className="flex flex-col gap-2">
                {cell._results && Array.isArray(cell._results) && cell._results.length > 0 && (
                    <div className="rounded-lg overflow-x-auto">
                        <SqlDataTable cell={cell} searchable />
                    </div>
                )}
                {cell._resultInfo && (
                    <div className="text-xs text-muted-foreground px-2">{cell._resultInfo}</div>
                )}
            </div>
        )
    }
    return <MalloyCellEditor cell={cell} path={path} cellIndex={cellIndex} />
}
