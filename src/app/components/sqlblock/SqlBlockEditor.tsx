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
import { useState, useCallback, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SqlMonacoEditor } from '@sqlrooms/sql-editor'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { DuckDBManager } from '../../../lib/DuckDBManager'
import {
    astToSql,
    sqlToAst,
    getEffectiveSql,
    generateMaterializeQuery,
    stepSql,
} from '../../../lib/SqlBlockService'
import {
    DUCKDB_TYPES,
    STEP_LABELS,
    createDefaultSqlBlockConfig,
} from '../../../lib/SqlBlockTypes'
import type {
    SqlBlockConfig,
    SqlBlockAst,
    SqlBlockStep,
    SelectColumnsStep,
    ExcludeColumnsStep,
    ChangeTypeStep,
    SqlBlockMaterialize,
} from '../../../lib/SqlBlockTypes'
import { SqlDataTable } from '../SqlDataTable'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getOrInitConfig(cell: any): SqlBlockConfig {
    if (!cell.sqlBlockConfig) {
        cell.sqlBlockConfig = createDefaultSqlBlockConfig(cell.sqlBlockConfig?.ast?.source || '')
    }
    return cell.sqlBlockConfig
}

function commitAstUpdate(cell: any, newAst: Partial<SqlBlockAst>, forceUpdate: () => void) {
    const cfg = getOrInitConfig(cell)
    cfg.ast = { ...cfg.ast, ...newAst }
    cfg.degraded = false
    cfg.manualSql = null
    const sql = astToSql(cfg.ast)
    if (!cell.queries) cell.queries = [{ name: 'main', sql, engine: 'sql', clientVisible: false }]
    else cell.queries[0] = { ...cell.queries[0], sql }
    forceUpdate()
}

function stripMaterializePrefix(sql: string): string {
    const m = sql.match(/^CREATE\s+OR\s+REPLACE\s+(?:VIEW|TABLE)\s+(?:"[^"]*"|\S+)\s+AS\s*\(\s*([\s\S]*?)\s*\)\s*;?\s*$/i)
    if (m) return m[1].trim()
    return sql.trim()
}

// ─── computeStepSchemas ───────────────────────────────────────────────────────
// Dérive statiquement le schéma INPUT de chaque étape (colonnes/types disponibles
// en entrée de l'étape i = sortie de l'étape i-1).

interface StepSchema {
    columns: string[]
    colTypes: Record<string, string>
}

function computeStepSchemas(
    ast: SqlBlockAst,
    sourceColumns: { name: string; type: string }[]
): StepSchema[] {
    const schemas: StepSchema[] = []
    let cols = sourceColumns.map(c => c.name)
    let types: Record<string, string> = Object.fromEntries(sourceColumns.map(c => [c.name, c.type]))

    for (const step of ast.steps) {
        // Enregistrer le schéma EN ENTRÉE de cette étape
        schemas.push({ columns: [...cols], colTypes: { ...types } })

        // Calculer la sortie de cette étape (= entrée de la suivante)
        if (step.type === 'select_columns' && step.columns.length > 0) {
            const kept = step.columns.filter(c => cols.includes(c))
            const newTypes: Record<string, string> = {}
            kept.forEach(c => { newTypes[c] = types[c] ?? '' })
            cols = kept
            types = newTypes
        } else if (step.type === 'exclude_columns' && step.columns.length > 0) {
            const excl = new Set(step.columns)
            cols = cols.filter(c => !excl.has(c))
            const newTypes: Record<string, string> = {}
            cols.forEach(c => { newTypes[c] = types[c] ?? '' })
            types = newTypes
        } else if (step.type === 'change_type') {
            for (const change of step.changes) {
                if (cols.includes(change.column)) types[change.column] = change.targetType
            }
        }
    }

    return schemas
}

// ─── useStepEyeData ───────────────────────────────────────────────────────────
// Gère les tables DuckDB intermédiaires _sqlblock."sb_<cellId>_s<i>" (LIMIT 10).
// Hash-based : seules les étapes dont les prédécesseurs ont changé sont recalculées.

interface EyeEntry {
    rows: Record<string, any>[]
    schemaTypes: Record<string, string>
    hash: string
}

const SQLBLOCK_SCHEMA = '_sqlblock'
let sqlblockSchemaEnsured = false

async function ensureSqlblockSchema() {
    if (sqlblockSchemaEnsured) return
    await DuckDBManager.executeQuery(`CREATE SCHEMA IF NOT EXISTS "${SQLBLOCK_SCHEMA}"`)
    sqlblockSchemaEnsured = true
}

function useStepEyeData(cell: any, ast: SqlBlockAst) {
    const [eyeOpen, setEyeOpenState] = useState<number | null>(null)
    const [loading, setLoading] = useState(false)
    const [, bumpRender] = useState(0)

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

    function tableRef(idx: number): string {
        const safeId = cellRef.current._id.replace(/[^a-zA-Z0-9]/g, '_')
        const name = `sb_${safeId}_s${idx < 0 ? 'src' : idx}`
        return `"${SQLBLOCK_SCHEMA}"."${name}"`
    }

    async function doLoad(idx: number) {
        const hash = getHash(idx)
        if (cache.current.get(idx)?.hash === hash) return  // Cache valide

        setLoading(true)
        try {
            await ensureSqlblockSchema()
            const ast = astRef.current
            const tRef = tableRef(idx)
            const sql = stepSql(ast, idx)
            await DuckDBManager.executeQuery(
                `CREATE OR REPLACE TABLE ${tRef} AS (${sql} LIMIT 10)`
            )
            const { rows, schemaTypes } = await DuckDBManager.executeQueryWithSchema(
                `SELECT * FROM ${tRef}`
            )
            cache.current.set(idx, { rows, schemaTypes: schemaTypes || {}, hash })
            bumpRender(n => n + 1)
        } catch (err) {
            console.warn('[sqlblock eye]', err)
        } finally {
            setLoading(false)
        }
    }

    function toggleEye(idx: number) {
        const next = eyeOpenRef.current === idx ? null : idx
        eyeOpenRef.current = next
        setEyeOpenState(next)
        if (next !== null) doLoad(next)
    }

    // Auto-refresh si l'œil est ouvert et que les prédécesseurs changent
    const upstreamKey = eyeOpen !== null
        ? JSON.stringify([ast.source, ...ast.steps.slice(0, eyeOpen + 1)])
        : null

    useEffect(() => {
        if (eyeOpen === null) return
        doLoad(eyeOpen)
    }, [upstreamKey, eyeOpen])

    return {
        eyeOpen,
        toggleEye,
        loading,
        getEyeData: (idx: number): EyeEntry | null => cache.current.get(idx) ?? null,
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

// ─── StepItem ─────────────────────────────────────────────────────────────────

function StepItem({ step, index, totalSteps, availableCols, availableColTypes,
    eyeOpen, eyeLoading, onEyeToggle,
    onUpdate, onRemove, onMove }: {
    step: SqlBlockStep; index: number; totalSteps: number
    availableCols: string[]; availableColTypes: Record<string, string>
    eyeOpen: boolean; eyeLoading: boolean
    onEyeToggle: () => void
    onUpdate: (idx: number, s: SqlBlockStep) => void
    onRemove: (idx: number) => void
    onMove: (idx: number, dir: -1 | 1) => void
}) {
    const [open, setOpen] = useState(true)
    const [pendingDelete, setPendingDelete] = useState(false)

    return (
        <div className="border border-border rounded bg-card text-card-foreground">
            {/* Header */}
            <div className="flex items-center gap-1.5 px-2 py-1.5 cursor-pointer select-none"
                onClick={() => !pendingDelete && setOpen(o => !o)}>

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
                <span className="flex-1 text-xs font-medium">{STEP_LABELS[step.type]}</span>

                <div className="flex items-center gap-1 ml-auto" onClick={e => e.stopPropagation()}>
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
                            <button onClick={() => onMove(index, -1)} disabled={index === 0}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs" title="Monter">▲</button>
                            <button onClick={() => onMove(index, 1)} disabled={index === totalSteps - 1}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs" title="Descendre">▼</button>
                            <button onClick={() => setPendingDelete(true)}
                                className="text-destructive hover:text-destructive/80 w-5 h-5 flex items-center justify-center text-xs" title="Supprimer ce step">✕</button>
                            <span className="text-muted-foreground text-xs ml-1">{open ? '▾' : '▸'}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Corps step */}
            {open && !pendingDelete && (
                <div className="px-3 pb-3 pt-1 border-t border-border">
                    {step.type === 'select_columns' && (
                        <SelectColumnsStepUI step={step} availableCols={availableCols}
                            onChange={s => onUpdate(index, s)} />
                    )}
                    {step.type === 'exclude_columns' && (
                        <ExcludeColumnsStepUI step={step} availableCols={availableCols}
                            onChange={s => onUpdate(index, s)} />
                    )}
                    {step.type === 'change_type' && (
                        <ChangeTypeStepUI step={step} availableCols={availableCols}
                            availableColTypes={availableColTypes} onChange={s => onUpdate(index, s)} />
                    )}
                </div>
            )}
        </div>
    )
}

// ─── AddStepMenu ──────────────────────────────────────────────────────────────

const STEP_TYPES: Array<{ type: SqlBlockStep['type']; label: string; description: string }> = [
    { type: 'select_columns', label: 'Sélectionner des colonnes', description: 'Garde uniquement les colonnes choisies' },
    { type: 'exclude_columns', label: 'Exclure des colonnes', description: 'Retire les colonnes choisies' },
    { type: 'change_type', label: 'Changer le type', description: 'Convertit le type d\'une ou plusieurs colonnes' },
]

function defaultStep(type: SqlBlockStep['type']): SqlBlockStep {
    switch (type) {
        case 'select_columns': return { type, columns: [] }
        case 'exclude_columns': return { type, columns: [] }
        case 'change_type': return { type, changes: [] }
    }
}

function AddStepMenu({ onAdd }: { onAdd: (step: SqlBlockStep) => void }) {
    const [open, setOpen] = useState(false)
    const [menuRect, setMenuRect] = useState<DOMRect | null>(null)
    const btnRef = useRef<HTMLButtonElement>(null)
    const menuRef = useRef<HTMLDivElement>(null)

    function handleToggle() {
        if (!open && btnRef.current) setMenuRect(btnRef.current.getBoundingClientRect())
        setOpen(o => !o)
    }

    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (
                menuRef.current && !menuRef.current.contains(e.target as Node) &&
                btnRef.current && !btnRef.current.contains(e.target as Node)
            ) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    const menuStyle: React.CSSProperties = menuRect ? {
        position: 'fixed', top: menuRect.bottom + 4,
        left: menuRect.left, width: menuRect.width, zIndex: 9999,
    } : {}

    return (
        <>
            <button ref={btnRef} onClick={handleToggle}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-dashed border-border hover:border-primary hover:text-primary text-xs text-muted-foreground transition-colors">
                + Ajouter un step
            </button>
            {open && menuRect && createPortal(
                <div ref={menuRef} style={menuStyle}
                    className="bg-popover border border-border rounded shadow-lg overflow-hidden">
                    {STEP_TYPES.map(s => (
                        <button key={s.type} className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                            onClick={() => { onAdd(defaultStep(s.type)); setOpen(false) }}>
                            <div className="text-xs font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">{s.description}</div>
                        </button>
                    ))}
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

// ─── SqlBlockEditor (composant principal) ─────────────────────────────────────

export function SqlBlockEditor({ cell, path, cellIndex }: { cell: any; path: number[]; cellIndex: number }) {
    const { forceUpdate, _duckdbTables, db } = useNotebookStore(useShallow(s => ({
        forceUpdate: s.forceUpdate,
        _duckdbTables: s._duckdbTables,
        db: s.db,
    })))

    const cfg: SqlBlockConfig = getOrInitConfig(cell)
    const ast = cfg.ast

    // Schémas par étape (colonnes/types en entrée de chaque step)
    const sourceColumns: { name: string; type: string }[] =
        ast.source ? (_duckdbTables?.[ast.source]?.columns ?? []) : []
    const stepSchemas = computeStepSchemas(ast, sourceColumns)

    // tableSchemas pour l'autocomplétion Monaco
    const tableSchemas = db?.schemaTrees ?? []

    // Œil par étape (aperçus DuckDB)
    const { eyeOpen, toggleEye, loading: eyeLoading, getEyeData } = useStepEyeData(cell, ast)

    // Modal mode dégradé
    const [pendingDegradedSql, setPendingDegradedSql] = useState<string | null>(null)

    // SQL généré visible ?
    const [showSql, setShowSql] = useState(false)

    const selectSql = getEffectiveSql(cfg)
    const displaySql = cell.name?.trim()
        ? generateMaterializeQuery(cell.name, selectSql, ast.materialize ?? 'view')
        : selectSql

    // ─── Handlers AST ──────────────────────────────────────────────────────

    const handleSourceChange = useCallback((v: string) => {
        commitAstUpdate(cell, { source: v }, forceUpdate)
    }, [cell, forceUpdate])

    const handleMaterializeChange = useCallback((mat: SqlBlockMaterialize) => {
        commitAstUpdate(cell, { materialize: mat }, forceUpdate)
    }, [cell, forceUpdate])

    const handleStepUpdate = useCallback((idx: number, newStep: SqlBlockStep) => {
        commitAstUpdate(cell, { steps: ast.steps.map((s, i) => i === idx ? newStep : s) }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepRemove = useCallback((idx: number) => {
        commitAstUpdate(cell, { steps: ast.steps.filter((_, i) => i !== idx) }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepMove = useCallback((idx: number, dir: -1 | 1) => {
        const s = [...ast.steps]; const swap = idx + dir
        if (swap < 0 || swap >= s.length) return
        ;[s[idx], s[swap]] = [s[swap], s[idx]]
        commitAstUpdate(cell, { steps: s }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepAdd = useCallback((step: SqlBlockStep) => {
        commitAstUpdate(cell, { steps: [...ast.steps, step] }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    // ─── Handlers SQL manuel ───────────────────────────────────────────────

    function handleManualSqlEdit(rawSql: string) {
        const newSql = stripMaterializePrefix(rawSql)
        const result = sqlToAst(newSql, ast.materialize)
        if (result.compatible && result.ast) {
            const cfg = getOrInitConfig(cell)
            cfg.ast = result.ast; cfg.degraded = false; cfg.manualSql = null
            if (!cell.queries) cell.queries = [{ name: 'main', sql: newSql, engine: 'sql', clientVisible: false }]
            else cell.queries[0] = { ...cell.queries[0], sql: newSql }
            forceUpdate()
        } else {
            setPendingDegradedSql(newSql)
        }
    }

    function confirmDegraded() {
        if (!pendingDegradedSql) return
        const cfg = getOrInitConfig(cell)
        cfg.degraded = true; cfg.manualSql = pendingDegradedSql
        if (!cell.queries) cell.queries = [{ name: 'main', sql: pendingDegradedSql, engine: 'sql', clientVisible: false }]
        else cell.queries[0] = { ...cell.queries[0], sql: pendingDegradedSql }
        setPendingDegradedSql(null); forceUpdate()
    }

    function tryRestoreFromDegraded() {
        const cfg = getOrInitConfig(cell)
        const sql = stripMaterializePrefix(cfg.manualSql || selectSql)
        const result = sqlToAst(sql, ast.materialize)
        if (result.compatible && result.ast) {
            cfg.ast = result.ast; cfg.degraded = false; cfg.manualSql = null
            const genSql = astToSql(result.ast)
            if (!cell.queries) cell.queries = [{ name: 'main', sql: genSql, engine: 'sql', clientVisible: false }]
            else cell.queries[0] = { ...cell.queries[0], sql: genSql }
            forceUpdate()
        } else {
            alert(`Impossible de restaurer l'AST : ${result.error || 'SQL incompatible'}`)
        }
    }

    // ─── Aperçu conditionnel (œil step actif ou résultats cellule) ────────

    const eyeData = eyeOpen !== null ? getEyeData(eyeOpen) : null
    const showingEye = eyeOpen !== null
    const hasResults = cell._results && Array.isArray(cell._results) && cell._results.length > 0

    // cellule factice pour SqlDataTable quand on affiche un aperçu step
    const displayCell = showingEye && eyeData
        ? { _id: `eye_${eyeOpen}_${cell._id}`, _results: eyeData.rows, _schemaTypes: eyeData.schemaTypes }
        : cell

    // ─── Render ────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-3 w-full">
            {cfg.degraded && <DegradedBanner onRestore={tryRestoreFromDegraded} />}
            {pendingDegradedSql !== null && (
                <IncompatibleConfirmModal onConfirm={confirmDegraded} onCancel={() => setPendingDegradedSql(null)} />
            )}

            {/* Ligne Source + Matérialisation */}
            <div className="flex items-center gap-3 flex-wrap shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-40">
                    <label className="text-xs text-muted-foreground shrink-0">Source :</label>
                    <input type="text"
                        className="flex-1 h-7 rounded border border-border bg-background px-2 text-xs font-mono"
                        value={ast.source}
                        onChange={e => handleSourceChange(e.target.value)}
                        placeholder="nom_de_table"
                        list={`sqlblock-source-list-${cell._id}`}
                        disabled={cfg.degraded}
                    />
                    <datalist id={`sqlblock-source-list-${cell._id}`}>
                        {Object.keys(_duckdbTables ?? {}).map(t => <option key={t} value={t} />)}
                    </datalist>
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground shrink-0">Résultat :</label>
                    <div className="flex rounded border border-border overflow-hidden text-xs">
                        <button onClick={() => handleMaterializeChange('view')} disabled={cfg.degraded}
                            className={`px-2 py-1 transition-colors ${ast.materialize === 'view' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                            title="Vue DuckDB (lazy)">VIEW</button>
                        <button onClick={() => handleMaterializeChange('table')} disabled={cfg.degraded}
                            className={`px-2 py-1 transition-colors ${ast.materialize === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                            title="TABLE matérialisée">TABLE</button>
                    </div>
                </div>
            </div>

            {/* Corps principal — hauteur étirée */}
            {!cfg.degraded ? (
                <div className="flex gap-3 min-h-[280px]" style={{ height: 'calc(100% - 40px)' }}>

                    {/* Colonne gauche : DataTable (résultat cell ou aperçu step) */}
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        {showingEye && (
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-xs text-primary font-medium">
                                    Aperçu étape {eyeOpen! + 1}
                                </span>
                                {eyeLoading && (
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 animate-spin text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                )}
                                <button onClick={() => toggleEye(eyeOpen!)}
                                    className="ml-auto text-xs text-muted-foreground hover:text-foreground underline">
                                    ✕ fermer
                                </button>
                            </div>
                        )}
                        {showingEye ? (
                            eyeData && eyeData.rows.length > 0
                                ? <SqlDataTable cell={displayCell} />
                                : eyeLoading
                                    ? <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic">Chargement…</div>
                                    : <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">Résultat vide</div>
                        ) : hasResults ? (
                            <>
                                {cell._resultInfo && <div className="text-xs text-muted-foreground shrink-0">{cell._resultInfo}</div>}
                                <SqlDataTable cell={cell} />
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-16 text-xs text-muted-foreground italic border border-dashed border-border rounded">
                                Aucun résultat — exécutez la cellule
                            </div>
                        )}
                        {cell._status === 'error' && cell._resultInfo && !showingEye && (
                            <div className="p-2 rounded bg-destructive/10 text-destructive text-xs shrink-0">{cell._resultInfo}</div>
                        )}
                    </div>

                    {/* Colonne SQL Monaco (toggle, étirée) */}
                    <div className={`flex flex-col min-h-0 ${showSql ? 'w-64 shrink-0' : ''}`}>
                        <button onClick={() => setShowSql(s => !s)}
                            className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors whitespace-nowrap shrink-0 mb-1">
                            SQL généré <span className="ml-0.5">{showSql ? '▾' : '▸'}</span>
                        </button>
                        {showSql && (
                            <SqlPreview
                                sql={displaySql}
                                editable={true}
                                onEdit={handleManualSqlEdit}
                                tableSchemas={tableSchemas}
                                cellId={cell._id}
                            />
                        )}
                    </div>

                    {/* Colonne Steps */}
                    <div className="flex flex-col gap-2 w-64 shrink-0 overflow-y-auto">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0">Steps</span>
                        {ast.steps.length === 0 && (
                            <p className="text-xs text-muted-foreground italic px-1">
                                Aucun step — SELECT * FROM {ast.source || '…'}
                            </p>
                        )}
                        {ast.steps.map((step, idx) => {
                            const schema = stepSchemas[idx] ?? { columns: sourceColumns.map(c => c.name), colTypes: Object.fromEntries(sourceColumns.map(c => [c.name, c.type])) }
                            return (
                                <StepItem
                                    key={idx}
                                    step={step} index={idx} totalSteps={ast.steps.length}
                                    availableCols={schema.columns}
                                    availableColTypes={schema.colTypes}
                                    eyeOpen={eyeOpen === idx}
                                    eyeLoading={eyeLoading && eyeOpen === idx}
                                    onEyeToggle={() => toggleEye(idx)}
                                    onUpdate={handleStepUpdate}
                                    onRemove={handleStepRemove}
                                    onMove={handleStepMove}
                                />
                            )
                        })}
                        <AddStepMenu onAdd={handleStepAdd} />
                    </div>
                </div>
            ) : (
                <div className="flex gap-3 min-h-[280px]">
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                        {hasResults ? (
                            <>
                                {cell._resultInfo && <div className="text-xs text-muted-foreground shrink-0">{cell._resultInfo}</div>}
                                <SqlDataTable cell={cell} />
                            </>
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
