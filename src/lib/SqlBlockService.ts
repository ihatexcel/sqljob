// ─── SqlBlockService ──────────────────────────────────────────────────────────
// Conversion bidirectionnelle entre AST SqlBlock et SQL DuckDB.
// Note: Le parser SQL est volontairement limité aux patterns que nous générons.
// Tout SQL non reconnu → mode dégradé (SQL libre, UI désactivée).

import type {
    SqlBlockAst,
    SqlBlockStep,
    ChangeTypeChange,
    SqlBlockMaterialize,
    SqlBlockConfig,
} from './SqlBlockTypes';

/** Préfixe des CTE générés pour les chaînes multi-steps */
const CTE_PREFIX = '_sqlblock_s';

// ─────────────────────────────────────────────────────────────────────────────
// AST → SQL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère le SQL SELECT (sans CREATE VIEW/TABLE) depuis l'AST.
 */
export function astToSql(ast: SqlBlockAst): string {
    const { source, steps } = ast;

    if (!steps || steps.length === 0) {
        return `SELECT * FROM ${quoteId(source)}`;
    }

    if (steps.length === 1) {
        return singleStepToSql(quoteId(source), steps[0]);
    }

    // Chaîne de CTEs pour plusieurs steps
    const ctes: string[] = [];
    for (let i = 0; i < steps.length; i++) {
        const prevSrc = i === 0 ? quoteId(source) : `${CTE_PREFIX}${i - 1}`;
        const cteName = `${CTE_PREFIX}${i}`;
        const inner = singleStepToSql(prevSrc, steps[i]);
        ctes.push(`  ${cteName} AS (\n    ${inner}\n  )`);
    }

    const lastCte = `${CTE_PREFIX}${steps.length - 1}`;
    return `WITH\n${ctes.join(',\n')}\nSELECT * FROM ${lastCte}`;
}

/**
 * Génère le SQL de matérialisation (CREATE VIEW ou TABLE) avec le nom de la cellule.
 */
export function generateMaterializeQuery(name: string, sql: string, materialize: SqlBlockMaterialize): string {
    const quotedName = quoteId(name);
    if (materialize === 'table') {
        return `CREATE OR REPLACE TABLE ${quotedName} AS (\n${sql}\n)`;
    }
    return `CREATE OR REPLACE VIEW ${quotedName} AS (\n${sql}\n)`;
}

/**
 * Retourne le SQL effectif de la cellule : généré depuis l'AST ou SQL manuel en mode dégradé.
 */
export function getEffectiveSql(config: SqlBlockConfig): string {
    if (config.degraded && config.manualSql) {
        return config.manualSql;
    }
    return astToSql(config.ast);
}

// ─────────────────────────────────────────────────────────────────────────────
// SQL → AST (parser limité aux patterns générés)
// ─────────────────────────────────────────────────────────────────────────────

export interface SqlParseResult {
    ast: SqlBlockAst | null;
    compatible: boolean;
    error?: string;
}

/**
 * Tente de parser un SQL en AST SqlBlock.
 * Retourne `compatible: false` si le SQL ne correspond à aucun pattern supporté.
 */
export function sqlToAst(sql: string, materialize: SqlBlockMaterialize = 'view'): SqlParseResult {
    if (!sql?.trim()) {
        return { ast: null, compatible: false, error: 'SQL vide' };
    }

    // Normaliser les espaces (garder les retours à la ligne pour certains patterns)
    const normalized = sql.replace(/[ \t]+/g, ' ').trim();

    // Essayer la chaîne CTE (notre format généré multi-steps)
    const cteAst = tryParseCteChain(normalized, materialize);
    if (cteAst) return { ast: cteAst, compatible: true };

    // Essayer un SELECT simple (1 step ou 0 step)
    const simpleAst = tryParseSimpleSelect(normalized, materialize);
    if (simpleAst) return { ast: simpleAst, compatible: true };

    return {
        ast: null,
        compatible: false,
        error: 'SQL non compatible avec les blocs disponibles (SELECT complexe, JOINs, sous-requêtes, etc.)',
    };
}

// ─── Parsers internes ─────────────────────────────────────────────────────────

function tryParseSimpleSelect(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    // Pattern: SELECT <body> FROM <source>  [optional semicolon]
    const m = sql.match(/^SELECT\s+(.+?)\s+FROM\s+(\S+)\s*;?\s*$/is);
    if (!m) return null;

    const body = m[1].trim();
    const source = unquoteId(m[2].trim());

    const parsed = parseSelectBody(body);
    if (!parsed) return null;

    return {
        source,
        steps: parsed.step ? [parsed.step] : [],
        materialize,
    };
}

function tryParseCteChain(sql: string, materialize: SqlBlockMaterialize): SqlBlockAst | null {
    // Doit commencer par WITH _sqlblock_s (notre signature)
    if (!/^WITH\s+_sqlblock_s/i.test(sql)) return null;

    // Extraire chaque CTE: _sqlblock_sN AS (SELECT ... FROM ...)
    // On utilise un parsing simple plutôt que regex récursif
    const ctes = extractCtes(sql);
    if (!ctes || ctes.length === 0) return null;

    // La source originale est la source du premier CTE
    const originalSource = unquoteId(ctes[0].source);

    const steps: SqlBlockStep[] = [];
    for (const cte of ctes) {
        const parsed = parseSelectBody(cte.body);
        if (!parsed) return null; // Step incompatible → tout incompatible
        if (parsed.step) steps.push(parsed.step);
    }

    return { source: originalSource, steps, materialize };
}

interface CteInfo {
    body: string;   // Contenu SELECT (après SELECT, avant FROM)
    source: string; // Clause FROM
}

function extractCtes(sql: string): CteInfo[] | null {
    const ctes: CteInfo[] = [];

    // Trouver chaque définition de CTE _sqlblock_sN AS (SELECT ... FROM ...)
    // On cherche _sqlblock_sN AS ( puis on lit jusqu'à la parenthèse fermante
    const cteStartRegex = /_sqlblock_s\d+\s+AS\s*\(/gi;
    let match: RegExpExecArray | null;

    while ((match = cteStartRegex.exec(sql)) !== null) {
        const parenStart = match.index + match[0].length - 1; // position de '('
        const innerSql = extractParenContent(sql, parenStart);
        if (!innerSql) return null;

        // Normaliser et parser le SELECT interne
        const normalized = innerSql.replace(/[ \t\r\n]+/g, ' ').trim();
        const m = normalized.match(/^SELECT\s+(.+?)\s+FROM\s+(\S+)\s*;?\s*$/is);
        if (!m) return null;

        ctes.push({ body: m[1].trim(), source: m[2].trim() });
    }

    return ctes.length > 0 ? ctes : null;
}

/** Extrait le contenu entre parenthèses à partir de la position `start` (position du '('). */
function extractParenContent(sql: string, start: number): string | null {
    let depth = 0;
    let i = start;
    while (i < sql.length) {
        if (sql[i] === '(') depth++;
        else if (sql[i] === ')') {
            depth--;
            if (depth === 0) return sql.slice(start + 1, i);
        }
        i++;
    }
    return null;
}

/** Parse le corps d'un SELECT (entre SELECT et FROM) en un step SqlBlock. */
function parseSelectBody(body: string): { step: SqlBlockStep | null } | null {
    const b = body.trim();

    // SELECT *  → pas de step
    if (b === '*') return { step: null };

    // SELECT * EXCLUDE (col1, col2)
    const excludeMatch = b.match(/^\*\s+EXCLUDE\s*\(([^)]+)\)\s*$/i);
    if (excludeMatch) {
        const columns = splitIdentifiers(excludeMatch[1]);
        if (!columns) return null;
        return { step: { type: 'exclude_columns', columns } };
    }

    // SELECT * REPLACE (CAST(col AS TYPE) AS col, ...)
    const replaceMatch = b.match(/^\*\s+REPLACE\s*\((.+)\)\s*$/is);
    if (replaceMatch) {
        const changes = parseCastList(replaceMatch[1]);
        if (!changes) return null;
        return { step: { type: 'change_type', changes } };
    }

    // SELECT col1, col2, col3  (liste de colonnes simples, sans *)
    if (!b.includes('*')) {
        const columns = splitIdentifiers(b);
        if (columns && columns.length > 0) {
            return { step: { type: 'select_columns', columns } };
        }
    }

    return null; // Pattern non reconnu
}

function splitIdentifiers(s: string): string[] | null {
    const parts = s.split(',').map(p => p.trim()).filter(Boolean);
    const ids: string[] = [];
    for (const p of parts) {
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
    // Pattern: CAST(colName AS TYPE) AS colName
    const castRegex = /CAST\(([^\s),]+)\s+AS\s+([A-Z_][A-Z0-9_]*(?:\(\d+(?:,\s*\d+)?\))?)\)\s+AS\s+([^\s,)]+)/gi;
    const changes: ChangeTypeChange[] = [];
    let m: RegExpExecArray | null;

    while ((m = castRegex.exec(s)) !== null) {
        changes.push({
            column: unquoteId(m[1]),
            targetType: m[2].toUpperCase(),
        });
    }

    return changes.length > 0 ? changes : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère un SELECT simple (pour un step) depuis une source et un step.
 * `source` est déjà quoté si nécessaire.
 */
function singleStepToSql(source: string, step: SqlBlockStep): string {
    switch (step.type) {
        case 'select_columns': {
            if (step.columns.length === 0) return `SELECT * FROM ${source}`;
            const cols = step.columns.map(quoteId).join(',\n  ');
            return `SELECT\n  ${cols}\nFROM ${source}`;
        }
        case 'exclude_columns': {
            if (step.columns.length === 0) return `SELECT * FROM ${source}`;
            const cols = step.columns.map(quoteId).join(', ');
            return `SELECT * EXCLUDE (${cols}) FROM ${source}`;
        }
        case 'change_type': {
            if (step.changes.length === 0) return `SELECT * FROM ${source}`;
            const casts = step.changes
                .map(c => `CAST(${quoteId(c.column)} AS ${c.targetType}) AS ${quoteId(c.column)}`)
                .join(',\n  ');
            return `SELECT * REPLACE (\n  ${casts}\n) FROM ${source}`;
        }
    }
}

/** Entoure l'identifiant de guillemets si nécessaire pour DuckDB. */
export function quoteId(name: string): string {
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) return name;
    return `"${name.replace(/"/g, '""')}"`;
}

function unquoteId(name: string): string {
    if (name.startsWith('"') && name.endsWith('"')) {
        return name.slice(1, -1).replace(/""/g, '"');
    }
    return name;
}
