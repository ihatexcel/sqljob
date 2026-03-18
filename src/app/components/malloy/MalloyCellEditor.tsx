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
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return name
    return `\`${name}\``
}

// ─── Malloy query builder (CDN-compatible, no @malloydata/query-composer) ────

interface MeasureConfig {
    id: string
    fn: 'count' | 'sum' | 'avg' | 'min' | 'max'
    field: string  // '*' for count
    alias: string
}

interface FilterConfig {
    id: string
    field: string
    op: '=' | '!=' | '>' | '>=' | '<' | '<=' | '~'
    value: string
}

function generateMalloy(
    tableName: string,
    dimensions: string[],
    measures: MeasureConfig[],
    filters: FilterConfig[],
    orderByAlias: string,
    orderDir: 'asc' | 'desc',
    limit: number,
): string {
    if (!tableName) return ''
    const q = quoteIfNeeded(tableName)
    const measuresLines = measures.map(m =>
        m.fn === 'count'
            ? `  measure: ${m.alias} is count()`
            : `  measure: ${m.alias} is ${m.fn}(${quoteIfNeeded(m.field)})`
    )
    const sourceBlock = measuresLines.length > 0
        ? `source: ${q} is duckdb.table('${tableName}') extend {\n${measuresLines.join('\n')}\n}`
        : `source: ${q} is duckdb.table('${tableName}')`

    const parts: string[] = []
    if (dimensions.length > 0) parts.push(`  group_by: ${dimensions.map(quoteIfNeeded).join(', ')}`)
    if (measures.length > 0) parts.push(`  aggregate: ${measures.map(m => m.alias).join(', ')}`)
    const activeFilters = filters.filter(f => f.field && f.value.trim())
    if (activeFilters.length > 0) {
        const conds = activeFilters.map(f => {
            const fq = quoteIfNeeded(f.field)
            if (f.op === '~') return `${fq} ~ '%${f.value}%'`
            const isNum = /^-?\d+(\.\d+)?$/.test(f.value.trim())
            const val = isNum ? f.value.trim() : `'${f.value}'`
            return `${fq} ${f.op} ${val}`
        })
        parts.push(`  where: ${conds.join(' and ')}`)
    }
    if (orderByAlias) parts.push(`  order_by: ${orderByAlias} ${orderDir}`)
    parts.push(`  limit: ${limit}`)

    return `${sourceBlock}\n\nrun: ${q} -> {\n${parts.join('\n')}\n}\n`
}

let _uid = 0
function uid() { return String(++_uid) }

// ─── Parse malloyText → état du constructeur visuel ───────────────────────────
// Permet de restaurer l'UI depuis un malloyText chargé depuis le config JSON.

interface ParsedQueryState {
    tableName: string
    dimensions: string[]
    measures: MeasureConfig[]
    limit: number
    orderByAlias: string
    orderDir: 'asc' | 'desc'
}

function parseMalloyToQueryState(malloyText: string, tableNames: string[]): ParsedQueryState | null {
    if (!malloyText?.trim()) return null

    const tableMatch = malloyText.match(/duckdb\.table\('([^']+)'\)/)
    const tableName = tableMatch?.[1]
    if (!tableName || !tableNames.includes(tableName)) return null

    // Dimensions : group_by: field1, field2
    const groupByMatch = malloyText.match(/group_by:\s*([^\n}]+)/)
    const dimensions = groupByMatch
        ? groupByMatch[1].split(',').map(s => s.trim().replace(/`/g, '')).filter(Boolean)
        : []

    // Mesures count()
    const measures: MeasureConfig[] = []
    const countRe = /measure:\s+(\w+)\s+is\s+count\(\)/g
    let m: RegExpExecArray | null
    while ((m = countRe.exec(malloyText)) !== null) {
        measures.push({ id: uid(), fn: 'count', field: '*', alias: m[1] })
    }
    // Mesures sum/avg/min/max(field)
    const aggRe = /measure:\s+(\w+)\s+is\s+(sum|avg|min|max)\(`?([^`)\n]+?)`?\)/g
    while ((m = aggRe.exec(malloyText)) !== null) {
        measures.push({ id: uid(), fn: m[2] as any, field: m[3].trim(), alias: m[1] })
    }

    const limitMatch = malloyText.match(/limit:\s*(\d+)/)
    const limit = limitMatch ? parseInt(limitMatch[1]) : 100

    const orderMatch = malloyText.match(/order_by:\s+(\S+)\s+(asc|desc)/)

    return {
        tableName,
        dimensions,
        measures: measures.length > 0 ? measures : [{ id: uid(), fn: 'count', field: '*', alias: 'nb_lignes' }],
        limit,
        orderByAlias: orderMatch?.[1] ?? '',
        orderDir: (orderMatch?.[2] ?? 'desc') as 'asc' | 'desc',
    }
}

function MalloyQueryBuilderUI({ cell, path, cellIndex, onSwitchToText }: any) {
    const { runCellAt, _duckdbTables, forceUpdate } = useNotebookStore(useShallow(s => ({
        runCellAt: s.runCellAt,
        _duckdbTables: s._duckdbTables,
        forceUpdate: s.forceUpdate,
    })))

    const tableNames = Object.keys(_duckdbTables ?? {})

    // Si le _selectedTable en mémoire ne correspond pas à la table du malloyText
    // (cas d'import de config), on parse le malloyText pour restaurer l'état correct.
    const parsed = useMemo(() => parseMalloyToQueryState(cell.malloyText, tableNames), [cell.malloyText, tableNames.join(',')])
    const savedTableMatchesMalloy = !cell.malloyText || !parsed || cell._selectedTable === parsed.tableName
    const useQbState = savedTableMatchesMalloy && cell._qb_initialized

    const [selectedTable, setSelectedTable] = useState<string>(() =>
        useQbState ? (cell._selectedTable ?? tableNames[0] ?? '') : (parsed?.tableName ?? tableNames[0] ?? '')
    )
    const columns: { name: string; type: string }[] = _duckdbTables?.[selectedTable]?.columns ?? []
    const numericCols = columns.filter(c => {
        const t = c.type.toUpperCase()
        return ['INT','FLOAT','DOUBLE','DECIMAL','NUMERIC','REAL','BIGINT','HUGEINT','UBIGINT'].some(k => t.includes(k))
    })

    const defaultMeasure: MeasureConfig = { id: uid(), fn: 'count', field: '*', alias: 'nb_lignes' }

    const [dimensions, setDimensions] = useState<string[]>(() =>
        useQbState ? (cell._qb_dimensions ?? []) : (parsed?.dimensions ?? [])
    )
    const [measures, setMeasures] = useState<MeasureConfig[]>(() =>
        useQbState ? (cell._qb_measures ?? [defaultMeasure]) : (parsed?.measures ?? [defaultMeasure])
    )
    const [filters, setFilters] = useState<FilterConfig[]>(() => cell._qb_filters ?? [])
    const [limit, setLimit] = useState<number>(() =>
        useQbState ? (cell._qb_limit ?? 100) : (parsed?.limit ?? 100)
    )
    const [orderByAlias, setOrderByAlias] = useState<string>(() =>
        useQbState ? (cell._qb_orderByAlias ?? '') : (parsed?.orderByAlias ?? '')
    )
    const [orderDir, setOrderDir] = useState<'asc' | 'desc'>(() =>
        useQbState ? (cell._qb_orderDir ?? 'desc') : (parsed?.orderDir ?? 'desc')
    )
    const [malloyOpen, setMalloyOpen] = useState(false)
    const [copyDone, setCopyDone] = useState(false)
    const [compiling, setCompiling] = useState(false)

    // Marque la cellule comme ayant été ouverte en mode visuel
    useEffect(() => { cell._qb_initialized = true }, [])

    // Persiste l'état du constructeur sur la cellule pour survivre aux remounts
    useEffect(() => { cell._qb_dimensions = dimensions }, [dimensions])
    useEffect(() => { cell._qb_measures = measures }, [measures])
    useEffect(() => { cell._qb_filters = filters }, [filters])
    useEffect(() => { cell._qb_limit = limit }, [limit])
    useEffect(() => { cell._qb_orderByAlias = orderByAlias }, [orderByAlias])
    useEffect(() => { cell._qb_orderDir = orderDir }, [orderDir])

    const malloyText = generateMalloy(selectedTable, dimensions, measures, filters, orderByAlias, orderDir, limit)
    // Synchronise cell.malloyText — mais pas au premier mount pour ne pas écraser
    // un malloyText chargé depuis le config (le composant ne monte que si _qb_initialized)
    const _syncMounted = useRef(false)
    useEffect(() => {
        if (!_syncMounted.current) { _syncMounted.current = true; return }
        cell.malloyText = malloyText
    }, [malloyText])
    const compiledSql: string | null = cell._compiledSql ?? null
    const malloyLogs: any[] = cell._malloyLogs ?? []
    const hasError = malloyLogs.some((l: any) => l.severity === 'error')
    const isRunning = cell._status === 'running'

    const handleTableChange = useCallback((t: string) => {
        setSelectedTable(t)
        cell._selectedTable = t
        setDimensions([])
        setMeasures([{ id: uid(), fn: 'count', field: '*', alias: 'nb_lignes' }])
        setFilters([])
        setOrderByAlias('')
        setOrderDir('desc')
        setLimit(100)
        cell._qb_dimensions = []
        cell._qb_measures = undefined
        cell._qb_filters = []
        cell._qb_orderByAlias = ''
        cell._qb_orderDir = 'desc'
        cell._qb_limit = 100
        cell._results = null
        cell._compiledSql = null
        cell._malloyLogs = []
        cell._resultInfo = null
        forceUpdate?.()
    }, [cell, forceUpdate])

    const toggleDim = useCallback((field: string) => {
        setDimensions(prev => prev.includes(field) ? prev.filter(d => d !== field) : [...prev, field])
    }, [])

    const addMeasure = useCallback(() => {
        const f = numericCols[0]?.name ?? (columns[0]?.name ?? '*')
        setMeasures(prev => [...prev, { id: uid(), fn: 'sum', field: f, alias: `sum_${f}` }])
    }, [numericCols, columns])

    const updateMeasure = useCallback((id: string, upd: Partial<MeasureConfig>) => {
        setMeasures(prev => prev.map(m => {
            if (m.id !== id) return m
            const next = { ...m, ...upd }
            if ((upd.fn || upd.field) && !upd.alias) {
                next.alias = next.fn === 'count' ? 'nb_lignes' : `${next.fn}_${next.field}`
            }
            return next
        }))
    }, [])

    const removeMeasure = useCallback((id: string) => {
        setMeasures(prev => prev.filter(m => m.id !== id))
    }, [])

    const addFilter = useCallback(() => {
        setFilters(prev => [...prev, { id: uid(), field: columns[0]?.name ?? '', op: '=', value: '' }])
    }, [columns])

    const updateFilter = useCallback((id: string, upd: Partial<FilterConfig>) => {
        setFilters(prev => prev.map(f => f.id === id ? { ...f, ...upd } : f))
    }, [])

    const removeFilter = useCallback((id: string) => {
        setFilters(prev => prev.filter(f => f.id !== id))
    }, [])

    const handleRun = useCallback(async () => {
        if (!malloyText || !selectedTable) return
        cell.malloyText = malloyText
        cell._malloyLogs = []
        cell._compiledSql = null
        setCompiling(true)
        forceUpdate?.()
        try {
            const result = await compileMalloy(malloyText, _duckdbTables)
            if (isCompileError(result)) {
                cell._compiledSql = null
                cell._malloyLogs = result.logs
                cell._resultInfo = `❌ Erreur Malloy : ${result.error}`
                forceUpdate?.()
            } else {
                cell._compiledSql = result.sql
                cell._malloyLogs = result.logs
                forceUpdate?.()
                runCellAt(path, cellIndex)
            }
        } catch (err: any) {
            cell._malloyLogs = [{ severity: 'error', message: err?.message ?? String(err) }]
            cell._resultInfo = `❌ Erreur inattendue : ${err?.message}`
            forceUpdate?.()
        } finally {
            setCompiling(false)
        }
    }, [malloyText, selectedTable, cell, _duckdbTables, runCellAt, path, cellIndex, forceUpdate])

    const handleCopyMalloy = useCallback(() => {
        navigator.clipboard.writeText(malloyText).then(() => {
            setCopyDone(true)
            setTimeout(() => setCopyDone(false), 1500)
        }).catch(() => {})
    }, [malloyText])

    return (
        <div className="flex flex-col gap-3">

            {/* ── En-tête ── */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200 text-xs font-semibold shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                    Malloy — Mode visuel
                </span>

                {tableNames.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">Aucune table DuckDB disponible</span>
                ) : (
                    <select
                        className="text-xs px-2 py-1 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-violet-400"
                        value={selectedTable}
                        onChange={e => handleTableChange(e.target.value)}
                    >
                        {!selectedTable && <option value="">-- Sélectionner une table --</option>}
                        {tableNames.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                )}

                <div className="ml-auto flex items-center gap-1">
                    <button
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        onClick={onSwitchToText}
                        title="Passer en mode éditeur texte Malloy"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                        Mode texte
                    </button>
                    <button
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-green-700 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
                        disabled={!selectedTable || isRunning || compiling}
                        onClick={handleRun}
                        title="Compiler + exécuter"
                    >
                        {(isRunning || compiling) ? <IconSpin size={12} /> : <IconPlay size={12} />}
                        Exécuter
                    </button>
                </div>
            </div>

            {selectedTable && (
                <>
                    {/* ── Dimensions + Measures ── */}
                    <div className="grid grid-cols-2 gap-3">

                        {/* Dimensions */}
                        <div className="border border-border rounded-md overflow-hidden">
                            <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
                                Dimensions <span className="font-normal">(group_by)</span>
                            </div>
                            <div className="max-h-52 overflow-y-auto">
                                {columns.length === 0 && (
                                    <div className="text-xs text-muted-foreground italic px-3 py-2">Aucune colonne</div>
                                )}
                                {columns.map(col => (
                                    <label key={col.name} className={`flex items-center gap-2 text-xs cursor-pointer px-3 py-1.5 hover:bg-muted/50 transition-colors ${dimensions.includes(col.name) ? 'bg-violet-50 dark:bg-violet-950/30' : ''}`}>
                                        <input
                                            type="checkbox"
                                            className="rounded accent-violet-600"
                                            checked={dimensions.includes(col.name)}
                                            onChange={() => toggleDim(col.name)}
                                        />
                                        <span className="font-mono truncate flex-1">{col.name}</span>
                                        <span className="text-muted-foreground/50 shrink-0 text-[10px]">{col.type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Measures */}
                        <div className="border border-border rounded-md overflow-hidden">
                            <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                    Mesures <span className="font-normal">(aggregate)</span>
                                </span>
                                <button
                                    className="text-violet-600 hover:text-violet-700 text-xs font-medium px-1.5 py-0.5 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
                                    onClick={addMeasure}
                                    title="Ajouter une mesure"
                                >+ Ajouter</button>
                            </div>
                            <div className="max-h-52 overflow-y-auto divide-y divide-border">
                                {measures.length === 0 && (
                                    <div className="text-xs text-muted-foreground italic px-3 py-2">Aucune mesure</div>
                                )}
                                {measures.map(m => (
                                    <div key={m.id} className="flex items-center gap-1.5 px-2 py-1.5 flex-wrap">
                                        <select
                                            className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground w-16 shrink-0"
                                            value={m.fn}
                                            onChange={e => updateMeasure(m.id, { fn: e.target.value as any })}
                                        >
                                            <option value="count">count</option>
                                            <option value="sum">sum</option>
                                            <option value="avg">avg</option>
                                            <option value="min">min</option>
                                            <option value="max">max</option>
                                        </select>
                                        {m.fn !== 'count' && (
                                            <select
                                                className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground flex-1 min-w-0"
                                                value={m.field}
                                                onChange={e => updateMeasure(m.id, { field: e.target.value })}
                                            >
                                                {(numericCols.length > 0 ? numericCols : columns).map(c => (
                                                    <option key={c.name} value={c.name}>{c.name}</option>
                                                ))}
                                            </select>
                                        )}
                                        <input
                                            className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground w-24 font-mono shrink-0"
                                            value={m.alias}
                                            onChange={e => updateMeasure(m.id, { alias: e.target.value })}
                                            placeholder="alias"
                                            title="Nom de la mesure dans Malloy"
                                        />
                                        <button
                                            className="text-muted-foreground/50 hover:text-red-500 transition-colors shrink-0"
                                            onClick={() => removeMeasure(m.id)}
                                            title="Supprimer"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Filtres ── */}
                    <div className="border border-border rounded-md overflow-hidden">
                        <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border flex items-center justify-between">
                            <span className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                                Filtres <span className="font-normal">(where)</span>
                            </span>
                            <button
                                className="text-violet-600 hover:text-violet-700 text-xs font-medium px-1.5 py-0.5 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors"
                                onClick={addFilter}
                            >+ Ajouter</button>
                        </div>
                        {filters.length === 0 ? (
                            <div className="text-xs text-muted-foreground italic px-3 py-2">Aucun filtre — <button className="text-violet-600 hover:underline" onClick={addFilter}>ajouter un filtre</button></div>
                        ) : (
                            <div className="divide-y divide-border">
                                {filters.map(f => (
                                    <div key={f.id} className="flex items-center gap-1.5 px-2 py-1.5 flex-wrap">
                                        <select
                                            className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground flex-1 min-w-[100px]"
                                            value={f.field}
                                            onChange={e => updateFilter(f.id, { field: e.target.value })}
                                        >
                                            {columns.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                        </select>
                                        <select
                                            className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground w-14 shrink-0"
                                            value={f.op}
                                            onChange={e => updateFilter(f.id, { op: e.target.value as any })}
                                        >
                                            <option value="=">=</option>
                                            <option value="!=">≠</option>
                                            <option value=">">&gt;</option>
                                            <option value=">=">&gt;=</option>
                                            <option value="<">&lt;</option>
                                            <option value="<=">&lt;=</option>
                                            <option value="~">contient</option>
                                        </select>
                                        <input
                                            className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground flex-1 min-w-[80px]"
                                            value={f.value}
                                            onChange={e => updateFilter(f.id, { value: e.target.value })}
                                            placeholder="valeur"
                                        />
                                        <button
                                            className="text-muted-foreground/50 hover:text-red-500 transition-colors shrink-0"
                                            onClick={() => removeFilter(f.id)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Limit + Order ── */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                            Limite :
                            <input
                                type="number"
                                min={1} max={10000}
                                value={limit}
                                onChange={e => setLimit(Math.max(1, parseInt(e.target.value) || 100))}
                                className="w-20 text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground"
                            />
                        </label>
                        {measures.length > 0 && (
                            <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                                Trier par :
                                <select
                                    className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground"
                                    value={orderByAlias}
                                    onChange={e => setOrderByAlias(e.target.value)}
                                >
                                    <option value="">— aucun —</option>
                                    {measures.map(m => <option key={m.id} value={m.alias}>{m.alias}</option>)}
                                    {dimensions.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <select
                                    className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground"
                                    value={orderDir}
                                    onChange={e => setOrderDir(e.target.value as 'asc' | 'desc')}
                                >
                                    <option value="desc">desc ↓</option>
                                    <option value="asc">asc ↑</option>
                                </select>
                            </label>
                        )}
                    </div>
                </>
            )}

            {/* ── Logs ── */}
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

            {/* ── Malloy généré (collapsible) ── */}
            {malloyText && (
                <div className="border border-border rounded-md overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-muted/50 hover:bg-muted transition-colors text-left"
                        onClick={() => setMalloyOpen(o => !o)}
                    >
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-200 text-xs">Malloy généré</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <span
                                className="p-1 hover:text-foreground text-muted-foreground/40 transition-colors"
                                title="Copier le Malloy"
                                onClick={e => { e.stopPropagation(); handleCopyMalloy() }}
                            >
                                {copyDone ? <IconCheck size={13} /> : <IconCopy size={13} />}
                            </span>
                            <IconChevron open={malloyOpen} size={14} />
                        </div>
                    </button>
                    {malloyOpen && (
                        <pre className="text-xs font-mono p-3 overflow-x-auto bg-background max-h-48 overflow-y-auto whitespace-pre leading-relaxed">{malloyText}</pre>
                    )}
                </div>
            )}

            {/* ── Résultats ── */}
            {cell._results && Array.isArray(cell._results) && cell._results.length > 0 && (
                <div className="rounded-lg overflow-x-auto">
                    <SqlDataTable cell={cell} searchable />
                </div>
            )}
            {cell._resultInfo && (
                <div className={`text-xs px-2 py-1 rounded ${cell._resultInfo.startsWith('❌') ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                    {cell._resultInfo}
                </div>
            )}
        </div>
    )
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

    if (!queryWriter) return null

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

    // Par défaut : mode visuel (MalloyQueryBuilderUI en CDN, MalloyVisualEditor en dev)
    // Exception : si la cellule a un malloyText chargé depuis le config mais n'a jamais
    // été ouverte en mode visuel (_qb_initialized absent), on démarre en mode texte
    // pour préserver le contenu chargé.
    const defaultMode = (cell._qb_initialized || !cell.malloyText?.trim()) ? 'visual' : 'text'
    const mode: string = cell._composerMode ?? defaultMode

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
                onSwitchToVisual={switchToVisual}
            />
        )
    }

    // Mode visuel : query-composer (dev) ou constructeur intégré (CDN)
    if (VISUAL_EDITOR_AVAILABLE) {
        return <MalloyVisualEditor cell={cell} path={path} cellIndex={cellIndex} onSwitchToText={switchToText} />
    }
    return <MalloyQueryBuilderUI cell={cell} path={path} cellIndex={cellIndex} onSwitchToText={switchToText} />
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
