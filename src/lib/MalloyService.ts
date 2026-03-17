/**
 * MalloyService — Compilation Malloy → DuckDB SQL dans le browser.
 *
 * Utilise l'API stateless de @malloydata/malloy (pas de connexion live requise).
 * Le schéma des tables est fourni depuis _duckdbTables (état Zustand).
 *
 * Flux :
 *   1. compileQuery({ model_url, query_malloy }) — le compilateur retourne
 *      compiler_needs.table_schemas si des tables sont inconnues.
 *   2. On fournit le schéma depuis _duckdbTables (colonnes + types).
 *   3. On répète jusqu'à result.sql disponible.
 */

import { API } from '@malloydata/malloy'
import type * as MI from '@malloydata/malloy-interfaces'

// ─── Type mapping DuckDB → Malloy AtomicType ──────────────────────────────────

function duckTypeToMalloy(duckType: string): MI.AtomicType {
    const t = duckType.toUpperCase().trim()
    if (t.startsWith('DECIMAL') || t.startsWith('NUMERIC') || t.startsWith('FLOAT') || t.startsWith('DOUBLE') || t === 'REAL' || t === 'HUGEINT' || t === 'UBIGINT')
        return { kind: 'number_type', subtype: 'decimal' }
    if (t === 'BIGINT')
        return { kind: 'number_type', subtype: 'bigint' }
    if (t === 'INTEGER' || t === 'INT' || t === 'SMALLINT' || t === 'TINYINT' || t === 'UINTEGER' || t === 'USMALLINT' || t === 'UTINYINT' || t.startsWith('INT'))
        return { kind: 'number_type', subtype: 'integer' }
    if (t === 'BOOLEAN' || t === 'BOOL')
        return { kind: 'boolean_type' }
    if (t === 'DATE')
        return { kind: 'date_type' }
    if (t.startsWith('TIMESTAMP WITH TIME ZONE') || t.startsWith('TIMESTAMPTZ'))
        return { kind: 'timestamptz_type' }
    if (t.startsWith('TIMESTAMP') || t.startsWith('DATETIME'))
        return { kind: 'timestamp_type' }
    if (t === 'JSON')
        return { kind: 'json_type' }
    if (t === 'VARCHAR' || t === 'TEXT' || t === 'CHAR' || t.startsWith('VARCHAR') || t.startsWith('CHAR'))
        return { kind: 'string_type' }
    // Fallback: sql_native_type pour les types exotiques (BLOB, ARRAY, LIST…)
    return { kind: 'sql_native_type', sql_type: duckType }
}

// ─── buildSchema : DuckDB columns → Malloy Schema ─────────────────────────────

function buildSchema(
    columns: { name: string; type: string }[]
): MI.Schema {
    const fields: MI.FieldInfo[] = columns.map(col => ({
        kind: 'dimension' as const,
        name: col.name,
        type: duckTypeToMalloy(col.type),
    }))
    return { fields }
}

// ─── Résultat de compilation ───────────────────────────────────────────────────

export interface MalloyCompileResult {
    sql: string
    logs: MI.LogMessage[]
    schema?: MI.Schema
}

export interface MalloyCompileError {
    error: string
    logs: MI.LogMessage[]
}

// ─── compileMalloy ─────────────────────────────────────────────────────────────
/**
 * Compile un programme Malloy complet (source + run:) en SQL DuckDB.
 *
 * @param malloyText  Programme Malloy complet (source + run: …)
 * @param duckdbTables  Tables DuckDB connues : Record<tableName, {columns}>
 * @returns SQL DuckDB ou erreur
 */
export async function compileMalloy(
    malloyText: string,
    duckdbTables: Record<string, { rowCount: number; columns: { name: string; type: string }[] }>
): Promise<MalloyCompileResult | MalloyCompileError> {
    const { stateless } = API

    // Connexion DuckDB déclarée pour le dialecte
    const connections: MI.Connection[] = [{ name: 'duckdb', dialect: 'duckdb' }]

    let request: MI.CompileQueryRequest = {
        model_url: 'internal://empty.malloy',
        query_malloy: malloyText,
        compiler_needs: { connections },
    }

    // Boucle d'itération : le compilateur demande les schémas de tables manquants
    let iterations = 0
    while (iterations < 10) {
        iterations++
        console.log(`[MalloyService] iter ${iterations} — request:`, {
            query_malloy: request.query_malloy?.slice(0, 120),
            compiler_needs: request.compiler_needs,
        })
        const response = stateless.compileQuery(request)
        console.log(`[MalloyService] iter ${iterations} — response:`, {
            result_sql: response.result?.sql?.slice(0, 120) ?? null,
            compiler_needs: response.compiler_needs,
            logs: response.logs,
        })

        // Logs d'erreur fatale
        const logs = response.logs ?? []
        const hasError = logs.some(l => l.severity === 'error')

        if (hasError && !response.compiler_needs) {
            return {
                error: logs.filter(l => l.severity === 'error').map(l => l.message).join('\n'),
                logs,
            }
        }

        // Compilation terminée
        if (response.result?.sql) {
            return {
                sql: response.result.sql,
                logs,
                schema: response.result.schema,
            }
        }

        // Le compilateur a besoin de schémas de tables
        if (response.compiler_needs) {
            const needs = response.compiler_needs
            const filledNeeds: MI.CompilerNeeds = { connections }

            // Résoudre table_schemas depuis _duckdbTables
            if (needs.table_schemas && needs.table_schemas.length > 0) {
                console.log(`[MalloyService] iter ${iterations} — tables demandées:`, needs.table_schemas.map(t => `${t.connection_name}.${t.name}`))
                console.log(`[MalloyService] iter ${iterations} — tables disponibles:`, Object.keys(duckdbTables))
                filledNeeds.table_schemas = needs.table_schemas.map(t => {
                    // Le compilateur passe le nom de la table tel qu'écrit dans Malloy
                    // ex: duckdb.table('orders') → name='orders', connection_name='duckdb'
                    const tableName = t.name
                    // Cherche dans _duckdbTables (correspondance exacte ou normalisée)
                    const tableInfo =
                        duckdbTables[tableName] ??
                        duckdbTables[tableName.replace(/^.*\/([^/]+)$/, '$1')] ??
                        Object.entries(duckdbTables).find(([k]) =>
                            k.toLowerCase() === tableName.toLowerCase()
                        )?.[1]

                    if (tableInfo) {
                        console.log(`[MalloyService] iter ${iterations} — schema trouvé pour "${tableName}":`, tableInfo.columns.slice(0, 5))
                        return {
                            name: t.name,
                            connection_name: t.connection_name,
                            schema: buildSchema(tableInfo.columns),
                        }
                    }
                    console.warn(`[MalloyService] iter ${iterations} — table introuvable: "${tableName}" (disponibles: ${Object.keys(duckdbTables).join(', ')})`)
                    // Table inconnue : on retourne sans schéma (le compilateur génèrera une erreur)
                    return { name: t.name, connection_name: t.connection_name }
                })
            }

            // sql_schemas (vues SQL inline) — on ne les supporte pas ici
            if (needs.sql_schemas) {
                console.log(`[MalloyService] iter ${iterations} — sql_schemas demandés:`, needs.sql_schemas)
                filledNeeds.sql_schemas = needs.sql_schemas
            }

            request = {
                model_url: 'internal://empty.malloy',
                query_malloy: malloyText,
                compiler_needs: filledNeeds,
            }
            continue
        }

        // Pas de result.sql et pas de compiler_needs → erreur inattendue
        return {
            error: 'Erreur de compilation Malloy inattendue (pas de SQL ni de compiler_needs)',
            logs,
        }
    }

    console.error('[MalloyService] Boucle de compilation dépassée (10 itérations). Dernier request:', request)
    return {
        error: 'Trop d\'itérations de compilation Malloy (boucle infinie ?)',
        logs: [],
    }
}

// ─── isCompileError ────────────────────────────────────────────────────────────

export function isCompileError(r: MalloyCompileResult | MalloyCompileError): r is MalloyCompileError {
    return 'error' in r
}
