// @ts-nocheck
import { ConfigManager } from '../../../lib/ConfigManager'
import { CDNManager } from '../../../lib/CDNManager'
import { CELL_TYPE_SCHEMAS } from '../../../lib/cellTypeSchemas'
import { useTemplateModal } from '../uiStores'

export const createEditorsSlice = (set: any, get: any) => ({

    renderUiParameterEditor(cell: any) {
        const languageType = ConfigManager.getCellEngine(cell, 0)
        const isJs = languageType === 'js'
        const isText = languageType === 'text'
        const placeholder = isJs
            ? 'return ["Option 1", "Option 2"]; // Pour dropdown\nreturn "Valeur"; // Pour input'
            : isText ? 'Saisir le texte (une ligne par option pour dropdown)'
            : 'SELECT * from source1'
        const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL'
        const languageIcon = isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : isText ? '<span class="iconify" data-icon="material-symbols-light:article" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>'
        const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info'
        return get().renderSqlQueryEditor(cell, placeholder, true, 'query', null, languageLabel, languageIcon, badgeClass)
    },

    renderGroupIfQueryEditor(group: any) {
        if (!group) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>'
        const q0 = ConfigManager.ensureGroupQueries(group)
        if (!q0) return '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 text-sm" placeholder="SELECT true"></textarea>'
        const groupId = 'ifquery-' + (group.id || 'g')
        const langType = q0.engine || 'sql'
        const isJs = langType === 'js'
        const placeholder = isJs
            ? 'return true;  // ou return false; pour masquer le groupe'
            : 'SELECT true  -- ou SELECT false pour masquer le groupe'
        const badgeClass = isJs ? 'badge-warning' : 'badge-info'
        const badgeIcon = isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>'
        const badgeLabel = isJs ? 'JavaScript' : 'SQL'
        if (isJs) {
            return `<div>
                <span class="badge badge-soft ${badgeClass} text-xs mb-2 flex items-center gap-1">${badgeIcon} ${badgeLabel}</span>
                <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="${placeholder}"></textarea>
            </div>`
        }
        return `<div>
            <span class="badge badge-soft ${badgeClass} text-xs mb-2 flex items-center gap-1">${badgeIcon} ${badgeLabel}</span>
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
        </div>`
    },

    renderGroupIfQueryEditorInit(group: any, container: HTMLElement) {
        if (!group || !container) return
        const q0 = ConfigManager.ensureGroupQueries(group)
        if (!q0) return
        const langType = q0.engine || 'sql'
        const isJs = langType === 'js'
        const placeholder = isJs
            ? 'return true;  // ou return false; pour masquer le groupe'
            : 'SELECT true  -- ou SELECT false pour masquer le groupe'
        const badgeClass = isJs ? 'badge-warning' : 'badge-info'
        const badgeIcon = isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>'
        const badgeLabel = isJs ? 'JavaScript' : 'SQL'

        if (group._cmEditor_ifQuery) { group._cmEditor_ifQuery.destroy(); group._cmEditor_ifQuery = null }

        if (isJs) {
            container.innerHTML = `<div>
                <span class="badge badge-soft ${badgeClass} text-xs mb-2 flex items-center gap-1">${badgeIcon} ${badgeLabel}</span>
                <textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="${placeholder}"></textarea>
            </div>`
            const textarea = container.querySelector('textarea')
            if (textarea) {
                textarea.value = q0.sql || ''
                textarea.addEventListener('input', (e: any) => { q0.sql = e.target.value })
            }
        } else {
            container.innerHTML = `<div>
                <span class="badge badge-soft ${badgeClass} text-xs mb-2 flex items-center gap-1">${badgeIcon} ${badgeLabel}</span>
                <div class="codemirror-sql-container"></div>
            </div>`
            const cmContainer = container.querySelector('.codemirror-sql-container')
            if (cmContainer) {
                CDNManager.loadCodeMirrorSQL().then(() => {
                    const schema: any = {}
                    group._cmEditor_ifQuery = CDNManager.createSqlEditor(cmContainer, q0.sql || '', (v: string) => { q0.sql = v }, { schema, dialect: 'duckdb' })
                }).catch((err: any) => {
                    console.error('Erreur CodeMirror condition groupe:', err)
                    cmContainer.innerHTML = `<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 text-sm" placeholder="${placeholder}"></textarea>`
                    const textarea = cmContainer.querySelector('textarea')
                    if (textarea) { textarea.value = q0.sql || ''; textarea.addEventListener('input', (e: any) => { q0.sql = e.target.value }) }
                })
            }
        }
    },

    renderSqlQueryEditor(cell: any, placeholder: string, showResultInfo: boolean, queryType = 'query', _unused: any = null, languageLabel: any = null, languageIcon: any = null, badgeClass: any = null, pathExpr: any = null, cellIdxExpr: any = null, applySourceDefaultIfEmpty = false) {
        const cellId = cell._id
        const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main'
        const queryIndex = ConfigManager.getQueryIndexByName(cell, queryName)

        const languageType = ConfigManager.getCellEngine(cell, queryName)
        const isJs = languageType === 'js'
        const isText = languageType === 'text'
        const finalLanguageLabel = languageLabel || (isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL')
        const finalLanguageIcon = languageIcon || (isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : isText ? '<span class="iconify" data-icon="material-symbols-light:article" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>')
        const finalBadgeClass = badgeClass || (isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info')
        const devMode = get().devMode

        return `
            <div>
                <div class="relative w-full">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs text-base-content/70 flex items-center gap-2">
                            <span class="badge badge-soft ${finalBadgeClass} flex items-center gap-1">${finalLanguageIcon} ${finalLanguageLabel}</span>
                        </span>
                        <div class="flex gap-1 items-center">
                            ${devMode && !isText ? `
                                <button
                                    @click="$store.templateModal.open('${cellId}', '${queryType}', '${languageType}')"
                                    class="px-2 py-1 border border-base-300 bg-base-200 text-base-content/70 rounded cursor-pointer text-xs transition-all hover:border-primary hover:text-base-content"
                                    title="Insérer un template ${isJs ? 'JavaScript' : 'SQL'}">
                                    📋 Templates
                                </button>
                            ` : ''}
                            ${pathExpr != null && (cellIdxExpr === 0 || cellIdxExpr) ? `
                                <button
                                    @click="runCellAt(${pathExpr}, ${cellIdxExpr})"
                                    :disabled="isLoading"
                                    class="p-1.5 text-base-content/40 hover:text-base-content transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Exécuter la requête">
                                    <span x-show="cellItem.cell._status === 'running'" class="loading loading-spinner loading-sm"></span>
                                    <svg x-show="cellItem.cell._status !== 'running'" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </button>
                            ` : ''}
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
                        </div>
                    </div>
                    ${isJs || isText ? `
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
                    `}
                </div>
                ${showResultInfo && cell._resultInfo ? `
                    <div class="mt-2 p-2 bg-base-200 rounded text-sm text-base-content/70">${cell._resultInfo}</div>
                ` : ''}
            </div>
        `
    },

    safeRenderSqlEditor(el: HTMLElement, cell: any, placeholder: string, showResultInfo: boolean, queryType = 'query', _unused: any = null, languageLabel: any = null, languageIcon: any = null, badgeClass: any = null, pathExpr: any = null, cellIdxExpr: any = null, applySourceDefaultIfEmpty = false) {
        const queryName = queryType === 'query2' ? ConfigManager.getQuery2Name(cell) : 'main'
        ConfigManager.ensureCellQueries(cell, queryName)
        const langType = ConfigManager.getCellEngine(cell, queryName)
        const devModeVal = get().devMode
        const key = `${langType || 'sql'}_${devModeVal ? '1' : '0'}`
        if (el._sqlEditorKey === key && el.children.length > 0) return
        el._sqlEditorKey = key
        const html = get().renderSqlQueryEditor(cell, placeholder, showResultInfo, queryType, null, languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr, applySourceDefaultIfEmpty)
        el.innerHTML = html
        el._x_ignoreSelf = true
        if (typeof Alpine !== 'undefined') Alpine.initTree(el)
        delete el._x_ignoreSelf
    },

    safeRenderUiParameterEditor(el: HTMLElement, cell: any) {
        const langType = ConfigManager.getCellEngine(cell, 0)
        const devModeVal = get().devMode
        const key = `${langType || 'sql'}_${devModeVal ? '1' : '0'}`
        if (el._sqlEditorKey === key && el.children.length > 0) return
        el._sqlEditorKey = key
        const html = get().renderUiParameterEditor(cell)
        el.innerHTML = html
        el._x_ignoreSelf = true
        if (typeof Alpine !== 'undefined') Alpine.initTree(el)
        delete el._x_ignoreSelf
    },

    renderMarkdownQueryEditor(cell: any, pathExpr: any, cellIdxExpr: any) {
        const languageType = ConfigManager.getCellEngine(cell, 'main')
        const isJs = languageType === 'js'
        const placeholder = isJs ? "return '## Titre\\n\\nContenu markdown';" : "SELECT '## Titre' as markdown"
        const languageLabel = isJs ? 'JavaScript' : 'SQL'
        const languageIcon = isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>'
        const badgeClass = isJs ? 'badge-warning' : 'badge-info'
        return get().renderSqlQueryEditor(cell, placeholder, true, 'query', null, languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr)
    },

    async initCodeMirrorForCell(cellItem: any, cellId: string, queryType: string, queryName: string, queryIndex: number, applySourceDefaultIfEmpty: boolean, placeholder: string, rootComponent: any) {
        const container = document.getElementById('cm-' + cellId + '-' + queryType)
        if (!container) return
        const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cellItem.cell) : cellItem.cell
        const existingEditor = rawCell['_cmEditor_' + queryType]
        if (existingEditor) {
            if (!document.body.contains(existingEditor.dom)) { existingEditor.destroy(); rawCell['_cmEditor_' + queryType] = null }
            else return
        }
        try {
            await CDNManager.loadCodeMirrorSQL()
            let initialContent = ConfigManager.getCellQuery(cellItem.cell, queryName) || ''
            if (applySourceDefaultIfEmpty && !initialContent.trim() && cellItem.cell.type === 'source') {
                const defaultQ = CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.find((q: any) => q.name === queryName)?.sql ?? CELL_TYPE_SCHEMAS?.types?.source?.defaults?.queries?.[queryIndex]?.sql
                if (defaultQ) {
                    initialContent = defaultQ.replace(/\{name\}/g, cellItem.cell.name || 'source1')
                    ConfigManager.setCellQuery(cellItem.cell, queryName, initialContent)
                }
            }
            const schema: any = {}
            const nb = (rootComponent && rootComponent._x_dataStack ? rootComponent._x_dataStack[0] : rootComponent) || null
            if (nb && nb.tablesData) {
                for (const [tableName, data] of Object.entries(nb.tablesData as any)) {
                    if (data && (data as any).length > 0) schema[tableName] = Object.keys((data as any)[0])
                }
            }
            rawCell['_cmEditor_' + queryType] = CDNManager.createSqlEditor(container, initialContent,
                (v: string) => ConfigManager.setCellQuery(cellItem.cell, queryName, v),
                { schema, dialect: 'duckdb' })
        } catch (err: any) {
            console.error('Erreur init CodeMirror:', err)
            const ph = String(placeholder || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/'/g, "\\'").replace(/"/g, '&quot;')
            container.innerHTML = '<textarea class="textarea textarea-bordered w-full font-mono min-h-20 p-3 resize-y text-sm" x-model="cellItem.cell.queries[' + queryIndex + '].sql" placeholder="' + ph + '"></textarea>'
        }
    },

    safeRenderMarkdownQueryEditor(el: HTMLElement, cell: any, pathExpr: any, cellIdxExpr: any) {
        const langType = ConfigManager.getCellEngine(cell, 'main')
        const devModeVal = get().devMode
        const key = `md_${langType || 'sql'}_${devModeVal ? '1' : '0'}`
        if (el._sqlEditorKey === key && el.children.length > 0) return
        el._sqlEditorKey = key
        const html = get().renderMarkdownQueryEditor(cell, pathExpr, cellIdxExpr)
        el.innerHTML = html
        el._x_ignoreSelf = true
        if (typeof Alpine !== 'undefined') Alpine.initTree(el)
        delete el._x_ignoreSelf
    },

    renderIframeEditor(cell: any, pathExpr: any, cellIdxExpr: any) {
        const languageType = ConfigManager.getCellEngine(cell, 0)
        const isJs = languageType === 'js'
        const isText = languageType === 'text'
        const placeholder = isJs
            ? "return '<html><body><h1>Hello</h1></body></html>';"
            : isText ? '<html><body><h1>Hello</h1></body></html>'
            : "SELECT '<html><body><h1>Hello</h1></body></html>' as html"
        const languageLabel = isJs ? 'JavaScript' : isText ? 'Texte' : 'SQL'
        const languageIcon = isJs
            ? '<span class="iconify" data-icon="material-symbols-light:bolt" style="font-size:0.875rem"></span>'
            : isText ? '<span class="iconify" data-icon="material-symbols-light:article" style="font-size:0.875rem"></span>'
            : '<span class="iconify" data-icon="material-symbols-light:storage" style="font-size:0.875rem"></span>'
        const badgeClass = isJs ? 'badge-warning' : isText ? 'badge-ghost' : 'badge-info'
        return get().renderSqlQueryEditor(cell, placeholder, true, 'query', null, languageLabel, languageIcon, badgeClass, pathExpr, cellIdxExpr)
    },

    safeRenderIframeEditor(el: HTMLElement, cell: any, pathExpr: any, cellIdxExpr: any) {
        const langType = ConfigManager.getCellEngine(cell, 0)
        const devModeVal = get().devMode
        const key = `iframe_${langType || 'sql'}_${devModeVal ? '1' : '0'}`
        if (el._sqlEditorKey === key && el.children.length > 0) return
        el._sqlEditorKey = key
        const html = get().renderIframeEditor(cell, pathExpr, cellIdxExpr)
        el.innerHTML = html
        el._x_ignoreSelf = true
        if (typeof Alpine !== 'undefined') Alpine.initTree(el)
        delete el._x_ignoreSelf
    },

    insertTemplate(cellId: string, queryType: string, templateIndex: number, languageType = 'sql') {
        if (languageType === 'text') return
        const store = (typeof Alpine !== 'undefined' && Alpine.raw)
            ? Alpine.raw(Alpine.store('templateModal'))
            : useTemplateModal.getState()
        const templates = languageType === 'js' ? store.jsTemplates : store.sqlTemplates

        const findCell = (groups: any[]): any => {
            for (const group of groups) {
                for (const cell of (group.cells || [])) {
                    if (cell._id === cellId) return cell
                }
                if (group.children) {
                    const found = findCell(group.children)
                    if (found) return found
                }
            }
            return null
        }

        let cell = null
        for (const page of get().pages) {
            cell = findCell(page.groups)
            if (cell) break
            if (page.linkGroups) { cell = findCell(page.linkGroups); if (cell) break }
        }
        if (!cell) { console.error('Cellule non trouvée:', cellId); return }
        if (templateIndex < 0 || templateIndex >= templates.length) { console.error('Index de template invalide:', templateIndex); return }

        const template = templates[templateIndex]
        const newCode = String(template.code)
        ConfigManager.setCellQuery(cell, queryType === 'query2' ? 1 : 0, newCode)

        const rawCell = (typeof Alpine !== 'undefined' && Alpine.raw) ? Alpine.raw(cell) : cell
        const editor = rawCell['_cmEditor_' + queryType]
        if (editor && editor.state && editor.dispatch) {
            const currentDoc = editor.state.doc.toString()
            if (currentDoc !== newCode) {
                editor.dispatch({ changes: { from: 0, to: currentDoc.length, insert: newCode } })
            }
        }
        get().setStatus(`✅ Template "${template.name}" inséré`, 'success')
    },
})
