// @ts-nocheck

export function pagesMixin() {
    return {
                addPage() {
                    const newPage = {
                        _id: ConfigManager.generatePageId(),
                        name: `Feuille ${this.pages.length + 1}`,
                        groups: [],
                        linkGroups: []
                    };
                    this.pages.push(newPage);
                    this.activePageIndex = this.pages.length - 1;
                },

                deletePage(index) {
                    if (this.pages.length <= 1) {
                        this.setStatus('Impossible de supprimer la dernière page', 'error');
                        return;
                    }
                    if (confirm(`Supprimer la page "${this.pages[index].name}" ?`)) {
                        this.pages.splice(index, 1);
                        if (this.activePageIndex >= this.pages.length) {
                            this.activePageIndex = this.pages.length - 1;
                        }
                    }
                },

                // Drag & drop pour réorganiser les pages
                draggedPageIndex: null,
                dragOverPageIndex: null,

                startPageDrag(index, event) {
                    if (!this.devMode) return;
                    this.draggedPageIndex = index;
                    event.dataTransfer.effectAllowed = 'move';
                    event.dataTransfer.setData('text/plain', index);
                },

                onPageDragOver(index, event) {
                    if (this.draggedPageIndex === null || this.draggedPageIndex === index) return;
                    event.preventDefault();
                    this.dragOverPageIndex = index;
                },

                onPageDragLeave() {
                    this.dragOverPageIndex = null;
                },

                onPageDrop(targetIndex, event) {
                    event.preventDefault();
                    if (this.draggedPageIndex === null || this.draggedPageIndex === targetIndex) {
                        this.draggedPageIndex = null;
                        this.dragOverPageIndex = null;
                        return;
                    }
                    const [movedPage] = this.pages.splice(this.draggedPageIndex, 1);
                    this.pages.splice(targetIndex, 0, movedPage);
                    // Ajuster l'index actif si nécessaire
                    if (this.activePageIndex === this.draggedPageIndex) {
                        this.activePageIndex = targetIndex;
                    } else if (this.draggedPageIndex < this.activePageIndex && targetIndex >= this.activePageIndex) {
                        this.activePageIndex--;
                    } else if (this.draggedPageIndex > this.activePageIndex && targetIndex <= this.activePageIndex) {
                        this.activePageIndex++;
                    }
                    this.draggedPageIndex = null;
                    this.dragOverPageIndex = null;
                    this.saveToLocalStorage();
                },

                endPageDrag() {
                    this.draggedPageIndex = null;
                    this.dragOverPageIndex = null;
                },

                switchPage(index) {
                    if (index >= 0 && index < this.pages.length) {
                        this.activePageIndex = index;
                    }
                },

                // Active une page et exécute ses cellules à la première ouverture (stop si source vide, bouton, etc.)
                async activatePage(index) {
                    if (index < 0 || index >= this.pages.length) return;
                    const page = this.pages[index];
                    this.activePageIndex = index;
                    if (!this._pagesInitialized.has(page._id)) {
                        this._pagesInitialized.add(page._id);
                        await this.runAllGroups();
                    }
                    this.$nextTick(() => setTimeout(() => this.refreshMarkdownCellsForPage(index), 50));
                },

                // Rafraîchit les hauteurs des cellules markdown en mode client (EasyMDE _easyMDEcli uniquement)
                // Pas _easyMDE (dev) : cm.refresh() casse l'édition
                refreshMarkdownCellsForPage(pageIndex) {
                    const page = this.pages[pageIndex];
                    if (!page) return;
                    const refreshCells = (groups) => {
                        (groups || []).forEach(group => {
                            (group.cells || []).forEach(cell => {
                                if (cell.type === 'markdown') {
                                    const inst = cell._easyMDEcli;
                                    const cm = inst?.codemirror || inst?.cm;
                                    if (cm?.refresh) cm.refresh();
                                }
                            });
                            if (group.children) refreshCells(group.children);
                        });
                    };
                    refreshCells(page.groups || []);
                    refreshCells(page.linkGroups || []);
                },

                // Détermine si une cellule doit être affichée (fix pour les cases vides en mode view)
                shouldShowCell(cell) {
                    if (this.devMode) return true;

                    // Si clientVisible est activé pour les cellules SQL, forcer l'affichage
                    if (ConfigManager.getCellQueryClientVisible(cell, 0)) {
                        return true;
                    }

                    // Bouton : affiché uniquement si buttonLabel est non vide (refacto.md)
                    if (cell.type === 'buttonRunNextCells') return !!cell.buttonLabel;
                    // SQL : caché car pas d'output visuel utile en mode view
                    if (cell.type === 'sqlRecursiveParse') return false;
                    // Table, Iframe, SqlStat : cachés sauf si résultat ou en cours d'exécution
                    if (['table', 'iframe', 'sqlStat'].includes(cell.type)) {
                        return cell._status === 'success' || cell._status === 'running' || (cell._results && cell._results.length > 0);
                    }
                    return true;
                },

                // Détermine si un groupe doit être affiché (récursif)
                shouldShowGroup(group) {
                    if (this.devMode) return true;

                    // Si queries[0] (condition d'affichage) est défini, _ifQueryResult doit être true pour afficher
                    if (ConfigManager.getGroupIfQuery(group)) {
                        if (group._ifQueryResult === false || group._ifQueryResult === null) {
                            return false;
                        }
                        if (group._ifQueryResult !== true) {
                            return false; // pas encore évalué ou erreur
                        }
                    }

                    // Vérifier si une des cellules du groupe est visible
                    if (group.cells && group.cells.some(cell => this.shouldShowCell(cell))) {
                        return true;
                    }

                    // Vérifier si un des enfants est visible
                    if (group.children && group.children.some(child => this.shouldShowGroup(child))) {
                        return true;
                    }

                    // Si rien n'est visible, on cache le groupe
                    return false;
                },
    };
}
