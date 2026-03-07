// @ts-nocheck
import { useState } from 'react'
import { ConfigManager } from '../../../lib/ConfigManager'
import { GistEncrypt } from '../../../lib/GistEncrypt'
import { useNotebookStore } from '../../store/notebookStore'
import {
    Button, Input, Label,
    Alert, AlertDescription,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Spinner,
} from '@sqlrooms/ui'
import { Icon } from \'../../../lib/icons\'

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
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted">
            <Dialog open={true}>
                <DialogContent className="max-w-md" onInteractOutside={e => e.preventDefault()} aria-describedby={undefined}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Icon name="lock" size={20} />
                            Configuration chiffrée
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-muted-foreground">
                        Cette configuration est protégée par un mot de passe. Entrez-le pour charger les données.
                    </p>
                    <div className="space-y-2">
                        <Label>Passphrase</Label>
                        <Input
                            type="password"
                            value={passphrase}
                            onChange={e => setPassphrase(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && unlock()}
                            placeholder="68cd597ba5da05ceba24fb975c05384f"
                            className="font-mono"
                            autoComplete="current-password"
                        />
                    </div>
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <DialogFooter className="flex-wrap gap-2">
                        {!isHtmlSource && (
                            <Button variant="ghost" size="sm" onClick={useDefaultConfig}>
                                Utiliser la config par défaut
                            </Button>
                        )}
                        <Button onClick={unlock} disabled={loading}>
                            {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                            Déchiffrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
