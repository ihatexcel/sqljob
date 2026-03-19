// @ts-nocheck
import { rawTableDataStore as _rawTableDataStore } from '../../../lib/tableDataStore'
import { ConfigManager } from '../../../lib/ConfigManager'
import { CellConfigService, initializeCell } from '../../../lib/CellConfigService'
import { CELL_TYPE_SCHEMAS } from '../../../lib/cellTypeSchemas'
import { useConfirmModal } from '../uiStores'
import { createDefaultSqlBlockConfig } from '../../../lib/SqlBlockTypes'

export const createCellsSlice = (set: any, get: any) => ({

    hasCellMinSize(cell: any) {
        const v = (x: any) => (x !== undefined && x !== null && String(x).trim() !== '')
        return cell && (v(cell.minSizePx) || v(cell.minSizePercent))
    },

    hasCellMaxSize(cell: any) {
        const v = (x: any) => (x !== undefined && x !== null && String(x).trim() !== '')
        return cell && (v(cell.maxSizePx) || v(cell.maxSizePercent))
    },

    hasCellHeight(cell: any) {
        const v = (x: any) => (x !== undefined && x !== null && String(x).trim() !== '')
        return cell && (v(cell.minHeightPx) || v(cell.minHeightPercent) || v(cell.maxHeightPx) || v(cell.maxHeightPercent))
    },

    isSqlCellWithEditor(type: string) {
        return ['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective', 'pdfme', 'publipostageWord', 'echart'].includes(type)
    },

    bodyDisplayShouldShowSkeleton(cell: any) {
        if (!cell) return false
        if (cell.type === 'markdown' && ConfigManager.getCellEngine(cell, 'main') === 'text') return false
        const schema = CELL_TYPE_SCHEMAS.types[cell.type]
        const disp = schema?.bodyDisplay?.showSkeleton ?? { when: 'running', excludeTypes: ['uiParameter'] }
        if (disp.when === 'never') return false
        if (disp.excludeTypes?.includes(cell.type)) return false
        if (disp.excludeWhenSqlEditor && get().isSqlCellWithEditor(cell.type) && get().showSqlEditorVisible(cell)) return false
        if (cell._status === 'running') return true
        if (disp.sourceLoading && cell.type === 'source' && cell._fileName && !cell._loaded) return true
        return false
    },

    bodyDisplayShouldShowContent(cell: any) {
        if (!cell) return false
        return !get().bodyDisplayShouldShowSkeleton(cell)
    },

    getCellHeightVars(cell: any) {
        if (!cell) return ''
        const toPx = (v: any) => {
            if (v == null || String(v).trim() === '') return ''
            const s = String(v).trim()
            return /^\d+(\.\d+)?$/.test(s) ? s + 'px' : s
        }
        const toPct = (v: any) => {
            if (v == null || String(v).trim() === '') return ''
            const s = String(v).trim()
            return /^\d+(\.\d+)?$/.test(s) ? s + '%' : s
        }
        const parts: string[] = []
        const mhp = toPx(cell.minHeightPx); const mhc = toPct(cell.minHeightPercent)
        if (mhp) parts.push(`--cell-min-h-px:${mhp}`)
        if (mhc) parts.push(`--cell-min-h-pct:${mhc}`)
        const mxp = toPx(cell.maxHeightPx); const mxc = toPct(cell.maxHeightPercent)
        if (mxp) parts.push(`--cell-max-h-px:${mxp}`)
        if (mxc) parts.push(`--cell-max-h-pct:${mxc}`)
        return parts.length ? parts.join(';') : ''
    },

    getCellSizeOuterClass(cell: any, isColumn: boolean) {
        if (isColumn) return 'flex-col w-full'
        return get().hasCellMinSize(cell) ? '' : 'min-w-[200px]'
    },

    getCellWrapperStyle(cell: any, isColumn: boolean, order: number) {
        const s: any = { order: order ?? 0 }
        const toPx = (v: any) => {
            if (v === undefined || v === null) return null
            const str = String(v).trim()
            if (str === '') return null
            return /^\d+(\.\d+)?$/.test(str) ? str + 'px' : str
        }
        const toPct = (v: any) => {
            if (v === undefined || v === null) return null
            const str = String(v).trim()
            if (str === '') return null
            return /^\d+(\.\d+)?$/.test(str) ? str + '%' : str
        }
        if (!isColumn) {
            const minPx = toPx(cell?.minSizePx) ?? toPx(cell?.minSize)
            const minPct = toPct(cell?.minSizePercent)
            if (minPx && minPct) s.minWidth = `max(${minPx}, ${minPct})`
            else if (minPx) s.minWidth = minPx
            else if (minPct) s.minWidth = minPct
            const maxPx = toPx(cell?.maxSizePx) ?? toPx(cell?.maxSize)
            const maxPct = toPct(cell?.maxSizePercent)
            if (maxPx && maxPct) s.maxWidth = `min(${maxPx}, ${maxPct})`
            else if (maxPx) s.maxWidth = maxPx
            else if (maxPct) s.maxWidth = maxPct
        }
        return s
    },

    getCellSizeInnerClass() {
        return 'w-full'
    },

    createNewCell(type: string) {
        const newCell: any = {
            _id: get().generateCellId(),
            _status: null,
            _results: null,
            _resultInfo: null,
            _order: 0,
            type
        }
        const baseName = get().generateUniqueCellName(type)
        newCell.name = baseName
        CellConfigService.ensureCellFromSchema(newCell, type, { baseName })
        if (type === 'source') {
            newCell._fileName = ''
            newCell._currentFile = null
            newCell._isDragging = false
            newCell._loaded = false
        }
        if (type === 'uiParameter') {
            newCell._value = ''
            newCell._options = []
            newCell._initialized = false
            newCell._userModified = false
        }
        if (type === 'publipostageWord') {
            newCell.docxTemplateBase64 = null
            newCell.docxTemplateFileName = ''
            newCell._isDragging = false
        }
        if (type === 'pdfme') {
            if (!newCell.json || typeof newCell.json !== 'string' || newCell.json.length < 50) {
                newCell.json = JSON.stringify({
                    basePdf: { width: 210, height: 297, padding: [20, 20, 9, 20], staticSchema: [
                        { name: 'page_header', type: 'text', position: { x: 20, y: 5 }, width: 170, height: 8, content: '{date}', fontSize: 9, fontColor: '#888888', alignment: 'right', readOnly: true },
                        { name: 'footer', type: 'text', position: { x: 20, y: 288 }, width: 170, height: 10, content: 'PIED DE PAGE - Page {currentPage} / {totalPages}', fontSize: 10, fontColor: '#888888', alignment: 'center', readOnly: true }
                    ]},
                    schemas: [[
                        { name: 'header', type: 'text', position: { x: 20, y: 20 }, width: 170, height: 10, content: 'ENTÊTE DU DOCUMENT', fontSize: 16, fontColor: '#6366f1', alignment: 'center' },
                        { name: 'datatable', type: 'table', position: { x: 20, y: 35 }, width: 170, height: 50, content: '[[\"A\",\"B\",\"C\"]]', showHead: true, repeatHead: true, head: ['Col1', 'Col2', 'Col3'], headWidthPercentages: [33, 33, 34], tableStyles: { borderWidth: 0.3, borderColor: '#000000' }, headStyles: { fontSize: 10, fontColor: '#ffffff', backgroundColor: '#6366f1' }, bodyStyles: { fontSize: 9, fontColor: '#333333', alternateBackgroundColor: '#f5f5f5' }, columnStyles: {} }
                    ]]
                }, null, 2)
            }
        }
        if (type === 'perspective') {
            newCell._perspectiveReady = false
            newCell._perspectiveWorker = null
            newCell._perspectiveTable = null
        }
        if (type === 'sqlBlock') {
            newCell.sqlBlockConfig = createDefaultSqlBlockConfig()
        }
        return newCell
    },

    addGroup(cellType: string) {
        const newGroup = get().createNewGroup('row')
        newGroup.cells = [get().createNewCell(cellType)]
        get().getGroups().push(newGroup)
        set({ showAddGroupModal: false })
    },

    addCellToGroup(pathOrIndex: any, cellType: string) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const group = get().getGroupAtPath(path)
        if (group) {
            if (!group.cells) group.cells = []
            const newCell = get().createNewCell(cellType)
            newCell._order = get().getNextOrder(group)
            group.cells.push(newCell)
        }
        set({ addCellToGroupModal: { open: false, path: null } })
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    openAddCellToGroupModal(pathOrIndex: any) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        set({ addCellToGroupModal: { open: true, path } })
    },

    openInsertGroupModal(atIndex: number) {
        set({ insertGroupModal: { open: true, atIndex } })
    },

    insertGroupAt(atIndex: number, cellType: string) {
        const newGroup = get().createNewGroup('row')
        newGroup.cells = [get().createNewCell(cellType)]
        get().getGroups().splice(atIndex, 0, newGroup)
        set({ insertGroupModal: { open: false, atIndex: null } })
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    openInsertCellModal(pathOrIndex: any, atCellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        set({ insertCellModal: { open: true, path, atCellIndex } })
    },

    insertCellAt(pathOrIndex: any, atCellIndex: number, cellType: string) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const group = get().getGroupAtPath(path)
        if (group) {
            if (!group.cells) group.cells = []
            const newCell = get().createNewCell(cellType)
            newCell._order = get().getNextOrder(group)
            group.cells.splice(atCellIndex, 0, newCell)
        }
        set({ insertCellModal: { open: false, path: null, atCellIndex: null } })
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    deleteGroup(pathOrIndex: any) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        get().deleteGroupAtPath(path)
    },

    moveGroup(pathOrIndex: any, direction: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        get().moveGroupAtPath(path, direction)
    },

    async deleteCellAt(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const group = get().getGroupAtPath(path)
        if (!group || !group.cells) return

        const hasChildren = group.children && group.children.length > 0

        if (group.cells.length === 1 && !hasChildren) {
            await get().deleteGroupAtPath(path)
        } else {
            if (await useConfirmModal.getState().show('Supprimer cette cellule ?')) {
                const cell = group.cells[cellIndex]
                await get().cleanupSourceCell(cell)
                _rawTableDataStore.delete(cell._id)
                const { _tables } = get()
                if (_tables && _tables[cell._id]) {
                    _tables[cell._id].destroy()
                    delete _tables[cell._id]
                }
                group.cells.splice(cellIndex, 1)
                if (cell.type === 'source') await get().refreshDuckdbTables()
                set((s: any) => ({ _rev: s._rev + 1 }))
            }
        }
    },

    moveCellInGroup(pathOrIndex: any, cellIndex: number, direction: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        get().moveCellInGroupAtPath(path, cellIndex, direction)
    },

    ensureCellName(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || !cell.type) return
        if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
            cell.name = String(cell.referenceName).trim()
        }
        const n = cell.name != null ? String(cell.name).trim() : ''
        if (!n) cell.name = get().generateUniqueCellName(cell.type, cell._id)
    },

    ensureAllCellsHaveNames() {
        const visit = (groups: any[], pathPrefix: number[]) => {
            for (let gi = 0; gi < (groups || []).length; gi++) {
                const group = groups[gi]
                const groupPath = [...pathPrefix, gi]
                for (let ci = 0; ci < (group.cells || []).length; ci++) {
                    const cell = group.cells[ci]
                    if (!cell || !cell.type) continue
                    if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                        cell.name = String(cell.referenceName).trim()
                    }
                    if (!cell.name || !String(cell.name).trim()) {
                        cell.name = get().generateUniqueCellName(cell.type, cell._id)
                    }
                }
                if (group.children) visit(group.children, groupPath)
            }
        }
        const pages = get().pages
        for (let pi = 0; pi < pages.length; pi++) {
            visit(pages[pi].groups || [], [pi])
            if (pages[pi].linkGroups) visit(pages[pi].linkGroups, [-1, pi])
        }
    },

    openCellConfig(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        get().ensureCellName(path, cellIndex)
        set({ cellConfigModal: { open: true, path, cellIndex } })
        setTimeout(() => {
            const modal = document.querySelector('[aria-labelledby="modal-cell-config-title"]')
            const cell = get().getCellAtPath(path, cellIndex)
            if (!modal || !cell) return
            const selects = modal.querySelectorAll('select')
            if (selects[0]) selects[0].value = cell.type
            if (['markdown', 'iframe', 'uiParameter'].includes(cell.type) && selects[1]) {
                const engine = ConfigManager.getCellEngine(cell, 'main')
                if (engine && selects[1].value !== engine) selects[1].value = engine
            }
        }, 50)
    },

    getCommonParamsForType(type: string) { return CellConfigService.getCommonParamsForType(type) },
    getCommonParamsExcludingName(type: string) { return (CellConfigService.getCommonParamsForType(type) ?? []).filter((p: any) => p !== 'name') },
    getCommonParamDef(paramKey: string, type: string) { return CellConfigService.getCommonParamDef(paramKey, type) },
    getSpecificParamsForType(type: string) { return CellConfigService.getSpecificParamsForType(type) },
    isSpecificParamVisible(param: any, cell: any) { return CellConfigService.isSpecificParamVisible(param, cell) },
    getQueryLabelForType(type: string, indexOrName: any) {
        const schema = CELL_TYPE_SCHEMAS.types[type]
        const name = typeof indexOrName === 'string' ? indexOrName : schema?.queryNames?.[indexOrName]
        return schema?.queryLabels?.[name] || schema?.queryLabels?.[indexOrName] || CELL_TYPE_SCHEMAS.common.queries?.label || 'Requête SQL'
    },
    getQueryCountForType(type: string) { return CELL_TYPE_SCHEMAS.types[type]?.queryCount ?? 1 },
    getCellValueByPath(cell: any, path: string) { return CellConfigService.getCellValueByPath(cell, path) },
    setCellValueByPath(cell: any, path: string, value: any) { CellConfigService.setCellValueByPath(cell, path, value) },

    onCellTypeChange(pathOrIndex: any, cellIndex: number, oldType: string) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell) return

        _rawTableDataStore.delete(cell._id)
        cell._results = null
        cell._resultInfo = null

        const newType = cell.type
        const baseName = cell.name && String(cell.name).trim() ? cell.name : get().generateUniqueCellName(newType)
        if (!cell.name || !String(cell.name).trim()) cell.name = baseName

        CellConfigService.applyDefaultsOnTypeChange(cell, newType, { oldType, baseName })

        if (cell.type === 'source') {
            if (!cell.name) cell.name = get().generateUniqueSourceName()
            else if (!ConfigManager.getCellQuery(cell, 'main')?.trim()) ConfigManager.setCellQuery(cell, 'main', `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM '{{fileName}}'`)
            if (!ConfigManager.getCellQuery(cell, 'fallback')?.trim()) ConfigManager.setCellQuery(cell, 'fallback', (CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.find((q: any) => q.name === 'fallback')?.sql || CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.[1]?.sql || `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM '{{fileName}}'`))
            if (cell._fileName === undefined) cell._fileName = ''
            if (cell._currentFile === undefined) cell._currentFile = null
            if (cell._isDragging === undefined) cell._isDragging = false
            if (cell._loaded === undefined) cell._loaded = false
        }
        if (cell.type === 'uiParameter') {
            if (cell.referenceName && (!cell.name || !String(cell.name).trim())) cell.name = String(cell.referenceName).trim()
            if (!ConfigManager.getCellReferenceName(cell)) cell.name = get().generateUniqueCellName('uiParameter', cell._id)
            if (cell._value === undefined) cell._value = ''
            if (!cell._options) cell._options = []
            cell._initialized = false
            cell._userModified = false
        }
        if (cell.type === 'publipostageWord') {
            if (cell.docxTemplateBase64 === undefined) cell.docxTemplateBase64 = null
            if (cell.docxTemplateFileName === undefined) cell.docxTemplateFileName = ''
            if (cell._isDragging === undefined) cell._isDragging = false
        }
        if (cell.type === 'perspective') {
            cell._perspectiveReady = false
            cell._perspectiveWorker = null
            cell._perspectiveTable = null
        }
    },

    generateUniqueCellName(type: string, excludeId: string | null = null) {
        const existingNames = new Set<string>()
        const collectNames = (groups: any[]) => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    if (cell.name && String(cell.name).trim() && cell._id !== excludeId) {
                        existingNames.add(String(cell.name).trim())
                    }
                }
                if (group.children) collectNames(group.children)
            }
        }
        for (const page of get().pages) {
            collectNames(page.groups || [])
            if (page.linkGroups) collectNames(page.linkGroups)
        }
        const prefix = CELL_TYPE_SCHEMAS?.types[type]?.defaultNamePrefix ?? 'cell'
        let num = 1
        while (existingNames.has(prefix + num)) num++
        return prefix + num
    },

    isCellNameUsed(name: string, excludeId: string | null = null) {
        const trimmed = name && String(name).trim()
        if (!trimmed) return false
        const collectFromGroups = (groups: any[]): boolean => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    if (cell._id !== excludeId && cell.name && String(cell.name).trim() === trimmed) return true
                }
                if (group.children && collectFromGroups(group.children)) return true
            }
            return false
        }
        for (const page of get().pages) {
            if (collectFromGroups(page.groups || [])) return true
            if (page.linkGroups && collectFromGroups(page.linkGroups)) return true
        }
        return false
    },

    generateUniqueSourceName() {
        return get().generateUniqueCellName('source')
    },

    validateCellName(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell) return
        let currentName = cell.name != null ? String(cell.name).trim() : ''
        if (!currentName) {
            get().setStatus('Le nom ne peut pas être vide', 'error')
            cell.name = get().generateUniqueCellName(cell.type, cell._id)
            return
        }
        if (!ConfigManager.isCellNameValid(cell, currentName)) {
            get().setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error')
            cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1')
            return
        }
        if (get().isCellNameUsed(currentName, cell._id)) {
            get().setStatus(`Le nom "${currentName}" est déjà utilisé par une autre cellule`, 'error')
            cell.name = get().generateUniqueCellName(cell.type, cell._id)
        }
    },

    validateSingleSourceName(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell || cell.type !== 'source') return
        const currentName = cell.name?.trim()
        if (!currentName) {
            get().setStatus('Le nom de la source ne peut pas être vide', 'error')
            cell.name = get().generateUniqueSourceName()
            return
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentName)) {
            get().setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error')
            cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1')
            return
        }
        if (!get().isNameUniqueAcrossPages(currentName, 'source', get().activePageIndex, path, cellIndex)) {
            get().setStatus(`Le nom de source "${currentName}" est déjà utilisé dans une autre page`, 'error')
            cell.name = get().generateUniqueSourceName()
        }
    },
})
