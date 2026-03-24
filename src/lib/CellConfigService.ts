// @ts-nocheck
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from './cellTypeSchemas'
import { ConfigManager } from './ConfigManager'
import { FileHandler } from './FileHandler'

        /** Initialisation partagée d'une cellule (initCell + restore). Utilisé par notebookApp et applyImportedConfig. */
        export function initializeCell(cell, cellIndex, opts = {}) {
            const generateId = opts.generateId || (() => 'cell_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
            const newCell = {
                ...cell,
                _id: generateId(),
                _status: null,
                _results: null,
                _resultInfo: null,
                _order: ConfigManager.normalizeOrder(cell.order, cellIndex)
            };
            const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];

            if (schema?.initProps) {
                for (const [k, v] of Object.entries(schema.initProps)) {
                    newCell[k] = Array.isArray(v) ? [] : v;
                }
            }

            if (schema?.initFileSlot) {
                const { slot, asBlob } = schema.initFileSlot;
                ConfigManager.ensureCellFiles(cell);
                newCell.files = cell.files;
                const fileData = ConfigManager.getCellFileData(cell);
                if (asBlob) {
                    if (fileData) {
                        newCell._fileName = fileData.fileName;
                        const uint8Array = FileHandler.base64ToUint8Array(fileData.base64);
                        const blob = new Blob([uint8Array], { type: FileHandler.getMimeTypeFromFileName(fileData.fileName) });
                        newCell._currentFile = new File([blob], fileData.fileName, { type: blob.type });
                        newCell._pendingFileLoad = true;
                    } else {
                        newCell._fileName = '';
                        newCell._currentFile = null;
                    }
                } else if (fileData) {
                    newCell.docxTemplateBase64 = fileData.base64;
                    newCell.docxTemplateFileName = fileData.fileName;
                }
            }

            const handler = CELL_TYPE_HANDLERS[cell?.type];
            if (handler?.onInit) handler.onInit(cell, newCell);

            return newCell;
        }

        // ═══════════════════════════════════════════════════════════════════════════
        // SERVICE CONFIG CELLULE (CellConfigService)
        // ═══════════════════════════════════════════════════════════════════════════
        export class CellConfigService {
            static getSchemaForType(type) {
                return CELL_TYPE_SCHEMAS.types[type] || null;
            }
            static getCommonParamDef(paramKey, type) {
                const common = CELL_TYPE_SCHEMAS.common[paramKey];
                if (!common) return null;
                const schema = CELL_TYPE_SCHEMAS.types[type];
                if (!schema) return common;
                const override = schema[paramKey + 'Label'] || schema[paramKey + 'Tooltip'] || schema[paramKey + 'Placeholder'];
                const label = schema[paramKey + 'Label'] ?? common.label;
                const tooltip = schema[paramKey + 'Tooltip'] ?? common.tooltip;
                const placeholder = schema[paramKey + 'Placeholder'] ?? common.placeholder;
                return { ...common, label, tooltip, placeholder };
            }
            static getCommonParamsForType(type) {
                const schema = CELL_TYPE_SCHEMAS.types[type];
                return (schema?.commonParams || ['name']).filter(p => CELL_TYPE_SCHEMAS.common[p]);
            }
            static getSpecificParamsForType(type) {
                if (type == null) return [];
                return CELL_TYPE_SCHEMAS.types[type]?.specificParams || [];
            }
            static ensureCellFromSchema(cell, type, opts = {}) {
                const schema = CELL_TYPE_SCHEMAS.types[type];
                if (!schema || !cell) return;
                const { baseName } = opts;
                const defaults = schema.defaults || {};
                for (const [k, v] of Object.entries(defaults)) {
                    if (k === 'queries') {
                        const qNames = schema.queryNames ?? (schema.queryCount ? Array.from({ length: schema.queryCount }, (_, i) => i === 0 ? 'main' : i === 1 ? 'filename' : 'query' + i) : ['main']);
                        for (let i = 0; i < qNames.length; i++) {
                            const qName = qNames[i];
                            ConfigManager.ensureCellQueries(cell, qName);
                            const d = Array.isArray(v) ? (v.find(x => x.name === qName) || v[i]) : { sql: '', engine: 'sql', clientVisible: false };
                            const q = ConfigManager.getQueryByName(cell, qName);
                            if (q && d) {
                                if (!q.sql && d.sql) {
                                    const sql = (typeof d.sql === 'string' && baseName) ? d.sql.replace(/\{name\}/g, baseName) : d.sql;
                                    q.sql = sql;
                                }
                                if (d.engine !== undefined && q.engine === undefined) q.engine = d.engine;
                                if (d.clientVisible !== undefined && q.clientVisible === undefined) q.clientVisible = d.clientVisible;
                                if (d.showQueryResult !== undefined && q.showQueryResult === undefined) q.showQueryResult = d.showQueryResult;
                            }
                        }
                    } else if (cell[k] === undefined) {
                        if (k === 'json' && typeof v === 'object') cell.json = { ...v };
                        else if (typeof v === 'object' && v !== null && !Array.isArray(v)) cell[k] = { ...v };
                        else cell[k] = v;
                    } else if (k === 'json' && typeof v === 'object' && cell.json && typeof cell.json === 'object') {
                        // Fusionner les clés manquantes du défaut sans écraser les valeurs chargées (ex: json.perspectiveConfig)
                        for (const [dk, dv] of Object.entries(v)) {
                            if (cell.json[dk] === undefined) cell.json[dk] = dv;
                        }
                    }
                }
                const qNames = schema.queryNames ?? (schema.queryCount ? Array.from({ length: schema.queryCount }, (_, i) => i === 0 ? 'main' : i === 1 ? 'filename' : 'query' + i) : ['main']);
                for (const qName of qNames) ConfigManager.ensureCellQueries(cell, qName);
                if (schema.defaults?.json !== undefined && !cell.json) cell.json = {};
                // pdfme: json doit être une chaîne pour textarea/modale (éviter [object Object])
                if (type === 'pdfme' && typeof cell.json === 'object' && cell.json !== null) {
                    cell.json = JSON.stringify(cell.json, null, 2);
                }
            }
            static applyDefaultsOnTypeChange(cell, newType, opts = {}) {
                if (!cell) return;
                const schema = CELL_TYPE_SCHEMAS.types[newType];
                if (!schema) return;
                const oldType = opts.oldType || cell.type;
                const oldSchema = CELL_TYPE_SCHEMAS.types[oldType];
                const newParamKeys = new Set([...(schema.commonParams || []), ...(schema.specificParams || []).map(p => (typeof p === 'object' ? p.key : p).split('.')[0].split('[')[0])]);
                const typeSpecificKeys = ['content', 'paramType', 'inputType', 'rangeMin', 'rangeMax', 'rangeStep', 'userVisible', 'userEditable', 'preserveUserValue', 'maxRows', 'perspectiveCdns'];
                for (const key of typeSpecificKeys) {
                    if (!newParamKeys.has(key)) delete cell[key];
                }
                delete cell.json;
                cell.type = newType;
                this.ensureCellFromSchema(cell, newType, opts);
            }
            static isSpecificParamVisible(param, cell) {
                if (!param.when || !cell) return true;
                for (const [k, v] of Object.entries(param.when)) {
                    if (cell[k] !== v) return false;
                }
                return true;
            }
            /** Lit une valeur via un chemin (ex: 'queries.main.sql', 'queries[0].sql' rétrocompat, 'json.xlsx'). Pour json.xlsx retourne JSON.stringify. */
            static getCellValueByPath(cell, path) {
                if (!cell || !path) return undefined;
                // Pour cellules avec contenu éditable (ex. markdown): la modale affiche la requête ou le contenu selon l'engine
                if (path === 'content') {
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    if (schema?.contentKey) {
                        const engine = ConfigManager.getCellEngine(cell, 'main');
                        const queryVal = ConfigManager.getCellQuery(cell, 'main') || '';
                        const result = (engine === 'sql' || engine === 'js') ? queryVal : ConfigManager.getCellEditableContent(cell);
                        return result;
                    }
                }
                if (path === 'json.xlsx') return JSON.stringify(cell.json?.xlsx || {}, null, 2);
                if (path === 'json.perspectiveConfig') {
                    const cfg = cell.json?.perspectiveConfig;
                    return (typeof cfg === 'string') ? cfg : (cfg != null ? JSON.stringify(cfg, null, 2) : '');
                }
                if (path === 'json') {
                    const v = cell.json;
                    return (typeof v === 'object' && v !== null) ? JSON.stringify(v, null, 2) : (v ?? '');
                }
                // Rétrocompat: queries[0] -> queries.main, queries[1] -> queries.fallback ou queries.filename selon le type
                const qMatch = path.match(/^queries\[(\d+)\]\.(.*)$/);
                if (qMatch) {
                    const idx = parseInt(qMatch[1], 10);
                    const subPath = qMatch[2];
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    const name = schema?.queryNames?.[idx] ?? (idx === 0 ? 'main' : idx === 1 ? 'filename' : '');
                    if (name) path = `queries.${name}.${subPath}`;
                }
                if (path.startsWith('queries.')) {
                    const parts = path.split('.');
                    if (parts.length >= 3 && parts[0] === 'queries') {
                        const qName = parts[1];
                        const subPath = parts.slice(2).join('.');
                        let q = Array.isArray(cell.queries) && cell.queries.find(x => x.name === qName);
                        if (!q) {
                            const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                            const idx = schema?.queryNames?.indexOf(qName);
                            if (idx >= 0 && cell.queries?.[idx]) q = cell.queries[idx];
                        }
                        if (q && subPath) {
                            const val = q[subPath];
                            const defaultEngine = ConfigManager.getDefaultEngineForType(cell?.type, qName);
                            const ret = (subPath === 'engine' && val === undefined) ? defaultEngine : val;
                            return ret;
                        }
                    }
                }
                const parts = path.replace(/\]/g, '').split(/\.|\[/).filter(Boolean);
                let v = cell;
                for (const p of parts) v = v?.[isNaN(p) ? p : parseInt(p, 10)];
                return v;
            }
            /** Écrit une valeur via un chemin. Pour json.xlsx : value est une chaîne JSON. Supporte queries.main.xxx et queries[0].xxx (rétrocompat). */
            static setCellValueByPath(cell, path, value) {
                if (!cell || !path) return;
                if (path === 'content') {
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    if (schema?.contentKey) { ConfigManager.setCellEditableContent(cell, value); return; }
                }
                if (path === 'json.xlsx') {
                    if (!cell.json) cell.json = {};
                    try { cell.json.xlsx = JSON.parse(value); } catch (e) {}
                    return;
                }
                if (path === 'json.perspectiveConfig') {
                    if (!cell.json) cell.json = {};
                    cell.json.perspectiveConfig = typeof value === 'string' ? value : (value ?? '');
                    return;
                }
                if (path === 'json') {
                    cell.json = typeof value === 'string' ? value : (value != null ? JSON.stringify(value) : '');
                    return;
                }
                if (path.startsWith('json.') && !cell.json) cell.json = {};
                const qMatch = path.match(/^queries\[(\d+)\]\.(.*)$/);
                if (qMatch) {
                    const idx = parseInt(qMatch[1], 10);
                    const subPath = qMatch[2];
                    const schema = CELL_TYPE_SCHEMAS?.types[cell?.type];
                    const name = schema?.queryNames?.[idx] ?? (idx === 0 ? 'main' : idx === 1 ? 'filename' : '');
                    if (name) path = `queries.${name}.${subPath}`;
                }
                if (path.startsWith('queries.')) {
                    const parts = path.split('.');
                    if (parts.length >= 3 && parts[0] === 'queries') {
                        const qName = parts[1];
                        const subPath = parts.slice(2).join('.');
                        if (!Array.isArray(cell.queries)) cell.queries = [];
                        let q = cell.queries.find(x => x.name === qName);
                        if (!q) {
                            const defaultEngine = ConfigManager.getDefaultEngineForType(cell?.type, qName);
                            q = { name: qName, sql: '', engine: defaultEngine, clientVisible: false };
                            cell.queries.push(q);
                        }
                        if (q && subPath) {
                            q[subPath] = value;
                        }
                        return;
                    }
                }
                const parts = path.replace(/\]/g, '').split(/\.|\[/).filter(Boolean);
                const last = parts.pop();
                let target = cell;
                for (let i = 0; i < parts.length; i++) {
                    const p = parts[i];
                    const key = isNaN(p) ? p : parseInt(p, 10);
                    const next = parts[i + 1];
                    if (target[key] === undefined) target[key] = (next !== undefined && !isNaN(next)) ? [] : {};
                    target = target[key];
                }
                if (target) target[last] = value;
            }
        }
