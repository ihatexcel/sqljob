// @ts-nocheck
import { _rawTableDataStore } from './executionMixin'

export function cellsMixin() {
    return {
        // Helpers factorisés pour la taille des cellules (minSizePx/Percent, maxSizePx/Percent optionnels)
                hasCellMinSize(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.minSizePx) || v(cell.minSizePercent));
                },
                hasCellMaxSize(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.maxSizePx) || v(cell.maxSizePercent));
                },
                hasCellHeight(cell) {
                    const v = x => (x !== undefined && x !== null && String(x).trim() !== '');
                    return cell && (v(cell.minHeightPx) || v(cell.minHeightPercent) || v(cell.maxHeightPx) || v(cell.maxHeightPercent));
                },
                isSqlCellWithEditor(type) {
                    return ['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective', 'pdfme', 'publipostageWord', 'echart'].includes(type);
                },
                /** Logique d'affichage pilotée par le schéma (bodyDisplay) */
                bodyDisplayShouldShowSkeleton(cell) {
                    if (!cell) return false;
                    // Markdown engine text : contenu chargé directement, aucune exécution → jamais de skeleton
                    if (cell.type === 'markdown' && ConfigManager.getCellEngine(cell, 'main') === 'text') return false;
                    const schema = CELL_TYPE_SCHEMAS.types[cell.type];
                    const disp = schema?.bodyDisplay?.showSkeleton ?? { when: 'running', excludeTypes: ['uiParameter'] };
                    if (disp.when === 'never') return false;
                    if (disp.excludeTypes?.includes(cell.type)) return false;
                    if (disp.excludeWhenSqlEditor && this.isSqlCellWithEditor(cell.type) && this.showSqlEditorVisible(cell)) return false;
                    if (cell._status === 'running') return true;
                    if (disp.sourceLoading && cell.type === 'source' && cell._fileName && !cell._loaded) return true;
                    return false;
                },
                bodyDisplayShouldShowContent(cell) {
                    if (!cell) return false;
                    return !this.bodyDisplayShouldShowSkeleton(cell);
                },
                /** Retourne les variables CSS pour la hauteur (à utiliser avec style). Utilise max/min en CSS. */
                getCellHeightVars(cell) {
                    if (!cell) return '';
                    const toPx = v => {
                        if (v == null || String(v).trim() === '') return '';
                        const s = String(v).trim();
                        return /^\d+(\.\d+)?$/.test(s) ? s + 'px' : s;
                    };
                    const toPct = v => {
                        if (v == null || String(v).trim() === '') return '';
                        const s = String(v).trim();
                        return /^\d+(\.\d+)?$/.test(s) ? s + '%' : s;
                    };
                    const parts = [];
                    const mhp = toPx(cell.minHeightPx); const mhc = toPct(cell.minHeightPercent);
                    if (mhp) parts.push(`--cell-min-h-px:${mhp}`);
                    if (mhc) parts.push(`--cell-min-h-pct:${mhc}`);
                    const mxp = toPx(cell.maxHeightPx); const mxc = toPct(cell.maxHeightPercent);
                    if (mxp) parts.push(`--cell-max-h-px:${mxp}`);
                    if (mxc) parts.push(`--cell-max-h-pct:${mxc}`);
                    return parts.length ? parts.join(';') : '';
                },
                getCellSizeOuterClass(cell, isColumn) {
                    if (isColumn) return 'flex-col w-full';
                    return this.hasCellMinSize(cell) ? '' : 'min-w-[200px]';
                },
                // Style pour le wrapper (flex child) : order + min/max width/height. Combinaison px et % via max()/min() CSS.
                getCellWrapperStyle(cell, isColumn, order) {
                    const s = { order: order ?? 0 };
                    const toPx = v => {
                        if (v === undefined || v === null) return null;
                        const str = String(v).trim();
                        if (str === '') return null;
                        return /^\d+(\.\d+)?$/.test(str) ? str + 'px' : str;
                    };
                    const toPct = v => {
                        if (v === undefined || v === null) return null;
                        const str = String(v).trim();
                        if (str === '') return null;
                        return /^\d+(\.\d+)?$/.test(str) ? str + '%' : str;
                    };
                    if (!isColumn) {
                        const minPx = toPx(cell?.minSizePx) ?? toPx(cell?.minSize);
                        const minPct = toPct(cell?.minSizePercent);
                        if (minPx && minPct) s.minWidth = `max(${minPx}, ${minPct})`;
                        else if (minPx) s.minWidth = minPx;
                        else if (minPct) s.minWidth = minPct;
                        const maxPx = toPx(cell?.maxSizePx) ?? toPx(cell?.maxSize);
                        const maxPct = toPct(cell?.maxSizePercent);
                        if (maxPx && maxPct) s.maxWidth = `min(${maxPx}, ${maxPct})`;
                        else if (maxPx) s.maxWidth = maxPx;
                        else if (maxPct) s.maxWidth = maxPct;
                    }
                    return s;
                },
                getCellSizeInnerClass() {
                    return 'w-full';
                },

                createNewCell(type) {
                    const newCell = {
                        _id: this.generateCellId(),
                        _status: null,
                        _results: null,
                        _resultInfo: null,
                        _order: 0,
                        type
                    };
                    const baseName = this.generateUniqueCellName(type);
                    newCell.name = baseName;
                    CellConfigService.ensureCellFromSchema(newCell, type, { baseName });
                    if (type === 'source') {
                        newCell._fileName = '';
                        newCell._currentFile = null;
                        newCell._isDragging = false;
                        newCell._loaded = false;
                    }
                    if (type === 'uiParameter') {
                        newCell._value = '';
                        newCell._options = [];
                        newCell._initialized = false;
                        newCell._userModified = false;
                    }
                    if (type === 'publipostageWord') {
                        newCell.docxTemplateBase64 = null;
                        newCell.docxTemplateFileName = '';
                        newCell._showParsedQuery = false;
                        newCell._showParsedQuery2 = false;
                        newCell._parseLevels = [];
                        newCell._parseLevels2 = [];
                        newCell._isDragging = false;
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
                            }, null, 2);
                        }
                        newCell._showParsedQuery = false;
                        newCell._showParsedQuery2 = false;
                        newCell._parseLevels = [];
                        newCell._parseLevels2 = [];
                    }
                    if (['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective'].includes(type)) newCell._showParsedQuery = false;
                    if (type === 'perspective') {
                        newCell._perspectiveReady = false;
                        newCell._perspectiveWorker = null;
                        newCell._perspectiveTable = null;
                    }
                    return newCell;
                },

                addGroup(cellType) {
                    const newGroup = this.createNewGroup('row');
                    newGroup.cells = [this.createNewCell(cellType)];
                    this.groups.push(newGroup);
                    this.showAddGroupModal = false;
                },

                // Ajouter une cellule à un groupe (accepte path ou groupIndex)
                addCellToGroup(pathOrIndex, cellType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        if (!group.cells) group.cells = [];
                        const newCell = this.createNewCell(cellType);
                        newCell._order = this.getNextOrder(group);
                        group.cells.push(newCell);
                    }
                    this.addCellToGroupModal = { open: false, path: null };
                    this.forceUpdate();
                },

                // Ouvrir le modal pour ajouter une cellule à un groupe (accepte path ou groupIndex)
                openAddCellToGroupModal(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.addCellToGroupModal = { open: true, path };
                },

                // Ouvrir le modal pour insérer un groupe à une position
                openInsertGroupModal(atIndex) {
                    this.insertGroupModal = { open: true, atIndex: atIndex };
                },

                // Insérer un groupe à une position spécifique
                insertGroupAt(atIndex, cellType) {
                    const newGroup = this.createNewGroup('row');
                    newGroup.cells = [this.createNewCell(cellType)];
                    this.groups.splice(atIndex, 0, newGroup);
                    this.insertGroupModal = { open: false, atIndex: null };
                    this.forceUpdate();
                },

                // Ouvrir le modal pour insérer une cellule à une position (accepte path ou groupIndex)
                openInsertCellModal(pathOrIndex, atCellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.insertCellModal = { open: true, path, atCellIndex };
                },

                // Insérer une cellule à une position spécifique (accepte path ou groupIndex)
                insertCellAt(pathOrIndex, atCellIndex, cellType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (group) {
                        if (!group.cells) group.cells = [];
                        const newCell = this.createNewCell(cellType);
                        newCell._order = this.getNextOrder(group);
                        group.cells.splice(atCellIndex, 0, newCell);
                    }
                    this.insertCellModal = { open: false, path: null, atCellIndex: null };
                    this.forceUpdate();
                },

                // Supprimer un groupe (wrapper pour deleteGroupAtPath)
                deleteGroup(pathOrIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.deleteGroupAtPath(path);
                },

                // Déplacer un groupe (wrapper pour moveGroupAtPath)
                moveGroup(pathOrIndex, direction) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.moveGroupAtPath(path, direction);
                },

                // Supprimer une cellule (accepte path ou groupIndex)
                async deleteCellAt(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const group = this.getGroupAtPath(path);
                    if (!group || !group.cells) return;

                    const hasChildren = group.children && group.children.length > 0;

                    if (group.cells.length === 1 && !hasChildren) {
                        // Si c'est la dernière cellule et pas d'enfants, supprimer le groupe
                        await this.deleteGroupAtPath(path);
                    } else {
                        if (await Alpine.store('confirmModal').show('Supprimer cette cellule ?')) {
                            const cell = group.cells[cellIndex];
                            _rawTableDataStore.delete(cell._id);
                            if (this._tables && this._tables[cell._id]) {
                                this._tables[cell._id].destroy();
                                delete this._tables[cell._id];
                            }
                            group.cells.splice(cellIndex, 1);
                            this.forceUpdate();
                        }
                    }
                },

                // Déplacer une cellule dans un groupe (accepte path ou groupIndex)
                moveCellInGroup(pathOrIndex, cellIndex, direction) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.moveCellInGroupAtPath(path, cellIndex, direction);
                },


                /** S'assure qu'une cellule a un nom unique (génération auto si absent). Rétrocompat : uiParameter referenceName → name. */
                ensureCellName(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || !cell.type) return;
                    if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                        cell.name = String(cell.referenceName).trim();
                    }
                    const n = cell.name != null ? String(cell.name).trim() : '';
                    if (!n) cell.name = this.generateUniqueCellName(cell.type, cell._id);
                },

                /** Parcourt toutes les cellules et assigne un nom unique à celles qui n'en ont pas. Rétrocompat : uiParameter referenceName → name. */
                ensureAllCellsHaveNames() {
                    const visit = (groups, pathPrefix) => {
                        for (let gi = 0; gi < (groups || []).length; gi++) {
                            const group = groups[gi];
                            const groupPath = [...pathPrefix, gi];
                            for (let ci = 0; ci < (group.cells || []).length; ci++) {
                                const cell = group.cells[ci];
                                if (!cell || !cell.type) continue;
                                if (cell.type === 'uiParameter' && cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                                    cell.name = String(cell.referenceName).trim();
                                }
                                if (!cell.name || !String(cell.name).trim()) {
                                    cell.name = this.generateUniqueCellName(cell.type, cell._id);
                                }
                            }
                            if (group.children) visit(group.children, groupPath);
                        }
                    };
                    for (let pi = 0; pi < this.pages.length; pi++) {
                        visit(this.pages[pi].groups || [], [pi]);
                        if (this.pages[pi].linkGroups) visit(this.pages[pi].linkGroups, [-1, pi]);
                    }
                },

                // Ouvrir la config d'une cellule (accepte path ou groupIndex)
                openCellConfig(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    this.ensureCellName(path, cellIndex);
                    this.cellConfigModal = { open: true, path, cellIndex };
                    // Forcer la mise à jour des selects après le rendu (Type cellule + Type langage pour markdown)
                    setTimeout(() => {
                        const modal = document.querySelector('[aria-labelledby="modal-cell-config-title"]');
                        const cell = this.getCellAtPath(path, cellIndex);
                        if (!modal || !cell) return;
                        const selects = modal.querySelectorAll('select');
                        if (selects[0]) selects[0].value = cell.type;
                        if (['markdown', 'iframe', 'uiParameter'].includes(cell.type) && selects[1]) {
                            const engine = ConfigManager.getCellEngine(cell, 'main');
                            if (engine && selects[1].value !== engine) selects[1].value = engine;
                        }
                    }, 50);
                },

                closeCellConfig() {
                    this.cellConfigModal.open = false;
                    // Ne pas mettre path/cellIndex à null pour éviter les erreurs Alpine
                    // lors de la transition de fermeture (getCellAtPath(null) → crash)
                },

                getCommonParamsForType(type) { return CellConfigService.getCommonParamsForType(type); },
                getCommonParamsExcludingName(type) { return (CellConfigService.getCommonParamsForType(type) ?? []).filter(p => p !== 'name'); },
                getCommonParamDef(paramKey, type) { return CellConfigService.getCommonParamDef(paramKey, type); },
                getSpecificParamsForType(type) { return CellConfigService.getSpecificParamsForType(type); },
                isSpecificParamVisible(param, cell) { return CellConfigService.isSpecificParamVisible(param, cell); },
                getQueryLabelForType(type, indexOrName) { const schema = CELL_TYPE_SCHEMAS.types[type]; const name = typeof indexOrName === 'string' ? indexOrName : schema?.queryNames?.[indexOrName]; return schema?.queryLabels?.[name] || schema?.queryLabels?.[indexOrName] || CELL_TYPE_SCHEMAS.common.queries?.label || 'Requête SQL'; },
                getQueryCountForType(type) { return CELL_TYPE_SCHEMAS.types[type]?.queryCount ?? 1; },
                getCellValueByPath(cell, path) { return CellConfigService.getCellValueByPath(cell, path); },
                setCellValueByPath(cell, path, value) { CellConfigService.setCellValueByPath(cell, path, value); },

                onCellTypeChange(pathOrIndex, cellIndex, oldType) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    _rawTableDataStore.delete(cell._id);
                    cell._results = null;
                    cell._resultInfo = null;

                    const newType = cell.type;
                    const baseName = cell.name && String(cell.name).trim() ? cell.name : this.generateUniqueCellName(newType);
                    if (!cell.name || !String(cell.name).trim()) cell.name = baseName;

                    CellConfigService.applyDefaultsOnTypeChange(cell, newType, { oldType, baseName });

                    if (cell.type === 'source') {
                        if (!cell.name) cell.name = this.generateUniqueSourceName();
                        else if (!ConfigManager.getCellQuery(cell, 'main')?.trim()) ConfigManager.setCellQuery(cell, 'main', `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM '{fileNameUpload}'`);
                        if (!ConfigManager.getCellQuery(cell, 'fallback')?.trim()) ConfigManager.setCellQuery(cell, 'fallback', (CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.find(q => q.name === 'fallback')?.sql || CELL_TYPE_SCHEMAS.types.source?.defaults?.queries?.[1]?.sql || `CREATE OR REPLACE TABLE ${cell.name} AS SELECT * FROM read_csv('{fileNameUpload}', HEADER=true, AUTO_DETECT=true, SAMPLE_SIZE=-1, IGNORE_ERRORS=true)`));
                        if (cell._fileName === undefined) cell._fileName = '';
                        if (cell._currentFile === undefined) cell._currentFile = null;
                        if (cell._isDragging === undefined) cell._isDragging = false;
                        if (cell._loaded === undefined) cell._loaded = false;
                        if (cell._showParsedQuery2 === undefined) cell._showParsedQuery2 = false;
                    }
                    if (cell.type === 'uiParameter') {
                        if (cell.referenceName && (!cell.name || !String(cell.name).trim())) cell.name = String(cell.referenceName).trim();
                        if (!ConfigManager.getCellReferenceName(cell)) cell.name = this.generateUniqueCellName('uiParameter', cell._id);
                        if (cell._value === undefined) cell._value = '';
                        if (!cell._options) cell._options = [];
                        cell._initialized = false;
                        cell._userModified = false;
                    }
                    if (cell.type === 'publipostageWord') {
                        if (cell.docxTemplateBase64 === undefined) cell.docxTemplateBase64 = null;
                        if (cell.docxTemplateFileName === undefined) cell.docxTemplateFileName = '';
                        if (cell._showParsedQuery === undefined) cell._showParsedQuery = false;
                        if (cell._showParsedQuery2 === undefined) cell._showParsedQuery2 = false;
                        if (!cell._parseLevels) cell._parseLevels = [];
                        if (!cell._parseLevels2) cell._parseLevels2 = [];
                        if (cell._isDragging === undefined) cell._isDragging = false;
                    }
                    if (['sqlRecursiveParse', 'table', 'iframe', 'sqlStat', 'perspective'].includes(cell.type)) {
                        if (cell._showParsedQuery === undefined) cell._showParsedQuery = false;
                    }
                    if (cell.type === 'perspective') {
                        cell._perspectiveReady = false;
                        cell._perspectiveWorker = null;
                        cell._perspectiveTable = null;
                    }
                },

                /** Génère un nom unique pour une cellule (tous types confondus). excludeId = _id de la cellule à exclure. */
                generateUniqueCellName(type, excludeId = null) {
                    const existingNames = new Set();
                    const collectNames = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell.name && String(cell.name).trim() && cell._id !== excludeId) {
                                    existingNames.add(String(cell.name).trim());
                                }
                            }
                            if (group.children) collectNames(group.children);
                        }
                    };
                    for (const page of this.pages) {
                        collectNames(page.groups || []);
                        if (page.linkGroups) collectNames(page.linkGroups);
                    }
                    const prefix = CELL_TYPE_SCHEMAS?.types[type]?.defaultNamePrefix ?? 'cell';
                    let num = 1;
                    while (existingNames.has(prefix + num)) num++;
                    return prefix + num;
                },

                /** Vérifie si un nom est déjà utilisé par une autre cellule (tous types). */
                isCellNameUsed(name, excludeId = null) {
                    const trimmed = name && String(name).trim();
                    if (!trimmed) return false;
                    const collectFromGroups = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell._id !== excludeId && cell.name && String(cell.name).trim() === trimmed) return true;
                            }
                            if (group.children && collectFromGroups(group.children)) return true;
                        }
                        return false;
                    };
                    for (const page of this.pages) {
                        if (collectFromGroups(page.groups || [])) return true;
                        if (page.linkGroups && collectFromGroups(page.linkGroups)) return true;
                    }
                    return false;
                },

                generateUniqueSourceName() {
                    return this.generateUniqueCellName('source');
                },

                /** Valide le nom d'une cellule (unicité globale, format SQL pour source). */
                validateCellName(path, cellIndex) {
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell) return;

                    let currentName = cell.name != null ? String(cell.name).trim() : '';
                    if (!currentName) {
                        this.setStatus('Le nom ne peut pas être vide', 'error');
                        cell.name = this.generateUniqueCellName(cell.type, cell._id);
                        return;
                    }

                    if (!ConfigManager.isCellNameValid(cell, currentName)) {
                        this.setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error');
                        cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
                        return;
                    }

                    if (this.isCellNameUsed(currentName, cell._id)) {
                        this.setStatus(`Le nom "${currentName}" est déjà utilisé par une autre cellule`, 'error');
                        cell.name = this.generateUniqueCellName(cell.type, cell._id);
                    }
                },

                // Valider l'unicité du nom de source (accepte path ou groupIndex) - vérifie dans TOUTES les pages
                validateSingleSourceName(pathOrIndex, cellIndex) {
                    const path = Array.isArray(pathOrIndex) ? pathOrIndex : [pathOrIndex];
                    const cell = this.getCellAtPath(path, cellIndex);
                    if (!cell || cell.type !== 'source') return;

                    const currentName = cell.name?.trim();
                    if (!currentName) {
                        this.setStatus('Le nom de la source ne peut pas être vide', 'error');
                        cell.name = this.generateUniqueSourceName();
                        return;
                    }

                    // Vérifier le format (alphanumériques et underscores seulement)
                    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(currentName)) {
                        this.setStatus('Le nom doit commencer par une lettre ou _ et ne contenir que des lettres, chiffres et _', 'error');
                        cell.name = currentName.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
                        return;
                    }

                    // Vérifier l'unicité dans toutes les pages
                    if (!this.isNameUniqueAcrossPages(currentName, 'source', this.activePageIndex, path, cellIndex)) {
                        this.setStatus(`Le nom de source "${currentName}" est déjà utilisé dans une autre page`, 'error');
                        cell.name = this.generateUniqueSourceName();
                    }
                },
    };
}
