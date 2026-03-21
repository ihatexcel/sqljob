// ─── SqlBlockService ──────────────────────────────────────────────────────────
// Conversion bidirectionnelle entre AST SqlBlock et SQL DuckDB.
// Note: Le parser SQL est volontairement limité aux patterns P0 générés.
// Tout SQL non reconnu (P1+) → mode dégradé (SQL libre, UI désactivée).

import type {
    SqlBlockAst,
    SqlBlockStep,
    ChangeTypeChange,
    FilterCondition,
    FilterGroup,
    FilterItem,
    SqlBlockMaterialize,
    SqlBlockConfig,
} from './SqlBlockTypes';

const CTE_PREFIX = '_sqlblock_s';

/** Retourne le nom de CTE d'un step : son nom personnalisé ou le nom auto `_sqlblock_sN`. */
function getCteName(step: SqlBlockAst['steps'][number], index: number): string {
    return step.name?.trim() || `${CTE_PREFIX}${index}`;
}

/** Échappe la séquence `* /` pour qu'elle ne ferme pas un commentaire bloc SQL. */
function escapeBlockComment(s: string): string {
    return s.replace(/\*\//g, '* /').replace(/\r\n/g, ' ').replace(/\r/g, ' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// AST → SQL
// ─────────────────────────────────────────────────────────────────────────────

export function astToSql(ast: SqlBlockAst): string {
    const { source, steps } = ast;
    if (!steps || steps.length === 0) return `SELECT * FROM ${quoteId(source)}`;
    // Step unique sans nom : forme simple (pas de CTE)
    if (steps.length === 1 && !steps[0].name?.trim()) {
        const sql = singleStepToSql(quoteId(source), steps[0]);
        const desc = steps[0].description?.trim();
        return desc ? `/* ${escapeBlockComment(desc)} */\n${sql}` : sql;
    }

    const ctes: string[] = [];
    for (let i = 0; i < steps.length; i++) {
        const prevSrc = i === 0 ? quoteId(source) : quoteId(getCteName(steps[i - 1], i - 1));
        const inner = singleStepToSql(prevSrc, steps[i]);
        const cteName = quoteId(getCteName(steps[i], i));
        const desc = steps[i].description?.trim();
        const comment = desc ? `/* ${escapeBlockComment(desc)} */\n    ` : '';
        ctes.push(`  ${cteName} AS (\n    ${comment}${inner.replace(/\n/g, '\n    ')}\n  )`);
    }
    const lastName = quoteId(getCteName(steps[steps.length - 1], steps.length - 1));
    return `WITH\n${ctes.join(',\n')}\nSELECT * FROM ${lastName}`;
}

export function generateMaterializeQuery(name: string, sql: string, materialize: SqlBlockMaterialize): string {
    const q = quoteId(name);
    return materialize === 'table'
        ? `CREATE OR REPLACE TABLE ${q} AS (\n${sql}\n)`
        : `CREATE OR REPLACE VIEW ${q} AS (\n${sql}\n)`;
}

export function stepSql(ast: SqlBlockAst, stepIndex: number): string {
    if (!ast.source) return '';
    if (stepIndex < 0 || !ast.steps?.length) return `SELECT * FROM ${quoteId(ast.source)}`;
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
    return { source: unquoteId(m[2].trim()), steps: parsed.step ? [parsed.step] : [], materialize };
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
    return { source: unquoteId(ctes[0].source), steps, materialize };
}

interface CteInfo { body: string; source: string }

function extractCtes(sql: string): CteInfo[] | null {
    const ctes: CteInfo[] = [];
    const re = /_sqlblock_s\d+\s+AS\s*\(/gi;
    let match: RegExpExecArray | null;
    while ((match = re.exec(sql)) !== null) {
        const innerSql = extractParenContent(sql, match.index + match[0].length - 1);
        if (!innerSql) return null;
        const m = innerSql.replace(/[ \t\r\n]+/g, ' ').trim()
            .match(/^SELECT\s+(.+?)\s+FROM\s+((?:"[^"]*"|\S)+)\s*;?\s*$/is);
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

        case 'custom_sql': {
            const sql = step.sql?.trim() || `SELECT * FROM {{subquery}}`;
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

function conditionToSql(c: FilterCondition): string {
    const col = quoteId(c.column);
    switch (c.op) {
        case '=':       return `${col} = ${quoteSqlValue(c.value ?? '')}`;
        case '!=':      return `${col} != ${quoteSqlValue(c.value ?? '')}`;
        case '>':       return `${col} > ${quoteSqlValue(c.value ?? '')}`;
        case '<':       return `${col} < ${quoteSqlValue(c.value ?? '')}`;
        case '>=':      return `${col} >= ${quoteSqlValue(c.value ?? '')}`;
        case '<=':      return `${col} <= ${quoteSqlValue(c.value ?? '')}`;
        case 'in':      return `${col} IN (${(c.values ?? []).map(quoteSqlValue).join(', ')})`;
        case 'not_in':  return `${col} NOT IN (${(c.values ?? []).map(quoteSqlValue).join(', ')})`;
        case 'is_null': return `${col} IS NULL`;
        case 'not_null':return `${col} IS NOT NULL`;
        case 'like':    return `${col} LIKE ${quoteSqlValue(c.value ?? '')}`;
        case 'ilike':   return `${col} ILIKE ${quoteSqlValue(c.value ?? '')}`;
        case 'between': return `${col} BETWEEN ${quoteSqlValue(c.value ?? '')} AND ${quoteSqlValue(c.valueTo ?? '')}`;
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

function unquoteId(name: string): string {
    if (name.startsWith('"') && name.endsWith('"')) return name.slice(1, -1).replace(/""/g, '"');
    return name;
}
