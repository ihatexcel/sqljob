/**
 * exportSlice — gestion des exports/imports de configuration + buildExportConfig().
 * Converti de exportImportMixin.ts (Alpine this-proxy) vers un slice Zustand pur.
 *
 * Changement clé : buildExportConfig() utilise get() directement → "config dans le store".
 */
import { ConfigManager, exportConfigToJson } from '../../../lib/ConfigManager'
import { GistEncrypt } from '../../../lib/GistEncrypt'
import { GitHubGistManager } from '../../../lib/GitHubGistManager'
import { FileHandler } from '../../../lib/FileHandler'
import { initializeCell } from '../../../lib/CellConfigService'
import { applyThemeFromConfig, STORAGE_LIGHT, STORAGE_DARK, STORAGE_PRESET } from '../../components/modals/ThemeCustomModal'

export const createExportSlice = (set: any, get: any) => ({

    setTheme(themeName: string) {
        const theme = themeName === 'dark' ? 'dark' : 'light'
        set({ currentTheme: theme })
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(theme)
        localStorage.setItem('sqljob-theme', theme)
    },

    // ─── Config dans le store — remplace ConfigManager.buildConfigFromState(this.pages, ...) ───
    async buildExportConfig(options: {
        devMode?: boolean
        showLayout?: boolean
        includeFileData?: boolean
    } = {}) {
        const s = get()
        const devMode = options.devMode ?? s.devMode
        const showLayout = options.showLayout ?? s.showLayout
        const includeFileData = options.includeFileData ?? false
        const presetName   = localStorage.getItem(STORAGE_PRESET) || 'default'
        const customLight  = presetName === 'custom' ? (localStorage.getItem(STORAGE_LIGHT) || '') : ''
        const customDark   = presetName === 'custom' ? (localStorage.getItem(STORAGE_DARK)  || '') : ''

        // Capturer les snapshots des cellules univerSheet modifiées avant l'export
        try {
            const allCells: any[] = []
            function collectCells(groups: any[]) {
                for (const g of (groups || [])) {
                    for (const c of (g.cells || [])) allCells.push(c)
                    collectCells(g.children || [])
                }
            }
            for (const page of (s.pages || [])) {
                collectCells(page.groups || [])
                collectCells(page.linkGroups || [])
            }
            for (const cell of allCells) {
                if (cell.type === 'univerSheet' && cell._univerModified && cell._univerAPI) {
                    await (get() as any).captureUniverSnapshot(cell)
                }
            }
        } catch (e) {
            console.warn('[exportSlice] Erreur capture snapshots Univer:', e)
        }

        return ConfigManager.buildConfigFromState(
            s.pages,
            devMode,
            showLayout,
            includeFileData,
            presetName,
            s.dbEngine,
            s.directedAcyclicGraph,
            customLight,
            customDark
        )
    },

    openExportModal(type: string) {
        const s = get()
        if (type === 'gist' && !GitHubGistManager.hasAccessToken()) {
            set({ showGistTokenModal: true })
            return
        }
        const now = new Date()
        const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '')
        const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, '')
        const defaultFileName = `sqljob_${yyyymmdd}_${hhmmss}`
        set({
            exportModal: {
                show: true,
                type,
                fileName: defaultFileName,
                description: 'sqljob Notebook Configuration',
                devMode: false,
                showLayout: false,
                includeFiles: false,
                encryptGist: false,
                gistPassphrase: ''
            }
        })
    },

    async executeExport() {
        const s = get()
        const { exportModal } = s
        const type = exportModal.type
        const fileName = exportModal.fileName || 'notebook-config.json'
        const description = exportModal.description || 'sqljob Notebook Configuration'
        const devMode = exportModal.devMode
        const showLayout = exportModal.showLayout
        const includeFiles = !!exportModal.includeFiles

        set((st: any) => ({ exportModal: { ...st.exportModal, show: false } }))

        try {
            set({ isLoading: true })

            // Utilise buildExportConfig() — config depuis le store
            const config = await get().buildExportConfig({
                devMode,
                showLayout,
                includeFileData: includeFiles,
            })

            switch (type) {
                case 'gist': {
                    get().setStatus('Création du gist GitHub...', 'loading')
                    let passphrase = null
                    if (exportModal.encryptGist) {
                        passphrase = (exportModal.gistPassphrase || '').trim()
                        if (!passphrase) passphrase = GistEncrypt.generatePassphrase()
                    }
                    const gistUrl = await GitHubGistManager.createGist(config, description, fileName, passphrase)
                    set({
                        gistShareUrl: GitHubGistManager.generateSqljobUrl(gistUrl),
                        gistWasEncrypted: !!passphrase,
                        gistPassphraseToShare: passphrase || '',
                        showGistModal: true
                    })
                    get().setStatus('Gist créé avec succès', 'success')
                    break
                }
                case 'json': {
                    get().setStatus('Export JSON...', 'loading')
                    const jsonPassphrase = exportModal.encryptGist
                        ? ((exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase())
                        : null
                    let jsonContent: string
                    if (jsonPassphrase) {
                        const jsonString = JSON.stringify(config)
                        const encrypted = await GistEncrypt.encrypt(jsonString, jsonPassphrase)
                        jsonContent = JSON.stringify(encrypted, null, 2)
                    } else {
                        jsonContent = exportConfigToJson(config)
                    }
                    const jsonBlob = new Blob([jsonContent], { type: 'application/json' })
                    const jsonFileName = fileName.endsWith('.json') ? fileName : fileName + '.json'
                    FileHandler.downloadFile(jsonBlob, jsonFileName)
                    get().setStatus('Configuration exportée', 'success')
                    break
                }
                case 'base64': {
                    get().setStatus('Export Base64...', 'loading')
                    const jsonStr = JSON.stringify(config)
                    const base64String = ConfigManager.encodeUTF8ToBase64(jsonStr)
                    const base64Blob = new Blob([base64String], { type: 'text/plain' })
                    const base64FileName = fileName.endsWith('.txt') ? fileName : fileName + '.txt'
                    FileHandler.downloadFile(base64Blob, base64FileName)
                    get().setStatus('Configuration exportée en Base64', 'success')
                    break
                }
                case 'html': {
                    get().setStatus('Génération HTML...', 'loading')
                    const htmlFileName = fileName.endsWith('.html') ? fileName : fileName + '.html'
                    const htmlPassphrase = exportModal.encryptGist
                        ? ((exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase())
                        : null
                    await get().exportHTMLWithConfig(config, htmlFileName, htmlPassphrase, includeFiles)
                    get().setStatus('HTML exporté', 'success')
                    break
                }
            }
        } catch (error: any) {
            console.error('Erreur export:', error)
            get().setStatus('Erreur: ' + error.message, 'error')
            if (type === 'gist' && (error.message.includes('authentifié') || error.message.includes('Unauthorized'))) {
                GitHubGistManager.clearAccessToken()
                set({ showGistTokenModal: true })
            }
        } finally {
            set({ isLoading: false })
        }
    },

    async exportHTMLWithConfig(config: any, fileName = 'index.sqljob.html', passphrase: string | null = null, includeFiles = false) {
        const { pages } = get()
        const sourceFilesPayload: any[] = []
        const docxTemplatesPayload: any[] = []
        let embeddedScripts = ''

        const collectFilesForTemplate = async (group: any, groupPath: number[] = []) => {
            for (let ci = 0; ci < (group.cells || []).length; ci++) {
                const cell = group.cells[ci]
                if (cell.type === 'source' && cell._currentFile && cell._fileName) {
                    const safeName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_')
                    const ab = await cell._currentFile.arrayBuffer()
                    const compressed = await FileHandler.compressGzip(ab)
                    const b64 = FileHandler.arrayBufferToBase64(compressed)
                    if (passphrase) {
                        sourceFilesPayload.push({ id: `sourceFile_${safeName}`, sourceName: cell.name, fileName: cell._fileName, base64: b64 })
                    } else {
                        embeddedScripts += `    <script type="application/octet-stream" id="sourceFile_${safeName}" data-source-name="${cell.name}" data-file-name="${cell._fileName}">${b64}</script>\n`
                    }
                }
                if (cell.type === 'publipostageWord' && cell.docxTemplateBase64 && cell.docxTemplateFileName) {
                    const cellPath = [...groupPath, ci].join('_')
                    const stableId = `docxTemplate_${cellPath}`
                    const docxBytes = FileHandler.base64ToUint8Array(cell.docxTemplateBase64)
                    const docxCompressed = await FileHandler.compressGzip(docxBytes.buffer || docxBytes)
                    const docxB64 = FileHandler.arrayBufferToBase64(docxCompressed)
                    if (passphrase) {
                        docxTemplatesPayload.push({ id: stableId, cellPath, fileName: cell.docxTemplateFileName, base64: docxB64, compressed: true })
                    } else {
                        embeddedScripts += `    <script type="application/octet-stream" id="${stableId}" data-cell-path="${cellPath}" data-file-name="${cell.docxTemplateFileName}" data-compressed="true">${docxB64}</script>\n`
                    }
                }
            }
            for (let ci = 0; ci < (group.children || []).length; ci++) {
                await collectFilesForTemplate(group.children[ci], [...groupPath, ci])
            }
        }

        if (includeFiles) {
            for (let pi = 0; pi < pages.length; pi++) {
                for (let gi = 0; gi < pages[pi].groups.length; gi++) {
                    await collectFilesForTemplate(pages[pi].groups[gi], [gi])
                }
                for (let gi = 0; gi < (pages[pi].linkGroups || []).length; gi++) {
                    await collectFilesForTemplate(pages[pi].linkGroups[gi], [-1, gi])
                }
            }
        }

        let configScriptTag: string
        if (passphrase) {
            const payload = { config, sourceFiles: sourceFilesPayload, docxTemplates: docxTemplatesPayload }
            let payloadStr: string
            try { payloadStr = JSON.stringify(payload) } catch (e) { payloadStr = '[stringify error]' }
            const encrypted = await GistEncrypt.encrypt(payloadStr, passphrase)
            const configScriptContent = btoa(JSON.stringify(encrypted))
            configScriptTag = `    <script type="application/octet-stream" id="defaultConfigBase64" data-encrypted="true">${configScriptContent}</script>\n`
        } else {
            const configBase64 = ConfigManager.encodeUTF8ToBase64(exportConfigToJson(config))
            configScriptTag = `    <script type="application/octet-stream" id="defaultConfigBase64">${configBase64}</script>\n`
        }

        const sqljobSrc = 'https://ihatexcel.github.io/sqljob/dist-cdn/sqljob.js'
        const sqljobCss = 'https://ihatexcel.github.io/sqljob/dist-cdn/sqljob.css'

        const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>sqljob</title>
    <link rel="stylesheet" href="${sqljobCss}">
${configScriptTag}${embeddedScripts}</head>
<body>
    <script src="${sqljobSrc}" type="module"></script>
    <sqljob-app></sqljob-app>
</body>
</html>`

        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
        FileHandler.downloadFile(blob, fileName)
    },

    async copyExportJson() {
        const { exportModal, buildExportConfig } = get()
        try {
            const config = await buildExportConfig({
                devMode: exportModal.devMode,
                showLayout: exportModal.showLayout,
                includeFileData: !!exportModal.includeFiles,
            })
            const json = exportConfigToJson(config)
            await navigator.clipboard.writeText(json)
            return true
        } catch (error: any) {
            console.error('Erreur copie JSON:', error)
            get().setStatus('Erreur: ' + error.message, 'error')
            return false
        }
    },

    cancelExport() {
        set((s: any) => ({ exportModal: { ...s.exportModal, show: false } }))
    },

    saveGithubToken() {
        const { githubToken, setStatus } = get()
        if (!githubToken || githubToken.trim() === '') {
            setStatus('Veuillez saisir un token', 'error')
            return
        }
        try {
            GitHubGistManager.setAccessToken(githubToken.trim())
            set({ showGistTokenModal: false, githubToken: '' })
            setStatus('Token GitHub enregistré', 'success')
            setTimeout(() => get().openExportModal('gist'), 300)
        } catch (error: any) {
            setStatus('Erreur: ' + error.message, 'error')
        }
    },

    cancelGithubToken() {
        set({ showGistTokenModal: false, githubToken: '' })
    },

    copyGistUrl() {
        const { gistShareUrl, setStatus } = get()
        navigator.clipboard.writeText(gistShareUrl)
            .then(() => setStatus('URL copiée dans le presse-papiers', 'success'))
            .catch(() => setStatus('Erreur lors de la copie', 'error'))
    },

    copyGistPassphrase() {
        const { gistPassphraseToShare, setStatus } = get()
        navigator.clipboard.writeText(gistPassphraseToShare)
            .then(() => setStatus('Mot de passe copié dans le presse-papiers', 'success'))
            .catch(() => setStatus('Erreur lors de la copie', 'error'))
    },

    closeGistModal() {
        set({ showGistModal: false, gistShareUrl: '', gistWasEncrypted: false, gistPassphraseToShare: '' })
    },

    openGistUrl() {
        const { gistShareUrl } = get()
        if (gistShareUrl) window.open(gistShareUrl, '_blank')
    },

    async loadConfig(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) return
        try {
            const text = await file.text()
            const parsed = JSON.parse(text)
            ;(event.target as HTMLInputElement).value = ''
            if (GistEncrypt.isEncrypted(parsed)) {
                set({ _pendingEncryptedJson: parsed, showJsonPassphraseModal: true, jsonPassphrase: '', jsonPassphraseError: '' })
                return
            }
            await get().applyImportedConfig(parsed)
        } catch (error: any) {
            get().setStatus('Erreur import: ' + error.message, 'error')
        }
    },

    cancelJsonPassphraseModal() {
        set({ showJsonPassphraseModal: false, _pendingEncryptedJson: null, jsonPassphrase: '', jsonPassphraseError: '' })
    },

    async unlockJsonConfig() {
        const { jsonPassphrase, _pendingEncryptedJson } = get()
        const pass = (jsonPassphrase || '').trim()
        if (!pass) { set({ jsonPassphraseError: 'Veuillez entrer la mot de passe' }); return }
        set({ jsonPassphraseError: '', jsonPassphraseLoading: true })
        try {
            const decrypted = await GistEncrypt.decrypt(_pendingEncryptedJson, pass)
            const config = JSON.parse(decrypted)
            await ConfigManager.prepareConfigForLoad(config)
            set({ _pendingEncryptedJson: null, showJsonPassphraseModal: false, jsonPassphrase: '' })
            await get().applyImportedConfig(config)
            get().setStatus('Configuration chargée', 'success')
        } catch (e: any) {
            set({ jsonPassphraseError: e.message || 'Mot de passe incorrecte' })
        } finally {
            set({ jsonPassphraseLoading: false })
        }
    },

    async applyImportedConfig(config: any) {
        await ConfigManager.prepareConfigForLoad(config)
        const initCell = (cell: any, cellIndex: number) =>
            initializeCell(cell, cellIndex, { generateId: () => get().generateCellId() })

        const initGroup = (group: any, groupIndex: number): any => {
            const newGroup: any = {
                _id: group.id || get().generateGroupId(),
                _type: group.type || 'core',
                direction: group.direction || 'row',
                style: group.style || '',
                _order: ConfigManager.normalizeOrder(group.order, groupIndex),
                cells: (group.cells || []).map((cell: any, ci: number) => initCell(ConfigManager.normalizeCell({ ...cell }), ci)),
                accordion: group.accordion || false,
                title: group.title || '',
                accordionOpen: group.accordionOpen !== false
            }
            newGroup.tabsChild = group.tabsChild || false
            newGroup.name = group.name || ''
            if (Array.isArray(group.queries) && group.queries.length > 0) {
                newGroup.queries = group.queries.map((q: any) => ({
                    name: q.name || 'main',
                    sql: q.sql || '',
                    engine: q.engine || 'sql',
                    showQueryEditor: (q.showQueryEditor ?? q.clientVisible) === true
                }))
            } else {
                newGroup.queries = []
            }
            newGroup.loop = group.loop
                ? { enabled: group.loop.enabled || false, query: group.loop.query || '', zip: group.loop.zip || false, zipQuery: group.loop.zipQuery || '' }
                : { enabled: false, query: '', zip: false, zipQuery: '' }
            if (group.children && group.children.length > 0) {
                newGroup.children = group.children.map((child: any, ci: number) => {
                    const initialized = initGroup(child, ci)
                    initialized._order = ConfigManager.normalizeOrder(child.order, ci)
                    return initialized
                })
            }
            return newGroup
        }

        let loadedPages = (config.job?.pages || []).map((page: any, pi: number) => {
            const allGroups = (page.groups || []).map((g: any, gi: number) => initGroup(g, gi))
            return {
                _id: page.id || get().generatePageId(),
                name: page.name || `Feuille ${pi + 1}`,
                groups: allGroups.filter((g: any) => g._type === 'core'),
                linkGroups: allGroups.filter((g: any) => g._type === 'link')
            }
        })

        if (loadedPages.length === 0) {
            loadedPages = [{ _id: get().generatePageId(), name: 'Feuille 1', groups: [], linkGroups: [] }]
        }

        set({ pages: loadedPages, activePageIndex: 0, _pagesInitialized: new Set() })
        get().ensureAllCellsHaveNames()
        await get().loadPendingSourceFiles()
        await get().evaluateAllGroupIfQueries()
        await get().runAllGroups()
        const firstPage = get().pages[0]
        if (firstPage) {
            set((s: any) => ({ _pagesInitialized: new Set([...s._pagesInitialized, firstPage._id]) }))
        }
        setTimeout(() => setTimeout(() => get().refreshMarkdownCellsForPage(0), 300), 0)

        const configDbEngine = config.ui?.dbEngine
        if (configDbEngine && configDbEngine !== get().dbEngine) {
            await get().switchDbEngine(configDbEngine)
        }
        if (config.ui?.directedAcyclicGraph !== undefined) {
            set({ directedAcyclicGraph: config.ui.directedAcyclicGraph === true })
        }
        if (config.ui?.devMode !== undefined) {
            set({ devMode: config.ui.devMode !== false })
        }
        if (config.ui?.showLayout !== undefined || config.ui?.displaySettings !== undefined) {
            set({ showLayout: (config.ui?.showLayout ?? config.ui?.displaySettings) !== false })
        }
        const configTheme = config.ui?.theme
        if (configTheme === 'light' || configTheme === 'dark') {
            if (get().availableThemes.includes(configTheme)) get().setTheme(configTheme)
        } else if (configTheme) {
            applyThemeFromConfig(config.ui)
        }
        get().setStatus('Configuration chargée', 'success')
    },
})
