// @ts-nocheck
/**
 * parametersSlice — gestion des paramètres UI et du DAG (Directed Acyclic Graph).
 * Converti de parametersMixin.ts (Alpine this-proxy) vers un slice Zustand pur.
 */
import { ConfigManager } from '../../../lib/ConfigManager'

export const createParametersSlice = (set: any, get: any) => ({

    getParameters() {
        const { _currentLoopValue } = get()
        const groups = get().getGroups()
        const params: Record<string, any> = {}
        const collectFromGroup = (group: any) => {
            for (const cell of (group?.cells || [])) {
                const refName = ConfigManager.getCellReferenceName(cell)
                if (cell.type === 'uiParameter' && refName) {
                    params[refName] = cell._value || ''
                }
            }
            for (const child of (group?.children || [])) collectFromGroup(child)
        }
        for (const group of (groups || [])) collectFromGroup(group)
        if (_currentLoopValue !== null && _currentLoopValue !== undefined) {
            params['loop'] = _currentLoopValue
        }
        return params
    },

    parseQueryWithParameters(query: string) {
        if (!query) return query
        const params = get().getParameters()
        let parsedQuery = query
        for (const [paramName, paramValue] of Object.entries(params)) {
            const escapedName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            const regex = new RegExp('\\$' + escapedName + '(?![a-zA-Z0-9_])', 'g')
            const escapedValue = String(paramValue).replace(/'/g, "''")
            parsedQuery = parsedQuery.replace(regex, escapedValue)
        }
        return parsedQuery
    },

    findReferencedParams(query: string) {
        if (!query) return []
        const params: string[] = []
        const regex = /\$([a-zA-Z_][a-zA-Z0-9_]*)/g
        let match
        while ((match = regex.exec(query)) !== null) {
            if (!params.includes(match[1])) params.push(match[1])
        }
        return params
    },

    findDependentCells(paramName: string) {
        const groups = get().getGroups()
        const dependents: any[] = []
        const dagTypes = ['uiParameter', 'sqlRecursiveParse', 'table', 'perspective', 'sqlStat']
        const searchInGroup = (group: any, path: number[]) => {
            for (let cellIndex = 0; cellIndex < (group.cells || []).length; cellIndex++) {
                const cell = group.cells[cellIndex]
                if (!dagTypes.includes(cell.type)) continue
                const query = ConfigManager.getCellQuery(cell, 0) || ''
                const referencedParams = get().findReferencedParams(query)
                if (referencedParams.includes(paramName)) {
                    dependents.push({ cell, path: [...path], cellIndex })
                }
            }
            if (group.children) {
                for (let i = 0; i < group.children.length; i++) {
                    searchInGroup(group.children[i], [...path, i])
                }
            }
        }
        for (let gi = 0; gi < (groups || []).length; gi++) searchInGroup(groups[gi], [gi])
        return dependents
    },

    findDependentGroups(paramName: string) {
        const groups = get().getGroups()
        const dependents: any[] = []
        const searchInGroup = (group: any, path: number[]) => {
            const q = ConfigManager.getGroupIfQuery(group)
            if (q && q.sql) {
                const referencedParams = get().findReferencedParams(q.sql)
                if (referencedParams.includes(paramName)) dependents.push({ group, path: [...path] })
            }
            if (group.children) {
                for (let i = 0; i < group.children.length; i++) searchInGroup(group.children[i], [...path, i])
            }
        }
        for (let gi = 0; gi < (groups || []).length; gi++) searchInGroup(groups[gi], [gi])
        return dependents
    },

    detectCycleInDAG() {
        const groups = get().getGroups()
        const graph = new Map<string, string[]>()
        const allParams = new Set<string>()
        const collectFromGroup = (group: any) => {
            for (const cell of (group.cells || [])) {
                const refName = ConfigManager.getCellReferenceName(cell)
                if (cell.type === 'uiParameter' && refName) {
                    allParams.add(refName)
                    const refs = get().findReferencedParams(ConfigManager.getCellQuery(cell, 0) || '')
                    if (!graph.has(refName)) graph.set(refName, [])
                    for (const ref of refs) {
                        if (!graph.has(ref)) graph.set(ref, [])
                        graph.get(ref)!.push(refName)
                    }
                }
            }
            for (const child of (group.children || [])) collectFromGroup(child)
        }
        for (const group of (groups || [])) collectFromGroup(group)
        const visited = new Set<string>()
        const recStack = new Set<string>()
        const hasCycle = (node: string): boolean => {
            if (recStack.has(node)) return true
            if (visited.has(node)) return false
            visited.add(node)
            recStack.add(node)
            for (const neighbor of (graph.get(node) || [])) {
                if (hasCycle(neighbor)) return true
            }
            recStack.delete(node)
            return false
        }
        for (const param of allParams) {
            if (hasCycle(param)) return true
        }
        return false
    },

    async onParameterValueChange(cell: any) {
        const { directedAcyclicGraph } = get()
        if (!directedAcyclicGraph) return
        const paramName = ConfigManager.getCellReferenceName(cell)
        if (!paramName) return
        const { _dagDebounceTimer, _dagDebounceDelay } = get()
        if (_dagDebounceTimer) {
            clearTimeout(_dagDebounceTimer)
            set({ _dagDebounceTimer: null })
        }
        const timer = setTimeout(async () => {
            set({ _dagDebounceTimer: null })
            try {
                await get()._executeDAGRefresh(paramName)
            } catch (error: any) {
                console.error('❌ [DAG] Erreur lors du rafraîchissement:', error)
                get().setStatus('❌ Erreur DAG: ' + error.message, 'error')
            }
        }, _dagDebounceDelay)
        set({ _dagDebounceTimer: timer })
    },

    async _executeDAGRefresh(paramName: string) {
        const { devMode } = get()
        if (get().detectCycleInDAG()) {
            console.error('🔴 [DAG] Cycle détecté dans le DAG')
            get().setStatus('⚠️ Cycle détecté dans le DAG - rafraîchissement automatique désactivé', 'error')
            set({ directedAcyclicGraph: false })
            return
        }
        const dependentCells = get().findDependentCells(paramName)
        const dependentGroups = get().findDependentGroups(paramName)
        const totalDependents = dependentCells.length + dependentGroups.length
        if (totalDependents === 0) return
        if (devMode) get().setStatus(`🔄 Rafraîchissement de ${dependentCells.length} cellule(s) et ${dependentGroups.length} groupe(s) dépendant(s) de $${paramName}...`, 'loading')
        for (const dep of dependentGroups) {
            try {
                dep.group._ifQueryResult = await get().evaluateGroupIfQuery(dep.group)
            } catch (error) {
                console.error(`  ❌ [DAG] Erreur évaluation groupe:`, error)
            }
        }
        for (const dep of dependentCells) {
            const depCell = dep.cell
            if (depCell.type === 'uiParameter' && depCell.preserveUserValue && depCell._userModified) continue
            try {
                await get().runCellAt(dep.path, dep.cellIndex)
            } catch (error) {
                console.error(`  ❌ [DAG] Erreur cellule:`, error)
            }
        }
        if (devMode) get().setStatus(`✅ ${dependentCells.length} cellule(s) et ${dependentGroups.length} groupe(s) rafraîchi(s)`, 'success')
    },

    generateUniqueParamName() {
        const { pages } = get()
        const existingNames = new Set<string>()
        const collectNames = (groups: any[]) => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    const ref = ConfigManager.getCellReferenceName(cell)
                    if (cell.type === 'uiParameter' && ref) existingNames.add(ref)
                }
                if (group.children) collectNames(group.children)
            }
        }
        for (const page of pages) {
            collectNames(page.groups)
            if (page.linkGroups) collectNames(page.linkGroups)
        }
        let num = 1
        while (existingNames.has('param' + num)) num++
        return 'param' + num
    },

    isParamNameUsed(paramName: string, excludeId: string) {
        const { pages } = get()
        let used = false
        const checkGroups = (groups: any[]) => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    if (cell.type === 'uiParameter' && cell._id !== excludeId && ConfigManager.getCellReferenceName(cell) === paramName) {
                        used = true
                        return
                    }
                }
                if (group.children && !used) checkGroups(group.children)
                if (used) return
            }
        }
        for (const page of pages) {
            checkGroups(page.groups)
            if (used) return true
            if (page.linkGroups) {
                checkGroups(page.linkGroups)
                if (used) return true
            }
        }
        return used
    },

    validateParamName(pathOrIndex: any, cellIndex: number) {
        get().validateCellName(pathOrIndex, cellIndex)
    },
})
