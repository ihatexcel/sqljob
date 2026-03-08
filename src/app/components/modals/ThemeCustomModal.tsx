// @ts-nocheck
import { useState, useEffect } from 'react'
import {
    Button,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Separator,
} from '@sqlrooms/ui'
import { Icon } from '../../../lib/icons'

const STORAGE_LIGHT = 'sqljob-custom-theme-light'
const STORAGE_DARK  = 'sqljob-custom-theme-dark'
const STYLE_ID      = 'sqljob-custom-theme'

function applyCustomTheme(light: string, dark: string) {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
        el = document.createElement('style')
        el.id = STYLE_ID
        document.head.appendChild(el)
    }
    const parts: string[] = []
    if (light.trim()) parts.push(`:root {\n${light.trim()}\n}`)
    if (dark.trim())  parts.push(`.dark {\n${dark.trim()}\n}`)
    el.textContent = parts.join('\n')
}

/** Appelé une fois au démarrage pour réappliquer le thème sauvegardé */
export function initCustomTheme() {
    const light = localStorage.getItem(STORAGE_LIGHT) || ''
    const dark  = localStorage.getItem(STORAGE_DARK)  || ''
    if (light || dark) applyCustomTheme(light, dark)
}

interface Props {
    open: boolean
    onClose: () => void
}

export function ThemeCustomModal({ open, onClose }: Props) {
    const [light, setLight] = useState('')
    const [dark,  setDark]  = useState('')

    useEffect(() => {
        if (open) {
            setLight(localStorage.getItem(STORAGE_LIGHT) || '')
            setDark(localStorage.getItem(STORAGE_DARK)   || '')
        }
    }, [open])

    function handleSave() {
        localStorage.setItem(STORAGE_LIGHT, light)
        localStorage.setItem(STORAGE_DARK, dark)
        applyCustomTheme(light, dark)
        onClose()
    }

    function handleReset() {
        setLight('')
        setDark('')
        localStorage.removeItem(STORAGE_LIGHT)
        localStorage.removeItem(STORAGE_DARK)
        applyCustomTheme('', '')
    }

    const hasCustom = !!(light.trim() || dark.trim())

    return (
        <Dialog open={open} onOpenChange={open => !open && onClose()}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="palette" size={20} />
                        Personnalisation du thème
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <p className="text-muted-foreground">
                        Collez des variables CSS pour surcharger les couleurs du thème.
                        Laissez vide pour utiliser le thème par défaut.
                    </p>

                    <div className="flex gap-2 text-xs text-muted-foreground flex-wrap">
                        <span>Références :</span>
                        <a
                            href="https://sqlrooms.org/theming.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground"
                        >
                            sqlrooms/theming
                        </a>
                        <span>·</span>
                        <a
                            href="https://ui.shadcn.com/themes#themes"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground"
                        >
                            shadcn/ui themes
                        </a>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">☀️ Mode clair</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 262.1 83.3% 57.8%;\n--background: 0 0% 100%;\n--foreground: 240 10% 3.9%;\n..."}
                                value={light}
                                onChange={e => setLight(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">🌙 Mode sombre</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 263.4 70% 50.4%;\n--background: 224 71.4% 4.1%;\n--foreground: 210 20% 98%;\n..."}
                                value={dark}
                                onChange={e => setDark(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    {hasCustom && (
                        <Button variant="ghost" size="sm" onClick={handleReset} className="mr-auto text-destructive hover:text-destructive">
                            Réinitialiser
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={onClose}>Annuler</Button>
                    <Button size="sm" onClick={handleSave}>Appliquer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
