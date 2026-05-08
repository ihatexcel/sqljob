import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@sqlrooms/ui'
import { MessageSquareCodeIcon } from 'lucide-react'

// Singleton : promise de chargement + état d'init
let loadPromise: Promise<any> | null = null
let initialized = false

function loadEruda(): Promise<any> {
    if (loadPromise) return loadPromise
    loadPromise = import('eruda').then(m => m.default ?? m)
    loadPromise.catch(() => { loadPromise = null })
    return loadPromise
}

// Conteneur eruda monté hors du Dialog pour survivre aux open/close cycles
let erudaContainer: HTMLDivElement | null = null
function getOrCreateErudaContainer() {
    if (erudaContainer) return erudaContainer
    erudaContainer = document.createElement('div')
    erudaContainer.style.cssText = 'position:fixed;inset:0;z-index:9999;pointer-events:none;'
    document.body.appendChild(erudaContainer)
    return erudaContainer
}

interface ErudaModalProps {
    open: boolean
    onClose: () => void
}

export function ErudaModal({ open, onClose }: ErudaModalProps) {
    const mountRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            // Masquer eruda sans le détruire
            if ((window as any).eruda && initialized) {
                try { (window as any).eruda.hide() } catch {}
            }
            return
        }

        setError(null)
        loadEruda()
            .then(eruda => {
                if (!initialized) {
                    const container = getOrCreateErudaContainer()
                    container.style.pointerEvents = 'auto'
                    eruda.init({
                        container,
                        tool: ['console', 'elements', 'network', 'resources', 'info'],
                        defaults: { displaySize: 80, transparency: 1 },
                    })
                    initialized = true
                    // Petite attente pour que l'UI eruda soit montée
                    setTimeout(() => {
                        try { eruda.show() } catch {}
                    }, 50)
                } else {
                    const container = getOrCreateErudaContainer()
                    container.style.pointerEvents = 'auto'
                    try { eruda.show() } catch {}
                }
            })
            .catch(err => setError('Impossible de charger Eruda. Vérifiez votre connexion.'))
    }, [open])

    // Quand le Dialog se ferme via backdrop/Esc, masquer eruda
    const handleOpenChange = (v: boolean) => {
        if (!v) {
            if ((window as any).eruda && initialized) {
                try { (window as any).eruda.hide() } catch {}
                const c = erudaContainer
                if (c) c.style.pointerEvents = 'none'
            }
            onClose()
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-xs flex flex-col p-0 gap-0" style={{ height: 'auto' }}>
                <DialogHeader className="px-4 py-3 border-b border-border">
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        <MessageSquareCodeIcon className="h-4 w-4" />
                        Console debug (Eruda)
                    </DialogTitle>
                </DialogHeader>
                <div className="px-4 py-4 text-sm text-muted-foreground" ref={mountRef}>
                    {error
                        ? <span className="text-destructive">{error}</span>
                        : 'La console Eruda est ouverte en superposition. Fermez cette modale pour la masquer.'
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
