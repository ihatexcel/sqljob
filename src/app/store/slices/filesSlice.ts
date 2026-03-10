// @ts-nocheck
import { FileHandler } from '../../../lib/FileHandler'
import { ConfigManager } from '../../../lib/ConfigManager'
import { DuckDBManager } from '../../../lib/DuckDBManager'

export const createFilesSlice = (set: any, get: any) => ({

    async loadEmbeddedFiles() {
        const sourceFileScripts = document.querySelectorAll('script[id^="sourceFile_"]')
        const docxTemplateScripts = document.querySelectorAll('script[id^="docxTemplate_"]')

        if (sourceFileScripts.length === 0 && docxTemplateScripts.length === 0) return

        console.info('📂 ' + (sourceFileScripts.length + docxTemplateScripts.length) + ' fichier(s) embarqué(s) trouvé(s)')

        const findSourceInAllPages = (sourceName: string) => {
            const pages = get().pages
            for (let pi = 0; pi < pages.length; pi++) {
                const page = pages[pi]
                const found = findSourceRecursive(page.groups, sourceName, [])
                if (found) return { ...found, pageIndex: pi }
            }
            return null
        }

        const findSourceRecursive = (groups: any[], sourceName: string, currentPath: number[]) => {
            for (let gi = 0; gi < groups.length; gi++) {
                const group = groups[gi]
                const groupPath = [...currentPath, gi]
                for (let ci = 0; ci < (group.cells || []).length; ci++) {
                    const cell = group.cells[ci]
                    if (cell.type === 'source' && cell.name === sourceName) {
                        return { path: groupPath, cellIndex: ci, source: cell }
                    }
                }
                if (group.children && group.children.length > 0) {
                    const found = findSourceRecursive(group.children, sourceName, groupPath)
                    if (found) return found
                }
            }
            return null
        }

        const findCellByPath = (groups: any[], targetPath: number[]) => {
            try {
                let current = groups
                let group = null
                for (let i = 0; i < targetPath.length - 1; i++) {
                    const index = targetPath[i]
                    if (index === -1) {
                        current = get().getLinkGroups()
                        continue
                    }
                    if (!current[index]) return null
                    group = current[index]
                    current = group.children || []
                }
                const cellIndex = targetPath[targetPath.length - 1]
                const finalGroup = targetPath.length === 1 ? current[targetPath[0]] : group
                if (!finalGroup || !finalGroup.cells || !finalGroup.cells[cellIndex]) return null
                return { cell: finalGroup.cells[cellIndex], cellIndex }
            } catch (e) {
                console.error('Error finding cell by path:', e)
                return null
            }
        }

        for (const script of sourceFileScripts) {
            const sourceName = script.dataset.sourceName
            const fileName = script.dataset.fileName
            const base64 = script.textContent.trim()
            if (!sourceName || !fileName || !base64) { console.warn('Script source incomplet:', script.id); continue }
            const found = findSourceInAllPages(sourceName)
            if (!found) { console.warn(`Source "${sourceName}" non trouvée dans les cellules`); continue }

            const originalPageIndex = get().activePageIndex
            set({ activePageIndex: found.pageIndex })
            try {
                get().setStatus(`Chargement de ${sourceName}...`, 'loading')
                const bytes = FileHandler.base64ToUint8Array(base64)
                const decompressedBuffer = await FileHandler.decompressGzip(bytes)
                const blob = new Blob([decompressedBuffer])
                const file = new File([blob], fileName, { type: FileHandler.getMimeTypeFromFileName(fileName) })
                await get().loadSingleSourceFile(file, found.path, found.cellIndex, { skipRunNextCells: true })
            } catch (error: any) {
                console.error(`Erreur chargement fichier embarqué ${sourceName}:`, error)
                get().setStatus(`Erreur: ${error.message}`, 'error')
            } finally {
                set({ activePageIndex: originalPageIndex })
            }
        }

        for (const script of docxTemplateScripts) {
            const cellPath = script.dataset.cellPath
            const fileName = script.dataset.fileName
            let base64 = script.textContent.trim()
            if (!cellPath || !fileName || !base64) { console.warn('Script docx template incomplet:', script.id); continue }

            if (script.dataset.compressed === 'true') {
                try {
                    const bytes = FileHandler.base64ToUint8Array(base64)
                    const decompressed = await FileHandler.decompressGzip(bytes)
                    base64 = FileHandler.arrayBufferToBase64(decompressed)
                } catch (e) { console.error('Décompression template docx échouée:', e); continue }
            }

            const pathArray = cellPath.split('_').map((n: string) => parseInt(n, 10))
            const found = findCellByPath(get().getGroups(), pathArray)
            if (!found) { console.warn(`Cellule publipostageWord au chemin "${cellPath}" non trouvée`); continue }
            if (found.cell.type !== 'publipostageWord') { console.warn(`La cellule au chemin "${cellPath}" n'est pas de type publipostageWord`); continue }

            try {
                ConfigManager.setCellFileData(found.cell, { base64, fileName })
            } catch (error: any) {
                console.error(`Erreur chargement template docx ${cellPath}:`, error)
            }
        }

        get().setStatus('Fichiers embarqués chargés', 'success')
    },

    handleSingleSourceDrop(e: any, path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'source') return
        cell._isDragging = false
        const files = e.dataTransfer.files
        if (files.length > 0) get().loadSingleSourceFile(files[0], path, cellIndex)
    },

    handleSingleSourceFileSelect(e: any, path: any, cellIndex: number) {
        const files = e.target.files
        if (files.length > 0) get().loadSingleSourceFile(files[0], path, cellIndex)
    },

    async loadSingleSourceFile(file: File, path: any, cellIndex: number, options: any = {}) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'source') return

        const skipRunNextCells = options.skipRunNextCells === true
        cell._fileName = file.name
        cell._currentFile = file
        cell._importFailed = false
        cell._parseLevels = []
        cell._parseLevels2 = []
        cell._mainQueryError = null
        cell._fallbackQueryError = null
        cell._rejectErrorsCount = 0
        cell._rejectedCellsCount = 0
        cell._rowCount = 0
        cell._queryBuilder = null
        set({ isLoading: true })
        cell._status = 'running'
        get().setStatus(`Chargement de ${cell.name}...`, 'loading')

        try {
            const tableName = cell.name || 'source1'
            let loadQuery
            let executed = false
            let fileName = file.name

            const getLogicalExt = (name: string) => {
                const lower = name.toLowerCase()
                if (lower.endsWith('.csv.gz')) return 'csv.gz'
                if (lower.endsWith('.tsv.gz')) return 'tsv.gz'
                if (lower.endsWith('.txt.gz')) return 'txt.gz'
                return lower.split('.').pop()
            }
            const logicalExt = getLogicalExt(fileName)

            if (logicalExt === 'xls') {
                get().setStatus(`Conversion Excel (.xls) via SheetJS...`, 'loading')
                const xlsxConf = cell.json?.xlsx || {}
                const { csv, csvFileName } = await FileHandler.processExcelFile(file, xlsxConf.options, xlsxConf.toCsvOptions, xlsxConf.sheetSelection)
                const csvBlob = new Blob([csv], { type: 'text/csv' })
                await DuckDBManager.registerFile(csvFileName, csvBlob)
                fileName = csvFileName
                loadQuery = `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM read_csv('${fileName}', HEADER = true, AUTO_DETECT = true, SAMPLE_SIZE = -1)`
            } else {
                await DuckDBManager.registerFile(file.name, file)
                const queryTemplate = (ConfigManager.getCellQuery(cell, 'main') || cell.queries?.[0]?.sql || '').trim()
                if (queryTemplate) {
                    const ctx = { name: tableName, fileNameUpload: fileName, fileName }
                    const replacedSql = get().replaceSourceContext(queryTemplate, ctx)
                    const cellLike = { queries: [{ name: 'main', sql: replacedSql, engine: 'sql', clientVisible: false }], _parseLevels: [] }
                    loadQuery = await get().parseQueryRecursively(cellLike)
                    cell._parseLevels = cellLike._parseLevels || []
                } else {
                    loadQuery = `CREATE OR REPLACE TABLE ${tableName} AS SELECT * FROM '${fileName}'`
                }
            }

            try {
                await DuckDBManager.executeQuery(loadQuery)
                executed = true
                cell._loadedViaFallback = false
                cell._mainQueryError = null
                cell._rejectErrorsCount = 0
            } catch (primaryError: any) {
                cell._mainQueryError = primaryError.message
                const query1Template = (ConfigManager.getCellQuery(cell, 'fallback') || cell.queries?.[1]?.sql || '').trim()
                if (query1Template) {
                    get().setStatus(`Requête initiale échouée, tentative fallback...`, 'loading')
                    const ctx1 = { name: tableName, fileNameUpload: fileName, fileName }
                    const cellLike1 = { type: 'source', queries: [{ name: 'main', sql: '' }, { name: 'fallback', sql: get().replaceSourceContext(query1Template, ctx1), engine: 'sql', clientVisible: false }], _parseLevels: [] }
                    try {
                        try { await DuckDBManager.executeQuery('DROP TABLE IF EXISTS reject_errors') } catch { /* ignore */ }
                        const fallbackQuery1 = await get().parseQueryRecursively(cellLike1, 1)
                        cell._parseLevels2 = cellLike1._parseLevels2 || []
                        await DuckDBManager.executeQuery(fallbackQuery1)
                        executed = true
                        loadQuery = fallbackQuery1
                        cell._loadedViaFallback = true
                        try {
                            const rejectResult = await DuckDBManager.executeQuery('SELECT count(*) as cnt FROM reject_errors')
                            cell._rejectErrorsCount = Number(rejectResult?.[0]?.cnt ?? 0)
                        } catch { cell._rejectErrorsCount = 0 }
                        get().setStatus(`${cell.name} chargé via requête de fallback`, 'success')
                    } catch (fallbackError: any) {
                        cell._parseLevels2 = cellLike1._parseLevels2 || []
                        cell._fallbackQueryError = fallbackError.message
                        get().setStatus(`Requête fallback échouée : ${fallbackError.message}`, 'error')
                    }
                }
                if (!executed) throw primaryError
            }

            // Compte les lignes intégrées
            try {
                const countResult = await DuckDBManager.executeQuery(`SELECT count(*) as cnt FROM "${tableName}"`)
                cell._rowCount = Number(countResult?.[0]?.cnt ?? 0)
            } catch { cell._rowCount = 0 }

            // Détecte les cellules non intégrées via comparaison NULLs (all_varchar vs auto-type)
            // Non applicable aux parquets (pas de pb de conversion)
            try {
                const lower = fileName.toLowerCase()
                let nullQueryRaw: string | null = null
                if (lower.endsWith('.csv') || lower.endsWith('.csv.gz')) {
                    nullQueryRaw = `SELECT SUM((COLUMNS(*) IS NULL)::INT) AS nb_null FROM read_csv('${fileName}', HEADER = true, ALL_VARCHAR = true)`
                } else if (lower.endsWith('.xlsx')) {
                    nullQueryRaw = `SELECT SUM((COLUMNS(*) IS NULL)::INT) AS nb_null FROM read_xlsx('${fileName}', HEADER = true, STOP_AT_EMPTY = false, EMPTY_AS_VARCHAR = true, ALL_VARCHAR = true)`
                } else if (lower.endsWith('.tsv') || lower.endsWith('.tsv.gz') || lower.endsWith('.txt') || lower.endsWith('.txt.gz')) {
                    nullQueryRaw = `SELECT SUM((COLUMNS(*) IS NULL)::INT) AS nb_null FROM read_csv('${fileName}', HEADER = true, DELIM = '\t', ALL_VARCHAR = true)`
                }
                if (nullQueryRaw) {
                    const [rawResult, intResult] = await Promise.all([
                        DuckDBManager.executeQuery(nullQueryRaw),
                        DuckDBManager.executeQuery(`SELECT SUM((COLUMNS(*) IS NULL)::INT) AS nb_null FROM "${tableName}"`),
                    ])
                    const nullRaw = Number(rawResult?.[0]?.nb_null ?? 0)
                    const nullInt = Number(intResult?.[0]?.nb_null ?? 0)
                    cell._rejectedCellsCount = Math.max(0, nullInt - nullRaw)
                }
            } catch { /* ignore */ }

            // Requête de production (query builder)
            if (executed) {
                try {
                    const ext = fileName.toLowerCase()
                    let qb: string
                    if (ext.endsWith('.csv') || ext.endsWith('.csv.gz')) {
                        const descRows = await DuckDBManager.executeQuery(`DESCRIBE SELECT * FROM "${tableName}"`)
                        const cols = descRows.map((r: any) => `'${r.column_name.replace(/'/g, "''")}': '${r.column_type}'`).join(', ')
                        qb = `CREATE OR REPLACE TABLE ${tableName} AS\nSELECT * FROM read_csv('${fileName}',\n  HEADER = true,\n  IGNORE_ERRORS = true, store_rejects = true,\n  columns = {${cols}})`
                    } else if (ext.endsWith('.tsv') || ext.endsWith('.tsv.gz') || ext.endsWith('.txt') || ext.endsWith('.txt.gz')) {
                        const descRows = await DuckDBManager.executeQuery(`DESCRIBE SELECT * FROM "${tableName}"`)
                        const cols = descRows.map((r: any) => `'${r.column_name.replace(/'/g, "''")}': '${r.column_type}'`).join(', ')
                        qb = `CREATE OR REPLACE TABLE ${tableName} AS\nSELECT * FROM read_csv('${fileName}',\n  HEADER = true, DELIM = '\\t',\n  IGNORE_ERRORS = true, store_rejects = true,\n  columns = {${cols}})`
                    } else if (ext.endsWith('.xlsx') || ext.endsWith('.xls')) {
                        qb = `CREATE OR REPLACE TABLE ${tableName} AS\nSELECT * FROM read_xlsx('${fileName}',\n  HEADER = true, STOP_AT_EMPTY = false,\n  EMPTY_AS_VARCHAR = true, IGNORE_ERRORS = true)`
                    } else if (ext.endsWith('.parquet') || ext.endsWith('.parquet.gz')) {
                        qb = `CREATE OR REPLACE TABLE ${tableName} AS\nSELECT * FROM read_parquet('${fileName}')`
                    }
                    cell._queryBuilder = qb || null
                } catch { cell._queryBuilder = null }
            }

            cell._loaded = true
            cell._status = 'success'
            cell._pendingFileLoad = false
            if (!cell._parseLevels?.length) cell._parseLevels = [{ level: 'final', innerQuery: loadQuery, replacement: null }]
            get().setStatus(`${cell.name} chargé!`, 'success')

            const existing = get()._roomFiles ?? []
            if (!existing.some((f: any) => f.tableName === tableName)) {
                set({ _roomFiles: [...existing, { name: file.name, tableName, size: file.size ?? 0, source: 'source-cell' }] })
            }
            await get().refreshDuckdbTables()
            try { await get().db.refreshTableSchemas() } catch { /* ignore */ }

            if (!skipRunNextCells) {
                const result = await get().runCellsAfterWithStopConditions(path, cellIndex, cell._id)
                if (!result.stopped) get().setStatus('Exécution terminée', 'success')
            }
        } catch (error: any) {
            cell._status = 'error'
            cell._importFailed = true
            get().setStatus('Erreur: ' + error.message, 'error')
            cell._fileName = ''
            cell._currentFile = null
            if (Array.isArray(cell.files)) cell.files = cell.files.filter((f: any) => f.slot !== 'source')
            delete cell.fileBase64
            delete cell.fileName
        } finally {
            set({ isLoading: false })
        }
    },

    async executeSourceCell(cell: any, path: any, cellIndex: number) {
        if (cell._currentFile) {
            await get().loadSingleSourceFile(cell._currentFile, path, cellIndex)
        } else if (cell._fileName) {
            const fileEntry = Array.isArray(cell.files) ? cell.files.find((f: any) => f.slot === 'source') : null
            const base64 = fileEntry?.base64 || cell.fileBase64
            if (base64) {
                const bytes = FileHandler.base64ToUint8Array(base64)
                const blob = new Blob([bytes])
                const file = new File([blob], cell._fileName, { type: FileHandler.getMimeTypeFromFileName(cell._fileName) })
                await get().loadSingleSourceFile(file, path, cellIndex)
            } else {
                throw new Error('Fichier source non disponible, veuillez le recharger')
            }
        }
    },

    async removeSingleSourceFile(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'source') return

        if (cell._fileName && DuckDBManager.dbInstance) {
            try { await DuckDBManager.executeQuery(`DROP TABLE IF EXISTS "${cell.name}"`) } catch { /* ignore */ }
        }

        const safeSourceName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_')
        document.querySelectorAll(`script[id^="sourceFile_${safeSourceName}"]`).forEach((s: any) => s.remove())

        const fileInput = document.getElementById('fileInput_' + cell._id) as HTMLInputElement
        if (fileInput) fileInput.value = ''

        cell._fileName = ''
        cell._currentFile = null
        cell._loaded = false
        cell._status = null
        cell._importFailed = false
        cell._parseLevels = []
        cell._loadedViaFallback = false
        cell._mainQueryError = null
        cell._fallbackQueryError = null
        cell._rejectErrorsCount = 0
        cell._rejectedCellsCount = 0
        cell._rowCount = 0
        cell._queryBuilder = null
        if (Array.isArray(cell.files)) cell.files = cell.files.filter((f: any) => f.slot !== 'source')
        delete cell.fileBase64
        delete cell.fileName

        get().setStatus(`Fichier supprimé de ${cell.name}`, 'success')
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    handleDocxTemplateDrop(e: any, path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'publipostageWord') return
        cell._isDragging = false
        const files = e.dataTransfer.files
        if (files.length > 0) get().loadDocxTemplate(files[0], path, cellIndex)
    },

    handleDocxTemplateFileSelect(e: any, path: any, cellIndex: number) {
        const files = e.target.files
        if (files.length > 0) get().loadDocxTemplate(files[0], path, cellIndex)
    },

    async loadDocxTemplate(file: File, path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'publipostageWord') return
        if (!file.name.endsWith('.docx')) { get().setStatus('Seuls les fichiers .docx sont acceptés', 'error'); return }

        try {
            get().setStatus('Chargement du template Word...', 'loading')
            const arrayBuffer = await file.arrayBuffer()
            const base64 = FileHandler.arrayBufferToBase64(arrayBuffer)
            cell.docxTemplateBase64 = base64
            cell.docxTemplateFileName = file.name
            ConfigManager.setCellFileData(cell, { base64, fileName: file.name })
            get().setStatus('Template Word chargé', 'success')
        } catch (error: any) {
            get().setStatus('Erreur lors du chargement du template: ' + error.message, 'error')
        }
    },

    downloadDocxTemplate(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'publipostageWord') return
        if (!cell.docxTemplateBase64 || !cell.docxTemplateFileName) { get().setStatus('Aucun template à télécharger', 'error'); return }

        try {
            const uint8Array = FileHandler.base64ToUint8Array(cell.docxTemplateBase64)
            const blob = new Blob([uint8Array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
            FileHandler.downloadFile(blob, cell.docxTemplateFileName)
            get().setStatus('Template Word téléchargé', 'success')
        } catch (error: any) {
            get().setStatus('Erreur lors du téléchargement: ' + error.message, 'error')
        }
    },

    removeDocxTemplate(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'publipostageWord') return

        const fileInput = document.getElementById('docxInput_' + cell._id) as HTMLInputElement
        if (fileInput) fileInput.value = ''

        cell.docxTemplateBase64 = null
        cell.docxTemplateFileName = ''
        if (Array.isArray(cell.files)) cell.files = cell.files.filter((f: any) => f.slot !== 'docxTemplate')
        delete cell.fileBase64
        delete cell.fileName

        get().setStatus('Template Word supprimé', 'success')
    },

    async loadPendingSourceFiles() {
        const loadFromGroup = async (group: any, path: number[]) => {
            for (let ci = 0; ci < (group.cells || []).length; ci++) {
                const cell = group.cells[ci]
                if (cell.type === 'source' && cell._pendingFileLoad && cell._currentFile) {
                    try {
                        get().setStatus(`Chargement de ${cell.name}...`, 'loading')
                        await get().loadSingleSourceFile(cell._currentFile, path, ci, { skipRunNextCells: true })
                        cell._pendingFileLoad = false
                    } catch { /* ignore */ }
                }
            }
            if (group.children) {
                for (let gi = 0; gi < group.children.length; gi++) {
                    await loadFromGroup(group.children[gi], [...path, gi])
                }
            }
        }

        const originalPageIndex = get().activePageIndex
        try {
            const pages = get().pages
            for (let pi = 0; pi < pages.length; pi++) {
                set({ activePageIndex: pi })
                const page = pages[pi]
                for (let gi = 0; gi < page.groups.length; gi++) {
                    await loadFromGroup(page.groups[gi], [gi])
                }
            }
        } finally {
            set({ activePageIndex: originalPageIndex })
        }
    },
})
