/**
 * Web component Lit encapsulant Univer Sheets.
 * Utilise les packages npm (@univerjs/presets, @univerjs/preset-sheets-core)
 * au lieu du chargement CDN/UMD, ce qui évite le conflit AMD
 * "Can only have one anonymous define call per script file".
 *
 * Pattern inspiré du showcase : https://docs.univer.ai/showcase/sheets/lit
 */
import { LitElement, html } from 'lit'
import '@univerjs/preset-sheets-core/lib/index.css'
import '@univerjs/preset-sheets-table/lib/index.css'
import { ConfigManager } from '../../lib/ConfigManager'

// ─── Helper ────────────────────────────────────────────────────────────────────

function _buildWorkbookFromRows(rows: any[], cellId: string, evalFormulas = false, cellTypes?: number[]): any {
    const sheetId = 'sheet-' + cellId
    const cellData: Record<number, Record<number, { v?: any; t?: number; f?: string }>> = {}
    if (!rows || rows.length === 0) {
        return { id: 'wb-' + cellId, name: 'Sheet', sheets: { [sheetId]: { id: sheetId, name: 'Feuille1', cellData } } }
    }
    const columns = Object.keys(rows[0])
    cellData[0] = {}
    columns.forEach((col, ci) => { cellData[0][ci] = { v: col, t: 1 } })
    rows.forEach((row, ri) => {
        cellData[ri + 1] = {}
        columns.forEach((col, ci) => {
            const val = row[col]
            const v = val === null || val === undefined ? '' : val
            if (evalFormulas && typeof v === 'string' && v.startsWith('=')) {
                cellData[ri + 1][ci] = { f: v }
            } else if (v === '') {
                cellData[ri + 1][ci] = { v }
            } else {
                const t = cellTypes?.[ci] ?? (typeof v === 'boolean' ? 4 : typeof v === 'number' ? 2 : 1)
                cellData[ri + 1][ci] = { v, t }
            }
        })
    })
    return {
        id: 'wb-' + cellId,
        name: 'Sheet',
        sheets: { [sheetId]: { id: sheetId, name: 'Feuille1', cellData } },
    }
}

// ─── Parseur tolérant pour la syntaxe des docs Univer ─────────────────────────
// Extrait les clés simples + reconnaît LocaleType.XX_XX.
// La clé `locales` est ignorée (gérée en interne via le champ `locale`).

const _LOCALE_TYPE_MAP: Record<string, string> = {
    EN_US: 'en-US', FR_FR: 'fr-FR', ZH_CN: 'zh-CN', ZH_TW: 'zh-TW',
    RU_RU: 'ru-RU', JA_JP: 'ja-JP', ES_ES: 'es-ES', CA_ES: 'ca-ES',
    SK_SK: 'sk-SK', FA_IR: 'fa-IR', VI_VN: 'vi-VN', KO_KR: 'ko-KR',
}

function _parseUniverDocsSyntax(raw: string): Record<string, any> {
    const result: Record<string, any> = {}

    // locale: LocaleType.XX_XX
    const localeMatch = raw.match(/\blocale\s*:\s*LocaleType\.(\w+)/)
    if (localeMatch && _LOCALE_TYPE_MAP[localeMatch[1]]) {
        result.locale = _LOCALE_TYPE_MAP[localeMatch[1]]
    }

    // Clés simples : key: true|false|number|"string"|'string'
    // Exclut `locales` (objet complexe géré en interne)
    const simpleRe = /\b(\w+)\s*:\s*(true|false|-?\d+(?:\.\d+)?|"[^"]*"|'[^']*')/g
    let m: RegExpExecArray | null
    while ((m = simpleRe.exec(raw)) !== null) {
        const key = m[1]
        if (key === 'locale' && result.locale) continue
        if (key === 'locales') continue
        try { result[key] = JSON.parse(m[2].replace(/'/g, '"')) } catch (_) {}
    }

    return result
}

// ─── CSV helpers ───────────────────────────────────────────────────────────────

function _escapeCSV(val: any): string {
    if (val === null || val === undefined) return ''
    const s = String(val)
    if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
        return '"' + s.replace(/"/g, '""') + '"'
    }
    return s
}

type _ColKind = 'DATE' | 'TIMESTAMP' | 'DOUBLE' | 'BOOLEAN' | 'VARCHAR'

function _excelSerialToISO(serial: number, kind: 'DATE' | 'TIMESTAMP'): string {
    const date = new Date((serial - 25569) * 86_400_000)
    const y = date.getUTCFullYear()
    const m = String(date.getUTCMonth() + 1).padStart(2, '0')
    const d = String(date.getUTCDate()).padStart(2, '0')
    if (kind === 'DATE') return `${y}-${m}-${d}`
    const hh = String(date.getUTCHours()).padStart(2, '0')
    const mm = String(date.getUTCMinutes()).padStart(2, '0')
    const ss = String(date.getUTCSeconds()).padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
}

function _detectColKind(
    snapshot: any,
    cellData: Record<number, Record<number, any>>,
    ci: number,
    maxRow: number,
): _ColKind {
    for (let r = 1; r <= maxRow; r++) {
        const cell = cellData[r]?.[ci]
        if (cell == null) continue
        const t = cell.t ?? 1
        if (t === 4) return 'BOOLEAN'
        if (t === 1 || t === 3) return 'VARCHAR'
        if (t === 2) {
            const pattern: string | undefined = snapshot.styles?.[cell.s]?.n?.pattern
            if (pattern) {
                const hasDate = /[yYdD]/.test(pattern)
                const hasTime = /[Hh]:[mM]/.test(pattern)
                if (hasDate && hasTime) return 'TIMESTAMP'
                if (hasDate) return 'DATE'
            }
            return 'DOUBLE'
        }
        break
    }
    return 'VARCHAR'
}

function _extractSheetData(univerAPI: any): { csv: string; columnTypes: Record<string, string> } | null {
    try {
        const fWorkbook = univerAPI.getActiveWorkbook()
        if (!fWorkbook) return null
        const snapshot = fWorkbook.save()
        const sheetId = snapshot.sheetOrder?.[0] ?? Object.keys(snapshot.sheets ?? {})[0]
        const sheet = snapshot.sheets?.[sheetId]
        if (!sheet?.cellData) return null
        const cellData: Record<number, Record<number, any>> = sheet.cellData
        const rowKeys = Object.keys(cellData).map(Number)
        if (rowKeys.length === 0) return null
        const maxRow = Math.max(...rowKeys)
        const allColKeys = rowKeys.flatMap(r => Object.keys(cellData[r] ?? {}).map(Number))
        const maxCol = allColKeys.length > 0 ? Math.max(...allColKeys) : 0

        const headerRow = cellData[0] ?? {}
        const colKinds: _ColKind[] = []
        const columnTypes: Record<string, string> = {}
        for (let c = 0; c <= maxCol; c++) {
            const kind = _detectColKind(snapshot, cellData, c, maxRow)
            colKinds[c] = kind
            const header = String(headerRow[c]?.v ?? `col${c}`)
            columnTypes[header] = kind
        }

        const csvRows: string[] = []
        for (let r = 0; r <= maxRow; r++) {
            const cols: string[] = []
            for (let c = 0; c <= maxCol; c++) {
                const val = cellData[r]?.[c]?.v
                if (r === 0) { cols.push(_escapeCSV(val)); continue }
                if (val === null || val === undefined) { cols.push(''); continue }
                const kind = colKinds[c]
                if ((kind === 'DATE' || kind === 'TIMESTAMP') && typeof val === 'number') {
                    cols.push(_excelSerialToISO(val, kind))
                } else if (kind === 'BOOLEAN') {
                    cols.push(val ? 'true' : 'false')
                } else {
                    cols.push(_escapeCSV(val))
                }
            }
            csvRows.push(cols.join(','))
        }
        return { csv: csvRows.join('\n'), columnTypes }
    } catch {
        return null
    }
}

// ─── Web Component ─────────────────────────────────────────────────────────────

export interface UniverInitParams {
    rows: any[] | null
    rowCellTypes?: number[] | null          // CellValueType par colonne issu d'Arrow (1=STRING, 2=NUMBER, 4=BOOLEAN)
    rowColumnFormats?: (string | null)[] | null  // numFmt par colonne (ex. 'yyyy-mm-dd') — appliqué via columnData
    snapshot: string | null
    cellId: string
    name?: string
    readonly: boolean
    config?: any   // Objet ou string JSON → options UniverSheetsCorePreset
    onModified?: () => void
    onMaterialize?: (csv: string, columnTypes: Record<string, string>) => Promise<void>
}

class UniverSheetElement extends LitElement {
    private _univer: any = null
    private _univerAPI: any = null

    /** Désactive le Shadow DOM : la CSS Univer (globale) s'applique directement. */
    override createRenderRoot() { return this }

    override render() {
        return html`<div id="uc" style="height:100%;width:100%;"></div>`
    }

    getAPI() { return this._univerAPI }

    /**
     * Initialise (ou réinitialise) l'instance Univer dans le container.
     * À appeler depuis React après que _univerReady devient true.
     */
    async initialize(params: UniverInitParams) {
        // Dispose de l'instance précédente en cas de re-run
        if (this._univer) {
            try { this._univer.dispose?.() } catch (_) {}
            this._univer = null
            this._univerAPI = null
            const prev = this.renderRoot.querySelector('#uc') as HTMLDivElement | null
            if (prev) prev.innerHTML = ''
        }

        // Attendre que Lit ait rendu le container
        await this.updateComplete

        const container = this.renderRoot.querySelector('#uc') as HTMLDivElement
        if (!container) throw new Error('[UniverSheet] Container #uc introuvable')

        // ── Parser la config utilisateur ─────────────────────────────────────────
        // Accepte un objet natif (depuis l'UI), JSON strict, littéral JS,
        // ou la syntaxe copier-collée des docs Univer (LocaleType.XX_XX, etc.).
        let userConfig: any = {}
        const rawConfig = params.config
        if (rawConfig) {
            if (typeof rawConfig === 'object') {
                // Vient de l'UI structurée — objet natif directement
                userConfig = rawConfig
            } else if (typeof rawConfig === 'string' && rawConfig.trim()) {
                const raw = rawConfig.trim()

                // 1. JSON strict
                try { userConfig = JSON.parse(raw) } catch (_) {}

                // 2. Littéral JS pur (clés sans guillemets, virgules finales…)
                if (!userConfig || Object.keys(userConfig).length === 0) {
                    try { userConfig = (new Function(`return (${raw})`))() } catch (_) {} // eslint-disable-line no-new-func
                }

                // 3. Extraction tolérante pour la syntaxe docs Univer
                //    (LocaleType.XX_XX, [LocaleType.XX]: mergeLocales(...), etc.)
                if (!userConfig || Object.keys(userConfig).length === 0) {
                    userConfig = _parseUniverDocsSyntax(raw)
                }
            }
        }

        // Clé spéciale "locale" → détermine la langue de l'interface (ex. "fr-FR")
        // showGridlines / showRowHeader / showColumnHeader → appliqués au workbookData
        // editableRanges → zones éditables en mode client
        // protectedRangeShadow → option preset sheets
        // Le reste → options de UniverSheetsCorePreset.
        const localeStr: string = userConfig.locale || 'fr-FR'
        const {
            locale: _localeKey,
            showGridlines,
            showRowHeader,
            showColumnHeader,
            useSheetProtection: _useSheetProtection,
            protectedRangeShadow,
            enableTable,
            evalFormulas,
            fitDimensions,
            rawWorkbookJson,
            maxRows,
            maxCols,
            materializeAsDuckDB,
            ...presetConfig
        } = userConfig

        // Table des locales supportées (format "xx-XX" → {type, loader, tableLoader, sortLoader})
        type LocaleEntry = {
            type: string
            loader: () => Promise<{ default: any }>
            tableLoader: () => Promise<{ default: any }>
            sortLoader: () => Promise<{ default: any }>
        }
        const LOCALE_MAP: Record<string, LocaleEntry> = {
            'en-US': { type: 'enUS', loader: () => import('@univerjs/preset-sheets-core/locales/en-US'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/en-US'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/en-US') },
            'fr-FR': { type: 'frFR', loader: () => import('@univerjs/preset-sheets-core/locales/fr-FR'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/fr-FR'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/fr-FR') },
            'zh-CN': { type: 'zhCN', loader: () => import('@univerjs/preset-sheets-core/locales/zh-CN'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/zh-CN'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/zh-CN') },
            'zh-TW': { type: 'zhTW', loader: () => import('@univerjs/preset-sheets-core/locales/zh-TW'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/zh-TW'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/zh-TW') },
            'ru-RU': { type: 'ruRU', loader: () => import('@univerjs/preset-sheets-core/locales/ru-RU'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/ru-RU'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/ru-RU') },
            'ja-JP': { type: 'jaJP', loader: () => import('@univerjs/preset-sheets-core/locales/ja-JP'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/ja-JP'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/ja-JP') },
            'es-ES': { type: 'esES', loader: () => import('@univerjs/preset-sheets-core/locales/es-ES'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/es-ES'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/es-ES') },
            'ca-ES': { type: 'caES', loader: () => import('@univerjs/preset-sheets-core/locales/ca-ES'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/ca-ES'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/ca-ES') },
            'sk-SK': { type: 'skSK', loader: () => import('@univerjs/preset-sheets-core/locales/sk-SK'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/sk-SK'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/sk-SK') },
            'fa-IR': { type: 'faIR', loader: () => import('@univerjs/preset-sheets-core/locales/fa-IR'), tableLoader: () => import('@univerjs/preset-sheets-table/lib/locales/fa-IR'), sortLoader: () => import('@univerjs/sheets-sort-ui/locale/fa-IR') },
        }
        const localeEntry = LOCALE_MAP[localeStr] ?? LOCALE_MAP['en-US']

        // Import dynamique → Vite génère des chunks séparés (chargement à la demande)
        const [coreResults, tableResults] = await Promise.all([
            Promise.all([
                import('@univerjs/presets'),
                import('@univerjs/preset-sheets-core'),
                localeEntry.loader(),
                import('@univerjs/sheets-numfmt/facade'),
            ]),
            enableTable
                ? Promise.all([
                    import('@univerjs/preset-sheets-table'),
                    import('@univerjs/preset-sheets-sort'),
                    localeEntry.tableLoader(),
                    localeEntry.sortLoader(),
                  ])
                : Promise.resolve([null, null, null, null]),
        ])
        const [{ createUniver, mergeLocales }, { UniverSheetsCorePreset }, { default: localeData }] = coreResults
        const UniverSheetsTablePreset = tableResults[0]?.UniverSheetsTablePreset ?? null
        const UniverSheetsSortPreset  = tableResults[1]?.UniverSheetsSortPreset  ?? null
        const tableLocaleData         = tableResults[2]?.default ?? null
        const sortLocaleData          = tableResults[3]?.default ?? null

        // ── Options du preset ────────────────────────────────────────────────────
        const presetOptions: any = { container, ...presetConfig }

        // protectedRangeShadow → sous-clé sheets du preset
        if (protectedRangeShadow !== undefined) {
            presetOptions.sheets = { ...(presetOptions.sheets || {}), protectedRangeShadow }
        }

        // Le mode readonly force certaines options (priorité sur la config utilisateur)
        if (params.readonly) {
            presetOptions.toolbar = false
            presetOptions.contextMenu = false
            presetOptions.formulaBar = false
            presetOptions.footer = false
        }

        const presets: any[] = [UniverSheetsCorePreset(presetOptions)]
        if (enableTable && UniverSheetsTablePreset) {
            presets.push(UniverSheetsTablePreset())
        }
        if (enableTable && UniverSheetsSortPreset) {
            presets.push(UniverSheetsSortPreset())
        }

        const { univer, univerAPI } = createUniver({
            locale: localeEntry.type as any,
            locales: {
                [localeEntry.type]: mergeLocales(
                    localeData,
                    ...(tableLocaleData ? [tableLocaleData] : []),
                    ...(sortLocaleData  ? [sortLocaleData]  : []),
                ),
            },
            presets,
        })
        this._univer = univer
        this._univerAPI = univerAPI

        // ── Construire le workbook data ───────────────────────────────────────────
        let workbookData: any
        if (params.snapshot) {
            try {
                const json = await ConfigManager.decompressFromGzipBase64(params.snapshot)
                workbookData = JSON.parse(json)
            } catch (e: any) {
                throw new Error('Snapshot Univer invalide : ' + e.message)
            }
        } else if (rawWorkbookJson && params.rows?.length) {
            // La première cellule du résultat SQL contient un objet { cellData, styles? }
            // styles est une table de styles IWorkbookData.styles (clé → IStyleData)
            const firstRow = params.rows[0]
            const raw = firstRow[Object.keys(firstRow)[0]]
            let parsed: any
            try {
                parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
                if (!parsed || typeof parsed !== 'object') throw new Error('valeur non-objet')
            } catch (e: any) {
                throw new Error('rawWorkbookJson: JSON invalide — ' + e.message)
            }
            const cellData = parsed.cellData ?? parsed
            const styles = parsed.styles ?? {}
            const sheetId = 'sheet-' + params.cellId
            workbookData = {
                id: 'wb-' + params.cellId,
                name: 'Sheet',
                sheetOrder: [sheetId],
                styles,
                sheets: {
                    [sheetId]: { id: sheetId, name: 'Feuille1', cellData },
                },
            }
        } else if (params.rows?.length) {
            workbookData = _buildWorkbookFromRows(params.rows, params.cellId, !!evalFormulas, params.rowCellTypes ?? undefined)
        } else {
            workbookData = { id: 'wb-' + params.cellId, name: 'Sheet', sheets: {} }
        }

        // Appliquer les paramètres d'affichage (quadrillage, en-têtes de lignes/colonnes)
        if (showGridlines === false || showRowHeader === false || showColumnHeader === false) {
            const sheets = workbookData.sheets || {}
            for (const sheetId of Object.keys(sheets)) {
                const sheet = sheets[sheetId]
                if (showGridlines === false) sheet.showGridlines = 0
                if (showRowHeader === false) sheet.rowHeader = { ...(sheet.rowHeader || {}), hidden: 1 }
                if (showColumnHeader === false) sheet.columnHeader = { ...(sheet.columnHeader || {}), hidden: 1 }
            }
        }

        univerAPI.createWorkbook(workbookData)

        // Locale pour le formatage des nombres (séparateurs décimaux, format des dates…)
        univerAPI.getActiveWorkbook()?.setNumfmtLocal?.(localeStr.replace('-', '_') as any)

        // Format des colonnes date/timestamp via setNumberFormat — formats localisés
        if (params.rowColumnFormats?.length && params.rows?.length) {
            const LOCALE_DATE_FMTS: Record<string, { date: string; datetime: string; time: string }> = {
                'fr-FR': { date: 'dd/MM/yyyy',   datetime: 'dd/MM/yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'en-US': { date: 'MM/dd/yyyy',   datetime: 'MM/dd/yyyy HH:mm:ss', time: 'hh:mm:ss' },
                'de-DE': { date: 'dd.MM.yyyy',   datetime: 'dd.MM.yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'zh-CN': { date: 'yyyy/MM/dd',   datetime: 'yyyy/MM/dd HH:mm:ss', time: 'HH:mm:ss' },
                'zh-TW': { date: 'yyyy/MM/dd',   datetime: 'yyyy/MM/dd HH:mm:ss', time: 'HH:mm:ss' },
                'ru-RU': { date: 'dd.MM.yyyy',   datetime: 'dd.MM.yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'ja-JP': { date: 'yyyy/MM/dd',   datetime: 'yyyy/MM/dd HH:mm:ss', time: 'HH:mm:ss' },
                'es-ES': { date: 'dd/MM/yyyy',   datetime: 'dd/MM/yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'ca-ES': { date: 'dd/MM/yyyy',   datetime: 'dd/MM/yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'sk-SK': { date: 'dd.MM.yyyy',   datetime: 'dd.MM.yyyy HH:mm:ss', time: 'HH:mm:ss' },
                'fa-IR': { date: 'yyyy/MM/dd',   datetime: 'yyyy/MM/dd HH:mm:ss', time: 'HH:mm:ss' },
            }
            const localeFmts = LOCALE_DATE_FMTS[localeStr] ?? { date: 'yyyy-MM-dd', datetime: 'yyyy-MM-dd HH:mm:ss', time: 'HH:mm:ss' }
            const resolveFormat = (canonical: string): string => {
                if (canonical === 'yyyy-MM-dd')         return localeFmts.date
                if (canonical === 'yyyy-MM-dd HH:mm:ss') return localeFmts.datetime
                if (canonical === 'HH:mm:ss')           return localeFmts.time
                return canonical
            }
            try {
                const fws = univerAPI.getActiveWorkbook()?.getActiveSheet()
                if (fws) {
                    params.rowColumnFormats.forEach((fmt: string | null, ci: number) => {
                        if (fmt) {
                            fws.getRange(1, ci, params.rows!.length, 1).setNumberFormat(resolveFormat(fmt))
                        }
                    })
                }
            } catch (e) { console.warn('[UniverSheet] setNumberFormat failed:', e) }
        }

        // Appliquer les dimensions via l'API facade
        {
            let targetRows: number | undefined = maxRows
            let targetCols: number | undefined = maxCols
            if (fitDimensions && params.rows?.length) {
                targetRows = params.rows.length + 1  // données + ligne d'en-tête
                targetCols = Object.keys(params.rows[0] || {}).length || undefined
            }
            if (targetRows !== undefined || targetCols !== undefined) {
                const fWorksheet = univerAPI.getActiveWorkbook()?.getActiveSheet()
                if (fWorksheet) {
                    if (targetCols !== undefined) fWorksheet.setColumnCount(targetCols)
                    if (targetRows !== undefined) fWorksheet.setRowCount(targetRows)
                }
            }
        }

        // Créer automatiquement un tableau Univer sur la plage de données
        // Seulement pour les données issues de params.rows (pas les snapshots qui ont déjà leurs tables)
        if (enableTable && params.rows?.length) {
            try {
                const columns = Object.keys(params.rows[0] || {})
                if (columns.length > 0) {
                    const fWorksheet = univerAPI.getActiveWorkbook()?.getActiveSheet()
                    if (fWorksheet) {
                        const tableName = params.name || ('table-' + params.cellId)
                        await fWorksheet.addTable(
                            tableName,
                            {
                                startRow: 0,
                                startColumn: 0,
                                endRow: params.rows.length,
                                endColumn: columns.length - 1,
                            },
                            'table-' + params.cellId,
                        )
                    }
                }
            } catch (_) {}
        }

        // ── Gestion du mode readonly / protection ─────────────────────────────────
        if (params.readonly) {
            // Readonly total : désactiver sélection + droits d'édition
            univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, async ({ stage }: any) => {
                if (stage !== univerAPI.Enum.LifecycleStages.Rendered) return
                try {
                    const fWorkbook = univerAPI.getActiveWorkbook()
                    if (!fWorkbook) return
                    const unitId = fWorkbook.getId?.()
                    fWorkbook.disableSelection?.()
                    const permission = fWorkbook.getPermission?.()
                    if (permission) {
                        permission.setWorkbookEditPermission?.(unitId, false)
                        permission.setPermissionDialogVisible?.(false)
                    }
                } catch (e) { console.error('[UniverSheet] readonly setup error:', e) }
                if (materializeAsDuckDB && params.onMaterialize) {
                    const result = _extractSheetData(univerAPI)
                    if (result !== null) {
                        try { await params.onMaterialize(result.csv, result.columnTypes) } catch (_) {}
                    }
                }
            })
        } else {
            // _materializeTimer déclaré ici pour être partagé entre les closures
            let _materializeTimer: any = null

            // Protection des plages toujours active en mode édition.
            // On interroge RangeProtectionRuleModel pour la géométrie et on bloque
            // les mutations sur les cellules appartenant à une plage protégée.
            univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, async ({ stage }: any) => {
                if (stage !== univerAPI.Enum.LifecycleStages.Rendered) return

                univerAPI.setPermissionDialogVisible?.(false)

                const fWorkbook = univerAPI.getActiveWorkbook()
                const fWorksheet = fWorkbook?.getActiveSheet()
                const unitId = fWorkbook?.getId?.()
                const subUnitId = fWorksheet?.getSheetId?.()
                if (!unitId || !subUnitId) return

                const { RangeProtectionRuleModel } = await import('@univerjs/sheets')
                const injector = (univer as any).__getInjector?.() ?? (univer as any)._injector
                const ruleModel = injector?.get?.(RangeProtectionRuleModel)
                if (!ruleModel) return

                univerAPI.addEvent(univerAPI.Event.BeforeCommandExecute, (event: any) => {
                    const id: string = event.id ?? ''

                    // ── Protection ─────────────────────────────────────────────────────
                    if (id === 'sheet.mutation.set-range-values') {
                        const cellValue = event.params?.cellValue
                        if (cellValue && typeof cellValue === 'object') {
                            const rules: any[] = ruleModel.getSubunitRuleList(unitId, subUnitId) ?? []
                            if (rules.length > 0) {
                                for (const rowStr of Object.keys(cellValue)) {
                                    const row = Number(rowStr)
                                    const cols = (cellValue as any)[rowStr]
                                    if (!cols || typeof cols !== 'object') continue
                                    for (const colStr of Object.keys(cols)) {
                                        const col = Number(colStr)
                                        for (const rule of rules) {
                                            for (const range of (rule.ranges ?? [])) {
                                                if (row >= range.startRow && row <= range.endRow &&
                                                    col >= range.startColumn && col <= range.endColumn) {
                                                    event.cancel = true
                                                    return
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // ── onModified ─────────────────────────────────────────────────────
                    // univer.onCommandExecuted ne fonctionne pas dans cette version ;
                    // BeforeCommandExecute est utilisé à la place.
                    if (params.onModified) params.onModified()

                    // ── Matérialisation DuckDB ─────────────────────────────────────────
                    // BeforeCommandExecute est utilisé car onCommandExecuted ne se
                    // déclenche jamais lors des éditions UI. Le délai de 1 500 ms laisse
                    // le temps à la commande de s'appliquer et au moteur de formules de
                    // recalculer les valeurs avant la lecture via save().
                    if (materializeAsDuckDB && params.onMaterialize) {
                        const isDataMutation = (
                            id === 'sheet.mutation.set-range-values' ||
                            id.includes('insert-row') || id.includes('remove-row') ||
                            id.includes('insert-col') || id.includes('remove-col') ||
                            id.includes('sort-range') || id.includes('move-rows') || id.includes('move-cols')
                        )
                        if (isDataMutation) {
                            clearTimeout(_materializeTimer)
                            _materializeTimer = setTimeout(async () => {
                                const result = _extractSheetData(univerAPI)
                                if (result !== null) {
                                    try { await params.onMaterialize!(result.csv, result.columnTypes) } catch (_) {}
                                }
                            }, 1500)
                        }
                    }
                })

                if (materializeAsDuckDB && params.onMaterialize) {
                    const result = _extractSheetData(univerAPI)
                    if (result !== null) {
                        try { await params.onMaterialize(result.csv, result.columnTypes) } catch (_) {}
                    }
                }
            })
        }
    }

    override disconnectedCallback() {
        super.disconnectedCallback()
        try { this._univer?.dispose?.() } catch (_) {}
        this._univer = null
        this._univerAPI = null
    }
}

customElements.define('univer-sheet', UniverSheetElement)
