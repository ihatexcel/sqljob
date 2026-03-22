// @ts-nocheck
import { useState, useEffect } from 'react'
import {
    Button,
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
    Separator,
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@sqlrooms/ui'
import { Icon } from '../../../lib/icons'

// ─── Storage keys (exportés pour exportSlice) ─────────────────────────────────
export const STORAGE_LIGHT  = 'sqljob-custom-theme-light'
export const STORAGE_DARK   = 'sqljob-custom-theme-dark'
export const STORAGE_PRESET = 'sqljob-custom-theme-preset'
const STYLE_ID = 'sqljob-custom-theme'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function css(vars: Record<string, string>): string {
    return Object.entries(vars).map(([k, v]) => `  --${k}: ${v};`).join('\n')
}

export function applyCustomTheme(light: string, dark: string) {
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

/** Réapplique le thème sauvegardé au démarrage */
export function initCustomTheme() {
    const light = localStorage.getItem(STORAGE_LIGHT) || ''
    const dark  = localStorage.getItem(STORAGE_DARK)  || ''
    if (light || dark) applyCustomTheme(light, dark)
}

/**
 * Applique le thème (preset nommé, custom ou default) depuis un objet config.ui.
 * Appelé à l'init (buildInitialState) ET à l'import (applyImportedConfig).
 */
export function applyThemeFromConfig(ui: any) {
    const preset = ui?.theme
    if (!preset || preset === 'light' || preset === 'dark') return  // compat backward : géré séparément
    if (preset === 'default') {
        localStorage.removeItem(STORAGE_LIGHT)
        localStorage.removeItem(STORAGE_DARK)
        localStorage.removeItem(STORAGE_PRESET)
        applyCustomTheme('', '')
    } else if (preset === 'custom') {
        const l = ui?.customThemeLight || ''
        const d = ui?.customThemeDark  || ''
        localStorage.setItem(STORAGE_LIGHT, l)
        localStorage.setItem(STORAGE_DARK,  d)
        localStorage.setItem(STORAGE_PRESET, 'custom')
        applyCustomTheme(l, d)
    } else {
        // Preset nommé — PRESETS[] est toujours chargé avant l'appel (modules ES)
        const found = PRESETS.find((p: any) => p.id === preset)
        if (found) {
            localStorage.setItem(STORAGE_LIGHT, found.light)
            localStorage.setItem(STORAGE_DARK,  found.dark)
            localStorage.setItem(STORAGE_PRESET, found.id)
            applyCustomTheme(found.light, found.dark)
        }
    }
}

// ─── Définition des thèmes ────────────────────────────────────────────────────

type ThemePreset = { id: string; label: string; emoji: string; light: string; dark: string }

const T = (light: Record<string,string>, dark: Record<string,string>) =>
    ({ light: css(light), dark: css(dark) })

/* Shorthands pour les blocs standard */
function base(bg: string, fg: string, card?: string) {
    return {
        background: bg,
        foreground: fg,
        card: card ?? bg,
        'card-foreground': fg,
        popover: card ?? bg,
        'popover-foreground': fg,
    }
}
function palette(primary: string, primaryFg: string, secondary: string, secondaryFg: string, accent: string, accentFg: string) {
    return { primary, 'primary-foreground': primaryFg, secondary, 'secondary-foreground': secondaryFg, accent, 'accent-foreground': accentFg }
}
function borders(border: string, ring: string, destructive = '0 84% 60%', destructiveFg = '0 0% 100%') {
    return { border, input: border, ring, destructive, 'destructive-foreground': destructiveFg }
}
function muted(muted: string, mutedFg: string) {
    return { muted, 'muted-foreground': mutedFg }
}

export const PRESETS: ThemePreset[] = [
    {
        id: 'default', label: 'Défaut', emoji: '⬜',
        light: '', dark: '',
    },
    // ── Thèmes clairs ──────────────────────────────────────────────────────────
    {
        id: 'cupcake', label: 'Cupcake', emoji: '🧁',
        ...T(
            { ...base('342 30% 98%', '15 25% 18%', '0 0% 100%'), ...palette('183 47% 47%','0 0% 100%','338 72% 77%','15 25% 18%','40 66% 54%','0 0% 100%'), ...muted('342 20% 93%','15 18% 42%'), ...borders('342 18% 86%','183 47% 47%') },
            { ...base('183 25% 12%', '183 15% 85%'), ...palette('183 47% 55%','183 25% 12%','338 50% 45%','183 15% 85%','40 60% 45%','183 25% 12%'), ...muted('183 18% 18%','183 12% 55%'), ...borders('183 18% 22%','183 47% 55%') }
        ),
    },
    {
        id: 'bumblebee', label: 'Bumblebee', emoji: '🐝',
        ...T(
            { ...base('0 0% 100%', '20 14% 15%', '0 0% 100%'), ...palette('41 96% 50%','20 14% 15%','41 100% 38%','0 0% 100%','41 90% 33%','0 0% 100%'), ...muted('41 50% 94%','20 12% 42%'), ...borders('41 30% 88%','41 96% 50%') },
            { ...base('30 20% 10%', '41 30% 88%'), ...palette('41 96% 55%','30 20% 10%','41 70% 32%','41 30% 88%','41 90% 45%','30 20% 10%'), ...muted('30 15% 16%','41 20% 55%'), ...borders('30 15% 20%','41 96% 55%') }
        ),
    },
    {
        id: 'emerald', label: 'Emerald', emoji: '💚',
        ...T(
            { ...base('0 0% 100%', '170 50% 15%', '0 0% 100%'), ...palette('160 84% 39%','0 0% 100%','156 55% 75%','170 50% 15%','155 60% 42%','0 0% 100%'), ...muted('160 18% 93%','170 25% 40%'), ...borders('160 18% 85%','160 84% 39%') },
            { ...base('170 28% 8%', '160 18% 92%'), ...palette('160 84% 45%','170 28% 8%','156 38% 22%','160 18% 92%','155 60% 35%','160 18% 92%'), ...muted('170 18% 15%','160 14% 58%'), ...borders('170 18% 18%','160 84% 45%') }
        ),
    },
    {
        id: 'corporate', label: 'Corporate', emoji: '🏢',
        ...T(
            { ...base('0 0% 100%', '215 25% 15%', '0 0% 100%'), ...palette('215 96% 32%','0 0% 100%','215 35% 50%','0 0% 100%','215 75% 50%','0 0% 100%'), ...muted('215 15% 93%','215 15% 42%'), ...borders('215 12% 86%','215 96% 32%') },
            { ...base('215 30% 10%', '215 15% 87%'), ...palette('215 70% 58%','215 30% 10%','215 30% 28%','215 15% 87%','215 70% 55%','215 30% 10%'), ...muted('215 22% 16%','215 12% 55%'), ...borders('215 20% 20%','215 70% 58%') }
        ),
    },
    {
        id: 'retro', label: 'Retro', emoji: '📻',
        ...T(
            { ...base('45 47% 80%', '345 14% 10%', '45 40% 75%'), ...palette('3 74% 66%','345 14% 10%','145 27% 62%','345 14% 10%','49 67% 68%','345 14% 10%'), ...muted('45 30% 72%','345 12% 38%'), ...borders('45 25% 65%','3 74% 66%') },
            { ...base('345 20% 12%', '45 35% 82%'), ...palette('3 74% 60%','345 20% 12%','145 35% 35%','45 35% 82%','49 67% 55%','345 20% 12%'), ...muted('345 14% 18%','45 22% 52%'), ...borders('345 14% 22%','3 74% 60%') }
        ),
    },
    {
        id: 'cyberpunk', label: 'Cyberpunk', emoji: '🤖',
        ...T(
            { ...base('55 100% 96%', '245 70% 10%', '0 0% 100%'), ...palette('55 100% 50%','245 70% 10%','294 100% 63%','245 70% 10%','178 100% 50%','245 70% 10%'), ...muted('55 60% 90%','245 40% 38%'), ...borders('55 50% 82%','55 100% 50%') },
            { ...base('245 50% 8%', '55 80% 88%'), ...palette('55 100% 55%','245 50% 8%','294 100% 58%','245 50% 8%','178 100% 45%','245 50% 8%'), ...muted('245 35% 14%','55 50% 55%'), ...borders('245 30% 18%','55 100% 55%') }
        ),
    },
    {
        id: 'valentine', label: 'Valentine', emoji: '🌸',
        ...T(
            { ...base('333 100% 97%', '328 73% 22%', '0 0% 100%'), ...palette('339 79% 62%','0 0% 100%','325 80% 88%','328 73% 22%','350 89% 80%','328 73% 22%'), ...muted('333 60% 92%','328 35% 50%'), ...borders('333 50% 87%','339 79% 62%') },
            { ...base('330 25% 10%', '330 80% 90%'), ...palette('339 75% 65%','0 0% 100%','325 35% 28%','330 80% 90%','350 55% 42%','0 0% 100%'), ...muted('330 18% 18%','330 35% 62%'), ...borders('330 18% 22%','339 75% 65%') }
        ),
    },
    {
        id: 'garden', label: 'Garden', emoji: '🌷',
        ...T(
            { ...base('0 0% 98%', '0 0% 13%', '0 0% 100%'), ...palette('352 90% 55%','0 0% 100%','119 36% 43%','0 0% 100%','41 82% 50%','0 0% 100%'), ...muted('352 20% 93%','0 0% 38%'), ...borders('352 15% 86%','352 90% 55%') },
            { ...base('352 25% 10%', '0 0% 88%'), ...palette('352 90% 60%','352 25% 10%','119 40% 28%','0 0% 88%','41 82% 45%','352 25% 10%'), ...muted('352 18% 16%','0 0% 55%'), ...borders('352 15% 20%','352 90% 60%') }
        ),
    },
    {
        id: 'aqua', label: 'Aqua', emoji: '🌊',
        ...T(
            { ...base('220 40% 96%', '220 35% 15%', '0 0% 100%'), ...palette('200 100% 40%','0 0% 100%','170 80% 45%','0 0% 100%','55 90% 50%','220 35% 15%'), ...muted('220 25% 90%','220 25% 40%'), ...borders('220 20% 83%','200 100% 40%') },
            { ...base('200 40% 9%', '200 25% 88%'), ...palette('200 100% 50%','200 40% 9%','170 70% 35%','200 25% 88%','55 90% 45%','200 40% 9%'), ...muted('200 28% 15%','200 18% 55%'), ...borders('200 25% 18%','200 100% 50%') }
        ),
    },
    {
        id: 'lofi', label: 'Lo-Fi', emoji: '🎵',
        ...T(
            { ...base('0 0% 100%', '0 0% 0%', '0 0% 100%'), ...palette('0 0% 13%','0 0% 100%','0 0% 35%','0 0% 100%','0 0% 50%','0 0% 100%'), ...muted('0 0% 93%','0 0% 38%'), ...borders('0 0% 85%','0 0% 13%') },
            { ...base('0 0% 8%', '0 0% 92%'), ...palette('0 0% 78%','0 0% 8%','0 0% 55%','0 0% 92%','0 0% 40%','0 0% 92%'), ...muted('0 0% 14%','0 0% 55%'), ...borders('0 0% 18%','0 0% 78%') }
        ),
    },
    {
        id: 'pastel', label: 'Pastel', emoji: '🎨',
        ...T(
            { ...base('0 0% 100%', '220 10% 20%', '0 0% 100%'), ...palette('330 65% 75%','220 10% 20%','200 60% 75%','220 10% 20%','145 50% 70%','220 10% 20%'), ...muted('0 0% 93%','220 8% 42%'), ...borders('0 0% 85%','330 65% 75%') },
            { ...base('220 15% 12%', '220 10% 88%'), ...palette('330 55% 65%','220 15% 12%','200 50% 55%','220 10% 88%','145 45% 50%','220 15% 12%'), ...muted('220 12% 18%','220 8% 55%'), ...borders('220 12% 22%','330 55% 65%') }
        ),
    },
    {
        id: 'fantasy', label: 'Fantasy', emoji: '🧙',
        ...T(
            { ...base('0 0% 100%', '265 25% 15%', '0 0% 100%'), ...palette('265 80% 55%','0 0% 100%','316 60% 47%','0 0% 100%','35 80% 55%','0 0% 100%'), ...muted('265 15% 93%','265 15% 42%'), ...borders('265 12% 86%','265 80% 55%') },
            { ...base('265 30% 10%', '265 15% 88%'), ...palette('265 70% 65%','265 30% 10%','316 50% 38%','265 15% 88%','35 80% 50%','265 30% 10%'), ...muted('265 22% 16%','265 12% 55%'), ...borders('265 20% 20%','265 70% 65%') }
        ),
    },
    {
        id: 'wireframe', label: 'Wireframe', emoji: '📐',
        ...T(
            { ...base('0 0% 100%', '0 0% 0%', '0 0% 98%'), ...palette('0 0% 18%','0 0% 100%','0 0% 40%','0 0% 100%','0 0% 60%','0 0% 100%'), ...muted('0 0% 92%','0 0% 38%'), ...borders('0 0% 78%','0 0% 18%') },
            { ...base('0 0% 10%', '0 0% 90%'), ...palette('0 0% 80%','0 0% 10%','0 0% 55%','0 0% 90%','0 0% 40%','0 0% 90%'), ...muted('0 0% 16%','0 0% 55%'), ...borders('0 0% 20%','0 0% 80%') }
        ),
    },
    {
        id: 'cmyk', label: 'CMYK', emoji: '🖨️',
        ...T(
            { ...base('0 0% 100%', '0 0% 0%', '0 0% 100%'), ...palette('192 100% 44%','0 0% 0%','306 100% 40%','0 0% 100%','55 100% 50%','0 0% 0%'), ...muted('192 30% 93%','0 0% 38%'), ...borders('0 0% 85%','192 100% 44%') },
            { ...base('192 30% 9%', '0 0% 90%'), ...palette('192 100% 50%','192 30% 9%','306 80% 50%','0 0% 90%','55 100% 45%','192 30% 9%'), ...muted('192 22% 15%','0 0% 55%'), ...borders('192 20% 18%','192 100% 50%') }
        ),
    },
    {
        id: 'autumn', label: 'Autumn', emoji: '🍂',
        ...T(
            { ...base('30 100% 97%', '20 60% 18%', '0 0% 100%'), ...palette('24 100% 38%','0 0% 100%','15 75% 58%','20 60% 18%','45 95% 45%','20 60% 18%'), ...muted('30 45% 90%','20 35% 43%'), ...borders('30 38% 82%','24 100% 38%') },
            { ...base('20 28% 10%', '30 45% 87%'), ...palette('24 100% 50%','0 0% 100%','15 50% 28%','30 45% 87%','45 75% 40%','20 28% 10%'), ...muted('20 18% 17%','30 25% 55%'), ...borders('20 18% 22%','24 100% 50%') }
        ),
    },
    {
        id: 'business', label: 'Business', emoji: '💼',
        ...T(
            { ...base('0 0% 100%', '215 30% 12%', '0 0% 100%'), ...palette('215 96% 32%','0 0% 100%','215 40% 50%','0 0% 100%','30 80% 45%','0 0% 100%'), ...muted('215 12% 93%','215 18% 40%'), ...borders('215 10% 85%','215 96% 32%') },
            { ...base('215 30% 9%', '215 15% 87%'), ...palette('215 70% 50%','215 30% 9%','215 28% 28%','215 15% 87%','30 70% 40%','215 15% 87%'), ...muted('215 22% 15%','215 12% 55%'), ...borders('215 20% 18%','215 70% 50%') }
        ),
    },
    {
        id: 'acid', label: 'Acid', emoji: '🧪',
        ...T(
            { ...base('73 100% 95%', '300 50% 10%', '0 0% 100%'), ...palette('305 100% 50%','0 0% 100%','63 100% 50%','300 50% 10%','280 100% 70%','0 0% 100%'), ...muted('73 60% 88%','300 30% 38%'), ...borders('73 50% 80%','305 100% 50%') },
            { ...base('300 30% 8%', '73 80% 88%'), ...palette('305 100% 55%','300 30% 8%','63 100% 45%','73 80% 88%','280 90% 65%','300 30% 8%'), ...muted('300 22% 14%','73 40% 55%'), ...borders('300 20% 18%','305 100% 55%') }
        ),
    },
    {
        id: 'lemonade', label: 'Lemonade', emoji: '🍋',
        ...T(
            { ...base('75 100% 98%', '90 25% 12%', '0 0% 100%'), ...palette('75 80% 42%','0 0% 100%','75 60% 55%','90 25% 12%','75 50% 38%','0 0% 100%'), ...muted('75 55% 91%','90 18% 40%'), ...borders('75 40% 83%','75 80% 42%') },
            { ...base('90 25% 10%', '75 40% 88%'), ...palette('75 80% 48%','90 25% 10%','75 45% 30%','75 40% 88%','75 50% 42%','90 25% 10%'), ...muted('90 18% 15%','75 25% 55%'), ...borders('90 15% 18%','75 80% 48%') }
        ),
    },
    {
        id: 'winter', label: 'Winter', emoji: '❄️',
        ...T(
            { ...base('215 100% 98%', '217 25% 15%', '0 0% 100%'), ...palette('228 80% 58%','0 0% 100%','180 60% 45%','217 25% 15%','210 100% 52%','0 0% 100%'), ...muted('215 50% 92%','217 18% 42%'), ...borders('215 35% 84%','228 80% 58%') },
            { ...base('217 30% 11%', '215 25% 88%'), ...palette('228 70% 65%','217 30% 11%','180 50% 32%','215 25% 88%','210 85% 55%','217 30% 11%'), ...muted('217 22% 17%','215 15% 55%'), ...borders('217 18% 21%','228 70% 65%') }
        ),
    },
    {
        id: 'caramellatte', label: 'Caramellatte', emoji: '🍮',
        ...T(
            { ...base('36 40% 93%', '30 30% 18%', '36 35% 90%'), ...palette('30 60% 45%','36 40% 93%','30 40% 55%','30 30% 18%','45 70% 55%','30 30% 18%'), ...muted('36 28% 85%','30 20% 42%'), ...borders('36 22% 78%','30 60% 45%') },
            { ...base('25 22% 11%', '36 30% 85%'), ...palette('30 60% 52%','25 22% 11%','30 35% 28%','36 30% 85%','45 65% 45%','25 22% 11%'), ...muted('25 16% 17%','36 18% 53%'), ...borders('25 14% 21%','30 60% 52%') }
        ),
    },
    {
        id: 'silk', label: 'Silk', emoji: '🪡',
        ...T(
            { ...base('40 20% 96%', '350 15% 18%', '40 15% 93%'), ...palette('350 30% 48%','40 20% 96%','160 20% 55%','350 15% 18%','40 35% 60%','350 15% 18%'), ...muted('40 14% 88%','350 10% 42%'), ...borders('40 12% 80%','350 30% 48%') },
            { ...base('350 15% 10%', '40 15% 88%'), ...palette('350 35% 55%','350 15% 10%','160 18% 32%','40 15% 88%','40 35% 45%','40 15% 88%'), ...muted('350 12% 16%','40 10% 55%'), ...borders('350 10% 20%','350 35% 55%') }
        ),
    },
    // ── Thèmes sombres ─────────────────────────────────────────────────────────
    {
        id: 'dark', label: 'Dark', emoji: '🌑',
        ...T(
            { ...base('222 25% 94%', '222 25% 15%', '0 0% 100%'), ...palette('217 80% 52%','0 0% 100%','291 45% 55%','0 0% 100%','174 65% 48%','0 0% 100%'), ...muted('222 15% 87%','222 15% 40%'), ...borders('222 12% 80%','217 80% 52%') },
            { ...base('222 47% 11%', '220 15% 85%'), ...palette('217 92% 76%','222 47% 11%','291 48% 68%','222 47% 11%','174 75% 60%','222 47% 11%'), ...muted('222 35% 17%','220 15% 58%'), ...borders('222 35% 20%','217 92% 76%') }
        ),
    },
    {
        id: 'synthwave', label: 'Synthwave', emoji: '🌆',
        ...T(
            { ...base('264 30% 95%', '264 50% 15%', '0 0% 100%'), ...palette('300 85% 55%','0 0% 100%','196 90% 50%','264 50% 15%','55 95% 50%','264 50% 15%'), ...muted('264 20% 88%','264 25% 42%'), ...borders('264 20% 82%','300 85% 55%') },
            { ...base('264 28% 10%', '300 8% 90%'), ...palette('300 100% 60%','264 28% 10%','196 100% 45%','264 28% 10%','55 100% 50%','264 28% 10%'), ...muted('264 20% 18%','300 8% 58%'), ...borders('264 20% 25%','300 100% 60%') }
        ),
    },
    {
        id: 'halloween', label: 'Halloween', emoji: '🎃',
        ...T(
            { ...base('28 50% 96%', '0 0% 10%', '0 0% 100%'), ...palette('28 100% 45%','0 0% 100%','280 55% 45%','0 0% 100%','95 90% 42%','0 0% 100%'), ...muted('28 35% 88%','0 0% 38%'), ...borders('28 28% 80%','28 100% 45%') },
            { ...base('0 0% 9%', '0 0% 85%'), ...palette('28 100% 51%','0 0% 9%','280 65% 51%','0 0% 85%','95 97% 50%','0 0% 9%'), ...muted('0 0% 15%','0 0% 55%'), ...borders('0 0% 18%','28 100% 51%') }
        ),
    },
    {
        id: 'forest', label: 'Forest', emoji: '🌲',
        ...T(
            { ...base('141 25% 94%', '141 20% 12%', '0 0% 100%'), ...palette('141 72% 38%','0 0% 100%','141 45% 28%','0 0% 100%','41 80% 45%','0 0% 100%'), ...muted('141 15% 87%','141 15% 40%'), ...borders('141 12% 80%','141 72% 38%') },
            { ...base('0 0% 9%', '141 10% 82%'), ...palette('141 72% 42%','0 0% 9%','141 45% 32%','141 10% 82%','41 80% 50%','0 0% 9%'), ...muted('0 0% 15%','141 8% 52%'), ...borders('0 0% 18%','141 72% 42%') }
        ),
    },
    {
        id: 'black', label: 'Black', emoji: '⬛',
        ...T(
            { ...base('0 0% 97%', '0 0% 5%', '0 0% 100%'), ...palette('0 0% 15%','0 0% 100%','0 0% 35%','0 0% 100%','0 0% 55%','0 0% 100%'), ...muted('0 0% 90%','0 0% 35%'), ...borders('0 0% 80%','0 0% 15%') },
            { ...base('0 0% 0%', '0 0% 100%'), ...palette('0 0% 22%','0 0% 100%','0 0% 35%','0 0% 100%','0 0% 50%','0 0% 100%'), ...muted('0 0% 8%','0 0% 60%'), ...borders('0 0% 12%','0 0% 70%') }
        ),
    },
    {
        id: 'luxury', label: 'Luxury', emoji: '💎',
        ...T(
            { ...base('48 30% 96%', '48 15% 12%', '48 25% 92%'), ...palette('48 80% 42%','0 0% 100%','0 0% 55%','48 15% 12%','48 70% 45%','0 0% 100%'), ...muted('48 20% 88%','48 12% 40%'), ...borders('48 15% 80%','48 80% 42%') },
            { ...base('0 0% 8%', '48 10% 93%'), ...palette('48 96% 75%','0 0% 8%','0 0% 75%','0 0% 8%','48 70% 55%','0 0% 8%'), ...muted('0 0% 13%','48 8% 58%'), ...borders('0 0% 17%','48 96% 75%') }
        ),
    },
    {
        id: 'dracula', label: 'Dracula', emoji: '🧛',
        ...T(
            { ...base('231 14% 95%', '231 14% 20%', '0 0% 100%'), ...palette('265 80% 58%','0 0% 100%','231 13% 83%','231 14% 20%','135 55% 42%','0 0% 100%'), ...muted('231 13% 88%','225 18% 43%'), ...borders('231 12% 82%','265 80% 58%') },
            { ...base('231 15% 18%', '60 28% 95%'), ...palette('265 89% 78%','231 15% 18%','231 13% 26%','60 28% 95%','135 94% 65%','231 15% 18%'), ...muted('231 13% 23%','225 25% 62%'), ...borders('231 12% 28%','265 89% 78%') }
        ),
    },
    {
        id: 'night', label: 'Night', emoji: '🌙',
        ...T(
            { ...base('199 30% 94%', '199 25% 12%', '0 0% 100%'), ...palette('199 80% 45%','0 0% 100%','230 60% 60%','0 0% 100%','34 90% 48%','0 0% 100%'), ...muted('199 20% 87%','199 18% 40%'), ...borders('199 15% 80%','199 80% 45%') },
            { ...base('222 35% 14%', '199 20% 88%'), ...palette('199 89% 48%','222 35% 14%','230 70% 67%','222 35% 14%','34 100% 50%','222 35% 14%'), ...muted('222 25% 19%','199 15% 55%'), ...borders('222 22% 22%','199 89% 48%') }
        ),
    },
    {
        id: 'coffee', label: 'Coffee', emoji: '☕',
        ...T(
            { ...base('30 14% 92%', '30 20% 15%', '30 14% 95%'), ...palette('25 35% 38%','30 14% 92%','20 22% 55%','30 20% 15%','15 45% 46%','30 14% 92%'), ...muted('30 10% 85%','30 14% 40%'), ...borders('30 10% 78%','25 35% 38%') },
            { ...base('25 18% 12%', '30 22% 85%'), ...palette('25 38% 55%','25 18% 12%','20 18% 22%','30 22% 85%','15 40% 45%','30 22% 85%'), ...muted('25 13% 18%','30 16% 53%'), ...borders('25 12% 22%','25 38% 55%') }
        ),
    },
    {
        id: 'dim', label: 'Dim', emoji: '🌫️',
        ...T(
            { ...base('220 20% 94%', '220 14% 18%', '0 0% 100%'), ...palette('221 65% 52%','0 0% 100%','215 45% 55%','0 0% 100%','40 55% 48%','0 0% 100%'), ...muted('220 14% 87%','220 10% 42%'), ...borders('220 12% 80%','221 65% 52%') },
            { ...base('220 24% 18%', '220 15% 82%'), ...palette('221 65% 75%','220 24% 18%','215 45% 65%','220 24% 18%','40 55% 70%','220 24% 18%'), ...muted('220 18% 23%','220 12% 55%'), ...borders('220 16% 27%','221 65% 75%') }
        ),
    },
    {
        id: 'nord', label: 'Nord', emoji: '🏔️',
        ...T(
            { ...base('220 26% 97%', '220 16% 22%', '0 0% 100%'), ...palette('213 32% 52%','0 0% 100%','193 43% 67%','220 16% 22%','178 26% 55%','0 0% 100%'), ...muted('220 16% 90%','220 10% 45%'), ...borders('220 12% 83%','213 32% 52%') },
            { ...base('220 16% 22%', '220 26% 92%'), ...palette('213 32% 62%','220 16% 22%','220 16% 30%','220 26% 92%','178 26% 45%','220 26% 92%'), ...muted('220 14% 28%','220 12% 62%'), ...borders('220 12% 32%','213 32% 62%') }
        ),
    },
    {
        id: 'sunset', label: 'Sunset', emoji: '🌅',
        ...T(
            { ...base('340 60% 96%', '340 20% 12%', '0 0% 100%'), ...palette('340 80% 52%','0 0% 100%','25 90% 50%','0 0% 100%','50 90% 48%','340 20% 12%'), ...muted('340 35% 89%','340 15% 40%'), ...borders('340 25% 81%','340 80% 52%') },
            { ...base('340 30% 12%', '340 20% 88%'), ...palette('340 80% 58%','340 30% 12%','25 90% 55%','340 30% 12%','50 90% 52%','340 30% 12%'), ...muted('340 20% 18%','340 14% 55%'), ...borders('340 18% 22%','340 80% 58%') }
        ),
    },
    {
        id: 'abyss', label: 'Abyss', emoji: '🌊',
        ...T(
            { ...base('240 30% 95%', '240 20% 12%', '0 0% 100%'), ...palette('240 60% 52%','0 0% 100%','270 45% 50%','0 0% 100%','200 80% 50%','0 0% 100%'), ...muted('240 20% 88%','240 15% 40%'), ...borders('240 15% 80%','240 60% 52%') },
            { ...base('240 30% 8%', '240 20% 88%'), ...palette('240 60% 65%','240 30% 8%','270 50% 55%','240 20% 88%','200 80% 55%','240 30% 8%'), ...muted('240 22% 14%','240 14% 55%'), ...borders('240 18% 18%','240 60% 65%') }
        ),
    },
]

// ─── Logique de correspondance preset ─────────────────────────────────────────
function detectPreset(light: string, dark: string): string {
    if (!light.trim() && !dark.trim()) return 'default'
    const match = PRESETS.find(p => p.id !== 'default' && p.light === light && p.dark === dark)
    return match ? match.id : 'custom'
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface Props { open: boolean; onClose: () => void }

export function ThemeCustomModal({ open, onClose }: Props) {
    const [preset, setPreset] = useState('default')
    const [light, setLight]   = useState('')
    const [dark, setDark]     = useState('')

    useEffect(() => {
        if (!open) return
        const l = localStorage.getItem(STORAGE_LIGHT) || ''
        const d = localStorage.getItem(STORAGE_DARK)  || ''
        setLight(l)
        setDark(d)
        setPreset(detectPreset(l, d))
    }, [open])

    function handleSelectPreset(id: string) {
        const found = PRESETS.find(p => p.id === id)
        if (!found) return
        setPreset(id)
        setLight(found.light)
        setDark(found.dark)
    }

    function handleLightChange(val: string) {
        setLight(val)
        const d = dark
        if (val.trim() && d.trim()) setPreset('custom')
        else if (!val.trim() && !d.trim()) setPreset('default')
    }

    function handleDarkChange(val: string) {
        setDark(val)
        const l = light
        if (l.trim() && val.trim()) setPreset('custom')
        else if (!l.trim() && !val.trim()) setPreset('default')
    }

    function handleSave() {
        localStorage.setItem(STORAGE_LIGHT, light)
        localStorage.setItem(STORAGE_DARK, dark)
        localStorage.setItem(STORAGE_PRESET, preset)
        applyCustomTheme(light, dark)
        onClose()
    }

    function handleReset() {
        setLight(''); setDark(''); setPreset('default')
        localStorage.removeItem(STORAGE_LIGHT)
        localStorage.removeItem(STORAGE_DARK)
        localStorage.removeItem(STORAGE_PRESET)
        applyCustomTheme('', '')
    }

    const isCustom = preset === 'custom'
    const hasContent = !!(light.trim() || dark.trim())

    return (
        <Dialog open={open} onOpenChange={v => !v && onClose()}>
            <DialogContent aria-describedby={undefined} className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="palette" size={20} />
                        Personnalisation du thème
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Thème</label>
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
                                {isCustom && (
                                    <SelectItem value="custom">✏️ Personnalisé</SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <p className="text-muted-foreground text-xs">
                        Variables CSS surchargeant le thème (format HSL sans <code>hsl()</code>).{' '}
                        <a href="https://ui.shadcn.com/themes#themes" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
                            Référence shadcn/ui
                        </a>
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">☀️ Mode clair</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 262.1 83.3% 57.8%;\n--background: 0 0% 100%;\n--foreground: 240 10% 3.9%;"}
                                value={light}
                                onChange={e => handleLightChange(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-medium">🌙 Mode sombre</label>
                            <textarea
                                className="w-full h-48 text-xs font-mono rounded-md border border-border bg-background p-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder={"--primary: 263.4 70% 50.4%;\n--background: 224 71.4% 4.1%;\n--foreground: 210 20% 98%;"}
                                value={dark}
                                onChange={e => handleDarkChange(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    {hasContent && (
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
