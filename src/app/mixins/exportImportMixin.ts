// @ts-nocheck

export function exportImportMixin() {
    return {
                setTheme(themeName) {
                    const theme = themeName === 'dark' ? 'dark' : 'light'
                    this.currentTheme = theme;
                    document.documentElement.classList.remove('light', 'dark');
                    document.documentElement.classList.add(theme);
                    localStorage.setItem('sqljob-theme', theme);
                },

                // ─────────────────────────────────────────────────────────────────
                // Export unifié
                // ─────────────────────────────────────────────────────────────────

                openExportModal(type) {
                    // Pour le gist, vérifier d'abord si un token existe
                    if (type === 'gist' && !GitHubGistManager.hasAccessToken()) {
                        this.showGistTokenModal = true;
                        return;
                    }

                    // Valeur par défaut du nom de fichier (avec date/heure pour tous les types)
                    const now = new Date();
                    const yyyymmdd = now.toISOString().slice(0, 10).replace(/-/g, '');
                    const hhmmss = now.toTimeString().slice(0, 8).replace(/:/g, '');
                    const defaultFileName = `sqljob_${yyyymmdd}_${hhmmss}`;

                    // Réinitialiser la modale avec les valeurs par défaut
                    this.exportModal = {
                        show: true,
                        type: type,
                        fileName: defaultFileName,
                        description: 'sqljob Notebook Configuration',
                        devMode: false,
                        showLayout: false,
                        includeFiles: false,
                        encryptGist: false,
                        gistPassphrase: ''
                    };
                },

                async copyExportJson() {
                    const em = this.exportModal;
                    try {
                        const config = await ConfigManager.buildConfigFromState(
                            this.pages,
                            em.devMode,
                            em.showLayout,
                            !!em.includeFiles,
                            this.currentTheme,
                            this.dbEngine,
                            this.directedAcyclicGraph
                        );
                        const json = exportConfigToJson(config);
                        // Fallback textarea pour éviter la perte du contexte de geste utilisateur
                        const ta = document.createElement('textarea');
                        ta.value = json;
                        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
                        document.body.appendChild(ta);
                        ta.focus();
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        return true;
                    } catch (error) {
                        console.error('Erreur copie JSON:', error);
                        this.setStatus('Erreur: ' + error.message, 'error');
                        return false;
                    }
                },

                async executeExport() {
                    const type = this.exportModal.type;
                    const fileName = this.exportModal.fileName || 'notebook-config.json';
                    const description = this.exportModal.description || 'sqljob Notebook Configuration';
                    const devMode = this.exportModal.devMode;
                    const showLayout = this.exportModal.showLayout;
                    const includeFiles = !!this.exportModal.includeFiles;

                    this.exportModal = { ...this.exportModal, show: false };

                    try {
                        this.isLoading = true;

                        // Générer la configuration avec les paramètres choisis
                        const includeFileData = includeFiles;
                        const config = await ConfigManager.buildConfigFromState(
                            this.pages,
                            devMode,
                            showLayout,
                            includeFileData,
                            this.currentTheme,
                            this.dbEngine,
                            this.directedAcyclicGraph
                        );

                        switch (type) {
                            case 'gist':
                                this.setStatus('Création du gist GitHub...', 'loading');
                                let passphrase = null;
                                if (this.exportModal.encryptGist) {
                                    passphrase = (this.exportModal.gistPassphrase || '').trim();
                                    if (!passphrase) passphrase = GistEncrypt.generatePassphrase();
                                }
                                const gistUrl = await GitHubGistManager.createGist(config, description, fileName, passphrase);
                                this.gistShareUrl = GitHubGistManager.generateSqljobUrl(gistUrl);
                                this.gistWasEncrypted = !!passphrase;
                                this.gistPassphraseToShare = passphrase || '';
                                this.showGistModal = true;
                                this.setStatus('Gist créé avec succès', 'success');
                                break;

                            case 'json':
                                this.setStatus('Export JSON...', 'loading');
                                let jsonContent;
                                const jsonPassphrase = this.exportModal.encryptGist ? ((this.exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase()) : null;
                                if (jsonPassphrase) {
                                    const jsonString = JSON.stringify(config);
                                    const encrypted = await GistEncrypt.encrypt(jsonString, jsonPassphrase);
                                    jsonContent = JSON.stringify(encrypted, null, 2);
                                } else {
                                    jsonContent = exportConfigToJson(config);
                                }
                                const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
                                const jsonFileName = fileName.endsWith('.json') ? fileName : fileName + '.json';
                                FileHandler.downloadFile(jsonBlob, jsonFileName);
                                this.setStatus('Configuration exportée', 'success');
                                break;

                            case 'base64':
                                this.setStatus('Export Base64...', 'loading');
                                const jsonStr = JSON.stringify(config);
                                const base64String = ConfigManager.encodeUTF8ToBase64(jsonStr);
                                const base64Blob = new Blob([base64String], { type: 'text/plain' });
                                const base64FileName = fileName.endsWith('.txt') ? fileName : fileName + '.txt';
                                FileHandler.downloadFile(base64Blob, base64FileName);
                                this.setStatus('Configuration exportée en Base64', 'success');
                                break;

                            case 'html':
                                this.setStatus('Génération HTML...', 'loading');
                                const htmlFileName = (fileName.endsWith('.html') ? fileName : fileName + '.html');
                                const htmlPassphrase = this.exportModal.encryptGist ? ((this.exportModal.gistPassphrase || '').trim() || GistEncrypt.generatePassphrase()) : null;
                                await this.exportHTMLWithConfig(config, htmlFileName, htmlPassphrase, includeFiles);
                                this.setStatus('HTML exporté', 'success');
                                break;
                        }
                    } catch (error) {
                        console.error('Erreur export:', error);
                        this.setStatus('Erreur: ' + error.message, 'error');

                        // Si erreur d'authentification pour gist
                        if (type === 'gist' && (error.message.includes('authentifié') || error.message.includes('Unauthorized'))) {
                            GitHubGistManager.clearAccessToken();
                            this.showGistTokenModal = true;
                        }
                    } finally {
                        this.isLoading = false;
                    }
                },

                async exportHTMLWithConfig(config, fileName = 'index.sqljob.html', passphrase = null, includeFiles = false) {
                    const sourceFilesPayload = [];
                    const docxTemplatesPayload = [];

                    // Collecter les fichiers embarqués sous forme de chaînes HTML
                    let embeddedScripts = '';

                    const collectFilesForTemplate = async (group, groupPath = []) => {
                        for (let ci = 0; ci < (group.cells || []).length; ci++) {
                            const cell = group.cells[ci];

                            if (cell.type === 'source' && cell._currentFile && cell._fileName) {
                                const safeName = cell.name.replace(/[^a-zA-Z0-9_]/g, '_');
                                const ab = await cell._currentFile.arrayBuffer();
                                const compressed = await FileHandler.compressGzip(ab);
                                const b64 = FileHandler.arrayBufferToBase64(compressed);
                                if (passphrase) {
                                    sourceFilesPayload.push({ id: `sourceFile_${safeName}`, sourceName: cell.name, fileName: cell._fileName, base64: b64 });
                                } else {
                                    embeddedScripts += `    <script type="application/octet-stream" id="sourceFile_${safeName}" data-source-name="${cell.name}" data-file-name="${cell._fileName}">${b64}</script>\n`;
                                }
                            }

                            if (cell.type === 'publipostageWord' && cell.docxTemplateBase64 && cell.docxTemplateFileName) {
                                const cellPath = [...groupPath, ci].join('_');
                                const stableId = `docxTemplate_${cellPath}`;
                                const docxBytes = FileHandler.base64ToUint8Array(cell.docxTemplateBase64);
                                const docxCompressed = await FileHandler.compressGzip(docxBytes.buffer || docxBytes);
                                const docxB64 = FileHandler.arrayBufferToBase64(docxCompressed);
                                if (passphrase) {
                                    docxTemplatesPayload.push({ id: stableId, cellPath, fileName: cell.docxTemplateFileName, base64: docxB64, compressed: true });
                                } else {
                                    embeddedScripts += `    <script type="application/octet-stream" id="${stableId}" data-cell-path="${cellPath}" data-file-name="${cell.docxTemplateFileName}" data-compressed="true">${docxB64}</script>\n`;
                                }
                            }
                        }
                        for (let ci = 0; ci < (group.children || []).length; ci++) {
                            await collectFilesForTemplate(group.children[ci], [...groupPath, ci]);
                        }
                    };

                    if (includeFiles) {
                        for (let pi = 0; pi < this.pages.length; pi++) {
                            for (let gi = 0; gi < this.pages[pi].groups.length; gi++) {
                                await collectFilesForTemplate(this.pages[pi].groups[gi], [gi]);
                            }
                            for (let gi = 0; gi < (this.pages[pi].linkGroups || []).length; gi++) {
                                await collectFilesForTemplate(this.pages[pi].linkGroups[gi], [-1, gi]);
                            }
                        }
                    }

                    // Construire la balise de config
                    let configScriptTag;
                    if (passphrase) {
                        const payload = { config, sourceFiles: sourceFilesPayload, docxTemplates: docxTemplatesPayload };
                        let payloadStr;
                        try { payloadStr = JSON.stringify(payload); } catch (e) { payloadStr = '[stringify error]'; }
                        const encrypted = await GistEncrypt.encrypt(payloadStr, passphrase);
                        const configScriptContent = btoa(JSON.stringify(encrypted));
                        configScriptTag = `    <script type="application/octet-stream" id="defaultConfigBase64" data-encrypted="true">${configScriptContent}</script>\n`;
                    } else {
                        const configBase64 = ConfigManager.encodeUTF8ToBase64(exportConfigToJson(config));
                        configScriptTag = `    <script type="application/octet-stream" id="defaultConfigBase64">${configBase64}</script>\n`;
                    }

                    // URLs GitHub Pages — MIME type correct, pas de trace CDN externe
                    const sqljobSrc = 'https://ihatexcel.github.io/sqljob/dist-cdn/sqljob.js';
                    const sqljobCss = 'https://ihatexcel.github.io/sqljob/dist-cdn/sqljob.css';

                    // Template HTML fixe — identique à test-cdn.html
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
</html>`;

                    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                    FileHandler.downloadFile(blob, fileName);
                },

                cancelExport() {
                    this.exportModal = { ...this.exportModal, show: false };
                },

                saveGithubToken() {
                    if (!this.githubToken || this.githubToken.trim() === '') {
                        this.setStatus('Veuillez saisir un token', 'error');
                        return;
                    }

                    try {
                        GitHubGistManager.setAccessToken(this.githubToken.trim());
                        this.showGistTokenModal = false;
                        this.githubToken = '';
                        this.setStatus('Token GitHub enregistré', 'success');

                        // Afficher la modale d'export pour le gist
                        setTimeout(() => this.openExportModal('gist'), 300);
                    } catch (error) {
                        this.setStatus('Erreur: ' + error.message, 'error');
                    }
                },

                cancelGithubToken() {
                    this.showGistTokenModal = false;
                    this.githubToken = '';
                },

                copyGistUrl() {
                    navigator.clipboard.writeText(this.gistShareUrl).then(() => {
                        this.setStatus('URL copiée dans le presse-papiers', 'success');
                    }).catch(() => {
                        this.setStatus('Erreur lors de la copie', 'error');
                    });
                },

                copyGistPassphrase() {
                    navigator.clipboard.writeText(this.gistPassphraseToShare).then(() => {
                        this.setStatus('Mot de passe copié dans le presse-papiers', 'success');
                    }).catch(() => {
                        this.setStatus('Erreur lors de la copie', 'error');
                    });
                },

                closeGistModal() {
                    this.showGistModal = false;
                    this.gistShareUrl = '';
                    this.gistWasEncrypted = false;
                    this.gistPassphraseToShare = '';
                },

                openGistUrl() {
                    if (this.gistShareUrl) {
                        window.open(this.gistShareUrl, '_blank');
                    }
                },

                // ─────────────────────────────────────────────────────────────────

                async loadConfig(event) {
                    const file = event.target.files[0];
                    if (!file) return;

                    try {
                        const text = await file.text();
                        const parsed = JSON.parse(text);

                        event.target.value = '';

                        if (GistEncrypt.isEncrypted(parsed)) {
                            this._pendingEncryptedJson = parsed;
                            this.showJsonPassphraseModal = true;
                            this.jsonPassphrase = '';
                            this.jsonPassphraseError = '';
                            return;
                        }

                        await this.applyImportedConfig(parsed);
                    } catch (error) {
                        this.setStatus('Erreur import: ' + error.message, 'error');
                    }
                },

                cancelJsonPassphraseModal() {
                    this.showJsonPassphraseModal = false;
                    this._pendingEncryptedJson = null;
                    this.jsonPassphrase = '';
                    this.jsonPassphraseError = '';
                },

                async unlockJsonConfig() {
                    const pass = (this.jsonPassphrase || '').trim();
                    if (!pass) { this.jsonPassphraseError = 'Veuillez entrer la mot de passe'; return; }
                    this.jsonPassphraseError = '';
                    this.jsonPassphraseLoading = true;
                    try {
                        const decrypted = await GistEncrypt.decrypt(this._pendingEncryptedJson, pass);
                        const config = JSON.parse(decrypted);
                        await ConfigManager.prepareConfigForLoad(config);
                        this._pendingEncryptedJson = null;
                        this.showJsonPassphraseModal = false;
                        this.jsonPassphrase = '';
                        await this.applyImportedConfig(config);
                        this.setStatus('Configuration chargée', 'success');
                    } catch (e) {
                        this.jsonPassphraseError = e.message || 'Mot de passe incorrecte';
                    } finally {
                        this.jsonPassphraseLoading = false;
                    }
                },

                async applyImportedConfig(config) {
                        await ConfigManager.prepareConfigForLoad(config);
                        const initCell = (cell, cellIndex) => initializeCell(cell, cellIndex, { generateId: () => this.generateCellId() });

                        // Helper récursif pour initialiser un groupe et ses enfants
                        const initGroup = (group, groupIndex) => {
                            const newGroup = {
                                _id: group.id || this.generateGroupId(),
                                _type: group.type || 'core',
                                direction: group.direction || 'row',
                                style: group.style || '',
                                _order: ConfigManager.normalizeOrder(group.order, groupIndex),
                                cells: (group.cells || []).map((cell, cellIndex) => initCell(ConfigManager.normalizeCell({ ...cell }), cellIndex)),
                                accordion: group.accordion || false,
                                title: group.title || '',
                                accordionOpen: group.accordionOpen !== false // true par défaut
                            };

                            // Ajouter tabsChild et name
                            newGroup.tabsChild = group.tabsChild || false;
                            newGroup.name = group.name || '';

                            if (Array.isArray(group.queries) && group.queries.length > 0) {
                                newGroup.queries = group.queries.map((q, i) => ({
                                    name: q.name || 'main',
                                    sql: q.query || q.sql || '',
                                    engine: q.engine || 'sql',
                                    showQueryEditor: (q.showQueryEditor ?? q.clientVisible) === true
                                }));
                            } else {
                                newGroup.queries = [];
                            }

                            if (group.loop) {
                                newGroup.loop = {
                                    enabled: group.loop.enabled || false,
                                    query: group.loop.query || '',
                                    zip: group.loop.zip || false,
                                    zipQuery: group.loop.zipQuery || ''
                                };
                            } else {
                                newGroup.loop = { enabled: false, query: '', zip: false, zipQuery: '' };
                            }

                            if (group.children && group.children.length > 0) {
                                newGroup.children = group.children.map((child, childIndex) => {
                                    const initializedChild = initGroup(child, childIndex);
                                    initializedChild._order = ConfigManager.normalizeOrder(child.order, childIndex);
                                    return initializedChild;
                                });
                            }

                            return newGroup;
                        };

                        // Charger les pages depuis la config
                        let loadedPages = (config.job?.pages || []).map((page, pageIndex) => {
                                const allGroups = (page.groups || []).map((group, groupIndex) => initGroup(group, groupIndex));
                                const initGroups = allGroups.filter(g => g._type === 'core');
                                const initLinkGroups = allGroups.filter(g => g._type === 'link');

                                return {
                                    _id: page.id || this.generatePageId(),
                                    name: page.name || `Feuille ${pageIndex + 1}`,
                                    groups: initGroups,
                                    linkGroups: initLinkGroups
                                };
                            });

                        // Si aucune page n'existe, créer une page par défaut
                        if (loadedPages.length === 0) {
                            loadedPages = [{
                                _id: this.generatePageId(),
                                name: 'Feuille 1',
                                groups: [],
                                linkGroups: []
                            }];
                        }

                        this.pages = loadedPages;
                        this.activePageIndex = 0;
                        this._pagesInitialized.clear();
                        this.ensureAllCellsHaveNames();

                        // Charger les fichiers source en attente (depuis la config JSON)
                        await this.loadPendingSourceFiles();

                        // Évaluer les ifQuery des groupes
                        await this.evaluateAllGroupIfQueries();

                        // Auto-exécution au chargement du notebook (page 0)
                        await this.runAllGroups();
                        if (this.pages[0]) this._pagesInitialized.add(this.pages[0]._id);
                        this.$nextTick(() => setTimeout(() => this.refreshMarkdownCellsForPage(0), 300));

                        // Mettre à jour le moteur DB si différent dans la config importée
                        const configDbEngine = config.ui?.dbEngine;
                        if (configDbEngine && configDbEngine !== this.dbEngine) {
                            await this.switchDbEngine(configDbEngine);
                        }

                        // Mettre à jour le DAG si présent dans la config importée
                        if (config.ui?.directedAcyclicGraph !== undefined) {
                            this.directedAcyclicGraph = config.ui.directedAcyclicGraph === true;
                        }

                        // Mettre à jour devMode si présent dans la config importée
                        if (config.ui?.devMode !== undefined) {
                            this.devMode = config.ui.devMode !== false;
                        }

                        // Mettre à jour showLayout si présent (rétrocompat: displaySettings)
                        if (config.ui?.showLayout !== undefined || config.ui?.displaySettings !== undefined) {
                            this.showLayout = (config.ui?.showLayout ?? config.ui?.displaySettings) !== false;
                        }

                        // Mettre à jour le thème si présent dans la config importée
                        const configTheme = config.ui?.theme;
                        if (configTheme && this.availableThemes.includes(configTheme)) {
                            this.setTheme(configTheme);
                        }

                        this.setStatus('Configuration chargée', 'success');
                },
    };
}
