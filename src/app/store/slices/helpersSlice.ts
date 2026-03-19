// @ts-nocheck
/**
 * helpersSlice — utilitaires, initialisation, gestion moteur DB, statuts.
 * Converti de helpersMixin.ts (Alpine this-proxy) vers un slice Zustand pur.
 */
import { DuckDBManager } from '../../../lib/DuckDBManager'
import { ConfigManager } from '../../../lib/ConfigManager'
import { safeEvalJs } from '../../../lib/safeEval'
import { FileHandler } from '../../../lib/FileHandler'

export const createHelpersSlice = (set: any, get: any) => ({

    hasSourceCells() {
        const { pages } = get()
        const checkGroups = (groups: any[]) => {
            for (const group of groups) {
                if (group.cells?.some((cell: any) => cell.type === 'source')) return true
                if (group.children && checkGroups(group.children)) return true
            }
            return false
        }
        return pages.some((page: any) =>
            checkGroups(page.groups || []) || checkGroups(page.linkGroups || [])
        )
    },

    canUseDucklings() {
        return !get().hasSourceCells()
    },

    async switchDbEngine(newEngine: string) {
        const { dbEngine, setStatus } = get()
        if (newEngine === dbEngine) return
        if (newEngine === 'ducklings' && !get().canUseDucklings()) {
            setStatus('Ducklings ne supporte pas les notebooks avec fichiers. Supprimez les cellules source pour utiliser Ducklings.', 'error')
            return
        }
        set({ isLoading: true })
        try {
            await DuckDBManager.switchEngine(newEngine, (msg: string, type: string) => get().setStatus(msg, type))
            set({ dbEngine: newEngine })
            localStorage.setItem('sqljob-dbEngine', newEngine)
            get().setStatus(`Moteur changé vers ${newEngine === 'ducklings' ? 'Ducklings' : 'DuckDB WASM'}`, 'success')
        } catch (error: any) {
            get().setStatus('Erreur lors du changement de moteur: ' + error.message, 'error')
        } finally {
            set({ isLoading: false })
        }
    },

    async refreshDuckdbTables() {
        try {
            const tableRows = await DuckDBManager.executeQuery('SHOW TABLES')
            const result: Record<string, { rowCount: number; columns: { name: string; type: string }[] }> = {}
            for (const row of tableRows) {
                const name = row.name ?? row.table_name
                if (!name) continue
                try {
                    const countRows = await DuckDBManager.executeQuery(`SELECT COUNT(*) as cnt FROM "${name}"`)
                    const descRows = await DuckDBManager.executeQuery(`DESCRIBE "${name}"`)
                    result[name] = {
                        rowCount: Number(countRows[0]?.cnt ?? 0),
                        columns: descRows.map((r: any) => ({ name: r.column_name, type: r.column_type })),
                    }
                } catch {
                    result[name] = { rowCount: 0, columns: [] }
                }
            }
            set({ _duckdbTables: result })
        } catch {
            // DuckDB pas encore prêt, on ignore silencieusement
        }
    },

    /**
     * Rafraîchit le schéma DuckDB dans les deux systèmes :
     * - _duckdbTables (DataSourcesPanel, SqlBlockEditor)
     * - db.refreshTableSchemas() (autocomplétion de l'éditeur SQL sqlrooms)
     */
    async refreshDuckdbSchema() {
        await get().refreshDuckdbTables()
        if (DuckDBManager.currentEngine !== 'ducklings') {
            try { await get().db?.refreshTableSchemas() } catch { /* ignoré si non prêt */ }
        }
    },

    async init() {
        try {
            await DuckDBManager.initDuckDB((msg: string, type: string) => get().setStatus(msg, type))
            get().ensureAllCellsHaveNames()
            await get().loadEmbeddedFiles()
            await get().loadPendingSourceFiles()
            await get().evaluateAllGroupIfQueries()
            await get().runAllGroups()
            const firstPage = get().pages[0]
            if (firstPage) {
                set((s: any) => ({ _pagesInitialized: new Set([...s._pagesInitialized, firstPage._id]) }))
            }
            setTimeout(() => setTimeout(() => get().refreshMarkdownCellsForPage(0), 300), 0)
            await get().refreshDuckdbTables()
            try {
                await get().room.initialize()
            } catch (err) {
                console.warn('[sqljob] room.initialize() error:', err)
            }
            if (DuckDBManager.currentEngine !== 'ducklings') {
                try {
                    await get().db.refreshTableSchemas()
                } catch (err) {
                    console.warn('[sqljob] refreshTableSchemas error:', err)
                }
            }
            get().room = { ...get().room, initialized: true }
        } catch (error: any) {
            get().setStatus('Erreur d\'initialisation: ' + error.message, 'error')
        } finally {
            set({ activePageIndex: 0 })
        }
    },

    async evaluateGroupIfQuery(group: any) {
        const q = ConfigManager.getGroupIfQuery(group)
        if (!group || !q) return true
        const sql = q.sql
        const langType = q.engine || 'sql'
        try {
            if (langType === 'js') {
                const jsCode = get().parseQueryWithParameters(sql)
                const result = safeEvalJs(jsCode)
                return result === true || (result !== null && result !== false && result !== undefined)
            } else {
                const finalQuery = get().parseQueryWithParameters(sql)
                const results = await DuckDBManager.executeQuery(finalQuery)
                if (!results || results.length === 0) return false
                const firstVal = Object.values(results[0])[0]
                return firstVal === true || (firstVal !== null && firstVal !== false && firstVal !== undefined)
            }
        } catch (err) {
            console.error('  ❌ [evaluateGroupIfQuery] Erreur:', err)
            return false
        }
    },

    async evaluateAllGroupIfQueries() {
        const { pages } = get()
        const evaluateRecursive = async (groups: any[]) => {
            for (const group of (groups || [])) {
                const ifQuery = ConfigManager.getGroupIfQuery(group)
                if (ifQuery) {
                    group._ifQueryResult = await get().evaluateGroupIfQuery(group)
                } else {
                    group._ifQueryResult = true
                }
                if (group.children?.length) await evaluateRecursive(group.children)
            }
        }
        for (const page of (pages || [])) {
            await evaluateRecursive(page.groups || [])
            await evaluateRecursive(page.linkGroups || [])
        }
    },

    setStatus(message: string, type: string) {
        const { devMode } = get()
        if (!devMode && type !== 'error') {
            set({ status: '', statusType: '' })
            return
        }
        set({ status: message, statusType: type })
        if (type !== 'loading') {
            setTimeout(() => set({ status: '', statusType: '' }), 1000)
        }
    },

    syncMarkdownToEditor(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || !cell._easyMDE) return
        const engine = ConfigManager.getCellEngine(cell, 'main')
        if (engine === 'sql' || engine === 'js') return
        const currentValue = cell._easyMDE.value()
        const targetContent = ConfigManager.getCellEditableContent(cell)
        if (currentValue !== targetContent) cell._easyMDE.value(targetContent)
    },

    getCellIcon(type: string) {
        const { cellTypes } = get()
        const found = cellTypes.find((ct: any) => ct.type === type)
        return found ? found.icon : 'description'
    },

    generateCellId() {
        return 'cell_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },

    generateGroupId() {
        return 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },

    generatePageId() {
        return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },

    isNameUniqueAcrossPages(name: string, type: string, excludePageIndex: number | null = null, excludePath: any = null, excludeCellIndex: number | null = null) {
        const { pages } = get()
        if (!name || !name.trim()) return true
        if (type !== 'source' && type !== 'uiParameter') return true
        const trimmedName = name.trim()
        for (let pi = 0; pi < pages.length; pi++) {
            const page = pages[pi]
            const checkInGroups = (groups: any[], currentPath: number[] = []) => {
                for (let gi = 0; gi < groups.length; gi++) {
                    const group = groups[gi]
                    const groupPath = [...currentPath, gi]
                    for (let ci = 0; ci < (group.cells || []).length; ci++) {
                        const cell = group.cells[ci]
                        if (excludePageIndex === pi && excludePath && JSON.stringify(excludePath) === JSON.stringify(groupPath) && excludeCellIndex === ci) continue
                        if (cell.type === type && cell.name && cell.name.trim() === trimmedName) return false
                    }
                    if (group.children && group.children.length > 0) {
                        if (!checkInGroups(group.children, groupPath)) return false
                    }
                }
                return true
            }
            if (!checkInGroups(page.groups)) return false
            if (page.linkGroups && !checkInGroups(page.linkGroups)) return false
        }
        return true
    },

    getAllNamesOfType(type: string) {
        const { pages } = get()
        const names: string[] = []
        if (type !== 'source' && type !== 'uiParameter') return names
        const collectFromGroups = (groups: any[]) => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    if (cell.type === type && cell.name && cell.name.trim()) names.push(cell.name.trim())
                }
                if (group.children) collectFromGroups(group.children)
            }
        }
        for (const page of pages) {
            collectFromGroups(page.groups)
            if (page.linkGroups) collectFromGroups(page.linkGroups)
        }
        return names
    },

    getCell(groupIndex: number, cellIndex: number) {
        const groups = get().getGroups()
        return groups[groupIndex]?.cells[cellIndex]
    },

    downloadSourceFile(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'source') {
            get().setStatus('Cellule source introuvable', 'error')
            return
        }
        if (!cell._currentFile || !cell._fileName) {
            get().setStatus('Aucun fichier à télécharger', 'error')
            return
        }
        try {
            FileHandler.downloadFile(cell._currentFile, cell._fileName)
            get().setStatus('Fichier téléchargé', 'success')
        } catch (error: any) {
            get().setStatus('Erreur lors du téléchargement: ' + error.message, 'error')
        }
    },
})
