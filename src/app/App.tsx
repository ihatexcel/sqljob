// @ts-nocheck
/**
 * Composant racine React — remplace mount.ts + htmlTemplates.generateAppHTML()
 *
 * Logique de chargement :
 * 1. Charge la config depuis Gist/URL (ConfigManager.loadConfigFromGist)
 * 2. Si la config est chiffrée → affiche GistPassphraseModal
 * 3. Sinon → initialise le store Zustand + affiche NotebookLayout
 */
import { useEffect, useState } from 'react'
import { ConfigManager } from '../lib/ConfigManager'
import { useNotebookStore, exposeGlobals } from './store/notebookStore'
import { useTemplateModal } from './store/uiStores'
import { NotebookLayout } from './components/NotebookLayout'
import { GistPassphraseModal } from './components/modals/GistPassphraseModal'

type AppState = 'loading' | 'passphrase' | 'ready'

export function App() {
    const [appState, setAppState] = useState<AppState>('loading')
    const initFromConfig = useNotebookStore(s => s.initFromConfig)

    useEffect(() => {
        // Expose les globals pour compatibilité avec les mixins
        exposeGlobals()

        // Wiring du templateModal : quand selectTemplate est appelé,
        // déléguer à l'action Zustand du notebookStore
        useTemplateModal.setState({
            _onSelectTemplate: (cellId, queryType, templateIndex, languageType) => {
                useNotebookStore.getState().applyTemplateToCell?.(cellId, queryType, templateIndex, languageType)
            }
        })

        // Chargement de la config
        ConfigManager.loadConfigFromGist().then((loadResult: any) => {
            if (loadResult?.needsPassphrase && loadResult?.encryptedContent) {
                window._pendingEncryptedGist = loadResult.encryptedContent
                window._encryptedSource = loadResult.source || 'gist'
                setAppState('passphrase')
            } else {
                window._loadedConfig = loadResult
                if (loadResult) {
                    initFromConfig(loadResult)
                }
                setAppState('ready')
            }
        })
    }, [])

    if (appState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="text-base-content/60">Chargement...</p>
                </div>
            </div>
        )
    }

    if (appState === 'passphrase') {
        return (
            <GistPassphraseModal
                onUnlocked={() => setAppState('ready')}
            />
        )
    }

    return <NotebookLayout />
}
