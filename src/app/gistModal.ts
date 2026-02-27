// @ts-nocheck

export function gistPassphraseModal() {
            return {
                passphrase: '',
                error: '',
                loading: false,
                init() {},
                useDefaultConfig() {
                    const baseConfig = window._encryptedSource === 'html' ? { job: { cells: [] } } : ConfigManager.getDefaultConfig();
                    window._loadedConfig = ConfigManager.applyURLParamsToConfig(baseConfig);
                    window._pendingEncryptedGist = null;
                    window._encryptedSource = null;
                    const container = window._appContainer || document.getElementById('app-container');
                    if (container) {
                        container.innerHTML = window.generateAppHTML();
                        if (window.Alpine) Alpine.initTree(container);
                    }
                    window.notebookApp = window.notebookApp;
                },
                async unlock() {
                    const pass = (this.passphrase || '').trim();
                    if (!pass) { this.error = 'Veuillez entrer la passphrase'; return; }
                    this.error = '';
                    this.loading = true;
                    try {
                        const decrypted = await GistEncrypt.decrypt(window._pendingEncryptedGist, pass);
                        const parsed = JSON.parse(decrypted);
                        let config;
                        if (window._encryptedSource === 'html' && parsed && typeof parsed.config === 'object' && Array.isArray(parsed.sourceFiles) && Array.isArray(parsed.docxTemplates)) {
                            for (const sf of parsed.sourceFiles) {
                                const script = document.createElement('script');
                                script.type = 'application/octet-stream';
                                script.id = sf.id;
                                script.dataset.sourceName = sf.sourceName;
                                script.dataset.fileName = sf.fileName;
                                script.textContent = sf.base64 || '';
                                document.head.appendChild(script);
                            }
                            for (const dt of parsed.docxTemplates) {
                                const script = document.createElement('script');
                                script.type = 'application/octet-stream';
                                script.id = dt.id;
                                script.dataset.cellPath = dt.cellPath;
                                script.dataset.fileName = dt.fileName;
                                if (dt.compressed) script.dataset.compressed = 'true';
                                script.textContent = dt.base64 || '';
                                document.head.appendChild(script);
                            }
                            const configScript = document.getElementById('defaultConfigBase64');
                            if (configScript) {
                                configScript.textContent = ConfigManager.encodeUTF8ToBase64(JSON.stringify(parsed.config, null, 2));
                                configScript.removeAttribute('data-encrypted');
                            }
                            config = parsed.config;
                        } else {
                            config = ConfigManager.deepMerge(ConfigManager.getDefaultConfig(), parsed);
                            await ConfigManager.prepareConfigForLoad(config);
                        }
                        window._loadedConfig = ConfigManager.applyURLParamsToConfig(config);
                        window._pendingEncryptedGist = null;
                        window._encryptedSource = null;
                        const container = window._appContainer || document.getElementById('app-container');
                        if (container) {
                            container.innerHTML = window.generateAppHTML();
                            if (window.Alpine) Alpine.initTree(container);
                        }
                        window.notebookApp = window.notebookApp;
                    } catch (e) {
                        this.error = e.message || 'Passphrase incorrecte';
                    } finally {
                        this.loading = false;
                    }
                }
            };
}
