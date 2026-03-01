// @ts-nocheck

export class CDNManager {
            static loadedScripts = new Set();
            static loadingPromises = new Map();

            static async loadScript(url) {
                if (this.loadedScripts.has(url)) {
                    return Promise.resolve();
                }

                if (this.loadingPromises.has(url)) {
                    return this.loadingPromises.get(url);
                }

                const promise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = () => {
                        this.loadedScripts.add(url);
                        this.loadingPromises.delete(url);
                        resolve();
                    };
                    script.onerror = () => {
                        this.loadingPromises.delete(url);
                        reject(new Error(`Échec du chargement: ${url}`));
                    };
                    document.head.appendChild(script);
                });

                this.loadingPromises.set(url, promise);
                return promise;
            }

            static async loadPizZip() {
                const pizzipUrl = 'https://cdn.jsdelivr.net/npm/pizzip@3.2.0/dist/pizzip.min.js';
                if (typeof PizZip === 'undefined') {
                    await this.loadScript(pizzipUrl);
                } else {
                    this.loadedScripts.add(pizzipUrl);
                }
            }

            static async loadDocxtemplater() {
                const docxtemplaterUrl = 'https://cdn.jsdelivr.net/npm/docxtemplater@3.67.6/build/docxtemplater.min.js';

                // PizZip doit être chargé avant docxtemplater
                await this.loadPizZip();

                if (typeof window.docxtemplater === 'undefined') {
                    await this.loadScript(docxtemplaterUrl);
                } else {
                    this.loadedScripts.add(docxtemplaterUrl);
                }
            }

            static async loadSimpleDatatables() {
                const simpleDatatablesUrl = 'https://cdn.jsdelivr.net/npm/simple-datatables@10.2.0/dist/umd/simple-datatables.min.js';
                const simpleDatatablesCssUrl = 'https://cdn.jsdelivr.net/npm/simple-datatables@10.2.0/dist/style.min.css';

                // Charger le CSS si pas déjà chargé
                if (!document.querySelector(`link[href="${simpleDatatablesCssUrl}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = simpleDatatablesCssUrl;
                    document.head.appendChild(link);
                }

                if (typeof simpleDatatables !== 'undefined') {
                    this.loadedScripts.add(simpleDatatablesUrl);
                    return;
                }
                await this.loadScript(simpleDatatablesUrl);
            }

            static async loadPdfme() {
                if (window._pdfmeModules) {
                    return window._pdfmeModules;
                }
                try {
                    const commonPromise = import('https://cdn.jsdelivr.net/npm/@pdfme/common@5.5.8/+esm');
                    const generatorPromise = import('https://cdn.jsdelivr.net/npm/@pdfme/generator@5.5.8/+esm');
                    const schemasPromise = import('https://cdn.jsdelivr.net/npm/@pdfme/schemas@5.5.8/+esm');

                    const [common, generator, schemas] = await Promise.all([commonPromise, generatorPromise, schemasPromise]);

                    window._pdfmeModules = { common, generator, schemas };
                    return window._pdfmeModules;
                } catch (err) {
                    console.error('[pdfme CDN] ERREUR chargement:', err);
                    console.error('[pdfme CDN] Stack:', err.stack);
                    throw err;
                }
            }

            static loadedStyles = new Set();

            static async loadStyle(url) {
                if (this.loadedStyles.has(url)) return;

                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = url;
                document.head.appendChild(link);
                this.loadedStyles.add(url);
            }

            static async loadEasyMDE() {
                const easymdeJsUrl = 'https://cdn.jsdelivr.net/npm/easymde@2.20.0/dist/easymde.min.js';
                const easymdeCssUrl = 'https://cdn.jsdelivr.net/npm/easymde@2.20.0/dist/easymde.min.css';

                // Charger le CSS
                this.loadStyle(easymdeCssUrl);

                // Charger le JS
                if (typeof EasyMDE !== 'undefined') {
                    this.loadedScripts.add(easymdeJsUrl);
                    return;
                }
                await this.loadScript(easymdeJsUrl);
            }

            static async loadXlsx() {
                const xlsxUrl = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                if (typeof XLSX !== 'undefined') {
                    this.loadedScripts.add(xlsxUrl);
                    return;
                }
                await this.loadScript(xlsxUrl);
            }

            // CodeMirror SQL avec marimo-team/codemirror-sql
            static codeMirrorSQLLoaded = false;
            static codeMirrorSQLModules = null;
            static codeMirrorSQLLoadingPromise = null;

            static async loadCodeMirrorSQL() {
                if (this.codeMirrorSQLLoaded && this.codeMirrorSQLModules) {
                    return this.codeMirrorSQLModules;
                }

                if (this.codeMirrorSQLLoadingPromise) {
                    return this.codeMirrorSQLLoadingPromise;
                }

                this.codeMirrorSQLLoadingPromise = (async () => {
                    try {

                        // Créer un import map pour forcer le partage des dépendances
                        if (!document.querySelector('script[type="importmap"]')) {
                            const importMap = document.createElement('script');
                            importMap.type = 'importmap';
                            importMap.textContent = JSON.stringify({
                                imports: {
                                    "@codemirror/state": "https://esm.sh/@codemirror/state@6.4.1",
                                    "@codemirror/view": "https://esm.sh/@codemirror/view@6.26.3",
                                    "@codemirror/language": "https://esm.sh/@codemirror/language@6.10.1",
                                    "@codemirror/commands": "https://esm.sh/@codemirror/commands@6.5.0",
                                    "@codemirror/search": "https://esm.sh/@codemirror/search@6.5.6",
                                    "@codemirror/autocomplete": "https://esm.sh/@codemirror/autocomplete@6.16.0",
                                    "@codemirror/lint": "https://esm.sh/@codemirror/lint@6.8.0",
                                    "@lezer/common": "https://esm.sh/@lezer/common@1.2.1",
                                    "@lezer/highlight": "https://esm.sh/@lezer/highlight@1.2.0",
                                    "@lezer/lr": "https://esm.sh/@lezer/lr@1.4.0",
                                    "style-mod": "https://esm.sh/style-mod@4.1.2",
                                    "w3c-keyname": "https://esm.sh/w3c-keyname@2.2.8"
                                }
                            });
                            document.head.insertBefore(importMap, document.head.firstChild);

                            // Attendre un tick pour que l'import map soit pris en compte
                            await new Promise(r => setTimeout(r, 0));
                        }

                        // Import séquentiel pour éviter les conflits
                        const stateModule = await import('https://esm.sh/@codemirror/state@6.4.1');
                        const viewModule = await import('https://esm.sh/@codemirror/view@6.26.3?deps=@codemirror/state@6.4.1');
                        const languageModule = await import('https://esm.sh/@codemirror/language@6.10.1?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3');
                        const commandsModule = await import('https://esm.sh/@codemirror/commands@6.5.0?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3,@codemirror/language@6.10.1');
                        const searchModule = await import('https://esm.sh/@codemirror/search@6.5.6?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3');
                        const autocompleteModule = await import('https://esm.sh/@codemirror/autocomplete@6.16.0?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3,@codemirror/language@6.10.1,@codemirror/commands@6.5.0');
                        const langSqlModule = await import('https://esm.sh/@codemirror/lang-sql@6.6.4?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3,@codemirror/language@6.10.1,@codemirror/autocomplete@6.16.0');
                        const themeOneDarkModule = await import('https://esm.sh/@codemirror/theme-one-dark@6.1.2?deps=@codemirror/state@6.4.1,@codemirror/view@6.26.3');

                        // Créer basicSetup manuellement
                        const basicSetup = [
                            viewModule.lineNumbers(),
                            viewModule.highlightActiveLineGutter(),
                            viewModule.highlightSpecialChars(),
                            commandsModule.history(),
                            languageModule.foldGutter(),
                            viewModule.drawSelection(),
                            viewModule.dropCursor(),
                            stateModule.EditorState.allowMultipleSelections.of(true),
                            languageModule.indentOnInput(),
                            languageModule.syntaxHighlighting(languageModule.defaultHighlightStyle, { fallback: true }),
                            languageModule.bracketMatching(),
                            autocompleteModule.closeBrackets(),
                            autocompleteModule.autocompletion(),
                            viewModule.rectangularSelection(),
                            viewModule.crosshairCursor(),
                            viewModule.highlightActiveLine(),
                            searchModule.highlightSelectionMatches(),
                            viewModule.keymap.of([
                                ...autocompleteModule.closeBracketsKeymap,
                                ...commandsModule.defaultKeymap,
                                ...searchModule.searchKeymap,
                                ...commandsModule.historyKeymap,
                                ...languageModule.foldKeymap,
                                ...autocompleteModule.completionKeymap
                            ])
                        ];

                        this.codeMirrorSQLModules = {
                            EditorView: viewModule.EditorView,
                            EditorState: stateModule.EditorState,
                            basicSetup: basicSetup,
                            sql: langSqlModule.sql,
                            StandardSQL: langSqlModule.StandardSQL,
                            DuckDBSQL: langSqlModule.DuckDBSQL || langSqlModule.StandardSQL,
                            oneDark: themeOneDarkModule.oneDark,
                            sqlExtension: null,
                            cteCompletionSource: null
                        };

                        this.codeMirrorSQLLoaded = true;
                        return this.codeMirrorSQLModules;
                    } catch (error) {
                        console.error('❌ Erreur chargement CodeMirror SQL:', error);
                        this.codeMirrorSQLLoadingPromise = null;
                        throw error;
                    }
                })();

                return this.codeMirrorSQLLoadingPromise;
            }

            // Créer une instance d'éditeur CodeMirror SQL
            static createSqlEditor(container, initialValue, onChange, options = {}) {
                if (!this.codeMirrorSQLModules) {
                    throw new Error('CodeMirror SQL non chargé. Appelez loadCodeMirrorSQL() d\'abord.');
                }

                const {
                    EditorView, basicSetup, sql, StandardSQL, DuckDBSQL,
                    sqlExtension, cteCompletionSource, oneDark
                } = this.codeMirrorSQLModules;

                const isDarkTheme = document.documentElement.getAttribute('data-theme')?.includes('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;

                const schema = options.schema || {};
                const dialect = options.dialect === 'duckdb' ? DuckDBSQL : StandardSQL;

                const extensions = [
                    basicSetup,
                    sql({
                        dialect: dialect,
                        schema: schema,
                        upperCaseKeywords: true,
                    }),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged && onChange) {
                            onChange(update.state.doc.toString());
                        }
                    }),
                    EditorView.theme({
                        '&': {
                            fontSize: '14px',
                            minHeight: '20px',
                            border: '1px solid oklch(var(--b3))',
                            borderRadius: '0.5rem',
                        },
                        '.cm-scroller': {
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                            minHeight: '20px',
                            maxHeight: '250px',
                            overflow: 'auto',
                        },
                        '.cm-content': {
                            padding: '0.5rem 0',
                        },
                        '.cm-gutters': {
                            borderRadius: '0.5rem 0 0 0.5rem',
                        },
                        '&.cm-focused': {
                            outline: '2px solid oklch(var(--p))',
                            outlineOffset: '-1px',
                        },
                    }),
                ];

                // Ajouter marimo-sql si disponible
                if (cteCompletionSource) {
                    extensions.push(dialect.language.data.of({
                        autocomplete: cteCompletionSource,
                    }));
                }

                if (sqlExtension) {
                    extensions.push(sqlExtension({
                        linterConfig: { delay: 300 },
                        gutterConfig: {
                            backgroundColor: '#3b82f6',
                            errorBackgroundColor: '#ef4444',
                            hideWhenNotFocused: true,
                        },
                        enableHover: true,
                        hoverConfig: {
                            schema: schema,
                            hoverTime: 300,
                            enableKeywords: true,
                            enableTables: true,
                            enableColumns: true,
                        },
                    }));
                }

                if (isDarkTheme) {
                    extensions.push(oneDark);
                }

                const editor = new EditorView({
                    doc: initialValue || '',
                    extensions: extensions,
                    parent: container,
                });

                return editor;
            }

            static echartsLoaded = false;
            static echartsLoadingPromise = null;

            static async loadECharts() {
                if (this.echartsLoaded) return;
                if (this.echartsLoadingPromise) return this.echartsLoadingPromise;

                this.echartsLoadingPromise = (async () => {
                    const url = 'https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js';
                    if (typeof window.echarts === 'undefined') {
                        await this.loadScript(url);
                    } else {
                        this.loadedScripts.add(url);
                    }
                    this.echartsLoaded = true;
                    this.echartsLoadingPromise = null;
                })();

                return this.echartsLoadingPromise;
            }

            static perspectiveLoaded = false;
            static perspectiveLoadingPromise = null;

            static async loadPerspective() {
                if (this.perspectiveLoaded) return;

                if (this.perspectiveLoadingPromise) {
                    return this.perspectiveLoadingPromise;
                }

                this.perspectiveLoadingPromise = (async () => {
                    // Charger le CSS themes
                    const themeCssUrl = 'https://cdn.jsdelivr.net/npm/@perspective-dev/viewer/dist/css/themes.css';
                    if (!document.querySelector(`link[href="${themeCssUrl}"]`)) {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.crossOrigin = 'anonymous';
                        link.href = themeCssUrl;

                        // Attendre que le CSS soit chargé
                        await new Promise((resolve, reject) => {
                            link.onload = resolve;
                            link.onerror = reject;
                            document.head.appendChild(link);
                        });
                    }

                    // Charger les modules ES6 pour Perspective
                    await import('https://cdn.jsdelivr.net/npm/@perspective-dev/viewer@4.1.0/dist/cdn/perspective-viewer.js');
                    await import('https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-datagrid@4.1.0/dist/cdn/perspective-viewer-datagrid.js');
                    await import('https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-d3fc@4.1.0/dist/cdn/perspective-viewer-d3fc.js');
                    await import('https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-openlayers@4.1.0/dist/cdn/perspective-viewer-openlayers.js');

                    // Charger le client perspective
                    const perspectiveModule = await import('https://cdn.jsdelivr.net/npm/@perspective-dev/client@4.1.0/dist/cdn/perspective.js');
                    window.perspectiveClient = perspectiveModule.default;

                    this.perspectiveLoaded = true;
                })();

                return this.perspectiveLoadingPromise;
            }
        }
