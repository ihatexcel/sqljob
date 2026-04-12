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
import { ConfigManager } from '../../lib/ConfigManager'

// ─── Helper ────────────────────────────────────────────────────────────────────

function _buildWorkbookFromRows(rows: any[], cellId: string): any {
    const sheetId = 'sheet-' + cellId
    const cellData: Record<number, Record<number, { v: any }>> = {}
    if (!rows || rows.length === 0) {
        return { id: 'wb-' + cellId, name: 'Sheet', sheets: { [sheetId]: { id: sheetId, name: 'Sheet1', cellData } } }
    }
    const columns = Object.keys(rows[0])
    cellData[0] = {}
    columns.forEach((col, ci) => { cellData[0][ci] = { v: col } })
    rows.forEach((row, ri) => {
        cellData[ri + 1] = {}
        columns.forEach((col, ci) => {
            const val = row[col]
            cellData[ri + 1][ci] = { v: val === null || val === undefined ? '' : val }
        })
    })
    return {
        id: 'wb-' + cellId,
        name: 'Sheet',
        sheets: {
            [sheetId]: { id: sheetId, name: 'Sheet1', cellData },
        },
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

// ─── Web Component ─────────────────────────────────────────────────────────────

export interface UniverInitParams {
    rows: any[] | null
    snapshot: string | null
    cellId: string
    readonly: boolean
    config?: any   // Objet ou string JSON → options UniverSheetsCorePreset
    onModified?: () => void
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
        const localeStr: string = userConfig.locale || 'en-US'
        const {
            locale: _localeKey,
            showGridlines,
            showRowHeader,
            showColumnHeader,
            useSheetProtection,
            protectedRangeShadow,
            ...presetConfig
        } = userConfig

        // Table des locales supportées (format "xx-XX" → {type, loader})
        type LocaleEntry = { type: string; loader: () => Promise<{ default: any }> }
        const LOCALE_MAP: Record<string, LocaleEntry> = {
            'en-US': { type: 'enUS', loader: () => import('@univerjs/preset-sheets-core/locales/en-US') },
            'fr-FR': { type: 'frFR', loader: () => import('@univerjs/preset-sheets-core/locales/fr-FR') },
            'zh-CN': { type: 'zhCN', loader: () => import('@univerjs/preset-sheets-core/locales/zh-CN') },
            'zh-TW': { type: 'zhTW', loader: () => import('@univerjs/preset-sheets-core/locales/zh-TW') },
            'ru-RU': { type: 'ruRU', loader: () => import('@univerjs/preset-sheets-core/locales/ru-RU') },
            'ja-JP': { type: 'jaJP', loader: () => import('@univerjs/preset-sheets-core/locales/ja-JP') },
            'es-ES': { type: 'esES', loader: () => import('@univerjs/preset-sheets-core/locales/es-ES') },
            'ca-ES': { type: 'caES', loader: () => import('@univerjs/preset-sheets-core/locales/ca-ES') },
            'sk-SK': { type: 'skSK', loader: () => import('@univerjs/preset-sheets-core/locales/sk-SK') },
            'fa-IR': { type: 'faIR', loader: () => import('@univerjs/preset-sheets-core/locales/fa-IR') },
        }
        const localeEntry = LOCALE_MAP[localeStr] ?? LOCALE_MAP['en-US']

        // Import dynamique → Vite génère des chunks séparés (chargement à la demande)
        const [
            { createUniver, mergeLocales },
            { UniverSheetsCorePreset },
            { default: localeData },
        ] = await Promise.all([
            import('@univerjs/presets'),
            import('@univerjs/preset-sheets-core'),
            localeEntry.loader(),
        ])

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

        const { univer, univerAPI } = createUniver({
            locale: localeEntry.type,
            locales: { [localeEntry.type]: mergeLocales(localeData) },
            presets: [UniverSheetsCorePreset(presetOptions)],
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
        } else if (params.rows?.length) {
            workbookData = _buildWorkbookFromRows(params.rows, params.cellId)
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

        // ── Gestion du mode readonly ──────────────────────────────────────────────
        if (params.readonly) {
            if (useSheetProtection) {
                // Protection native Univer : les règles de plages sont dans le snapshot
                // mais leurs points de permission (IPermissionService) ne sont pas
                // restaurés automatiquement → canEditCell() retourne true partout.
                // On itère sur les règles et on force Edit=false sur chaque plage.
                univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, async ({ stage }: any) => {
                    if (stage !== univerAPI.Enum.LifecycleStages.Rendered) return
                    try {
                        const fWorkbook = univerAPI.getActiveWorkbook()
                        const fWorksheet = fWorkbook?.getActiveSheet()
                        if (!fWorkbook || !fWorksheet) return

                        const wp = fWorksheet.getWorksheetPermission?.()
                        const rules: any[] = (await wp?.listRangeProtectionRules?.()) ?? []
                        console.log('[UniverSheet] useSheetProtection: found', rules.length, 'rules')

                        let enforced = 0
                        for (const rule of rules) {
                            const ranges: any[] = Array.isArray(rule.ranges) ? rule.ranges : []
                            console.log('[UniverSheet] rule', rule.id, '— ranges:', ranges.length)
                            for (const range of ranges) {
                                try {
                                    const fRange = fWorksheet.getRange?.(
                                        range.startRow, range.startColumn,
                                        range.endRow - range.startRow + 1,
                                        range.endColumn - range.startColumn + 1
                                    )
                                    const rp = fRange?.getRangePermission?.()
                                    if (!rp) {
                                        console.warn('[UniverSheet] getRangePermission() returned null')
                                        continue
                                    }
                                    // canEdit avant
                                    console.log('[UniverSheet] canEdit before setPoint:', rp.canEdit?.())
                                    await rp.setPoint?.(univerAPI.Enum.RangePermissionPoint.Edit, false)
                                    console.log('[UniverSheet] canEdit after  setPoint:', rp.canEdit?.())
                                    enforced++
                                } catch (e2: any) {
                                    console.warn('[UniverSheet] setPoint failed:', e2?.message ?? e2)
                                }
                            }
                        }
                        console.log('[UniverSheet] enforced', enforced, 'permission point(s)')
                    } catch (e) {
                        console.error('[UniverSheet] useSheetProtection setup error:', e)
                    }
                    univerAPI.setPermissionDialogVisible?.(false)
                })
                // Suivre les modifications dans les zones non protégées
                if (params.onModified && univer?.onCommandExecuted) {
                    univer.onCommandExecuted(params.onModified)
                }
            } else {
                // Readonly total : désactiver sélection + droits d'édition
                univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, ({ stage }: any) => {
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
                })
            }
        } else if (params.onModified && univer?.onCommandExecuted) {
            univer.onCommandExecuted(params.onModified)
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
