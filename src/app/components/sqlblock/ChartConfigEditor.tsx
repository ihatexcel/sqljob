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
    datatable: {
        label: 'Datatable',
        icon: 'material-symbols-light:table',
        roles: [],
    },
    bar: {
        label: 'Barres',
        icon: 'material-symbols-light:bar-chart',
        roles: [
            { role: 'XAXIS',    label: 'Axe X',      multiple: false, optional: false, hasLabel: true },
            { role: 'BARCHART', label: 'Barres',      multiple: true,  optional: false, hasLabel: true },
            { role: 'CATEGORY', label: 'Catégorie',   multiple: false, optional: true,  hasLabel: true },
            { role: 'COLOR',    label: 'Couleur',     multiple: false, optional: true,  hasLabel: false },
        ],
    },
    line: {
        label: 'Lignes',
        icon: 'material-symbols-light:show-chart',
        roles: [
            { role: 'XAXIS',     label: 'Axe X',    multiple: false, optional: false, hasLabel: true },
            { role: 'LINECHART', label: 'Courbes',   multiple: true,  optional: false, hasLabel: true },
            { role: 'CATEGORY',  label: 'Catégorie', multiple: false, optional: true,  hasLabel: true },
        ],
    },
    'bar+line': {
        label: 'Barres + Lignes',
        icon: 'material-symbols-light:stacked-bar-chart',
        roles: [
            { role: 'XAXIS',     label: 'Axe X',    multiple: false, optional: false, hasLabel: true },
            { role: 'BARCHART',  label: 'Barres',    multiple: true,  optional: false, hasLabel: true },
            { role: 'LINECHART', label: 'Courbes',   multiple: true,  optional: false, hasLabel: true },
        ],
    },
    pie: {
        label: 'Camembert',
        icon: 'material-symbols-light:pie-chart',
        roles: [
            { role: 'CATEGORY', label: 'Catégorie', multiple: false, optional: false, hasLabel: true },
            { role: 'PIECHART', label: 'Valeurs',   multiple: false, optional: false, hasLabel: true },
            { role: 'COLOR',    label: 'Couleur',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    donut: {
        label: 'Donut',
        icon: 'material-symbols-light:donut-large',
        roles: [
            { role: 'CATEGORY',   label: 'Catégorie', multiple: false, optional: false, hasLabel: true },
            { role: 'DONUTCHART', label: 'Valeurs',   multiple: false, optional: false, hasLabel: true },
            { role: 'COLOR',      label: 'Couleur',   multiple: false, optional: true,  hasLabel: false },
        ],
    },
    gauge: {
        label: 'Jauge',
        icon: 'material-symbols-light:speed',
        roles: [
            { role: 'GAUGE',   label: 'Valeur',   multiple: false, optional: false, hasLabel: true },
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
            { role: 'XAXIS',   label: 'Axe X',   multiple: false, optional: true,  hasLabel: true },
        ],
    },
    kpi: {
        label: 'KPI',
        icon: 'material-symbols-light:123',
        roles: [
            { role: 'KPI',     label: 'Valeur',      multiple: true,  optional: false, hasLabel: true },
            { role: 'PERCENT', label: 'Pourcentage',  multiple: false, optional: true,  hasLabel: true },
            { role: 'COMPARE', label: 'Comparaison',  multiple: false, optional: true,  hasLabel: true },
            { role: 'TREND',   label: 'Tendance',     multiple: false, optional: true,  hasLabel: true },
        ],
    },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NONE_VALUE = '__none__'

/** Correspondance entre rôles compatibles lors d'un changement de type. */
const ROLE_COMPAT_MAP: Record<string, string> = {
    'BARCHART':   'LINECHART',
    'LINECHART':  'BARCHART',
    'PIECHART':   'DONUTCHART',
    'DONUTCHART': 'PIECHART',
}

/** Transfère les colonnes existantes vers un nouveau type en mappant les rôles compatibles. */
function migrateColumnsForType(oldColumns: ChartColumnRole[], newType: string): ChartColumnRole[] {
    const newConfig = CHART_TYPE_CONFIGS[newType]
    if (!newConfig) return []
    const newRoles = new Set(newConfig.roles.map(r => r.role))
    return oldColumns
        .map(col => {
            if (newRoles.has(col.role)) return col
            const mapped = ROLE_COMPAT_MAP[col.role]
            if (mapped && newRoles.has(mapped)) return { ...col, role: mapped }
            return null
        })
        .filter(Boolean) as ChartColumnRole[]
}

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
        if (col) columns.push({ column: col, role: slot.role })
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
    const chartType = chartConfig?.chartType ?? 'datatable'
    const columns: ChartColumnRole[] = chartConfig?.columns ?? []
    const typeConfig = CHART_TYPE_CONFIGS[chartType] ?? CHART_TYPE_CONFIGS.datatable

    // Déclenche le fetch du schéma dynamique
    useEffect(() => {
        onMount?.()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Init par défaut si aucune config (datatable)
    useEffect(() => {
        if (!chartConfig) onChange({ chartType: 'datatable', columns: [] })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-fill : quand les colonnes deviennent disponibles et que la config est vide,
    // sélectionner automatiquement la première colonne pour chaque rôle obligatoire.
    const availableKey = availableColumns.join(',')
    useEffect(() => {
        if (chartType === 'datatable' || columns.length > 0 || availableColumns.length === 0) return
        const newCfg = defaultConfigForType(chartType, availableColumns)
        if (newCfg.columns.length > 0) onChange(newCfg)
    }, [availableKey]) // eslint-disable-line react-hooks/exhaustive-deps

    const cfgLabel: string = (chartConfig as any)?.label ?? ''

    const handleTypeChange = useCallback((newType: string) => {
        const migrated = migrateColumnsForType(columns, newType)
        const base = migrated.length > 0
            ? { chartType: newType, columns: migrated }
            : defaultConfigForType(newType, availableColumns)
        onChange({ ...base, label: (chartConfig as any)?.label })
    }, [columns, availableColumns, onChange, chartConfig])

    const handleLabelChange = useCallback((val: string) => {
        onChange({ chartType, columns, label: val || undefined } as any)
    }, [chartType, columns, onChange])

    // Émet un ChartConfig en préservant le label titre
    const emit = useCallback((cols: ChartColumnRole[]) => {
        const cfg: any = { chartType, columns: cols }
        if (cfgLabel) cfg.label = cfgLabel
        onChange(cfg)
    }, [chartType, cfgLabel, onChange])

    const handleSingleRoleChange = useCallback((role: string, col: string | null) => {
        const entries = col ? [{ column: col, role, label: undefined }] : []
        emit(replaceRoleEntries(columns, role, entries))
    }, [columns, emit])

    const handleSingleRoleLabelChange = useCallback((role: string, label: string) => {
        const entry = getEntriesForRole(columns, role)[0]
        if (!entry) return
        emit(replaceRoleEntries(columns, role, [{ ...entry, label: label || undefined }]))
    }, [columns, emit])

    const handleMultiRoleChange = useCallback((role: string, idx: number, field: 'column' | 'label', value: string) => {
        const entries = getEntriesForRole(columns, role).map((e, i) => {
            if (i !== idx) return e
            if (field === 'column') return { ...e, column: value, label: undefined }
            return { ...e, [field]: value || undefined }
        })
        emit(replaceRoleEntries(columns, role, entries))
    }, [columns, emit])

    const handleMultiRoleAdd = useCallback((role: string) => {
        const col = availableColumns[0] ?? ''
        emit(replaceRoleEntries(columns, role, [...getEntriesForRole(columns, role), { column: col, role }]))
    }, [columns, availableColumns, emit])

    const handleMultiRoleRemove = useCallback((role: string, idx: number) => {
        emit(replaceRoleEntries(columns, role, getEntriesForRole(columns, role).filter((_, i) => i !== idx)))
    }, [columns, emit])

    return (
        <div className="flex flex-col gap-2">
            {/* Type de graphique */}
            <div className="flex items-center gap-2">
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

            {/* Titre */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-28 shrink-0">Titre</span>
                <input
                    type="text"
                    value={cfgLabel}
                    onChange={e => handleLabelChange(e.target.value)}
                    placeholder="Titre affiché au-dessus"
                    className="h-6 text-xs px-1.5 border border-border rounded bg-background flex-1"
                />
            </div>

            {/* Slots de rôles (vide si datatable) */}
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
                                                    onChange={e => handleMultiRoleChange(slot.role, idx, 'label', e.target.value)}
                                                    placeholder="AS (alias)"
                                                    className="h-6 text-xs px-1.5 border border-border rounded bg-background min-w-[80px] max-w-[120px]"
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
                                    {slot.hasLabel && entry && (
                                        <input
                                            type="text"
                                            value={entry.label ?? ''}
                                            onChange={e => handleSingleRoleLabelChange(slot.role, e.target.value)}
                                            placeholder="AS (alias)"
                                            className="h-6 text-xs px-1.5 border border-border rounded bg-background min-w-[80px] max-w-[120px]"
                                        />
                                    )}
                                </div>
                            )
                        }
            })}
        </div>
    )
}
