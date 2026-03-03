// @ts-nocheck
import { useState } from 'react'
import { ConfigManager } from '../../../lib/ConfigManager'
import { GistEncrypt } from '../../../lib/GistEncrypt'
import { useNotebookStore } from '../../store/notebookStore'

interface Props {
    onUnlocked: () => void
}

export function GistPassphraseModal({ onUnlocked }: Props) {
    const [passphrase, setPassphrase] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const initFromConfig = useNotebookStore(s => s.initFromConfig)

    const isHtmlSource = typeof window !== 'undefined' && window._encryptedSource === 'html'

    function useDefaultConfig() {
        const baseConfig = isHtmlSource
            ? { job: { cells: [] } }
            : ConfigManager.getDefaultConfig()
        const config = ConfigManager.applyURLParamsToConfig(baseConfig)
        window._pendingEncryptedGist = null
        window._encryptedSource = null
        initFromConfig(config)
        onUnlocked()
    }

    async function unlock() {
        const pass = (passphrase || '').trim()
        if (!pass) { setError('Veuillez entrer la passphrase'); return }
        setError('')
        setLoading(true)
        try {
            const decrypted = await GistEncrypt.decrypt(window._pendingEncryptedGist, pass)
            const parsed = JSON.parse(decrypted)
            let config: any

            if (isHtmlSource && parsed && typeof parsed.config === 'object' && Array.isArray(parsed.sourceFiles)) {
                for (const sf of parsed.sourceFiles) {
                    const script = document.createElement('script')
                    script.type = 'application/octet-stream'
                    script.id = sf.id
                    script.dataset.sourceName = sf.sourceName
                    script.dataset.fileName = sf.fileName
                    script.textContent = sf.base64 || ''
                    document.head.appendChild(script)
                }
                for (const dt of (parsed.docxTemplates || [])) {
                    const script = document.createElement('script')
                    script.type = 'application/octet-stream'
                    script.id = dt.id
                    script.dataset.cellPath = dt.cellPath
                    script.dataset.fileName = dt.fileName
                    if (dt.compressed) script.dataset.compressed = 'true'
                    script.textContent = dt.base64 || ''
                    document.head.appendChild(script)
                }
                const configScript = document.getElementById('defaultConfigBase64')
                if (configScript) {
                    configScript.textContent = ConfigManager.encodeUTF8ToBase64(JSON.stringify(parsed.config, null, 2))
                    configScript.removeAttribute('data-encrypted')
                }
                config = parsed.config
            } else {
                config = ConfigManager.deepMerge(ConfigManager.getDefaultConfig(), parsed)
                await ConfigManager.prepareConfigForLoad(config)
            }

            const finalConfig = ConfigManager.applyURLParamsToConfig(config)
            window._loadedConfig = finalConfig
            window._pendingEncryptedGist = null
            window._encryptedSource = null
            initFromConfig(finalConfig)
            onUnlocked()
        } catch (e: any) {
            setError(e.message || 'Passphrase incorrecte')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-base-200">
            <div className="modal modal-open">
                <div className="modal-box max-w-md">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <span className="iconify" data-icon="material-symbols-light:lock" style={{ fontSize: '1.25rem' }}></span>
                        Configuration chiffrée
                    </h3>
                    <p className="py-2 text-sm text-base-content/70">
                        Cette configuration est protégée par un mot de passe. Entrez-le pour charger les données.
                    </p>
                    <div className="form-control mt-4">
                        <label className="label"><span className="label-text">Passphrase</span></label>
                        <input
                            type="password"
                            value={passphrase}
                            onChange={e => setPassphrase(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && unlock()}
                            placeholder="68cd597ba5da05ceba24fb975c05384f"
                            className="input input-bordered w-full font-mono"
                            autoComplete="current-password"
                        />
                    </div>
                    {error && (
                        <div className="alert alert-error mt-3">
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="modal-action flex-wrap gap-2">
                        {!isHtmlSource && (
                            <button className="btn btn-ghost btn-sm" onClick={useDefaultConfig}>
                                Utiliser la config par défaut
                            </button>
                        )}
                        <button className="btn btn-primary" onClick={unlock} disabled={loading}>
                            {loading
                                ? <span className="loading loading-spinner loading-sm"></span>
                                : 'Déchiffrer'
                            }
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button type="button">close</button>
                </form>
            </div>
        </div>
    )
}
