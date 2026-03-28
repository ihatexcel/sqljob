// @ts-nocheck
/**
 * pagesSlice — gestion des pages (onglets) du notebook.
 * Converti de pagesMixin.ts (Alpine this-proxy) vers un slice Zustand pur.
 * Utilise get()/set() directement au lieu du proxy createThisProxy.
 */
import { produce } from 'immer'
import { ConfigManager } from '../../../lib/ConfigManager'
import { useConfirmModal } from '../uiStores'

export const createPagesSlice = (set: any, get: any) => ({

    addPage() {
        const pages = get().pages
        const newPage = {
            _id: ConfigManager.generatePageId(),
            name: `Feuille ${pages.length + 1}`,
            groups: [],
            linkGroups: []
        }
        set(produce((s: any) => {
            s.pages.push(newPage)
            s.activePageIndex = s.pages.length - 1
        }))
    },

    async deletePage(index: number) {
        const { pages, setStatus } = get()
        if (pages.length <= 1) {
            setStatus('Impossible de supprimer la dernière page', 'error')
            return
        }
        if (await useConfirmModal.getState().show(`Supprimer la page "${pages[index].name}" ?`)) {
            set(produce((s: any) => {
                s.pages.splice(index, 1)
                if (s.activePageIndex >= s.pages.length) {
                    s.activePageIndex = s.pages.length - 1
                }
            }))
        }
    },

    startPageDrag(index: number, event: DragEvent) {
        if (!get().devMode) return
        set({ draggedPageIndex: index })
        event.dataTransfer.effectAllowed = 'move'
        event.dataTransfer.setData('text/plain', String(index))
    },

    onPageDragOver(index: number, event: DragEvent) {
        const { draggedPageIndex } = get()
        if (draggedPageIndex === null || draggedPageIndex === index) return
        event.preventDefault()
        set({ dragOverPageIndex: index })
    },

    onPageDragLeave() {
        set({ dragOverPageIndex: null })
    },

    onPageDrop(targetIndex: number, event: DragEvent) {
        event.preventDefault()
        const { draggedPageIndex } = get()
        if (draggedPageIndex === null || draggedPageIndex === targetIndex) {
            set({ draggedPageIndex: null, dragOverPageIndex: null })
            return
        }
        set(produce((s: any) => {
            const [movedPage] = s.pages.splice(draggedPageIndex, 1)
            s.pages.splice(targetIndex, 0, movedPage)
            if (s.activePageIndex === draggedPageIndex) {
                s.activePageIndex = targetIndex
            } else if (draggedPageIndex < s.activePageIndex && targetIndex >= s.activePageIndex) {
                s.activePageIndex--
            } else if (draggedPageIndex > s.activePageIndex && targetIndex <= s.activePageIndex) {
                s.activePageIndex++
            }
            s.draggedPageIndex = null
            s.dragOverPageIndex = null
        }))
        get().saveToLocalStorage?.()
    },

    endPageDrag() {
        set({ draggedPageIndex: null, dragOverPageIndex: null })
    },

    switchPage(index: number) {
        const { pages } = get()
        if (index >= 0 && index < pages.length) {
            set({ activePageIndex: index })
        }
    },

    async activatePage(index: number) {
        const s = get()
        if (index < 0 || index >= s.pages.length) return
        const page = s.pages[index]
        set({ activePageIndex: index })
        if (!s._pagesInitialized.has(page._id)) {
            s._pagesInitialized.add(page._id)
            await get().runAllGroups()
        }
        setTimeout(() => setTimeout(() => get().refreshMarkdownCellsForPage(index), 50), 0)
    },

    refreshMarkdownCellsForPage(pageIndex: number) {
        const { pages } = get()
        const page = pages[pageIndex]
        if (!page) return
        const refreshCells = (groups: any[]) => {
            ;(groups || []).forEach((group: any) => {
                ;(group.cells || []).forEach((cell: any) => {
                    if (cell.type === 'markdown') {
                        const inst = cell._easyMDEcli
                        const cm = inst?.codemirror || inst?.cm
                        if (cm?.refresh) cm.refresh()
                    }
                })
                if (group.children) refreshCells(group.children)
            })
        }
        refreshCells(page.groups || [])
        refreshCells(page.linkGroups || [])
    },

    shouldShowCell(cell: any) {
        const { devMode } = get()
        if (devMode) return true
        if (ConfigManager.getCellQueryShowQueryEditor(cell, 0)) return true
        if (cell.type === 'buttonRunNextCells') return !!cell.buttonLabel
        if (cell.type === 'sql') return ConfigManager.getCellQueryShowResult(cell, 0)
        if (['iframe', 'sqlStat'].includes(cell.type)) {
            return cell._status === 'success' || cell._status === 'running' || (cell._results && cell._results.length > 0)
        }
        return true
    },

    shouldShowGroup(group: any) {
        const { devMode } = get()
        if (devMode) return true
        if (ConfigManager.getGroupIfQuery(group)) {
            if (group._ifQueryResult === false || group._ifQueryResult === null) return false
            if (group._ifQueryResult !== true) return false
        }
        if (group.cells && group.cells.some((cell: any) => get().shouldShowCell(cell))) return true
        if (group.children && group.children.some((child: any) => get().shouldShowGroup(child))) return true
        return false
    },
})
