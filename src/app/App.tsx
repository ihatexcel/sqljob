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
import { ThemeProvider } from '@sqlrooms/ui'
import { Toaster } from '@sqlrooms/ui'
import { Spinner } from '@sqlrooms/ui'
import { ConfigManager } from '../lib/ConfigManager'
import { useNotebookStore, exposeGlobals } from './store/notebookStore'
import { useTemplateModal } from './store/uiStores'
import { NotebookLayout } from './components/NotebookLayout'
import { GistPassphraseModal } from './components/modals/GistPassphraseModal'

type AppState = 'loading' | 'passphrase' | 'ready'

function AppContent() {
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

    // Remplace le hook init() d'Alpine (appelé automatiquement au montage du composant Alpine).
    // On l'appelle dès que l'app passe en état 'ready' : initialise DuckDB, charge les fichiers,
    // évalue les ifQuery et auto-exécute les groupes.
    useEffect(() => {
        if (appState === 'ready') {
            useNotebookStore.getState().init?.()
        }
    }, [appState])

    if (appState === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="h-8 w-8 text-primary" />
                    <p className="text-muted-foreground">Chargement...</p>
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

export function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="sqljob-theme">
            <AppContent />
            <Toaster />
        </ThemeProvider>
    )
}
