// @ts-nocheck

export function editorsMixin() {
    return {
                // Générer le HTML de l'éditeur pour les cellules uiParameter (SQL, JS ou Texte)
                renderUiParameterEditor(cell) {
                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const placeholder = isJs ? 'return ["Option 1", "Option 2"]; // Pour dropdown\nreturn "Valeur"; // Pour input' : isText ? 'Saisir le texte (une ligne par option pour dropdown)' : 'SELECT * from source1';
                    const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL';
                    const languageIcon = isJs ? '⚡' : isText ? '📝' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info';

                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass);
                },

                // Générer l'éditeur condition d'affichage (queries.main) pour les groupes
                renderGroupIfQueryEditor(group) {
                    if (!group) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>';
                    const q0 = ConfigManager.ensureGroupQueries(group);
                    if (!q0) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>';
                    const groupId = 'ifquery-' + (group.id || 'g');
                    const langType = q0.engine || 'sql';
                    const isJs = langType === 'js';
                    const placeholder = isJs ? 'return true;  // ou return false; pour masquer le groupe' : 'SELECT true  -- ou SELECT false pour masquer le groupe';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    const badgeIcon = isJs ? '⚡' : '🗄️';
                    const badgeLabel = isJs ? 'JavaScript' : 'SQL';
                    if (isJs) {
                        return `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                placeholder="${placeholder}"></textarea>
                        </div>`;
                    }
                    return `<div>
                        <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                        <div class="codemirror-sql-container" x-ref="cm_${groupId}"
                            x-init="$nextTick(async () => {
                                const container = $refs['cm_${groupId}'];
                                if (!container || !group) return;
                                const q0 = ConfigManager.ensureGroupQueries(group);
                                const existingEditor = group._cmEditor_ifQuery;
                                if (existingEditor && document.body.contains(existingEditor.dom)) return;
                                if (existingEditor) { existingEditor.destroy(); group._cmEditor_ifQuery = null; }
                                try {
                                    await CDNManager.loadCodeMirrorSQL();
                                    const schema = {};
                                    if (notebookApp && notebookApp.tablesData) {
                                        for (const [tableName, data] of Object.entries(notebookApp.tablesData)) {
                                            if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                                        }
                                    }
                                    group._cmEditor_ifQuery = CDNManager.createSqlEditor(container, q0.sql || '', (v) => { q0.sql = v; }, { schema, dialect: 'duckdb' });
                                } catch (err) {
                                    console.error('Erreur CodeMirror condition groupe:', err);
                                    container.innerHTML = '<textarea class=&quot;textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm&quot; placeholder=&quot;${placeholder}&quot;></textarea>';
                                    const ta = container.querySelector('textarea');
                                    if (ta) { ta.value = q0.sql || ''; ta.addEventListener('input', e => { q0.sql = e.target.value; }); }
                                }
                            })"></div>
                    </div>`;
                },

                // Initialiser l'éditeur condition d'affichage dans la modale (queries.main)
                renderGroupIfQueryEditorInit(group, container) {
                    if (!group || !container) return;
                    const q0 = ConfigManager.ensureGroupQueries(group);
                    if (!q0) return;
                    const langType = q0.engine || 'sql';
                    const isJs = langType === 'js';
                    const placeholder = isJs ? 'return true;  // ou return false; pour masquer le groupe' : 'SELECT true  -- ou SELECT false pour masquer le groupe';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    const badgeIcon = isJs ? '⚡' : '🗄️';
                    const badgeLabel = isJs ? 'JavaScript' : 'SQL';

                    // Nettoyer l'éditeur existant
                    if (group._cmEditor_ifQuery) {
                        group._cmEditor_ifQuery.destroy();
                        group._cmEditor_ifQuery = null;
                    }

                    if (isJs) {
                        container.innerHTML = `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                placeholder="${placeholder}"></textarea>
                        </div>`;
                        const textarea = container.querySelector('textarea');
                        if (textarea) {
                            textarea.value = q0.sql || '';
                            textarea.addEventListener('input', (e) => { q0.sql = e.target.value; });
                        }
                    } else {
                        container.innerHTML = `<div>
                            <span class="badge badge-soft ${badgeClass} text-xs mb-2">${badgeIcon} ${badgeLabel}</span>
                            <div class="codemirror-sql-container"></div>
                        </div>`;
                        const cmContainer = container.querySelector('.codemirror-sql-container');
                        if (cmContainer) {
                            CDNManager.loadCodeMirrorSQL().then(() => {
                                const schema = {};
                                if (notebookApp && notebookApp.tablesData) {
                                    for (const [tableName, data] of Object.entries(notebookApp.tablesData)) {
                                        if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                                    }
                                }
                                group._cmEditor_ifQuery = CDNManager.createSqlEditor(cmContainer, q0.sql || '', (v) => { q0.sql = v; }, { schema, dialect: 'duckdb' });
                            }).catch(err => {
                                console.error('Erreur CodeMirror condition groupe:', err);
                                cmContainer.innerHTML = `<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm" placeholder="${placeholder}"></textarea>`;
                                const textarea = cmContainer.querySelector('textarea');
                                if (textarea) {
                                    textarea.value = q0.sql || '';
                                    textarea.addEventListener('input', (e) => { q0.sql = e.target.value; });
                                }
                            });
                        }
                    }
                },

                // Générer le HTML de l'éditeur SQL partagé (unifié pour tous les types de requêtes)
                // queryType: 'query'|'query2' -> queryName: 'main'|'fallback'|'filename' selon le type de cellule
                // applySourceDefaultIfEmpty: si true et cell.type==='source', charge la requête par défaut du schéma à l'init si vide (placeholder reste simple)
                renderSqlQueryEditor(cell, placeholder, showResultInfo, queryType = 'query', showParsedQueryProp = '_showParsedQuery', languageLabel = null, languageIcon = null, badgeClass = null, pathExpr = null, cellIdxExpr = null, applySourceDefaultIfEmpty = false) {
                    const cellId = cell._id;
                    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main';
                    const queryIndex = ConfigManager.getQueryIndexByName(cell, queryName);
                    const showParsedQuery = cell[showParsedQueryProp];
                    const parseLevelsProp = queryType === 'query2' ? '_parseLevels2' : '_parseLevels';

                    const languageType = ConfigManager.getCellEngine(cell, queryName);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const finalLanguageLabel = languageLabel || (isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL');
                    const finalLanguageIcon = languageIcon || (isJs ? '⚡' : isText ? '📝' : '🗄️');
                    const finalBadgeClass = badgeClass || (isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info');

                    return `
                        <div>
                            <div class="relative w-full">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-xs text-base-content/70 flex items-center gap-2">
                                        <span class="badge badge-soft ${finalBadgeClass}">${finalLanguageIcon} ${finalLanguageLabel}</span>
                                        ${this.devMode && !isText ? `
                                            <label class="label cursor-pointer justify-start gap-2 py-0 min-h-0">
                                                <input type="checkbox" class="toggle toggle-sm"
                                                       x-model="cellItem.cell.${showParsedQueryProp}" />
                                                <span class="label-text text-xs">Parsé</span>
                                            </label>
                                        ` : ''}
                                    </span>
                                    <div class="flex gap-1 items-center">
                                        ${!showParsedQuery && this.devMode && !isText ? `
                                            <button 
                                                @click="$store.templateModal.open('${cellId}', '${queryType}', '${languageType}')"
                                                class="px-2 py-1 border border-base-300 bg-base-200 text-base-content/70 rounded cursor-pointer text-xs transition-all hover:border-primary hover:text-base-content" 
                                                title="Insérer un template ${isJs ? 'JavaScript' : 'SQL'}">
                                                📋 Templates
                                            </button>
                                        ` : ''}
                                        ${!showParsedQuery && pathExpr != null && (cellIdxExpr === 0 || cellIdxExpr) ? `
                                            <button 
                                                @click="runCellAt(${pathExpr}, ${cellIdxExpr})"
                                                :disabled="isLoading"
                                                class="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                                                title="Exécuter la requête">
                                                <span x-show="cellItem.cell._status === 'running'" class="loading loading-spinner loading-sm"></span>
                                                <svg x-show="cellItem.cell._status !== 'running'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                            </button>
                                        ` : ''}
                                        ${!showParsedQuery ? `
                                            <button 
                                                x-ref="copyBtn_${cellId}_${queryType}"
                                                @click="(() => {
                                                    const text = ConfigManager.getCellQuery(cellItem.cell, '${queryName}') || '';
                                                    const btn = $refs['copyBtn_${cellId}_${queryType}'];
                                                    if (!btn) return;
                                                    navigator.clipboard.writeText(text).then(() => {
                                                        const originalHTML = btn.innerHTML;
                                                        btn.innerHTML = '<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;14&quot; height=&quot;14&quot; viewBox=&quot;0 0 24 24&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; stroke-width=&quot;2&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;><polyline points=&quot;20 6 9 17 4 12&quot;></polyline></svg>';
                                                        btn.classList.add('text-success');
                                                        setTimeout(() => {
                                                            btn.innerHTML = originalHTML;
                                                            btn.classList.remove('text-success');
                                                        }, 1500);
                                                    }).catch(err => console.error('Erreur copie:', err));
                                                })()"
                                                class="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer" 
                                                title="Copier le code">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2 2v1"></path></svg>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                ${!showParsedQuery ? (isJs || isText ? `
                                    <textarea 
                                        class="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                                        x-model="cellItem.cell.queries[${queryIndex}].sql"
                                        placeholder="${placeholder}"></textarea>
                                ` : `
                                    <div 
                                        class="codemirror-sql-container"
                                        id="cm-${cellId}-${queryType}"
                                        x-ref="cm_${cellId}_${queryType}"
                                        x-init="$nextTick(() => initCodeMirrorForCell(cellItem, '${cellId}', '${queryType}', '${queryName}', ${queryIndex}, ${applySourceDefaultIfEmpty}, '${String(placeholder || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n')}', typeof $root !== 'undefined' ? $root : null))"
                                        x-effect="(() => {
                                            const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cellItem.cell) : cellItem.cell;
                                            const editor = rawCell._cmEditor_${queryType};
                                            if (editor && editor.state && document.body.contains(editor.dom)) {
                                                const currentDoc = editor.state.doc.toString();
                                                const cellValue = ConfigManager.getCellQuery(cellItem.cell, '${queryName}') || '';
                                                if (currentDoc !== cellValue && !editor.hasFocus) {
                                                    editor.dispatch({
                                                        changes: { from: 0, to: currentDoc.length, insert: cellValue }
                                                    });
                                                }
                                            }
                                        })()"
                                    ></div>
                                `) : `
                                    <div>
                                        ${(function() {
                                            const raw = cell[parseLevelsProp] || [];
                                            if (raw.length > 0) return raw;
                                            if (cell.type === 'source') {
                                                const q = ConfigManager.getCellQuery(cell, '${queryName}') || '';
                                                const parsed = this.getParsedSqlQuery(q, { name: cell.name || 'source1', fileNameUpload: cell._fileName || undefined });
                                                return [{ level: 'final', innerQuery: parsed, replacement: null }];
                                            }
                                            return [];
                                        }.call(this)).map((parseLevel, idx) => `
                                            <div class="relative w-full" style="margin-bottom: 0.75rem;">
                                                <div class="flex justify-between items-center mb-2">
                                                    <span class="text-xs text-base-content/70 flex items-center gap-2">
                                                        <span class="badge badge-soft badge-primary">${parseLevel.level === 'final' ? 'Final' : 'Niveau ' + parseLevel.level}</span>
                                                        <span>${parseLevel.level === 'final' ? (isJs ? 'Code final exécuté' : 'Requête finale exécutée') : (isJs ? 'Code niveau ' + parseLevel.level : 'Requête niveau ' + parseLevel.level)}</span>
                                                    </span>
                                                </div>
                                                <div class="w-full min-h-20 max-h-72 p-3 bg-base-200 border border-primary rounded-lg text-base-content font-mono text-sm overflow-auto whitespace-pre-wrap break-words">${(parseLevel.innerQuery || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')}</div>
                                                ${parseLevel.replacement ? `
                                                    <div style="margin-top: 0.1rem; padding: 0.5rem; background: var(--success-bg); border-left: 3px solid var(--success); font-family: monospace; font-size: 0.85rem;">
                                                        <strong>→ ${isJs ? 'Parsé en' : 'Résultat'}:</strong> <span>${(parseLevel.replacement || '').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;')}</span>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                `}
                            </div>
                            ${showResultInfo && cell._resultInfo ? `
                                <div class="mt-2 p-2 bg-base-200 rounded text-sm text-base-content/70">${cell._resultInfo}</div>
                            ` : ''}
                        </div>
                    `;
                },

                // Rendu sécurisé de l'éditeur SQL : ne re-render que si les propriétés pertinentes changent
                // Cela évite que x-for ou d'autres effets Alpine ne détruisent les instances CodeMirror
                safeRenderSqlEditor(el, cell, placeholder, showResultInfo, queryType = 'query', showParsedQueryProp = '_showParsedQuery', languageLabel = null, languageIcon = null, badgeClass = null, pathExpr = null, cellIdxExpr = null, applySourceDefaultIfEmpty = false) {
                    const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main';
                    const queryIndex = ConfigManager.getQueryIndexByName(cell, queryName);
                    ConfigManager.ensureCellQueries(cell, queryName);
                    // Lire uniquement les propriétés réactives qui doivent déclencher un re-rendu
                    const showParsed = cell[showParsedQueryProp];
                    const langType = ConfigManager.getCellEngine(cell, queryName);
                    const devModeVal = this.devMode;

                    // Construire une clé à partir de ces propriétés
                    const key = `${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    // Si la clé n'a pas changé et que le contenu existe déjà, ne pas re-render
                    // Cela préserve les instances CodeMirror existantes
                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    // Générer le HTML et l'injecter
                    const html = this.renderSqlQueryEditor(cell, placeholder, showResultInfo, queryType, showParsedQueryProp, languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr, applySourceDefaultIfEmpty);
                    el.innerHTML = html;

                    // Initialiser les directives Alpine dans le nouveau DOM
                    // _x_ignoreSelf empêche la ré-initialisation de l'élément lui-même (qui a déjà x-effect)
                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Version sécurisée pour l'éditeur uiParameter
                safeRenderUiParameterEditor(el, cell) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 0);
                    const devModeVal = this.devMode;

                    const key = `${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    const html = this.renderUiParameterEditor(cell);
                    el.innerHTML = html;

                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Générer l'éditeur pour les cellules markdown (SQL ou JS — requête qui retourne du markdown)
                renderMarkdownQueryEditor(cell, pathExpr, cellIdxExpr) {
                    const languageType = ConfigManager.getCellEngine(cell, 'main');
                    const isJs = languageType === 'js';
                    const placeholder = isJs ? "return '## Titre\\n\\nContenu markdown';" : "SELECT '## Titre' as markdown";
                    const languageLabel = isJs ? 'JavaScript' : 'SQL';
                    const languageIcon = isJs ? '⚡' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : 'badge-info';
                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr);
                },

                // Init CodeMirror pour une cellule (appelé depuis x-init pour éviter erreurs de parsing Alpine)
                async initCodeMirrorForCell(cellItem, cellId, queryType, queryName, queryIndex, applySourceDefaultIfEmpty, placeholder, rootComponent) {
                    const container = document.getElementById('cm-' + cellId + '-' + queryType);
                    if (!container) return;
                    const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cellItem.cell) : cellItem.cell;
                    const existingEditor = rawCell['_cmEditor_' + queryType];
                    if (existingEditor) {
                        if (!document.body.contains(existingEditor.dom)) {
                            existingEditor.destroy();
                            rawCell['_cmEditor_' + queryType] = null;
                        } else return;
                    }
                    try {
                        await CDNManager.loadCodeMirrorSQL();
                        let initialContent = ConfigManager.getCellQuery(cellItem.cell, queryName) || '';
                        if (applySourceDefaultIfEmpty && !initialContent.trim() && cellItem.cell.type === 'source') {
                            const defaultQ = CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.find(q => q.name === queryName)?.sql ?? CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.[queryIndex]?.sql;
                            if (defaultQ) {
                                initialContent = defaultQ.replace(/\{name\}/g, cellItem.cell.name || 'source1');
                                ConfigManager.setCellQuery(cellItem.cell, queryName, initialContent);
                            }
                        }
                        const schema = {};
                        const nb = (rootComponent && rootComponent._x_dataStack ? rootComponent._x_dataStack[0] : rootComponent) || null;
                        if (nb && nb.tablesData) {
                            for (const [tableName, data] of Object.entries(nb.tablesData)) {
                                if (data && data.length > 0) schema[tableName] = Object.keys(data[0]);
                            }
                        }
                        rawCell['_cmEditor_' + queryType] = CDNManager.createSqlEditor(container, initialContent,
                            (v) => ConfigManager.setCellQuery(cellItem.cell, queryName, v),
                            { schema, dialect: 'duckdb' });
                    } catch (err) {
                        console.error('Erreur init CodeMirror:', err);
                        const ph = String(placeholder || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/'/g, "\\'").replace(/"/g, '&quot;');
                        container.innerHTML = '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm" x-model="cellItem.cell.queries[' + queryIndex + '].sql" placeholder="' + ph + '"></textarea>';
                    }
                },

                // Version sécurisée pour l'éditeur markdown (sql/js)
                safeRenderMarkdownQueryEditor(el, cell, pathExpr, cellIdxExpr) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 'main');
                    const devModeVal = this.devMode;
                    const key = `md_${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;
                    if (el._sqlEditorKey === key && el.children.length > 0) return;
                    el._sqlEditorKey = key;
                    const html = this.renderMarkdownQueryEditor(cell, pathExpr, cellIdxExpr);
                    el.innerHTML = html;
                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Générer l'éditeur pour les cellules iframe (SQL, JS ou Texte)
                renderIframeEditor(cell, pathExpr, cellIdxExpr) {
                    const languageType = ConfigManager.getCellEngine(cell, 0);
                    const isJs = languageType === 'js';
                    const isText = languageType === 'text';
                    const placeholder = isJs
                        ? "return '<html><body><h1>Hello</h1></body></html>';"
                        : isText
                            ? '<html><body><h1>Hello</h1></body></html>'
                            : "SELECT '<html><body><h1>Hello</h1></body></html>' as html";
                    const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL';
                    const languageIcon = isJs ? '⚡' : isText ? '📝' : '🗄️';
                    const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info';
                    return this.renderSqlQueryEditor(cell, placeholder, true, 'query', '_showParsedQuery', languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr);
                },

                // Version sécurisée pour l'éditeur iframe
                safeRenderIframeEditor(el, cell, pathExpr, cellIdxExpr) {
                    const showParsed = cell._showParsedQuery;
                    const langType = ConfigManager.getCellEngine(cell, 0);
                    const devModeVal = this.devMode;

                    const key = `iframe_${showParsed ? '1' : '0'}_${langType || 'sql'}_${devModeVal ? '1' : '0'}`;

                    if (el._sqlEditorKey === key && el.children.length > 0) {
                        return;
                    }

                    el._sqlEditorKey = key;

                    const html = this.renderIframeEditor(cell, pathExpr, cellIdxExpr);
                    el.innerHTML = html;

                    el._x_ignoreSelf = true;
                    Alpine.initTree(el);
                    delete el._x_ignoreSelf;
                },

                // Insérer un template (SQL ou JS) dans une cellule
                insertTemplate(cellId, queryType, templateIndex, languageType = 'sql') {
                    if (languageType === 'text') return; // Pas de templates pour le type Texte
                    // Récupérer les templates appropriés (Alpine.raw pour éviter les soucis Proxy avec chaînes complexes)
                    const store = (typeof Alpine !== 'undefined' && Alpine.raw)
                        ? Alpine.raw(Alpine.store('templateModal'))
                        : Alpine.store('templateModal');
                    const templates = languageType === 'js' ? store.jsTemplates : store.sqlTemplates;

                    // Trouver la cellule par son ID
                    const findCell = (groups) => {
                        for (const group of groups) {
                            for (const cell of (group.cells || [])) {
                                if (cell._id === cellId) {
                                    return cell;
                                }
                            }
                            if (group.children) {
                                const found = findCell(group.children);
                                if (found) return found;
                            }
                        }
                        return null;
                    };

                    let cell = null;
                    for (const page of this.pages) {
                        cell = findCell(page.groups);
                        if (cell) break;
                        if (page.linkGroups) {
                            cell = findCell(page.linkGroups);
                            if (cell) break;
                        }
                    }

                    if (!cell) {
                        console.error('Cellule non trouvée:', cellId);
                        return;
                    }

                    // Vérifier que l'index du template est valide
                    if (templateIndex < 0 || templateIndex >= templates.length) {
                        console.error('Index de template invalide:', templateIndex);
                        return;
                    }

                    // Insérer le code du template dans la cellule
                    const template = templates[templateIndex];
                    const newCode = String(template.code);
                    ConfigManager.setCellQuery(cell, queryType === 'query2' ? 1 : 0, newCode);

                    // Mettre à jour l'éditeur CodeMirror si présent (cellules SQL)
                    const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cell) : cell;
                    const editorKey = '_cmEditor_' + queryType;
                    const editor = rawCell[editorKey];
                    if (editor && editor.state && editor.dispatch) {
                        const currentDoc = editor.state.doc.toString();
                        if (currentDoc !== newCode) {
                            editor.dispatch({
                                changes: { from: 0, to: currentDoc.length, insert: newCode }
                            });
                        }
                    }

                    // Afficher un message de confirmation
                    this.setStatus(`✅ Template "${template.name}" inséré`, 'success');
                },
    };
}
