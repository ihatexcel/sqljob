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
                if ((window as any).PizZip) return;
                const mod = await import('pizzip');
                (window as any).PizZip = mod.default ?? mod;
            }

            static async loadDocxtemplater() {
                await this.loadPizZip();
                if ((window as any).docxtemplater) return;
                const mod = await import('docxtemplater');
                (window as any).docxtemplater = mod.default ?? mod;
            }

            static async loadSimpleDatatables() {
                if ((window as any).simpleDatatables) return;
                await import('simple-datatables/dist/style.css');
                const mod = await import('simple-datatables');
                (window as any).simpleDatatables = mod;
            }

            static async loadPdfme() {
                if ((window as any)._pdfmeModules) return (window as any)._pdfmeModules;
                const [common, generator, schemas] = await Promise.all([
                    import('@pdfme/common'),
                    import('@pdfme/generator'),
                    import('@pdfme/schemas'),
                ]);
                (window as any)._pdfmeModules = { common, generator, schemas };
                return (window as any)._pdfmeModules;
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

            static easyMDELoadingPromise: Promise<void> | null = null;

            static async loadEasyMDE() {
                if (typeof (window as any).EasyMDE !== 'undefined') return;
                if (this.easyMDELoadingPromise) return this.easyMDELoadingPromise;
                this.easyMDELoadingPromise = (async () => {
                    // CSS bundlé via npm
                    await import('easymde/dist/easymde.min.css');
                    // JS : EasyMDE expose sa classe sur window via UMD
                    const mod = await import('easymde');
                    (window as any).EasyMDE = mod.default ?? mod;
                })();
                return this.easyMDELoadingPromise;
            }

            static async loadXlsx() {
                if ((window as any).XLSX) return;
                const mod = await import('xlsx');
                (window as any).XLSX = mod;
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
                const isDarkTheme = document.documentElement.classList.contains('dark') ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;

                const schema = options.schema || {};

                const extensions = [
                    basicSetup,
                    sql({ dialect: DuckDBDialect, schema, upperCaseKeywords: true }),
                    EditorView.updateListener.of((update) => {
                        if (update.docChanged && onChange) onChange(update.state.doc.toString());
                    }),
                    EditorView.theme({
                        '&': { fontSize: '14px', minHeight: '20px', border: '1px solid hsl(var(--border, #d1d5db))', borderRadius: '0.5rem' },
                        '.cm-scroller': { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', minHeight: '20px', maxHeight: '250px', overflow: 'auto' },
                        '.cm-content': { padding: '0.5rem 0' },
                        '.cm-gutters': { borderRadius: '0.5rem 0 0 0.5rem' },
                        '&.cm-focused': { outline: '2px solid hsl(var(--primary, #570df8))', outlineOffset: '-1px' },
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
                    const mod = await import('echarts');
                    (window as any).echarts = mod;
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

            // ─── Univer Sheet ─────────────────────────────────────────────────────────
            // Note : le preset Univer (JS + CSS) est chargé via import dynamique npm
            // par UniverSheetElement.ts — plus de chargement CDN/UMD ici.

            static univerExportLoaded = false;
            static univerExportLoadingPromise = null;

            /**
             * Charge le plugin export XLSX Univer depuis CDN (lazy, dédupliqué).
             * Expose window.UniverImportExport après chargement.
             */
            static async loadUniverExport() {
                if (this.univerExportLoaded) return;
                if (this.univerExportLoadingPromise) return this.univerExportLoadingPromise;

                this.univerExportLoadingPromise = (async () => {
                    await this.loadScript('https://unpkg.com/@mertdeveci55/univer-import-export/dist/index.umd.js');
                    this.univerExportLoaded = true;
                })();

                return this.univerExportLoadingPromise;
            }
        }
