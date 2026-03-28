// ─── SqlBlockService ──────────────────────────────────────────────────────────
// Conversion bidirectionnelle entre AST SqlBlock et SQL DuckDB.
// Parser standard (P0) + parser intelligent par CTE (P1+) avec fallback custom_sql.

import type {
    SqlBlockAst,
    SqlBlockStep,
    ChangeTypeChange,
    FilterCondition,
    FilterGroup,
    FilterItem,
    SqlBlockMaterialize,
    SqlBlockConfig,
    SortKey,
    FilterOp,
    FilterValueKind,
    ChartConfig,
    ChartColumnRole,
    ConditionalRule,
} from './SqlBlockTypes';

const CTE_PREFIX = '_sqlblock_s';

/** Slug court par type de step — inclus dans le nom auto des CTEs. */
const STEP_TYPE_SLUG: Record<string, string> = {
    select_columns:  'select',
    exclude_columns: 'exclude',
    change_type:     'cast',
    filter_rows:     'filter',
    sort:            'sort',
    top_n:           'limit',
    rename_columns:  'rename',
    derive:          'derive',
    fill_null:       'fill',
    group_by:        'group',
    join:            'join',
    union:           'union',
    pivot:           'pivot',
    unpivot:         'unpivot',
    window:          'window',
    unnest:          'unnest',
    json_extract:    'json',
    date_trunc:      'date',
    custom_sql:      'sql',
};
const SLUG_TO_STEP_TYPE: Record<string, string> = Object.fromEntries(
    Object.entries(STEP_TYPE_SLUG).map(([k, v]) => [v, k])
);

/** Retourne le nom de CTE d'un step : son nom personnalisé ou le nom auto `_sqlblock_sN_slug`. */
function getCteName(step: SqlBlockAst['steps'][number], index: number): string {
    if (step.name?.trim()) return step.name.trim();
    const slug = STEP_TYPE_SLUG[step.type] ?? step.type;
    return `${CTE_PREFIX}${index}_${slug}`;
}

/** Retourne le nom CTE auto qui serait généré pour ce step/index (pour affichage placeholder). */
export function getAutoCteName(step: SqlBlockStep, index: number): string {
    const slug = STEP_TYPE_SLUG[step.type] ?? step.type;
    return `${CTE_PREFIX}${index}_${slug}`;
}

/** Déduit le type de step depuis le nom d'un CTE (_sqlblock_sN_slug → type). */
function stepTypeFromCteName(name: string): SqlBlockStep['type'] | null {
    const m = name.match(/_sqlblock_s\d+_([a-z]+)$/i);
    if (!m) return null;
    return (SLUG_TO_STEP_TYPE[m[1]] as SqlBlockStep['type']) ?? null;
}

/** Échappe la séquence `* /` pour qu'elle ne ferme pas un commentaire bloc SQL. */
function escapeBlockComment(s: string): string {
    return s.replace(/\*\//g, '* /').replace(/\r\n/g, ' ').replace(/\r/g, ' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// AST → SQL
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Chart SQL — génération et parsing du SELECT final avec annotations TaleShape
// ─────────────────────────────────────────────────────────────────────────────

/** Rôles TaleShape reconnus pour la détection chart dans le SELECT final. */
const CHART_ROLES_ORDERED = [
    'BARCHART_STACKED_PERCENT', 'BARCHART_STACKED', 'BARCHART_PERCENT', 'BARCHART',
    'LINECHART_PERCENT', 'LINECHART',
    'PIECHART_PERCENT', 'PIECHART',
    'DONUTCHART_PERCENT', 'DONUTCHART',
    'GAUGE_PERCENT', 'GAUGE',
    'BOXPLOT',
    'XAXIS', 'YAXIS', 'CATEGORY',
    'COLOR', 'COLORS', 'LABELS', 'RANGE',
    'KPI', 'LABEL', 'PERCENT', 'COMPARE', 'TREND_PERCENT', 'TREND', 'XLINE', 'YLINE',
];
const CHART_ROLES_SET = new Set(CHART_ROLES_ORDERED);

/**
 * Génère un SELECT final avec annotations ::ROLE à partir d'une ChartConfig.
 * Ex: SELECT "date"::XAXIS, "revenue"::BARCHART AS "Revenue" FROM "last_cte"
 */
const CHART_AXIS_ROLES = new Set(['XAXIS', 'YAXIS', 'CATEGORY', 'COLOR', 'COLORS']);

export function buildChartFinalSelect(fromSource: string, cfg: ChartConfig): string {
    // Préfixe LABEL si un titre est défini
    let prefix = '';
    if (cfg.label?.trim()) {
        const escaped = cfg.label.trim().replace(/'/g, "''");
        prefix = `SELECT '${escaped}'::LABEL;\n`;
    }
    // Axe / catégorie / couleur en premier, puis les données
    const sorted = [...cfg.columns].sort((a, b) => {
        const aAxis = CHART_AXIS_ROLES.has(a.role.toUpperCase()) ? 0 : 1;
        const bAxis = CHART_AXIS_ROLES.has(b.role.toUpperCase()) ? 0 : 1;
        return aAxis - bAxis;
    });
    const parts = sorted.map(col => {
        const role = col.role.toUpperCase();
        const alias = col.label?.trim() ? ` AS "${col.label.trim()}"` : '';
        let expr: string;
        if (col.valueKind === 'literal') {
            const n = Number(col.column);
            expr = col.column.trim() !== '' && !isNaN(n) ? col.column : `'${col.column.replace(/'/g, "''")}'`;
        } else if (col.valueKind === 'param') {
            expr = col.column; // {{paramName}} — pas de quoting
        } else {
            expr = quoteId(col.column); // colonne (défaut)
        }
        return `  ${expr}::${role}${alias}`;
    });
    return `${prefix}SELECT\n${parts.join(',\n')}\nFROM ${fromSource}`;
}

/**
 * Parse un SELECT final pour extraire une ChartConfig.
 * Reconnaît la syntaxe: col::ROLE [AS "alias"], ...
 * Retourne null si aucun rôle chart n'est trouvé.
 */
export function parseChartFinalSelect(selectSql: string): ChartConfig | null {
    // Extrait le titre depuis SELECT '...'::LABEL; s'il est présent en tête
    let cfgLabel: string | undefined;
    const labelM = selectSql.match(/^\s*SELECT\s+'([^']*)'\s*::LABEL\s*;/i);
    if (labelM) cfgLabel = labelM[1];

    const rolesPattern = CHART_ROLES_ORDERED.join('|');
    // Match: ("col" | '{{param}}' | {{param}} | 'literal' | unquoted)::ROLE [AS ("label" | label)]
    // Groups: 1=double-quoted col, 2=param({{...}}), 3=single-quoted literal, 4=unquoted
    const re = new RegExp(
        `(?:"([^"]+)"|\\{\\{([^}]+)\\}\\}|'([^']*)'|([\\w.]+))\\s*::\\s*(${rolesPattern})(?:\\s+AS\\s+(?:"([^"]+)"|([\\w]+)))?`,
        'gi'
    );
    const columns: ChartColumnRole[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(selectSql)) !== null) {
        const role = m[5].toUpperCase();
        const label = m[6] ?? m[7] ?? undefined;
        // Skip LABEL role — it's a title prefix, not a data column
        if (!CHART_ROLES_SET.has(role) || role === 'LABEL') continue;

        let column: string;
        let valueKind: 'column' | 'literal' | 'param' | undefined;

        if (m[1] !== undefined) {
            // "double-quoted" → column identifier
            column = m[1];
            valueKind = 'column';
        } else if (m[2] !== undefined) {
            // {{param}} → parameter
            column = `{{${m[2]}}}`;
            valueKind = 'param';
        } else if (m[3] !== undefined) {
            // 'single-quoted' → literal string (may be numeric)
            column = m[3];
            valueKind = 'literal';
        } else {
            // unquoted word: numeric token → literal, otherwise → column
            column = m[4];
            valueKind = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(column) ? 'literal' : 'column';
        }

        const entry: ChartColumnRole = { column, role, label };
        if (valueKind !== 'column') entry.valueKind = valueKind;
        columns.push(entry);
    }
    if (!columns.length && !cfgLabel) return null;

    // Déduire le chartType depuis les rôles présents (même logique que EChartSqlParser)
    const roleSet = new Set(columns.map(c => c.role));
    const has = (r: string) => roleSet.has(r);
    let chartType = 'bar';
    if (has('BARCHART_STACKED_PERCENT')) chartType = 'bar';
    else if (has('BARCHART_PERCENT')) chartType = 'bar';
    else if (has('BARCHART_STACKED')) chartType = 'bar';
    else if (has('BARCHART') && has('LINECHART')) chartType = 'bar+line';
    else if (has('BARCHART')) chartType = has('YAXIS') && !has('XAXIS') ? 'bar' : 'bar';
    else if (has('LINECHART_PERCENT') || has('LINECHART')) chartType = 'line';
    else if (has('PIECHART_PERCENT') || has('PIECHART')) chartType = 'pie';
    else if (has('DONUTCHART_PERCENT') || has('DONUTCHART')) chartType = 'donut';
    else if (has('GAUGE_PERCENT') || has('GAUGE')) chartType = 'gauge';
    else if (has('BOXPLOT')) chartType = 'boxplot';
    else if (has('KPI') || has('PERCENT') || has('COMPARE') || has('TREND') || has('TREND_PERCENT')) chartType = 'kpi';

    const cfg: ChartConfig = { chartType, columns };
    if (cfgLabel) cfg.label = cfgLabel;
    return cfg;
}

export function astToSql(ast: SqlBlockAst): string {
    const { source, steps, chartConfig } = ast;

    if (!steps || steps.length === 0) {
        const from = fromExpr(source);
        if (chartConfig?.columns?.length) return buildChartFinalSelect(from, chartConfig);
        return `SELECT * FROM ${from}`;
    }
    // Step unique sans nom : forme simple (pas de CTE)
    // Exception : custom_sql → toujours en CTE pour préserver la structure (SQL non standard)
    if (steps.length === 1 && !steps[0].name?.trim() && steps[0].type !== 'custom_sql') {
        const sql = singleStepToSql(fromExpr(source), steps[0]);
        const desc = steps[0].description?.trim();
        // Pas de forme simple quand chartConfig présent : on passe par CTE pour pouvoir
        // ajouter le SELECT final avec annotations
        if (!chartConfig?.columns?.length) {
            return desc ? `/* ${escapeBlockComment(desc)} */\n${sql}` : sql;
        }
    }

    const ctes: string[] = [];
    for (let i = 0; i < steps.length; i++) {
        const prevSrc = i === 0 ? fromExpr(source) : quoteId(getCteName(steps[i - 1], i - 1));
        const inner = singleStepToSql(prevSrc, steps[i]);
        const cteName = quoteId(getCteName(steps[i], i));
        const desc = steps[i].description?.trim();
        const comment = desc ? `/* ${escapeBlockComment(desc)} */\n    ` : '';
        ctes.push(`  ${cteName} AS (\n    ${comment}${inner.replace(/\n/g, '\n    ')}\n  )`);
    }
    const lastName = quoteId(getCteName(steps[steps.length - 1], steps.length - 1));
    const finalSelect = chartConfig?.columns?.length
        ? buildChartFinalSelect(lastName, chartConfig)
        : `SELECT * FROM ${lastName}`;
    // Hoist SELECT '...'::LABEL; before WITH so DuckDB can parse the WITH block cleanly
    const labelPrefixM = finalSelect.match(/^(SELECT\s+'[^']*'\s*::LABEL\s*;\n?)/i);
    const labelPrefix = labelPrefixM ? labelPrefixM[1] : '';
    const body = labelPrefix ? finalSelect.slice(labelPrefix.length) : finalSelect;
    return `${labelPrefix}WITH\n${ctes.join(',\n')}\n${body}`;
}

export function generateMaterializeQuery(_name: string, sql: string, materialize: SqlBlockMaterialize): string {
    if (materialize === 'ephemeral') return sql;
    // {{ _name }} est substitué à l'exécution avec le nom réel de la cellule.
    // Le DROP de l'opposé est géré à l'exécution (executionSlice), pas affiché ici.
    return materialize === 'table'
        ? `CREATE OR REPLACE TABLE {{ _name }} AS (\n${sql}\n)`
        : `CREATE OR REPLACE VIEW {{ _name }} AS (\n${sql}\n)`;
}

/** Construit le SQL affiché dans l'éditeur : avec CREATE OR REPLACE pour VIEW/TABLE, SQL brut pour SELECT. */
export function buildDisplaySql(name: string | null | undefined, selectSql: string, materialize: SqlBlockMaterialize): string {
    if (!name?.trim() || materialize === 'ephemeral') return selectSql;
    return generateMaterializeQuery(name, selectSql, materialize);
}

/** Retire le préfixe DROP + CREATE OR REPLACE VIEW/TABLE d'un SQL pour extraire le SELECT interne.
 *  Gère les noms quotés ("id"), les templates {{ _name }} et les identifiants bruts. */
export function stripMaterializePrefix(sql: string): string {
    const anyName = `(?:"[^"]*"|\\{\\{[^}]+\\}\\}|\\S+)`;
    const m = sql.trim().match(new RegExp(
        `^(?:DROP\\s+(?:VIEW|TABLE)\\s+IF\\s+EXISTS\\s+${anyName}\\s*;\\s*)?` +
        `CREATE\\s+OR\\s+REPLACE\\s+(?:VIEW|TABLE)\\s+${anyName}\\s+AS\\s*\\(\\s*([\\s\\S]*?)\\s*\\)\\s*;?\\s*$`,
        'i'
    ));
    if (m) return m[1].trim();
    return sql.trim();
}

export function stepSql(ast: SqlBlockAst, stepIndex: number): string {
    // Si pas de source ET pas de steps : rien à faire
    if (!ast.source && !ast.steps?.length) return '';
    if (stepIndex < 0 || !ast.steps?.length) {
        if (!ast.source) return '';
        return `SELECT * FROM ${fromExpr(ast.source)}`;
    }
    return astToSql({ ...ast, steps: ast.steps.slice(0, stepIndex + 1) });
}

export function getEffectiveSql(config: SqlBlockConfig): string {
    if (config.degraded && config.manualSql) return config.manualSql;
    return astToSql(config.ast);
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL → AST (parser limité aux patterns P0 générés)
// ─────────────────────────────────────────────────────────────────────────────

export interface SqlParseResult {
    ast: SqlBlockAst | null;
    compatible: boolean;
    error?: string;
}

export function sqlToAst(sql: string, materialize: SqlBlockMaterialize = 'view'): SqlParseResult {
    if (!sql?.trim()) return { ast: null, compatible: false, error: 'SQL vide' };
    const normalized = sql.replace(/[ \t]+/g, ' ').trim();

    const cteAst = tryParseCteChain(normalized, materialize);
    if (cteAst) return { ast: cteAst, compatible: true };

    const simpleAst = tryParseSimpleSelect(normalized, materialize);
    if (simpleAst) return { ast: simpleAst, compatible: true };

    return { ast: null, compatible: false, error: 'SQL non compatible avec les blocs disponibles' };
}

function tryParseSimpleSelect(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    const m = sql.match(/^SELECT\s+(.+?)\s+FROM\s+((?:"[^"]*"|\S)+)\s*;?\s*$/is);
    if (!m) return null;
    const parsed = parseSelectBody(m[1].trim());
    if (!parsed) return null;
    return { source: unquoteId(m[2].trim()), steps: parsed.step ? [parsed.step] : [], materialized: materialize };
}

/** Extrait le SELECT final d'un WITH query (le SELECT qui suit tous les CTEs, à profondeur 0). */
function extractFinalSelectFromWithQuery(sql: string): string | null {
    const withM = sql.match(/^WITH\s+/i);
    if (!withM) return null;
    let pos = withM[0].length;
    let depth = 0;
    while (pos < sql.length) {
        const ch = sql[pos];
        if (ch === '(') { depth++; pos++; continue; }
        if (ch === ')') { depth--; pos++; continue; }
        if (depth === 0 && /^SELECT\b/i.test(sql.slice(pos))) return sql.slice(pos).trim();
        pos++;
    }
    return null;
}

function tryParseCteChain(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    if (!/^WITH\s+_sqlblock_s/i.test(sql)) return null;
    const ctes = extractCtes(sql);
    if (!ctes?.length) return null;

    const steps: SqlBlockStep[] = [];
    for (const cte of ctes) {
        const parsed = parseSelectBody(cte.body);
        if (!parsed) return null;
        if (parsed.step) steps.push(parsed.step);
    }
    const finalSql = extractFinalSelectFromWithQuery(sql);
    const chartConfig = finalSql ? parseChartFinalSelect(finalSql) ?? undefined : undefined;
    return { source: unquoteId(ctes[0].source), steps, materialized: materialize, ...(chartConfig ? { chartConfig } : {}) };
}

interface CteInfo { body: string; source: string }

function extractCtes(sql: string): CteInfo[] | null {
    const ctes: CteInfo[] = [];
    const re = /_sqlblock_s\d+(?:_[a-z]+)?\s+AS\s*\(/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(sql)) !== null) {
        const innerSql = extractParenContent(sql, match.index + match[0].length - 1);
        if (!innerSql) return null;
        // Ignore le commentaire de description /* ... */ en début de corps
        const stripped = innerSql.replace(/[ \t\r\n]+/g, ' ').trim()
            .replace(/^\/\*.*?\*\/\s*/s, '').trim();
        const m = stripped.match(/^SELECT\s+(.+?)\s+FROM\s+((?:"[^"]*"|\S)+)\s*;?\s*$/is);
        if (!m) return null;
        ctes.push({ body: m[1].trim(), source: m[2].trim() });
    }
    return ctes.length > 0 ? ctes : null;
}

function extractParenContent(sql: string, start: number): string | null {
    let depth = 0, i = start;
    while (i < sql.length) {
        if (sql[i] === '(') depth++;
        else if (sql[i] === ')') { depth--; if (depth === 0) return sql.slice(start + 1, i); }
        i++;
    }
    return null;
}

function parseSelectBody(body: string): { step: SqlBlockStep | null } | null {
    const b = body.trim();
    if (b === '*') return { step: null };

    const excludeMatch = b.match(/^\*\s+EXCLUDE\s*\(([^)]+)\)\s*$/i);
    if (excludeMatch) {
        const columns = splitIdentifiers(excludeMatch[1]);
        return columns ? { step: { type: 'exclude_columns', columns } } : null;
    }

    const replaceMatch = b.match(/^\*\s+REPLACE\s*\((.+)\)\s*$/is);
    if (replaceMatch) {
        const changes = parseCastList(replaceMatch[1]);
        return changes ? { step: { type: 'change_type', changes } } : null;
    }

    if (!b.includes('*')) {
        const columns = splitIdentifiers(b);
        if (columns?.length) return { step: { type: 'select_columns', columns } };
    }

    return null;
}

function splitIdentifiers(s: string): string[] | null {
    const ids: string[] = [];
    for (const p of s.split(',').map(x => x.trim()).filter(Boolean)) {
        const id = parseIdentifier(p);
        if (!id) return null;
        ids.push(id);
    }
    return ids;
}

function parseIdentifier(s: string): string | null {
    s = s.trim();
    if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1).replace(/""/g, '"');
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)) return s;
    return null;
}

function parseCastList(s: string): ChangeTypeChange[] | null {
    const re = /CAST\(([^\s),]+)\s+AS\s+([A-Z_][A-Z0-9_]*(?:\(\d+(?:,\s*\d+)?\))?)\)\s+AS\s+([^\s,)]+)/gi;
    const changes: ChangeTypeChange[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
        changes.push({ column: unquoteId(m[1]), targetType: m[2].toUpperCase() });
    }
    return changes.length > 0 ? changes : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// singleStepToSql — SQL généré pour chaque step
// ─────────────────────────────────────────────────────────────────────────────

function singleStepToSql(source: string, step: SqlBlockStep): string {
    switch (step.type) {

        // ── P0 ──────────────────────────────────────────────────────────────
        case 'select_columns': {
            if (!step.columns.length) return `SELECT * FROM ${source}`;
            return `SELECT\n  ${step.columns.map(quoteId).join(',\n  ')}\nFROM ${source}`;
        }
        case 'exclude_columns': {
            if (!step.columns.length) return `SELECT * FROM ${source}`;
            return `SELECT * EXCLUDE (${step.columns.map(quoteId).join(', ')}) FROM ${source}`;
        }
        case 'change_type': {
            if (!step.changes.length) return `SELECT * FROM ${source}`;
            const casts = step.changes
                .map(c => `CAST(${quoteId(c.column)} AS ${c.targetType}) AS ${quoteId(c.column)}`)
                .join(',\n  ');
            return `SELECT * REPLACE (\n  ${casts}\n) FROM ${source}`;
        }

        // ── P1 ──────────────────────────────────────────────────────────────
        case 'filter_rows': {
            // Migration rétrocompat : ancien format conditions[] → groups
            const rawGroups = step.groups?.length
                ? step.groups
                : (step.conditions?.length
                    ? [{ items: step.conditions.map(c => ({ kind: 'cond' as const, cond: c })), logicOp: step.logicOp ?? 'AND' }]
                    : [])
            const activeGroups = rawGroups.filter(g => filterGroupHasContent(g))
            if (!activeGroups.length) return `SELECT * FROM ${source}`;
            const whereSql = activeGroups.map(g => {
                const sql = filterGroupToSql(g)
                return activeGroups.length > 1 ? `(${sql})` : sql
            }).join(`\n  ${step.groupLogicOp ?? 'OR'} `)
            return `SELECT * FROM ${source}\nWHERE ${whereSql}`;
        }
        case 'sort': {
            if (!step.keys.length) return `SELECT * FROM ${source}`;
            const keys = step.keys
                .map(k => `${quoteId(k.column)} ${k.direction.toUpperCase()} NULLS ${k.nulls.toUpperCase()}`)
                .join(', ');
            return `SELECT * FROM ${source}\nORDER BY ${keys}`;
        }
        case 'top_n': {
            if (step.mode === 'limit') {
                const off = step.offset ? ` OFFSET ${step.offset}` : '';
                return `SELECT * FROM ${source}\nLIMIT ${step.n}${off}`;
            }
            const meth = step.sampleMethod ? ` (${step.sampleMethod})` : '';
            const unit = step.mode === 'sample_percent' ? `${step.n}%` : `${step.n} ROWS`;
            return `SELECT * FROM ${source}\nUSING SAMPLE ${unit}${meth}`;
        }
        case 'rename_columns': {
            if (!step.renames.length) return `SELECT * FROM ${source}`;
            const renames = step.renames.map(r => `${quoteId(r.from)} AS ${quoteId(r.to)}`).join(', ');
            return `SELECT * RENAME (${renames}) FROM ${source}`;
        }
        case 'derive': {
            if (!step.columns.length) return `SELECT * FROM ${source}`;
            const adds = step.columns.filter(c => !c.replace);
            const replaces = step.columns.filter(c => c.replace);
            const excludeClause = replaces.length
                ? ` EXCLUDE (${replaces.map(c => quoteId(c.name)).join(', ')})`
                : '';
            const exprs = [...replaces, ...adds]
                .map(c => `(${c.expr}) AS ${quoteId(c.name)}`)
                .join(',\n  ');
            return `SELECT *${excludeClause},\n  ${exprs}\nFROM ${source}`;
        }
        case 'fill_null': {
            if (!step.fills.length) return `SELECT * FROM ${source}`;
            const reps = step.fills.map(f => {
                const col = quoteId(f.column);
                switch (f.strategy) {
                    case 'value':        return `COALESCE(${col}, ${quoteSqlValue(f.value || '')}) AS ${col}`;
                    case 'zero':         return `COALESCE(${col}, 0) AS ${col}`;
                    case 'empty_string': return `COALESCE(${col}, '') AS ${col}`;
                    case 'mean':         return `COALESCE(${col}, AVG(${col}) OVER ()) AS ${col}`;
                    case 'median':       return `COALESCE(${col}, MEDIAN(${col}) OVER ()) AS ${col}`;
                }
            });
            return `SELECT * REPLACE (\n  ${reps.join(',\n  ')}\n) FROM ${source}`;
        }

        // ── P2 ──────────────────────────────────────────────────────────────
        case 'group_by': {
            const groupCols = step.groupCols.map(quoteId);
            const aggs = step.aggregations.map(a => {
                const col = a.column === '*' ? '*' : quoteId(a.column);
                const fn = a.fn.toUpperCase();
                switch (a.fn) {
                    case 'count':          return `COUNT(${col}) AS ${quoteId(a.alias)}`;
                    case 'count_distinct': return `COUNT(DISTINCT ${col}) AS ${quoteId(a.alias)}`;
                    case 'string_agg':     return `STRING_AGG(${col}, ${quoteSqlValue(a.separator ?? ', ')}) AS ${quoteId(a.alias)}`;
                    default:               return `${fn}(${col}) AS ${quoteId(a.alias)}`;
                }
            });
            const selCols = [...groupCols, ...aggs];
            const groupBy = groupCols.length ? `\nGROUP BY ${groupCols.join(', ')}` : '';
            return `SELECT\n  ${selCols.join(',\n  ')}\nFROM ${source}${groupBy}`;
        }
        case 'join': {
            const jt = step.joinType === 'anti' ? 'LEFT' : step.joinType.toUpperCase();
            const onClauses = step.on.map(c => `${source}.${quoteId(c.left)} = _r.${quoteId(c.right)}`).join(' AND ');
            const rightCols = step.selectRight === '*'
                ? '_r.*'
                : step.selectRight.map(c => `_r.${quoteId(c)}`).join(', ');
            const antiWhere = step.joinType === 'anti' && step.on[0]
                ? `\nWHERE _r.${quoteId(step.on[0].right)} IS NULL`
                : '';
            return `SELECT ${source}.*, ${rightCols}\nFROM ${source}\n${jt} JOIN ${quoteId(step.rightTable)} AS _r\n  ON ${onClauses}${antiWhere}`;
        }
        case 'union': {
            const mode = step.mode === 'all' ? 'UNION ALL' : 'UNION';
            return `SELECT * FROM ${source}\n${mode}\nSELECT * FROM ${quoteId(step.table)}`;
        }
        case 'pivot': {
            const group = step.groupCols.length
                ? `\nGROUP BY ${step.groupCols.map(quoteId).join(', ')}`
                : '';
            return `SELECT * FROM (PIVOT ${source}\n  ON ${quoteId(step.onColumn)}\n  USING ${step.valueFn}(${quoteId(step.valueColumn)})${group})`;
        }
        case 'unpivot': {
            const cols = step.columns.map(quoteId).join(', ');
            return `SELECT * FROM (UNPIVOT ${source}\n  ON ${cols}\n  INTO NAME ${quoteId(step.nameCol)} VALUE ${quoteId(step.valueCol)})`;
        }

        // ── P3 ──────────────────────────────────────────────────────────────
        case 'window': {
            if (!step.columns.length) return `SELECT * FROM ${source}`;
            const wins = step.columns.map(w => {
                const arg = w.col ? quoteId(w.col) : '';
                const fnStr = (w.fn === 'LAG' || w.fn === 'LEAD') && w.offset
                    ? `${w.fn}(${arg}, ${w.offset})`
                    : `${w.fn}(${arg})`;
                const partPart = w.partitionBy.length
                    ? `PARTITION BY ${w.partitionBy.map(quoteId).join(', ')} `
                    : '';
                const ordPart = w.orderBy.length
                    ? `ORDER BY ${w.orderBy.map(k => `${quoteId(k.column)} ${k.direction.toUpperCase()}`).join(', ')} `
                    : '';
                const framePart = w.frame ? `${w.frame} ` : '';
                return `${fnStr} OVER (${partPart}${ordPart}${framePart}) AS ${quoteId(w.alias)}`;
            });
            return `SELECT *,\n  ${wins.join(',\n  ')}\nFROM ${source}`;
        }
        case 'unnest': {
            if (step.keepEmpty) {
                return `SELECT ${source}.*, _u.${quoteId(step.alias)}\nFROM ${source}\nLEFT JOIN UNNEST(${source}.${quoteId(step.column)}) AS _u(${quoteId(step.alias)}) ON TRUE`;
            }
            return `SELECT ${source}.*, _u.${quoteId(step.alias)}\nFROM ${source},\nUNNEST(${source}.${quoteId(step.column)}) AS _u(${quoteId(step.alias)})`;
        }
        case 'json_extract': {
            if (!step.extractions.length) return `SELECT * FROM ${source}`;
            const cols = step.extractions.map(e => {
                const base = `json_extract_string(${source}.${quoteId(step.column)}, '${e.path}')`;
                const cast = e.targetType ? `CAST(${base} AS ${e.targetType})` : base;
                return `${cast} AS ${quoteId(e.alias)}`;
            });
            return `SELECT ${source}.*,\n  ${cols.join(',\n  ')}\nFROM ${source}`;
        }
        case 'date_trunc': {
            const gran = `'${step.granularity}'`;
            const expr = `DATE_TRUNC(${gran}, ${quoteId(step.column)})`;
            if (step.mode === 'replace') {
                return `SELECT * REPLACE (${expr} AS ${quoteId(step.column)}) FROM ${source}`;
            }
            const alias = step.alias || `${step.column}_${step.granularity}`;
            return `SELECT *, ${expr} AS ${quoteId(alias)} FROM ${source}`;
        }

        case 'conditional_column': {
            const col = quoteId(step.newColumn || 'nouvelle_colonne');
            const whenClauses = (step.rules ?? [])
                .filter(r => filterGroupHasContent(r.when))
                .map(r => {
                    const cond = filterGroupToSql(r.when);
                    const thenVal = renderFilterValue(r.then ?? '', r.thenKind);
                    return `WHEN ${cond} THEN ${thenVal}`;
                });
            const elseClause = step.elseValue !== undefined && step.elseValue !== ''
                ? `ELSE ${renderFilterValue(step.elseValue, step.elseKind)}`
                : 'ELSE NULL';
            const caseExpr = `CASE\n    ${whenClauses.join('\n    ')}\n    ${elseClause}\n  END`;
            return `SELECT *, ${caseExpr} AS ${col} FROM ${source}`;
        }

        case 'custom_sql': {
            const sql = (step.sql?.trim() || `SELECT * FROM {{subquery}}`).replace(/;+\s*$/, '');
            return sql.replace(/\{\{subquery\}\}/g, source);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function filterGroupHasContent(g: FilterGroup): boolean {
    // Retrocompat: old format had conditions[]
    if (g.conditions?.length) return true;
    return (g.items ?? []).some(item =>
        item.kind === 'cond' ? !!item.cond.column : filterGroupHasContent(item.group)
    )
}

function filterGroupToSql(g: FilterGroup): string {
    // Retrocompat: old format with conditions[]
    const items: FilterItem[] = g.items?.length
        ? g.items
        : (g.conditions ?? []).map(c => ({ kind: 'cond' as const, cond: c }))

    const parts = items
        .filter(item => item.kind === 'cond' ? !!item.cond.column : filterGroupHasContent(item.group))
        .map(item => {
            if (item.kind === 'cond') return conditionToSql(item.cond)
            const inner = filterGroupToSql(item.group)
            return `(${inner})`
        })

    if (!parts.length) return '1=1'
    const joined = parts.join(` ${g.logicOp ?? 'AND'} `)
    const expr = parts.length > 1 ? `(${joined})` : joined
    return g.negate ? `NOT ${expr}` : expr
}

/** Rendu d'une valeur de filtre selon son mode (literal, column, param). */
function renderFilterValue(v: string, kind?: FilterValueKind): string {
    if (kind === 'column') return quoteId(v)
    if (kind === 'param')  return v   // {{paramName}} — substitué à l'exécution
    return quoteSqlValue(v)
}

function conditionToSql(c: FilterCondition): string {
    const col = quoteId(c.column);
    const val  = renderFilterValue(c.value ?? '', c.valueKind)
    const valTo = renderFilterValue(c.valueTo ?? '', c.valueToKind)
    switch (c.op) {
        case '=':       return `${col} = ${val}`;
        case '!=':      return `${col} != ${val}`;
        case '>':       return `${col} > ${val}`;
        case '<':       return `${col} < ${val}`;
        case '>=':      return `${col} >= ${val}`;
        case '<=':      return `${col} <= ${val}`;
        case 'in':      return `${col} IN (${(c.values ?? []).map(quoteSqlValue).join(', ')})`;
        case 'not_in':  return `${col} NOT IN (${(c.values ?? []).map(quoteSqlValue).join(', ')})`;
        case 'is_null': return `${col} IS NULL`;
        case 'not_null':return `${col} IS NOT NULL`;
        case 'like':    return `${col} LIKE ${val}`;
        case 'ilike':   return `${col} ILIKE ${val}`;
        case 'between': return `${col} BETWEEN ${val} AND ${valTo}`;
    }
}

/** Entoure d'apostrophes si non-numérique / non-booléen. */
function quoteSqlValue(v: string): string {
    if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(v)) return v;
    if (/^(true|false|null)$/i.test(v)) return v.toLowerCase();
    return `'${v.replace(/'/g, "''")}'`;
}

export function quoteId(name: string): string {
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return name;
    return `"${name.replace(/"/g, '""')}"`;
}

/** Génère l'expression FROM : sous-requête brute (commence par '(') → as-is, sinon identifiant quoté. */
function fromExpr(source: string): string {
    return source.startsWith('(') ? source : quoteId(source);
}

function unquoteId(name: string): string {
    if (name.startsWith('"') && name.endsWith('"')) return name.slice(1, -1).replace(/""/g, '"');
    return name;
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser intelligent par CTE — sqlToAstSmart
// Tente de parser chaque CTE indépendamment ; les CTEs non parsables deviennent
// des steps custom_sql. Évite le basculement en mode dégradé global.
// ─────────────────────────────────────────────────────────────────────────────

interface CteFullInfo {
    name: string;        // nom du CTE (sans quotes)
    fullBody: string;    // corps normalisé sans commentaire initial
    source: string;      // nom de la source (unquoted) dans ce CTE
    description?: string;// texte extrait du /* commentaire */ initial
}

function extractCtesWithFullBody(sql: string): CteFullInfo[] | null {
    // Parser séquentiel : lit TOUS les CTEs du bloc WITH (noms auto ET custom)
    const withM = sql.match(/^WITH\s+/i);
    if (!withM) return null;

    const ctes: CteFullInfo[] = [];
    let pos = withM[0].length;

    while (pos < sql.length) {
        // Saute les espaces
        while (pos < sql.length && /\s/.test(sql[pos])) pos++;
        // Fin du bloc WITH = SELECT final
        if (/^SELECT\b/i.test(sql.slice(pos))) break;

        // Lit le nom du CTE (avec ou sans guillemets)
        let name: string;
        if (sql[pos] === '"') {
            const end = sql.indexOf('"', pos + 1);
            if (end < 0) return null;
            name = sql.slice(pos + 1, end).replace(/""/g, '"');
            pos = end + 1;
        } else {
            const m = sql.slice(pos).match(/^([_a-zA-Z][_a-zA-Z0-9]*)/);
            if (!m) return null;
            name = m[1];
            pos += m[1].length;
        }

        // Saute les espaces puis vérifie AS (
        while (pos < sql.length && /\s/.test(sql[pos])) pos++;
        const asM = sql.slice(pos).match(/^AS\s*\(/i);
        if (!asM) return null;
        const openParen = pos + asM[0].length - 1;
        pos = openParen;

        // Extrait le corps entre parenthèses
        const inner = extractParenContent(sql, pos);
        if (!inner) return null;
        pos += inner.length + 2; // saute ( corps )

        const normalized = inner.replace(/[ \t\r\n]+/g, ' ').trim();
        const descM = normalized.match(/^\/\*(.*?)\*\//s);
        const description = descM ? descM[1].trim() : undefined;
        const bodyNoComment = normalized.replace(/^\/\*.*?\*\/\s*/s, '').trim();
        // Pour PIVOT/UNPIVOT : la vraie source est l'identifiant à l'intérieur de la sous-requête
        const pivotSrcM = bodyNoComment.match(/\bFROM\s+\(\s*(?:UN)?PIVOT\s+((?:"[^"]*"|\w[\w.]*?))\s+/i);
        const srcM = bodyNoComment.match(/\bFROM\s+((?:"[^"]*"|\S)+)/i);
        const rawSrcToken = pivotSrcM ? pivotSrcM[1] : srcM ? srcM[1] : null;
        const source = rawSrcToken && !rawSrcToken.startsWith('(') ? unquoteId(rawSrcToken) : '';
        ctes.push({ name, fullBody: bodyNoComment, source, description });

        // Saute la virgule séparatrice
        while (pos < sql.length && /[\s,]/.test(sql[pos])) pos++;
    }

    return ctes.length > 0 ? ctes : null;
}

function escapeRegex(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parse une valeur SQL littérale (chaîne quotée ou numérique/booléen). */
function parseSqlLiteral(s: string): string {
    s = s.trim();
    if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1).replace(/''/g, "'");
    return s;
}

/** Parse une liste de valeurs SQL séparées par virgule (pour IN/NOT IN). */
function parseSqlValueList(s: string): string[] | null {
    const values: string[] = [];
    let current = '';
    let inStr = false;
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === "'" && !inStr) { inStr = true; current += c; continue; }
        if (c === "'" && inStr) {
            if (s[i + 1] === "'") { current += "''"; i++; continue; }
            inStr = false; current += c; continue;
        }
        if (c === ',' && !inStr) {
            values.push(parseSqlLiteral(current.trim()));
            current = '';
            continue;
        }
        current += c;
    }
    if (current.trim()) values.push(parseSqlLiteral(current.trim()));
    return values.length > 0 ? values : null;
}

const COL_PAT = '(?:"[^"]*"|[a-zA-Z_][a-zA-Z0-9_]*)';

/** Parse une condition atomique SQL (col OP valeur). */
function parseCondition(s: string): FilterCondition | null {
    s = s.trim();
    let m: RegExpMatchArray | null;

    // IS NOT NULL
    m = s.match(new RegExp(`^(${COL_PAT})\\s+IS\\s+NOT\\s+NULL\\s*$`, 'i'));
    if (m) return { column: unquoteId(m[1]), op: 'not_null' };

    // IS NULL
    m = s.match(new RegExp(`^(${COL_PAT})\\s+IS\\s+NULL\\s*$`, 'i'));
    if (m) return { column: unquoteId(m[1]), op: 'is_null' };

    // BETWEEN ... AND ...
    m = s.match(new RegExp(`^(${COL_PAT})\\s+BETWEEN\\s+(.+?)\\s+AND\\s+(.+?)\\s*$`, 'i'));
    if (m) return { column: unquoteId(m[1]), op: 'between', value: parseSqlLiteral(m[2]), valueTo: parseSqlLiteral(m[3]) };

    // NOT IN
    m = s.match(new RegExp(`^(${COL_PAT})\\s+NOT\\s+IN\\s*\\((.+)\\)\\s*$`, 'i'));
    if (m) {
        const values = parseSqlValueList(m[2]);
        if (!values) return null;
        return { column: unquoteId(m[1]), op: 'not_in', values };
    }

    // IN
    m = s.match(new RegExp(`^(${COL_PAT})\\s+IN\\s*\\((.+)\\)\\s*$`, 'i'));
    if (m) {
        const values = parseSqlValueList(m[2]);
        if (!values) return null;
        return { column: unquoteId(m[1]), op: 'in', values };
    }

    // ILIKE
    m = s.match(new RegExp(`^(${COL_PAT})\\s+ILIKE\\s+('(?:[^']|'')*')\\s*$`, 'i'));
    if (m) return { column: unquoteId(m[1]), op: 'ilike', value: parseSqlLiteral(m[2]) };

    // LIKE
    m = s.match(new RegExp(`^(${COL_PAT})\\s+LIKE\\s+('(?:[^']|'')*')\\s*$`, 'i'));
    if (m) return { column: unquoteId(m[1]), op: 'like', value: parseSqlLiteral(m[2]) };

    // Comparaison : =, !=, >=, <=, >, <
    m = s.match(new RegExp(`^(${COL_PAT})\\s*(!=|>=|<=|>|<|=)\\s*(.+?)\\s*$`));
    if (m) return { column: unquoteId(m[1]), op: m[2] as FilterOp, value: parseSqlLiteral(m[3]) };

    return null;
}

/**
 * Découpe une chaîne SQL par un séparateur de mots-clés (AND/OR) au niveau 0
 * (pas dans des parenthèses ni des chaînes littérales), en ignorant l'AND
 * qui fait partie d'un BETWEEN.
 */
function splitTopLevelBy(s: string, sepRe: RegExp): string[] {
    const parts: string[] = [];
    let depth = 0;
    let inStr = false;
    let start = 0;
    let i = 0;
    while (i < s.length) {
        const c = s[i];
        if (c === "'" && !inStr) { inStr = true; i++; continue; }
        if (c === "'" && inStr) {
            if (s[i + 1] === "'") { i += 2; continue; }
            inStr = false; i++; continue;
        }
        if (!inStr) {
            if (c === '(') { depth++; i++; continue; }
            if (c === ')') { depth--; i++; continue; }
            if (depth === 0) {
                const slice = s.slice(i);
                const m = slice.match(sepRe);
                if (m && m.index === 0) {
                    // Vérifie si cet AND est la 2e partie d'un BETWEEN
                    if (/^AND\b/i.test(m[0])) {
                        const before = s.slice(start, i).trim();
                        const betweenCount = (before.match(/\bBETWEEN\b/gi) ?? []).length;
                        const andCount = (before.match(/\bAND\b/gi) ?? []).length;
                        if (betweenCount > andCount) { i += m[0].length; continue; }
                    }
                    parts.push(s.slice(start, i).trim());
                    i += m[0].length;
                    start = i;
                    continue;
                }
            }
        }
        i++;
    }
    parts.push(s.slice(start).trim());
    return parts.filter(Boolean);
}

/** Parse un groupe de filtre récursif (avec AND/OR/NOT/parens). */
function parseSingleFilterGroup(s: string): FilterGroup | null {
    let negate = false;
    let inner = s.trim();

    // NOT préfixe
    if (/^NOT\s+/i.test(inner)) {
        negate = true;
        inner = inner.replace(/^NOT\s+/i, '').trim();
    }

    // Déplie les parenthèses extérieures si l'expression entière est entourée
    if (inner.startsWith('(')) {
        const content = extractParenContent(inner, 0);
        if (content !== null && inner === `(${content})`) inner = content.trim();
    }

    // Essaie de séparer par AND
    let parts = splitTopLevelBy(inner, /^AND\b/i);
    let logicOp: 'AND' | 'OR' = 'AND';

    // Si une seule partie, essaie OR
    if (parts.length === 1) {
        const orParts = splitTopLevelBy(inner, /^OR\b/i);
        if (orParts.length > 1) { parts = orParts; logicOp = 'OR'; }
    }

    const items: FilterItem[] = [];
    for (const part of parts) {
        const t = part.trim();
        // Sous-groupe entre parenthèses avec NOT ?
        if (/^NOT\s*\(/i.test(t) || (t.startsWith('(') && t.endsWith(')'))) {
            const g = parseSingleFilterGroup(t);
            if (!g) return null;
            items.push({ kind: 'group', group: g });
        } else {
            const cond = parseCondition(t);
            if (!cond) return null;
            items.push({ kind: 'cond', cond });
        }
    }

    return { items, logicOp, negate };
}

/** Parse une clause WHERE complète en tableau de FilterGroup. */
function parseWhereToGroups(where: string): FilterGroup[] | null {
    // Les groupes de premier niveau sont séparés par le groupLogicOp (OR par défaut)
    const topParts = splitTopLevelBy(where, /^OR\b/i);
    const groups: FilterGroup[] = [];
    for (const part of topParts) {
        const g = parseSingleFilterGroup(part.trim());
        if (!g) return null;
        groups.push(g);
    }
    return groups.length > 0 ? groups : null;
}

/** Parse une liste ORDER BY en SortKey[]. */
function parseOrderByKeys(orderBy: string): SortKey[] | null {
    const parts = orderBy.split(',');
    const keys: SortKey[] = [];
    for (const part of parts) {
        const p = part.trim();
        // "col" ASC NULLS LAST
        let m = p.match(new RegExp(`^(${COL_PAT})\\s+(ASC|DESC)\\s+NULLS\\s+(FIRST|LAST)\\s*$`, 'i'));
        if (m) { keys.push({ column: unquoteId(m[1]), direction: m[2].toLowerCase() as 'asc'|'desc', nulls: m[3].toLowerCase() as 'first'|'last' }); continue; }
        // "col" ASC / DESC (sans NULLS)
        m = p.match(new RegExp(`^(${COL_PAT})\\s*(ASC|DESC)?\\s*$`, 'i'));
        if (!m) return null;
        keys.push({ column: unquoteId(m[1]), direction: (m[2]?.toLowerCase() ?? 'asc') as 'asc'|'desc', nulls: 'last' });
    }
    return keys;
}

/** Parse une liste RENAME (old AS new, ...) en tableau de renames. */
function parseRenameList(s: string): { from: string; to: string }[] | null {
    const parts = s.split(',');
    const renames: { from: string; to: string }[] = [];
    for (const part of parts) {
        const m = part.trim().match(new RegExp(`^(${COL_PAT})\\s+AS\\s+(${COL_PAT})\\s*$`, 'i'));
        if (!m) return null;
        renames.push({ from: unquoteId(m[1]), to: unquoteId(m[2]) });
    }
    return renames;
}

/** Splits a comma-separated SQL expression list, respecting parentheses. */
function splitSelectParts(sql: string): string[] {
    const parts: string[] = [];
    let depth = 0, cur = '';
    for (const ch of sql) {
        if (ch === '(') depth++;
        else if (ch === ')') depth--;
        else if (ch === ',' && depth === 0) { parts.push(cur.trim()); cur = ''; continue; }
        cur += ch;
    }
    if (cur.trim()) parts.push(cur.trim());
    return parts;
}

/** Tries to parse a GROUP BY body into a GroupByStep AST node. */
function tryParseGroupByParts(selectBody: string, groupByBody: string): import('./SqlBlockTypes').GroupByStep | null {
    const groupCols = splitSelectParts(groupByBody).map(s => unquoteId(s.trim())).filter(Boolean);
    if (!groupCols.length) return null;

    const selectParts = splitSelectParts(selectBody);
    const seenGroupCols: string[] = [];
    const aggregations: import('./SqlBlockTypes').Aggregation[] = [];

    for (const part of selectParts) {
        const p = part.trim();
        // Plain column → must be a GROUP BY column
        const asPlain = unquoteId(p);
        if (groupCols.includes(asPlain)) { seenGroupCols.push(asPlain); continue; }

        // FN(args) AS alias — greedy match of args handles nested parens
        const fnM = p.match(/^(\w+)\s*\(([\s\S]+)\)\s+AS\s+("(?:[^"]+)"|[\w]+)\s*$/i);
        if (!fnM) return null;

        const fn = fnM[1].toUpperCase();
        const rawArgs = fnM[2].trim();
        const alias = unquoteId(fnM[3].trim());
        let agg: import('./SqlBlockTypes').Aggregation | null = null;

        if (fn === 'COUNT') {
            if (rawArgs === '*') agg = { fn: 'count', column: '*', alias };
            else {
                const distM = rawArgs.match(/^DISTINCT\s+([\s\S]+)$/i);
                agg = distM
                    ? { fn: 'count_distinct', column: unquoteId(distM[1].trim()), alias }
                    : { fn: 'count', column: unquoteId(rawArgs), alias };
            }
        } else if (fn === 'STRING_AGG') {
            const p2 = splitSelectParts(rawArgs);
            const col = unquoteId(p2[0]?.trim() ?? '');
            const sep = p2[1]?.trim().replace(/^['"]|['"]$/g, '') ?? ', ';
            agg = { fn: 'string_agg', column: col, alias, separator: sep };
        } else {
            const FN_MAP: Record<string, string> = {
                SUM: 'sum', AVG: 'avg', MIN: 'min', MAX: 'max',
                MEDIAN: 'median', STDDEV: 'stddev', STDDEV_SAMP: 'stddev', STDDEV_POP: 'stddev',
                LIST: 'list', ARRAY_AGG: 'list',
            };
            const mapped = FN_MAP[fn];
            if (!mapped) return null;
            agg = { fn: mapped as any, column: unquoteId(rawArgs), alias };
        }

        if (!agg) return null;
        aggregations.push(agg);
    }

    // Verify all GROUP BY cols appeared in SELECT
    if (groupCols.some(c => !seenGroupCols.includes(c))) return null;

    return { type: 'group_by', groupCols, aggregations };
}

/**
 * Parse le corps d'un CTE en un SqlBlockStep.
 * - Retourne null si c'est un SELECT * passthrough (pas de step).
 * - Retourne un step structuré si le pattern est reconnu.
 * - Retourne un custom_sql step (avec {{subquery}}) sinon.
 */
function parseCteBodyToStep(
    fullBody: string,
    typeHint: SqlBlockStep['type'] | null,
    sourceName: string,
): SqlBlockStep | null {
    const b = fullBody.trim();

    // ── Patterns P0 (SELECT body FROM src) ──────────────────────────────────
    const selectM = b.match(/^SELECT\s+(.+?)\s+FROM\s+(?:"[^"]*"|\S+)\s*;?\s*$/is);
    if (selectM) {
        const parsed = parseSelectBody(selectM[1].trim());
        if (parsed !== null) return parsed.step; // null = SELECT * = passthrough
    }

    // ── RENAME ───────────────────────────────────────────────────────────────
    const renameM = b.match(/^SELECT\s+\*\s+RENAME\s*\((.+)\)\s+FROM\s+(?:"[^"]*"|\S+)\s*;?\s*$/is);
    if (renameM) {
        const renames = parseRenameList(renameM[1]);
        if (renames) return { type: 'rename_columns', renames };
    }

    // ── filter_rows (WHERE) ───────────────────────────────────────────────────
    if (!typeHint || typeHint === 'filter_rows') {
        const filterM = b.match(/^SELECT\s+\*\s+FROM\s+(?:"[^"]*"|\S+)\s+WHERE\s+([\s\S]+?)\s*;?\s*$/i);
        if (filterM) {
            const groups = parseWhereToGroups(filterM[1].trim());
            if (groups) return { type: 'filter_rows', groups, groupLogicOp: 'OR' };
        }
    }

    // ── sort (ORDER BY) ───────────────────────────────────────────────────────
    if (!typeHint || typeHint === 'sort') {
        const sortM = b.match(/^SELECT\s+\*\s+FROM\s+(?:"[^"]*"|\S+)\s+ORDER\s+BY\s+([\s\S]+?)\s*;?\s*$/i);
        if (sortM) {
            const keys = parseOrderByKeys(sortM[1].trim());
            if (keys?.length) return { type: 'sort', keys };
        }
    }

    // ── top_n (LIMIT / USING SAMPLE) ──────────────────────────────────────────
    if (!typeHint || typeHint === 'top_n') {
        const limitM = b.match(/^SELECT\s+\*\s+FROM\s+(?:"[^"]*"|\S+)\s+LIMIT\s+(\d+)(?:\s+OFFSET\s+(\d+))?\s*;?\s*$/i);
        if (limitM) {
            const step: SqlBlockStep = { type: 'top_n', mode: 'limit', n: parseInt(limitM[1]) };
            if (limitM[2]) (step as any).offset = parseInt(limitM[2]);
            return step;
        }
        const sampleM = b.match(/^SELECT\s+\*\s+FROM\s+(?:"[^"]*"|\S+)\s+USING\s+SAMPLE\s+(\d+)(%|\s+ROWS?)(?:\s*\((\w+)\))?\s*;?\s*$/i);
        if (sampleM) {
            const isPercent = sampleM[2].trim() === '%';
            const step: SqlBlockStep = { type: 'top_n', mode: isPercent ? 'sample_percent' : 'sample_rows', n: parseInt(sampleM[1]) };
            if (sampleM[3]) (step as any).sampleMethod = sampleM[3];
            return step;
        }
    }

    // ── group_by (SELECT groupCols + AGGs FROM src GROUP BY cols) ──────────────
    if (!typeHint || typeHint === 'group_by') {
        const groupM = b.match(/^SELECT\s+([\s\S]+?)\s+FROM\s+(?:"[^"]*"|\S+)\s+GROUP\s+BY\s+([\s\S]+?)\s*;?\s*$/i);
        if (groupM) {
            const groupStep = tryParseGroupByParts(groupM[1].trim(), groupM[2].trim());
            if (groupStep) return groupStep;
        }
    }

    // ── pivot (SELECT * FROM (PIVOT src ON col USING fn(col) GROUP BY ...)) ─────
    if (!typeHint || typeHint === 'pivot') {
        const pivotM = b.match(/^SELECT\s+\*\s+FROM\s+\(\s*PIVOT\s+(?:"[^"]*"|\S+)\s+ON\s+((?:"[^"]*"|\S+))\s+USING\s+(\w+)\s*\(\s*((?:"[^"]*"|\S+))\s*\)(?:\s+GROUP\s+BY\s+([\s\S]+?))?\s*\)\s*;?\s*$/i);
        if (pivotM) {
            return {
                type: 'pivot',
                onColumn:    unquoteId(pivotM[1].trim()),
                valueFn:     pivotM[2].toUpperCase(),
                valueColumn: unquoteId(pivotM[3].trim()),
                groupCols:   pivotM[4]
                    ? splitSelectParts(pivotM[4]).map(c => unquoteId(c.trim())).filter(Boolean)
                    : [],
            };
        }
    }

    // ── unpivot (SELECT * FROM (UNPIVOT src ON cols INTO NAME name VALUE value)) ─
    if (!typeHint || typeHint === 'unpivot') {
        const unpivotM = b.match(/^SELECT\s+\*\s+FROM\s+\(\s*UNPIVOT\s+(?:"[^"]*"|\S+)\s+ON\s+([\s\S]+?)\s+INTO\s+NAME\s+((?:"[^"]*"|\S+))\s+VALUE\s+((?:"[^"]*"|\S+))\s*\)\s*;?\s*$/i);
        if (unpivotM) {
            return {
                type: 'unpivot',
                columns:  splitSelectParts(unpivotM[1]).map(c => unquoteId(c.trim())).filter(Boolean),
                nameCol:  unquoteId(unpivotM[2].trim()),
                valueCol: unquoteId(unpivotM[3].trim()),
            };
        }
    }

    // ── Fallback : custom_sql (source → {{subquery}}) ─────────────────────────
    const srcQ = quoteId(sourceName);
    const sqlWithPlaceholder = b
        .replace(new RegExp(`\\bFROM\\s+${escapeRegex(srcQ)}\\b`, 'g'), 'FROM {{subquery}}')
        .replace(new RegExp(`\\bFROM\\s+${escapeRegex(sourceName)}\\b`, 'g'), 'FROM {{subquery}}');
    return { type: 'custom_sql', sql: sqlWithPlaceholder };
}

/** Parser par CTE : chaque CTE est parsé indépendamment (fallback custom_sql). */
function tryParseCteChainSmart(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    // Accepte tout WITH contenant au moins un CTE _sqlblock_s (même si d'autres ont un nom custom)
    if (!/^WITH\b/i.test(sql) || !/_sqlblock_s\d+/i.test(sql)) return null;
    const ctes = extractCtesWithFullBody(sql);
    if (!ctes?.length) return null;

    const source = ctes[0].source; // source originale
    const steps: SqlBlockStep[] = [];

    for (const cte of ctes) {
        const typeHint = stepTypeFromCteName(cte.name);
        const step = parseCteBodyToStep(cte.fullBody, typeHint, cte.source);
        if (step === null) continue;
        // Réattache la description extraite du commentaire /* ... */
        if (cte.description) step.description = cte.description;
        // Préserve le nom custom (pas auto-généré)
        if (!/^_sqlblock_s\d+(?:_[a-z]+)?$/.test(cte.name)) step.name = cte.name;
        steps.push(step);
    }

    const finalSql = extractFinalSelectFromWithQuery(sql);
    const chartConfig = finalSql ? parseChartFinalSelect(finalSql) ?? undefined : undefined;
    return { source, steps, materialized: materialize, ...(chartConfig ? { chartConfig } : {}) };
}

/**
 * Extrait l'expression FROM complète quand la source est une sous-requête (commence par '(').
 * Ex: `SELECT * FROM (VALUES ...) t(a, b)` → `(VALUES ...) t(a, b)`
 */
function extractSubquerySource(sql: string): string | null {
    const m = sql.match(/\bFROM\s+(\([\s\S]+)/i);
    if (!m) return null;
    return m[1].replace(/\s*;?\s*$/, '').trim();
}

/** Parser simple SELECT (hors CTE) étendu aux patterns P1 (WHERE, ORDER BY, LIMIT).
 * Les patterns non reconnus deviennent un step custom_sql (préserve le SQL sans perte). */
function tryParseSimpleSmart(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    const srcM = sql.match(/^SELECT\s+(?:[\s\S]+?)\s+FROM\s+((?:"[^"]*"|\S+))/i);
    if (!srcM) return null;
    const firstToken = srcM[1];
    const source = unquoteId(firstToken);

    // ── Sous-requête comme source (FROM commence par '(') ──────────────────────
    if (source.startsWith('(')) {
        // Cas PIVOT : SELECT * FROM (PIVOT <source> ON <col> USING <fn>(<col>) GROUP BY ...)
        // → parser en PivotStep avec la vraie source DuckDB identifiée
        const pivotM = sql.match(/^SELECT\s+\*\s+FROM\s+\(\s*PIVOT\s+((?:"[^"]*"|\w[\w.]*?))\s+ON\s+((?:"[^"]*"|\S+))\s+USING\s+(\w+)\s*\(\s*((?:"[^"]*"|\S+))\s*\)(?:\s+GROUP\s+BY\s+([\s\S]+?))?\s*\)\s*;?\s*$/i);
        if (pivotM) {
            const pivotSrc = unquoteId(pivotM[1].trim());
            const onCol    = unquoteId(pivotM[2].trim());
            const fn       = pivotM[3].toUpperCase();
            const valueCol = unquoteId(pivotM[4].trim());
            const groupCols = pivotM[5]
                ? splitSelectParts(pivotM[5]).map(c => unquoteId(c.trim())).filter(Boolean)
                : [];
            return { source: pivotSrc, steps: [{ type: 'pivot', onColumn: onCol, valueColumn: valueCol, valueFn: fn, groupCols }], materialized: materialize };
        }

        // Cas UNPIVOT : SELECT * FROM (UNPIVOT <source> ON <cols> INTO NAME <name> VALUE <value>)
        const unpivotM = sql.match(/^SELECT\s+\*\s+FROM\s+\(\s*UNPIVOT\s+((?:"[^"]*"|\w[\w.]*?))\s+ON\s+([\s\S]+?)\s+INTO\s+NAME\s+((?:"[^"]*"|\S+))\s+VALUE\s+((?:"[^"]*"|\S+))\s*\)\s*;?\s*$/i);
        if (unpivotM) {
            const unpivotSrc = unquoteId(unpivotM[1].trim());
            const columns    = splitSelectParts(unpivotM[2]).map(c => unquoteId(c.trim())).filter(Boolean);
            const nameCol    = unquoteId(unpivotM[3].trim());
            const valueCol   = unquoteId(unpivotM[4].trim());
            return { source: unpivotSrc, steps: [{ type: 'unpivot', columns, nameCol, valueCol }], materialized: materialize };
        }

        // Cas général : extraire l'expression FROM complète comme source brute
        const rawSource = extractSubquerySource(sql);
        if (!rawSource) return null;

        const chartConfig = parseChartFinalSelect(sql) ?? undefined;
        if (chartConfig) return { source: rawSource, steps: [], materialized: materialize, chartConfig };

        // SELECT * FROM (<subquery>) sans roles → SELECT * passthrough (pas de steps)
        const step = parseCteBodyToStep(sql, null, rawSource);
        if (step === null) return { source: rawSource, steps: [], materialized: materialize };
        return { source: rawSource, steps: [step], materialized: materialize };
    }

    // Si le SELECT contient des annotations ::ROLE, c'est un SELECT final de visualisation
    const chartConfig = parseChartFinalSelect(sql) ?? undefined;
    if (chartConfig) return { source, steps: [], materialized: materialize, chartConfig };

    const step = parseCteBodyToStep(sql, null, source);
    if (step === null) return { source, steps: [], materialized: materialize }; // SELECT *
    // custom_sql ou step reconnu → on crée un AST avec ce step (pas de perte de données)
    return { source, steps: [step], materialized: materialize };
}

/**
 * Parser amélioré : essaie d'abord sqlToAst (P0), puis le parsing intelligent
 * par CTE (P1+). Les CTEs non parsables deviennent des steps custom_sql.
 */
export function sqlToAstSmart(sql: string, materialize: SqlBlockMaterialize = 'view'): SqlParseResult {
    // Extraire SELECT '...'::LABEL; en tête (stat title) avant parsing
    // → permet d'éditer via l'UI même quand le SQL commence par ce préfixe
    let labelPrefix: string | null = null;
    let sqlBody = sql;
    const labelM = sql.match(/^(\s*SELECT\s+'[^']*'\s*::LABEL\s*;[ \t]*\r?\n?)/i);
    if (labelM) {
        // Extraire la valeur du label
        const valM = labelM[1].match(/SELECT\s+'([^']*)'\s*::LABEL/i);
        if (valM) labelPrefix = valM[1];
        sqlBody = sql.slice(labelM[1].length);
    }

    /** Injecte le label dans l'AST si présent */
    function withLabel(ast: SqlBlockAst): SqlBlockAst {
        if (labelPrefix === null) return ast;
        const chartConfig: ChartConfig = ast.chartConfig
            ? { ...ast.chartConfig, label: labelPrefix }
            : { chartType: 'kpi', columns: [], label: labelPrefix };
        return { ...ast, chartConfig };
    }
    function withLabelResult(r: SqlParseResult): SqlParseResult {
        if (labelPrefix === null || !r.compatible || !r.ast) return r;
        return { ...r, ast: withLabel(r.ast) };
    }

    // 1. Parser standard (P0)
    const standard = sqlToAst(sqlBody, materialize);
    if (standard.compatible && standard.ast) return withLabelResult(standard);

    // 2. Parser par CTE intelligent
    const normalized = sqlBody.replace(/[ \t]+/g, ' ').trim();
    const smartCte = tryParseCteChainSmart(normalized, materialize);
    if (smartCte) return withLabelResult({ ast: smartCte, compatible: true });

    // 3. Parser simple SELECT étendu (sans CTE)
    const smartSimple = tryParseSimpleSmart(normalized, materialize);
    if (smartSimple) return withLabelResult({ ast: smartSimple, compatible: true });

    // 4. Fallback ultime : SQL non reconnu → étape custom_sql sans source
    //    Préserve le SQL intégralement, sans perte de données.
    if (normalized) {
        return withLabelResult({
            ast: { source: '', steps: [{ type: 'custom_sql', sql: normalized }], materialized: materialize },
            compatible: true,
        });
    }

    // 5. Échec : retourne l'erreur d'origine
    return standard;
}
