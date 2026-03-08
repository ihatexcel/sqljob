// @ts-nocheck
import { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@sqlrooms/ui'
import { MessageSquareCodeIcon } from 'lucide-react'

const ERUDA_CDN = 'https://cdn.jsdelivr.net/npm/eruda'

async function loadEruda(): Promise<any> {
    if ((window as any).eruda) return (window as any).eruda
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = ERUDA_CDN
        script.onload = () => resolve((window as any).eruda)
        script.onerror = reject
        document.head.appendChild(script)
    })
}

interface ErudaModalProps {
    open: boolean
    onClose: () => void
}

export function ErudaModal({ open, onClose }: ErudaModalProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [error, setError] = useState<string | null>(null)
    const initializedRef = useRef(false)

    useEffect(() => {
        if (!open || !containerRef.current) return
        if (initializedRef.current) return

        setError(null)
        loadEruda()
            .then(eruda => {
                if (!containerRef.current) return
                eruda.init({ container: containerRef.current, tool: ['console', 'elements', 'network', 'resources', 'info'] })
                initializedRef.current = true
            })
            .catch(() => setError('Impossible de charger Eruda. Vérifiez votre connexion.'))
    }, [open])

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent className="max-w-2xl h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-4 py-3 border-b border-border shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-sm">
                        <MessageSquareCodeIcon className="h-4 w-4" />
                        Console debug (Eruda)
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 relative overflow-hidden">
                    {error ? (
                        <div className="flex items-center justify-center h-full text-sm text-destructive px-4 text-center">
                            {error}
                        </div>
                    ) : (
                        <div ref={containerRef} className="absolute inset-0" />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
