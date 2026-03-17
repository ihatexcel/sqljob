// @ts-nocheck
/**
 * MalloyCellEditor — Éditeur pour les cellules de type "malloy".
 *
 * Architecture :
 *   - Mode visuel  : QueryEditor de @malloydata/query-composer (builder visuel)
 *   - Mode texte   : Monaco editor (code Malloy brut)
 *   - Résultats    : SqlDataTable (via cell._results)
 *
 * La cellule stocke :
 *   - cell.malloyText        — source Malloy (persisté, utilisé en mode texte et pour la compilation)
 *   - cell._selectedTable    — nom de la table DuckDB sélectionnée (mode visuel)
 *   - cell._composerMode     — 'visual' | 'text'
 *   - cell._compiledSql      — SQL DuckDB généré (runtime)
 *   - cell._malloyLogs       — logs de compilation (runtime)
 *   - cell._results          — résultats DuckDB (runtime, via executeMalloyCell)
 */
import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { SqlMonacoEditor } from '@sqlrooms/sql-editor'
import { useMonaco } from '@monaco-editor/react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { SqlDataTable } from '../SqlDataTable'
import { compileMalloy, isCompileError } from '../../../lib/MalloyService'
import {
    QueryEditor,
    useQueryBuilder,
    ComposerOptionsContext,
    StubCompile,
    UndoContext,
    IS_STUB,
} from '@malloydata/query-composer'

// IS_STUB is exported as `true` by the CDN stub, undefined in the real package.
// This lets us detect CDN mode at module load time without persisting state on cells.
const VISUAL_EDITOR_AVAILABLE = !IS_STUB
console.log('[MalloyCellEditor] IS_STUB=', IS_STUB, '| VISUAL_EDITOR_AVAILABLE=', VISUAL_EDITOR_AVAILABLE)

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

// ─── Template Malloy par défaut (mode texte) ──────────────────────────────────

export const DEFAULT_MALLOY_TEMPLATE = `-- Malloy → DuckDB SQL
-- Remplacez 'ma_table' par le nom de votre table DuckDB.

source: ma_source is duckdb.table('ma_table') extend {
  measure: nb_lignes is count()
}

run: ma_source -> {
  aggregate: nb_lignes
  limit: 100
}
`

// ─── StubCompile singleton ────────────────────────────────────────────────────
// Instance unique pour la session, évite de la recréer à chaque render.
const stubCompile = new StubCompile()

// ─── Helpers : DuckDB schema → Malloy SourceDef / ModelDef ───────────────────

function duckTypeToMalloyFieldType(duckType: string): object {
    const t = duckType.toUpperCase().trim()
    if (t === 'DATE') return { type: 'date' }
    if (t.startsWith('TIMESTAMP WITH TIME ZONE') || t.startsWith('TIMESTAMPTZ')) return { type: 'timestamptz' }
    if (t.startsWith('TIMESTAMP') || t.startsWith('DATETIME')) return { type: 'timestamp' }
    if (t === 'BOOLEAN' || t === 'BOOL') return { type: 'boolean' }
    if (t === 'JSON') return { type: 'json' }
    if (t === 'BIGINT') return { type: 'number', numberType: 'bigint' }
    if (t === 'HUGEINT' || t === 'UBIGINT' || t.startsWith('DECIMAL') || t.startsWith('NUMERIC') || t.startsWith('FLOAT') || t.startsWith('DOUBLE') || t === 'REAL')
        return { type: 'number', numberType: 'float' }
    if (t === 'INTEGER' || t === 'INT' || t === 'SMALLINT' || t === 'TINYINT' || t === 'UINTEGER' || t === 'USMALLINT' || t === 'UTINYINT' || t.startsWith('INT'))
        return { type: 'number', numberType: 'integer' }
    if (t === 'VARCHAR' || t === 'TEXT' || t === 'CHAR' || t.startsWith('VARCHAR') || t.startsWith('CHAR'))
        return { type: 'string' }
    // Fallback : sql native
    return { type: 'sql native', rawType: duckType }
}

function buildTableSourceDef(name: string, tablePath: string, columns: { name: string; type: string }[]) {
    return {
        type: 'table',
        name,
        tablePath,
        connection: 'duckdb',
        dialect: 'duckdb',
        fields: columns.map(col => ({
            ...duckTypeToMalloyFieldType(col.type),
            name: col.name,
        })),
    }
}

function buildModelDef(sourceDef: any) {
    return {
        name: 'malloy://notebook',
        exports: [sourceDef.name],
        contents: { [sourceDef.name]: sourceDef },
        sourceRegistry: {},
        queryList: [],
        dependencies: {},
    }
}

// ─── Quoting helper ───────────────────────────────────────────────────────────

function quoteIfNeeded(name: string): string {
    // Quotes identifiers containing special characters or reserved keywords
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return name
    return `\`${name}\``
}

// ─── MalloyVisualEditor — mode compositeur visuel ─────────────────────────────

function MalloyVisualEditor({ cell, path, cellIndex, onSwitchToText }: any) {
    const { isLoading, runCellAt, _duckdbTables, forceUpdate } =
        useNotebookStore(useShallow(s => ({
            isLoading: s.isLoading,
            runCellAt: s.runCellAt,
            _duckdbTables: s._duckdbTables,
            forceUpdate: s.forceUpdate,
        })))

    const [sqlOpen, setSqlOpen] = useState(false)
    const [copyDone, setCopyDone] = useState(false)

    const tableNames = Object.keys(_duckdbTables ?? {})
    const selectedTable: string | null = cell._selectedTable ?? (tableNames[0] ?? null)

    // Build SourceDef + ModelDef from selected table
    const { sourceDef, modelDef } = useMemo(() => {
        if (!selectedTable || !_duckdbTables?.[selectedTable]) {
            return { sourceDef: undefined, modelDef: undefined }
        }
        const sd = buildTableSourceDef(selectedTable, selectedTable, _duckdbTables[selectedTable].columns ?? [])
        const md = buildModelDef(sd)
        return { sourceDef: sd, modelDef: md }
    }, [selectedTable, _duckdbTables])

    // Query builder hook
    const { querySummary, queryModifiers, queryWriter } = useQueryBuilder(
        modelDef,
        selectedTable ?? undefined,
        'malloy://notebook',
    )

    console.log('[MalloyVisualEditor] useQueryBuilder result | queryWriter=', queryWriter, '| querySummary=', querySummary)
    if (!queryWriter) {
        console.warn('[MalloyVisualEditor] queryWriter is null/undefined — stub actif ou modelDef invalide')
        return null
    }

    const isRunning = cell._status === 'running'
    const compiledSql: string | null = cell._compiledSql ?? null
    const malloyLogs: any[] = cell._malloyLogs ?? []
    const hasError = malloyLogs.some((l: any) => l.severity === 'error')

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleTableChange = useCallback((tableName: string) => {
        cell._selectedTable = tableName
        cell._results = null
        cell._compiledSql = null
        cell._malloyLogs = []
        cell._resultInfo = null
        forceUpdate?.()
    }, [cell, forceUpdate])

    const handleRunQuery = useCallback((malloyRunStr: string) => {
        if (!selectedTable) return
        // Build full Malloy program: source definition + run query
        const quotedName = quoteIfNeeded(selectedTable)
        const sourceDecl = `source: ${quotedName} is duckdb.table('${selectedTable}')`
        const fullMalloy = `${sourceDecl}\n\n${malloyRunStr}`
        cell.malloyText = fullMalloy
        cell._malloyLogs = []
        forceUpdate?.()
        runCellAt(path, cellIndex)
    }, [selectedTable, cell, runCellAt, path, cellIndex, forceUpdate])

    const handleCopySql = useCallback(() => {
        if (!compiledSql) return
        navigator.clipboard.writeText(compiledSql).then(() => {
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 1500)
        }).catch(() => {})
    }, [compiledSql])

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <ComposerOptionsContext.Provider value={{ compiler: stubCompile }}>
            <UndoContext.Provider value={{}}>
                <div className="flex flex-col gap-3">

                    {/* ── En-tête : sélecteur de table + bouton mode texte ── */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200 text-xs font-semibold shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                            Malloy
                        </span>

                        {tableNames.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">Aucune table DuckDB disponible</span>
                        ) : (
                            <select
                                className="text-xs px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-violet-400"
                                value={selectedTable ?? ''}
                                onChange={e => handleTableChange(e.target.value)}
                            >
                                {!selectedTable && <option value="">-- Sélectionner une table --</option>}
                                {tableNames.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        )}

                        <button
                            className="ml-auto inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Basculer en mode édition texte Malloy"
                            onClick={onSwitchToText}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                            Mode texte
                        </button>
                    </div>

                    {/* ── QueryEditor (builder visuel) ── */}
                    {selectedTable && sourceDef && modelDef && (
                        <div className="rounded-md border border-violet-200 dark:border-violet-800 overflow-hidden bg-white dark:bg-[#1e1e2e]">
                            <QueryEditor
                                source={sourceDef}
                                model={modelDef}
                                querySummary={querySummary}
                                queryModifiers={queryModifiers}
                                queryWriter={queryWriter}
                                runQuery={handleRunQuery}
                                isRunning={isRunning}
                                topValues={undefined}
                            />
                        </div>
                    )}

                    {!selectedTable && tableNames.length > 0 && (
                        <div className="text-xs text-muted-foreground italic px-2 py-4 text-center border border-dashed border-border rounded-md">
                            Sélectionnez une table ci-dessus pour ouvrir le constructeur de requête visuel.
                        </div>
                    )}

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
            </UndoContext.Provider>
        </ComposerOptionsContext.Provider>
    )
}

// ─── MalloyTextEditor — mode éditeur texte (Monaco) ──────────────────────────

function MalloyTextEditor({ cell, path, cellIndex, onSwitchToVisual }: any) {
    const { isLoading, runCellAt, _duckdbTables, db, forceUpdate } =
        useNotebookStore(useShallow(s => ({
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
    const isRunning = cell._status === 'running'

    // ─── Handlers ─────────────────────────────────────────────────────────────

    const handleChange = useCallback((value: string | undefined) => {
        cell.malloyText = value ?? ''
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

    // ─── Monaco fallback (si jsDelivr CDN indisponible) ───────────────────────
    // useMonaco() retourne l'instance Monaco si elle est chargée, sinon null.
    // Si Monaco ne charge pas dans les 8 s (CDN bloqué, ad-blocker…),
    // on bascule sur un <textarea> simple pour garder l'éditeur fonctionnel.
    const monaco = useMonaco()
    const [monacoTimedOut, setMonacoTimedOut] = useState(false)
    useEffect(() => {
        if (monaco) return
        const t = setTimeout(() => setMonacoTimedOut(true), 8000)
        return () => clearTimeout(t)
    }, [monaco])

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-3">

            {/* ── En-tête : badge + actions + bouton retour mode visuel ── */}
            <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200 text-xs font-semibold">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                        Malloy
                    </span>
                    <span className="text-muted-foreground/60">→ DuckDB SQL</span>
                </span>
                <div className="flex gap-1 items-center">
                    {onSwitchToVisual && (
                        <button
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                            title="Basculer en mode constructeur visuel"
                            onClick={onSwitchToVisual}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
                            Mode visuel
                        </button>
                    )}
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

            {/* ── Éditeur Malloy (Monaco ou textarea de fallback) ── */}
            {monacoTimedOut ? (
                <textarea
                    key={cell._id + '_malloy_ta'}
                    value={malloyText}
                    onChange={e => handleChange(e.target.value)}
                    rows={12}
                    spellCheck={false}
                    className="w-full font-mono text-sm p-2 rounded-md border border-violet-200 dark:border-violet-800 bg-background text-foreground resize-y focus:outline-none focus:ring-1 focus:ring-violet-400"
                    placeholder={DEFAULT_MALLOY_TEMPLATE}
                />
            ) : (
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
            )}

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

// ─── MalloyCellEditor — sélecteur de mode ─────────────────────────────────────

export function MalloyCellEditor({ cell, path, cellIndex }: any) {
    const forceUpdate = useNotebookStore(s => s.forceUpdate)

    // Par défaut : mode visuel si disponible, sinon texte.
    // VISUAL_EDITOR_AVAILABLE est calculé au chargement du module (pas persisté sur la cellule).
    const defaultMode = VISUAL_EDITOR_AVAILABLE ? 'visual' : 'text'
    const mode: string = cell._composerMode ?? defaultMode
    console.log('[MalloyCellEditor] render | mode=', mode, '| cell._composerMode=', cell._composerMode, '| VISUAL_EDITOR_AVAILABLE=', VISUAL_EDITOR_AVAILABLE)

    const switchToText = useCallback(() => {
        cell._composerMode = 'text'
        forceUpdate?.()
    }, [cell, forceUpdate])

    const switchToVisual = useCallback(() => {
        cell._composerMode = 'visual'
        forceUpdate?.()
    }, [cell, forceUpdate])

    if (mode === 'text') {
        return (
            <MalloyTextEditor
                cell={cell}
                path={path}
                cellIndex={cellIndex}
                onSwitchToVisual={VISUAL_EDITOR_AVAILABLE ? switchToVisual : null}
            />
        )
    }

    return <MalloyVisualEditor cell={cell} path={path} cellIndex={cellIndex} onSwitchToText={switchToText} />
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
