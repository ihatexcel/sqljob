// @ts-nocheck
/**
 * SqlBlockEditor — Éditeur visuel pour les cellules de type sqlBlock.
 *
 * Architecture : sql <-> ast <-> ui
 * L'AST est la source de vérité. Le SQL est généré depuis l'AST (ou édité
 * manuellement en mode dégradé). Toute modification UI met à jour l'AST puis
 * régénère le SQL.
 *
 * Colonnes par étape : dérivées statiquement depuis l'AST + source DuckDB.
 * Aperçu par étape (œil) : table DuckDB temporaire _sb_<cellId>_s<i> LIMIT 10.
 *   → Seules les étapes dont les prédécesseurs ont changé sont recalculées.
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { SqlMonacoEditor } from '@sqlrooms/sql-editor'
import { useShallow } from 'zustand/react/shallow'
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@sqlrooms/ui'
import { useNotebookStore } from '../../store/notebookStore'
import { DuckDBManager } from '../../../lib/DuckDBManager'
import { CDNManager } from '../../../lib/CDNManager'
import {
    astToSql,
    sqlToAst,
    sqlToAstSmart,
    getEffectiveSql,
    generateMaterializeQuery,
    buildDisplaySql,
    stripMaterializePrefix,
    stepSql,
    quoteId,
    getAutoCteName,
} from '../../../lib/SqlBlockService'
import { ChartConfigEditor } from './ChartConfigEditor'
import type { ChartConfig } from '../../../lib/SqlBlockTypes'
import {
    DUCKDB_TYPES,
    STEP_LABELS,
    STEP_CATEGORIES,
    createDefaultSqlBlockConfig,
} from '../../../lib/SqlBlockTypes'
import type {
    SqlBlockConfig,
    SqlBlockAst,
    SqlBlockStep,
    SelectColumnsStep,
    ExcludeColumnsStep,
    ChangeTypeStep,
    FilterRowsStep,
    FilterGroup,
    FilterItem,
    FilterCondition,
    FilterOp,
    SortStep,
    SortKey,
    TopNStep,
    RenameColumnsStep,
    DeriveStep,
    FillNullStep,
    GroupByStep,
    Aggregation,
    JoinStep,
    JoinCondition,
    UnionStep,
    PivotStep,
    UnpivotStep,
    WindowStep,
    WindowColumn,
    UnnestStep,
    JsonExtractStep,
    DateTruncStep,
    CustomSqlStep,
    SqlBlockMaterialize,
} from '../../../lib/SqlBlockTypes'
import { SqlDataTable } from '../SqlDataTable'

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Retourne queries[0] (avec migration depuis cell.json si nécessaire). */
function getOrInitConfig(cell: any): SqlBlockConfig {
    if (!cell.queries?.length) {
        cell.queries = [{ name: 'main', sql: '', engine: 'sql', clientVisible: false }]
    }
    const q = cell.queries[0]
    // Migration depuis cell.json (anciens sqlBlock)
    if (cell.json?.ast && !q.ast) {
        q.ast = cell.json.ast
        q.degraded = cell.json.degraded ?? false
        q.manualSql = cell.json.manualSql ?? null
        delete cell.json
    }
    if (!q.ast) q.ast = { source: '', steps: [], materialize: cell.materialize ?? 'select' }
    if (q.degraded === undefined) q.degraded = false
    if (q.manualSql === undefined) q.manualSql = null
    return q
}

function commitAstUpdate(cell: any, newAst: Partial<SqlBlockAst>, forceUpdate: () => void) {
    const cfg = getOrInitConfig(cell)
    cfg.ast = { ...cfg.ast, ...newAst }
    cfg.degraded = false
    cfg.manualSql = null
    // Stocker le SQL avec DDL si view/table — cohérent avec l'éditeur SQL en mode non-UI
    // L'exécution stripe le préfixe DDL avant de ré-appliquer via cell.materialize
    const selectSql = astToSql(cfg.ast)
    cfg.sql = buildDisplaySql(cell.name, selectSql, cfg.ast.materialize ?? 'select')
    // Sync cell.materialize avec l'AST
    if (newAst.materialize !== undefined) cell.materialize = newAst.materialize
    forceUpdate()
}

// ─── computeStepSchemas ───────────────────────────────────────────────────────
// Dérive statiquement le schéma INPUT de chaque étape (colonnes/types disponibles
// en entrée de l'étape i = sortie de l'étape i-1).

interface StepSchema {
    columns: string[]
    colTypes: Record<string, string>
}

function applyStepToSchema(step: SqlBlockStep, cols: string[], types: Record<string, string>): { cols: string[]; types: Record<string, string> } {
    switch (step.type) {
        case 'select_columns': {
            if (!step.columns.length) return { cols, types }
            const kept = step.columns.filter(c => cols.includes(c))
            return { cols: kept, types: Object.fromEntries(kept.map(c => [c, types[c] ?? ''])) }
        }
        case 'exclude_columns': {
            const excl = new Set(step.columns)
            const c2 = cols.filter(c => !excl.has(c))
            return { cols: c2, types: Object.fromEntries(c2.map(c => [c, types[c] ?? ''])) }
        }
        case 'change_type': {
            const t2 = { ...types }
            step.changes.forEach(ch => { t2[ch.column] = ch.targetType })
            return { cols, types: t2 }
        }
        case 'filter_rows':
        case 'sort':
        case 'top_n':
        case 'fill_null':
        case 'union':
            return { cols, types }
        case 'rename_columns': {
            const c2 = [...cols]; const t2 = { ...types }
            step.renames.forEach(r => {
                const i = c2.indexOf(r.from); if (i < 0) return
                c2[i] = r.to; t2[r.to] = t2[r.from] ?? ''; delete t2[r.from]
            })
            return { cols: c2, types: t2 }
        }
        case 'derive': {
            const c2 = [...cols]; const t2 = { ...types }
            step.columns.forEach(col => {
                if (!c2.includes(col.name)) c2.push(col.name)
                t2[col.name] = ''
            })
            return { cols: c2, types: t2 }
        }
        case 'group_by': {
            const c2 = [...step.groupCols, ...step.aggregations.map(a => a.alias)]
            const t2: Record<string, string> = {}
            step.groupCols.forEach(c => { t2[c] = types[c] ?? '' })
            step.aggregations.forEach(a => {
                t2[a.alias] = ['count','count_distinct'].includes(a.fn) ? 'BIGINT'
                    : ['sum','avg','mean','median','stddev'].includes(a.fn) ? 'DOUBLE'
                    : a.fn === 'string_agg' ? 'VARCHAR' : (types[a.column] ?? '')
            })
            return { cols: c2, types: t2 }
        }
        case 'join': {
            const right = step.selectRight === '*' ? [] : step.selectRight
            const c2 = [...cols, ...right.filter(c => !cols.includes(c))]
            const t2 = { ...types }; right.forEach(c => { if (!t2[c]) t2[c] = '' })
            return { cols: c2, types: t2 }
        }
        case 'pivot':
            return { cols: [...step.groupCols], types: Object.fromEntries(step.groupCols.map(c => [c, types[c] ?? ''])) }
        case 'unpivot': {
            const excl = new Set(step.columns)
            const rem = cols.filter(c => !excl.has(c))
            return { cols: [...rem, step.nameCol, step.valueCol], types: { ...Object.fromEntries(rem.map(c => [c, types[c] ?? ''])), [step.nameCol]: 'VARCHAR', [step.valueCol]: '' } }
        }
        case 'window': {
            const c2 = [...cols, ...step.columns.map(w => w.alias)]
            const t2 = { ...types }; step.columns.forEach(w => { t2[w.alias] = '' })
            return { cols: c2, types: t2 }
        }
        case 'unnest':
            return { cols: [...cols, step.alias], types: { ...types, [step.alias]: '' } }
        case 'json_extract': {
            const c2 = [...cols, ...step.extractions.map(e => e.alias)]
            const t2 = { ...types }; step.extractions.forEach(e => { t2[e.alias] = e.targetType ?? 'VARCHAR' })
            return { cols: c2, types: t2 }
        }
        case 'date_trunc': {
            if (step.mode === 'replace') return { cols, types: { ...types, [step.column]: 'TIMESTAMP' } }
            const alias = step.alias || `${step.column}_${step.granularity}`
            return { cols: [...cols, alias], types: { ...types, [alias]: 'TIMESTAMP' } }
        }
        default:
            // custom_sql ou type inconnu : schéma non dérivable statiquement, on conserve l'entrée
            return { cols, types }
    }
}

function computeStepSchemas(
    ast: SqlBlockAst,
    sourceColumns: { name: string; type: string }[]
): StepSchema[] {
    const schemas: StepSchema[] = []
    let cols = sourceColumns.map(c => c.name)
    let types: Record<string, string> = Object.fromEntries(sourceColumns.map(c => [c.name, c.type]))
    for (const step of ast.steps) {
        schemas.push({ columns: [...cols], colTypes: { ...types } })
        const next = applyStepToSchema(step, cols, types)
        cols = next.cols; types = next.types
    }
    return schemas
}

// ─── useStepEyeData ───────────────────────────────────────────────────────────
// Gère les tables DuckDB intermédiaires _sqlblock."sb_<cellId>_s<i>".
// Hash-based : seules les étapes dont les prédécesseurs ont changé sont recalculées.
// Matérialisation proactive : toutes les étapes sont pré-calculées en arrière-plan
// dès que l'AST ou la source changent.

interface EyeEntry {
    rows: Record<string, any>[]
    schemaTypes: Record<string, string>
    hash: string
}

const SQLBLOCK_SCHEMA = '_sqlblock'
const SUBCELL_LIMIT = 50   // lignes dans les tables intermédiaires
let sqlblockSchemaEnsured = false

/** Appelé à la fermeture de la modale UI SQL pour dropper tout le schéma _sqlblock. */
export async function dropSqlblockSchema() {
    try {
        await DuckDBManager.executeQuery(`DROP SCHEMA IF EXISTS "${SQLBLOCK_SCHEMA}" CASCADE`)
    } catch { /* ignore */ }
    sqlblockSchemaEnsured = false
}

async function ensureSqlblockSchema() {
    if (sqlblockSchemaEnsured) return
    await DuckDBManager.executeQuery(`CREATE SCHEMA IF NOT EXISTS "${SQLBLOCK_SCHEMA}"`)
    sqlblockSchemaEnsured = true
}

/** Nom de la table temp DuckDB pour le step idx d'une cellule. */
function makeTableRef(cellId: string, idx: number): string {
    const safeId = cellId.replace(/[^a-zA-Z0-9]/g, '_')
    const name = `sb_${safeId}_s${idx < 0 ? 'src' : idx}`
    return `"${SQLBLOCK_SCHEMA}"."${name}"`
}

function useStepEyeData(cell: any, ast: SqlBlockAst, modalOpen?: boolean) {
    const [eyeOpen, setEyeOpenState] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [, bumpRender] = useState(0)

    // Accès direct au store pour appeler refreshDuckdbSchema après matérialisation
    const refreshDuckdbSchema = useNotebookStore(s => s.refreshDuckdbSchema)

    // Refs pour accéder aux valeurs fraîches sans stale-closure
    const astRef = useRef(ast)
    astRef.current = ast
    const cellRef = useRef(cell)
    cellRef.current = cell
    const eyeOpenRef = useRef<number | null>(null)

    // Cache : stepIndex → résultats + hash upstream
    const cache = useRef<Map<number, EyeEntry>>(new Map())

    function getHash(idx: number): string {
        const a = astRef.current
        return JSON.stringify({ src: a.source, steps: a.steps.slice(0, idx + 1) })
    }

    const cellTableRef = (idx: number) => makeTableRef(cellRef.current._id, idx)

    /**
     * Matérialise le step idx dans une table temp DuckDB.
     * Toujours créée en TABLE avec LIMIT, indépendamment de ast.materialize.
     * On append simplement LIMIT N à la fin du SQL généré (CTE ou SELECT plat),
     * sans wrapper subquery qui pose problème avec les CTEs inline dans DuckDB WASM.
     */
    async function doLoad(idx: number, silent = false) {
        const hash = getHash(idx)
        if (cache.current.get(idx)?.hash === hash) return  // Cache valide

        if (!silent) setLoading(true)
        try {
            await ensureSqlblockSchema()
            const a = astRef.current
            if (!a.source && !a.steps?.length) return
            const tRef = cellTableRef(idx)
            // Toujours sans chartConfig : la table temp doit contenir les données brutes,
            // pas les colonnes annotées CAST(x AS XAXIS) du SELECT de visualisation.
            const sql = stepSql({ ...a, chartConfig: undefined }, idx)
            if (!sql) return
            // Append LIMIT directement — fonctionne pour SELECT plat et CTE chain.
            // On strip un éventuel ; final et on n'ajoute pas de second LIMIT si déjà présent.
            const bare = sql.trimEnd().replace(/;+\s*$/, '')
            const hasLimit = /\bLIMIT\s+\d/i.test(bare.replace(/\([\s\S]*?\)/g, ''))
            // Même pattern que generateMaterializeQuery : sql enveloppé dans des parenthèses.
            // Le LIMIT est injecté à l'intérieur avant de fermer la parenthèse.
            const innerSql = hasLimit ? bare : `${bare}\nLIMIT ${SUBCELL_LIMIT}`
            await DuckDBManager.executeQuery(
                `CREATE OR REPLACE TABLE ${tRef} AS (\n${innerSql}\n)`
            )
            const conn = DuckDBManager.getConnection()
            const result = await conn.query(`SELECT * FROM ${tRef}`)
            const rows = result.toArray().map((row: any) => Object.fromEntries(row))
            const schemaTypes: Record<string, string> = {}
            for (const field of result.schema.fields) {
                schemaTypes[field.name] = String(field.type)
            }
            cache.current.set(idx, { rows, schemaTypes, hash })
            bumpRender(n => n + 1)
        } catch (err) {
            console.error('[sqlblock eye]', err)
        } finally {
            if (!silent) setLoading(false)
        }
    }

    function toggleEye(idx: number) {
        const next = eyeOpenRef.current === idx ? null : idx
        eyeOpenRef.current = next
        setEyeOpenState(next)
        if (next !== null) doLoad(next)
    }

    // ── Matérialisation proactive en arrière-plan ─────────────────────────
    // Dès que la source ou les steps changent, on (re)matérialise toutes les
    // étapes séquentiellement (silent=true → pas de spinner global).
    // Résultat : eye instant, schéma toujours à jour, indépendant du mode VIEW/TABLE.
    // modalOpen inclus dans bgKey pour forcer le re-run à chaque ouverture
    const bgKey = JSON.stringify({ src: ast.source, steps: ast.steps, open: !!modalOpen })
    useEffect(() => {
        if (!modalOpen) return  // Ne matérialiser que quand la modale est visible
        if (!ast.source && !ast.steps.length) return
        let cancelled = false
        const run = async () => {
            await ensureSqlblockSchema()
            for (let i = 0; i < astRef.current.steps.length; i++) {
                if (cancelled) break
                await doLoad(i, true)   // silent : pas de setLoading
            }
            // Rafraîchir le schéma DuckDB affiché dans le layout (panel + autocomplete)
            if (!cancelled) {
                try { await refreshDuckdbSchema?.() } catch { /* ignore */ }
            }
        }
        run()
        return () => { cancelled = true }
    }, [bgKey])     // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-refresh si l'œil est ouvert et que les prédécesseurs changent
    const upstreamKey = eyeOpen !== null
        ? JSON.stringify([ast.source, ...ast.steps.slice(0, eyeOpen + 1)])
        : null

    useEffect(() => {
        if (eyeOpen === null) return
        doLoad(eyeOpen)
    }, [upstreamKey, eyeOpen])  // eslint-disable-line react-hooks/exhaustive-deps

    return {
        eyeOpen,
        toggleEye,
        loading,
        getEyeData: (idx: number): EyeEntry | null => cache.current.get(idx) ?? null,
        cellTableRef,
    }
}

// ─── Icônes SVG inline ────────────────────────────────────────────────────────

function EyeIcon({ open, className = '' }: { open: boolean; className?: string }) {
    return open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
        </svg>
    )
}

// ─── ColumnCheckbox ───────────────────────────────────────────────────────────

function ColumnCheckbox({ col, checked, onChange }: { col: string; checked: boolean; onChange: (c: string, v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer px-2 py-0.5 rounded hover:bg-muted/50">
            <input type="checkbox" className="rounded border-border w-3.5 h-3.5 accent-primary"
                checked={checked} onChange={e => onChange(col, e.target.checked)} />
            <span className="text-xs font-mono text-foreground">{col}</span>
        </label>
    )
}

// ─── SelectColumnsStepUI ──────────────────────────────────────────────────────

function SelectColumnsStepUI({ step, availableCols, onChange }: {
    step: SelectColumnsStep; availableCols: string[]
    onChange: (s: SelectColumnsStep) => void
}) {
    const all = availableCols.length > 0 ? availableCols : step.columns
    const selected = new Set(step.columns)
    const toggle = (col: string, checked: boolean) => onChange({
        ...step,
        columns: checked
            ? [...step.columns, col].filter((c, i, a) => a.indexOf(c) === i)
            : step.columns.filter(c => c !== col),
    })
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <button onClick={() => onChange({ ...step, columns: [...all] })} className="underline hover:text-foreground">tout</button>
                <span>/</span>
                <button onClick={() => onChange({ ...step, columns: [] })} className="underline hover:text-foreground">aucun</button>
                <span className="ml-auto">{step.columns.length}/{all.length} col.</span>
            </div>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0 border border-border rounded bg-background">
                {all.length === 0 && <p className="text-xs text-muted-foreground p-2 italic">Aucune colonne — exécutez la source</p>}
                {all.map(col => <ColumnCheckbox key={col} col={col} checked={selected.has(col)} onChange={toggle} />)}
            </div>
        </div>
    )
}

// ─── ExcludeColumnsStepUI ─────────────────────────────────────────────────────

function ExcludeColumnsStepUI({ step, availableCols, onChange }: {
    step: ExcludeColumnsStep; availableCols: string[]
    onChange: (s: ExcludeColumnsStep) => void
}) {
    const all = availableCols.length > 0 ? availableCols : step.columns
    const excluded = new Set(step.columns)
    const toggle = (col: string, checked: boolean) => onChange({
        ...step,
        columns: checked
            ? [...step.columns, col].filter((c, i, a) => a.indexOf(c) === i)
            : step.columns.filter(c => c !== col),
    })
    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground mb-1">
                Colonnes à exclure ({step.columns.length} sélectionnée{step.columns.length !== 1 ? 's' : ''})
            </p>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0 border border-border rounded bg-background">
                {all.length === 0 && <p className="text-xs text-muted-foreground p-2 italic">Aucune colonne — exécutez la source</p>}
                {all.map(col => <ColumnCheckbox key={col} col={col} checked={excluded.has(col)} onChange={toggle} />)}
            </div>
        </div>
    )
}

// ─── ChangeTypeStepUI ─────────────────────────────────────────────────────────

function ChangeTypeStepUI({ step, availableCols, availableColTypes, onChange }: {
    step: ChangeTypeStep; availableCols: string[]; availableColTypes: Record<string, string>
    onChange: (s: ChangeTypeStep) => void
}) {
    const [addCol, setAddCol] = useState('')
    const [addType, setAddType] = useState('VARCHAR')
    const allCols = availableCols.length > 0 ? availableCols : step.changes.map(c => c.column)

    return (
        <div className="flex flex-col gap-0 divide-y divide-border">
            {step.changes.map((change, idx) => (
                <div key={idx} className="flex flex-col gap-1 py-2 first:pt-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground shrink-0 w-4">col</span>
                        <select className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                            value={change.column}
                            onChange={e => onChange({ ...step, changes: step.changes.map((c, i) => i === idx ? { ...c, column: e.target.value } : c) })}>
                            {allCols.map(c => <option key={c} value={c}>{c}</option>)}
                            {!allCols.includes(change.column) && <option value={change.column}>{change.column}</option>}
                        </select>
                        <MoveBtns onUp={idx > 0 ? () => onChange({ ...step, changes: moveArr(step.changes, idx, -1) }) : undefined} onDown={idx < step.changes.length - 1 ? () => onChange({ ...step, changes: moveArr(step.changes, idx, 1) }) : undefined} />
                        <button onClick={() => onChange({ ...step, changes: step.changes.filter((_, i) => i !== idx) })}
                            className="shrink-0 text-destructive hover:text-destructive/80 w-5 h-5 flex items-center justify-center">✕</button>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground shrink-0 w-4">→</span>
                        <select className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                            value={change.targetType}
                            onChange={e => onChange({ ...step, changes: step.changes.map((c, i) => i === idx ? { ...c, targetType: e.target.value } : c) })}>
                            {DUCKDB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="shrink-0 w-5" />
                    </div>
                </div>
            ))}
            <div className="flex flex-col gap-1.5 pt-2">
                <select className="w-full h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                    value={addCol} onChange={e => setAddCol(e.target.value)}>
                    <option value="">— choisir une colonne —</option>
                    {allCols.map(c => <option key={c} value={c}>{c}{availableColTypes[c] ? ` (${availableColTypes[c]})` : ''}</option>)}
                </select>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground shrink-0 w-4">→</span>
                    <select className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                        value={addType} onChange={e => setAddType(e.target.value)}>
                        {DUCKDB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button onClick={() => { if (!addCol) return; onChange({ ...step, changes: [...step.changes, { column: addCol, targetType: addType }] }); setAddCol('') }}
                        disabled={!addCol}
                        className="shrink-0 px-2 h-6 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50 whitespace-nowrap">
                        + Ajouter
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Helpers UI partagés ──────────────────────────────────────────────────────

function ColSelect({ value, cols, onChange, placeholder = '— colonne —', className = '' }: { value: string; cols: string[]; onChange: (v: string) => void; placeholder?: string; className?: string }) {
    return (
        <select className={`h-6 rounded border border-border bg-background px-1 text-xs font-mono ${className}`} value={value} onChange={e => onChange(e.target.value)}>
            <option value="">{placeholder}</option>
            {cols.map(c => <option key={c} value={c}>{c}</option>)}
            {value && !cols.includes(value) && <option value={value}>{value}</option>}
        </select>
    )
}

function TxtInput({ value, onChange, placeholder = '', className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
    return <input type="text" className={`h-6 rounded border border-border bg-background px-1.5 text-xs font-mono ${className}`} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
}

function AddRowBtn({ onClick, label = '+ Ajouter' }: { onClick: () => void; label?: string }) {
    return <button onClick={onClick} className="flex items-center gap-1 text-xs text-primary hover:underline mt-1">{label}</button>
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick} className="shrink-0 text-destructive hover:text-destructive/70 w-4 h-4 flex items-center justify-center text-xs leading-none">✕</button>
}

function MoveBtns({ onUp, onDown }: { onUp?: () => void; onDown?: () => void }) {
    const btn = (label: string, handler?: () => void) => (
        <button onClick={handler} disabled={!handler}
            className={`w-3.5 h-3.5 flex items-center justify-center text-[9px] rounded leading-none transition-colors
                ${handler ? 'text-muted-foreground hover:bg-muted hover:text-foreground' : 'text-muted-foreground/25 cursor-default'}`}>
            {label}
        </button>
    )
    return (
        <div className="flex flex-col shrink-0 self-center gap-px">
            {btn('▲', onUp)}
            {btn('▼', onDown)}
        </div>
    )
}

// ─── P1 step UIs ──────────────────────────────────────────────────────────────

const FILTER_OPS: { op: FilterOp; label: string }[] = [
    { op: '=', label: '=' }, { op: '!=', label: '≠' },
    { op: '>', label: '>' }, { op: '<', label: '<' },
    { op: '>=', label: '≥' }, { op: '<=', label: '≤' },
    { op: 'in', label: 'IN' }, { op: 'not_in', label: 'NOT IN' },
    { op: 'is_null', label: 'IS NULL' }, { op: 'not_null', label: 'NOT NULL' },
    { op: 'like', label: 'LIKE' }, { op: 'ilike', label: 'ILIKE' },
    { op: 'between', label: 'BETWEEN' },
]

const DISTINCT_INITIAL_SELECT_LIMIT = 100
const DISTINCT_INITIAL_FROM_LIMIT = 10000

/** Dropdown distinct values — mono (=, between) ou multi (IN, NOT IN) */
function DistinctDropdown({ multi = false, value = '', onChangeSingle, values = [], onChangeMulti, column, fetchDistinctValues, placeholder = 'valeur', className = '' }: {
    multi?: boolean
    value?: string; onChangeSingle?: (v: string) => void
    values?: string[]; onChangeMulti?: (v: string[]) => void
    column: string
    fetchDistinctValues?: (col: string, selectLimit: number, fromLimit: number) => Promise<{ values: string[]; hasMore: boolean }>
    placeholder?: string; className?: string
}) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [distinctValues, setDistinctValues] = useState<string[]>([])
    const [hasMore, setHasMore] = useState(false)
    // loading = chargement initial (liste vide), refreshing = rechargement (garde la liste)
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [selectLim, setSelectLim] = useState(DISTINCT_INITIAL_SELECT_LIMIT)
    const [fromLim, setFromLim] = useState(DISTINCT_INITIAL_FROM_LIMIT)
    const wrapRef = useRef<HTMLDivElement>(null)

    async function load(sl: number, fl: number, isInitial = false) {
        if (!fetchDistinctValues || !column) return
        if (isInitial) setLoading(true); else setRefreshing(true)
        try {
            const res = await fetchDistinctValues(column, sl, fl)
            setDistinctValues(res.values)
            setHasMore(res.hasMore)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (open) {
            setDistinctValues([])
            setSelectLim(DISTINCT_INITIAL_SELECT_LIMIT)
            setFromLim(DISTINCT_INITIAL_FROM_LIMIT)
            load(DISTINCT_INITIAL_SELECT_LIMIT, DISTINCT_INITIAL_FROM_LIMIT, true)
        }
    }, [open, column])

    useEffect(() => {
        if (!open) return
        function onMouseDown(e: MouseEvent) {
            if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', onMouseDown)
        return () => document.removeEventListener('mousedown', onMouseDown)
    }, [open])

    function handleLoadMore(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        const newSl = selectLim === 0 ? 0 : selectLim * 2
        const newFl = fromLim === 0 ? 0 : fromLim * 10
        setSelectLim(newSl); setFromLim(newFl)
        load(newSl, newFl)
    }

    function handleLoadAll(e: React.MouseEvent) {
        e.preventDefault(); e.stopPropagation()
        setSelectLim(0); setFromLim(0)
        load(0, 0)
    }

    function toggle(v: string) {
        onChangeMulti?.(values.includes(v) ? values.filter(x => x !== v) : [...values, v])
    }

    const filtered = multi
        ? distinctValues.filter(v => !search || v.toLowerCase().includes(search.toLowerCase()))
        : distinctValues.filter(v => !value || v.toLowerCase().includes(value.toLowerCase()))

    return (
        <div ref={wrapRef} className={`relative ${className}`}>
            {/* Déclencheur */}
            {multi ? (
                <div className="min-h-6 flex flex-wrap gap-0.5 items-center rounded border border-border bg-background px-1.5 py-0.5 cursor-pointer text-xs"
                    onClick={() => setOpen(o => !o)}>
                    {values.length === 0
                        ? <span className="text-muted-foreground italic">Sélectionner…</span>
                        : values.map(v => (
                            <span key={v} className="inline-flex items-center gap-0.5 bg-primary/15 text-primary rounded px-1 py-0 font-mono">
                                {v}
                                <button className="hover:text-destructive leading-none"
                                    onMouseDown={e => { e.stopPropagation(); toggle(v) }}>×</button>
                            </span>
                        ))}
                </div>
            ) : (
                <input type="text"
                    className="w-full h-6 rounded border border-border bg-background px-1.5 text-xs font-mono"
                    value={value} onChange={e => onChangeSingle?.(e.target.value)}
                    placeholder={placeholder}
                    onFocus={() => fetchDistinctValues && setOpen(true)} />
            )}

            {/* Dropdown panel */}
            {open && fetchDistinctValues && (
                <div className="absolute z-50 mt-0.5 left-0 right-0 bg-popover border border-border rounded shadow-lg flex flex-col max-h-56 text-xs"
                    onClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}>
                    {/* Recherche + coche tout/rien (multi seulement) */}
                    {multi && (
                        <div className="px-2 py-1 border-b border-border flex items-center gap-1.5">
                            <input autoFocus className="flex-1 h-5 bg-transparent outline-none placeholder:text-muted-foreground min-w-0"
                                placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} />
                            {filtered.length > 0 && (() => {
                                const allChecked = filtered.every(v => values.includes(v))
                                const someChecked = !allChecked && filtered.some(v => values.includes(v))
                                return (
                                    <button
                                        className="shrink-0 w-4 h-4 flex items-center justify-center rounded border border-border hover:bg-muted"
                                        title={allChecked ? 'Désélectionner tout l\'affiché' : 'Sélectionner tout l\'affiché'}
                                        onMouseDown={e => {
                                            e.preventDefault()
                                            if (allChecked) {
                                                onChangeMulti?.(values.filter(v => !filtered.includes(v)))
                                            } else {
                                                const toAdd = filtered.filter(v => !values.includes(v))
                                                onChangeMulti?.([...values, ...toAdd])
                                            }
                                        }}>
                                        <span className={`text-[10px] leading-none ${allChecked ? 'text-primary' : someChecked ? 'text-primary/50' : 'text-muted-foreground'}`}>
                                            {allChecked ? '✓' : someChecked ? '–' : '☐'}
                                        </span>
                                    </button>
                                )
                            })()}
                        </div>
                    )}
                    {/* Liste */}
                    <div className="overflow-y-auto flex-1">
                        {loading && <div className="px-2 py-1 text-muted-foreground italic">Chargement…</div>}
                        {!loading && filtered.length === 0 && <div className="px-2 py-1 text-muted-foreground italic">Aucune valeur</div>}
                        {!loading && filtered.map(v => multi ? (
                            <button key={v}
                                className={`w-full text-left px-2 py-0.5 flex items-center gap-1.5 hover:bg-muted ${values.includes(v) ? 'font-medium text-primary' : ''}`}
                                onMouseDown={e => { e.preventDefault(); toggle(v) }}>
                                <span className="w-3 shrink-0">{values.includes(v) ? '✓' : ''}</span>
                                <span className="truncate font-mono">{v}</span>
                            </button>
                        ) : (
                            <button key={v} className="w-full text-left px-2 py-0.5 hover:bg-muted truncate font-mono"
                                onMouseDown={e => { e.preventDefault(); onChangeSingle?.(v); setOpen(false) }}>
                                {v}
                            </button>
                        ))}
                    </div>
                    {/* Footer */}
                    <div className="border-t border-border px-2 py-0.5 flex items-center gap-2 text-muted-foreground shrink-0">
                        <span className="text-[10px]">{filtered.length} valeur{filtered.length !== 1 ? 's' : ''}</span>
                        {multi && values.length > 0 && (
                            <span className="text-[10px] text-primary">{values.length} sélectionnée{values.length > 1 ? 's' : ''}</span>
                        )}
                        {refreshing && <span className="text-[10px] italic ml-1">Chargement…</span>}
                        {!loading && hasMore && (
                            <>
                                <button className="ml-auto text-primary hover:underline font-medium" onMouseDown={handleLoadMore}>Charger plus…</button>
                                <button className="text-primary hover:underline font-medium" onMouseDown={handleLoadAll}>Tout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function DistinctValueInput({ value, onChange, column, fetchDistinctValues, placeholder = 'valeur', className = '' }: {
    value: string; onChange: (v: string) => void
    column: string
    fetchDistinctValues?: (col: string, selectLimit: number, fromLimit: number) => Promise<{ values: string[]; hasMore: boolean }>
    placeholder?: string; className?: string
}) {
    return <DistinctDropdown value={value} onChangeSingle={onChange} column={column} fetchDistinctValues={fetchDistinctValues} placeholder={placeholder} className={className} />
}

function DistinctMultiInput({ values, onChange, column, fetchDistinctValues, className = '' }: {
    values: string[]; onChange: (v: string[]) => void
    column: string
    fetchDistinctValues?: (col: string, selectLimit: number, fromLimit: number) => Promise<{ values: string[]; hasMore: boolean }>
    className?: string
}) {
    return <DistinctDropdown multi values={values} onChangeMulti={onChange} column={column} fetchDistinctValues={fetchDistinctValues} className={className} />
}

function FilterConditionRow({ cond, availableCols, onChange, onRemove, onMoveUp, onMoveDown, fetchDistinctValues }: {
    cond: FilterCondition; availableCols: string[]
    onChange: (patch: Partial<FilterCondition>) => void
    onRemove: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
    fetchDistinctValues?: (col: string, selectLimit: number, fromLimit: number) => Promise<{ values: string[]; hasMore: boolean }>
}) {
    const noVal = cond.op === 'is_null' || cond.op === 'not_null'
    const isBetween = cond.op === 'between'
    const isMulti = cond.op === 'in' || cond.op === 'not_in'
    return (
        <div className="flex flex-wrap items-center gap-1">
            <ColSelect value={cond.column} cols={availableCols} onChange={v => onChange({ column: v })} className="flex-1 min-w-20" />
            <select className="h-6 rounded border border-border bg-background px-1 text-xs w-24" value={cond.op} onChange={e => {
                const newOp = e.target.value as FilterOp
                const wasMulti = cond.op === 'in' || cond.op === 'not_in'
                const isNowMulti = newOp === 'in' || newOp === 'not_in'
                const patch: Partial<FilterCondition> = { op: newOp }
                if (!wasMulti && isNowMulti && cond.value) patch.values = [cond.value]
                if (wasMulti && !isNowMulti && cond.values?.length) patch.value = cond.values[0]
                onChange(patch)
            }}>
                {FILTER_OPS.map(o => <option key={o.op} value={o.op}>{o.label}</option>)}
            </select>
            {!noVal && !isBetween && !isMulti && (
                <DistinctValueInput
                    value={cond.value ?? ''}
                    onChange={v => onChange({ value: v })}
                    column={cond.column}
                    fetchDistinctValues={fetchDistinctValues}
                    placeholder="valeur"
                    className="flex-1 min-w-16"
                />
            )}
            {isBetween && <>
                <DistinctValueInput value={cond.value ?? ''} onChange={v => onChange({ value: v })} column={cond.column} fetchDistinctValues={fetchDistinctValues} placeholder="de" className="w-20" />
                <span className="text-xs text-muted-foreground">et</span>
                <DistinctValueInput value={cond.valueTo ?? ''} onChange={v => onChange({ valueTo: v })} column={cond.column} fetchDistinctValues={fetchDistinctValues} placeholder="à" className="w-20" />
            </>}
            {isMulti && (
                <DistinctMultiInput
                    values={cond.values ?? []}
                    onChange={v => onChange({ values: v })}
                    column={cond.column}
                    fetchDistinctValues={fetchDistinctValues}
                    className="flex-1 min-w-32"
                />
            )}
            <MoveBtns onUp={onMoveUp} onDown={onMoveDown} />
            <RemoveBtn onClick={onRemove} />
        </div>
    )
}

/** Badge AND/OR horizontal séparateur entre groupes de premier niveau */
function LogicOpBadge({ op, onChange }: { op: 'AND' | 'OR'; onChange: (op: 'AND' | 'OR') => void }) {
    return (
        <div className="flex items-center gap-1 my-0.5">
            <div className="flex-1 h-px bg-border" />
            <div className="flex rounded border border-border overflow-hidden text-xs">
                {(['AND', 'OR'] as const).map(o => (
                    <button key={o} onClick={() => onChange(o)}
                        className={`px-2 py-0.5 transition-colors ${op === o ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                        {o}
                    </button>
                ))}
            </div>
            <div className="flex-1 h-px bg-border" />
        </div>
    )
}

/** Normalise un FilterGroup vers le format items[] */
function normalizeFilterGroup(g: FilterGroup): FilterGroup {
    if (g.items !== undefined) return g
    // rétrocompat ancien format conditions[]
    return {
        items: (g.conditions ?? []).map(c => ({ kind: 'cond' as const, cond: c })),
        logicOp: g.logicOp ?? 'AND',
        negate: g.negate,
    }
}

/** Couleurs de border selon profondeur */
const GROUP_DEPTH_COLORS = [
    'border-border',
    'border-blue-500/40',
    'border-purple-500/40',
    'border-amber-500/40',
]

/** Composant récursif : affiche un groupe avec ses items (conditions + sous-groupes) */
function moveArr(arr: any[], i: number, delta: number) {
    const next = [...arr]
    const j = i + delta
    if (j < 0 || j >= next.length) return next
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
}

function FilterGroupUI({ group, onUpdate, onRemove, onMoveUp, onMoveDown, availableCols, depth = 0, fetchDistinctValues }: {
    group: FilterGroup
    onUpdate: (g: FilterGroup) => void
    onRemove?: () => void
    onMoveUp?: () => void
    onMoveDown?: () => void
    availableCols: string[]
    depth?: number
    fetchDistinctValues?: (col: string, limit: number) => Promise<{ values: string[]; hasMore: boolean }>
}) {
    const g = normalizeFilterGroup(group)
    const items = g.items ?? []
    const borderCls = GROUP_DEPTH_COLORS[Math.min(depth, GROUP_DEPTH_COLORS.length - 1)]

    function setItems(newItems) {
        onUpdate({ ...g, items: newItems })
    }

    function addCond() {
        setItems([...items, { kind: 'cond', cond: { column: availableCols[0] ?? '', op: '=', value: '' } }])
    }

    function addSubgroup() {
        setItems([...items, { kind: 'group', group: { items: [], logicOp: 'AND', negate: false } }])
    }

    return (
        <div className={`border ${borderCls} rounded p-2 flex flex-col gap-1`}>
            {/* En-tête du groupe : AND/OR | NOT | ▲▼ | ✕ */}
            <div className="flex items-center gap-1 mb-0.5">
                <div className="flex rounded border border-border overflow-hidden text-xs">
                    {(['AND', 'OR'] as const).map(o => (
                        <button key={o} onClick={() => onUpdate({ ...g, logicOp: o })}
                            className={`px-1.5 py-0.5 transition-colors ${g.logicOp === o ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                            {o}
                        </button>
                    ))}
                </div>
                <button onClick={() => onUpdate({ ...g, negate: !g.negate })}
                    title="Inverser le groupe (NOT)"
                    className={`px-1.5 py-0.5 rounded border text-xs font-mono transition-colors ${g.negate
                        ? 'bg-destructive/80 text-destructive-foreground border-destructive'
                        : 'border-border text-muted-foreground hover:bg-muted'}`}>
                    NOT
                </button>
                <span className="flex-1" />
                <MoveBtns onUp={onMoveUp} onDown={onMoveDown} />
                {onRemove && <RemoveBtn onClick={onRemove} />}
            </div>

            {/* Items */}
            {items.map((item, i) => (
                <div key={i}>
                    {i > 0 && (
                        <div className="flex items-center gap-1 py-0.5 px-1">
                            <span className="text-[10px] font-mono font-semibold text-muted-foreground/70 select-none">{g.logicOp}</span>
                        </div>
                    )}
                    {item.kind === 'cond' ? (
                        <FilterConditionRow
                            cond={item.cond}
                            availableCols={availableCols}
                            onChange={patch => setItems(items.map((it, idx) => idx === i ? { kind: 'cond', cond: { ...it.cond, ...patch } } : it))}
                            onRemove={() => setItems(items.filter((_, idx) => idx !== i))}
                            onMoveUp={i > 0 ? () => setItems(moveArr(items, i, -1)) : undefined}
                            onMoveDown={i < items.length - 1 ? () => setItems(moveArr(items, i, 1)) : undefined}
                            fetchDistinctValues={fetchDistinctValues}
                        />
                    ) : (
                        <FilterGroupUI
                            group={item.group}
                            onUpdate={g2 => setItems(items.map((it, idx) => idx === i ? { kind: 'group', group: g2 } : it))}
                            onRemove={() => setItems(items.filter((_, idx) => idx !== i))}
                            onMoveUp={i > 0 ? () => setItems(moveArr(items, i, -1)) : undefined}
                            onMoveDown={i < items.length - 1 ? () => setItems(moveArr(items, i, 1)) : undefined}
                            availableCols={availableCols}
                            depth={depth + 1}
                            fetchDistinctValues={fetchDistinctValues}
                        />
                    )}
                </div>
            ))}

            {items.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-0.5">Aucun filtre</p>
            )}

            {/* Boutons d'ajout */}
            <div className="flex gap-3 mt-0.5">
                <AddRowBtn onClick={addCond} label="+ Condition" />
                <AddRowBtn onClick={addSubgroup} label="+ Sous-groupe" />
            </div>
        </div>
    )
}

function FilterRowsStepUI({ step, availableCols, onChange, fetchDistinctValues }: { step: FilterRowsStep; availableCols: string[]; onChange: (s: FilterRowsStep) => void; fetchDistinctValues?: (col: string, limit: number) => Promise<{ values: string[]; hasMore: boolean }> }) {
    // Normalise rétrocompat : ancien format conditions[] → groups
    const groups: FilterGroup[] = step.groups?.length
        ? step.groups
        : (step.conditions?.length
            ? [{ items: step.conditions.map(c => ({ kind: 'cond' as const, cond: c })), logicOp: step.logicOp ?? 'AND' }]
            : [{ items: [], logicOp: 'AND' }])

    const groupLogicOp = step.groupLogicOp ?? 'OR'

    function updateGroups(newGroups: FilterGroup[]) {
        onChange({ ...step, groups: newGroups, groupLogicOp, conditions: undefined, logicOp: undefined })
    }

    function addGroup() {
        updateGroups([...groups, { items: [], logicOp: 'AND', negate: false }])
    }

    function removeGroup(gi: number) {
        const next = groups.filter((_, i) => i !== gi)
        updateGroups(next.length ? next : [{ items: [], logicOp: 'AND' }])
    }

    return (
        <div className="flex flex-col gap-2">
            {groups.map((group, gi) => (
                <div key={gi}>
                    {gi > 0 && (
                        <LogicOpBadge op={groupLogicOp} onChange={op => onChange({ ...step, groups, groupLogicOp: op })} />
                    )}
                    <FilterGroupUI
                        group={group}
                        onUpdate={g => updateGroups(groups.map((gr, i) => i === gi ? g : gr))}
                        onRemove={groups.length > 1 ? () => removeGroup(gi) : undefined}
                        onMoveUp={gi > 0 ? () => updateGroups(moveArr(groups, gi, -1)) : undefined}
                        onMoveDown={gi < groups.length - 1 ? () => updateGroups(moveArr(groups, gi, 1)) : undefined}
                        availableCols={availableCols}
                        depth={0}
                        fetchDistinctValues={fetchDistinctValues}
                    />
                </div>
            ))}
            <button onClick={addGroup}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-dashed border-border rounded px-2 py-1 hover:border-primary transition-colors">
                + Ajouter un groupe
            </button>
        </div>
    )
}

function SortStepUI({ step, availableCols, onChange }: { step: SortStep; availableCols: string[]; onChange: (s: SortStep) => void }) {
    function update(i: number, patch: Partial<SortKey>) {
        onChange({ ...step, keys: step.keys.map((k, idx) => idx === i ? { ...k, ...patch } : k) })
    }
    return (
        <div className="flex flex-col gap-1.5">
            {step.keys.map((k, i) => (
                <div key={i} className="flex items-center gap-1 flex-wrap">
                    <ColSelect value={k.column} cols={availableCols} onChange={v => update(i, { column: v })} className="flex-1 min-w-24" />
                    <div className="flex rounded border border-border overflow-hidden text-xs">
                        {(['asc', 'desc'] as const).map(d => (
                            <button key={d} onClick={() => update(i, { direction: d })}
                                className={`px-2 py-0.5 transition-colors ${k.direction === d ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}>
                                {d.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <div className="flex rounded border border-border overflow-hidden text-xs">
                        {(['last', 'first'] as const).map(n => (
                            <button key={n} onClick={() => update(i, { nulls: n })}
                                className={`px-1.5 py-0.5 transition-colors ${k.nulls === n ? 'bg-muted-foreground/20 font-medium' : 'bg-background hover:bg-muted'} text-xs`}>
                                NULL {n.toUpperCase()}
                            </button>
                        ))}
                    </div>
                    <MoveBtns onUp={i > 0 ? () => onChange({ ...step, keys: moveArr(step.keys, i, -1) }) : undefined} onDown={i < step.keys.length - 1 ? () => onChange({ ...step, keys: moveArr(step.keys, i, 1) }) : undefined} />
                    <RemoveBtn onClick={() => onChange({ ...step, keys: step.keys.filter((_, idx) => idx !== i) })} />
                </div>
            ))}
            <AddRowBtn onClick={() => onChange({ ...step, keys: [...step.keys, { column: availableCols[0] ?? '', direction: 'asc', nulls: 'last' }] })} label="+ Clé de tri" />
        </div>
    )
}

function TopNStepUI({ step, onChange }: { step: TopNStep; onChange: (s: TopNStep) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-1">
                {(['limit', 'sample_percent', 'sample_rows'] as const).map(m => (
                    <button key={m} onClick={() => onChange({ ...step, mode: m })}
                        className={`px-2 py-0.5 rounded border text-xs transition-colors ${step.mode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                        {m === 'limit' ? 'LIMIT' : m === 'sample_percent' ? 'SAMPLE %' : 'SAMPLE lignes'}
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0">N :</label>
                <input type="number" min={0} className="w-24 h-6 rounded border border-border bg-background px-1.5 text-xs"
                    value={step.n} onChange={e => onChange({ ...step, n: Number(e.target.value) })} />
                {step.mode === 'limit' && <>
                    <label className="text-xs text-muted-foreground shrink-0">Offset :</label>
                    <input type="number" min={0} className="w-20 h-6 rounded border border-border bg-background px-1.5 text-xs"
                        value={step.offset ?? ''} onChange={e => onChange({ ...step, offset: e.target.value ? Number(e.target.value) : undefined })} placeholder="0" />
                </>}
                {step.mode !== 'limit' && <>
                    <label className="text-xs text-muted-foreground shrink-0">Méthode :</label>
                    <select className="h-6 rounded border border-border bg-background px-1 text-xs"
                        value={step.sampleMethod ?? ''} onChange={e => onChange({ ...step, sampleMethod: (e.target.value || undefined) as any })}>
                        <option value="">défaut</option>
                        <option value="reservoir">reservoir</option>
                        <option value="bernoulli">bernoulli</option>
                        <option value="system">system</option>
                    </select>
                </>}
            </div>
        </div>
    )
}

function RenameColumnsStepUI({ step, availableCols, onChange }: { step: RenameColumnsStep; availableCols: string[]; onChange: (s: RenameColumnsStep) => void }) {
    function update(i: number, patch: Partial<{ from: string; to: string }>) {
        onChange({ ...step, renames: step.renames.map((r, idx) => idx === i ? { ...r, ...patch } : r) })
    }
    return (
        <div className="flex flex-col gap-1.5">
            {step.renames.map((r, i) => (
                <div key={i} className="flex items-center gap-1">
                    <ColSelect value={r.from} cols={availableCols} onChange={v => update(i, { from: v })} className="flex-1" />
                    <span className="text-xs text-muted-foreground shrink-0">→</span>
                    <TxtInput value={r.to} onChange={v => update(i, { to: v })} placeholder="nouveau nom" className="flex-1" />
                    <MoveBtns onUp={i > 0 ? () => onChange({ ...step, renames: moveArr(step.renames, i, -1) }) : undefined} onDown={i < step.renames.length - 1 ? () => onChange({ ...step, renames: moveArr(step.renames, i, 1) }) : undefined} />
                    <RemoveBtn onClick={() => onChange({ ...step, renames: step.renames.filter((_, idx) => idx !== i) })} />
                </div>
            ))}
            <AddRowBtn onClick={() => onChange({ ...step, renames: [...step.renames, { from: availableCols[0] ?? '', to: '' }] })} label="+ Renommage" />
        </div>
    )
}

function DeriveStepUI({ step, availableCols, onChange }: { step: DeriveStep; availableCols: string[]; onChange: (s: DeriveStep) => void }) {
    function update(i: number, patch: Partial<{ name: string; expr: string; replace: boolean }>) {
        onChange({ ...step, columns: step.columns.map((c, idx) => idx === i ? { ...c, ...patch } : c) })
    }
    return (
        <div className="flex flex-col gap-2">
            {step.columns.map((col, i) => (
                <div key={i} className="flex flex-col gap-1 border border-border rounded p-1.5">
                    <div className="flex items-center gap-1">
                        <TxtInput value={col.name} onChange={v => update(i, { name: v })} placeholder="nom_colonne" className="flex-1" />
                        <label className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer shrink-0">
                            <input type="checkbox" checked={col.replace} onChange={e => update(i, { replace: e.target.checked })} className="w-3 h-3" />
                            Remplacer
                        </label>
                        <MoveBtns onUp={i > 0 ? () => onChange({ ...step, columns: moveArr(step.columns, i, -1) }) : undefined} onDown={i < step.columns.length - 1 ? () => onChange({ ...step, columns: moveArr(step.columns, i, 1) }) : undefined} />
                        <RemoveBtn onClick={() => onChange({ ...step, columns: step.columns.filter((_, idx) => idx !== i) })} />
                    </div>
                    <textarea className="w-full rounded border border-border bg-background px-2 py-1 text-xs font-mono resize-none" rows={2}
                        value={col.expr} onChange={e => update(i, { expr: e.target.value })} placeholder="UPPER(col) ou col * 2 ou …" />
                </div>
            ))}
            <AddRowBtn onClick={() => onChange({ ...step, columns: [...step.columns, { name: '', expr: '', replace: false }] })} label="+ Colonne calculée" />
        </div>
    )
}

const FILL_STRATEGIES = [
    { value: 'value', label: 'Valeur fixe' },
    { value: 'zero', label: '0' },
    { value: 'empty_string', label: 'Chaîne vide' },
    { value: 'mean', label: 'Moyenne' },
    { value: 'median', label: 'Médiane' },
]

function FillNullStepUI({ step, availableCols, onChange }: { step: FillNullStep; availableCols: string[]; onChange: (s: FillNullStep) => void }) {
    function update(i: number, patch: any) {
        onChange({ ...step, fills: step.fills.map((f, idx) => idx === i ? { ...f, ...patch } : f) })
    }
    return (
        <div className="flex flex-col gap-1.5">
            {step.fills.map((fill, i) => (
                <div key={i} className="flex items-center gap-1 flex-wrap">
                    <ColSelect value={fill.column} cols={availableCols} onChange={v => update(i, { column: v })} className="flex-1 min-w-20" />
                    <select className="h-6 rounded border border-border bg-background px-1 text-xs w-28"
                        value={fill.strategy} onChange={e => update(i, { strategy: e.target.value })}>
                        {FILL_STRATEGIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                    {fill.strategy === 'value' && (
                        <TxtInput value={fill.value ?? ''} onChange={v => update(i, { value: v })} placeholder="valeur" className="flex-1 min-w-16" />
                    )}
                    <MoveBtns onUp={i > 0 ? () => onChange({ ...step, fills: moveArr(step.fills, i, -1) }) : undefined} onDown={i < step.fills.length - 1 ? () => onChange({ ...step, fills: moveArr(step.fills, i, 1) }) : undefined} />
                    <RemoveBtn onClick={() => onChange({ ...step, fills: step.fills.filter((_, idx) => idx !== i) })} />
                </div>
            ))}
            <AddRowBtn onClick={() => onChange({ ...step, fills: [...step.fills, { column: availableCols[0] ?? '', strategy: 'value', value: '' }] })} label="+ Colonne" />
        </div>
    )
}

// ─── P2 step UIs ──────────────────────────────────────────────────────────────

const AGG_FNS = ['count', 'count_distinct', 'sum', 'avg', 'min', 'max', 'median', 'stddev', 'string_agg', 'list']

function autoAlias(fn: string, column: string): string {
    const col = column === '*' ? 'all' : column
    return `${fn}_${col}`
}

function GroupByStepUI({ step, availableCols, onChange }: { step: GroupByStep; availableCols: string[]; onChange: (s: GroupByStep) => void }) {
    function updateAgg(i: number, patch: Partial<Aggregation>) {
        const current = step.aggregations[i]
        // Auto-recalcule l'alias quand fn ou column change
        const merged = { ...current, ...patch }
        if (('fn' in patch || 'column' in patch)) {
            merged.alias = autoAlias(merged.fn, merged.column)
        }
        onChange({ ...step, aggregations: step.aggregations.map((a, idx) => idx === i ? merged : a) })
    }
    const toggleGroup = (col: string) => {
        const s = new Set(step.groupCols)
        s.has(col) ? s.delete(col) : s.add(col)
        onChange({ ...step, groupCols: availableCols.filter(c => s.has(c)) })
    }
    return (
        <div className="flex flex-col gap-2">
            <div>
                <p className="text-xs text-muted-foreground mb-1">Grouper par :</p>
                <div className="flex flex-wrap gap-1">
                    {availableCols.map(c => (
                        <label key={c} className={`flex items-center gap-1 px-2 py-0.5 rounded border cursor-pointer text-xs transition-colors ${step.groupCols.includes(c) ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-muted'}`}>
                            <input type="checkbox" className="w-3 h-3" checked={step.groupCols.includes(c)} onChange={() => toggleGroup(c)} />
                            {c}
                        </label>
                    ))}
                    {availableCols.length === 0 && <span className="text-xs text-muted-foreground italic">Aucune colonne</span>}
                </div>
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Agrégations :</p>
                {step.aggregations.map((a, i) => (
                    <div key={i} className="flex items-center gap-1 mb-1 flex-wrap">
                        <ColSelect value={a.column} cols={['*', ...availableCols]} onChange={v => updateAgg(i, { column: v })} placeholder="colonne" className="flex-1 min-w-20" />
                        <select className="h-6 rounded border border-border bg-background px-1 text-xs w-28"
                            value={a.fn} onChange={e => updateAgg(i, { fn: e.target.value as any })}>
                            {AGG_FNS.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                        </select>
                        <span className="text-xs text-muted-foreground shrink-0">→</span>
                        <TxtInput value={a.alias} onChange={v => updateAgg(i, { alias: v })} placeholder="alias" className="flex-1 min-w-16" />
                        {a.fn === 'string_agg' && <TxtInput value={a.separator ?? ', '} onChange={v => updateAgg(i, { separator: v })} placeholder="séparateur" className="w-16" />}
                        <MoveBtns onUp={i > 0 ? () => onChange({ ...step, aggregations: moveArr(step.aggregations, i, -1) }) : undefined} onDown={i < step.aggregations.length - 1 ? () => onChange({ ...step, aggregations: moveArr(step.aggregations, i, 1) }) : undefined} />
                        <RemoveBtn onClick={() => onChange({ ...step, aggregations: step.aggregations.filter((_, idx) => idx !== i) })} />
                    </div>
                ))}
                <AddRowBtn onClick={() => { const col = availableCols[0] ?? '*'; onChange({ ...step, aggregations: [...step.aggregations, { column: col, fn: 'count', alias: autoAlias('count', col) }] }) }} label="+ Agrégation" />
            </div>
        </div>
    )
}

const JOIN_TYPES: { type: JoinStep['joinType']; label: string }[] = [
    { type: 'left', label: 'LEFT' }, { type: 'inner', label: 'INNER' },
    { type: 'right', label: 'RIGHT' }, { type: 'full', label: 'FULL' },
    { type: 'anti', label: 'ANTI' },
]

function JoinStepUI({ step, availableCols, onChange }: { step: JoinStep; availableCols: string[]; onChange: (s: JoinStep) => void }) {
    function updateOn(i: number, patch: Partial<JoinCondition>) {
        onChange({ ...step, on: step.on.map((c, idx) => idx === i ? { ...c, ...patch } : c) })
    }
    const selRight = step.selectRight === '*' ? [] : step.selectRight
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground shrink-0">Table :</label>
                <TxtInput value={step.rightTable} onChange={v => onChange({ ...step, rightTable: v })} placeholder="nom_table" className="flex-1" />
            </div>
            <div className="flex gap-1 flex-wrap">
                {JOIN_TYPES.map(jt => (
                    <button key={jt.type} onClick={() => onChange({ ...step, joinType: jt.type })}
                        className={`px-2 py-0.5 rounded border text-xs transition-colors ${step.joinType === jt.type ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                        {jt.label}
                    </button>
                ))}
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1">Clés de jointure :</p>
                {step.on.map((c, i) => (
                    <div key={i} className="flex items-center gap-1 mb-1">
                        <ColSelect value={c.left} cols={availableCols} onChange={v => updateOn(i, { left: v })} placeholder="col gauche" className="flex-1" />
                        <span className="text-xs text-muted-foreground shrink-0">=</span>
                        <TxtInput value={c.right} onChange={v => updateOn(i, { right: v })} placeholder="col droite" className="flex-1" />
                        <MoveBtns onUp={i > 0 ? () => onChange({ ...step, on: moveArr(step.on, i, -1) }) : undefined} onDown={i < step.on.length - 1 ? () => onChange({ ...step, on: moveArr(step.on, i, 1) }) : undefined} />
                        <RemoveBtn onClick={() => onChange({ ...step, on: step.on.filter((_, idx) => idx !== i) })} />
                    </div>
                ))}
                <AddRowBtn onClick={() => onChange({ ...step, on: [...step.on, { left: availableCols[0] ?? '', right: '' }] })} label="+ Clé" />
            </div>
            <div>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <input type="checkbox" className="w-3 h-3" checked={step.selectRight === '*'}
                        onChange={e => onChange({ ...step, selectRight: e.target.checked ? '*' : [] })} />
                    Importer toutes les colonnes de droite
                </label>
                {step.selectRight !== '*' && (
                    <div className="mt-1">
                        <p className="text-xs text-muted-foreground mb-0.5">Colonnes à importer (noms) :</p>
                        <TxtInput value={selRight.join(', ')} onChange={v => onChange({ ...step, selectRight: v.split(',').map(x => x.trim()).filter(Boolean) })}
                            placeholder="col1, col2…" className="w-full" />
                    </div>
                )}
            </div>
        </div>
    )
}

function UnionStepUI({ step, onChange }: { step: UnionStep; onChange: (s: UnionStep) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground shrink-0">Table :</label>
                <TxtInput value={step.table} onChange={v => onChange({ ...step, table: v })} placeholder="nom_table" className="flex-1" />
            </div>
            <div className="flex gap-1">
                {(['all', 'distinct'] as const).map(m => (
                    <button key={m} onClick={() => onChange({ ...step, mode: m })}
                        className={`px-2 py-0.5 rounded border text-xs transition-colors ${step.mode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                        {m === 'all' ? 'UNION ALL' : 'UNION DISTINCT'}
                    </button>
                ))}
            </div>
        </div>
    )
}

const AGG_FNS_PIVOT = ['SUM', 'COUNT', 'AVG', 'MIN', 'MAX', 'MEDIAN']

function PivotStepUI({ step, availableCols, onChange }: { step: PivotStep; availableCols: string[]; onChange: (s: PivotStep) => void }) {
    const toggleGroup = (col: string) => {
        const s = new Set(step.groupCols)
        s.has(col) ? s.delete(col) : s.add(col)
        onChange({ ...step, groupCols: availableCols.filter(c => s.has(c)) })
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-20">Pivoter :</label>
                <ColSelect value={step.onColumn} cols={availableCols} onChange={v => onChange({ ...step, onColumn: v })} className="flex-1" />
            </div>
            <div className="flex items-center gap-1 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-20">Valeur :</label>
                <ColSelect value={step.valueColumn} cols={availableCols} onChange={v => onChange({ ...step, valueColumn: v })} className="flex-1" />
                <select className="h-6 rounded border border-border bg-background px-1 text-xs w-20"
                    value={step.valueFn} onChange={e => onChange({ ...step, valueFn: e.target.value })}>
                    {AGG_FNS_PIVOT.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div>
                <p className="text-xs text-muted-foreground mb-1 w-20">Lignes :</p>
                <div className="flex flex-wrap gap-1">
                    {availableCols.filter(c => c !== step.onColumn && c !== step.valueColumn).map(c => (
                        <label key={c} className={`flex items-center gap-1 px-1.5 py-0.5 rounded border cursor-pointer text-xs transition-colors ${step.groupCols.includes(c) ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-muted'}`}>
                            <input type="checkbox" className="w-3 h-3" checked={step.groupCols.includes(c)} onChange={() => toggleGroup(c)} />
                            {c}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

function UnpivotStepUI({ step, availableCols, onChange }: { step: UnpivotStep; availableCols: string[]; onChange: (s: UnpivotStep) => void }) {
    const toggleCol = (col: string) => {
        const s = new Set(step.columns)
        s.has(col) ? s.delete(col) : s.add(col)
        onChange({ ...step, columns: availableCols.filter(c => s.has(c)) })
    }
    return (
        <div className="flex flex-col gap-2">
            <div>
                <p className="text-xs text-muted-foreground mb-1">Colonnes à fondre :</p>
                <div className="flex flex-wrap gap-1">
                    {availableCols.map(c => (
                        <label key={c} className={`flex items-center gap-1 px-1.5 py-0.5 rounded border cursor-pointer text-xs transition-colors ${step.columns.includes(c) ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:bg-muted'}`}>
                            <input type="checkbox" className="w-3 h-3" checked={step.columns.includes(c)} onChange={() => toggleCol(c)} />
                            {c}
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-24">Colonne labels :</label>
                <TxtInput value={step.nameCol} onChange={v => onChange({ ...step, nameCol: v })} placeholder="category" className="flex-1" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-24">Colonne valeurs :</label>
                <TxtInput value={step.valueCol} onChange={v => onChange({ ...step, valueCol: v })} placeholder="value" className="flex-1" />
            </div>
        </div>
    )
}

// ─── P3 step UIs ──────────────────────────────────────────────────────────────

const WINDOW_FNS = [
    'ROW_NUMBER', 'RANK', 'DENSE_RANK', 'PERCENT_RANK', 'CUME_DIST', 'NTILE',
    'SUM', 'AVG', 'COUNT', 'MIN', 'MAX', 'MEDIAN',
    'LAG', 'LEAD', 'FIRST_VALUE', 'LAST_VALUE', 'NTH_VALUE',
]
const NO_COL_FNS = new Set(['ROW_NUMBER', 'RANK', 'DENSE_RANK', 'PERCENT_RANK', 'CUME_DIST'])

function WindowStepUI({ step, availableCols, onChange }: { step: WindowStep; availableCols: string[]; onChange: (s: WindowStep) => void }) {
    function update(i: number, patch: Partial<WindowColumn>) {
        onChange({ ...step, columns: step.columns.map((w, idx) => idx === i ? { ...w, ...patch } : w) })
    }
    function addWin() {
        onChange({ ...step, columns: [...step.columns, { fn: 'ROW_NUMBER', partitionBy: [], orderBy: [], alias: 'rn' }] })
    }
    return (
        <div className="flex flex-col gap-2">
            {step.columns.map((w, i) => (
                <div key={i} className="flex flex-col gap-1 border border-border rounded p-1.5">
                    <div className="flex items-center gap-1 flex-wrap">
                        <select className="h-6 rounded border border-border bg-background px-1 text-xs w-32"
                            value={w.fn} onChange={e => update(i, { fn: e.target.value })}>
                            {WINDOW_FNS.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        {!NO_COL_FNS.has(w.fn) && (
                            <ColSelect value={w.col ?? ''} cols={availableCols} onChange={v => update(i, { col: v })} placeholder="col" className="flex-1" />
                        )}
                        {(w.fn === 'LAG' || w.fn === 'LEAD') && (
                            <input type="number" min={1} className="w-12 h-6 rounded border border-border bg-background px-1 text-xs"
                                value={w.offset ?? 1} onChange={e => update(i, { offset: Number(e.target.value) })} title="décalage" />
                        )}
                        <span className="text-xs text-muted-foreground shrink-0">→</span>
                        <TxtInput value={w.alias} onChange={v => update(i, { alias: v })} placeholder="alias" className="w-24" />
                        <MoveBtns onUp={i > 0 ? () => onChange({ ...step, columns: moveArr(step.columns, i, -1) }) : undefined} onDown={i < step.columns.length - 1 ? () => onChange({ ...step, columns: moveArr(step.columns, i, 1) }) : undefined} />
                        <RemoveBtn onClick={() => onChange({ ...step, columns: step.columns.filter((_, idx) => idx !== i) })} />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
                        <span className="shrink-0">PARTITION BY :</span>
                        <TxtInput value={w.partitionBy.join(', ')} onChange={v => update(i, { partitionBy: v.split(',').map(x => x.trim()).filter(Boolean) })} placeholder="col1, col2…" className="flex-1" />
                    </div>
                    <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
                        <span className="shrink-0">ORDER BY :</span>
                        <TxtInput value={w.orderBy.map(k => `${k.column} ${k.direction.toUpperCase()}`).join(', ')} onChange={v => {
                            const keys = v.split(',').map(x => x.trim()).filter(Boolean).map(x => {
                                const [col, dir] = x.split(/\s+/)
                                return { column: col, direction: (dir?.toLowerCase() === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc', nulls: 'last' as const }
                            })
                            update(i, { orderBy: keys })
                        }} placeholder="col ASC, col2 DESC…" className="flex-1" />
                    </div>
                </div>
            ))}
            <AddRowBtn onClick={addWin} label="+ Fonction fenêtre" />
        </div>
    )
}

function UnnestStepUI({ step, availableCols, onChange }: { step: UnnestStep; availableCols: string[]; onChange: (s: UnnestStep) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground shrink-0">Colonne array :</label>
                <ColSelect value={step.column} cols={availableCols} onChange={v => onChange({ ...step, column: v })} className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground shrink-0">Nom sortie :</label>
                <TxtInput value={step.alias} onChange={v => onChange({ ...step, alias: v })} placeholder="item" className="flex-1" />
            </div>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                <input type="checkbox" className="w-3 h-3" checked={step.keepEmpty} onChange={e => onChange({ ...step, keepEmpty: e.target.checked })} />
                Conserver les lignes sans valeur (LEFT JOIN)
            </label>
        </div>
    )
}

function JsonExtractStepUI({ step, availableCols, onChange }: { step: JsonExtractStep; availableCols: string[]; onChange: (s: JsonExtractStep) => void }) {
    function updateEx(i: number, patch: any) {
        onChange({ ...step, extractions: step.extractions.map((e, idx) => idx === i ? { ...e, ...patch } : e) })
    }
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground shrink-0">Colonne JSON :</label>
                <ColSelect value={step.column} cols={availableCols} onChange={v => onChange({ ...step, column: v })} className="flex-1" />
            </div>
            {step.extractions.map((ex, i) => (
                <div key={i} className="flex items-center gap-1 flex-wrap">
                    <TxtInput value={ex.path} onChange={v => updateEx(i, { path: v })} placeholder="$.user.name" className="flex-1 min-w-24" />
                    <span className="text-xs text-muted-foreground shrink-0">→</span>
                    <TxtInput value={ex.alias} onChange={v => updateEx(i, { alias: v })} placeholder="alias" className="w-24" />
                    <select className="h-6 rounded border border-border bg-background px-1 text-xs w-20"
                        value={ex.targetType ?? ''} onChange={e => updateEx(i, { targetType: e.target.value || undefined })}>
                        <option value="">VARCHAR</option>
                        {DUCKDB_TYPES.slice(2).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <MoveBtns onUp={i > 0 ? () => onChange({ ...step, extractions: moveArr(step.extractions, i, -1) }) : undefined} onDown={i < step.extractions.length - 1 ? () => onChange({ ...step, extractions: moveArr(step.extractions, i, 1) }) : undefined} />
                    <RemoveBtn onClick={() => onChange({ ...step, extractions: step.extractions.filter((_, idx) => idx !== i) })} />
                </div>
            ))}
            <AddRowBtn onClick={() => onChange({ ...step, extractions: [...step.extractions, { path: '$.', alias: '' }] })} label="+ Extraction" />
        </div>
    )
}

const DATE_GRANULARITIES = ['second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year']

function DateTruncStepUI({ step, availableCols, onChange }: { step: DateTruncStep; availableCols: string[]; onChange: (s: DateTruncStep) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-20">Colonne :</label>
                <ColSelect value={step.column} cols={availableCols} onChange={v => onChange({ ...step, column: v })} className="flex-1" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs text-muted-foreground shrink-0 w-20">Granularité :</label>
                <select className="h-6 rounded border border-border bg-background px-1 text-xs flex-1"
                    value={step.granularity} onChange={e => onChange({ ...step, granularity: e.target.value as any })}>
                    {DATE_GRANULARITIES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div className="flex gap-1">
                {(['replace', 'add'] as const).map(m => (
                    <button key={m} onClick={() => onChange({ ...step, mode: m })}
                        className={`px-2 py-0.5 rounded border text-xs transition-colors ${step.mode === m ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}>
                        {m === 'replace' ? 'Remplacer' : 'Nouvelle colonne'}
                    </button>
                ))}
            </div>
            {step.mode === 'add' && (
                <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground shrink-0 w-20">Nom :</label>
                    <TxtInput value={step.alias ?? ''} onChange={v => onChange({ ...step, alias: v })} placeholder={`${step.column}_${step.granularity}`} className="flex-1" />
                </div>
            )}
        </div>
    )
}

// ─── Résumé inline d'un step ──────────────────────────────────────────────────

function truncateCols(items: string[], max = 4): string {
    if (items.length <= max) return items.join(', ')
    return items.slice(0, max).join(', ') + '…'
}

function stepSummary(step: SqlBlockStep): string {
    switch (step.type) {
        case 'select_columns':  return step.columns.length ? truncateCols(step.columns) : '—'
        case 'exclude_columns': return step.columns.length ? truncateCols(step.columns) : '—'
        case 'rename_columns':  return step.renames.length ? truncateCols(step.renames.map(r => `${r.from}→${r.to}`)) : '—'
        case 'change_type':     return step.changes.length ? truncateCols(step.changes.map(c => `${c.column}:${c.targetType}`)) : '—'
        case 'filter_rows': {
            const groups = step.groups?.length ? step.groups : (step.conditions?.length ? [{ items: step.conditions.map(c => ({ kind: 'cond', cond: c })) }] : [])
            function countItems(g): number {
                return (g.items ?? g.conditions ?? []).reduce((s, it) => s + (it.kind === 'group' ? countItems(it.group) : 1), 0)
            }
            const n = groups.reduce((s, g) => s + countItems(g), 0)
            const neg = groups.some(g => g.negate)
            return n ? `${n} condition${n > 1 ? 's' : ''}${groups.length > 1 ? ` (${groups.length} groupes)` : ''}${neg ? ' [NOT]' : ''}` : '—'
        }
        case 'sort':            return step.keys.length ? truncateCols(step.keys.map(k => `${k.column} ${k.direction === 'asc' ? '↑' : '↓'}`)) : '—'
        case 'top_n':           return step.mode === 'limit' ? `${step.n} lignes` : `${step.n}% échantillon`
        case 'derive':          return step.columns.length ? truncateCols(step.columns.map(c => c.name)) : '—'
        case 'fill_null':       return step.fills.length ? truncateCols(step.fills.map(f => f.column)) : '—'
        case 'group_by':        return step.groupCols.length ? truncateCols(step.groupCols) : '—'
        case 'join':            return step.rightTable || '—'
        case 'union':           return step.table || '—'
        case 'pivot':           return step.onColumn || '—'
        case 'unpivot':         return step.columns.length ? truncateCols(step.columns) : '—'
        case 'window':          return step.columns.length ? `${step.columns.length} col.` : '—'
        case 'unnest':          return step.column || '—'
        case 'json_extract':    return step.column || '—'
        case 'date_trunc':      return step.column ? `${step.column} → ${step.granularity}` : '—'
        case 'custom_sql':      return step.sql ? step.sql.slice(0, 40).replace(/\n/g, ' ') + (step.sql.length > 40 ? '…' : '') : '—'
        default:                return ''
    }
}

// ─── CustomSqlStepUI ──────────────────────────────────────────────────────────

function CustomSqlStepUI({ step, onChange }: { step: CustomSqlStep; onChange: (s: CustomSqlStep) => void }) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
                Écrivez du SQL libre. Utilisez <code className="bg-muted px-1 rounded font-mono">{'{{subquery}}'}</code> pour référencer le résultat de l'étape précédente (ou la source si c'est la première étape).
            </p>
            <textarea
                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                value={step.sql}
                onChange={e => onChange({ ...step, sql: e.target.value })}
                spellCheck={false}
                placeholder="SELECT * FROM {{subquery}} WHERE ..."
            />
        </div>
    )
}

// ─── useStepInputSchemas ──────────────────────────────────────────────────────
// Récupère le schéma réel en entrée de chaque step.
// Stratégie : lit d'abord la table temp déjà matérialisée par useStepEyeData
// (makeTableRef(cellId, N-1)), fallback sur une requête SQL LIMIT 0.

interface DynamicSchema { columns: string[]; colTypes: Record<string, string> }

function useStepInputSchemas(ast: SqlBlockAst, cellId: string) {
    const [dynamicSchemas, setDynamicSchemas] = useState<Record<number, DynamicSchema>>({})
    const cacheRef = useRef<Map<string, DynamicSchema>>(new Map())
    const astRef = useRef(ast)
    astRef.current = ast

    const fetchSchemaForStep = useCallback(async (stepIdx: number) => {
        // Toujours travailler sur un AST sans chartConfig : le SELECT final avec
        // annotations (CAST(x AS XAXIS)…) ne doit jamais polluer les schémas des étapes.
        const a = { ...astRef.current, chartConfig: undefined }
        if (!a.source) return
        const cacheKey = JSON.stringify({ src: a.source, steps: a.steps.slice(0, stepIdx) })

        const cached = cacheRef.current.get(cacheKey)
        if (cached) {
            setDynamicSchemas(prev => ({ ...prev, [stepIdx]: cached }))
            return
        }

        try {
            let schemaTypes: Record<string, string> | undefined

            // 1. Essaie la table temp déjà matérialisée (makeTableRef(cellId, stepIdx-1))
            //    Elle existe si la matérialisation proactive a tourné.
            if (stepIdx > 0) {
                const tRef = makeTableRef(cellId, stepIdx - 1)
                try {
                    const conn = DuckDBManager.getConnection()
                    if (conn) {
                        const result = await conn.query(`SELECT * FROM ${tRef} LIMIT 0`)
                        schemaTypes = {}
                        for (const field of result.schema.fields) {
                            schemaTypes[field.name] = String(field.type)
                        }
                    }
                } catch { /* table pas encore créée → fallback */ }
            }

            // 2. Fallback : LIMIT 0 directement sur le SQL amont (sans wrapper subquery)
            if (!schemaTypes) {
                const inputSql = stepIdx === 0
                    ? `SELECT * FROM ${quoteId(a.source)}`
                    : stepSql(a, stepIdx - 1)
                if (!inputSql) return
                const bare = inputSql.trimEnd().replace(/;+\s*$/, '')
                const hasLimit = /\bLIMIT\s+\d/i.test(bare.replace(/\([\s\S]*?\)/g, ''))
                const sql0 = hasLimit ? bare : `${bare}\nLIMIT 0`
                const conn = DuckDBManager.getConnection()
                if (!conn) return
                const result = await conn.query(sql0)
                for (const field of result.schema.fields) {
                    if (!schemaTypes) schemaTypes = {}
                    schemaTypes[field.name] = String(field.type)
                }
            }

            if (!schemaTypes) return
            const result: DynamicSchema = { columns: Object.keys(schemaTypes), colTypes: schemaTypes }
            cacheRef.current.set(cacheKey, result)
            setDynamicSchemas(prev => ({ ...prev, [stepIdx]: result }))
        } catch (err) {
            console.warn('[sqlblock input-schema]', err)
        }
    }, [cellId])

    /** Invalide le cache ET l'état dynamicSchemas pour les steps >= dirtyFromStep */
    const invalidateFrom = useCallback((dirtyFromStep: number, a: SqlBlockAst) => {
        for (const [key] of cacheRef.current) {
            try {
                const parsed = JSON.parse(key) as { src: string; steps: unknown[] }
                if (parsed.src !== a.source || parsed.steps.length >= dirtyFromStep)
                    cacheRef.current.delete(key)
            } catch { cacheRef.current.delete(key) }
        }
        // Purge aussi le state React pour éviter d'afficher des données périmées
        setDynamicSchemas(prev => {
            const next: Record<number, DynamicSchema> = {}
            for (const [k, v] of Object.entries(prev)) {
                if (Number(k) < dirtyFromStep) next[Number(k)] = v
            }
            return next
        })
    }, [])

    return { dynamicSchemas, fetchSchemaForStep, invalidateFrom }
}



function StepConfigModal({ step, index, availableCols, availableColTypes, onUpdate, onClose, fetchDistinctValues, otherStepNames }: {
    step: SqlBlockStep; index: number
    availableCols: string[]; availableColTypes: Record<string, string>
    onUpdate: (idx: number, s: SqlBlockStep) => void
    onClose: () => void
    fetchDistinctValues?: (col: string, limit: number) => Promise<{ values: string[]; hasMore: boolean }>
    otherStepNames: string[]
}) {
    // Fermeture sur Échap
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [onClose])

    const nameValue = step.name ?? ''
    const descValue = step.description ?? ''
    const nameConflict = nameValue.trim() !== '' && otherStepNames.includes(nameValue.trim())

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            {/* Modale */}
            <div className="relative z-10 bg-popover border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 h-[96vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                    <span className="text-xs text-muted-foreground font-mono w-5">{index + 1}.</span>
                    <span className="font-semibold text-sm flex-1">{STEP_LABELS[step.type]}</span>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-lg leading-none">×</button>
                </div>
                {/* Corps — scrollable */}
                <div className="overflow-y-auto px-4 py-4 flex-1 flex flex-col gap-4">
                    {/* Nom et description */}
                    <div className="flex flex-col gap-2 pb-3 border-b border-border">
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Nom de la sous-requête</label>
                            <input
                                type="text"
                                value={nameValue}
                                onChange={e => onUpdate(index, { ...step, name: e.target.value || undefined })}
                                placeholder={`${getAutoCteName(step, index)} (auto)`}
                                className={`w-full px-2 py-1 text-xs border rounded bg-background font-mono ${nameConflict ? 'border-destructive' : 'border-border'}`}
                                spellCheck={false}
                            />
                            {nameConflict && (
                                <p className="text-xs text-destructive mt-0.5">Ce nom est déjà utilisé par un autre step.</p>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                            <textarea
                                value={descValue}
                                onChange={e => onUpdate(index, { ...step, description: e.target.value || undefined })}
                                placeholder="Description de cette étape…"
                                rows={2}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background resize-none"
                            />
                        </div>
                    </div>
                    {/* Config spécifique au type de step */}
                    <div>
                        {step.type === 'select_columns' && <SelectColumnsStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'exclude_columns' && <ExcludeColumnsStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'change_type' && <ChangeTypeStepUI step={step} availableCols={availableCols} availableColTypes={availableColTypes} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'filter_rows' && <FilterRowsStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} fetchDistinctValues={fetchDistinctValues} />}
                        {step.type === 'sort' && <SortStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'top_n' && <TopNStepUI step={step} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'rename_columns' && <RenameColumnsStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'derive' && <DeriveStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'fill_null' && <FillNullStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'group_by' && <GroupByStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'join' && <JoinStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'union' && <UnionStepUI step={step} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'pivot' && <PivotStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'unpivot' && <UnpivotStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'window' && <WindowStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'unnest' && <UnnestStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'json_extract' && <JsonExtractStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'date_trunc' && <DateTruncStepUI step={step} availableCols={availableCols} onChange={s => onUpdate(index, s)} />}
                        {step.type === 'custom_sql' && <CustomSqlStepUI step={step} onChange={s => onUpdate(index, s)} />}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

// ─── StepItem ─────────────────────────────────────────────────────────────────

function StepItem({ step, index, totalSteps, availableCols, availableColTypes,
    eyeOpen, eyeLoading, onEyeToggle,
    onUpdate, onRemove, onMove,
    configOpen, onConfigOpen, onConfigClose, fetchDistinctValues, otherStepNames }: {
    step: SqlBlockStep; index: number; totalSteps: number
    availableCols: string[]; availableColTypes: Record<string, string>
    eyeOpen: boolean; eyeLoading: boolean
    onEyeToggle: () => void
    onUpdate: (idx: number, s: SqlBlockStep) => void
    onRemove: (idx: number) => void
    onMove: (idx: number, dir: -1 | 1) => void
    configOpen: boolean
    onConfigOpen: () => void
    onConfigClose: () => void
    fetchDistinctValues?: (col: string, limit: number) => Promise<{ values: string[]; hasMore: boolean }>
    otherStepNames: string[]
}) {
    const [pendingDelete, setPendingDelete] = useState(false)
    const summary = stepSummary(step)
    const customName = step.name?.trim()
    const hasDesc = !!step.description?.trim()

    return (
        <>
            <div className="border border-border rounded bg-card text-card-foreground">
                <div className="flex items-center gap-1.5 px-2 py-1.5 select-none">

                    {/* Bouton œil */}
                    <button
                        onClick={e => { e.stopPropagation(); onEyeToggle() }}
                        className={`shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${eyeOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                        title={eyeOpen ? 'Masquer l\'aperçu' : 'Voir l\'aperçu de cette étape'}
                    >
                        {eyeLoading && eyeOpen
                            ? <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                            : <EyeIcon open={eyeOpen} className="w-3.5 h-3.5" />
                        }
                    </button>

                    <span className="text-xs text-muted-foreground font-mono w-4 shrink-0">{index + 1}.</span>
                    {/* Nom + résumé — clic ouvre la config */}
                    <button className="flex-1 text-left min-w-0" onClick={onConfigOpen}>
                        <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs font-medium">{STEP_LABELS[step.type]}</span>
                            {customName && (
                                <span className="text-[10px] font-mono text-primary/80 bg-primary/10 px-1 rounded leading-4 shrink-0" title="Nom de la sous-requête">{customName}</span>
                            )}
                            {hasDesc && !customName && (
                                <span className="text-muted-foreground opacity-60" title={step.description}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                </span>
                            )}
                        </div>
                        {hasDesc ? (
                            <span className="block text-xs text-muted-foreground truncate italic">{step.description}</span>
                        ) : (
                            summary && summary !== '—' && (
                                <span className="block text-xs text-muted-foreground truncate">{summary}</span>
                            )
                        )}
                    </button>

                    <div className="flex items-center gap-0.5 ml-1 shrink-0">
                        {pendingDelete ? (
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-destructive">Supprimer ?</span>
                                <button onClick={() => { onRemove(index); setPendingDelete(false) }}
                                    className="px-1.5 h-5 rounded bg-destructive text-destructive-foreground text-xs">Oui</button>
                                <button onClick={() => setPendingDelete(false)}
                                    className="px-1.5 h-5 rounded border border-border text-xs text-muted-foreground hover:text-foreground">Non</button>
                            </div>
                        ) : (
                            <>
                                {/* Roue crantée — ouvre la modale de config */}
                                <button onClick={onConfigOpen}
                                    className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                                    title="Configurer ce step">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                    </svg>
                                </button>
                                <button onClick={() => onMove(index, -1)} disabled={index === 0}
                                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs" title="Monter">▲</button>
                                <button onClick={() => onMove(index, 1)} disabled={index === totalSteps - 1}
                                    className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs" title="Descendre">▼</button>
                                <button onClick={() => setPendingDelete(true)}
                                    className="text-destructive hover:text-destructive/80 w-5 h-5 flex items-center justify-center text-xs" title="Supprimer ce step">✕</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {configOpen && (
                <StepConfigModal step={step} index={index}
                    availableCols={availableCols} availableColTypes={availableColTypes}
                    onUpdate={onUpdate} onClose={onConfigClose}
                    fetchDistinctValues={fetchDistinctValues}
                    otherStepNames={otherStepNames} />
            )}
        </>
    )
}

// ─── AddStepMenu ──────────────────────────────────────────────────────────────

function defaultStep(type: SqlBlockStep['type']): SqlBlockStep {
    switch (type) {
        case 'select_columns':  return { type, columns: [] }
        case 'exclude_columns': return { type, columns: [] }
        case 'change_type':     return { type, changes: [] }
        case 'filter_rows':     return { type, groups: [{ items: [], logicOp: 'AND', negate: false }], groupLogicOp: 'OR' }
        case 'sort':            return { type, keys: [] }
        case 'top_n':           return { type, mode: 'limit', n: 100 }
        case 'rename_columns':  return { type, renames: [] }
        case 'derive':          return { type, columns: [] }
        case 'fill_null':       return { type, fills: [] }
        case 'group_by':        return { type, groupCols: [], aggregations: [] }
        case 'join':            return { type, rightTable: '', joinType: 'left', on: [], selectRight: '*' }
        case 'union':           return { type, table: '', mode: 'all' }
        case 'pivot':           return { type, onColumn: '', valueColumn: '', valueFn: 'SUM', groupCols: [] }
        case 'unpivot':         return { type, columns: [], nameCol: 'category', valueCol: 'value' }
        case 'window':          return { type, columns: [] }
        case 'unnest':          return { type, column: '', alias: 'item', keepEmpty: false }
        case 'json_extract':    return { type, column: '', extractions: [] }
        case 'date_trunc':      return { type, column: '', granularity: 'month', mode: 'replace' }
        case 'custom_sql':      return { type, sql: 'SELECT * FROM {{subquery}}' }
    }
}

function AddStepModal({ onAdd, availableCols, availableColTypes, fetchDistinctValues, otherStepNames, stepIndex, onOpen }: {
    onAdd: (step: SqlBlockStep) => void
    availableCols: string[]; availableColTypes: Record<string, string>
    fetchDistinctValues?: (col: string, selectLimit: number, fromLimit: number) => Promise<{ values: string[]; hasMore: boolean }>
    otherStepNames: string[]
    stepIndex: number
    onOpen?: () => void
}) {
    const [open, setOpen] = useState(false)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [draftStep, setDraftStep] = useState<SqlBlockStep | null>(null)
    const [search, setSearch] = useState('')
    const searchRef = useRef<HTMLInputElement>(null)

    function handleOpen() {
        setOpen(true)
        setSelectedType(null)
        setDraftStep(null)
        setSearch('')
        onOpen?.()
        setTimeout(() => searchRef.current?.focus(), 50)
    }

    function handleClose() { setOpen(false) }

    function handleSelectType(type: string) {
        setSelectedType(type)
        setDraftStep(defaultStep(type) as SqlBlockStep)
    }

    function handleDraftUpdate(_idx: number, s: SqlBlockStep) { setDraftStep(s) }

    function handleConfirm() {
        if (draftStep) { onAdd(draftStep); setOpen(false) }
    }

    useEffect(() => {
        if (!open) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                if (selectedType) { setSelectedType(null); setDraftStep(null) }
                else setOpen(false)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, selectedType])

    const q = search.toLowerCase().trim()
    const filteredCats = q
        ? [{ label: 'Résultats', steps: STEP_CATEGORIES.flatMap(c => c.steps).filter(t => STEP_LABELS[t].toLowerCase().includes(q)) }]
        : STEP_CATEGORIES

    const nameConflict = !!(draftStep?.name?.trim() && otherStepNames.includes(draftStep.name.trim()))

    return (
        <>
            <button onClick={handleOpen}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-dashed border-border hover:border-primary hover:text-primary text-xs text-muted-foreground transition-colors">
                + Ajouter une étape
            </button>
            {open && createPortal(
                <div className="fixed inset-0 z-[9998] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
                    <div className="relative z-10 bg-popover border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 h-[96vh] flex flex-col">

                        {/* Header */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                            {selectedType && (
                                <button onClick={() => { setSelectedType(null); setDraftStep(null) }}
                                    className="text-muted-foreground hover:text-foreground text-sm px-1 leading-none" title="Changer de type">←</button>
                            )}
                            <span className="font-semibold text-sm flex-1">
                                {selectedType ? STEP_LABELS[selectedType] : 'Ajouter une étape'}
                            </span>
                            <button onClick={handleClose}
                                className="text-muted-foreground hover:text-foreground w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-lg leading-none">×</button>
                        </div>

                        {!selectedType ? (
                            /* ── Phase 1 : sélection du type ── */
                            <>
                                <div className="px-2 py-2 border-b border-border bg-muted/30 shrink-0">
                                    <input ref={searchRef} value={search} onChange={e => setSearch(e.target.value)}
                                        placeholder="Filtrer les traitements…"
                                        className="w-full h-6 rounded border border-border bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                        onKeyDown={e => {
                                            if (e.key === 'Enter' && filteredCats[0]?.steps[0]) handleSelectType(filteredCats[0].steps[0])
                                        }}
                                    />
                                </div>
                                <div className="overflow-y-auto flex-1">
                                    {filteredCats.map(cat => (
                                        <div key={cat.label}>
                                            {(!q || cat.steps.length > 0) && (
                                                <div className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/50 border-b border-border sticky top-0">
                                                    {cat.label}
                                                </div>
                                            )}
                                            {cat.steps.map(type => (
                                                <button key={type}
                                                    className="w-full text-left px-3 py-1.5 hover:bg-muted transition-colors flex items-center gap-2"
                                                    onClick={() => handleSelectType(type)}>
                                                    <span className="text-xs font-medium flex-1">{STEP_LABELS[type]}</span>
                                                </button>
                                            ))}
                                            {q && cat.steps.length === 0 && (
                                                <div className="px-3 py-2 text-xs text-muted-foreground italic">Aucun résultat</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : draftStep ? (
                            /* ── Phase 2 : configuration ── */
                            <>
                                <div className="overflow-y-auto px-4 py-4 flex-1 flex flex-col gap-4">
                                    {/* Nom et description */}
                                    <div className="flex flex-col gap-2 pb-3 border-b border-border">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Nom de la sous-requête</label>
                                            <input type="text"
                                                value={draftStep.name ?? ''}
                                                onChange={e => setDraftStep({ ...draftStep, name: e.target.value || undefined })}
                                                placeholder={`${getAutoCteName(draftStep, stepIndex)} (auto)`}
                                                className={`w-full px-2 py-1 text-xs border rounded bg-background font-mono ${nameConflict ? 'border-destructive' : 'border-border'}`}
                                                spellCheck={false}
                                            />
                                            {nameConflict && <p className="text-xs text-destructive mt-0.5">Ce nom est déjà utilisé par un autre step.</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                                            <textarea
                                                value={draftStep.description ?? ''}
                                                onChange={e => setDraftStep({ ...draftStep, description: e.target.value || undefined })}
                                                placeholder="Description de cette étape…"
                                                rows={2}
                                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background resize-none"
                                            />
                                        </div>
                                    </div>
                                    {/* Config spécifique au type */}
                                    <div>
                                        {draftStep.type === 'select_columns' && <SelectColumnsStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'exclude_columns' && <ExcludeColumnsStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'change_type' && <ChangeTypeStepUI step={draftStep} availableCols={availableCols} availableColTypes={availableColTypes} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'filter_rows' && <FilterRowsStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} fetchDistinctValues={fetchDistinctValues} />}
                                        {draftStep.type === 'sort' && <SortStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'top_n' && <TopNStepUI step={draftStep} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'rename_columns' && <RenameColumnsStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'derive' && <DeriveStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'fill_null' && <FillNullStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'group_by' && <GroupByStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'join' && <JoinStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'union' && <UnionStepUI step={draftStep} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'pivot' && <PivotStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'unpivot' && <UnpivotStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'window' && <WindowStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'unnest' && <UnnestStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'json_extract' && <JsonExtractStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'date_trunc' && <DateTruncStepUI step={draftStep} availableCols={availableCols} onChange={s => handleDraftUpdate(0, s)} />}
                                        {draftStep.type === 'custom_sql' && <CustomSqlStepUI step={draftStep} onChange={s => handleDraftUpdate(0, s)} />}
                                    </div>
                                </div>
                                {/* Footer */}
                                <div className="px-4 py-3 border-t border-border flex justify-end gap-2 shrink-0">
                                    <button onClick={handleClose}
                                        className="px-3 py-1.5 text-xs rounded border border-border hover:bg-muted transition-colors">
                                        Annuler
                                    </button>
                                    <button onClick={handleConfirm} disabled={nameConflict}
                                        className="px-3 py-1.5 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
                                        Ajouter l'étape
                                    </button>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

// ─── SqlPreview (avec SqlMonacoEditor) ────────────────────────────────────────

function SqlPreview({ sql, editable, onEdit, tableSchemas, cellId }: {
    sql: string; editable: boolean; onEdit?: (sql: string) => void
    tableSchemas: any[]; cellId: string
}) {
    const [editMode, setEditMode] = useState(false)
    const [draft, setDraft] = useState(sql)

    // Sync en lecture seule
    useEffect(() => { if (!editMode) setDraft(sql) }, [sql, editMode])

    function handleApply() { onEdit?.(draft); setEditMode(false) }
    function handleCancel() { setDraft(sql); setEditMode(false) }

    return (
        <div className="flex flex-col gap-1 flex-1 min-h-0">
            <div className="flex items-center justify-between h-5 shrink-0">
                {editable && !editMode && (
                    <button onClick={() => { setDraft(sql); setEditMode(true) }}
                        className="text-xs text-muted-foreground hover:text-foreground underline">
                        Éditer manuellement…
                    </button>
                )}
                {editMode && (
                    <div className="flex gap-2">
                        <button onClick={handleApply} className="text-xs text-primary underline">Appliquer</button>
                        <button onClick={handleCancel} className="text-xs text-muted-foreground underline">Annuler</button>
                    </div>
                )}
            </div>
            <div className="flex-1 min-h-0">
                <SqlMonacoEditor
                    key={`${cellId}-sql-${editMode ? 'edit' : 'view'}`}
                    value={editMode ? draft : sql}
                    onChange={editMode ? (v) => setDraft(v ?? '') : undefined}
                    tableSchemas={tableSchemas}
                    className="border border-border rounded overflow-hidden h-full"
                    options={{
                        readOnly: !editMode,
                        minimap: { enabled: false },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        fontSize: 12,
                        renderLineHighlight: 'none',
                        overviewRulerLanes: 0,
                        scrollbar: { vertical: 'auto', alwaysConsumeMouseWheel: false },
                    }}
                    height="100%"
                />
            </div>
        </div>
    )
}

// ─── DegradedBanner ───────────────────────────────────────────────────────────

function DegradedBanner({ onRestore }: { onRestore: () => void }) {
    return (
        <div className="flex items-start gap-2 px-3 py-2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs mb-2">
            <span className="shrink-0 text-base">⚠️</span>
            <div className="flex-1">
                <strong>Mode dégradé</strong> — Le SQL a été édité manuellement et n'est plus compatible avec l'interface visuelle.
            </div>
            <button onClick={onRestore} className="shrink-0 underline hover:no-underline ml-2">
                Tenter la restauration
            </button>
        </div>
    )
}

// ─── IncompatibleConfirmModal ─────────────────────────────────────────────────

function IncompatibleConfirmModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4 p-5">
                <h3 className="text-sm font-semibold mb-2">SQL non compatible avec ce bloc</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Le SQL saisi ne correspond à aucun des patterns reconnus.
                    Voulez-vous continuer en <strong>mode dégradé</strong> (SQL libre, UI désactivée) ?
                </p>
                <div className="flex justify-end gap-2">
                    <button onClick={onCancel} className="px-3 py-1.5 text-xs rounded border border-border hover:bg-muted">Annuler</button>
                    <button onClick={onConfirm} className="px-3 py-1.5 text-xs rounded bg-amber-500 text-white hover:bg-amber-600">Continuer en mode dégradé</button>
                </div>
            </div>
        </div>
    )
}

// ─── ChartPreviewInEditor — aperçu ECharts/KPI dans le panel dtSection ────────

function ChartPreviewInEditor({ cell }: { cell: any }) {
    const { _rev } = useNotebookStore(useShallow(s => ({ _rev: s._rev })))
    const chartRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!chartRef.current || !cell._echartsOption) return
        CDNManager.loadECharts?.().then(() => {
            const echarts = (window as any).echarts
            if (!echarts || !chartRef.current) return
            let chart = echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current)
            chart.clear()
            chart.setOption(cell._echartsOption)
        })
    }, [_rev, cell._echartsOption])

    if (cell._kpiHtml) return <div className="overflow-auto" dangerouslySetInnerHTML={{ __html: cell._kpiHtml }} />
    return <div ref={chartRef} className="flex-1 min-h-0 min-h-[200px]" />
}

// ─── SqlBlockEditor (composant principal) ─────────────────────────────────────

export function SqlBlockEditor({ cell, path, cellIndex, onExitUiMode, fromSqlCell, skipExecution, modalOpen }: { cell: any; path: number[]; cellIndex: number; onExitUiMode?: () => void; fromSqlCell?: boolean; skipExecution?: boolean; modalOpen?: boolean }) {
    const { forceUpdate, _duckdbTables, db, runCellAt } = useNotebookStore(useShallow(s => ({
        forceUpdate: s.forceUpdate,
        _duckdbTables: s._duckdbTables,
        db: s.db,
        runCellAt: s.runCellAt,
    })))

    const cfg: SqlBlockConfig = getOrInitConfig(cell)
    const ast = cfg.ast

    // Schémas par étape (colonnes/types en entrée de chaque step)
    const sourceColumns: { name: string; type: string }[] =
        ast.source ? (_duckdbTables?.[ast.source]?.columns ?? []) : []
    const stepSchemas = computeStepSchemas(ast, sourceColumns)

    // Schémas dynamiques : priorité table temp déjà matérialisée, fallback SQL LIMIT 0
    const { dynamicSchemas, fetchSchemaForStep, invalidateFrom } = useStepInputSchemas(ast, cell._id)

    // tableSchemas pour l'autocomplétion Monaco
    // Sanitize : columns peut être undefined sur certaines entrées → crash forEach dans le provider
    const tableSchemas = (db?.schemaTrees ?? []).map((t: any) => ({ ...t, columns: t?.columns ?? [] }))

    // Œil par étape (aperçus DuckDB)
    const { eyeOpen, toggleEye, loading: eyeLoading, getEyeData } = useStepEyeData(cell, ast, modalOpen)

    // Modal mode dégradé
    const [pendingDegradedSql, setPendingDegradedSql] = useState<string | null>(null)
    const [multiSqlWarning, setMultiSqlWarning] = useState(false)

    // SQL généré visible ?
    const [showSql, setShowSql] = useState(false)

    // Index du step dont la modale de config est ouverte
    const [configOpenIdx, setConfigOpenIdx] = useState<number | null>(null)

    const selectSql = getEffectiveSql(cfg)
    const displaySql = cell.name?.trim()
        ? generateMaterializeQuery(cell.name, selectSql, ast.materialize ?? 'select')
        : selectSql

    // ─── Handlers AST ──────────────────────────────────────────────────────

    const handleSourceChange = useCallback((v: string) => {
        commitAstUpdate(cell, { source: v }, forceUpdate)
    }, [cell, forceUpdate])

    // Auto-sélection de la première table lors de la création d'une cellule sans source
    useEffect(() => {
        if (!ast.source) {
            const tables = Object.keys(_duckdbTables ?? {}).filter(t => !t.startsWith('_sqlblock.'))
            if (tables.length > 0) commitAstUpdate(cell, { source: tables[0] }, forceUpdate)
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Mode de sortie courant : 'select' | 'view' | 'table' | 'visualization'
    const outputMode = ast.chartConfig !== undefined ? 'visualization' : (ast.materialize ?? 'select')

    const handleStepUpdate = useCallback((idx: number, newStep: SqlBlockStep) => {
        invalidateFrom(idx + 1, ast)   // les schémas en aval sont périmés
        commitAstUpdate(cell, { steps: ast.steps.map((s, i) => i === idx ? newStep : s) }, forceUpdate)
    }, [cell, ast, forceUpdate, invalidateFrom])

    const handleStepRemove = useCallback((idx: number) => {
        setConfigOpenIdx(null) // ferme la modale avant de supprimer le step (évite removeChild sur portal)
        commitAstUpdate(cell, { steps: ast.steps.filter((_, i) => i !== idx) }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepMove = useCallback((idx: number, dir: -1 | 1) => {
        setConfigOpenIdx(null) // ferme la modale avant de déplacer le step
        const s = [...ast.steps]; const swap = idx + dir
        if (swap < 0 || swap >= s.length) return
        ;[s[idx], s[swap]] = [s[swap], s[idx]]
        commitAstUpdate(cell, { steps: s }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepAdd = useCallback((step: SqlBlockStep) => {
        const newSteps = [...ast.steps, step]
        commitAstUpdate(cell, { steps: newSteps }, forceUpdate)
        // Pas d'ouverture auto du modal de config — l'étape a déjà été configurée dans AddStepModal
    }, [cell, ast.steps, forceUpdate])

    // Schéma "propre" pour ChartConfigEditor : colonnes AVANT les annotations chart
    // (défini ici avant handleChartConfigChange pour éviter le TDZ dans les deps)
    const stepsKey = useMemo(() => JSON.stringify(ast.steps), [ast.steps])
    const [chartInputSchema, setChartInputSchema] = useState<{ columns: string[]; colTypes: Record<string, string> }>({ columns: [], colTypes: {} })

    const fetchChartSchema = useCallback(async () => {
        if (!ast.source && !ast.steps.length) return
        const cleanAst = { ...ast, chartConfig: undefined }
        const cleanSql = astToSql(cleanAst)
        const bare = cleanSql.trimEnd().replace(/;+\s*$/, '')
        try {
            const conn = DuckDBManager.getConnection()
            if (!conn) return
            const result = await conn.query(`${bare}\nLIMIT 0`)
            const colTypes: Record<string, string> = {}
            for (const field of result.schema.fields) colTypes[field.name] = String(field.type)
            setChartInputSchema({ columns: Object.keys(colTypes), colTypes })
        } catch {
            // Source table peut ne pas encore exister (fichier non chargé) — silencieux
        }
    }, [ast.source, stepsKey]) // eslint-disable-line

    const handleChartConfigChange = useCallback((cfg: ChartConfig | null) => {
        // Invalide le cache des schémas dynamiques : chartConfig change le SQL final
        invalidateFrom(0, ast)
        commitAstUpdate(cell, { chartConfig: cfg ?? undefined }, forceUpdate)
        if (cfg) {
            fetchChartSchema() // Force le fetch des colonnes dès l'activation
            if (!skipExecution) runCellAt(path, cellIndex)
        }
    }, [cell, ast, forceUpdate, invalidateFrom, fetchChartSchema, runCellAt, path, cellIndex, skipExecution])

    const handleOutputModeChange = useCallback(async (mode: string) => {
        // Quitter view/table → supprimer silencieusement l'objet DuckDB existant
        if (cell.name?.trim()) {
            const prev = ast.materialize ?? 'select'
            try {
                if (prev === 'table') {
                    await DuckDBManager.executeQuery(`DROP TABLE IF EXISTS ${quoteId(cell.name)}`)
                } else if (prev === 'view') {
                    await DuckDBManager.executeQuery(`DROP VIEW IF EXISTS ${quoteId(cell.name)}`)
                }
            } catch (_) { /* silencieux */ }
        }
        if (mode === 'visualization') {
            commitAstUpdate(cell, { materialize: 'select', chartConfig: ast.chartConfig ?? { columns: [] } }, forceUpdate)
            fetchChartSchema()
        } else {
            commitAstUpdate(cell, { materialize: mode as SqlBlockMaterialize, chartConfig: undefined }, forceUpdate)
        }
    }, [cell, ast.chartConfig, ast.materialize, forceUpdate, fetchChartSchema])

    // ─── Distinct values pour le filtre (par step) ─────────────────────────
    // Fabrique une fonction fetchDistinctValues qui interroge la sous-requête
    // réelle en entrée du step (stepSql(ast, stepIdx-1)), pas juste ast.source.

    const makeStepDistinctValues = useCallback((stepIdx: number) => {
        return async (column: string, selectLimit: number, fromLimit: number): Promise<{ values: string[]; hasMore: boolean }> => {
            if (!ast.source || !column) return { values: [], hasMore: false }
            try {
                const inputSql = stepIdx === 0
                    ? `SELECT * FROM ${quoteId(ast.source)}`
                    : stepSql(ast, stepIdx - 1)
                if (!inputSql) return { values: [], hasMore: false }
                const col = `"${column.replace(/"/g, '""')}"`
                // Applique le fromLimit en sous-couche pour éviter de scanner toute la table
                const inner = fromLimit > 0
                    ? `(SELECT ${col} FROM (${inputSql}) __fdv__ WHERE ${col} IS NOT NULL LIMIT ${fromLimit}) _sub`
                    : `(${inputSql}) __fdv__ WHERE ${col} IS NOT NULL`
                const sql = selectLimit > 0
                    ? `SELECT DISTINCT ${col} FROM ${inner} ORDER BY 1 LIMIT ${selectLimit + 1}`
                    : `SELECT DISTINCT ${col} FROM ${inner} ORDER BY 1`
                const rows = await DuckDBManager.executeQuery(sql)
                const hasMore = selectLimit > 0 && rows.length > selectLimit
                return { values: rows.slice(0, selectLimit > 0 ? selectLimit : undefined).map(r => String(r[column] ?? '')), hasMore }
            } catch {
                return { values: [], hasMore: false }
            }
        }
    }, [ast])

    // ─── Handlers SQL manuel ───────────────────────────────────────────────

    function handleManualSqlEdit(rawSql: string) {
        const newSql = stripMaterializePrefix(rawSql)
        // Vérification : plusieurs instructions SQL → UI impossible
        const stmts = newSql.split(';').map((s: string) => s.trim()).filter(Boolean)
        if (stmts.length > 1) {
            const cfg = getOrInitConfig(cell)
            cfg.degraded = true; cfg.manualSql = newSql
            cfg.sql = buildDisplaySql(cell.name, newSql, cfg.ast?.materialize ?? 'select')
            setMultiSqlWarning(true)
            forceUpdate()
            return
        }
        setMultiSqlWarning(false)
        const result = sqlToAstSmart(newSql, ast.materialize)
        if (result.compatible && result.ast) {
            const cfg = getOrInitConfig(cell)
            cfg.ast = result.ast; cfg.degraded = false; cfg.manualSql = null
            const genSql = astToSql(result.ast)
            cfg.sql = buildDisplaySql(cell.name, genSql, result.ast.materialize ?? 'select')
            forceUpdate()
        } else {
            setPendingDegradedSql(newSql)
        }
    }

    function confirmDegraded() {
        if (!pendingDegradedSql) return
        const cfg = getOrInitConfig(cell)
        cfg.degraded = true; cfg.manualSql = pendingDegradedSql
        cfg.sql = buildDisplaySql(cell.name, pendingDegradedSql, cfg.ast?.materialize ?? 'select')
        setPendingDegradedSql(null); forceUpdate()
    }

    function tryRestoreFromDegraded() {
        const cfg = getOrInitConfig(cell)
        const sql = stripMaterializePrefix(cfg.manualSql || selectSql)
        // Bloquer la restauration si plusieurs instructions SQL
        const stmts = sql.split(';').map((s: string) => s.trim()).filter(Boolean)
        if (stmts.length > 1) {
            setMultiSqlWarning(true)
            return
        }
        const result = sqlToAstSmart(sql, ast.materialize)
        if (result.compatible && result.ast) {
            cfg.ast = result.ast; cfg.degraded = false; cfg.manualSql = null
            const genSql = astToSql(result.ast)
            cfg.sql = buildDisplaySql(cell.name, genSql, result.ast.materialize ?? 'select')
            forceUpdate()
        } else {
            alert(`Impossible de restaurer l'AST : ${result.error || 'SQL incompatible'}`)
        }
    }

    // ─── Aperçu conditionnel (œil step actif ou résultats cellule) ────────

    const eyeData = eyeOpen !== null ? getEyeData(eyeOpen) : null
    const showingEye = eyeOpen !== null
    const hasResults = cell._results && Array.isArray(cell._results) && cell._results.length > 0
    const hasChart = !!(cell._echartsOption || cell._kpiHtml)

    // Aperçu graphique dans dtSection (remplace le datatable)
    const [chartEyeOpen, setChartEyeOpen] = useState(false)

    // cellule factice pour SqlDataTable quand on affiche un aperçu step
    const displayCell = showingEye && eyeData
        ? { _id: `eye_${eyeOpen}_${cell._id}`, _results: eyeData.rows, _schemaTypes: eyeData.schemaTypes }
        : cell

    // Quand le graphique disparaît, ferme l'aperçu chart
    useEffect(() => { if (chartEyeOpen && !hasChart) setChartEyeOpen(false) }, [hasChart]) // eslint-disable-line

    // Re-fetch quand les étapes changent
    useEffect(() => { fetchChartSchema() }, [stepsKey, ast.source]) // eslint-disable-line

    // Fallback immédiat : si l'async n'a pas encore renvoyé de colonnes, utilise sourceColumns
    // (disponibles dans _duckdbTables sans requête DuckDB — couvre le cas 0 étapes)
    const chartSchema = chartInputSchema.columns.length > 0
        ? chartInputSchema
        : {
            columns: sourceColumns.map(c => c.name),
            colTypes: Object.fromEntries(sourceColumns.map(c => [c.name, c.type])),
        }

    // ─── Layout responsive (ResizeObserver) ─────────────────────────────
    // Breakpoints :
    //   ≥ 680px : [datatable | sql | étapes] côte à côte
    //   440–679 : [sql | étapes] en haut  +  [datatable] en bas
    //   < 440   : [étapes] en haut  +  [datatable + sql] empilés en bas
    const bodyRef = useRef<HTMLDivElement>(null)
    const [bodyWidth, setBodyWidth] = useState(9999)
    useEffect(() => {
        const el = bodyRef.current
        if (!el) return
        const obs = new ResizeObserver(([e]) => setBodyWidth(e.contentRect.width))
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    const layout = bodyWidth >= 680 ? 'wide' : bodyWidth >= 440 ? 'medium' : 'narrow'

    // ─── Render ────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-3 w-full">
            {cfg.degraded && <DegradedBanner onRestore={tryRestoreFromDegraded} />}
            {multiSqlWarning && (
                <div className="flex items-center gap-2 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-3 py-2">
                    <span>⚠️ L'édition du SQL via l'UI n'est possible que si une seule instruction SQL est présente.</span>
                    <button onClick={() => setMultiSqlWarning(false)} className="ml-auto shrink-0 text-yellow-600 hover:text-yellow-900">✕</button>
                </div>
            )}
            {pendingDegradedSql !== null && (
                <IncompatibleConfirmModal onConfirm={confirmDegraded} onCancel={() => setPendingDegradedSql(null)} />
            )}

            {/* Ligne Source + Matérialisation */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
                {onExitUiMode && !fromSqlCell && (
                    <button
                        onClick={() => { setConfigOpenIdx(null); onExitUiMode() }}
                        className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground border border-border rounded hover:bg-muted transition-colors shrink-0"
                        title="Retour à l'éditeur SQL"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        SQL
                    </button>
                )}
                <div className="flex items-center gap-2 flex-1 min-w-40">
                    <label className="text-xs text-muted-foreground shrink-0">Source :</label>
                    {(() => {
                        const mainTables = Object.keys(_duckdbTables ?? {}).filter(t => !t.startsWith('_sqlblock.'))
                        return (
                            <Select value={ast.source || ''} onValueChange={handleSourceChange} disabled={cfg.degraded}>
                                <SelectTrigger className="flex-1 h-7 text-xs font-mono min-w-0">
                                    <SelectValue placeholder="— choisir une source —" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mainTables.map(t => <SelectItem key={t} value={t} className="text-xs font-mono">{t}</SelectItem>)}
                                    {ast.source && !mainTables.includes(ast.source) && (
                                        <SelectItem value={ast.source} className="text-xs font-mono">{ast.source}</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        )
                    })()}
                </div>
                {/* mode SELECT/VIEW/TABLE/VISUALISATION déplacé dans les étapes */}
            </div>

            {/* Corps principal — responsive */}
            {!cfg.degraded ? (() => {
                // ── Sections réutilisables ──────────────────────────────
                const dtSection = (
                    <>
                        {chartEyeOpen && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-xs text-primary font-medium">Aperçu graphique</span>
                                <button onClick={() => setChartEyeOpen(false)} className="ml-auto text-xs text-muted-foreground hover:text-foreground underline">✕ fermer</button>
                            </div>
                        )}
                        {!chartEyeOpen && showingEye && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-xs text-primary font-medium">Aperçu étape {eyeOpen! + 1}</span>
                                {eyeLoading && <svg viewBox="0 0 24 24" className="w-3 h-3 animate-spin text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>}
                                <button onClick={() => toggleEye(eyeOpen!)} className="ml-auto text-xs text-muted-foreground hover:text-foreground underline">✕ fermer</button>
                            </div>
                        )}
                        {chartEyeOpen ? (
                            hasChart
                                ? <ChartPreviewInEditor cell={cell} />
                                : <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">Exécutez la cellule pour voir le graphique</div>
                        ) : showingEye ? (
                            eyeData && eyeData.rows.length > 0
                                ? <SqlDataTable cell={displayCell} />
                                : eyeLoading
                                    ? <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic">Chargement…</div>
                                    : <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">Résultat vide</div>
                        ) : hasResults ? (
                            <SqlDataTable cell={cell} />
                        ) : (
                            <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">Aucun résultat — exécutez la cellule</div>
                        )}
                        {cell._status === 'error' && cell._resultInfo && !showingEye && !chartEyeOpen && (
                            <div className="p-2 rounded bg-destructive/10 text-destructive text-xs shrink-0">{cell._resultInfo}</div>
                        )}
                    </>
                )

                const sqlToggle = (
                    <button onClick={() => setShowSql(s => !s)}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors whitespace-nowrap shrink-0 mb-1">
                        SQL généré <span className="ml-0.5">{showSql ? '▾' : '▸'}</span>
                    </button>
                )
                const sqlPreviewEl = showSql && (
                    <SqlPreview sql={displaySql} editable={true} onEdit={handleManualSqlEdit} tableSchemas={tableSchemas} cellId={cell._id} />
                )

                const n = ast.steps.length
                const newStepInputSchema = dynamicSchemas[n] ?? (
                    n === 0
                        ? { columns: sourceColumns.map(c => c.name), colTypes: Object.fromEntries(sourceColumns.map(c => [c.name, c.type])) }
                        : (stepSchemas[n - 1] ?? { columns: sourceColumns.map(c => c.name), colTypes: {} })
                )
                const stepsSection = (
                    <>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">Étapes</span>
                        {ast.steps.length === 0 && <p className="text-xs text-muted-foreground italic px-1">Aucune étape — SELECT * FROM {ast.source || '…'}</p>}
                        {ast.steps.map((step, idx) => {
                            const staticSchema = stepSchemas[idx] ?? { columns: sourceColumns.map(c => c.name), colTypes: Object.fromEntries(sourceColumns.map(c => [c.name, c.type])) }
                            const schema = dynamicSchemas[idx] ?? staticSchema
                            const otherStepNames = ast.steps.filter((_, i) => i !== idx).map(s => s.name?.trim()).filter(Boolean) as string[]
                            return (
                                <StepItem key={idx} step={step} index={idx} totalSteps={ast.steps.length}
                                    availableCols={schema.columns} availableColTypes={schema.colTypes}
                                    eyeOpen={eyeOpen === idx} eyeLoading={eyeLoading && eyeOpen === idx}
                                    onEyeToggle={() => toggleEye(idx)} onUpdate={handleStepUpdate}
                                    onRemove={handleStepRemove} onMove={handleStepMove}
                                    configOpen={configOpenIdx === idx}
                                    onConfigOpen={() => { setConfigOpenIdx(idx); fetchSchemaForStep(idx) }}
                                    onConfigClose={() => setConfigOpenIdx(null)}
                                    fetchDistinctValues={makeStepDistinctValues(idx)} otherStepNames={otherStepNames}
                                />
                            )
                        })}
                        <AddStepModal onAdd={handleStepAdd}
                            availableCols={newStepInputSchema.columns} availableColTypes={newStepInputSchema.colTypes}
                            fetchDistinctValues={makeStepDistinctValues(n)}
                            otherStepNames={ast.steps.map(s => s.name?.trim()).filter(Boolean) as string[]}
                            stepIndex={n} onOpen={() => fetchSchemaForStep(n)}
                        />
                        {!cfg.degraded && (
                            <div className="flex items-center gap-2 mt-1 shrink-0">
                                <label className="text-xs text-muted-foreground shrink-0">Résultat :</label>
                                <select
                                    value={outputMode}
                                    onChange={e => handleOutputModeChange(e.target.value)}
                                    className="text-xs border border-border rounded px-1 py-0.5 bg-background text-foreground"
                                >
                                    <option value="select">— DATATABLE</option>
                                    <option value="view">VIEW</option>
                                    <option value="table">TABLE</option>
                                    <option value="visualization">VISUALISATION</option>
                                </select>
                            </div>
                        )}
                        {outputMode === 'visualization' && (
                            <ChartConfigEditor
                                chartConfig={ast.chartConfig}
                                availableColumns={chartSchema.columns}
                                availableColTypes={chartSchema.colTypes}
                                onMount={fetchChartSchema}
                                onChange={handleChartConfigChange}
                                eyeOpen={chartEyeOpen}
                                onEyeToggle={() => {
                                    const opening = !chartEyeOpen
                                    setChartEyeOpen(opening)
                                    if (opening) runCellAt(path, cellIndex)
                                }}
                            />
                        )}
                    </>
                )

                // ── Rendu selon la largeur ──────────────────────────────
                if (layout === 'wide') return (
                    <div ref={bodyRef} className="flex flex-row gap-3 min-h-[280px]" style={{ height: 'calc(100% - 40px)' }}>
                        <div className="flex-1 min-w-0 flex flex-col gap-1">{dtSection}</div>
                        <div className={`flex flex-col min-h-0 ${showSql ? 'w-64 shrink-0' : ''}`}>{sqlToggle}{sqlPreviewEl}</div>
                        <div className="flex flex-col gap-2 w-64 shrink-0 overflow-y-auto">{stepsSection}</div>
                    </div>
                )
                if (layout === 'medium') return (
                    <div ref={bodyRef} className="flex flex-col gap-2">
                        <div className="flex flex-row gap-3 min-h-[280px]">
                            <div className={`flex flex-col min-h-0 ${showSql ? 'flex-1 min-w-0' : ''}`}>{sqlToggle}{sqlPreviewEl}</div>
                            <div className="flex flex-col gap-2 w-64 shrink-0 overflow-y-auto">{stepsSection}</div>
                        </div>
                        <div className="flex flex-col gap-1 min-h-[180px]">{dtSection}</div>
                    </div>
                )
                // narrow
                return (
                    <div ref={bodyRef} className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2 overflow-y-auto">{stepsSection}</div>
                        <div className="flex flex-col gap-1 min-h-[180px]">{dtSection}</div>
                        <div className={`flex flex-col ${showSql ? 'min-h-[180px]' : ''}`}>{sqlToggle}{sqlPreviewEl}</div>
                    </div>
                )
            })() : (
                <div className="flex gap-3 min-h-[280px]">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        {hasResults ? (
                            <SqlDataTable cell={cell} />
                        ) : (
                            <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">
                                Aucun résultat — exécutez la cellule
                            </div>
                        )}
                        {cell._status === 'error' && cell._resultInfo && (
                            <div className="p-2 rounded bg-destructive/10 text-destructive text-xs">{cell._resultInfo}</div>
                        )}
                    </div>
                    <div className="w-64 flex flex-col min-h-0">
                        <SqlPreview sql={displaySql} editable={true} onEdit={handleManualSqlEdit}
                            tableSchemas={tableSchemas} cellId={cell._id} />
                    </div>
                </div>
            )}
        </div>
    )
}
