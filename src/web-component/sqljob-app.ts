// @ts-nocheck
/**
 * Web Component CDN : <sqljob-app>
 *
 * Usage :
 *   <script src="sqljob.js" type="module"></script>
 *   <sqljob-app></sqljob-app>
 *
 * Alpine.js est bundlé dans ce fichier — aucune dépendance externe requise.
 * Le CSS (DaisyUI + Tailwind + styles custom) est injecté automatiquement
 * dans <head> par Vite au build.
 */
import Alpine from 'alpinejs'
import AlpineFocus from '@alpinejs/focus'
import AlpineCollapse from '@alpinejs/collapse'

import { registerAlpineStores } from '../app/alpineStores'
import { mountApp } from '../app/mount'

import './styles.css'

// ─── Initialisation Alpine (une seule fois, même si plusieurs <sqljob-app>) ──

let alpineStarted = false

function ensureAlpine() {
    if (alpineStarted) return
    alpineStarted = true

    // Si le host a déjà chargé Alpine, on l'utilise ; sinon on utilise le nôtre.
    if (!window.Alpine) {
        Alpine.plugin(AlpineFocus)
        Alpine.plugin(AlpineCollapse)
        registerAlpineStores()
        window.Alpine = Alpine
        Alpine.start()
    } else {
        // Alpine du host déjà présent : on enregistre quand même nos stores
        registerAlpineStores()
    }
}

// ─── Custom Element ────────────────────────────────────────────────────────────

class SQLJobApp extends HTMLElement {
    async connectedCallback() {
        // Appliquer data-theme et les classes body au document si pas déjà fait
        if (!document.body.classList.contains('font-sans')) {
            document.body.classList.add('min-h-screen', 'font-sans', 'bg-base-100', 'text-base-content', 'transition-colors', 'duration-200')
        }

        ensureAlpine()
        await mountApp(this)
    }
}

if (!customElements.get('sqljob-app')) {
    customElements.define('sqljob-app', SQLJobApp)
}
