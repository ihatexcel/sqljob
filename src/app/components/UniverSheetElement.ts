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

// ─── Web Component ─────────────────────────────────────────────────────────────

export interface UniverInitParams {
    rows: any[] | null
    snapshot: string | null
    cellId: string
    readonly: boolean
    config?: string | null   // JSON string → options UniverSheetsCorePreset
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

        // ── Parser la config JSON utilisateur ────────────────────────────────────
        let userConfig: any = {}
        if (params.config?.trim()) {
            try {
                userConfig = JSON.parse(params.config.trim())
            } catch (e) {
                console.warn('[UniverSheet] Configuration JSON invalide, ignorée :', e)
            }
        }

        // Clé spéciale "locale" → détermine la langue de l'interface (ex. "fr-FR")
        // Les autres clés vont dans les options de UniverSheetsCorePreset.
        const localeStr: string = userConfig.locale || 'en-US'
        const { locale: _localeKey, ...presetConfig } = userConfig

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

        // Le mode readonly force certaines options (priorité sur la config utilisateur)
        if (params.readonly) {
            presetOptions.toolbar = false
            presetOptions.contextMenu = false
            presetOptions.formulaBar = false
            presetOptions.footer = false
        }
        console.log('[UniverSheet] readonly:', params.readonly, '| locale:', localeStr, '| presetOptions:', JSON.stringify(presetOptions))

        const { univer, univerAPI } = createUniver({
            locale: localeEntry.type,
            locales: { [localeEntry.type]: mergeLocales(localeData) },
            presets: [UniverSheetsCorePreset(presetOptions)],
        })
        this._univer = univer
        this._univerAPI = univerAPI

        // Charger les données
        if (params.snapshot) {
            try {
                const json = await ConfigManager.decompressFromGzipBase64(params.snapshot)
                univerAPI.createWorkbook(JSON.parse(json))
            } catch (e: any) {
                throw new Error('Snapshot Univer invalide : ' + e.message)
            }
        } else if (params.rows?.length) {
            univerAPI.createWorkbook(_buildWorkbookFromRows(params.rows, params.cellId))
        } else {
            univerAPI.createWorkbook({ id: 'wb-' + params.cellId, name: 'Sheet', sheets: {} })
        }

        if (params.readonly) {
            console.log('[UniverSheet] Registering LifeCycleChanged event for readonly setup')
            console.log('[UniverSheet] univerAPI.Event keys:', Object.keys(univerAPI.Event || {}))
            console.log('[UniverSheet] univerAPI.Enum.LifecycleStages:', univerAPI.Enum?.LifecycleStages)
            // Désactiver sélection + édition une fois le rendu terminé
            univerAPI.addEvent(univerAPI.Event.LifeCycleChanged, ({ stage }: any) => {
                console.log('[UniverSheet] LifeCycleChanged stage:', stage, '| Rendered:', univerAPI.Enum?.LifecycleStages?.Rendered)
                if (stage === univerAPI.Enum.LifecycleStages.Rendered) {
                    try {
                        const fWorkbook = univerAPI.getActiveWorkbook()
                        console.log('[UniverSheet] fWorkbook:', fWorkbook, '| disableSelection:', typeof fWorkbook?.disableSelection)
                        if (!fWorkbook) return
                        const unitId = fWorkbook.getId()
                        fWorkbook.disableSelection?.()
                        const permission = fWorkbook.getPermission?.()
                        console.log('[UniverSheet] permission:', permission, '| unitId:', unitId)
                        if (permission) {
                            permission.setWorkbookEditPermission?.(unitId, false)
                            permission.setPermissionDialogVisible?.(false)
                        }
                    } catch (e) { console.error('[UniverSheet] readonly setup error:', e) }
                }
            })
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
