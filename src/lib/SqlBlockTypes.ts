// ─── SqlBlock AST Types ───────────────────────────────────────────────────────
// L'AST est la source de vérité pour les cellules sqlBlock.
// sql <-> ast <-> ui : toute modification UI ou SQL passe par l'AST.

export type SqlBlockMaterialize = 'view' | 'table' | 'ephemeral';

// ─── P0 — Sélection de colonnes ───────────────────────────────────────────────

export interface SelectColumnsStep {
    type: 'select_columns';
    columns: string[];
}

export interface ExcludeColumnsStep {
    type: 'exclude_columns';
    columns: string[];
}

export interface ChangeTypeChange {
    column: string;
    targetType: string;
}
export interface ChangeTypeStep {
    type: 'change_type';
    changes: ChangeTypeChange[];
}

// ─── P1 — Essentiels data analyst ────────────────────────────────────────────

export type FilterOp =
    | '=' | '!=' | '>' | '<' | '>=' | '<='
    | 'in' | 'not_in' | 'is_null' | 'not_null'
    | 'like' | 'ilike' | 'between';

/** Mode de saisie d'une valeur de filtre : valeur fixe, référence colonne, ou paramètre UI */
export type FilterValueKind = 'literal' | 'column' | 'param';

export interface FilterCondition {
    column: string;
    op: FilterOp;
    /** Valeur unique (=, !=, >, like…) */
    value?: string;
    /** Mode de la valeur unique */
    valueKind?: FilterValueKind;
    /** Valeurs multiples (IN, NOT IN) */
    values?: string[];
    /** Borne haute (BETWEEN) */
    valueTo?: string;
    /** Mode de la borne haute */
    valueToKind?: FilterValueKind;
}
/** Élément d'un groupe : condition atomique ou sous-groupe (récursif) */
export type FilterItem =
    | { kind: 'cond'; cond: FilterCondition }
    | { kind: 'group'; group: FilterGroup }
/** Un groupe de filtres (récursif) : items liés par logicOp, avec NOT optionnel */
export interface FilterGroup {
    items: FilterItem[];
    logicOp: 'AND' | 'OR';
    /** Si true, le groupe est entouré de NOT(…) */
    negate?: boolean;
    /** @deprecated — rétrocompat : conditions du plat ancien format */
    conditions?: FilterCondition[];
}
export interface FilterRowsStep {
    type: 'filter_rows';
    /** Groupes de premier niveau */
    groups: FilterGroup[];
    /** Opérateur entre les groupes de premier niveau */
    groupLogicOp: 'AND' | 'OR';
    /** @deprecated — rétrocompat ancien format */
    conditions?: FilterCondition[];
    /** @deprecated — rétrocompat ancien format */
    logicOp?: 'AND' | 'OR';
}

export interface SortKey {
    column: string;
    direction: 'asc' | 'desc';
    nulls: 'first' | 'last';
}
export interface SortStep {
    type: 'sort';
    keys: SortKey[];
}

export interface TopNStep {
    type: 'top_n';
    mode: 'limit' | 'sample_percent' | 'sample_rows';
    n: number;
    offset?: number;
    sampleMethod?: 'reservoir' | 'bernoulli' | 'system';
}

export interface RenameColumnsStep {
    type: 'rename_columns';
    renames: { from: string; to: string }[];
}

export interface DeriveColumn {
    name: string;
    expr: string;
    replace: boolean;
}
export interface DeriveStep {
    type: 'derive';
    columns: DeriveColumn[];
}

export type FillStrategy = 'value' | 'mean' | 'median' | 'zero' | 'empty_string';
export interface FillNullEntry {
    column: string;
    strategy: FillStrategy;
    value?: string;
}
export interface FillNullStep {
    type: 'fill_null';
    fills: FillNullEntry[];
}

// ─── P2 — Reshaping & combinaison ────────────────────────────────────────────

export type AggFn =
    | 'count' | 'count_distinct' | 'sum' | 'avg' | 'min' | 'max'
    | 'median' | 'stddev' | 'string_agg' | 'list';

export interface Aggregation {
    column: string;         // '*' pour COUNT(*)
    fn: AggFn | string;
    alias: string;
    separator?: string;     // pour string_agg
}
export interface GroupByStep {
    type: 'group_by';
    groupCols: string[];
    aggregations: Aggregation[];
}

export type JoinType = 'left' | 'inner' | 'right' | 'full' | 'cross' | 'anti';
export interface JoinCondition {
    left: string;
    right: string;
}
export interface JoinStep {
    type: 'join';
    rightTable: string;
    joinType: JoinType;
    on: JoinCondition[];
    selectRight: string[] | '*';
}

export interface UnionStep {
    type: 'union';
    table: string;
    mode: 'all' | 'distinct';
}

export interface PivotStep {
    type: 'pivot';
    onColumn: string;
    valueColumn: string;
    valueFn: string;
    groupCols: string[];
}

export interface UnpivotStep {
    type: 'unpivot';
    columns: string[];
    nameCol: string;
    valueCol: string;
}

// ─── P3 — DuckDB avancé ───────────────────────────────────────────────────────

export interface WindowColumn {
    fn: string;
    col?: string;
    partitionBy: string[];
    orderBy: SortKey[];
    alias: string;
    frame?: string;
    offset?: number;
}
export interface WindowStep {
    type: 'window';
    columns: WindowColumn[];
}

export interface UnnestStep {
    type: 'unnest';
    column: string;
    alias: string;
    keepEmpty: boolean;
}

export interface JsonExtraction {
    path: string;
    alias: string;
    targetType?: string;
}
export interface JsonExtractStep {
    type: 'json_extract';
    column: string;
    extractions: JsonExtraction[];
}

export type DateGranularity = 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export interface DateTruncStep {
    type: 'date_trunc';
    column: string;
    granularity: DateGranularity;
    mode: 'replace' | 'add';
    alias?: string;
}

export interface CustomSqlStep {
    type: 'custom_sql';
    sql: string;
}

// ─── Colonne conditionnelle (inspiré Power Query) ─────────────────────────────

/** Une règle WHEN … THEN … dans une colonne conditionnelle */
export interface ConditionalRule {
    /** Condition WHEN (groupe de filtres) */
    when: FilterGroup;
    /** Valeur résultat THEN */
    then: string;
    /** Mode de la valeur THEN */
    thenKind?: FilterValueKind;
}

export interface ConditionalColumnStep {
    type: 'conditional_column';
    /** Nom de la nouvelle colonne */
    newColumn: string;
    /** Liste de règles WHEN … THEN … (dans l'ordre) */
    rules: ConditionalRule[];
    /** Valeur ELSE (par défaut NULL si absent) */
    elseValue?: string;
    /** Mode de la valeur ELSE */
    elseKind?: FilterValueKind;
}

// ─── Métadonnées communes à tous les steps ────────────────────────────────────

export interface SqlBlockStepMeta {
    /** Nom de la sous-requête (CTE) — doit être unique parmi les steps */
    name?: string;
    /** Description libre de cette étape */
    description?: string;
}

// ─── Union de tous les steps ───────────────────────────────────────────────────

export type SqlBlockStep = (
    | SelectColumnsStep
    | ExcludeColumnsStep
    | ChangeTypeStep
    | FilterRowsStep
    | SortStep
    | TopNStep
    | RenameColumnsStep
    | DeriveStep
    | FillNullStep
    | GroupByStep
    | JoinStep
    | UnionStep
    | PivotStep
    | UnpivotStep
    | WindowStep
    | UnnestStep
    | JsonExtractStep
    | DateTruncStep
    | CustomSqlStep
    | ConditionalColumnStep
) & SqlBlockStepMeta;

// ─── Visualisation graphique (TaleShape) ──────────────────────────────────────

/** Mapping colonne → rôle visuel dans le SELECT final (dernier SELECT du pipeline). */
export interface ChartColumnRole {
    column: string;    // nom de colonne source (non quoté)
    role: string;      // XAXIS | BARCHART | LINECHART | PIECHART | CATEGORY | …
    label?: string;    // alias AS "Label" (légende ECharts)
}

/** Configuration de visualisation graphique associée à l'AST. */
export interface ChartConfig {
    chartType: string;          // 'bar' | 'line' | 'bar+line' | 'pie' | 'donut' | 'gauge' | 'boxplot' | 'kpi'
    columns: ChartColumnRole[]; // rôles dans l'ordre du SELECT final
    label?: string;             // titre affiché (stat/kpi) — génère SELECT '...'::LABEL; dans le SQL
}

// ─── AST root ─────────────────────────────────────────────────────────────────

export interface SqlBlockAst {
    source: string;
    steps: SqlBlockStep[];
    materialized: SqlBlockMaterialize;
    chartConfig?: ChartConfig;  // optionnel : active le mode graphique sur le dernier SELECT
}

// ─── Config cellule ───────────────────────────────────────────────────────────

export interface SqlBlockConfig {
    ast: SqlBlockAst;
    degraded: boolean;
    manualSql: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DUCKDB_TYPES: string[] = [
    'VARCHAR', 'TEXT', 'INTEGER', 'BIGINT', 'SMALLINT', 'TINYINT', 'HUGEINT',
    'FLOAT', 'DOUBLE', 'DECIMAL', 'BOOLEAN',
    'DATE', 'TIME', 'TIMESTAMP', 'INTERVAL', 'BLOB', 'JSON',
];

export const STEP_LABELS: Record<SqlBlockStep['type'], string> = {
    select_columns:  'Sélectionner des colonnes',
    exclude_columns: 'Exclure des colonnes',
    change_type:     'Changer le type',
    filter_rows:     'Filtrer les lignes',
    sort:            'Trier',
    top_n:           'Limiter / Échantillonner',
    rename_columns:  'Renommer des colonnes',
    derive:          'Calculer une colonne',
    fill_null:       'Remplacer les nulls',
    group_by:        'Grouper / Agréger',
    join:            'Joindre une table',
    union:           'Empiler (UNION)',
    pivot:           'Pivoter (PIVOT)',
    unpivot:         'Dépivoter (UNPIVOT)',
    window:          'Fenêtre (WINDOW)',
    unnest:          'Exploser un tableau (UNNEST)',
    json_extract:    'Extraire du JSON',
    date_trunc:      'Tronquer une date',
    custom_sql:          'SQL personnalisé',
    conditional_column:  'Colonne conditionnelle',
};

export const STEP_ICONS: Record<SqlBlockStep['type'], string> = {
    select_columns:  'material-symbols-light:check-box',
    exclude_columns: 'material-symbols-light:indeterminate-check-box',
    change_type:     'material-symbols-light:transform',
    filter_rows:     'material-symbols-light:filter-alt',
    sort:            'material-symbols-light:sort',
    top_n:           'material-symbols-light:format-list-numbered',
    rename_columns:  'material-symbols-light:drive-file-rename-outline',
    derive:          'material-symbols-light:calculate',
    fill_null:       'material-symbols-light:playlist-add',
    group_by:        'material-symbols-light:group-work',
    join:            'material-symbols-light:join-inner',
    union:           'material-symbols-light:merge',
    pivot:           'material-symbols-light:pivot-table-chart',
    unpivot:         'material-symbols-light:rotate-90-degrees-ccw',
    window:          'material-symbols-light:window',
    unnest:          'material-symbols-light:unarchive',
    json_extract:    'material-symbols-light:data-object',
    date_trunc:      'material-symbols-light:date-range',
    custom_sql:          'material-symbols-light:code',
    conditional_column:  'material-symbols-light:account-tree',
};

export const STEP_CATEGORIES = [
    {
        label: 'Filtrage & Tri',
        steps: ['filter_rows', 'sort', 'top_n'] as SqlBlockStep['type'][],
    },
    {
        label: 'Colonnes',
        steps: ['select_columns', 'exclude_columns', 'rename_columns', 'derive', 'conditional_column', 'change_type', 'fill_null'] as SqlBlockStep['type'][],
    },
    {
        label: 'Agrégation & Reshape',
        steps: ['group_by', 'pivot', 'unpivot'] as SqlBlockStep['type'][],
    },
    {
        label: 'Combinaison',
        steps: ['join', 'union'] as SqlBlockStep['type'][],
    },
    {
        label: 'DuckDB avancé',
        steps: ['window', 'unnest', 'json_extract', 'date_trunc'] as SqlBlockStep['type'][],
    },
    {
        label: 'Personnalisé',
        steps: ['custom_sql'] as SqlBlockStep['type'][],
    },
] as const;

export function createDefaultSqlBlockConfig(source = ''): SqlBlockConfig {
    return {
        ast: { source, steps: [], materialized: 'view' },
        degraded: false,
        manualSql: null,
    };
}
