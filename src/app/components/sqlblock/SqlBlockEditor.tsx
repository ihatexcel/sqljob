// @ts-nocheck
/**
 * SqlBlockEditor — Éditeur visuel pour les cellules de type sqlBlock.
 *
 * Architecture : sql <-> ast <-> ui
 * L'AST est la source de vérité. Le SQL est généré depuis l'AST (ou édité
 * manuellement en mode dégradé). Toute modification UI met à jour l'AST puis
 * régénère le SQL.
 *
 * Mode dégradé : si l'utilisateur édite le SQL manuellement et qu'il n'est plus
 * compatible avec l'UI, un avertissement s'affiche et seul l'éditeur SQL reste actif.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useNotebookStore } from '../../store/notebookStore'
import { astToSql, sqlToAst, getEffectiveSql } from '../../../lib/SqlBlockService'
import {
    DUCKDB_TYPES,
    STEP_LABELS,
    STEP_ICONS,
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

/** Met à jour la config + régénère le SQL dans queries.main.sql + force re-render */
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

// ─── ColumnCheckbox ───────────────────────────────────────────────────────────

function ColumnCheckbox({ col, checked, onChange }: { col: string; checked: boolean; onChange: (c: string, v: boolean) => void }) {
    return (
        <label className="flex items-center gap-2 cursor-pointer px-2 py-0.5 rounded hover:bg-muted/50">
            <input
                type="checkbox"
                className="rounded border-border w-3.5 h-3.5 accent-primary"
                checked={checked}
                onChange={e => onChange(col, e.target.checked)}
            />
            <span className="text-xs font-mono text-foreground">{col}</span>
        </label>
    )
}

// ─── SelectColumnsStepUI ──────────────────────────────────────────────────────

function SelectColumnsStepUI({ step, availableCols, onChange }: {
    step: SelectColumnsStep
    availableCols: string[]
    onChange: (newStep: SelectColumnsStep) => void
}) {
    const all = availableCols.length > 0 ? availableCols : step.columns
    const selected = new Set(step.columns)

    function toggle(col: string, checked: boolean) {
        const newCols = checked
            ? [...step.columns, col].filter((c, i, arr) => arr.indexOf(c) === i)
            : step.columns.filter(c => c !== col)
        onChange({ ...step, columns: newCols })
    }

    function selectAll() { onChange({ ...step, columns: [...all] }) }
    function selectNone() { onChange({ ...step, columns: [] }) }

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <button onClick={selectAll} className="underline hover:text-foreground">tout</button>
                <span>/</span>
                <button onClick={selectNone} className="underline hover:text-foreground">aucun</button>
                <span className="ml-auto">{step.columns.length}/{all.length} col.</span>
            </div>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0 border border-border rounded bg-background">
                {all.length === 0 && (
                    <p className="text-xs text-muted-foreground p-2 italic">
                        Aucune colonne disponible — exécutez la source d'abord
                    </p>
                )}
                {all.map(col => (
                    <ColumnCheckbox
                        key={col}
                        col={col}
                        checked={selected.has(col)}
                        onChange={toggle}
                    />
                ))}
            </div>
        </div>
    )
}

// ─── ExcludeColumnsStepUI ─────────────────────────────────────────────────────

function ExcludeColumnsStepUI({ step, availableCols, onChange }: {
    step: ExcludeColumnsStep
    availableCols: string[]
    onChange: (newStep: ExcludeColumnsStep) => void
}) {
    const all = availableCols.length > 0 ? availableCols : step.columns
    const excluded = new Set(step.columns)

    function toggle(col: string, checked: boolean) {
        const newCols = checked
            ? [...step.columns, col].filter((c, i, arr) => arr.indexOf(c) === i)
            : step.columns.filter(c => c !== col)
        onChange({ ...step, columns: newCols })
    }

    return (
        <div className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground mb-1">
                Colonnes à exclure ({step.columns.length} sélectionnée{step.columns.length > 1 ? 's' : ''})
            </p>
            <div className="max-h-48 overflow-y-auto flex flex-col gap-0 border border-border rounded bg-background">
                {all.length === 0 && (
                    <p className="text-xs text-muted-foreground p-2 italic">
                        Aucune colonne disponible — exécutez la source d'abord
                    </p>
                )}
                {all.map(col => (
                    <ColumnCheckbox
                        key={col}
                        col={col}
                        checked={excluded.has(col)}
                        onChange={toggle}
                    />
                ))}
            </div>
        </div>
    )
}

// ─── ChangeTypeStepUI ─────────────────────────────────────────────────────────

function ChangeTypeStepUI({ step, availableCols, availableColTypes, onChange }: {
    step: ChangeTypeStep
    availableCols: string[]
    availableColTypes: Record<string, string>
    onChange: (newStep: ChangeTypeStep) => void
}) {
    const [addCol, setAddCol] = useState('')
    const [addType, setAddType] = useState('VARCHAR')

    const allCols = availableCols.length > 0 ? availableCols : step.changes.map(c => c.column)

    function updateChange(idx: number, field: 'column' | 'targetType', value: string) {
        const newChanges = step.changes.map((c, i) => i === idx ? { ...c, [field]: value } : c)
        onChange({ ...step, changes: newChanges })
    }

    function removeChange(idx: number) {
        onChange({ ...step, changes: step.changes.filter((_, i) => i !== idx) })
    }

    function addChange() {
        if (!addCol) return
        onChange({ ...step, changes: [...step.changes, { column: addCol, targetType: addType }] })
        setAddCol('')
    }

    return (
        <div className="flex flex-col gap-0 divide-y divide-border">
            {step.changes.map((change, idx) => (
                /* Chaque conversion : 2 lignes empilées */
                <div key={idx} className="flex flex-col gap-1 py-2 first:pt-0">
                    {/* Ligne 1 : colonne source + bouton supprimer */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground shrink-0 w-4">col</span>
                        <select
                            className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                            value={change.column}
                            onChange={e => updateChange(idx, 'column', e.target.value)}
                        >
                            {allCols.map(c => <option key={c} value={c}>{c}</option>)}
                            {!allCols.includes(change.column) && (
                                <option value={change.column}>{change.column}</option>
                            )}
                        </select>
                        <button
                            onClick={() => removeChange(idx)}
                            className="shrink-0 text-destructive hover:text-destructive/80 w-5 h-5 flex items-center justify-center"
                            title="Supprimer"
                        >✕</button>
                    </div>
                    {/* Ligne 2 : type cible */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs text-muted-foreground shrink-0 w-4">→</span>
                        <select
                            className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                            value={change.targetType}
                            onChange={e => updateChange(idx, 'targetType', e.target.value)}
                        >
                            {DUCKDB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        {/* Alignement avec le bouton de la ligne 1 */}
                        <span className="shrink-0 w-5" />
                    </div>
                </div>
            ))}

            {/* Bloc ajout */}
            <div className="flex flex-col gap-1.5 pt-2">
                {/* Ligne 1 : sélection colonne */}
                <select
                    className="w-full h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                    value={addCol}
                    onChange={e => setAddCol(e.target.value)}
                >
                    <option value="">— choisir une colonne —</option>
                    {allCols.map(c => (
                        <option key={c} value={c}>
                            {c}{availableColTypes[c] ? ` (${availableColTypes[c]})` : ''}
                        </option>
                    ))}
                </select>
                {/* Ligne 2 : type cible + bouton ajouter */}
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground shrink-0 w-4">→</span>
                    <select
                        className="flex-1 min-w-0 h-6 rounded border border-border bg-background px-1 text-xs font-mono"
                        value={addType}
                        onChange={e => setAddType(e.target.value)}
                    >
                        {DUCKDB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <button
                        onClick={addChange}
                        disabled={!addCol}
                        className="shrink-0 px-2 h-6 rounded bg-primary text-primary-foreground text-xs disabled:opacity-50 whitespace-nowrap"
                    >+ Ajouter</button>
                </div>
            </div>
        </div>
    )
}

// ─── StepItem ─────────────────────────────────────────────────────────────────

function StepItem({ step, index, totalSteps, availableCols, availableColTypes, onUpdate, onRemove, onMove }: {
    step: SqlBlockStep
    index: number
    totalSteps: number
    availableCols: string[]
    availableColTypes: Record<string, string>
    onUpdate: (idx: number, newStep: SqlBlockStep) => void
    onRemove: (idx: number) => void
    onMove: (idx: number, dir: -1 | 1) => void
}) {
    const [open, setOpen] = useState(true)

    return (
        <div className="border border-border rounded bg-card text-card-foreground">
            <div className="flex items-center gap-2 px-2 py-1.5 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
                <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">{index + 1}.</span>
                <span className="flex-1 text-xs font-medium">{STEP_LABELS[step.type]}</span>
                <div className="flex items-center gap-1 ml-auto" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => onMove(index, -1)}
                        disabled={index === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs"
                        title="Monter"
                    >▲</button>
                    <button
                        onClick={() => onMove(index, 1)}
                        disabled={index === totalSteps - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 w-5 h-5 flex items-center justify-center text-xs"
                        title="Descendre"
                    >▼</button>
                    <button
                        onClick={() => onRemove(index)}
                        className="text-destructive hover:text-destructive/80 w-5 h-5 flex items-center justify-center text-xs"
                        title="Supprimer ce step"
                    >✕</button>
                    <span className="text-muted-foreground text-xs ml-1">{open ? '▾' : '▸'}</span>
                </div>
            </div>
            {open && (
                <div className="px-3 pb-3 pt-1 border-t border-border">
                    {step.type === 'select_columns' && (
                        <SelectColumnsStepUI
                            step={step}
                            availableCols={availableCols}
                            onChange={s => onUpdate(index, s)}
                        />
                    )}
                    {step.type === 'exclude_columns' && (
                        <ExcludeColumnsStepUI
                            step={step}
                            availableCols={availableCols}
                            onChange={s => onUpdate(index, s)}
                        />
                    )}
                    {step.type === 'change_type' && (
                        <ChangeTypeStepUI
                            step={step}
                            availableCols={availableCols}
                            availableColTypes={availableColTypes}
                            onChange={s => onUpdate(index, s)}
                        />
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
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [open])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-dashed border-border hover:border-primary hover:text-primary text-xs text-muted-foreground transition-colors"
            >
                <span>+ Ajouter un step</span>
            </button>
            {open && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded shadow-lg overflow-hidden">
                    {STEP_TYPES.map(s => (
                        <button
                            key={s.type}
                            className="w-full text-left px-3 py-2 hover:bg-muted transition-colors"
                            onClick={() => { onAdd(defaultStep(s.type)); setOpen(false) }}
                        >
                            <div className="text-xs font-medium">{s.label}</div>
                            <div className="text-xs text-muted-foreground">{s.description}</div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

// ─── SqlPreview ───────────────────────────────────────────────────────────────

function SqlPreview({ sql, editable, onEdit }: { sql: string; editable: boolean; onEdit?: (sql: string) => void }) {
    const [editing, setEditing] = useState(false)
    const [draft, setDraft] = useState(sql)
    const taRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (!editing) setDraft(sql)
    }, [sql, editing])

    function handleEdit() {
        setDraft(sql)
        setEditing(true)
        setTimeout(() => taRef.current?.focus(), 50)
    }

    function handleConfirm() {
        onEdit?.(draft)
        setEditing(false)
    }

    function handleCancel() {
        setDraft(sql)
        setEditing(false)
    }

    return (
        <div className="flex flex-col gap-1 h-full">
            <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">SQL généré</span>
                {editable && !editing && (
                    <button
                        onClick={handleEdit}
                        className="text-xs text-muted-foreground hover:text-foreground underline"
                    >Éditer manuellement…</button>
                )}
                {editing && (
                    <div className="flex gap-2">
                        <button onClick={handleConfirm} className="text-xs text-primary underline">Appliquer</button>
                        <button onClick={handleCancel} className="text-xs text-muted-foreground underline">Annuler</button>
                    </div>
                )}
            </div>
            {editing ? (
                <textarea
                    ref={taRef}
                    className="flex-1 min-h-32 w-full font-mono text-xs p-2 rounded border border-border bg-background resize-y focus:outline-none focus:ring-1 focus:ring-ring"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    spellCheck={false}
                />
            ) : (
                <pre className="flex-1 min-h-32 text-xs font-mono p-2 rounded bg-muted/40 text-foreground overflow-auto whitespace-pre-wrap break-all">
                    {sql || <span className="text-muted-foreground italic">— vide —</span>}
                </pre>
            )}
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
                Seul l'éditeur SQL est actif.
            </div>
            <button
                onClick={onRestore}
                className="shrink-0 underline hover:no-underline ml-2"
                title="Réinitialiser l'AST depuis le SQL actuel si possible"
            >Tenter la restauration</button>
        </div>
    )
}

// ─── IncompatibleConfirmModal ──────────────────────────────────────────────────

function IncompatibleConfirmModal({ sql, onConfirm, onCancel }: {
    sql: string
    onConfirm: () => void
    onCancel: () => void
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background border border-border rounded-lg shadow-xl max-w-md w-full mx-4 p-5">
                <h3 className="text-sm font-semibold mb-2">SQL non compatible avec ce bloc</h3>
                <p className="text-xs text-muted-foreground mb-4">
                    Le SQL saisi ne correspond à aucun des patterns reconnus par ce bloc.
                    Voulez-vous continuer en <strong>mode dégradé</strong> (SQL libre, UI désactivée) ?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-xs rounded border border-border hover:bg-muted"
                    >Annuler</button>
                    <button
                        onClick={onConfirm}
                        className="px-3 py-1.5 text-xs rounded bg-amber-500 text-white hover:bg-amber-600"
                    >Continuer en mode dégradé</button>
                </div>
            </div>
        </div>
    )
}

// ─── SqlBlockEditor (composant principal) ─────────────────────────────────────

export function SqlBlockEditor({ cell, path, cellIndex }: { cell: any; path: number[]; cellIndex: number }) {
    const { devMode, forceUpdate, _duckdbTables, runCellAt } = useNotebookStore(useShallow(s => ({
        devMode: s.devMode,
        forceUpdate: s.forceUpdate,
        _duckdbTables: s._duckdbTables,
        runCellAt: s.runCellAt,
    })))

    // S'assurer que la config est initialisée
    const cfg: SqlBlockConfig = getOrInitConfig(cell)
    const ast = cfg.ast

    // Colonnes disponibles depuis le schéma DuckDB
    const sourceInfo = ast.source ? _duckdbTables?.[ast.source] : null
    const availableCols: string[] = sourceInfo?.columns?.map((c: any) => c.name) ?? []
    const availableColTypes: Record<string, string> = Object.fromEntries(
        (sourceInfo?.columns ?? []).map((c: any) => [c.name, c.type])
    )

    // Modal confirmation mode dégradé
    const [pendingDegradedSql, setPendingDegradedSql] = useState<string | null>(null)

    // SQL courant
    const currentSql = getEffectiveSql(cfg)

    // ─── Handlers AST ──────────────────────────────────────────────────────

    const handleSourceChange = useCallback((newSource: string) => {
        commitAstUpdate(cell, { source: newSource }, forceUpdate)
    }, [cell, forceUpdate])

    const handleMaterializeChange = useCallback((mat: SqlBlockMaterialize) => {
        commitAstUpdate(cell, { materialize: mat }, forceUpdate)
    }, [cell, forceUpdate])

    const handleStepUpdate = useCallback((idx: number, newStep: SqlBlockStep) => {
        const newSteps = ast.steps.map((s, i) => i === idx ? newStep : s)
        commitAstUpdate(cell, { steps: newSteps }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepRemove = useCallback((idx: number) => {
        const newSteps = ast.steps.filter((_, i) => i !== idx)
        commitAstUpdate(cell, { steps: newSteps }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepMove = useCallback((idx: number, dir: -1 | 1) => {
        const newSteps = [...ast.steps]
        const swap = idx + dir
        if (swap < 0 || swap >= newSteps.length) return;
        [newSteps[idx], newSteps[swap]] = [newSteps[swap], newSteps[idx]]
        commitAstUpdate(cell, { steps: newSteps }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    const handleStepAdd = useCallback((step: SqlBlockStep) => {
        commitAstUpdate(cell, { steps: [...ast.steps, step] }, forceUpdate)
    }, [cell, ast.steps, forceUpdate])

    // ─── Handlers SQL manuel ───────────────────────────────────────────────

    function handleManualSqlEdit(newSql: string) {
        const result = sqlToAst(newSql, ast.materialize)
        if (result.compatible && result.ast) {
            // Compatible : mettre à jour l'AST depuis le SQL
            const cfg = getOrInitConfig(cell)
            cfg.ast = result.ast
            cfg.degraded = false
            cfg.manualSql = null
            if (!cell.queries) cell.queries = [{ name: 'main', sql: newSql, engine: 'sql', clientVisible: false }]
            else cell.queries[0] = { ...cell.queries[0], sql: newSql }
            forceUpdate()
        } else {
            // Incompatible → demander confirmation
            setPendingDegradedSql(newSql)
        }
    }

    function confirmDegraded() {
        if (!pendingDegradedSql) return
        const cfg = getOrInitConfig(cell)
        cfg.degraded = true
        cfg.manualSql = pendingDegradedSql
        if (!cell.queries) cell.queries = [{ name: 'main', sql: pendingDegradedSql, engine: 'sql', clientVisible: false }]
        else cell.queries[0] = { ...cell.queries[0], sql: pendingDegradedSql }
        setPendingDegradedSql(null)
        forceUpdate()
    }

    function cancelDegraded() {
        setPendingDegradedSql(null)
    }

    function tryRestoreFromDegraded() {
        const cfg = getOrInitConfig(cell)
        const sql = cfg.manualSql || currentSql
        const result = sqlToAst(sql, ast.materialize)
        if (result.compatible && result.ast) {
            cfg.ast = result.ast
            cfg.degraded = false
            cfg.manualSql = null
            const genSql = astToSql(result.ast)
            if (!cell.queries) cell.queries = [{ name: 'main', sql: genSql, engine: 'sql', clientVisible: false }]
            else cell.queries[0] = { ...cell.queries[0], sql: genSql }
            forceUpdate()
        } else {
            alert(`Impossible de restaurer l'AST : ${result.error || 'SQL incompatible'}`)
        }
    }

    // ─── Render ────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-3 w-full">

            {/* Mode dégradé : bannière d'avertissement */}
            {cfg.degraded && <DegradedBanner onRestore={tryRestoreFromDegraded} />}

            {/* Modal confirmation passage en mode dégradé */}
            {pendingDegradedSql !== null && (
                <IncompatibleConfirmModal
                    sql={pendingDegradedSql}
                    onConfirm={confirmDegraded}
                    onCancel={cancelDegraded}
                />
            )}

            {/* Ligne Source + Matérialisation */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-40">
                    <label className="text-xs text-muted-foreground shrink-0">Source :</label>
                    <input
                        type="text"
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
                        <button
                            onClick={() => handleMaterializeChange('view')}
                            disabled={cfg.degraded}
                            className={`px-2 py-1 transition-colors ${ast.materialize === 'view' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                            title="Vue DuckDB (lazy, recalculé à chaque accès)"
                        >VIEW</button>
                        <button
                            onClick={() => handleMaterializeChange('table')}
                            disabled={cfg.degraded}
                            className={`px-2 py-1 transition-colors ${ast.materialize === 'table' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
                            title="TABLE matérialisée (chargée en mémoire)"
                        >TABLE</button>
                    </div>
                </div>
            </div>

            {/* Corps : Steps à gauche + SQL preview à droite */}
            {!cfg.degraded ? (
                <div className="flex flex-wrap gap-3 min-h-0">
                    {/* Colonne Steps — min-w assure que les selects ont de la place,
                        flex-1 permet de grandir si la place est disponible */}
                    <div className="flex flex-col gap-2 min-w-52 w-64 flex-1" style={{ maxWidth: '18rem' }}>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Steps</span>
                        {ast.steps.length === 0 && (
                            <p className="text-xs text-muted-foreground italic px-1">
                                Aucun step — SELECT * FROM {ast.source || '…'}
                            </p>
                        )}
                        {ast.steps.map((step, idx) => (
                            <StepItem
                                key={idx}
                                step={step}
                                index={idx}
                                totalSteps={ast.steps.length}
                                availableCols={availableCols}
                                availableColTypes={availableColTypes}
                                onUpdate={handleStepUpdate}
                                onRemove={handleStepRemove}
                                onMove={handleStepMove}
                            />
                        ))}
                        <AddStepMenu onAdd={handleStepAdd} />
                    </div>

                    {/* SQL Preview — min-w-48 : en-dessous de 192px on passe à la ligne */}
                    <div className="flex-1 min-w-48 flex flex-col">
                        <SqlPreview
                            sql={currentSql}
                            editable={true}
                            onEdit={handleManualSqlEdit}
                        />
                    </div>
                </div>
            ) : (
                /* Mode dégradé : éditeur SQL full width */
                <SqlPreview
                    sql={currentSql}
                    editable={true}
                    onEdit={handleManualSqlEdit}
                />
            )}

            {/* Résultats */}
            {cell._results && Array.isArray(cell._results) && cell._results.length > 0 && (
                <div className="mt-2">
                    {cell._resultInfo && (
                        <div className="text-xs text-muted-foreground mb-1">{cell._resultInfo}</div>
                    )}
                    <SqlDataTable cell={cell} />
                </div>
            )}
            {cell._status === 'error' && cell._resultInfo && (
                <div className="mt-2 p-2 rounded bg-destructive/10 text-destructive text-xs">
                    {cell._resultInfo}
                </div>
            )}
        </div>
    )
}
