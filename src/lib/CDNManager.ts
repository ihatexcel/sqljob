// @ts-nocheck
import { EditorView } from '@codemirror/view'
import { EditorState } from '@codemirror/state'
import { basicSetup } from 'codemirror'
import { sql } from '@codemirror/lang-sql'
import { DuckDBDialect } from '@marimo-team/codemirror-sql/dialects'
import { sqlExtension, cteCompletionSource } from '@marimo-team/codemirror-sql'
import { oneDark } from '@codemirror/theme-one-dark'

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

            // CodeMirror SQL — bundlé via npm (@marimo-team/codemirror-sql + @codemirror/*)
            // loadCodeMirrorSQL() résout immédiatement (modules déjà importés statiquement)
            static codeMirrorSQLLoaded = true;
            static codeMirrorSQLModules = {
                EditorView, EditorState, basicSetup,
                sql, DuckDBSQL: DuckDBDialect,
                sqlExtension, cteCompletionSource, oneDark,
            };
            static codeMirrorSQLLoadingPromise = null;

            static async loadCodeMirrorSQL() {
                return this.codeMirrorSQLModules;
            }

            // Créer une instance d'éditeur CodeMirror SQL (utilisé par editorsMixin pour les modales de groupe)
            static createSqlEditor(container, initialValue, onChange, options = {}) {
                const isDarkTheme = document.documentElement.getAttribute('data-theme')?.includes('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;

                const schema = options.schema || {};

                const extensions = [
                    basicSetup,
                    sql({ dialect: DuckDBDialect, schema, upperCaseKeywords: true }),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged && onChange) onChange(update.state.doc.toString());
                    }),
                    EditorView.theme({
                        '&': { fontSize: '14px', minHeight: '20px', border: '1px solid oklch(var(--b3, #d1d5db))', borderRadius: '0.5rem' },
                        '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', minHeight: '20px', maxHeight: '250px', overflow: 'auto' },
                        '.cm-content': { padding: '0.5rem 0' },
                        '.cm-gutters': { borderRadius: '0.5rem 0 0 0.5rem' },
                        '&.cm-focused': { outline: '2px solid oklch(var(--p, #570df8))', outlineOffset: '-1px' },
                    }),
                    DuckDBDialect.language.data.of({ autocomplete: cteCompletionSource }),
                    sqlExtension({
                        linterConfig: { delay: 300 },
                        gutterConfig: { backgroundColor: '#3b82f6', errorBackgroundColor: '#ef4444', hideWhenNotFocused: true },
                        enableHover: true,
                        hoverConfig: { schema, hoverTime: 300, enableKeywords: true, enableTables: true, enableColumns: true },
                    }),
                ];
                if (isDarkTheme) extensions.push(oneDark);

                return new EditorView({
                    state: EditorState.create({ doc: initialValue || '', extensions }),
                    parent: container,
                });
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
