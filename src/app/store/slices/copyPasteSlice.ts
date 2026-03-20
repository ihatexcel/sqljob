// @ts-nocheck

export const createCopyPasteSlice = (set: any, get: any) => ({

    /** Item courant dans le presse-papier interne (cell ou groupe) */
    _clipboardItem: null as { type: 'sqljob-cell' | 'sqljob-group'; data: any } | null,

    /** Indique si un item est disponible pour coller */
    hasClipboardItem() {
        return get()._clipboardItem !== null
    },

    /**
     * Sérialisation safe : ignore les nœuds DOM, les fonctions et les références circulaires.
     * Nécessaire car les cells peuvent contenir des refs d'éditeur (CodeMirror, Monaco…)
     * avec des back-pointers React (__reactFiber$…).
     */
    _safeSerialize(obj: any): any {
        const seen = new WeakSet()
        const replacer = (_key: string, value: any) => {
            if (typeof value === 'function') return undefined
            if (value !== null && typeof value === 'object') {
                // Nœuds DOM / EventTarget
                if (typeof Node !== 'undefined' && value instanceof Node) return undefined
                if (typeof EventTarget !== 'undefined' && value instanceof EventTarget
                    && !(value instanceof Window)) return undefined
                // Référence circulaire
                if (seen.has(value)) return undefined
                seen.add(value)
            }
            return value
        }
        const json = JSON.stringify(obj, replacer)
        return json !== undefined ? JSON.parse(json) : null
    },

    /** Clone une cell en supprimant les props runtime */
    _cloneCellForCopy(cell: any) {
        const clone = get()._safeSerialize(cell)
        if (!clone) return {}
        // Props runtime à supprimer
        delete clone._id
        delete clone._status
        delete clone._results
        delete clone._resultInfo
        // source
        delete clone._loaded
        delete clone._currentFile
        delete clone._isDragging
        // uiParameter
        delete clone._value
        delete clone._options
        delete clone._initialized
        delete clone._userModified
        // perspective
        delete clone._perspectiveReady
        delete clone._perspectiveWorker
        delete clone._perspectiveTable
        return clone
    },

    /** Clone un groupe en supprimant les props runtime (récursif) */
    _cloneGroupForCopy(group: any) {
        const clone = get()._safeSerialize(group)
        if (!clone) return {}
        delete clone._id
        clone.cells = (clone.cells || []).map((c: any) => get()._cloneCellForCopy(c))
        clone.children = (clone.children || []).map((child: any) => get()._cloneGroupForCopy(child))
        return clone
    },

    /** Collecte tous les noms de cellules utilisés dans toutes les pages */
    _collectUsedCellNames(): Set<string> {
        const names = new Set<string>()
        const visit = (groups: any[]) => {
            for (const g of groups) {
                for (const c of (g.cells || [])) {
                    if (c.name) names.add(String(c.name).trim())
                }
                if (g.children) visit(g.children)
            }
        }
        for (const page of get().pages) {
            visit(page.groups || [])
            if (page.linkGroups) visit(page.linkGroups)
        }
        return names
    },

    /** Trouve un nom unique en incrémentant _1, _2, ... */
    _makeUniqueName(baseName: string, usedNames: Set<string>): string {
        if (!usedNames.has(baseName)) return baseName
        let i = 1
        while (usedNames.has(baseName + '_' + i)) i++
        return baseName + '_' + i
    },

    /** Fixe les IDs et noms de cellules d'un groupe cloné pour le collage (récursif) */
    _prepareGroupForPaste(group: any, usedNames: Set<string>) {
        group._id = get().generateGroupId()
        for (const cell of (group.cells || [])) {
            cell._id = get().generateCellId()
            cell._status = null
            cell._results = null
            cell._resultInfo = null
            if (cell.name) {
                const uniqueName = get()._makeUniqueName(cell.name, usedNames)
                cell.name = uniqueName
                usedNames.add(uniqueName)
            }
        }
        for (const child of (group.children || [])) {
            get()._prepareGroupForPaste(child, usedNames)
        }
    },

    /** Copie une cellule dans le presse-papier */
    copyCellAt(pathOrIndex: any, cellIndex: number) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const cell = get().getCellAtPath(path, cellIndex)
        if (!cell) return
        const clone = get()._cloneCellForCopy(cell)
        const item = { type: 'sqljob-cell', data: clone }
        set({ _clipboardItem: item })
        try { navigator.clipboard.writeText(JSON.stringify(item)) } catch {}
        get().setStatus('Cellule copiée', 'success')
    },

    /** Copie un groupe dans le presse-papier */
    copyGroupAtPath(pathOrIndex: any) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const group = get().getGroupAtPath(path)
        if (!group) return
        const clone = get()._cloneGroupForCopy(group)
        const item = { type: 'sqljob-group', data: clone }
        set({ _clipboardItem: item })
        try { navigator.clipboard.writeText(JSON.stringify(item)) } catch {}
        get().setStatus('Groupe copié', 'success')
    },

    /**
     * Colle le contenu du presse-papier à la fin du groupe cible.
     * - Si c'est une cell → ajoutée dans group.cells
     * - Si c'est un groupe → ajouté dans group.children
     * Les noms sont dédupliqués par incrémentation (_1, _2, ...)
     */
    pasteToGroup(pathOrIndex: any) {
        const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex]
        const clipItem = get()._clipboardItem
        if (!clipItem) {
            get().setStatus('Rien à coller', 'info')
            return
        }
        const group = get().getGroupAtPath(path)
        if (!group) return

        const usedNames = get()._collectUsedCellNames()

        if (clipItem.type === 'sqljob-cell') {
            const cellData = JSON.parse(JSON.stringify(clipItem.data))
            cellData._id = get().generateCellId()
            cellData._status = null
            cellData._results = null
            cellData._resultInfo = null
            cellData._order = get().getNextOrder(group)
            if (cellData.name) {
                cellData.name = get()._makeUniqueName(cellData.name, usedNames)
            }
            if (!group.cells) group.cells = []
            group.cells.push(cellData)
            get().setStatus('Cellule collée', 'success')
        } else if (clipItem.type === 'sqljob-group') {
            const groupData = JSON.parse(JSON.stringify(clipItem.data))
            get()._prepareGroupForPaste(groupData, usedNames)
            groupData._order = get().getNextOrder(group)
            if (!group.children) group.children = []
            group.children.push(groupData)
            get().setStatus('Groupe collé', 'success')
        }

        set((s: any) => ({ _rev: s._rev + 1 }))
    },
})
