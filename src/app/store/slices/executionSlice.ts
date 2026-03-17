// @ts-nocheck
import { safeEvalJs } from '../../../lib/safeEval'
import { rawTableDataStore as _rawTableDataStore } from '../../../lib/tableDataStore'
import { DuckDBManager } from '../../../lib/DuckDBManager'
import { ConfigManager } from '../../../lib/ConfigManager'
import { CDNManager } from '../../../lib/CDNManager'
import { CELL_TYPE_SCHEMAS } from '../../../lib/cellTypeSchemas'
import { EChartSqlParser } from '../../../lib/EChartSqlParser'
import { formatValueForInputType } from '../../../lib/utils'
import { FileHandler } from '../../../lib/FileHandler'

/** Détecte si un SQL contient une instruction DDL (CREATE, DROP, ALTER, INSERT, UPDATE, DELETE…).
 *  Utilisé pour décider si le schéma DuckDB doit être rafraîchi après exécution. */
const DDL_RE = /^\s*(CREATE|DROP|ALTER|INSERT|UPDATE|DELETE|TRUNCATE|RENAME|COMMENT)\b/im
function sqlIsDdl(sql: string): boolean {
    // Vérifier chaque statement séparé par ';'
    return sql.split(';').some(s => DDL_RE.test(s))
}

export const createExecutionSlice = (set: any, get: any) => ({

    async runGroupAtPath(path) {
        const group = get().getGroupAtPath(path)
        if (!group) return { stopped: false }

        const useLoop = !!(group.loop && group.loop.enabled && group.loop.query)

        if (useLoop) {
            return await get().runGroupWithLoop(path, group)
        } else {
            return await get().runGroupOnce(path, group)
        }
    },

    isCellSkippedInAutoFlow(cell) {
        if (!cell || cell.type === 'buttonRunNextCells') return false
        if (get()._zipMode) return false
        return !!(cell.buttonLabel && String(cell.buttonLabel).trim() !== '')
    },

    async runGroupOnce(path, group) {
        if (ConfigManager.getGroupIfQuery(group)) {
            get().setStatus('Évaluation de la condition ifQuery...', 'loading')
            const ifQueryResult = await get().evaluateGroupIfQuery(group)
            group._ifQueryResult = ifQueryResult

            if (!ifQueryResult) {
                get().setStatus('Groupe ignoré (ifQuery = false)', 'info')
                return { stopped: false }
            }
        }

        get().setStatus('Exécution du groupe...', 'loading')

        const orderedItems = get().getAllItemsSorted(group)
        for (const item of orderedItems) {
            if (item.type === 'child') {
                const result = await get().runGroupAtPath([...path, item.originalIndex])
                if (result?.stopped) return result
                continue
            }

            const cell = item.item
            if (cell.type === 'buttonRunNextCells') {
                get().setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info')
                return { stopped: true, reason: 'buttonRunNextCells' }
            }
            if (get().isCellSkippedInAutoFlow(cell)) continue
            if (cell.type === 'source') {
                if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                    get().setStatus(`Source "${cell.name || 'source'}" sans fichier chargé — exécution interrompue`, 'warning')
                    return { stopped: true, reason: 'source_no_file', cellName: cell.name }
                }
                if (cell._status === 'error') {
                    get().setStatus(`Erreur source "${cell.name || 'source'}" — exécution interrompue`, 'error')
                    return { stopped: true, reason: 'source_error', cellName: cell.name }
                }
                continue
            }
            await get().runCellAt(path, item.originalIndex)
        }

        get().setStatus('Groupe exécuté', 'success')
        return { stopped: false }
    },

    addFileToZip(filename, content, type = 'blob') {
        if (get()._zipMode) {
            get()._zipFiles.push({ filename, content, type })
            return true
        }
        return false
    },

    downloadOrZipFile(filename, content, mimeType = 'application/octet-stream') {
        if (get()._zipMode) {
            get()._zipFiles.push({ filename, content, type: 'blob' })
            return true
        }
        const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        return false
    },

    async runGroupWithLoop(path, group) {
        if (ConfigManager.getGroupIfQuery(group)) {
            get().setStatus('Évaluation de la condition ifQuery...', 'loading')
            const ifQueryResult = await get().evaluateGroupIfQuery(group)
            group._ifQueryResult = ifQueryResult

            if (!ifQueryResult) {
                get().setStatus('Groupe ignoré (ifQuery = false)', 'info')
                return { stopped: false }
            }
        }

        get().setStatus('Initialisation de la boucle...', 'loading')

        const zipEnabled = group.loop.zip === true
        if (zipEnabled) {
            set({ _zipMode: true, _zipFiles: [] })
        }

        try {
            const loopQuery = group.loop.query
            const parsedLoopQuery = get().parseQueryWithParameters(loopQuery)
            const loopResults = await DuckDBManager.executeQuery(parsedLoopQuery)

            if (!loopResults || loopResults.length === 0) {
                get().setStatus('Boucle: aucune valeur trouvée', 'warning')
                set({ _zipMode: false, _zipFiles: [] })
                return { stopped: false }
            }

            const firstColumnName = Object.keys(loopResults[0])[0]
            const loopValues = loopResults.map(row => row[firstColumnName])

            get().setStatus(`Boucle: ${loopValues.length} itérations`, 'loading')

            for (let i = 0; i < loopValues.length; i++) {
                const loopValue = loopValues[i]
                set({ _currentLoopValue: loopValue })
                get().setStatus(`Boucle ${i + 1}/${loopValues.length}: {{ loop }} = ${loopValue}`, 'loading')

                const orderedItems = get().getAllItemsSorted(group)
                for (const item of orderedItems) {
                    if (item.type === 'child') {
                        const result = await get().runGroupAtPath([...path, item.originalIndex])
                        if (result?.stopped) return result
                        continue
                    }

                    const cell = item.item
                    if (cell.type === 'buttonRunNextCells') {
                        get().setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info')
                        return { stopped: true, reason: 'buttonRunNextCells' }
                    }
                    if (get().isCellSkippedInAutoFlow(cell)) continue
                    if (cell.type === 'source') {
                        if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                            return { stopped: true, reason: 'source_no_file', cellName: cell.name }
                        }
                        if (cell._status === 'error') {
                            return { stopped: true, reason: 'source_error', cellName: cell.name }
                        }
                        continue
                    }
                    await get().runCellAt(path, item.originalIndex)
                }
            }

            set({ _currentLoopValue: null })

            if (zipEnabled && get()._zipFiles.length > 0) {
                await get().generateAndDownloadZip(group)
            }

            get().setStatus(`Boucle terminée: ${loopValues.length} itérations` + (zipEnabled ? ` - ${get()._zipFiles.length} fichier(s) zippé(s)` : ''), 'success')
            return { stopped: false }

        } catch (error) {
            set({ _currentLoopValue: null })
            get().setStatus('Erreur boucle: ' + error.message, 'error')
            return { stopped: true }
        } finally {
            set({ _zipMode: false, _zipFiles: [] })
        }
    },

    async generateAndDownloadZip(group) {
        get().setStatus('Génération du fichier ZIP...', 'loading')

        try {
            let zipFilename = 'export.zip'
            if (group.loop.zipQuery) {
                const parsedZipQuery = get().parseQueryWithParameters(group.loop.zipQuery)
                const zipResults = await DuckDBManager.executeQuery(parsedZipQuery)
                if (zipResults && zipResults.length > 0) {
                    const firstValue = Object.values(zipResults[0])[0]
                    if (firstValue) {
                        zipFilename = String(firstValue)
                        if (!zipFilename.toLowerCase().endsWith('.zip')) {
                            zipFilename += '.zip'
                        }
                    }
                }
            }

            await CDNManager.loadPizZip()
            const zip = new PizZip()

            for (const file of get()._zipFiles) {
                if (file.content instanceof Blob) {
                    const arrayBuffer = await file.content.arrayBuffer()
                    zip.file(file.filename, arrayBuffer)
                } else if (file.content instanceof ArrayBuffer) {
                    zip.file(file.filename, file.content)
                } else if (typeof file.content === 'string') {
                    zip.file(file.filename, file.content)
                } else {
                    zip.file(file.filename, file.content)
                }
            }

            const zipBlob = zip.generate({ type: 'blob' })
            const url = URL.createObjectURL(zipBlob)
            const a = document.createElement('a')
            a.href = url
            a.download = zipFilename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            get().setStatus(`ZIP généré: ${zipFilename} (${get()._zipFiles.length} fichiers)`, 'success')
        } catch (error) {
            console.error('Erreur lors de la génération du ZIP:', error)
            throw new Error('Erreur ZIP: ' + error.message)
        }
    },

    async runCellAt(pathOrIndex, cellIndex) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell) return

        cell._status = 'running'
        set({ isLoading: true })
        get().setStatus(`Exécution de ${cell.name || cell.type}...`, 'loading')
        set((s: any) => ({ _rev: s._rev + 1 }))

        try {
            const schema = CELL_TYPE_SCHEMAS?.types[cell?.type]
            const handler = schema?.executeHandler
            if (handler && typeof get()[handler] === 'function') {
                await get()[handler](cell, path, cellIndex)
            }

            cell._status = 'success'
            get().setStatus(`${cell.name || cell.type} exécuté`, 'success')
        } catch (error) {
            cell._status = 'error'
            cell._resultInfo = 'Erreur: ' + error.message
            get().setStatus('Erreur: ' + error.message, 'error')
        } finally {
            set({ isLoading: false })
            set((s: any) => ({ _rev: s._rev + 1 }))
        }
    },

    async runGroup(pathOrIndex) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        return await get().runGroupAtPath(path)
    },

    async executeSqlRecursiveParseCell(cell) {
        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
            console.warn('❌ cell.query est vide ou undefined!')
            return
        }

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Exécution de la requête...', 'loading')

            const copyRegex = /COPY\s+[\s\S]+\bTO\s+'([^']+)'/i
            const copyMatch = finalQuery.match(copyRegex)

            if (copyMatch) {
                get().setStatus('Export du fichier...', 'loading')

                const fileName = copyMatch[1]

                try {
                    await DuckDBManager.executeQuery(finalQuery)

                    const fileExt = fileName.toLowerCase().split('.').pop()
                    const isBinaryFormat = ['xlsx', 'xls', 'parquet', 'pq', 'arrow', 'ipc', 'avro'].includes(fileExt)

                    const maxRetries = isBinaryFormat ? 15 : 10
                    const delayMs = isBinaryFormat ? 300 : 200

                    const buffer = await DuckDBManager.waitForFile(fileName, maxRetries, delayMs)

                    const bufLen = buffer?.byteLength ?? 0
                    if (bufLen > 0) {
                        const view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer || buffer)
                        if (fileExt === 'xlsx' && (view[0] !== 0x50 || view[1] !== 0x4B)) {
                            console.warn(`⚠️ [EXPORT] XLSX invalide: doit commencer par PK (0x50 0x4B), trouvé: 0x${view[0]?.toString(16)} 0x${view[1]?.toString(16)}`)
                        }
                    }

                    let mime = 'text/csv;charset=utf-8;'

                    switch (fileExt) {
                        case 'parquet':
                        case 'pq':
                            mime = 'application/octet-stream'
                            break
                        case 'xlsx':
                            mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                            break
                        case 'xls':
                            mime = 'application/vnd.ms-excel'
                            break
                        case 'json':
                        case 'jsonl':
                        case 'ndjson':
                            mime = 'application/json;charset=utf-8;'
                            break
                        case 'txt':
                            mime = 'text/plain;charset=utf-8;'
                            break
                        case 'tsv':
                            mime = 'text/tab-separated-values;charset=utf-8;'
                            break
                        case 'csv':
                            mime = 'text/csv;charset=utf-8;'
                            break
                        case 'xml':
                            mime = 'application/xml;charset=utf-8;'
                            break
                        case 'bin':
                        case 'dat':
                        case 'blob':
                            mime = 'application/octet-stream'
                            break
                        case 'arrow':
                        case 'ipc':
                            mime = 'application/vnd.apache.arrow.stream'
                            break
                        case 'avro':
                            mime = 'application/avro'
                            break
                        case 'gz':
                        case 'gzip':
                            mime = 'application/gzip'
                            break
                        case 'zip':
                            mime = 'application/zip'
                            break
                        case 'zst':
                        case 'zstd':
                            mime = 'application/zstd'
                            break
                        default:
                            mime = 'application/octet-stream'
                            break
                    }

                    let view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : new Uint8Array(buffer.buffer ?? buffer, buffer.byteOffset ?? 0, buffer.byteLength)
                    if (fileExt === 'xlsx' && view.length >= 3 && view[0] !== 0x50 && view[1] === 0x50 && view[2] === 0x4B) {
                        view = view.slice(1)
                    }
                    const dataForBlob = view.slice(0)
                    const blob = new Blob([dataForBlob], { type: mime })
                    const downloadFileName = fileName.split('/').pop()
                    get().downloadOrZipFile(downloadFileName, blob, mime)

                    cell._results = []
                    cell._resultInfo = `✅ Fichier exporté: ${fileName} (${buffer.byteLength} octets)`
                } catch (copyError) {
                    console.error('❌ Erreur lors de la récupération du fichier exporté:', copyError)

                    get().setStatus('Récupération alternative des résultats...', 'loading')

                    const copyContentMatch = finalQuery.match(/COPY\s+\(([\s\S]+)\)\s+TO\s+/i)

                    if (copyContentMatch) {
                        const selectQuery = copyContentMatch[1]
                        const results = await DuckDBManager.executeQuery(selectQuery)

                        if (results.length > 0) {
                            const headers = Object.keys(results[0])
                            const tsvContent = [
                                headers.join('\t'),
                                ...results.map(row => headers.map(h => row[h] ?? '').join('\t'))
                            ].join('\n')

                            const blob = new Blob([tsvContent], { type: 'text/plain;charset=utf-8;' })
                            const downloadFileName = fileName.split('/').pop()
                            get().downloadOrZipFile(downloadFileName, blob, 'text/plain;charset=utf-8;')

                            cell._results = []
                            cell._resultInfo = `✅ Fichier exporté (mode alternatif): ${fileName} - ${results.length} ligne(s)`
                        } else {
                            throw new Error('Aucun résultat à exporter')
                        }
                    } else {
                        throw copyError
                    }
                } finally {
                    await DuckDBManager.dropFile(fileName)
                }
            } else {
                const finalResults = await DuckDBManager.executeQuery(finalQuery)
                cell._results = finalResults
                cell._resultInfo = `✅ ${finalResults.length} ligne(s)`
                if (get().isSqlResultTabular(cell)) {
                    const maxRows = cell.maxRows || 100000
                    const truncated = finalResults.length > maxRows
                    const rawResults = finalResults.slice(0, maxRows)
                    _rawTableDataStore.set(cell._id, rawResults)
                    cell._results = rawResults
                    if (truncated) cell._resultInfo = `✅ ${finalResults.length} ligne(s) (limité à ${maxRows})`
                }
            }

            get().setStatus('SQL Recursive Parse exécuté', 'success')
            if (sqlIsDdl(finalQuery)) await get().refreshDuckdbSchema?.()
        } catch (error) {
            throw error
        }
    },

    async executeTableCell(cell) {
        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return

        get().setStatus('Chargement tableau...', 'loading')

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Exécution de la requête...', 'loading')

            const { rows: results, schemaTypes } = await DuckDBManager.executeQueryWithSchema(finalQuery)

            const maxRows = cell.maxRows || 100000
            const truncated = results.length > maxRows
            const rawResults = results.slice(0, maxRows)
            _rawTableDataStore.set(cell._id, rawResults)
            cell._results = rawResults
            cell._schemaTypes = schemaTypes || {}
            cell._resultInfo = `${results.length} ligne(s)` + (truncated ? ` (limité à ${maxRows})` : '')

            get().setStatus('Tableau chargé', 'success')
            if (sqlIsDdl(finalQuery)) await get().refreshDuckdbSchema?.()
        } catch (error) {
            throw error
        }
    },

    async executeSqlBlockCell(cell) {
        const { astToSql, getEffectiveSql, generateMaterializeQuery } = await import('../../../lib/SqlBlockService')
        const { createDefaultSqlBlockConfig } = await import('../../../lib/SqlBlockTypes')

        // Initialiser la config si elle n'existe pas
        if (!cell.sqlBlockConfig) {
            cell.sqlBlockConfig = createDefaultSqlBlockConfig()
        }
        const cfg = cell.sqlBlockConfig
        const sql = getEffectiveSql(cfg)

        if (!sql?.trim()) {
            cell._resultInfo = 'Aucun SQL à exécuter — définissez une source et des steps.'
            return
        }

        if (!cell.name?.trim()) {
            throw new Error('La cellule sqlBlock doit avoir un nom (utilisé comme nom de VIEW/TABLE dans DuckDB).')
        }

        get().setStatus('Exécution du SQL Block...', 'loading')

        try {
            // Supprimer l'objet existant s'il est d'un type différent
            // (DuckDB refuse CREATE OR REPLACE TABLE sur une VIEW existante et vice-versa)
            const materialize = cfg.ast?.materialize ?? 'view'
            const oppositeType = materialize === 'view' ? 'TABLE' : 'VIEW'
            try {
                await DuckDBManager.executeQuery(`DROP ${oppositeType} IF EXISTS ${cell.name}`)
            } catch (_) { /* pas d'objet à supprimer, on continue */ }

            // Créer la VIEW ou TABLE dans DuckDB (accessible par les cellules en aval)
            const finalSql = get().parseQueryWithParameters(sql)
            const materializeQuery = generateMaterializeQuery(cell.name, finalSql, materialize)
            await DuckDBManager.executeQuery(materializeQuery)

            // Charger les résultats pour l'affichage dans la cellule
            const { rows: results, schemaTypes } = await DuckDBManager.executeQueryWithSchema(
                `SELECT * FROM ${cell.name} LIMIT 1000`
            )
            cell._results = results
            cell._schemaTypes = schemaTypes || {}
            cell._resultInfo = `${results.length} ligne(s)${results.length === 1000 ? ' (limité à 1 000 pour l\'affichage)' : ''} — ${cfg.ast?.materialize === 'table' ? 'TABLE' : 'VIEW'} "${cell.name}" créée`

            // Synchroniser le schéma DuckDB (panel + éditeur SQL)
            await get().refreshDuckdbSchema?.()
            get().setStatus('SQL Block exécuté', 'success')
        } catch (error) {
            throw error
        }
    },

    async executeMalloyCell(cell) {
        const { compileMalloy, isCompileError } = await import('../../../lib/MalloyService')
        const { DEFAULT_MALLOY_TEMPLATE } = await import('../../components/malloy/MalloyCellEditor')

        if (!cell.malloyText?.trim()) {
            cell.malloyText = DEFAULT_MALLOY_TEMPLATE
            cell._resultInfo = 'Aucun code Malloy — modèle par défaut chargé.'
            return
        }

        if (!cell.name?.trim()) {
            throw new Error('La cellule Malloy doit avoir un nom (utilisé comme nom de VIEW dans DuckDB).')
        }

        get().setStatus('Compilation Malloy...', 'loading')

        const duckdbTables = get()._duckdbTables ?? {}
        const result = await compileMalloy(cell.malloyText, duckdbTables)

        if (isCompileError(result)) {
            cell._compiledSql = null
            cell._malloyLogs = result.logs
            throw new Error(result.error || 'Erreur de compilation Malloy')
        }

        cell._compiledSql = result.sql
        cell._malloyLogs = result.logs ?? []

        get().setStatus('Exécution du SQL Malloy...', 'loading')

        try {
            // Supprimer l'objet existant s'il est d'un type différent
            try { await DuckDBManager.executeQuery(`DROP TABLE IF EXISTS "${cell.name}"`) } catch (_) {}
            try { await DuckDBManager.executeQuery(`DROP VIEW IF EXISTS "${cell.name}"`) } catch (_) {}

            // Créer la VIEW dans DuckDB (accessible par les cellules en aval)
            const finalSql = get().parseQueryWithParameters(result.sql)
            await DuckDBManager.executeQuery(`CREATE OR REPLACE VIEW "${cell.name}" AS (${finalSql})`)

            // Charger les résultats pour affichage
            const { rows: results, schemaTypes } = await DuckDBManager.executeQueryWithSchema(
                `SELECT * FROM "${cell.name}" LIMIT 1000`
            )
            cell._results = results
            cell._schemaTypes = schemaTypes || {}
            cell._resultInfo = `${results.length} ligne(s)${results.length === 1000 ? ' (limité à 1 000)' : ''} — VIEW "${cell.name}" créée`

            await get().refreshDuckdbSchema?.()
            get().setStatus('Malloy exécuté', 'success')
        } catch (error) {
            throw error
        }
    },

    showSqlEditorVisible(cell) {
        return get().devMode || ConfigManager.getCellQueryClientVisible(cell, 0)
    },

    isSqlResultTabular(cell) {
        const r = cell?._results
        if (!r || !Array.isArray(r) || r.length === 0) return false
        const row = r[0]
        const keys = Object.keys(row)
        if (keys.length > 1) return true
        if (r.length > 1) return true
        const val = row[keys[0]]
        return typeof val !== 'string'
    },

    isSqlResultText(cell) {
        const r = cell?._results
        if (!r || !Array.isArray(r) || r.length !== 1) return false
        const keys = Object.keys(r[0])
        return keys.length === 1 && typeof r[0][keys[0]] === 'string'
    },

    getSqlResultAsText(cell) {
        if (!get().isSqlResultText(cell)) return ''
        const keys = Object.keys(cell._results[0])
        return cell._results[0][keys[0]] ?? ''
    },

    async executeMarkdownCell(cell) {
        const languageType = ConfigManager.getCellEngine(cell, 'main')
        if (languageType === 'text') {
            cell._markdownContent = ConfigManager.getCellEditableContent(cell)
            return
        }
        const cellQuery = ConfigManager.getCellQuery(cell, 'main')
        if (!cellQuery?.trim()) return

        get().setStatus('Chargement Markdown...', 'loading')

        try {
            let mdContent
            if (languageType === 'js') {
                let jsCode = get().parseQueryWithParameters(cellQuery || '')
                try {
                    const result = safeEvalJs(jsCode)
                    mdContent = typeof result === 'string' ? result : String(result)
                } catch (jsError) {
                    throw new Error(`Erreur JS: ${jsError.message}`)
                }
            } else {
                const finalQuery = get().parseQueryWithParameters(cellQuery || '')
                get().setStatus('Exécution de la requête...', 'loading')
                const results = await DuckDBManager.executeQuery(finalQuery)
                mdContent = results.map(row => Object.values(row).join('')).join('\n')
            }
            cell._markdownContent = mdContent
            get().setStatus('Markdown chargé', 'success')
        } catch (error) {
            throw error
        }
    },

    async executeIframeCell(cell) {
        const cellQuery = ConfigManager.getCellQuery(cell, 0)
        if (!cellQuery?.trim()) return

        const languageType = ConfigManager.getCellEngine(cell, 0)
        get().setStatus('Chargement HTML...', 'loading')

        try {
            let htmlContent

            if (languageType === 'text') {
                htmlContent = (cellQuery || '').trim()
                cell._resultInfo = ''
            } else if (languageType === 'js') {
                let jsCode = get().parseQueryWithParameters(cellQuery || '')
                try {
                    const result = safeEvalJs(jsCode)
                    htmlContent = typeof result === 'string' ? result : String(result)
                } catch (jsError) {
                    throw new Error(`Erreur JS: ${jsError.message}`)
                }
                cell._resultInfo = '✅ HTML généré (JavaScript)'
            } else {
                const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')
                get().setStatus('Exécution de la requête...', 'loading')
                const results = await DuckDBManager.executeQuery(finalQuery)
                htmlContent = results.map(row => Object.values(row).join('')).join('\n')
                cell._resultInfo = '✅ HTML généré'
            }

            cell._htmlContent = htmlContent
            set((s: any) => ({ _rev: s._rev + 1 }))
            get().setStatus('HTML chargé', 'success')
        } catch (error) {
            throw error
        }
    },

    renderIframeInContainer(cell) {
        const iframe = document.getElementById('iframe-' + cell._id)
        if (iframe && cell._htmlContent) {
            const doc = iframe.contentDocument || iframe.contentWindow.document
            doc.open()
            doc.write(cell._htmlContent)
            doc.close()
        }
    },

    async executeSqlStatCell(cell) {
        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) return

        get().setStatus('Exécution de la stat SQL...', 'loading')

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Exécution de la requête...', 'loading')
            const results = await DuckDBManager.executeQuery(finalQuery)

            if (!results || results.length === 0) {
                cell._results = []
                cell._statValue = '-'
                cell._resultInfo = 'Aucun résultat'
                return
            }

            const firstRow = results[0]
            const statValue = Object.values(firstRow)[0]

            cell._results = results
            cell._statValue = statValue !== null && statValue !== undefined ? String(statValue) : '-'
            cell._resultInfo = ''

            get().setStatus('Stat SQL exécutée', 'success')
        } catch (error) {
            throw error
        }
    },

    async executeUiParameterCell(cell) {
        cell._paramError = null

        if (cell.preserveUserValue && cell._userModified) {
            get().setStatus(`${ConfigManager.getCellReferenceName(cell)} : valeur utilisateur préservée`, 'success')
            return
        }

        try {
            const languageType = ConfigManager.getCellEngine(cell, 0)
            let results

            if (languageType === 'text') {
                get().setStatus(`${ConfigManager.getCellReferenceName(cell)} : texte utilisé tel quel`, 'success')
                const textValue = (ConfigManager.getCellQuery(cell, 0) || '').trim()
                if (cell.paramType === 'dropdown') {
                    const lines = textValue.split('\n').filter(Boolean)
                    results = lines.map(line => ({ col1: line, col2: line }))
                } else {
                    results = [{ value: textValue }]
                }
            } else if (languageType === 'js') {
                get().setStatus('Exécution du code JavaScript...', 'loading')

                let jsCode = ConfigManager.getCellQuery(cell, 0) || ''
                jsCode = get().parseQueryWithParameters(jsCode)

                try {
                    const jsResult = safeEvalJs(jsCode)

                    if (cell.paramType === 'dropdown') {
                        if (Array.isArray(jsResult)) {
                            results = jsResult.map(item => {
                                if (Array.isArray(item)) {
                                    return {
                                        col1: String(item[0] || ''),
                                        col2: item.length > 1 ? String(item[1]) : String(item[0] || '')
                                    }
                                } else {
                                    return { col1: String(item) }
                                }
                            })
                        } else {
                            throw new Error('Le code JS doit retourner un tableau pour un dropdown')
                        }
                    } else {
                        results = [{ value: jsResult }]
                    }
                } catch (jsError) {
                    throw new Error(`Erreur JS: ${jsError.message}`)
                }
            } else {
                const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')
                get().setStatus('Exécution de la requête...', 'loading')
                results = await DuckDBManager.executeQuery(finalQuery)
            }

            if (cell.paramType === 'dropdown') {
                if (results.length === 0) {
                    cell._options = []
                    cell._value = ''
                    cell._paramError = 'La requête n\'a retourné aucun résultat'
                    return
                }

                const columnKeys = Object.keys(results[0])
                const firstColumnKey = columnKeys[0]
                const secondColumnKey = columnKeys.length > 1 ? columnKeys[1] : null

                cell._options = results.map(row => {
                    const value = String(row[firstColumnKey])
                    const label = secondColumnKey ? String(row[secondColumnKey]) : value
                    return { value, label }
                })

                const currentValues = cell._options.map(opt => opt.value)
                if (!cell._value || !currentValues.includes(cell._value)) {
                    cell._value = cell._options[0]?.value || ''
                }

                cell._initialized = true
                get().setStatus(`Options ${ConfigManager.getCellReferenceName(cell)} chargées`, 'success')

            } else if (cell.paramType === 'input') {
                if (results.length > 0) {
                    const firstColumnKey = Object.keys(results[0])[0]
                    const rawValue = results[0][firstColumnKey]
                    cell._value = formatValueForInputType(rawValue, cell.inputType)
                }

                cell._initialized = true
                get().setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success')

            } else if (cell.paramType === 'range') {
                if (results.length > 0) {
                    const firstColumnKey = Object.keys(results[0])[0]
                    const rawValue = results[0][firstColumnKey]
                    const numValue = Number(rawValue)
                    const min = cell.rangeMin ?? 0
                    const max = cell.rangeMax ?? 100
                    cell._value = Math.min(max, Math.max(min, isNaN(numValue) ? min : numValue))
                } else if (cell._value === '' || cell._value === undefined) {
                    cell._value = cell.rangeMin ?? 0
                }

                cell._initialized = true
                get().setStatus(`${ConfigManager.getCellReferenceName(cell)} initialisé`, 'success')
            }

            cell._userModified = false
        } catch (error) {
            cell._paramError = 'Erreur: ' + error.message
            get().setStatus('Erreur: ' + error.message, 'error')
        }
    },

    async executePublipostageWordCell(cell) {
        await CDNManager.loadDocxtemplater()

        if (!cell.docxTemplateBase64) {
            console.error('❌ No template loaded')
            throw new Error('Aucun template Word chargé')
        }

        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
            console.error('❌ No data query')
            throw new Error('Requête de données manquante')
        }

        if (!ConfigManager.getCellQuery(cell, 1)?.trim()) {
            console.error('❌ No filename query')
            throw new Error('Requête de nom de fichier manquante')
        }

        get().setStatus('Exécution du publipostage Word...', 'loading')

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Récupération des données...', 'loading')
            const dataResults = await DuckDBManager.executeQuery(finalQuery)

            if (!dataResults || dataResults.length === 0) {
                cell._resultInfo = 'Aucune donnée à traiter'
                return
            }

            const finalQuery2 = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 1) || '')

            get().setStatus('Récupération des noms de fichiers...', 'loading')
            const filenameResults = await DuckDBManager.executeQuery(finalQuery2)

            if (!filenameResults || filenameResults.length === 0) {
                throw new Error('La requête de nom de fichier n\'a retourné aucun résultat')
            }

            if (dataResults.length !== filenameResults.length) {
                throw new Error(`Nombre de lignes différent: ${dataResults.length} données vs ${filenameResults.length} noms de fichiers`)
            }

            const templateArrayBuffer = FileHandler.base64ToUint8Array(cell.docxTemplateBase64).buffer

            get().setStatus('Génération des documents Word...', 'loading')
            let generatedCount = 0

            for (let i = 0; i < dataResults.length; i++) {
                const rowData = dataResults[i]
                const filenameRow = filenameResults[i]
                const filename = Object.values(filenameRow)[0] || `document_${i + 1}.docx`

                let templateData = rowData

                const keys = Object.keys(rowData)
                if (keys.length === 1) {
                    const value = rowData[keys[0]]
                    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
                        try {
                            templateData = JSON.parse(value)
                        } catch (e) {
                            console.warn('⚠️ Failed to parse JSON, using raw data:', e)
                        }
                    }
                }

                const zip = new PizZip(templateArrayBuffer)
                const doc = new window.docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true,
                })

                doc.render(templateData)

                const blob = doc.getZip().generate({
                    type: 'blob',
                    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                })

                get().downloadOrZipFile(filename, blob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
                generatedCount++

                get().setStatus(`Génération ${generatedCount}/${dataResults.length}...`, 'loading')
            }

            cell._resultInfo = `✅ ${generatedCount} document(s) généré(s)`
            get().setStatus(`${generatedCount} documents générés`, 'success')
        } catch (error) {
            throw error
        }
    },

    async executePdfmeCell(cell) {
        get().setStatus('Chargement de pdfme...', 'loading')
        let pdfme
        try {
            pdfme = await CDNManager.loadPdfme()
        } catch (loadErr) {
            console.error('[pdfme] ERREUR chargement CDN:', loadErr)
            throw loadErr
        }

        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
            console.error('[pdfme] Requête SQL manquante')
            throw new Error('Requête SQL manquante')
        }

        const pdfmeTemplate = typeof cell.json === 'string' ? cell.json : (cell.json ? JSON.stringify(cell.json) : null)
        if (!pdfmeTemplate?.trim()) {
            console.error('[pdfme] Template pdfme manquant')
            throw new Error('Template pdfme manquant')
        }

        get().setStatus('Exécution de la requête SQL...', 'loading')

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Récupération des données...', 'loading')
            const data = await DuckDBManager.executeQuery(finalQuery)

            if (!data || data.length === 0) {
                console.warn('[pdfme] Aucune donnée retournée par la requête')
                cell._resultInfo = 'Aucune donnée à exporter'
                return
            }

            let pdfFileName = 'export.pdf'
            if (ConfigManager.getCellQuery(cell, 1)?.trim()) {
                get().setStatus('Récupération du nom de fichier...', 'loading')

                const finalQuery2 = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 1) || '')
                const filenameResults = await DuckDBManager.executeQuery(finalQuery2)

                if (filenameResults && filenameResults.length > 0) {
                    const filenameValue = Object.values(filenameResults[0])[0]
                    if (filenameValue) {
                        pdfFileName = String(filenameValue)
                    }
                }
            }

            get().setStatus('Génération du PDF (pdfme)...', 'loading')

            let template
            try {
                template = JSON.parse(pdfmeTemplate)
            } catch (parseErr) {
                console.error('[pdfme] ERREUR parsing template JSON:', parseErr)
                throw new Error('Template JSON invalide: ' + parseErr.message)
            }

            let pluginsConfig
            try {
                pluginsConfig = JSON.parse('{"Text": "text", "Table": "table"}')
            } catch (parseErr) {
                console.error('[pdfme] ERREUR parsing plugins JSON:', parseErr)
                throw new Error('Plugins JSON invalide: ' + parseErr.message)
            }

            const plugins = {}
            for (const [name, path] of Object.entries(pluginsConfig)) {
                const parts = String(path).split('.')
                let obj = pdfme.schemas
                for (const part of parts) {
                    if (obj && obj[part] !== undefined) {
                        obj = obj[part]
                    } else {
                        console.error(`[pdfme] Plugin introuvable: "${path}" partie "${part}"`, 'Clés disponibles:', obj ? Object.keys(obj) : 'obj est null/undefined')
                        throw new Error(`Plugin introuvable: "${path}" (partie "${part}" non trouvée dans @pdfme/schemas). Clés disponibles: ${obj ? Object.keys(obj).join(', ') : 'aucune'}`)
                    }
                }
                plugins[name] = obj
            }

            const fieldNames = new Set()
            if (template.schemas && Array.isArray(template.schemas)) {
                template.schemas.forEach(pageSchemas => {
                    if (Array.isArray(pageSchemas)) {
                        pageSchemas.forEach(s => {
                            if (s.name) fieldNames.add(s.name)
                        })
                    }
                })
            }

            const inputs = data.map((row, i) => {
                const input = {}

                template.schemas.forEach(pageSchemas => {
                    pageSchemas.forEach(s => {
                        if (s.name) {
                            let val = s.content || ''
                            try {
                                const parsed = JSON.parse(val)
                                input[s.name] = (Array.isArray(parsed) || typeof parsed === 'object') ? parsed : String(val)
                            } catch {
                                input[s.name] = String(val)
                            }
                        }
                    })
                })

                for (const [key, value] of Object.entries(row)) {
                    if (typeof value === 'string') {
                        try {
                            const parsed = JSON.parse(value)
                            if (Array.isArray(parsed) || typeof parsed === 'object') {
                                input[key] = parsed
                            } else {
                                input[key] = String(value)
                            }
                        } catch {
                            input[key] = String(value)
                        }
                    } else {
                        input[key] = String(value ?? '')
                    }
                }
                return input
            })

            if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
                console.warn('[pdfme] Aucun input généré par le mapping')
                cell._resultInfo = 'Aucun input généré par le mapping'
                return
            }

            let pdf
            try {
                pdf = await pdfme.generator.generate({ template, inputs, plugins })
            } catch (genErr) {
                console.error('[pdfme] ERREUR generate():', genErr)
                console.error('[pdfme] generate() stack:', genErr.stack)
                throw genErr
            }

            const pdfBlob = new Blob([pdf], { type: 'application/pdf' })

            if (get()._zipMode) {
                get().downloadOrZipFile(pdfFileName, pdfBlob, 'application/pdf')
            } else {
                const url = URL.createObjectURL(pdfBlob)
                const a = document.createElement('a')
                a.href = url
                a.download = pdfFileName
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                URL.revokeObjectURL(url)
            }

            cell._resultInfo = `✅ PDF généré: ${pdfFileName} (${inputs.length} page(s), ${data.length} ligne(s) SQL)`
            get().setStatus('PDF généré avec succès (pdfme)', 'success')
        } catch (error) {
            console.error('[pdfme] === ERREUR executePdfmeCell ===', error)
            console.error('[pdfme] Stack:', error.stack)
            throw error
        }
    },

    async executePerspectiveCell(cell) {
        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
            throw new Error('Requête SQL manquante')
        }

        get().setStatus('Chargement de Perspective...', 'loading')
        await CDNManager.loadPerspective()

        get().setStatus('Parsing de la requête SQL...', 'loading')

        try {
            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')
            cell._perspectiveQuery = finalQuery

            get().setStatus('Exécution de la requête...', 'loading')

            const arrowTable = await DuckDBManager.executeQueryArrow(finalQuery)

            cell._arrowTable = arrowTable
            cell._perspectiveScheduled = true
            cell._perspectiveReady = true
            set((s: any) => ({ _rev: s._rev + 1 }))

            try {
                await new Promise(r => setTimeout(r, 0))
                const _containerId = 'perspective-' + cell._id
                let _waited = 0
                while (!document.getElementById(_containerId) && _waited < 2000) {
                    await new Promise(r => setTimeout(r, 50))
                    _waited += 50
                }

                await get().renderPerspectiveInContainer(cell)
            } catch (renderError) {
                cell._perspectiveScheduled = false
                throw renderError
            }

            const rowCount = arrowTable.numRows
            cell._resultInfo = `✅ ${rowCount} ligne(s)`
            get().setStatus('Perspective chargé', 'success')
        } catch (error) {
            cell._perspectiveReady = false
            throw error
        }
    },

    async renderPerspectiveInContainer(cell) {
        const containerId = 'perspective-' + cell._id
        const viewer = document.getElementById(containerId)

        if (!viewer || !cell._arrowTable) {
            // Viewer absent du DOM (ex: showContent=false pendant l'exécution).
            // Réinitialise le flag pour que le useEffect du composant relance le rendu
            // une fois que le statut passe à 'success' et que le viewer est monté.
            cell._perspectiveScheduled = false
            return
        }

        if (cell._perspectiveRendering) {
            cell._perspectiveScheduled = false
            return
        }
        cell._perspectiveRendering = true
        cell._perspectiveScheduled = false

        try {
            if (DuckDBManager.getEngine() !== 'duckdb-wasm') {
                throw new Error('Perspective nécessite le moteur DuckDB WASM. Veuillez changer de moteur dans les paramètres.')
            }

            const conn = DuckDBManager.getConnection()
            const perspective = window.perspectiveClient

            let config = { theme: 'Pro Light' }
            const perspectiveConfig = cell.json?.perspectiveConfig
            if (perspectiveConfig != null && perspectiveConfig !== '') {
                try {
                    const userConfig = typeof perspectiveConfig === 'string'
                        ? JSON.parse(perspectiveConfig.trim())
                        : perspectiveConfig
                    config = { ...config, ...userConfig }
                } catch (e) {
                    console.warn('Configuration Perspective invalide, utilisation des valeurs par défaut:', e)
                }
            }

            const finalQuery = cell._perspectiveQuery || get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            const arrowResult = await conn.query(finalQuery)
            const batches = []
            for await (const batch of arrowResult) {
                batches.push(batch)
            }

            if (!cell._perspectiveWorker) {
                cell._perspectiveWorker = await perspective.worker()
            }
            const table = await cell._perspectiveWorker.table(batches)

            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

            if (typeof viewer.resetThemes === 'function') {
                await viewer.resetThemes(['Pro Light', 'Pro Dark'])
            }
            await viewer.load(table)
            await viewer.restore(config)

            cell._perspectiveTable = table

        } catch (error) {
            console.error('Erreur lors du rendu Perspective:', error)
            throw error
        } finally {
            cell._perspectiveRendering = false
        }
    },

    async executeEchartCell(cell) {
        if (!ConfigManager.getCellQuery(cell, 0)?.trim()) {
            throw new Error('Requête SQL manquante')
        }
        if (DuckDBManager.currentEngine === 'ducklings') {
            throw new Error('Les cellules EChart nécessitent le moteur DuckDB WASM. Changez le moteur dans les paramètres.')
        }

        get().setStatus('Chargement ECharts...', 'loading')
        await CDNManager.loadECharts()

        get().setStatus('Parsing de la requête SQL...', 'loading')

        try {
            await DuckDBManager.initChartTypes()

            const finalQuery = get().parseQueryWithParameters(ConfigManager.getCellQuery(cell, 0) || '')

            get().setStatus('Exécution de la requête...', 'loading')
            const { rows, columnTypes } = await DuckDBManager.executeQueryWithSchema(finalQuery)

            cell._results = rows
            cell._columnTypes = columnTypes

            const parsed = EChartSqlParser.parseColumnRoles(rows, columnTypes)
            if (parsed.chartType === 'kpi') {
                cell._kpiHtml = EChartSqlParser.buildKpiHtml(rows, parsed)
                cell._echartsOption = null
            } else {
                cell._echartsOption = EChartSqlParser.buildEChartsOption(rows, parsed) ?? null
                cell._kpiHtml = null
            }
            cell._echartReady = true
            set((s: any) => ({ _rev: s._rev + 1 }))

            cell._resultInfo = `✅ ${rows.length} ligne(s)`
            get().setStatus('EChart chargé', 'success')
        } catch (error) {
            cell._echartReady = false
            throw error
        }
    },

    async renderEchartInContainer(cell, fromExecute = false) {
        const containerId = 'echart-' + cell._id
        const container = document.getElementById(containerId)

        if (!container || !cell._results || cell._results.length === 0) {
            return
        }

        if (cell._echartRendering) return
        cell._echartRendering = true

        try {
            if (cell._echartInstance) {
                cell._echartInstance.dispose()
                cell._echartInstance = null
            }
            if (cell._echartResizeObserver) {
                cell._echartResizeObserver.disconnect()
                cell._echartResizeObserver = null
            }

            const parsed = EChartSqlParser.parseColumnRoles(cell._results, cell._columnTypes)
            const { chartType } = parsed

            if (chartType === 'kpi') {
                container.innerHTML = EChartSqlParser.buildKpiHtml(cell._results, parsed)
                return
            }

            const option = EChartSqlParser.buildEChartsOption(cell._results, parsed)
            if (!option) {
                container.innerHTML = `<div class="flex items-center justify-center h-full text-base-content/50 text-sm p-6 text-center">
                    Aucun type de graphique reconnu.<br>
                    Utilisez des alias comme <strong>XAXIS</strong>, <strong>BARCHART</strong>, <strong>LINECHART</strong>, <strong>PIECHART</strong>, <strong>GAUGE</strong>…</div>`
                return
            }

            const instance = window.echarts.init(container, null, { renderer: 'canvas' })
            instance.setOption(option)
            cell._echartInstance = instance

            const ro = new ResizeObserver(() => {
                if (cell._echartInstance && !cell._echartInstance.isDisposed()) {
                    cell._echartInstance.resize()
                }
            })
            ro.observe(container)
            cell._echartResizeObserver = ro

        } catch (error) {
            console.error('[EChart] Erreur de rendu:', error)
            throw error
        } finally {
            cell._echartRendering = false
        }
    },

    async runGroupsFromIndex(startGroupIndex) {
        const groups = get().getGroups()
        for (let groupIndex = startGroupIndex; groupIndex < groups.length; groupIndex++) {
            await get().runGroup(groupIndex)
        }
    },

    async runGroupsFromIndexWithStopConditions(startGroupIndex) {
        const groups = get().getGroups()
        for (let groupIndex = startGroupIndex; groupIndex < groups.length; groupIndex++) {
            const result = await get().runGroupWithStopConditions([groupIndex])
            if (result.stopped) {
                return result
            }
        }
        return { stopped: false }
    },

    async runGroupWithStopConditions(path) {
        const group = get().getGroupAtPath(path)
        if (!group) return { stopped: false }

        if (ConfigManager.getGroupIfQuery(group)) {
            get().setStatus('Évaluation de la condition ifQuery...', 'loading')
            const ifQueryResult = await get().evaluateGroupIfQuery(group)
            group._ifQueryResult = ifQueryResult

            if (!ifQueryResult) {
                get().setStatus('Groupe ignoré (ifQuery = false)', 'info')
                return { stopped: false }
            }
        }

        const orderedItems = get().getAllItemsSorted(group)
        for (const item of orderedItems) {
            if (item.type === 'child') {
                const result = await get().runGroupWithStopConditions([...path, item.originalIndex])
                if (result.stopped) return result
                continue
            }

            const cell = item.item

            if (cell.type === 'buttonRunNextCells') {
                return { stopped: true, reason: 'buttonRunNextCells' }
            }
            if (get().isCellSkippedInAutoFlow(cell)) continue

            if (cell.type === 'source') {
                if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                    return { stopped: true, reason: 'source_no_file', cellName: cell.name }
                }
                if (cell._status === 'error') {
                    get().setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info')
                    return { stopped: true, reason: 'source_error', cellName: cell.name }
                }
                continue
            }

            try {
                cell._status = 'running'
                await get().runCellAt(path, item.originalIndex)

                if (cell._status === 'error') {
                    get().setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error')
                    return { stopped: true, reason: 'cell_error' }
                }
            } catch (error) {
                cell._status = 'error'
                get().setStatus(`Arrêt : erreur - ${error.message}`, 'error')
                return { stopped: true, reason: 'execution_error', error: error.message }
            }
        }

        return { stopped: false }
    },

    async runCellsAfterWithStopConditions(path, cellIndex, cellId = null) {
        const group = get().getGroupAtPath(path)
        if (!group) return { stopped: false }

        const orderedItems = get().getAllItemsSorted(group)
        const startIndex = orderedItems.findIndex(item =>
            item.type === 'cell' &&
            (cellId ? item.item?._id === cellId : item.originalIndex === cellIndex)
        )
        if (startIndex === -1) return { stopped: false }

        for (let i = startIndex + 1; i < orderedItems.length; i++) {
            const item = orderedItems[i]

            if (item.type === 'child') {
                const result = await get().runGroupWithStopConditions([...path, item.originalIndex])
                if (result.stopped) return result
                continue
            }

            const cell = item.item

            if (cell.type === 'buttonRunNextCells') {
                get().setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info')
                return { stopped: true, reason: 'buttonRunNextCells' }
            }
            if (get().isCellSkippedInAutoFlow(cell)) continue

            if (cell.type === 'source') {
                if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                    get().setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info')
                    return { stopped: true, reason: 'source_no_file', cellName: cell.name }
                }
                if (cell._status === 'error') {
                    get().setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info')
                    return { stopped: true, reason: 'source_error', cellName: cell.name }
                }
                continue
            }

            try {
                cell._status = 'running'
                await get().runCellAt(path, item.originalIndex)

                if (cell._status === 'error') {
                    get().setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error')
                    return { stopped: true, reason: 'cell_error' }
                }
            } catch (error) {
                cell._status = 'error'
                get().setStatus(`Arrêt : erreur - ${error.message}`, 'error')
                return { stopped: true, reason: 'execution_error', error: error.message }
            }
        }

        let currentPath = [...path]
        while (currentPath.length > 1) {
            const childIndexInParent = currentPath[currentPath.length - 1]
            currentPath = currentPath.slice(0, -1)
            const parentGroup = get().getGroupAtPath(currentPath)
            if (!parentGroup) break

            const parentOrderedItems = get().getAllItemsSorted(parentGroup)
            const childPos = parentOrderedItems.findIndex(item =>
                item.type === 'child' && item.originalIndex === childIndexInParent
            )
            if (childPos === -1) break

            for (let i = childPos + 1; i < parentOrderedItems.length; i++) {
                const item = parentOrderedItems[i]

                if (item.type === 'child') {
                    const result = await get().runGroupWithStopConditions([...currentPath, item.originalIndex])
                    if (result.stopped) return result
                    continue
                }

                const cell = item.item

                if (cell.type === 'buttonRunNextCells') {
                    get().setStatus('Arrêt : bouton "Exécuter les cellules suivantes" rencontré', 'info')
                    return { stopped: true, reason: 'buttonRunNextCells' }
                }
                if (get().isCellSkippedInAutoFlow(cell)) continue

                if (cell.type === 'source') {
                    if (!cell._fileName || !cell._currentFile || !cell._loaded) {
                        get().setStatus(`Arrêt : la source "${cell.name}" n'a pas de fichier chargé`, 'info')
                        return { stopped: true, reason: 'source_no_file', cellName: cell.name }
                    }
                    if (cell._status === 'error') {
                        get().setStatus(`Arrêt : la source "${cell.name}" a une erreur de chargement`, 'info')
                        return { stopped: true, reason: 'source_error', cellName: cell.name }
                    }
                    continue
                }

                try {
                    cell._status = 'running'
                    await get().runCellAt(currentPath, item.originalIndex)
                    if (cell._status === 'error') {
                        get().setStatus(`Arrêt : erreur lors de l'exécution d'une cellule`, 'error')
                        return { stopped: true, reason: 'cell_error' }
                    }
                } catch (error) {
                    cell._status = 'error'
                    get().setStatus(`Arrêt : erreur - ${error.message}`, 'error')
                    return { stopped: true, reason: 'execution_error', error: error.message }
                }
            }
        }

        if (currentPath.length === 1) {
            const rootGroupIndex = currentPath[0]
            const result = await get().runGroupsFromIndexWithStopConditions(rootGroupIndex + 1)
            if (result.stopped) return result
        }

        return { stopped: false }
    },

    async runCellsAfter(path, cellIndex) {
        set({ isLoading: true })
        get().setStatus('Exécution des cellules suivantes...', 'loading')

        try {
            const group = get().getGroupAtPath(path)
            if (!group) return

            const orderedItems = get().getAllItemsSorted(group)
            const startIndex = orderedItems.findIndex(
                item => item.type === 'cell' && item.originalIndex === cellIndex
            )
            if (startIndex === -1) return

            for (let i = startIndex + 1; i < orderedItems.length; i++) {
                const item = orderedItems[i]
                if (item.type === 'child') {
                    await get().runGroupAtPath([...path, item.originalIndex])
                    continue
                }
                const cell = item.item
                if (cell?.type === 'buttonRunNextCells') break
                if (get().isCellSkippedInAutoFlow(cell)) continue
                await get().runCellAt(path, item.originalIndex)
            }

            if (path.length === 1) {
                const rootGroupIndex = path[0]
                await get().runGroupsFromIndex(rootGroupIndex + 1)
            }

            get().setStatus('Exécution terminée', 'success')
        } catch (error) {
            get().setStatus('Erreur: ' + error.message, 'error')
        } finally {
            set({ isLoading: false })
        }
    },

    async runAllGroups() {
        set({ isLoading: true })
        get().setStatus('Exécution de tous les groupes...', 'loading')

        await get().evaluateAllGroupIfQueries()

        const groups = get().getGroups()
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
            const result = await get().runGroup(groupIndex)
            if (result?.stopped) {
                set({ isLoading: false })
                if (get().statusType === 'loading') {
                    get().setStatus('Exécution interrompue', 'warning')
                }
                return
            }
        }

        set({ isLoading: false })
        get().setStatus('Toutes les cellules de la page exécutées', 'success')
    },
})
