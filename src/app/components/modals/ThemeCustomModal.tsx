// @ts-nocheck
import { useState, useEffect } from 'react'
import {
    Button,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Separator,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@sqlrooms/ui'
import { Icon } from '../../../lib/icons'

const STORAGE_LIGHT   = 'sqljob-custom-theme-light'
const STORAGE_DARK    = 'sqljob-custom-theme-dark'
const STORAGE_PRESET  = 'sqljob-custom-theme-preset'
const STYLE_ID        = 'sqljob-custom-theme'

// ─── Presets ──────────────────────────────────────────────────────────────────
// Variables CSS (contenu des règles :root / .dark, sans le sélecteur)
// Format : "  --variable: H S% L%;\n  --autre: …"

const PRESETS: { id: string; label: string; emoji: string; light: string; dark: string }[] = [
    {
        id: 'default',
        label: 'Défaut',
        emoji: '⚪',
        light: '',
        dark: '',
    },
    {
        id: 'valentine',
        label: 'Valentine',
        emoji: '🌸',
        light: `  --background: 333 100% 97%;
  --foreground: 328 73% 22%;
  --card: 333 100% 97%;
  --card-foreground: 328 73% 22%;
  --popover: 0 0% 100%;
  --popover-foreground: 328 73% 22%;
  --primary: 339 79% 62%;
  --primary-foreground: 0 0% 100%;
  --secondary: 325 80% 88%;
  --secondary-foreground: 328 73% 22%;
  --muted: 333 60% 92%;
  --muted-foreground: 328 35% 50%;
  --accent: 350 89% 80%;
  --accent-foreground: 328 73% 22%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 333 50% 87%;
  --input: 333 50% 87%;
  --ring: 339 79% 62%;`,
        dark: `  --background: 330 25% 10%;
  --foreground: 330 80% 90%;
  --card: 330 25% 13%;
  --card-foreground: 330 80% 90%;
  --popover: 330 25% 10%;
  --popover-foreground: 330 80% 90%;
  --primary: 339 75% 65%;
  --primary-foreground: 0 0% 100%;
  --secondary: 325 35% 28%;
  --secondary-foreground: 330 80% 90%;
  --muted: 330 18% 18%;
  --muted-foreground: 330 35% 62%;
  --accent: 350 55% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 63% 40%;
  --destructive-foreground: 0 0% 98%;
  --border: 330 18% 22%;
  --input: 330 18% 22%;
  --ring: 339 75% 65%;`,
    },
    {
        id: 'synthwave',
        label: 'Synthwave',
        emoji: '🌆',
        light: `  --background: 264 30% 95%;
  --foreground: 264 50% 15%;
  --card: 0 0% 100%;
  --card-foreground: 264 50% 15%;
  --popover: 0 0% 100%;
  --popover-foreground: 264 50% 15%;
  --primary: 300 85% 55%;
  --primary-foreground: 0 0% 100%;
  --secondary: 196 90% 50%;
  --secondary-foreground: 264 50% 15%;
  --muted: 264 20% 88%;
  --muted-foreground: 264 25% 42%;
  --accent: 55 95% 50%;
  --accent-foreground: 264 50% 15%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 264 20% 82%;
  --input: 264 20% 82%;
  --ring: 300 85% 55%;`,
        dark: `  --background: 264 28% 10%;
  --foreground: 300 8% 90%;
  --card: 264 28% 13%;
  --card-foreground: 300 8% 90%;
  --popover: 264 28% 10%;
  --popover-foreground: 300 8% 90%;
  --primary: 300 100% 60%;
  --primary-foreground: 264 28% 10%;
  --secondary: 196 100% 45%;
  --secondary-foreground: 264 28% 10%;
  --muted: 264 20% 18%;
  --muted-foreground: 300 8% 58%;
  --accent: 55 100% 50%;
  --accent-foreground: 264 28% 10%;
  --destructive: 0 63% 45%;
  --destructive-foreground: 0 0% 98%;
  --border: 264 20% 25%;
  --input: 264 20% 25%;
  --ring: 300 100% 60%;`,
    },
    {
        id: 'emerald',
        label: 'Emerald',
        emoji: '💚',
        light: `  --background: 0 0% 100%;
  --foreground: 170 50% 15%;
  --card: 0 0% 100%;
  --card-foreground: 170 50% 15%;
  --popover: 0 0% 100%;
  --popover-foreground: 170 50% 15%;
  --primary: 160 84% 39%;
  --primary-foreground: 0 0% 100%;
  --secondary: 156 55% 75%;
  --secondary-foreground: 170 50% 15%;
  --muted: 160 18% 93%;
  --muted-foreground: 170 25% 40%;
  --accent: 155 60% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 160 18% 85%;
  --input: 160 18% 85%;
  --ring: 160 84% 39%;`,
        dark: `  --background: 170 28% 8%;
  --foreground: 160 18% 92%;
  --card: 170 28% 11%;
  --card-foreground: 160 18% 92%;
  --popover: 170 28% 8%;
  --popover-foreground: 160 18% 92%;
  --primary: 160 84% 45%;
  --primary-foreground: 170 28% 8%;
  --secondary: 156 38% 22%;
  --secondary-foreground: 160 18% 92%;
  --muted: 170 18% 15%;
  --muted-foreground: 160 14% 58%;
  --accent: 155 60% 35%;
  --accent-foreground: 160 18% 92%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 98%;
  --border: 170 18% 18%;
  --input: 170 18% 18%;
  --ring: 160 84% 45%;`,
    },
    {
        id: 'nord',
        label: 'Nord',
        emoji: '🏔️',
        light: `  --background: 220 26% 97%;
  --foreground: 220 16% 22%;
  --card: 0 0% 100%;
  --card-foreground: 220 16% 22%;
  --popover: 0 0% 100%;
  --popover-foreground: 220 16% 22%;
  --primary: 213 32% 52%;
  --primary-foreground: 0 0% 100%;
  --secondary: 193 43% 67%;
  --secondary-foreground: 220 16% 22%;
  --muted: 220 16% 90%;
  --muted-foreground: 220 10% 45%;
  --accent: 178 26% 55%;
  --accent-foreground: 0 0% 100%;
  --destructive: 354 42% 56%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 12% 83%;
  --input: 220 12% 83%;
  --ring: 213 32% 52%;`,
        dark: `  --background: 220 16% 22%;
  --foreground: 220 26% 92%;
  --card: 220 16% 26%;
  --card-foreground: 220 26% 92%;
  --popover: 220 16% 22%;
  --popover-foreground: 220 26% 92%;
  --primary: 213 32% 62%;
  --primary-foreground: 220 16% 22%;
  --secondary: 220 16% 30%;
  --secondary-foreground: 220 26% 92%;
  --muted: 220 14% 28%;
  --muted-foreground: 220 12% 62%;
  --accent: 178 26% 45%;
  --accent-foreground: 220 26% 92%;
  --destructive: 354 42% 50%;
  --destructive-foreground: 0 0% 100%;
  --border: 220 12% 32%;
  --input: 220 12% 32%;
  --ring: 213 32% 62%;`,
    },
    {
        id: 'autumn',
        label: 'Autumn',
        emoji: '🍂',
        light: `  --background: 30 100% 97%;
  --foreground: 20 60% 18%;
  --card: 30 100% 97%;
  --card-foreground: 20 60% 18%;
  --popover: 0 0% 100%;
  --popover-foreground: 20 60% 18%;
  --primary: 24 100% 38%;
  --primary-foreground: 0 0% 100%;
  --secondary: 15 75% 58%;
  --secondary-foreground: 20 60% 18%;
  --muted: 30 45% 90%;
  --muted-foreground: 20 35% 43%;
  --accent: 45 95% 45%;
  --accent-foreground: 20 60% 18%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 30 38% 82%;
  --input: 30 38% 82%;
  --ring: 24 100% 38%;`,
        dark: `  --background: 20 28% 10%;
  --foreground: 30 45% 87%;
  --card: 20 28% 13%;
  --card-foreground: 30 45% 87%;
  --popover: 20 28% 10%;
  --popover-foreground: 30 45% 87%;
  --primary: 24 100% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 15 50% 28%;
  --secondary-foreground: 30 45% 87%;
  --muted: 20 18% 17%;
  --muted-foreground: 30 25% 55%;
  --accent: 45 75% 40%;
  --accent-foreground: 20 28% 10%;
  --destructive: 0 63% 35%;
  --destructive-foreground: 0 0% 98%;
  --border: 20 18% 22%;
  --input: 20 18% 22%;
  --ring: 24 100% 50%;`,
    },
    {
        id: 'dracula',
        label: 'Dracula',
        emoji: '🧛',
        light: `  --background: 231 14% 95%;
  --foreground: 231 14% 20%;
  --card: 0 0% 100%;
  --card-foreground: 231 14% 20%;
  --popover: 0 0% 100%;
  --popover-foreground: 231 14% 20%;
  --primary: 265 80% 58%;
  --primary-foreground: 0 0% 100%;
  --secondary: 231 13% 83%;
  --secondary-foreground: 231 14% 20%;
  --muted: 231 13% 88%;
  --muted-foreground: 225 18% 43%;
  --accent: 135 55% 42%;
  --accent-foreground: 0 0% 100%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 231 12% 82%;
  --input: 231 12% 82%;
  --ring: 265 80% 58%;`,
        dark: `  --background: 231 15% 18%;
  --foreground: 60 28% 95%;
  --card: 231 15% 21%;
  --card-foreground: 60 28% 95%;
  --popover: 231 15% 18%;
  --popover-foreground: 60 28% 95%;
  --primary: 265 89% 78%;
  --primary-foreground: 231 15% 18%;
  --secondary: 231 13% 26%;
  --secondary-foreground: 60 28% 95%;
  --muted: 231 13% 23%;
  --muted-foreground: 225 25% 62%;
  --accent: 135 94% 65%;
  --accent-foreground: 231 15% 18%;
  --destructive: 0 100% 67%;
  --destructive-foreground: 231 15% 18%;
  --border: 231 12% 28%;
  --input: 231 12% 28%;
  --ring: 265 89% 78%;`,
    },
    {
        id: 'coffee',
        label: 'Coffee',
        emoji: '☕',
        light: `  --background: 30 14% 92%;
  --foreground: 30 20% 15%;
  --card: 30 14% 92%;
  --card-foreground: 30 20% 15%;
  --popover: 30 14% 95%;
  --popover-foreground: 30 20% 15%;
  --primary: 25 35% 38%;
  --primary-foreground: 30 14% 92%;
  --secondary: 20 22% 55%;
  --secondary-foreground: 30 20% 15%;
  --muted: 30 10% 85%;
  --muted-foreground: 30 14% 40%;
  --accent: 15 45% 46%;
  --accent-foreground: 30 14% 92%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 30 10% 78%;
  --input: 30 10% 78%;
  --ring: 25 35% 38%;`,
        dark: `  --background: 25 18% 12%;
  --foreground: 30 22% 85%;
  --card: 25 18% 15%;
  --card-foreground: 30 22% 85%;
  --popover: 25 18% 12%;
  --popover-foreground: 30 22% 85%;
  --primary: 25 38% 55%;
  --primary-foreground: 25 18% 12%;
  --secondary: 20 18% 22%;
  --secondary-foreground: 30 22% 85%;
  --muted: 25 13% 18%;
  --muted-foreground: 30 16% 53%;
  --accent: 15 40% 45%;
  --accent-foreground: 30 22% 85%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 98%;
  --border: 25 12% 22%;
  --input: 25 12% 22%;
  --ring: 25 38% 55%;`,
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Modal ────────────────────────────────────────────────────────────────────

interface Props {
    open: boolean
    onClose: () => void
}

export function ThemeCustomModal({ open, onClose }: Props) {
    const [preset, setPreset] = useState('custom')
    const [light, setLight]   = useState('')
    const [dark, setDark]     = useState('')

    useEffect(() => {
        if (!open) return
        const savedLight  = localStorage.getItem(STORAGE_LIGHT) || ''
        const savedDark   = localStorage.getItem(STORAGE_DARK)  || ''
        const savedPreset = localStorage.getItem(STORAGE_PRESET) || 'custom'
        setLight(savedLight)
        setDark(savedDark)
        setPreset(savedPreset)
    }, [open])

    function handleSelectPreset(id: string) {
        setPreset(id)
        const found = PRESETS.find(p => p.id === id)
        if (found) {
            setLight(found.light)
            setDark(found.dark)
        }
    }

    function handleLightChange(val: string) {
        setLight(val)
        setPreset('custom')
    }

    function handleDarkChange(val: string) {
        setDark(val)
        setPreset('custom')
    }

    function handleSave() {
        localStorage.setItem(STORAGE_LIGHT, light)
        localStorage.setItem(STORAGE_DARK, dark)
        localStorage.setItem(STORAGE_PRESET, preset)
        applyCustomTheme(light, dark)
        onClose()
    }

    function handleReset() {
        setLight('')
        setDark('')
        setPreset('default')
        localStorage.removeItem(STORAGE_LIGHT)
        localStorage.removeItem(STORAGE_DARK)
        localStorage.removeItem(STORAGE_PRESET)
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
                    {/* Sélecteur de preset */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Thème prédéfini</label>
                        <Select value={preset} onValueChange={handleSelectPreset}>
                            <SelectTrigger className="h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PRESETS.map(p => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.emoji} {p.label}
                                    </SelectItem>
                                ))}
                                <SelectItem value="custom">✏️ Personnalisé</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <p className="text-muted-foreground text-xs">
                        Variables CSS surchargeant le thème.{' '}
                        <a href="https://ui.shadcn.com/themes#themes" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                            Référence shadcn/ui
                        </a>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">☀️ Mode clair</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 262.1 83.3% 57.8%;\n--background: 0 0% 100%;\n--foreground: 240 10% 3.9%;\n..."}
                                value={light}
                                onChange={e => handleLightChange(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">🌙 Mode sombre</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 263.4 70% 50.4%;\n--background: 224 71.4% 4.1%;\n--foreground: 210 20% 98%;\n..."}
                                value={dark}
                                onChange={e => handleDarkChange(e.target.value)}
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
