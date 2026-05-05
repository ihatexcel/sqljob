// @ts-nocheck

export function parametersMixin() {
    return {
                // Collecter tous les paramètres définis dans les cellules uiParameter
                getParameters() {
                    const params = {};
                    const collectFromGroup = (group) => {
                        for (const cell of (group?.cells || [])) {
                            const refName = ConfigManager.getCellReferenceName(cell);
                            if (cell.type === 'uiParameter' && refName) {
                                params[refName] = cell._value || '';
                            }
                            // Cellule Univer matérialisée → {{ cellName }} résout vers le nom de la table DuckDB
                            if (cell.type === 'univerSheet' && cell.json?.univerConfig?.materializeAsDuckDB && cell.name) {
                                params[cell.name] = cell.name;
                            }
                        }
                        for (const child of (group?.children || [])) {
                            collectFromGroup(child);
                        }
                    };

                    for (const group of (this.groups || [])) {
                        collectFromGroup(group);
                    }

                    // Ajouter la variable {{ _loop }} si elle est définie (pendant l'exécution d'une boucle)
                    if (this._currentLoopValue !== null && this._currentLoopValue !== undefined) {
                        params['_loop'] = this._currentLoopValue;
                    }

                    return params;
                },

                // Parser une requête SQL et remplacer les {{ param }} par leurs valeurs
                parseQueryWithParameters(query, extraParams = {}) {
                    if (!query) return query;

                    const params = { ...this.getParameters(), ...extraParams };
                    let parsedQuery = query;

                    // Remplacer tous les {{ paramName }} par leurs valeurs
                    for (const [paramName, paramValue] of Object.entries(params)) {
                        // Échapper les caractères spéciaux pour la regex
                        const escapedName = paramName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const regex = new RegExp('\\{\\{\\s*' + escapedName + '\\s*\\}\\}', 'g');
                        // Échapper les apostrophes dans la valeur pour éviter les injections SQL
                        const escapedValue = String(paramValue).replace(/'/g, "''");
                        parsedQuery = parsedQuery.replace(regex, escapedValue);
                    }

                    return parsedQuery;
                },

                // ─────────────────────────────────────────────────────────────────
                // DAG (Directed Acyclic Graph) - Rafraîchissement automatique
                // ─────────────────────────────────────────────────────────────────

                // Trouver tous les paramètres référencés dans une query ({{ paramName }})
                findReferencedParams(query) {
                    if (!query) return [];
                    const params = [];
                    const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
                    let match;
                    while ((match = regex.exec(query)) !== null) {
                        if (!params.includes(match[1])) {
                            params.push(match[1]);
                        }
                    }
                    return params;
                },

                // Trouver toutes les cellules qui dépendent d'un paramètre donné
                // Retourne un tableau de {cell, path, cellIndex} pour les types DAG-compatibles
                findDependentCells(paramName) {
                    const dependents = [];
                    const dagTypes = ['uiParameter', 'sql', 'table', 'perspective', 'sqlStat', 'univerSheet', 'source', 'markdown', 'iframe'];

                    const searchInGroup = (group, path) => {
                        for (let cellIndex = 0; cellIndex < (group.cells || []).length; cellIndex++) {
                            const cell = group.cells[cellIndex];
                            if (!dagTypes.includes(cell.type)) continue;

                            // Vérifier si la query référence le paramètre
                            const query = ConfigManager.getCellQuery(cell, 0) || '';
                            const referencedParams = this.findReferencedParams(query);

                            if (referencedParams.includes(paramName)) {
                                dependents.push({ cell, path: [...path], cellIndex });
                            }
                        }
                        // Récursif sur les enfants
                        if (group.children) {
                            for (let i = 0; i < group.children.length; i++) {
                                searchInGroup(group.children[i], [...path, i]);
                            }
                        }
                    };

                    // Chercher dans tous les groupes de la page active
                    for (let gi = 0; gi < this.groups.length; gi++) {
                        searchInGroup(this.groups[gi], [gi]);
                    }

                    return dependents;
                },

                // Trouver tous les groupes qui dépendent d'un paramètre donné (via ifQuery)
                // Retourne un tableau de {group, path}
                findDependentGroups(paramName) {
                    const dependents = [];

                    const searchInGroup = (group, path) => {
                        // Vérifier si queries[0] du groupe référence le paramètre
                        const q = ConfigManager.getGroupIfQuery(group);
                        if (q && q.sql) {
                            const referencedParams = this.findReferencedParams(q.sql);
                            if (referencedParams.includes(paramName)) {
                                dependents.push({ group, path: [...path] });
                            }
                        }
                        // Récursif sur les enfants
                        if (group.children) {
                            for (let i = 0; i < group.children.length; i++) {
                                searchInGroup(group.children[i], [...path, i]);
                            }
                        }
                    };

                    // Chercher dans tous les groupes de la page active
                    for (let gi = 0; gi < this.groups.length; gi++) {
                        searchInGroup(this.groups[gi], [gi]);
                    }

                    return dependents;
                },

                // Détecter les cycles dans le DAG
                // Retourne true si un cycle est détecté
                detectCycleInDAG() {
                    // Construire le graphe de dépendances
                    const graph = new Map(); // paramName -> [paramNames dépendants]
                    const allParams = new Set();

                    const collectFromGroup = (group) => {
                        for (const cell of (group.cells || [])) {
                            const refName = ConfigManager.getCellReferenceName(cell);
                            if (cell.type === 'uiParameter' && refName) {
                                allParams.add(refName);
                                // Trouver les paramètres référencés dans la query de ce uiParameter
                                const refs = this.findReferencedParams(ConfigManager.getCellQuery(cell, 0) || '');
                                if (!graph.has(refName)) {
                                    graph.set(refName, []);
                                }
                                // Ce paramètre dépend des paramètres référencés
                                for (const ref of refs) {
                                    if (!graph.has(ref)) {
                                        graph.set(ref, []);
                                    }
                                    graph.get(ref).push(refName);
                                }
                            }
                        }
                        for (const child of (group.children || [])) {
                            collectFromGroup(child);
                        }
                    };

                    for (const group of this.groups) {
                        collectFromGroup(group);
                    }

                    // Détection de cycle avec DFS
                    const visited = new Set();
                    const recStack = new Set();

                    const hasCycle = (node) => {
                        if (recStack.has(node)) return true;
                        if (visited.has(node)) return false;

                        visited.add(node);
                        recStack.add(node);

                        for (const neighbor of (graph.get(node) || [])) {
                            if (hasCycle(neighbor)) return true;
                        }

                        recStack.delete(node);
                        return false;
                    };

                    for (const param of allParams) {
                        if (hasCycle(param)) {
                            return true;
                        }
                    }

                    return false;
                },

                // Callback appelé lorsqu'une valeur de paramètre UI est modifiée par l'utilisateur
                async onParameterValueChange(cell) {

                    // Si le DAG n'est pas activé, ne rien faire
                    if (!this.directedAcyclicGraph) {
                        return;
                    }

                    const paramName = ConfigManager.getCellReferenceName(cell);
                    if (!paramName) {
                        return;
                    }

                    // Annuler le timer précédent (debounce)
                    if (this._dagDebounceTimer) {
                        clearTimeout(this._dagDebounceTimer);
                        this._dagDebounceTimer = null;
                    }

                    // Démarrer un nouveau timer
                    this._dagDebounceTimer = setTimeout(async () => {
                        this._dagDebounceTimer = null;

                        try {
                            await this._executeDAGRefresh(paramName);
                        } catch (error) {
                            console.error('❌ [DAG] Erreur lors du rafraîchissement:', error);
                            this.setStatus('❌ Erreur DAG: ' + error.message, 'error');
                        }
                    }, this._dagDebounceDelay);
                },

                // Exécuter le rafraîchissement DAG (appelé après le debounce)
                async _executeDAGRefresh(paramName) {
                    // Vérifier les cycles avant de procéder
                    if (this.detectCycleInDAG()) {
                        console.error('🔴 [DAG] Cycle détecté dans le DAG');
                        this.setStatus('⚠️ Cycle détecté dans le DAG - rafraîchissement automatique désactivé', 'error');
                        this.directedAcyclicGraph = false;
                        return;
                    }

                    // Trouver toutes les cellules qui dépendent de ce paramètre
                    const dependentCells = this.findDependentCells(paramName);

                    // Trouver tous les groupes qui dépendent de ce paramètre (via ifQuery)
                    const dependentGroups = this.findDependentGroups(paramName);

                    const totalDependents = dependentCells.length + dependentGroups.length;

                    if (totalDependents === 0) {
                        return;
                    }


                    // Réévaluer les ifQuery des groupes dépendants
                    for (let i = 0; i < dependentGroups.length; i++) {
                        const dep = dependentGroups[i];
                        try {
                            const previousResult = dep.group._ifQueryResult;
                            const newResult = await this.evaluateGroupIfQuery(dep.group);
                            dep.group._ifQueryResult = newResult;
                        } catch (error) {
                            console.error(`  ❌ [DAG] Erreur évaluation groupe ${i + 1}:`, error);
                        }
                    }

                    // Exécuter les cellules dépendantes dans l'ordre
                    for (let i = 0; i < dependentCells.length; i++) {
                        const dep = dependentCells[i];
                        const depCell = dep.cell;

                        // uiParameter: ne skip que si l'utilisateur a saisi manuellement (_userModified)
                        // autres types: skip toujours si preserveUserValue est vrai
                        if (depCell.preserveUserValue && (depCell.type !== 'uiParameter' || depCell._userModified)) {
                            continue;
                        }

                        try {
                            await this.runCellAt(dep.path, dep.cellIndex);
                        } catch (error) {
                            console.error(`  ❌ [DAG] Erreur cellule ${i + 1}:`, error);
                        }
                    }

                },

                // Générer un nom de paramètre unique (param1, param2, param3...) - vérifie dans TOUTES les pages
                generateUniqueParamName() {
                    const existingNames = new Set();

                    const collectNames = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                const ref = ConfigManager.getCellReferenceName(cell);
                                if (cell.type === 'uiParameter' && ref) {
                                    existingNames.add(ref);
                                }
                            }
                            if (group.children) {
                                collectNames(group.children);
                            }
                        }
                    };

                    // Collecter les noms de toutes les pages
                    for (const page of this.pages) {
                        collectNames(page.groups);
                        if (page.linkGroups) {
                            collectNames(page.linkGroups);
                        }
                    }

                    // Trouver le prochain numéro disponible
                    let num = 1;
                    while (existingNames.has('param' + num)) {
                        num++;
                    }

                    return 'param' + num;
                },

                // Vérifie si un nom de paramètre est déjà utilisé (récursif) - vérifie dans TOUTES les pages
                isParamNameUsed(paramName, excludeId) {
                    let used = false;
                    const checkGroups = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell.type === 'uiParameter' &&
                                    cell._id !== excludeId &&
                                    ConfigManager.getCellReferenceName(cell) === paramName) {
                                    used = true;
                                    return;
                                }
                            }
                            if (group.children && !used) {
                                checkGroups(group.children);
                            }
                            if (used) return;
                        }
                    };

                    // Vérifier dans toutes les pages
                    for (const page of this.pages) {
                        checkGroups(page.groups);
                        if (used) return true;
                        if (page.linkGroups) {
                            checkGroups(page.linkGroups);
                            if (used) return true;
                        }
                    }
                    return used;
                },

                /** Valide le nom d'un uiParameter (alias de validateCellName pour cohérence). */
                validateParamName(pathOrIndex, cellIndex) {
                    this.validateCellName(pathOrIndex, cellIndex);
                },
    };
}
