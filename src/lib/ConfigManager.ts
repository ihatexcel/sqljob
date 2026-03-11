// @ts-nocheck
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from './cellTypeSchemas'
import { GistEncrypt } from './GistEncrypt'
import { FileHandler } from './FileHandler'

        export class ConfigManager {
            static SQLJOB_VERSION = '0.1';

            static getDefaultConfig() {
                try {
                    const scriptElement = document.getElementById('defaultConfigBase64');
                    const defaultConfigBase64 = scriptElement?.textContent?.trim();

                    if (!defaultConfigBase64) return { job: { cells: [] } };

                    try {
                        const base64Decoded = atob(defaultConfigBase64);
                        const decoded = decodeURIComponent(escape(base64Decoded));
                        return JSON.parse(decoded);
                    } catch {
                        return JSON.parse(atob(defaultConfigBase64));
                    }
                } catch (error) {
                    console.error('Erreur de décodage config:', error);
                    return { job: { cells: [] } };
                }
            }

            /**
             * Charge la config par défaut (defaultConfigBase64) ou détecte si elle est chiffrée (export HTML).
             * @returns {{ config } | { needsPassphrase: true, encryptedContent, source: 'html' }}
             */
            static loadDefaultConfigOrEncrypted() {
                const scriptElement = document.getElementById('defaultConfigBase64');
                const raw = scriptElement?.textContent?.trim();
                if (!raw) return { config: { job: { cells: [] } } };
                try {
                    const base64Decoded = atob(raw);
                    let decodedStr;
                    try {
                        decodedStr = decodeURIComponent(escape(base64Decoded));
                    } catch {
                        decodedStr = base64Decoded;
                    }
                    const parsed = JSON.parse(decodedStr);
                    if (GistEncrypt.isEncrypted(parsed)) {
                        return { needsPassphrase: true, encryptedContent: parsed, source: 'html' };
                    }
                    return { config: parsed };
                } catch (e) {
                    try {
                        const parsed = JSON.parse(atob(raw));
                        if (GistEncrypt.isEncrypted(parsed)) {
                            return { needsPassphrase: true, encryptedContent: parsed, source: 'html' };
                        }
                        return { config: parsed };
                    } catch (err) {
                        console.error('Erreur de décodage config:', err);
                        return { config: { job: { cells: [] } } };
                    }
                }
            }

            static normalizeOrder(value, fallback) {
                if (value === undefined || value === null) return fallback;
                if (typeof value === 'string' && value.trim() === '') return fallback;
                const parsed = Number(value);
                return Number.isFinite(parsed) ? parsed : fallback;
            }

            /**
             * Normalise une cellule (schéma unifié refacto.md). Migre les queries sans name.
             */
            static normalizeCell(cell) {
                if (!cell || !cell.type) return cell;
                const c = { ...cell };
                if (c.type === 'markdown' && c.content && !ConfigManager.getCellQuery(c, 'main')) {
                    ConfigManager.ensureCellQueries(c, 'main');
                    const q = ConfigManager.getQueryByName(c, 'main');
                    if (q) q.sql = c.content;
                }
                if (Array.isArray(c.queries) && c.queries.length > 0) {
                    const schema = CELL_TYPE_SCHEMAS?.types[c.type];
                    const qNames = schema?.queryNames ?? ['main'];
                    c.queries = c.queries.map((q, i) => ({
                        ...q,
                        name: q.name || qNames[i] || (i === 0 ? 'main' : i === 1 ? 'filename' : 'query' + i)
                    }));
                }
                // pdfme: json objet -> chaîne pour éviter [object Object] dans textarea/modale
                if (c.type === 'pdfme' && typeof c.json === 'object' && c.json !== null) {
                    c.json = JSON.stringify(c.json, null, 2);
                }
                return c;
            }

            /**
             * Normalise un groupe (schéma unifié). Migre les queries de condition d'affichage sans name.
             */
            static normalizeGroup(group) {
                if (!group || !Array.isArray(group.queries)) return group;
                group.queries = group.queries.map((q, i) => ({
                    ...q,
                    name: q.name || (i === 0 ? 'main' : 'query' + i)
                }));
                return group;
            }

            /** Retourne la requête par nom (ex: 'main', 'fallback', 'filename'). Rétrocompat: index 0->main, 1->fallback/filename. */
            static getCellQuery(cell, nameOrIndex = 'main') {
                if (!cell) return '';
                const name = typeof nameOrIndex === 'number' ? (ConfigManager.getQueryNameForIndex(cell, nameOrIndex) || 'main') : nameOrIndex;
                const q = ConfigManager.getQueryByName(cell, name);
                return q ? (q.sql || '') : '';
            }

            /**
             * Indique si l'éditeur SQL est visible pour cette requête (clientVisible).
             */
            static getCellQueryClientVisible(cell, nameOrIndex = 'main') {
                if (!cell) return false;
                const name = typeof nameOrIndex === 'number' ? (ConfigManager.getQueryNameForIndex(cell, nameOrIndex) || 'main') : nameOrIndex;
                const q = ConfigManager.getQueryByName(cell, name);
                return q ? q.clientVisible === true : false;
            }

            /** Trouve une requête par nom dans cell.queries. Rétrocompat: si pas de name sur les queries, utilise l'index du schéma. */
            static getQueryByName(cell, name) {
                if (!cell || !Array.isArray(cell.queries)) return null;
                let q = cell.queries.find(x => x.name === name);
                if (!q) {
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    const idx = schema?.queryNames?.indexOf(name);
                    if (idx >= 0 && cell.queries[idx]) q = cell.queries[idx];
                }
                return q || null;
            }

            /** Retourne l'index d'une requête par nom (pour x-model). Rétrocompat: si pas de name, utilise ordre schema. */
            static getQueryIndexByName(cell, name) {
                if (!cell?.queries) return 0;
                const idx = cell.queries.findIndex(q => q.name === name);
                if (idx >= 0) return idx;
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                const schemaIdx = schema?.queryNames?.indexOf(name);
                return schemaIdx >= 0 ? schemaIdx : 0;
            }

            /** Retourne le nom de la requête pour un index (rétrocompat). */
            static getQueryNameForIndex(cell, index) {
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                return schema?.queryNames?.[index] ?? (index === 0 ? 'main' : index === 1 ? 'filename' : null);
            }
            /** Retourne le nom de la requête secondaire (query2) : fallback pour source, filename pour les autres. */
            static getQuery2Name(cell) {
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                return schema?.secondQueryName ?? schema?.queryNames?.[1] ?? 'filename';
            }

            /** Retourne le moteur par défaut selon le type (depuis defaults.queries[].engine du schéma). */
            static getDefaultEngineForType(cellOrType, nameOrIndex = 'main') {
                const type = typeof cellOrType === 'object' ? cellOrType?.type : cellOrType;
                const schema = CELL_TYPE_SCHEMAS?.types[type];
                if (!schema?.defaults?.queries) return 'sql';
                const idx = typeof nameOrIndex === 'number' ? nameOrIndex : (schema?.queryNames?.indexOf(nameOrIndex) ?? 0);
                const q = schema.defaults.queries[idx];
                return q?.engine ?? 'sql';
            }

            /** Contenu éditable (depuis contentKey du schéma). Ex: queries.main.sql pour markdown. */
            static getCellEditableContent(cell) {
                if (!cell) return '';
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                if (!schema?.contentKey) return '';
                const q = ConfigManager.getQueryByName(cell, 'main');
                return (q?.sql ?? '') || (cell.content ?? '');
            }
            /** Définit le contenu éditable (queries.main.sql + content rétrocompat). */
            static setCellEditableContent(cell, value) {
                if (!cell) return;
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                if (!schema?.contentKey) return;
                ConfigManager.ensureCellQueries(cell, 'main');
                const q = ConfigManager.getQueryByName(cell, 'main');
                if (q) q.sql = value;
                cell.content = value;
            }
            /** Contenu à afficher : si engine sql/js = contenu calculé (contentResultKey) ; sinon contenu éditable. */
            static getCellContentDisplay(cell) {
                if (!cell) return '';
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                if (!schema?.contentKey) return '';
                const engine = ConfigManager.getCellEngine(cell, 'main');
                if (engine === 'sql' || engine === 'js') return (cell[schema.contentResultKey] ?? '') || '';
                return ConfigManager.getCellEditableContent(cell);
            }

            /** Contenu markdown à afficher : si engine text = contenu éditable ; si sql/js = _markdownContent (résultat d'exécution). @deprecated Utiliser getCellContentDisplay */
            static getMarkdownDisplayContent(cell) {
                return ConfigManager.getCellContentDisplay(cell);
            }
            /** Contenu markdown (queries.main.sql ou content en rétrocompat). @deprecated Utiliser getCellEditableContent */
            static getMarkdownContent(cell) {
                return ConfigManager.getCellEditableContent(cell);
            }
            /** Définit le contenu markdown (queries.main + content pour rétrocompat). @deprecated Utiliser setCellEditableContent */
            static setMarkdownContent(cell, value) {
                ConfigManager.setCellEditableContent(cell, value);
            }

            /** Retourne le nom du paramètre pour le DAG (name pour uiParameter, rétrocompat referenceName). */
            static getCellReferenceName(cell) {
                if (!cell) return '';
                if (CELL_TYPE_SCHEMAS?.types[cell?.type]?.useNameAsReference) return (cell.name ?? cell.referenceName ?? '').trim();
                return cell?.referenceName ?? '';
            }

            /** Vérifie si un nom est valide pour le type de cellule (depuis namePattern du schéma). */
            static isCellNameValid(cell, name) {
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                const pattern = schema?.namePattern;
                if (!pattern || !name) return true;
                return typeof pattern === 'object' && pattern.test ? pattern.test(String(name)) : true;
            }

            static cellBlocksAutoFlow(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.blocksAutoFlow; }
            static cellRequiresFileBeforeRun(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.requiresFileBeforeRun; }
            static cellSkippedWhenButtonLabel(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.skippedWhenButtonLabel; }
            static cellShowOnlyWhenButtonLabel(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.showOnlyWhenButtonLabel; }
            static cellHideInViewMode(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.hideInViewMode; }
            static cellShowInViewWhenResultOrRunning(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.showInViewWhenResultOrRunning; }
            static cellTableSearchable(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.tableSearchable; }
            static cellExportRuntimeBlob(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.exportRuntimeBlob; }
            static cellExportTemplateBase64(cell) { return !!CELL_TYPE_SCHEMAS?.types[cell?.type]?.exportTemplateBase64; }
            static hasCellsWithExportSlot(pages, slot) {
                const check = (groups) => {
                    for (const g of groups || []) {
                        for (const c of g.cells || []) {
                            if (CELL_TYPE_SCHEMAS?.types[c?.type]?.exportFileSlot === slot) return true;
                        }
                        if (check(g.children)) return true;
                    }
                    return false;
                };
                return (pages || []).some(p => check(p.groups || []) || check(p.linkGroups || []));
            }

            /**
             * Slot fichier unifié selon le type de cellule (depuis bodyConfig.fileSlot du schéma).
             */
            static getCellFileSlot(cell) {
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                return schema?.bodyConfig?.fileSlot ?? null;
            }

            /**
             * Lit les données fichier d'une cellule (structure unifiée files[] ou legacy depuis schéma).
             * @returns {{ base64: string, fileName: string } | null}
             */
            static getCellFileData(cell) {
                if (!cell) return null;
                const slot = ConfigManager.getCellFileSlot(cell);
                if (!slot) return null;
                if (Array.isArray(cell.files) && cell.files.length > 0) {
                    const f = cell.files.find(x => x.slot === slot) || cell.files[0];
                    if (f?.base64 && f?.fileName) return { base64: f.base64, fileName: f.fileName, compressed: f.compressed === true };
                }
                const bc = CELL_TYPE_SCHEMAS?.types[cell?.type]?.bodyConfig;
                const base64Key = bc?.fileBase64Key;
                const fileNameKey = bc?.fileFileNameKey ?? bc?.fileKey;
                if (base64Key && fileNameKey && cell[base64Key] && cell[fileNameKey]) {
                    return { base64: cell[base64Key], fileName: cell[fileNameKey], compressed: cell.files?.[0]?.compressed === true };
                }
                return null;
            }

            /**
             * Écrit les données fichier (structure unifiée files[]) et met à jour les champs legacy depuis le schéma.
             */
            static setCellFileData(cell, { base64, fileName }) {
                if (!cell || !base64 || !fileName) return;
                const slot = ConfigManager.getCellFileSlot(cell);
                if (!slot) return;
                ConfigManager.ensureCellFiles(cell);
                const idx = cell.files.findIndex(x => x.slot === slot);
                const entry = { slot, base64, fileName };
                if (idx >= 0) cell.files[idx] = entry; else cell.files.push(entry);
                const bc = CELL_TYPE_SCHEMAS?.types[cell?.type]?.bodyConfig;
                const base64Key = bc?.fileBase64Key;
                const fileNameKey = bc?.fileFileNameKey ?? bc?.fileKey;
                if (base64Key) cell[base64Key] = base64;
                if (fileNameKey) cell[fileNameKey] = fileName;
            }

            /** S'assure que cell.files existe. Migre legacy → files[0] si pertinent. */
            static ensureCellFiles(cell) {
                if (!cell) return;
                if (!Array.isArray(cell.files)) cell.files = [];
                const slot = ConfigManager.getCellFileSlot(cell);
                if (!slot || cell.files.some(f => f.slot === slot)) return;
                const data = ConfigManager.getCellFileData(cell);
                if (data) cell.files.push({ slot, base64: data.base64, fileName: data.fileName });
            }

            /** Retourne le moteur de la requête (queries[].engine). Valeurs: sql, js, text. Défaut depuis schéma. */
            static getCellEngine(cell, nameOrIndex = 'main') {
                if (!cell) return 'sql';
                const name = typeof nameOrIndex === 'number' ? (ConfigManager.getQueryNameForIndex(cell, nameOrIndex) || 'main') : nameOrIndex;
                const q = ConfigManager.getQueryByName(cell, name);
                const defaultEngine = ConfigManager.getDefaultEngineForType(cell, name);
                const e = q?.engine ? q.engine : defaultEngine;
                return e === 'duckdb-wasm' ? 'sql' : e;
            }

            /** S'assure que cell.queries existe et que la requête avec ce nom existe. Retourne la ref. Migre les queries sans name. */
            static ensureCellQueries(cell, nameOrIndex = 'main') {
                if (!cell) return null;
                if (!Array.isArray(cell.queries)) cell.queries = [];
                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                const name = typeof nameOrIndex === 'number' ? (schema?.queryNames?.[nameOrIndex] ?? (nameOrIndex === 0 ? 'main' : 'filename')) : nameOrIndex;
                let q = cell.queries.find(x => x.name === name);
                if (!q) {
                    const idx = schema?.queryNames?.indexOf(name);
                    if (idx >= 0 && cell.queries[idx] && !cell.queries[idx].name) {
                        cell.queries[idx].name = name;
                        q = cell.queries[idx];
                    } else {
                        const defaultEngine = ConfigManager.getDefaultEngineForType(cell, name);
                        q = { name, sql: '', engine: defaultEngine, clientVisible: false };
                        const insertIdx = schema?.queryNames?.indexOf(name) ?? cell.queries.length;
                        if (insertIdx < cell.queries.length) cell.queries.splice(insertIdx, 0, q);
                        else cell.queries.push(q);
                    }
                }
                return q;
            }

            /** S'assure que group.queries existe et que la requête condition d'affichage existe (name: 'main'). Retourne la requête. */
            static ensureGroupQueries(group) {
                if (!group) return null;
                if (!Array.isArray(group.queries)) group.queries = [];
                let q = group.queries.find(x => x.name === 'main');
                if (!q) {
                    if (group.queries[0] && !group.queries[0].name) { group.queries[0].name = 'main'; q = group.queries[0]; }
                    else { q = { name: 'main', sql: '', engine: 'sql', clientVisible: false }; group.queries.unshift(q); }
                }
                return q;
            }

            /** Retourne la requête conditionnelle du groupe (name: 'main') ou null. */
            static getGroupIfQuery(group) {
                if (!group) return null;
                if (!Array.isArray(group.queries) || group.queries.length === 0) return null;
                const q = group.queries.find(x => x.name === 'main') || group.queries[0];
                const hasSql = q && (q.sql || '').trim();
                return hasSql ? q : null;
            }

            /** Définit la requête par nom (ex: 'main', 'fallback', 'filename'). */
            static setCellQuery(cell, nameOrIndex, sql) {
                const q = ConfigManager.ensureCellQueries(cell, nameOrIndex);
                if (q) q.sql = sql;
            }

            static encodeUTF8ToBase64(str) {
                return btoa(unescape(encodeURIComponent(str)));
            }

            /**
             * Génère un ID unique pour un groupe
             */
            static generateGroupId() {
                return 'grp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }

            /**
             * Génère un ID unique pour une page
             */
            static generatePageId() {
                return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }

            static deepMerge(target, source) {
                const output = { ...target };
                if (target && typeof target === 'object' && source && typeof source === 'object') {
                    Object.keys(source).forEach(key => {
                        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                            output[key] = ConfigManager.deepMerge(target[key] || {}, source[key]);
                        } else {
                            output[key] = source[key];
                        }
                    });
                }
                return output;
            }

            /**
             * Parse les paramètres UI depuis l'URL
             * Paramètres supportés: devMode, showLayout (ou displaySettings rétrocompat), theme, dbEngine
             * @returns {Object} Objet contenant les paramètres UI trouvés dans l'URL
             */
            static getUIParamsFromURL() {
                const urlParams = new URLSearchParams(window.location.search);
                const uiParams = {};

                // devMode: boolean
                if (urlParams.has('devMode')) {
                    const val = urlParams.get('devMode').toLowerCase();
                    uiParams.devMode = val !== 'false' && val !== '0';
                }

                // showLayout: boolean (displaySettings conservé pour rétrocompat)
                if (urlParams.has('showLayout')) {
                    const val = urlParams.get('showLayout').toLowerCase();
                    uiParams.showLayout = val !== 'false' && val !== '0';
                } else if (urlParams.has('displaySettings')) {
                    const val = urlParams.get('displaySettings').toLowerCase();
                    uiParams.showLayout = val !== 'false' && val !== '0';
                }

                // theme: string
                if (urlParams.has('theme')) {
                    uiParams.theme = urlParams.get('theme');
                }

                // dbEngine: string
                if (urlParams.has('dbEngine')) {
                    uiParams.dbEngine = urlParams.get('dbEngine');
                }

                return uiParams;
            }

            /**
             * Applique les paramètres UI de l'URL sur une config existante
             * Priorité: URL > config existante
             */
            static applyURLParamsToConfig(config) {
                const urlParams = ConfigManager.getUIParamsFromURL();
                if (Object.keys(urlParams).length === 0) {
                    return config;
                }

                // Créer une copie de la config avec les paramètres URL appliqués
                const result = { ...config };
                result.ui = { ...(config.ui || {}), ...urlParams };
                return result;
            }

            /**
             * Décompresse les fichiers marqués compressed dans la config (JSON/Gist).
             * Modifie la config en place. Appelé avant d'utiliser la config.
             */
            static async prepareConfigForLoad(config) {
                if (!config?.job?.pages) return config;
                const decompressInGroup = async (group) => {
                    if (group.children?.length) {
                        for (const child of group.children) await decompressInGroup(child);
                    }
                    for (const cell of group.cells || []) {
                        if (!Array.isArray(cell.files)) continue;
                        for (const f of cell.files) {
                            if (f.compressed && f.base64 && f.fileName) {
                                try {
                                    const bytes = FileHandler.base64ToUint8Array(f.base64);
                                    const decompressed = await FileHandler.decompressGzip(bytes);
                                    f.base64 = FileHandler.arrayBufferToBase64(decompressed);
                                    delete f.compressed;
                                } catch (e) {
                                    console.warn('Décompression fichier échouée:', f.fileName, e);
                                }
                            }
                        }
                        if (cell.fileBase64 && cell.files?.[0]?.compressed) {
                            try {
                                const bytes = FileHandler.base64ToUint8Array(cell.fileBase64);
                                const decompressed = await FileHandler.decompressGzip(bytes);
                                cell.fileBase64 = FileHandler.arrayBufferToBase64(decompressed);
                                if (cell.files[0]) delete cell.files[0].compressed;
                            } catch (e) {
                                console.warn('Décompression fileBase64 échouée:', e);
                            }
                        }
                    }
                };
                for (const page of config.job.pages) {
                    for (const group of page.groups || []) await decompressInGroup(group);
                }
                return config;
            }

            /**
             * Charge la configuration avec la priorité: URL > gist > base64 > default
             */
            static async loadConfigFromGist() {
                const gistId = (() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const gistParam = urlParams.get('gist');
                    if (gistParam && /^[a-f0-9]{32}$/i.test(gistParam)) return gistParam;
                    if (gistParam) {
                        const match = gistParam.match(/gist\.github\.com\/[^\/]+\/([a-f0-9]{32})/i);
                        if (match) return match[1];
                    }
                    const configParam = urlParams.get('config');
                    if (configParam) {
                        const match = configParam.match(/gist\.github\.com\/[^\/]+\/([a-f0-9]{32})/i);
                        if (match) return match[1];
                    }
                    const fullUrlMatch = window.location.href.match(/gist\.github\.com\/[^\/]+\/([a-f0-9]{32})/i);
                    if (fullUrlMatch) return fullUrlMatch[1];
                    return null;
                })();

                let baseConfig = null;

                if (gistId) {
                    try {
                        const apiUrl = `https://api.github.com/gists/${gistId}`;
                        const response = await fetch(apiUrl);
                        if (response.ok) {
                            const gistData = await response.json();
                            const files = Object.values(gistData.files || {});
                            const jsonFile = files.find(file =>
                                file.filename.toLowerCase().endsWith('.json') ||
                                file.type === 'application/json'
                            );
                            if (jsonFile) {
                                try {
                                    const parsed = JSON.parse(jsonFile.content);
                                    let config;
                                    if (GistEncrypt.isEncrypted(parsed)) {
                                        return { needsPassphrase: true, encryptedContent: parsed };
                                    } else {
                                        config = parsed;
                                        baseConfig = ConfigManager.deepMerge(ConfigManager.getDefaultConfig(), config);
                                        await ConfigManager.prepareConfigForLoad(baseConfig);
                                    }
                                } catch (err) {
                                    console.error('❌ Erreur Gist (parsing ou déchiffrement):', err);
                                    throw new Error(err.message || `Erreur: ${String(err)}`);
                                }
                            } else {
                                console.warn('⚠️ Aucun fichier JSON trouvé dans le Gist');
                            }
                        } else {
                            console.error('❌ Erreur HTTP lors du chargement du Gist:', response.status, response.statusText);
                        }
                    } catch (error) {
                        console.error('❌ Erreur lors du chargement du Gist:', error);
                    }
                }

                // Si pas de config depuis le gist, utiliser la config par défaut (base64 ou HTML embarqué)
                if (!baseConfig) {
                    const defaultResult = ConfigManager.loadDefaultConfigOrEncrypted();
                    if (defaultResult.needsPassphrase && defaultResult.encryptedContent) {
                        return { needsPassphrase: true, encryptedContent: defaultResult.encryptedContent, source: defaultResult.source || 'html' };
                    }
                    baseConfig = defaultResult.config;
                    await ConfigManager.prepareConfigForLoad(baseConfig);
                }

                // Appliquer les paramètres URL en priorité (URL > gist > base64 > default)
                return ConfigManager.applyURLParamsToConfig(baseConfig);
            }

            /** Bâtit le tableau queries[] pour l'export (schéma unifié). Assure que chaque query a un name. */
            static _buildQueriesForClean(cell) {
                if (Array.isArray(cell.queries) && cell.queries.length > 0) {
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    return cell.queries.map((q, i) => ({
                        name: q.name || schema?.queryNames?.[i] || (i === 0 ? 'main' : i === 1 ? 'filename' : 'query' + i),
                        sql: q.sql || '',
                        engine: q.engine || ConfigManager.getDefaultEngineForType(cell?.type, i),
                        clientVisible: q.clientVisible === true
                    }));
                }
                const arr = [];
                const qMain = ConfigManager.getCellQuery(cell, 'main');
                if (qMain) arr.push({ name: 'main', sql: qMain, engine: ConfigManager.getCellEngine(cell, 'main'), clientVisible: ConfigManager.getCellQueryClientVisible(cell, 'main') });
                const qFallback = ConfigManager.getCellQuery(cell, 'fallback') || ConfigManager.getCellQuery(cell, 'filename');
                if (qFallback) arr.push({ name: ConfigManager.getQuery2Name(cell), sql: qFallback, engine: 'sql', clientVisible: false });
                return arr;
            }

            static async cleanCell(cell, includeFileData = false) {
                const cleanCell = { type: cell.type };

                const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                const exportFields = schema?.exportFields ?? ['queries'];

                for (const field of exportFields) {
                    if (field === 'queries') {
                        cleanCell.queries = ConfigManager._buildQueriesForClean(cell);
                        if (cell.type === 'markdown' && (!Array.isArray(cleanCell.queries) || cleanCell.queries.length === 0)) {
                            cleanCell.queries = [{ name: 'main', sql: ConfigManager.getCellEditableContent(cell), engine: ConfigManager.getCellEngine(cell, 'main'), clientVisible: ConfigManager.getCellQueryClientVisible(cell, 'main') }];
                        }
                    } else if (field === 'name') {
                        const handler = CELL_TYPE_HANDLERS[cell?.type];
                        const val = handler?.getExportValue ? handler.getExportValue(cell, 'name') : cell.name;
                        if (val !== undefined) cleanCell.name = val;
                    } else if (field === 'json') {
                        if (schema?.exportJsonMode === 'string') {
                            cleanCell.json = typeof cell.json === 'string' ? cell.json : (cell.json ? JSON.stringify(cell.json) : '');
                        } else {
                            cleanCell.json = cell.json || {};
                            if (cell.json?.xlsx) cleanCell.json.xlsx = cell.json.xlsx;
                            if (cell.json?.perspectiveConfig !== undefined) {
                                let cfg = cell.json.perspectiveConfig;
                                cleanCell.json.perspectiveConfig = typeof cfg === 'string' ? cfg.replace(/\r\n/g, '\n').replace(/\r/g, '\n') : (cfg != null ? JSON.stringify(cfg, null, 2) : '');
                            }
                        }
                    } else if (cell[field] !== undefined) {
                        cleanCell[field] = cell[field];
                    }
                }

                if (includeFileData && schema?.exportFileSlot) {
                    const slot = schema.exportFileSlot;
                    if (slot === 'source' && cell._currentFile && cell._fileName) {
                        try {
                            const arrayBuffer = await cell._currentFile.arrayBuffer();
                            const compressedBuffer = await FileHandler.compressGzip(arrayBuffer);
                            const base64 = FileHandler.arrayBufferToBase64(compressedBuffer);
                            cleanCell.files = [{ slot, base64, fileName: cell._fileName, compressed: true }];
                        } catch (e) {
                            console.warn('Impossible de lire le fichier source:', e);
                        }
                    } else {
                        const fileData = ConfigManager.getCellFileData(cell);
                        if (fileData) {
                            let base64 = fileData.base64;
                            let compressed = !!fileData.compressed;
                            if (!compressed) {
                                try {
                                    const bytes = FileHandler.base64ToUint8Array(base64);
                                    const rawBuffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
                                    const compressedBuffer = await FileHandler.compressGzip(rawBuffer);
                                    base64 = FileHandler.arrayBufferToBase64(compressedBuffer);
                                    compressed = true;
                                } catch (e) {
                                    console.warn('Compression fichier échouée:', e);
                                }
                            }
                            cleanCell.files = [{ slot, base64, fileName: fileData.fileName, compressed }];
                        }
                    }
                }
                const orderValue = ConfigManager.normalizeOrder(cell._order, undefined);
                if (orderValue !== undefined) {
                    cleanCell.order = orderValue;
                }

                // Ajouter childGroupId si présent
                if (cell.childGroupId) {
                    cleanCell.childGroupId = cell.childGroupId;
                }

                // Ajouter name (pour onglets tabsChild)
                if (cell.name !== undefined && cell.name !== '') {
                    cleanCell.name = cell.name;
                }

                // Taille optionnelle des cellules (px et % combinables, largeur + hauteur)
                const opt = (k, v) => { if (v !== undefined && v !== null && String(v).trim() !== '') cleanCell[k] = v; };
                opt('minSizePx', cell.minSizePx);
                opt('minSizePercent', cell.minSizePercent);
                opt('maxSizePx', cell.maxSizePx);
                opt('maxSizePercent', cell.maxSizePercent);
                opt('minHeightPx', cell.minHeightPx);
                opt('minHeightPercent', cell.minHeightPercent);
                opt('maxHeightPx', cell.maxHeightPx);
                opt('maxHeightPercent', cell.maxHeightPercent);

                // Bordure : export uniquement si false (sinon true par défaut)
                if (cell.border === false) {
                    cleanCell.border = false;
                }

                return cleanCell;
            }

            static async cleanGroup(group, includeFileData = false) {
                const cleanGroup = {
                    direction: group.direction || 'row',
                    style: group.style || '',
                    cells: await Promise.all((group.cells || []).map(cell => ConfigManager.cleanCell(cell, includeFileData)))
                };

                // Ajouter les paramètres accordion si définis
                if (group.accordion) {
                    cleanGroup.accordion = true;
                    cleanGroup.title = group.title || '';
                    cleanGroup.accordionOpen = group.accordionOpen !== false; // true par défaut
                }

                // Ajouter tabsChild et name (pour onglets)
                if (group.tabsChild) {
                    cleanGroup.tabsChild = true;
                }
                if (group.name !== undefined && group.name !== '') {
                    cleanGroup.name = group.name;
                }

                // Ajouter queries si défini (condition d'affichage en mode client = queries[0] avec name: 'main')
                if (Array.isArray(group.queries) && group.queries.length > 0) {
                    const q0 = ConfigManager.getGroupIfQuery(group) || group.queries[0];
                    if (q0 && (q0.sql || '').trim()) {
                        cleanGroup.queries = [{
                            name: 'main',
                            sql: q0.sql.trim(),
                            engine: q0.engine || 'sql',
                            clientVisible: q0.clientVisible === true
                        }];
                    }
                }

                // Ajouter la config de loop si elle existe
                if (group.loop && group.loop.enabled) {
                    cleanGroup.loop = {
                        enabled: true,
                        query: group.loop.query || '',
                        zip: group.loop.zip || false,
                        zipQuery: group.loop.zipQuery || ''
                    };
                }

                // Support Alpine state: _type, _id, _order (et config: type, id, order)
                const groupType = group.type ?? group._type ?? 'core';
                cleanGroup.type = groupType;
                cleanGroup.id = group.id ?? group._id ?? ConfigManager.generateGroupId();

                // Ajouter order seulement pour les groupes "core"
                if (groupType === 'core') {
                    const orderValue = ConfigManager.normalizeOrder(group.order ?? group._order, undefined);
                    if (orderValue !== undefined) {
                        cleanGroup.order = orderValue;
                    }
                }

                // Récursivement nettoyer les children
                if (group.children && group.children.length > 0) {
                    cleanGroup.children = await Promise.all(group.children.map(child => ConfigManager.cleanGroup(child, includeFileData)));
                }

                return cleanGroup;
            }

            static async buildConfigFromState(pages, devMode = true, showLayout = true, includeFileData = false, theme = 'light', dbEngine = 'duckdb-wasm', directedAcyclicGraph = false, customThemeLight = '', customThemeDark = '') {
                // Nettoyer chaque page
                const cleanPages = await Promise.all(pages.map(async (page) => {
                    const cleanGroups = await Promise.all(page.groups.map(group => ConfigManager.cleanGroup(group, includeFileData)));
                    const cleanLinkGroups = await Promise.all((page.linkGroups || []).map(group => ConfigManager.cleanGroup(group, includeFileData)));

                    // Merger groups et linkGroups dans un seul tableau
                    const allGroups = [...cleanGroups, ...cleanLinkGroups];

                    return {
                        name: page.name,
                        groups: allGroups
                    };
                }));

                return {
                    version: ConfigManager.SQLJOB_VERSION,
                    createdAt: new Date().toISOString(),
                    ui: {
                        devMode: devMode,
                        showLayout: showLayout,
                        theme: theme,
                        dbEngine: dbEngine,
                        directedAcyclicGraph: directedAcyclicGraph,
                        ...(customThemeLight ? { customThemeLight } : {}),
                        ...(customThemeDark  ? { customThemeDark  } : {}),
                    },
                    job: {
                        pages: cleanPages
                    }
                };
            }
        }
