// @ts-nocheck
import { ConfigManager } from '../../../lib/ConfigManager'
import { CellRenderer } from '../../../lib/CellRenderer'
import { useConfirmModal } from '../uiStores'

export const createGroupsSlice = (set: any, get: any) => ({

    getFlattenedGroups() {
        const result = []
        const groups = get().getGroups()
        if (!groups) return result
        for (let i = 0; i < groups.length; i++) {
            const group = groups[i]
            result.push({
                group,
                path: [i],
                depth: 0,
                pathKey: String(i),
                isFirst: i === 0,
                isLast: i === groups.length - 1,
                siblingCount: groups.length
            })
        }
        return result
    },

    getFlattenedGroupsForAllPages() {
        const result = []
        const pages = get().pages
        for (let pi = 0; pi < (pages || []).length; pi++) {
            const page = pages[pi]
            const groups = page?.groups || []
            for (let i = 0; i < groups.length; i++) {
                const group = groups[i]
                result.push({
                    pageIndex: pi,
                    pageId: page._id,
                    uniqueKey: page._id + '_' + i,
                    group,
                    path: [i],
                    depth: 0,
                    pathKey: String(i),
                    isFirst: i === 0,
                    isLast: i === groups.length - 1,
                    siblingCount: groups.length
                })
            }
        }
        return result
    },

    getGroupItems(group: any) {
        const items = []
        const cells = group.cells || []
        const children = group.children || []
        cells.forEach((cell: any, idx: number) => {
            items.push({ type: 'cell', data: cell, cellIndex: idx, itemKey: 'cell-' + cell._id })
        })
        children.forEach((child: any, idx: number) => {
            items.push({ type: 'group', data: child, childIndex: idx, itemKey: 'group-' + (child._id || idx) })
        })
        return items
    },

    getGroupAtPath(path: any) {
        if (!path || path.length === 0) return null
        const { childGroupModal } = get()
        const groups = get().getGroups()

        if (path.length >= 1 && path[0] === -1) {
            if (path.length === 1) return childGroupModal.group
            let current = childGroupModal.group
            for (let i = 1; i < path.length; i++) {
                if (!current || !current.children) return null
                current = current.children[path[i]]
            }
            return current
        }

        let current = groups[path[0]]
        for (let i = 1; i < path.length; i++) {
            if (!current || !current.children) return null
            current = current.children[path[i]]
        }
        return current
    },

    getParentGroup(path: any) {
        if (!path || path.length <= 1) return null
        return get().getGroupAtPath(path.slice(0, -1))
    },

    getCellAtPath(path: any, cellIndex: number) {
        if (!path || !Array.isArray(path)) return null
        if (path.length === 1 && path[0] === -1) {
            const { childGroupModal } = get()
            if (!childGroupModal.group?.cells) return null
            return childGroupModal.group.cells[cellIndex]
        }
        const group = get().getGroupAtPath(path)
        return group?.cells?.[cellIndex]
    },

    createNewGroup(direction = 'row') {
        return {
            _id: get().generateGroupId(),
            direction,
            style: '',
            cells: [],
            children: [],
            _order: 0,
            loop: { enabled: false, query: '', zip: false, zipQuery: '' },
            accordion: false,
            title: '',
            accordionOpen: true
        }
    },

    addNestedGroup(path: any) {
        const group = get().getGroupAtPath(path)
        if (!group) return
        if (!group.children) group.children = []
        const newChild = get().createNewGroup('row')
        newChild._order = get().getNextOrder(group)
        const firstCell = get().createNewCell('markdown')
        firstCell._order = 0
        newChild.cells = [firstCell]
        group.children.push(newChild)
        get().setStatus('Sous-groupe ajouté', 'success')
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    toggleGroupDirection(path: any) {
        const group = get().getGroupAtPath(path)
        if (group) {
            group.direction = group.direction === 'column' ? 'row' : 'column'
        }
    },

    openLoopConfigModal(path: any) {
        const group = get().getGroupAtPath(path)
        if (group) {
            if (!group.loop) {
                group.loop = { enabled: false, query: '', zip: false, zipQuery: '' }
            } else if (group.loop.zip === undefined) {
                group.loop.zip = false
                group.loop.zipQuery = group.loop.zipQuery || ''
            }
            set({ loopConfigModal: { open: true, path } })
        }
    },

    openGroupSettingsModal(path: any) {
        const group = get().getGroupAtPath(path)
        if (group) {
            ConfigManager.ensureGroupQueries(group)
            set({ groupSettingsModal: { open: true, path } })
        }
    },

    async testGroupIfQuery(path: any) {
        const group = get().getGroupAtPath(path)
        if (!group || !ConfigManager.getGroupIfQuery(group)) return
        try {
            const result = await get().evaluateGroupIfQuery(group)
            get().setStatus(
                `ifQuery: ${result === true ? 'true → groupe affiché' : (result === false ? 'false' : 'null') + ' → groupe masqué'}`,
                result ? 'success' : 'info'
            )
        } catch (err: any) {
            get().setStatus('Erreur ifQuery: ' + err.message, 'error')
        }
    },

    toggleAccordion(path: any) {
        const group = get().getGroupAtPath(path)
        if (group) group.accordionOpen = !group.accordionOpen
    },

    getDefaultLoopQuery() {
        return `SELECT DISTINCT {{ SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'source1'
   ORDER BY ordinal_position
   LIMIT 1}}
FROM source1 LIMIT 10;`
    },

    getDefaultZipQuery() {
        return `SELECT 'export_' || current_timestamp::text || '.zip' as filename;`
    },

    async deleteGroupAtPath(path: any) {
        if (!path || path.length === 0) return
        if (!await useConfirmModal.getState().show('Supprimer ce groupe et tout son contenu ?')) return

        if (path.length === 1) {
            get().getGroups().splice(path[0], 1)
        } else {
            const parentPath = path.slice(0, -1)
            const childIndex = path[path.length - 1]
            const parent = get().getGroupAtPath(parentPath)
            if (parent && parent.children) parent.children.splice(childIndex, 1)
        }
        get().setStatus('Groupe supprimé', 'success')
        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    getLinkGroupById(groupId: string) {
        return get().getLinkGroups().find((g: any) => g._id === groupId)
    },

    async openChildGroupModal(path: any, cellIndex: number) {
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell) return

        let childGroup = null
        if (cell.childGroupId) childGroup = get().getLinkGroupById(cell.childGroupId)

        if (!childGroup) {
            childGroup = get().createNewGroup('row')
            childGroup._type = 'link'
            const firstCell = get().createNewCell('markdown')
            firstCell._order = 0
            childGroup.cells = [firstCell]
            get().getLinkGroups().push(childGroup)
            cell.childGroupId = childGroup._id
        }

        set({ childGroupModal: { open: true, path, cellIndex, group: childGroup } })
        await get().runGroupAtPath([-1])
    },

    closeChildGroupModal() {
        set({ childGroupModal: { open: false, path: null, cellIndex: null, group: null } })
    },

    async deleteChildGroupModal() {
        const { childGroupModal } = get()
        if (!childGroupModal.group) return
        if (!await useConfirmModal.getState().show('Supprimer ce groupe enfant ?')) return

        const groupId = childGroupModal.group._id
        const linkGroups = get().getLinkGroups()
        const linkIndex = linkGroups.findIndex((g: any) => g._id === groupId)
        if (linkIndex !== -1) linkGroups.splice(linkIndex, 1)

        if (childGroupModal.path && childGroupModal.cellIndex !== null) {
            const cell = get().getCellAtPath(childGroupModal.path, childGroupModal.cellIndex)
            if (cell && cell.childGroupId === groupId) delete cell.childGroupId
        }
        get().closeChildGroupModal()
    },

    moveGroupAtPath(path: any, direction: number) {
        if (!path || path.length === 0) return
        if (path.length === 1) {
            const index = path[0]
            const newIndex = index + direction
            const groups = get().getGroups()
            if (newIndex >= 0 && newIndex < groups.length) {
                const temp = groups[index]
                groups[index] = groups[newIndex]
                groups[newIndex] = temp
            }
        } else {
            const parentPath = path.slice(0, -1)
            const childIndex = path[path.length - 1]
            const parent = get().getGroupAtPath(parentPath)
            if (parent && parent.children) {
                const newIndex = childIndex + direction
                if (newIndex >= 0 && newIndex < parent.children.length) {
                    const temp = parent.children[childIndex]
                    parent.children[childIndex] = parent.children[newIndex]
                    parent.children[newIndex] = temp
                }
            }
        }
    },

    moveCellInGroupAtPath(path: any, cellIndex: number, direction: number) {
        const group = get().getGroupAtPath(path)
        if (!group || !group.cells) return
        const newIndex = cellIndex + direction
        if (newIndex >= 0 && newIndex < group.cells.length) {
            const temp = group.cells[cellIndex]
            group.cells[cellIndex] = group.cells[newIndex]
            group.cells[newIndex] = temp
        }
    },

    getGroupElementId(path: any) {
        return 'group-' + path.join('-')
    },

    openAddGroupModal() {
        set({ showAddGroupModal: true })
    },

    getNextOrder(group: any) {
        if (!group) return 0
        const cells = group.cells || []
        const children = group.children || []
        const allOrders = [
            ...cells.map((c: any) => c._order ?? 0),
            ...children.map((c: any) => c._order ?? 0)
        ]
        return allOrders.length > 0 ? Math.max(...allOrders) + 1 : 0
    },

    getSortedCells(group: any) {
        if (!group || !group.cells) return []
        return group.cells
            .map((cell: any, originalIndex: number) => ({ cell, originalIndex }))
            .sort((a: any, b: any) => (a.cell._order ?? 0) - (b.cell._order ?? 0))
    },

    getSortedChildren(group: any) {
        if (!group || !group.children) return []
        return group.children
            .map((child: any, originalIndex: number) => ({ child, originalIndex }))
            .sort((a: any, b: any) => (a.child._order ?? 0) - (b.child._order ?? 0))
    },

    getAllItemsSorted(group: any) {
        if (!group) return []
        const cells = (group.cells || []).map((c: any, i: number) => ({
            type: 'cell', item: c, originalIndex: i, order: c._order ?? 0
        }))
        const children = (group.children || []).map((c: any, i: number) => ({
            type: 'child', item: c, originalIndex: i, order: c._order ?? 0
        }))
        return [...cells, ...children].sort((a: any, b: any) => a.order - b.order)
    },

    getTabName(tabItem: any, tabIdx: number) {
        if (tabItem.type === 'cell') {
            const cell = tabItem.item
            return cell.name || ConfigManager.getCellReferenceName(cell) || cell.title || `Cellule ${tabIdx + 1}`
        }
        const child = tabItem.item
        return child.name || child.title || `Groupe ${tabIdx + 1}`
    },

    moveItemInGroup(path: any, itemType: string, originalIndex: number, direction: number) {
        const activePage = get().getActivePage()
        const group = (!path || path.length === 0)
            ? { children: activePage?.groups || [] }
            : get().getGroupAtPath(path)
        if (!group) return

        const allItems = get().getAllItemsSorted(group)
        if (allItems.length < 2) return

        allItems.forEach((item: any, idx: number) => { item.item._order = idx })

        const currentSortedIndex = allItems.findIndex(
            (item: any) => item.type === itemType && item.originalIndex === originalIndex
        )
        if (currentSortedIndex === -1) return

        const newSortedIndex = currentSortedIndex + direction
        if (newSortedIndex < 0 || newSortedIndex >= allItems.length) return

        const currentItem = allItems[currentSortedIndex]
        const targetItem = allItems[newSortedIndex]
        const tempOrder = currentItem.item._order
        currentItem.item._order = targetItem.item._order
        targetItem.item._order = tempOrder

        set((s: any) => ({ _rev: s._rev + 1 }))
    },

    isFirstInGroup(group: any, itemType: string, originalIndex: number) {
        const allItems = get().getAllItemsSorted(group)
        if (allItems.length === 0) return true
        const first = allItems[0]
        return first.type === itemType && first.originalIndex === originalIndex
    },

    isLastInGroup(group: any, itemType: string, originalIndex: number) {
        const allItems = get().getAllItemsSorted(group)
        if (allItems.length === 0) return true
        const last = allItems[allItems.length - 1]
        return last.type === itemType && last.originalIndex === originalIndex
    },

    getSortedIndex(group: any, itemType: string, originalIndex: number) {
        const allItems = get().getAllItemsSorted(group)
        return allItems.findIndex(
            (item: any) => item.type === itemType && item.originalIndex === originalIndex
        )
    },

    renderChildGroupHTML(childGroup: any, childPath: any, parentGroup: any, originalIndex: number) {
        const pathJSON = JSON.stringify(childPath)
        const parentPathJSON = JSON.stringify(childPath.slice(0, -1))

        const header = `
            <div class="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300" x-show="devMode">
                <div class="join">
                    <button class="btn btn-xs join-item" @click="toggleGroupDirection(${pathJSON})" :title="getGroupAtPath(${pathJSON})?.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'">
                        <span class="iconify" :data-icon="getGroupAtPath(${pathJSON})?.direction === 'column' ? 'material-symbols-light:swap-vert' : 'material-symbols-light:swap-horiz'" style="font-size:1rem"></span>
                    </button>
                    <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.loop?.enabled ? 'btn-info' : ''" @click="openLoopConfigModal(${pathJSON})" title="Configurer la boucle"><span class="iconify" data-icon="material-symbols-light:autorenew" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.accordion ? 'btn-accent' : ''" @click="openGroupSettingsModal(${pathJSON})" title="Paramètres du groupe"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs btn-success join-item" @click="runGroupAtPath(${pathJSON})" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, -1)" :disabled="isFirstInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Monter"><span class="iconify" data-icon="material-symbols-light:arrow-upward" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, 1)" :disabled="isLastInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Descendre"><span class="iconify" data-icon="material-symbols-light:arrow-downward" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs join-item" @click="addNestedGroup(${pathJSON})" title="Ajouter un sous-groupe"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs join-item" @click="openAddCellToGroupModal(${pathJSON})" title="Ajouter une cellule"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span></button>
                    <button class="btn btn-xs btn-error join-item" @click="deleteGroupAtPath(${pathJSON})" title="Supprimer"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                </div>
            </div>`

        const accordionBand = `
            <div x-show="getGroupAtPath(${pathJSON})?.accordion"
                 @click="toggleAccordion(${pathJSON})"
                 class="flex items-center gap-2 py-2 px-4 bg-base-200 border-b border-base-300 cursor-pointer select-none hover:bg-base-300 transition-colors duration-200">
                <span class="text-sm transition-transform duration-200" :class="getGroupAtPath(${pathJSON})?.accordionOpen ? 'rotate-90' : ''">▶</span>
                <span class="font-semibold text-sm" x-text="getGroupAtPath(${pathJSON})?.title || ''"></span>
            </div>`

        const content = `
            <div class="p-2" x-show="!getGroupAtPath(${pathJSON})?.accordion || getGroupAtPath(${pathJSON})?.accordionOpen" x-collapse
                 x-data="{ _activeTabKey: null }"
                 x-init="if (getGroupAtPath(${pathJSON})?.tabsChild) { const items = getAllItemsSorted(getGroupAtPath(${pathJSON})); if (items.length > 0) _activeTabKey = (items[0].type === 'cell' ? 'c-' : 'g-') + items[0].originalIndex; }">
                <div x-show="!devMode && getGroupAtPath(${pathJSON})?.tabsChild" role="tablist" class="tabs tabs-box mb-2">
                    <template x-for="(tabItem, tabIdx) in getAllItemsSorted(getGroupAtPath(${pathJSON}))" :key="'tab-' + (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex">
                        <a role="tab" class="tab"
                           :class="{ 'tab-active': _activeTabKey === ((tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex) }"
                           @click="_activeTabKey = (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex"
                           x-text="getTabName(tabItem, tabIdx)"></a>
                    </template>
                </div>
                <div class="flex gap-2" :class="(!devMode && getGroupAtPath(${pathJSON})?.tabsChild) ? 'flex-col' : ((getGroupAtPath(${pathJSON})?.direction || 'row') === 'row' ? 'flex-row flex-wrap' : 'flex-col')">
                    <template x-for="cellItem in getSortedCells(getGroupAtPath(${pathJSON}))" :key="cellItem.cell._id">
                        <div class="flex flex-1 min-w-0"
                            :class="(getGroupAtPath(${pathJSON})?.direction || 'row') === 'column' ? 'flex-col w-full' : ''"
                            style="display: contents;">
                            <div class="bg-base-100 rounded-lg overflow-hidden transition-[border-color,box-shadow] duration-200 flex-1 cell-container"
                                 x-show="shouldShowCell(cellItem.cell) && (devMode || !getGroupAtPath(${pathJSON})?.tabsChild || _activeTabKey === ('c-' + cellItem.originalIndex))"
                                 :class="[getCellSizeInnerClass(), cellItem.cell.border !== false ? 'border border-base-300 shadow-sm hover:border-primary hover:shadow-lg' : 'border-0 shadow-none', {
                                     'border-warning shadow-[0_0_10px_rgba(251,191,36,0.3)]': cellItem.cell.border !== false && cellItem.cell._status === 'running',
                                     'border-success': cellItem.cell.border !== false && cellItem.cell._status === 'success',
                                     'border-error': cellItem.cell.border !== false && cellItem.cell._status === 'error'
                                 }]"
                                 :style="getCellWrapperStyle(cellItem.cell, (getGroupAtPath(${pathJSON})?.direction || 'row') === 'column', cellItem.cell._order ?? 0)">
                                ${CellRenderer.renderCell(pathJSON, 'cellItem.originalIndex', `getGroupAtPath(${pathJSON})`)}
                            </div>
                        </div>
                    </template>

                    <template x-for="subChild in getSortedChildren(getGroupAtPath(${pathJSON}))" :key="subChild.child._id || ('child-' + subChild.originalIndex)">
                        <div class="flex-1 bg-base-100 border border-base-300 rounded-lg overflow-hidden transition-all duration-200 shadow-sm hover:border-primary hover:shadow-md"
                             x-show="shouldShowGroup(subChild.child) && (devMode || !getGroupAtPath(${pathJSON})?.tabsChild || _activeTabKey === ('g-' + subChild.originalIndex))"
                             :style="'order: ' + (subChild.child._order ?? 0)"
                             x-data="{ _subPath: [...${pathJSON}, subChild.originalIndex] }"
                             x-html="renderChildGroupHTML(subChild.child, _subPath, getGroupAtPath(${pathJSON}), subChild.originalIndex)"
                             x-effect="$nextTick(() => Alpine.initTree($el))">
                        </div>
                    </template>
                </div>
            </div>`

        return header + accordionBand + content
    },
})
