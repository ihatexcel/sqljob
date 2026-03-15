// ─── SqlBlock AST Types ───────────────────────────────────────────────────────
// L'AST est la source de vérité pour les cellules sqlBlock.
// sql <-> ast <-> ui : toute modification UI ou SQL passe par l'AST.

export type SqlBlockMaterialize = 'view' | 'table';

// ─── Step types ───────────────────────────────────────────────────────────────

/** Sélectionner un sous-ensemble de colonnes : SELECT col1, col2 FROM src */
export interface SelectColumnsStep {
    type: 'select_columns';
    columns: string[];
}

/** Exclure des colonnes : SELECT * EXCLUDE (col1, col2) FROM src */
export interface ExcludeColumnsStep {
    type: 'exclude_columns';
    columns: string[];
}

/** Changement de type sur une ou plusieurs colonnes :
 *  SELECT * REPLACE (CAST(col AS TYPE) AS col, ...) FROM src */
export interface ChangeTypeChange {
    column: string;
    targetType: string;
}
export interface ChangeTypeStep {
    type: 'change_type';
    changes: ChangeTypeChange[];
}

export type SqlBlockStep = SelectColumnsStep | ExcludeColumnsStep | ChangeTypeStep;

// ─── AST root ─────────────────────────────────────────────────────────────────

export interface SqlBlockAst {
    /** Table ou cellule source (clause FROM) */
    source: string;
    /** Chaîne de transformations ordonnées */
    steps: SqlBlockStep[];
    /** Mode de matérialisation dans DuckDB */
    materialize: SqlBlockMaterialize;
}

// ─── Config cellule (stockée dans cell.sqlBlockConfig) ────────────────────────

export interface SqlBlockConfig {
    ast: SqlBlockAst;
    /** Mode dégradé : l'utilisateur a édité le SQL manuellement et il n'est plus
     *  compatible avec l'UI. Seul l'éditeur SQL est actif. */
    degraded: boolean;
    /** SQL saisi manuellement en mode dégradé (null = généré depuis l'AST) */
    manualSql: string | null;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Types DuckDB proposés dans le sélecteur "Changer le type" */
export const DUCKDB_TYPES: string[] = [
    'VARCHAR',
    'TEXT',
    'INTEGER',
    'BIGINT',
    'SMALLINT',
    'TINYINT',
    'HUGEINT',
    'FLOAT',
    'DOUBLE',
    'DECIMAL',
    'BOOLEAN',
    'DATE',
    'TIME',
    'TIMESTAMP',
    'INTERVAL',
    'BLOB',
    'JSON',
];

export const STEP_LABELS: Record<SqlBlockStep['type'], string> = {
    select_columns: 'Sélectionner des colonnes',
    exclude_columns: 'Exclure des colonnes',
    change_type: 'Changer le type',
};

export const STEP_ICONS: Record<SqlBlockStep['type'], string> = {
    select_columns: 'material-symbols-light:check-box',
    exclude_columns: 'material-symbols-light:indeterminate-check-box',
    change_type: 'material-symbols-light:transform',
};

/** Config par défaut pour un nouveau sqlBlock */
export function createDefaultSqlBlockConfig(source = ''): SqlBlockConfig {
    return {
        ast: {
            source,
            steps: [],
            materialize: 'view',
        },
        degraded: false,
        manualSql: null,
    };
}
