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

type MeasureFn = 'count' | 'count_distinct' | 'sum' | 'avg' | 'min' | 'max' | 'custom'

interface MeasureConfig {
    id: string
    fn: MeasureFn
    field: string      // '*' pour count, nom de colonne pour les autres
    alias: string
    customExpr?: string // pour fn === 'custom'
}

interface FilterConfig {
    id: string
    field: string
    op: '=' | '!=' | '>' | '>=' | '<' | '<=' | '~'
    value: string
}

// Un bloc nest: imbriqué dans la query principale.
// Chaque nest a ses propres group_by et aggregate (références aux alias de mesures sources).
interface NestConfig {
    id: string
    alias: string
    dimensions: string[]
    measureAliases: string[]  // alias des mesures définies dans source
    limit?: number
}

function measureToSourceLine(m: MeasureConfig): string {
    switch (m.fn) {
        case 'count':          return `  measure: ${m.alias} is count()`
        case 'count_distinct': return `  measure: ${m.alias} is count(distinct ${quoteIfNeeded(m.field)})`
        case 'custom':         return `  measure: ${m.alias} is ${m.customExpr?.trim() || 'count()'}`
        default:               return `  measure: ${m.alias} is ${m.fn}(${quoteIfNeeded(m.field)})`
    }
}

function filtersToCond(filters: FilterConfig[]): string {
    return filters.filter(f => f.field && f.value.trim()).map(f => {
        const fq = quoteIfNeeded(f.field)
        if (f.op === '~') return `${fq} ~ '%${f.value}%'`
        const isNum = /^-?\d+(\.\d+)?$/.test(f.value.trim())
        return `${fq} ${f.op} ${isNum ? f.value.trim() : `'${f.value}'`}`
    }).join(' and ')
}

function nestToMalloy(nest: NestConfig): string {
    const lines: string[] = []
    if (nest.dimensions.length > 0) lines.push(`    group_by: ${nest.dimensions.map(quoteIfNeeded).join(', ')}`)
    if (nest.measureAliases.length > 0) lines.push(`    aggregate: ${nest.measureAliases.join(', ')}`)
    if (nest.limit) lines.push(`    limit: ${nest.limit}`)
    return `  nest: ${nest.alias} is {\n${lines.join('\n')}\n  }`
}

function generateMalloy(
    tableName: string,
    dimensions: string[],
    measures: MeasureConfig[],
    nests: NestConfig[],
    filters: FilterConfig[],
    orderByAlias: string,
    orderDir: 'asc' | 'desc',
    limit: number,
): string {
    if (!tableName) return ''
    const q = quoteIfNeeded(tableName)

    const measureLines = measures.map(measureToSourceLine)
    const sourceBlock = measureLines.length > 0
        ? `source: ${q} is duckdb.table('${tableName}') extend {\n${measureLines.join('\n')}\n}`
        : `source: ${q} is duckdb.table('${tableName}')`

    const parts: string[] = []
    if (dimensions.length > 0) parts.push(`  group_by: ${dimensions.map(quoteIfNeeded).join(', ')}`)
    if (measures.length > 0) parts.push(`  aggregate: ${measures.map(m => m.alias).join(', ')}`)
    const cond = filtersToCond(filters)
    if (cond) parts.push(`  where: ${cond}`)
    if (nests.length > 0) parts.push(...nests.map(nestToMalloy))
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
    nests: NestConfig[]
    limit: number
    orderByAlias: string
    orderDir: 'asc' | 'desc'
}

function parseDimensions(block: string): string[] {
    const m = block.match(/group_by:\s*([^\n}]+)/)
    return m ? m[1].split(',').map(s => s.trim().replace(/`/g, '')).filter(Boolean) : []
}

function parseMalloyToQueryState(malloyText: string, tableNames: string[]): ParsedQueryState | null {
    if (!malloyText?.trim()) return null

    const tableMatch = malloyText.match(/duckdb\.table\('([^']+)'\)/)
    const tableName = tableMatch?.[1]
    if (!tableName || !tableNames.includes(tableName)) return null

    const measures: MeasureConfig[] = []
    let m: RegExpExecArray | null
    // count()
    const countRe = /measure:\s+(\w+)\s+is\s+count\(\)/g
    while ((m = countRe.exec(malloyText)) !== null)
        measures.push({ id: uid(), fn: 'count', field: '*', alias: m[1] })
    // count(distinct field)
    const cdRe = /measure:\s+(\w+)\s+is\s+count\(distinct\s+`?([^`)\n]+?)`?\)/g
    while ((m = cdRe.exec(malloyText)) !== null)
        measures.push({ id: uid(), fn: 'count_distinct', field: m[2].trim(), alias: m[1] })
    // sum/avg/min/max
    const aggRe = /measure:\s+(\w+)\s+is\s+(sum|avg|min|max)\(`?([^`)\n]+?)`?\)/g
    while ((m = aggRe.exec(malloyText)) !== null)
        measures.push({ id: uid(), fn: m[2] as MeasureFn, field: m[3].trim(), alias: m[1] })

    // Dimensions de la query principale (premier group_by hors nest)
    const runBlockMatch = malloyText.match(/run:[^{]+\{([\s\S]*)\}/)
    const runBlock = runBlockMatch?.[1] ?? ''
    // Supprime les blocs nest pour ne parser que le group_by principal
    const runBlockNoNest = runBlock.replace(/nest:\s*\w+\s+is\s*\{[^}]*\}/g, '')
    const dimensions = parseDimensions(runBlockNoNest)

    // Nests
    const nests: NestConfig[] = []
    const nestRe = /nest:\s+(\w+)\s+is\s+\{([^}]+)\}/g
    while ((m = nestRe.exec(runBlock)) !== null) {
        const nestAlias = m[1]
        const nestBody = m[2]
        const nestDims = parseDimensions(nestBody)
        const aggMatch = nestBody.match(/aggregate:\s*([^\n}]+)/)
        const nestAliases = aggMatch ? aggMatch[1].split(',').map(s => s.trim()).filter(Boolean) : []
        const nestLimitMatch = nestBody.match(/limit:\s*(\d+)/)
        nests.push({ id: uid(), alias: nestAlias, dimensions: nestDims, measureAliases: nestAliases, limit: nestLimitMatch ? parseInt(nestLimitMatch[1]) : undefined })
    }

    const limitMatch = runBlockNoNest.match(/limit:\s*(\d+)/)
    const orderMatch = runBlockNoNest.match(/order_by:\s+(\S+)\s+(asc|desc)/)

    return {
        tableName,
        dimensions,
        measures: measures.length > 0 ? measures : [{ id: uid(), fn: 'count', field: '*', alias: 'nb_lignes' }],
        nests,
        limit: limitMatch ? parseInt(limitMatch[1]) : 100,
        orderByAlias: orderMatch?.[1] ?? '',
        orderDir: (orderMatch?.[2] ?? 'desc') as 'asc' | 'desc',
    }
}

// ─── Sous-composant NestEditor ────────────────────────────────────────────────

function NestEditor({ nest, columns, measures, onChange, onRemove }: {
    nest: NestConfig
    columns: { name: string; type: string }[]
    measures: MeasureConfig[]
    onChange: (upd: Partial<NestConfig>) => void
    onRemove: () => void
}) {
    const [open, setOpen] = useState(true)
    return (
        <div className="border border-violet-200 dark:border-violet-800 rounded-md overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50/50 dark:bg-violet-950/20 border-b border-violet-200 dark:border-violet-800">
                <button className="text-muted-foreground/50 hover:text-foreground" onClick={() => setOpen(o => !o)}>
                    <IconChevron open={open} size={12} />
                </button>
                <span className="text-xs font-medium text-violet-700 dark:text-violet-300">nest:</span>
                <input
                    className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground font-mono flex-1"
                    value={nest.alias}
                    onChange={e => onChange({ alias: e.target.value.replace(/\s/g, '_') })}
                    placeholder="nom_du_nest"
                />
                <button className="text-muted-foreground/50 hover:text-red-500 transition-colors" onClick={onRemove}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            {open && (
                <div className="grid grid-cols-2 gap-0 divide-x divide-border">
                    {/* Dimensions du nest */}
                    <div className="p-2">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">group_by</div>
                        <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5">
                            {columns.map(col => (
                                <label key={col.name} className={`flex items-center gap-1.5 text-xs cursor-pointer px-1 py-0.5 rounded hover:bg-muted/50 ${nest.dimensions.includes(col.name) ? 'bg-violet-50 dark:bg-violet-950/30' : ''}`}>
                                    <input type="checkbox" className="accent-violet-600" checked={nest.dimensions.includes(col.name)}
                                        onChange={() => onChange({ dimensions: nest.dimensions.includes(col.name) ? nest.dimensions.filter(d => d !== col.name) : [...nest.dimensions, col.name] })} />
                                    <span className="font-mono truncate">{col.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Mesures du nest (référence aux alias de source) */}
                    <div className="p-2">
                        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">aggregate</div>
                        <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5">
                            {measures.length === 0 && <div className="text-xs text-muted-foreground/50 italic">Définissez des mesures</div>}
                            {measures.map(m => (
                                <label key={m.id} className={`flex items-center gap-1.5 text-xs cursor-pointer px-1 py-0.5 rounded hover:bg-muted/50 ${nest.measureAliases.includes(m.alias) ? 'bg-violet-50 dark:bg-violet-950/30' : ''}`}>
                                    <input type="checkbox" className="accent-violet-600" checked={nest.measureAliases.includes(m.alias)}
                                        onChange={() => onChange({ measureAliases: nest.measureAliases.includes(m.alias) ? nest.measureAliases.filter(a => a !== m.alias) : [...nest.measureAliases, m.alias] })} />
                                    <span className="font-mono truncate">{m.alias}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {open && (
                <div className="px-3 py-1.5 border-t border-border flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">limit :</span>
                    <input type="number" min={1} max={1000} value={nest.limit ?? 10}
                        onChange={e => onChange({ limit: Math.max(1, parseInt(e.target.value) || 10) })}
                        className="w-16 text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground" />
                </div>
            )}
        </div>
    )
}

// ─── MalloyQueryBuilderUI ─────────────────────────────────────────────────────

function MalloyQueryBuilderUI({ cell, path, cellIndex, onSwitchToText }: any) {
    const { runCellAt, _duckdbTables, forceUpdate } = useNotebookStore(useShallow(s => ({
        runCellAt: s.runCellAt,
        _duckdbTables: s._duckdbTables,
        forceUpdate: s.forceUpdate,
    })))

    const tableNames = Object.keys(_duckdbTables ?? {})
    const parsed = useMemo(() => parseMalloyToQueryState(cell.malloyText, tableNames), [cell.malloyText, tableNames.join(',')])
    const savedTableMatchesMalloy = !cell.malloyText || !parsed || cell._selectedTable === parsed.tableName
    const useQbState = savedTableMatchesMalloy && cell._qb_initialized

    const defaultMeasure: MeasureConfig = { id: uid(), fn: 'count', field: '*', alias: 'nb_lignes' }

    const [selectedTable, setSelectedTable] = useState<string>(() =>
        useQbState ? (cell._selectedTable ?? tableNames[0] ?? '') : (parsed?.tableName ?? tableNames[0] ?? ''))
    const [dimensions, setDimensions] = useState<string[]>(() =>
        useQbState ? (cell._qb_dimensions ?? []) : (parsed?.dimensions ?? []))
    const [measures, setMeasures] = useState<MeasureConfig[]>(() =>
        useQbState ? (cell._qb_measures ?? [defaultMeasure]) : (parsed?.measures ?? [defaultMeasure]))
    const [nests, setNests] = useState<NestConfig[]>(() =>
        useQbState ? (cell._qb_nests ?? []) : (parsed?.nests ?? []))
    const [filters, setFilters] = useState<FilterConfig[]>(() =>
        useQbState ? (cell._qb_filters ?? []) : [])
    const [limit, setLimit] = useState<number>(() =>
        useQbState ? (cell._qb_limit ?? 100) : (parsed?.limit ?? 100))
    const [orderByAlias, setOrderByAlias] = useState<string>(() =>
        useQbState ? (cell._qb_orderByAlias ?? '') : (parsed?.orderByAlias ?? ''))
    const [orderDir, setOrderDir] = useState<'asc' | 'desc'>(() =>
        useQbState ? (cell._qb_orderDir ?? 'desc') : (parsed?.orderDir ?? 'desc'))
    const [malloyOpen, setMalloyOpen] = useState(false)
    const [copyDone, setCopyDone] = useState(false)
    const [compiling, setCompiling] = useState(false)

    const columns: { name: string; type: string }[] = _duckdbTables?.[selectedTable]?.columns ?? []
    const numericCols = columns.filter(c => {
        const t = c.type.toUpperCase()
        return ['INT','FLOAT','DOUBLE','DECIMAL','NUMERIC','REAL','BIGINT','HUGEINT','UBIGINT'].some(k => t.includes(k))
    })

    useEffect(() => { cell._qb_initialized = true }, [])
    useEffect(() => { cell._qb_dimensions = dimensions }, [dimensions])
    useEffect(() => { cell._qb_measures = measures }, [measures])
    useEffect(() => { cell._qb_nests = nests }, [nests])
    useEffect(() => { cell._qb_filters = filters }, [filters])
    useEffect(() => { cell._qb_limit = limit }, [limit])
    useEffect(() => { cell._qb_orderByAlias = orderByAlias }, [orderByAlias])
    useEffect(() => { cell._qb_orderDir = orderDir }, [orderDir])

    const malloyText = generateMalloy(selectedTable, dimensions, measures, nests, filters, orderByAlias, orderDir, limit)
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
        cell._qb_nests = []
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
            // Auto-alias sauf si l'utilisateur l'a explicitement changé
            if ((upd.fn || upd.field) && !upd.alias) {
                if (next.fn === 'count') next.alias = 'nb_lignes'
                else if (next.fn === 'count_distinct') next.alias = `dist_${next.field}`
                else if (next.fn === 'custom') { /* garder l'alias courant */ }
                else next.alias = `${next.fn}_${next.field}`
            }
            return next
        }))
    }, [])

    const removeMeasure = useCallback((id: string) => {
        // Retirer aussi les références dans les nests
        setMeasures(prev => {
            const removed = prev.find(m => m.id === id)?.alias
            if (removed) setNests(ns => ns.map(n => ({ ...n, measureAliases: n.measureAliases.filter(a => a !== removed) })))
            return prev.filter(m => m.id !== id)
        })
    }, [])

    const addNest = useCallback(() => {
        setNests(prev => [...prev, { id: uid(), alias: `nest_${prev.length + 1}`, dimensions: [], measureAliases: [], limit: 10 }])
    }, [])

    const updateNest = useCallback((id: string, upd: Partial<NestConfig>) => {
        setNests(prev => prev.map(n => n.id === id ? { ...n, ...upd } : n))
    }, [])

    const removeNest = useCallback((id: string) => {
        setNests(prev => prev.filter(n => n.id !== id))
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

                        {/* Mesures */}
                        <div className="border border-border rounded-md overflow-hidden">
                            <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                                    Mesures source <span className="font-normal">(measure:)</span>
                                </span>
                                <button className="text-violet-600 hover:text-violet-700 text-xs font-medium px-1.5 py-0.5 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors" onClick={addMeasure}>+ Ajouter</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto divide-y divide-border">
                                {measures.length === 0 && <div className="text-xs text-muted-foreground italic px-3 py-2">Aucune mesure</div>}
                                {measures.map(m => (
                                    <div key={m.id} className="flex flex-col gap-1 px-2 py-1.5">
                                        <div className="flex items-center gap-1.5">
                                            {/* Fonction */}
                                            <select className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground shrink-0"
                                                value={m.fn} onChange={e => updateMeasure(m.id, { fn: e.target.value as MeasureFn })}>
                                                <option value="count">count()</option>
                                                <option value="count_distinct">count(distinct)</option>
                                                <option value="sum">sum</option>
                                                <option value="avg">avg</option>
                                                <option value="min">min</option>
                                                <option value="max">max</option>
                                                <option value="custom">expression…</option>
                                            </select>
                                            {/* Champ (sauf count et custom) */}
                                            {(m.fn !== 'count' && m.fn !== 'custom') && (
                                                <select className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground flex-1 min-w-0"
                                                    value={m.field} onChange={e => updateMeasure(m.id, { field: e.target.value })}>
                                                    {(m.fn === 'count_distinct' ? columns : (numericCols.length > 0 ? numericCols : columns)).map(c => (
                                                        <option key={c.name} value={c.name}>{c.name}</option>
                                                    ))}
                                                </select>
                                            )}
                                            {/* Alias */}
                                            <input className="text-xs px-1.5 py-0.5 rounded border border-border bg-background text-foreground w-24 font-mono shrink-0"
                                                value={m.alias} onChange={e => updateMeasure(m.id, { alias: e.target.value })} placeholder="alias" title="Identifiant Malloy" />
                                            <button className="text-muted-foreground/50 hover:text-red-500 transition-colors shrink-0" onClick={() => removeMeasure(m.id)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                        {/* Expression custom */}
                                        {m.fn === 'custom' && (
                                            <input className="text-xs px-1.5 py-0.5 rounded border border-violet-300 bg-background text-foreground font-mono w-full"
                                                value={m.customExpr ?? ''} onChange={e => updateMeasure(m.id, { customExpr: e.target.value })}
                                                placeholder="ex: sum(price) / count()" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Nests (sous-requêtes imbriquées) ── */}
                    <div className="border border-border rounded-md overflow-hidden">
                        <div className="px-3 py-2 bg-muted/50 text-xs font-semibold text-muted-foreground border-b border-border flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                Nested queries <span className="font-normal">(nest:)</span>
                                <span className="text-muted-foreground/50 font-normal text-[10px]">— sous-table dans chaque ligne</span>
                            </span>
                            <button className="text-violet-600 hover:text-violet-700 text-xs font-medium px-1.5 py-0.5 rounded hover:bg-violet-100 dark:hover:bg-violet-900 transition-colors" onClick={addNest}>+ Ajouter</button>
                        </div>
                        {nests.length === 0 ? (
                            <div className="text-xs text-muted-foreground italic px-3 py-2">
                                Aucun nest — <button className="text-violet-600 hover:underline" onClick={addNest}>ajouter une sous-requête</button>
                            </div>
                        ) : (
                            <div className="p-2 flex flex-col gap-2">
                                {nests.map(n => (
                                    <NestEditor key={n.id} nest={n} columns={columns} measures={measures}
                                        onChange={upd => updateNest(n.id, upd)}
                                        onRemove={() => removeNest(n.id)} />
                                ))}
                            </div>
                        )}
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
                        scrollbar: { vertical: 'hidden', alwaysConsumeMouseWheel: false },
                        automaticLayout: true,
                    }}
                    onMount={(editor) => {
                        const MIN_H = 80
                        const MAX_H = 600
                        const update = () => {
                            const h = Math.min(MAX_H, Math.max(MIN_H, editor.getContentHeight()))
                            editor.getDomNode()!.style.height = h + 'px'
                            editor.layout()
                        }
                        update()
                        editor.onDidContentSizeChange(update)
                    }}
                    height="80px"
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
