/**
 * MalloyService — Compilation Malloy → DuckDB SQL dans le browser.
 *
 * Utilise l'API stateless de @malloydata/malloy (pas de connexion live requise).
 * Le schéma des tables est fourni depuis _duckdbTables (état Zustand).
 *
 * Flux :
 *   1. compileQuery({ model_url, query_malloy }) — le compilateur peut retourner
 *      compiler_needs pour demander : files (contenu du model_url), table_schemas,
 *      sql_schemas, translations.
 *   2. On répond à chaque besoin et on relance jusqu'à result.sql disponible.
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

    // Boucle d'itération : le compilateur demande les ressources manquantes
    let iterations = 0
    while (iterations < 10) {
        iterations++
        const response = stateless.compileQuery(request)

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

        // Le compilateur a besoin de ressources supplémentaires
        if (response.compiler_needs) {
            const needs = response.compiler_needs
            const filledNeeds: MI.CompilerNeeds = { connections }

            // files : contenu d'URLs Malloy (ex: le model_url lui-même).
            // Pour internal://... le modèle de base est vide — tout le programme
            // est dans query_malloy.
            if (needs.files && needs.files.length > 0) {
                filledNeeds.files = needs.files.map(f => ({
                    url: f.url,
                    contents: '',
                }))
            }

            // table_schemas : schémas des tables DuckDB demandées
            if (needs.table_schemas && needs.table_schemas.length > 0) {
                filledNeeds.table_schemas = needs.table_schemas.map(t => {
                    const tableName = t.name
                    const tableInfo =
                        duckdbTables[tableName] ??
                        duckdbTables[tableName.replace(/^.*\/([^/]+)$/, '$1')] ??
                        Object.entries(duckdbTables).find(([k]) =>
                            k.toLowerCase() === tableName.toLowerCase()
                        )?.[1]

                    if (tableInfo) {
                        return {
                            name: t.name,
                            connection_name: t.connection_name,
                            schema: buildSchema(tableInfo.columns),
                        }
                    }
                    console.warn(`[MalloyService] table introuvable: "${tableName}" (disponibles: ${Object.keys(duckdbTables).join(', ')})`)
                    // Table inconnue : le compilateur générera une erreur
                    return { name: t.name, connection_name: t.connection_name }
                })
            }

            // sql_schemas (vues SQL inline)
            if (needs.sql_schemas) {
                filledNeeds.sql_schemas = needs.sql_schemas
            }

            // translations : JSON pré-compilé d'un modèle (on n'en a pas)
            if (needs.translations && needs.translations.length > 0) {
                filledNeeds.translations = needs.translations.map(t => ({ url: t.url }))
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
            error: logs.length > 0
                ? logs.map(l => l.message).join('\n')
                : 'Erreur de compilation Malloy inattendue (pas de SQL ni de compiler_needs)',
            logs,
        }
    }

    return {
        error: 'Trop d\'itérations de compilation Malloy (boucle infinie ?)',
        logs: [],
    }
}

// ─── isCompileError ────────────────────────────────────────────────────────────

export function isCompileError(r: MalloyCompileResult | MalloyCompileError): r is MalloyCompileError {
    return 'error' in r
}
