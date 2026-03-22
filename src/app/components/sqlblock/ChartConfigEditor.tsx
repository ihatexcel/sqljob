// @ts-nocheck
/**
 * ChartConfigEditor — Éditeur de configuration de visualisation graphique.
 * Placé après les étapes SQL dans SqlBlockEditor (mode SELECT uniquement).
 * Bidirectionnel : ChartConfig ↔ UI, synchronisé avec l'AST via onChange.
 *
 * NOTE: Uses native <select> (not Radix UI Select) to avoid React portal
 * removeChild conflicts when the component unmounts or hides.
 */
import { useState, useCallback, useEffect } from 'react'
import type { ChartConfig, ChartColumnRole } from '../../../lib/SqlBlockTypes'

// ─── Config des types de graphique ────────────────────────────────────────────

interface RoleSlotConfig {
    role: string
    label: string
    multiple: boolean   // true → liste d'entrées, false → select unique
    optional: boolean   // true → "-- aucune --" possible
    hasLabel: boolean   // true → champ texte pour l'alias AS "Label"
}

const CHART_TYPE_CONFIGS: Record<string, { label: string; icon: string; roles: RoleSlotConfig[] }> = {
    bar: {
        label: 'Barres',
        icon: 'material-symbols-light:bar-chart',
        roles: [
            { role: 'XAXIS',    label: 'Axe X',      multiple: false, optional: false, hasLabel: false },
            { role: 'BARCHART', label: 'Barres',      multiple: true,  optional: false, hasLabel: true },
            { role: 'CATEGORY', label: 'Catégorie',   multiple: false, optional: true,  hasLabel: false },
            { role: 'COLOR',    label: 'Couleur',     multiple: false, optional: true,  hasLabel: false },
        ],
    },
    line: {
        label: 'Lignes',
        icon: 'material-symbols-light:show-chart',
        roles: [
            { role: 'XAXIS',     label: 'Axe X',    multiple: false, optional: false, hasLabel: false },
            { role: 'LINECHART', label: 'Courbes',   multiple: true,  optional: false, hasLabel: true },
            { role: 'CATEGORY',  label: 'Catégorie', multiple: false, optional: true,  hasLabel: false },
        ],
    },
    'bar+line': {
        label: 'Barres + Lignes',
        icon: 'material-symbols-light:stacked-bar-chart',
        roles: [
            { role: 'XAXIS',     label: 'Axe X',    multiple: false, optional: false, hasLabel: false },
            { role: 'BARCHART',  label: 'Barres',    multiple: true,  optional: false, hasLabel: true },
            { role: 'LINECHART', label: 'Courbes',   multiple: true,  optional: false, hasLabel: true },
        ],
    },
    pie: {
        label: 'Camembert',
        icon: 'material-symbols-light:pie-chart',
        roles: [
            { role: 'CATEGORY', label: 'Catégorie', multiple: false, optional: false, hasLabel: false },
            { role: 'PIECHART', label: 'Valeurs',   multiple: false, optional: false, hasLabel: false },
            { role: 'COLOR',    label: 'Couleur',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    donut: {
        label: 'Donut',
        icon: 'material-symbols-light:donut-large',
        roles: [
            { role: 'CATEGORY',   label: 'Catégorie', multiple: false, optional: false, hasLabel: false },
            { role: 'DONUTCHART', label: 'Valeurs',   multiple: false, optional: false, hasLabel: false },
            { role: 'COLOR',      label: 'Couleur',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    gauge: {
        label: 'Jauge',
        icon: 'material-symbols-light:speed',
        roles: [
            { role: 'GAUGE',   label: 'Valeur',   multiple: false, optional: false, hasLabel: false },
            { role: 'RANGE',   label: 'Plage',    multiple: false, optional: true,  hasLabel: false },
            { role: 'COLORS',  label: 'Couleurs', multiple: false, optional: true,  hasLabel: false },
            { role: 'LABELS',  label: 'Labels',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    boxplot: {
        label: 'Boîte à moustaches',
        icon: 'material-symbols-light:candlestick-chart',
        roles: [
            { role: 'BOXPLOT', label: 'Valeurs', multiple: true,  optional: false, hasLabel: true },
            { role: 'XAXIS',   label: 'Axe X',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    kpi: {
        label: 'KPI',
        icon: 'material-symbols-light:123',
        roles: [
            { role: 'LABEL',   label: 'Valeurs',    multiple: true,  optional: false, hasLabel: true },
            { role: 'PERCENT', label: 'Pourcentage', multiple: false, optional: true,  hasLabel: false },
            { role: 'COMPARE', label: 'Comparaison', multiple: false, optional: true,  hasLabel: false },
            { role: 'TREND',   label: 'Tendance',    multiple: false, optional: true,  hasLabel: false },
        ],
    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NONE_VALUE = '__none__'

/** Retourne les entrées d'un rôle dans la config. */
function getEntriesForRole(columns: ChartColumnRole[], role: string): ChartColumnRole[] {
    return columns.filter(c => c.role === role)
}

/** Remplace les entrées d'un rôle dans la config par de nouvelles. */
function replaceRoleEntries(columns: ChartColumnRole[], role: string, entries: ChartColumnRole[]): ChartColumnRole[] {
    const others = columns.filter(c => c.role !== role)
    // Insert entries at the position of the first occurrence of the role (or end)
    const firstIdx = columns.findIndex(c => c.role === role)
    if (firstIdx < 0) return [...others, ...entries]
    const before = columns.slice(0, firstIdx).filter(c => c.role !== role)
    const after = columns.slice(firstIdx).filter(c => c.role !== role)
    return [...before, ...entries, ...after]
}

/** Construit un ChartConfig par défaut pour un nouveau chartType. */
function defaultConfigForType(chartType: string, availableColumns: string[]): ChartConfig {
    const config = CHART_TYPE_CONFIGS[chartType]
    if (!config) return { chartType, columns: [] }
    const columns: ChartColumnRole[] = []
    for (const slot of config.roles) {
        if (slot.optional) continue // ne pré-remplit pas les slots optionnels
        const col = availableColumns[0] ?? ''
        if (slot.multiple) {
            if (col) columns.push({ column: col, role: slot.role, label: col })
        } else {
            if (col) columns.push({ column: col, role: slot.role })
        }
    }
    return { chartType, columns }
}

// ─── Styles communs pour native <select> ──────────────────────────────────────

const SELECT_CLASS = 'h-6 text-xs px-1.5 border border-border rounded bg-background min-w-[120px] max-w-[160px] cursor-pointer'
const SELECT_TYPE_CLASS = 'h-6 text-xs px-1.5 border border-border rounded bg-background min-w-[140px] cursor-pointer'

// ─── Sous-composant ColSelect (native <select>) ────────────────────────────────

function ColSelect({ value, availableColumns, optional, onChange }: {
    value: string
    availableColumns: string[]
    optional: boolean
    onChange: (col: string | null) => void
}) {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const v = e.target.value
        console.log('[ChartConfigEditor] ColSelect change →', v)
        onChange(v === NONE_VALUE ? null : v)
    }
    return (
        <select
            value={value || NONE_VALUE}
            onChange={handleChange}
            className={SELECT_CLASS}
        >
            {optional && <option value={NONE_VALUE}>-- aucune --</option>}
            {availableColumns.map(col => (
                <option key={col} value={col}>{col}</option>
            ))}
        </select>
    )
}

// ─── Composant principal ──────────────────────────────────────────────────────

export interface ChartConfigEditorProps {
    chartConfig: ChartConfig | undefined
    availableColumns: string[]
    availableColTypes?: Record<string, string>
    onChange: (cfg: ChartConfig | null) => void
    /** Appelé au montage pour déclencher le fetch du schéma dynamique (colonnes réelles après la dernière étape). */
    onMount?: () => void
    /** Aperçu graphique dans le panel dtSection */
    eyeOpen?: boolean
    onEyeToggle?: () => void
}

export function ChartConfigEditor({ chartConfig, availableColumns, availableColTypes, onChange, onMount, eyeOpen, onEyeToggle }: ChartConfigEditorProps) {
    const [open, setOpen] = useState(!!chartConfig)

    const isActive = !!chartConfig
    const chartType = chartConfig?.chartType ?? 'bar'
    const columns: ChartColumnRole[] = chartConfig?.columns ?? []
    const typeConfig = CHART_TYPE_CONFIGS[chartType] ?? CHART_TYPE_CONFIGS.bar

    // Debug lifecycle + déclenche le fetch du schéma dynamique (colonnes réelles de la dernière étape)
    useEffect(() => {
        console.log('[ChartConfigEditor] MOUNTED')
        onMount?.()
        return () => console.log('[ChartConfigEditor] UNMOUNTED')
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Debug render
    console.log('[ChartConfigEditor] render', { isActive, open, chartType, columnsCount: columns.length, availableColumns, availableColTypes })

    const handleToggle = useCallback(() => {
        if (isActive) {
            console.log('[ChartConfigEditor] toggle OFF → onChange(null)')
            onChange(null)
            setOpen(false)
        } else {
            const newCfg = defaultConfigForType('bar', availableColumns)
            console.log('[ChartConfigEditor] toggle ON → onChange', newCfg)
            onChange(newCfg)
            setOpen(true)
        }
    }, [isActive, availableColumns, onChange])

    const handleTypeChange = useCallback((newType: string) => {
        console.log('[ChartConfigEditor] type change →', newType)
        const newCfg = defaultConfigForType(newType, availableColumns)
        onChange(newCfg)
    }, [availableColumns, onChange])

    const handleSingleRoleChange = useCallback((role: string, col: string | null) => {
        console.log('[ChartConfigEditor] single role change', role, '→', col)
        const entries = col ? [{ column: col, role }] : []
        onChange({ chartType, columns: replaceRoleEntries(columns, role, entries) })
    }, [chartType, columns, onChange])

    const handleMultiRoleChange = useCallback((role: string, idx: number, field: 'column' | 'label', value: string) => {
        console.log('[ChartConfigEditor] multi role change', role, idx, field, '→', value)
        const entries = getEntriesForRole(columns, role).map((e, i) =>
            i === idx ? { ...e, [field]: value } : e
        )
        onChange({ chartType, columns: replaceRoleEntries(columns, role, entries) })
    }, [chartType, columns, onChange])

    const handleMultiRoleAdd = useCallback((role: string) => {
        const col = availableColumns[0] ?? ''
        console.log('[ChartConfigEditor] multi role add', role, '→', col)
        const entries = [...getEntriesForRole(columns, role), { column: col, role, label: col }]
        onChange({ chartType, columns: replaceRoleEntries(columns, role, entries) })
    }, [chartType, columns, availableColumns, onChange])

    const handleMultiRoleRemove = useCallback((role: string, idx: number) => {
        console.log('[ChartConfigEditor] multi role remove', role, idx)
        const entries = getEntriesForRole(columns, role).filter((_, i) => i !== idx)
        onChange({ chartType, columns: replaceRoleEntries(columns, role, entries) })
    }, [chartType, columns, onChange])

    return (
        <div className="border border-border rounded-md bg-background/50 shrink-0">
            {/* Header — toggle */}
            <div className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    <span className="iconify mr-1" data-icon="material-symbols-light:bar-chart" />
                    Visualisation
                </span>
                {/* Toggle activer/désactiver */}
                <button
                    type="button"
                    onClick={e => { e.stopPropagation(); handleToggle() }}
                    className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ml-1 shrink-0 ${isActive ? 'bg-primary' : 'bg-muted'}`}
                    title={isActive ? 'Désactiver le graphique' : 'Activer le graphique'}
                >
                    <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-xs text-muted-foreground ml-1">{isActive ? 'Activé' : 'Désactivé'}</span>
                {/* Œil — aperçu graphique dans le panel gauche */}
                {isActive && onEyeToggle && (
                    <button
                        type="button"
                        onClick={e => { e.stopPropagation(); onEyeToggle() }}
                        title={eyeOpen ? 'Fermer l\'aperçu graphique' : 'Aperçu graphique'}
                        className={`ml-1 p-0.5 rounded transition-colors ${eyeOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        <span className="iconify w-3.5 h-3.5" data-icon={eyeOpen ? 'material-symbols-light:visibility' : 'material-symbols-light:visibility-outline'} />
                    </button>
                )}
                <span className="ml-auto text-muted-foreground text-xs">{open ? '▾' : '▸'}</span>
            </div>

            {/* Body — affiché uniquement si ouvert ET actif */}
            {open && isActive && (
                <div className="flex flex-col gap-2 px-3 pb-3 border-t border-border">
                    {/* Type de graphique — native <select> */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground w-28 shrink-0">Type</span>
                        <select
                            value={chartType}
                            onChange={e => handleTypeChange(e.target.value)}
                            className={SELECT_TYPE_CLASS}
                        >
                            {Object.entries(CHART_TYPE_CONFIGS).map(([key, cfg]) => (
                                <option key={key} value={key}>{cfg.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Slots de rôles */}
                    {typeConfig.roles.map(slot => {
                        if (slot.multiple) {
                            const entries = getEntriesForRole(columns, slot.role)
                            return (
                                <div key={slot.role} className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground w-28 shrink-0">
                                            {slot.label}
                                            {!slot.optional && <span className="text-destructive ml-0.5">*</span>}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleMultiRoleAdd(slot.role)}
                                            className="text-xs text-primary hover:underline ml-auto"
                                        >+ Ajouter</button>
                                    </div>
                                    {entries.length === 0 && (
                                        <div className="text-xs text-muted-foreground italic pl-30">Aucune colonne</div>
                                    )}
                                    {entries.map((entry, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 pl-1">
                                            <ColSelect
                                                value={entry.column}
                                                availableColumns={availableColumns}
                                                optional={false}
                                                onChange={col => col && handleMultiRoleChange(slot.role, idx, 'column', col)}
                                            />
                                            {slot.hasLabel && (
                                                <input
                                                    type="text"
                                                    value={entry.label ?? ''}
                                                    placeholder="Libellé"
                                                    onChange={e => handleMultiRoleChange(slot.role, idx, 'label', e.target.value)}
                                                    className="h-6 text-xs px-1.5 border border-border rounded bg-background min-w-0 w-24"
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleMultiRoleRemove(slot.role, idx)}
                                                className="text-muted-foreground hover:text-destructive text-xs px-1"
                                                title="Supprimer"
                                            >✕</button>
                                        </div>
                                    ))}
                                </div>
                            )
                        } else {
                            const entry = getEntriesForRole(columns, slot.role)[0]
                            return (
                                <div key={slot.role} className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground w-28 shrink-0">
                                        {slot.label}
                                        {!slot.optional && <span className="text-destructive ml-0.5">*</span>}
                                    </span>
                                    <ColSelect
                                        value={entry?.column ?? NONE_VALUE}
                                        availableColumns={availableColumns}
                                        optional={slot.optional}
                                        onChange={col => handleSingleRoleChange(slot.role, col)}
                                    />
                                </div>
                            )
                        }
                    })}
                </div>
            )}
        </div>
    )
}
