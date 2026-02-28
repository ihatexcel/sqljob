// @ts-nocheck

export function groupsMixin() {
    return {
        // Retourne uniquement les groupes de niveau 0 (les sous-groupes sont rendus dans le template)
                getFlattenedGroups() {
                    const result = [];
                    if (!this.groups) return result;

                    for (let i = 0; i < this.groups.length; i++) {
                        const group = this.groups[i];
                        result.push({
                            group,
                            path: [i],
                            depth: 0,
                            pathKey: String(i),
                            isFirst: i === 0,
                            isLast: i === this.groups.length - 1,
                            siblingCount: this.groups.length
                        });
                    }
                    return result;
                },

                // Retourne tous les groupes de toutes les pages (pour conservation du DOM au changement de page)
                getFlattenedGroupsForAllPages() {
                    const result = [];
                    for (let pi = 0; pi < (this.pages || []).length; pi++) {
                        const page = this.pages[pi];
                        const groups = page?.groups || [];
                        for (let i = 0; i < groups.length; i++) {
                            const group = groups[i];
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
                            });
                        }
                    }
                    return result;
                },

                // Retourne les items (cellules + sous-groupes) d'un groupe, combinés dans l'ordre
                // Chaque item a un type ('cell' ou 'group'), un index local et les données
                getGroupItems(group) {
                    const items = [];
                    const cells = group.cells || [];
                    const children = group.children || [];

                    // Ajouter les cellules
                    cells.forEach((cell, idx) => {
                        items.push({
                            type: 'cell',
                            data: cell,
                            cellIndex: idx,
                            itemKey: 'cell-' + cell._id
                        });
                    });

                    // Ajouter les sous-groupes
                    children.forEach((child, idx) => {
                        items.push({
                            type: 'group',
                            data: child,
                            childIndex: idx,
                            itemKey: 'group-' + (child._id || idx)
                        });
                    });

                    return items;
                },

                // Récupérer un groupe par son chemin [index1, index2, ...]
                getGroupAtPath(path) {
                    if (!path || path.length === 0) return null;

                    // Handle modal context ([-1] refers to childGroupModal.group)
                    if (path.length >= 1 && path[0] === -1) {
                        if (path.length === 1) {
                            // Simple case: [-1] = modal group itself
                            return this.childGroupModal.group;
                        } else {
                            // Nested case: [-1, 0] = first child of modal group, [-1, 0, 1] = second child of that, etc.
                            let current = this.childGroupModal.group;
                            for (let i = 1; i < path.length; i++) {
                                if (!current || !current.children) return null;
                                current = current.children[path[i]];
                            }
                            return current;
                        }
                    }

                    let current = this.groups[path[0]];
                    for (let i = 1; i < path.length; i++) {
                        if (!current || !current.children) return null;
                        current = current.children[path[i]];
                    }
                    return current;
                },

                // Récupérer le parent d'un groupe
                getParentGroup(path) {
                    if (!path || path.length <= 1) return null;
                    return this.getGroupAtPath(path.slice(0, -1));
                },

                // Récupérer une cellule par chemin de groupe + index de cellule
                getCellAtPath(path, cellIndex) {
                    if (!path || !Array.isArray(path)) return null;
                    // Handle modal context directly for performance
                    if (path.length === 1 && path[0] === -1) {
                        if (!this.childGroupModal.group?.cells) return null;
                        return this.childGroupModal.group.cells[cellIndex];
                    }

                    const group = this.getGroupAtPath(path);
                    return group?.cells?.[cellIndex];
                },

                // Créer un nouveau groupe (pour imbrication)
                createNewGroup(direction = 'row') {
                    return {
                        _id: this.generateGroupId(),
                        direction: direction,
                        style: '',
                        cells: [],
                        children: [],
                        _order: 0, // Sera ajusté lors de l'ajout au parent
                        loop: { enabled: false, query: '', zip: false, zipQuery: '' },
                        accordion: false,
                        title: '',
                        accordionOpen: true
                    };
                },

                // Ajouter un sous-groupe à un groupe
                addNestedGroup(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return;

                    if (!group.children) {
                        group.children = [];
                    }

                    const newChild = this.createNewGroup('row');
                    newChild._order = this.getNextOrder(group);
                    const firstCell = this.createNewCell('markdown');
                    firstCell._order = 0;
                    newChild.cells = [firstCell];
                    group.children.push(newChild);

                    this.setStatus('Sous-groupe ajouté', 'success');
                },

                // Changer la direction d'un groupe par chemin
                toggleGroupDirection(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        group.direction = group.direction === 'column' ? 'row' : 'column';
                    }
                },

                // Ouvrir la modale de configuration de loop
                openLoopConfigModal(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        // S'assurer que loop existe avec tous les champs
                        if (!group.loop) {
                            group.loop = { enabled: false, query: '', zip: false, zipQuery: '' };
                        } else if (group.loop.zip === undefined) {
                            group.loop.zip = false;
                            group.loop.zipQuery = group.loop.zipQuery || '';
                        }
                        this.loopConfigModal = { open: true, path: path };
                    }
                },

                // Ouvrir la modale de paramètres du groupe (accordion, title, accordionOpen)
                openGroupSettingsModal(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        ConfigManager.ensureGroupQueries(group);
                        this.groupSettingsModal = { open: true, path: path };
                    }
                },

                // Tester la requête conditionnelle d'un groupe (affiche le résultat)
                async testGroupIfQuery(path) {
                    const group = this.getGroupAtPath(path);
                    if (!group || !ConfigManager.getGroupIfQuery(group)) return;
                    try {
                        const result = await this.evaluateGroupIfQuery(group);
                        this.setStatus(`ifQuery: ${result === true ? 'true → groupe affiché' : (result === false ? 'false' : 'null') + ' → groupe masqué'}`, result ? 'success' : 'info');
                    } catch (err) {
                        this.setStatus('Erreur ifQuery: ' + err.message, 'error');
                    }
                },

                // Basculer l'état ouvert/fermé d'un accordion
                toggleAccordion(path) {
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        group.accordionOpen = !group.accordionOpen;
                    }
                },

                // Générer la requête par défaut pour la loop
                getDefaultLoopQuery() {
                    return `SELECT DISTINCT {{ SELECT column_name
   FROM information_schema.columns
   WHERE table_name = 'source1'
   ORDER BY ordinal_position
   LIMIT 1}}
FROM source1 LIMIT 10;`;
                },

                // Générer la requête par défaut pour le nom du fichier zip
                getDefaultZipQuery() {
                    return `SELECT 'export_' || current_timestamp::text || '.zip' as filename;`;
                },

                // Supprimer un groupe par chemin
                async deleteGroupAtPath(path) {
                    if (!path || path.length === 0) return;

                    if (!await Alpine.store('confirmModal').show('Supprimer ce groupe et tout son contenu ?')) return;

                    if (path.length === 1) {
                        // Groupe de premier niveau
                        this.groups.splice(path[0], 1);
                    } else {
                        // Sous-groupe : récupérer le parent
                        const parentPath = path.slice(0, -1);
                        const childIndex = path[path.length - 1];
                        const parent = this.getGroupAtPath(parentPath);
                        if (parent && parent.children) {
                            parent.children.splice(childIndex, 1);
                        }
                    }
                    this.setStatus('Groupe supprimé', 'success');
                },

                // Récupérer un groupe link par son ID
                getLinkGroupById(groupId) {
                    return this.linkGroups.find(g => g._id === groupId);
                },

                // Ouvrir la modale du groupe enfant pour une cellule
                async openChildGroupModal(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    // Récupérer ou créer le groupe enfant
                    let childGroup = null;
                    if (cell.childGroupId) {
                        // Le groupe existe déjà
                        childGroup = this.getLinkGroupById(cell.childGroupId);
                    }

                    if (!childGroup) {
                        // Créer un nouveau groupe link
                        childGroup = this.createNewGroup('row');
                        childGroup._type = 'link';

                        // Ajouter une première cellule markdown pour démarrer
                        const firstCell = this.createNewCell('markdown');
                        firstCell._order = 0;
                        childGroup.cells = [firstCell];

                        // Ajouter le groupe aux linkGroups
                        this.linkGroups.push(childGroup);

                        // Lier le groupe à la cellule
                        cell.childGroupId = childGroup._id;
                    }

                    // Ouvrir la modale avec le groupe
                    this.childGroupModal = {
                        open: true,
                        path: path,
                        cellIndex: cellIndex,
                        group: childGroup
                    };

                    // Exécuter automatiquement tout le contenu du groupe link
                    await this.runGroupAtPath([-1]);
                },

                // Fermer la modale du groupe enfant
                closeChildGroupModal() {
                    this.childGroupModal = { open: false, path: null, cellIndex: null, group: null };
                },

                // Supprimer le groupe enfant (link group) et fermer la modale
                async deleteChildGroupModal() {
                    if (!this.childGroupModal.group) return;

                    if (!await Alpine.store('confirmModal').show('Supprimer ce groupe enfant ?')) return;

                    const groupId = this.childGroupModal.group._id;

                    // Retirer le groupe de linkGroups
                    const linkIndex = this.linkGroups.findIndex(g => g._id === groupId);
                    if (linkIndex !== -1) {
                        this.linkGroups.splice(linkIndex, 1);
                    }

                    // Retirer le childGroupId de la cellule parente
                    if (this.childGroupModal.path && this.childGroupModal.cellIndex !== null) {
                        const cell = this.getCellAtPath(this.childGroupModal.path, this.childGroupModal.cellIndex);
                        if (cell && cell.childGroupId === groupId) {
                            delete cell.childGroupId;
                        }
                    }

                    // Fermer la modale
                    this.closeChildGroupModal();
                },

                // Déplacer un groupe par chemin
                moveGroupAtPath(path, direction) {
                    if (!path || path.length === 0) return;

                    if (path.length === 1) {
                        // Groupe de premier niveau
                        const index = path[0];
                        const newIndex = index + direction;
                        if (newIndex >= 0 && newIndex < this.groups.length) {
                            const temp = this.groups[index];
                            this.groups[index] = this.groups[newIndex];
                            this.groups[newIndex] = temp;
                        }
                    } else {
                        // Sous-groupe
                        const parentPath = path.slice(0, -1);
                        const childIndex = path[path.length - 1];
                        const parent = this.getGroupAtPath(parentPath);
                        if (parent && parent.children) {
                            const newIndex = childIndex + direction;
                            if (newIndex >= 0 && newIndex < parent.children.length) {
                                const temp = parent.children[childIndex];
                                parent.children[childIndex] = parent.children[newIndex];
                                parent.children[newIndex] = temp;
                            }
                        }
                    }
                },

                // Déplacer une cellule dans un groupe par chemin
                moveCellInGroupAtPath(path, cellIndex, direction) {
                    const group = this.getGroupAtPath(path);
                    if (!group || !group.cells) return;

                    const newIndex = cellIndex + direction;
                    if (newIndex >= 0 && newIndex < group.cells.length) {
                        const temp = group.cells[cellIndex];
                        group.cells[cellIndex] = group.cells[newIndex];
                        group.cells[newIndex] = temp;
                    }
                },

                // Génère l'ID unique pour un groupe basé sur son path
                getGroupElementId(path) {
                    return 'group-' + path.join('-');
                },

                openAddGroupModal() {
                    this.showAddGroupModal = true;
                },

                // Obtient le prochain _order disponible dans un groupe (cellules + children)
                getNextOrder(group) {
                    if (!group) return 0;
                    const cells = group.cells || [];
                    const children = group.children || [];
                    const allOrders = [
                        ...cells.map(c => c._order ?? 0),
                        ...children.map(c => c._order ?? 0)
                    ];
                    return allOrders.length > 0 ? Math.max(...allOrders) + 1 : 0;
                },

                // Retourne les cellules triées par _order avec leur index original
                getSortedCells(group) {
                    if (!group || !group.cells) return [];
                    return group.cells
                        .map((cell, originalIndex) => ({ cell, originalIndex }))
                        .sort((a, b) => (a.cell._order ?? 0) - (b.cell._order ?? 0));
                },

                // Retourne les children triés par _order avec leur index original
                getSortedChildren(group) {
                    if (!group || !group.children) return [];
                    return group.children
                        .map((child, originalIndex) => ({ child, originalIndex }))
                        .sort((a, b) => (a.child._order ?? 0) - (b.child._order ?? 0));
                },

                // Retourne tous les items (cellules + children) triés par _order avec leur type
                getAllItemsSorted(group) {
                    if (!group) return [];
                    const cells = (group.cells || []).map((c, i) => ({
                        type: 'cell',
                        item: c,
                        originalIndex: i,
                        order: c._order ?? 0
                    }));
                    const children = (group.children || []).map((c, i) => ({
                        type: 'child',
                        item: c,
                        originalIndex: i,
                        order: c._order ?? 0
                    }));
                    return [...cells, ...children].sort((a, b) => a.order - b.order);
                },

                // Retourne le nom d'onglet pour un item (cellule ou groupe enfant)
                getTabName(tabItem, tabIdx) {
                    if (tabItem.type === 'cell') {
                        const cell = tabItem.item;
                        return cell.name || ConfigManager.getCellReferenceName(cell) || cell.title || `Cellule ${tabIdx + 1}`;
                    } else {
                        const child = tabItem.item;
                        return child.name || child.title || `Groupe ${tabIdx + 1}`;
                    }
                },


                // Déplace un item (cellule ou child) dans un groupe de façon unifiée
                moveItemInGroup(path, itemType, originalIndex, direction) {
                    const group = this.getGroupAtPath(path);
                    if (!group) return;

                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length < 2) return;

                    // Trouver l'item actuel dans la liste triée
                    const currentSortedIndex = allItems.findIndex(
                        item => item.type === itemType && item.originalIndex === originalIndex
                    );
                    if (currentSortedIndex === -1) return;

                    const newSortedIndex = currentSortedIndex + direction;
                    if (newSortedIndex < 0 || newSortedIndex >= allItems.length) return;

                    // Échanger les _order des deux éléments
                    const currentItem = allItems[currentSortedIndex];
                    const targetItem = allItems[newSortedIndex];

                    const tempOrder = currentItem.item._order;
                    currentItem.item._order = targetItem.item._order;
                    targetItem.item._order = tempOrder;
                },

                // Vérifie si un item est le premier dans l'ordre unifié
                isFirstInGroup(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length === 0) return true;
                    const first = allItems[0];
                    return first.type === itemType && first.originalIndex === originalIndex;
                },

                // Vérifie si un item est le dernier dans l'ordre unifié
                isLastInGroup(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    if (allItems.length === 0) return true;
                    const last = allItems[allItems.length - 1];
                    return last.type === itemType && last.originalIndex === originalIndex;
                },

                // Trouve l'index de l'item dans la liste triée
                getSortedIndex(group, itemType, originalIndex) {
                    const allItems = this.getAllItemsSorted(group);
                    return allItems.findIndex(
                        item => item.type === itemType && item.originalIndex === originalIndex
                    );
                },

                // Génère le HTML d'un sous-groupe (récursif, illimité)
                renderChildGroupHTML(childGroup, childPath, parentGroup, originalIndex) {
                    // Convertir le path en expression JSON pour l'utiliser dans les bindings
                    const pathJSON = JSON.stringify(childPath);
                    const parentPathJSON = JSON.stringify(childPath.slice(0, -1));

                    // Header du sous-groupe
                    const header = `
                        <div class="flex items-center justify-between gap-2 py-2 px-4 bg-primary/10 border-b border-base-300" x-show="devMode">
                            <div class="join">
                                <button class="btn btn-xs join-item" @click="toggleGroupDirection(${pathJSON})" :title="getGroupAtPath(${pathJSON})?.direction === 'column' ? 'Passer en ligne' : 'Passer en colonne'">
                                    <span x-text="getGroupAtPath(${pathJSON})?.direction === 'column' ? '⇵' : '⇄'"></span>
                                </button>
                                <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.loop?.enabled ? 'btn-info' : ''" @click="openLoopConfigModal(${pathJSON})" title="Configurer la boucle"><span class="iconify" data-icon="material-symbols-light:loop" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" :class="getGroupAtPath(${pathJSON})?.accordion ? 'btn-accent' : ''" @click="openGroupSettingsModal(${pathJSON})" title="Paramètres du groupe"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs btn-success join-item" @click="runGroupAtPath(${pathJSON})" :disabled="isLoading" title="Exécuter"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, -1)" :disabled="isFirstInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Monter"><span class="iconify" data-icon="material-symbols-light:arrow-upward" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, 1)" :disabled="isLastInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})" title="Descendre"><span class="iconify" data-icon="material-symbols-light:arrow-downward" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="addNestedGroup(${pathJSON})" title="Ajouter un sous-groupe"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs join-item" @click="openAddCellToGroupModal(${pathJSON})" title="Ajouter une cellule"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span></button>
                                <button class="btn btn-xs btn-error join-item" @click="deleteGroupAtPath(${pathJSON})" title="Supprimer"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span></button>
                            </div>
                            <div class="dropdown dropdown hidden">
                                <div tabindex="0" role="button" class="btn btn-xs"><span class="iconify" data-icon="material-symbols-light:more-vert" style="font-size:1rem"></span></div>
                                <ul tabindex="-1" class="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-48 p-2 shadow-sm">
                                    <li><button @click="toggleGroupDirection(${pathJSON})"><span x-text="getGroupAtPath(${pathJSON})?.direction === 'column' ? '⇵ Passer en ligne' : '⇄ Passer en colonne'"></span></button></li>
                                    <li><button @click="openLoopConfigModal(${pathJSON})"><span class="iconify" data-icon="material-symbols-light:loop" style="font-size:1rem"></span> Configurer la boucle</button></li>
                                    <li><button @click="openGroupSettingsModal(${pathJSON})"><span class="iconify" data-icon="material-symbols-light:settings" style="font-size:1rem"></span> Paramètres du groupe</button></li>
                                    <li><button @click="runGroupAtPath(${pathJSON})" :disabled="isLoading"><span class="iconify" data-icon="material-symbols-light:play-arrow" style="font-size:1rem"></span> Exécuter</button></li>
                                    <li><button @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, -1)" :disabled="isFirstInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})"><span class="iconify" data-icon="material-symbols-light:arrow-upward" style="font-size:1rem"></span> Monter</button></li>
                                    <li><button @click="moveItemInGroup(${parentPathJSON}, 'child', ${originalIndex}, 1)" :disabled="isLastInGroup(getGroupAtPath(${parentPathJSON}), 'child', ${originalIndex})"><span class="iconify" data-icon="material-symbols-light:arrow-downward" style="font-size:1rem"></span> Descendre</button></li>
                                    <li><button @click="addNestedGroup(${pathJSON})"><span class="iconify" data-icon="material-symbols-light:create-new-folder" style="font-size:1rem"></span> Ajouter un sous-groupe</button></li>
                                    <li><button @click="openAddCellToGroupModal(${pathJSON})"><span class="iconify" data-icon="material-symbols-light:add" style="font-size:1rem"></span> Ajouter une cellule</button></li>
                                    <li><button class="text-error" @click="deleteGroupAtPath(${pathJSON})"><span class="iconify" data-icon="material-symbols-light:delete" style="font-size:1rem"></span> Supprimer</button></li>
                                </ul>
                            </div>
                        </div>`;

                    // Bande accordion pour sous-groupe
                    const accordionBand = `
                        <div x-show="getGroupAtPath(${pathJSON})?.accordion" 
                             @click="toggleAccordion(${pathJSON})"
                             class="flex items-center gap-2 py-2 px-4 bg-base-200 border-b border-base-300 cursor-pointer select-none hover:bg-base-300 transition-colors duration-200">
                            <span class="text-sm transition-transform duration-200" :class="getGroupAtPath(${pathJSON})?.accordionOpen ? 'rotate-90' : ''">▶</span>
                            <span class="font-semibold text-sm" x-text="getGroupAtPath(${pathJSON})?.title || ''"></span>
                        </div>`;

                    // Contenu du sous-groupe (cellules + sous-groupes récursifs)
                    const content = `
                        <div class="p-2" x-show="!getGroupAtPath(${pathJSON})?.accordion || getGroupAtPath(${pathJSON})?.accordionOpen" x-collapse
                             x-data="{ _activeTabKey: null }"
                             x-init="if (getGroupAtPath(${pathJSON})?.tabsChild) { const items = getAllItemsSorted(getGroupAtPath(${pathJSON})); if (items.length > 0) _activeTabKey = (items[0].type === 'cell' ? 'c-' : 'g-') + items[0].originalIndex; }">
                            <!-- Barre d'onglets (mode client + tabsChild) -->
                            <div x-show="!devMode && getGroupAtPath(${pathJSON})?.tabsChild" role="tablist" class="tabs tabs-box mb-2">
                                <template x-for="(tabItem, tabIdx) in getAllItemsSorted(getGroupAtPath(${pathJSON}))" :key="'tab-' + (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex">
                                    <a role="tab" class="tab"
                                       :class="{ 'tab-active': _activeTabKey === ((tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex) }"
                                       @click="_activeTabKey = (tabItem.type === 'cell' ? 'c-' : 'g-') + tabItem.originalIndex"
                                       x-text="getTabName(tabItem, tabIdx)"></a>
                                </template>
                            </div>
                            <div class="flex gap-2" :class="(!devMode && getGroupAtPath(${pathJSON})?.tabsChild) ? 'flex-col' : ((getGroupAtPath(${pathJSON})?.direction || 'row') === 'row' ? 'flex-row flex-wrap' : 'flex-col')">
                                <!-- Cellules du groupe -->
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
                                
                                <!-- Sous-groupes récursifs -->
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
                        </div>`;

                    return header + accordionBand + content;
                },
    };
}
