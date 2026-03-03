// @ts-nocheck
/**
 * Web Component CDN : <sqljob-app>
 *
 * Usage :
 *   <script src="sqljob.js" type="module"></script>
 *   <sqljob-app></sqljob-app>
 *
 * React est bundlé dans ce fichier — aucune dépendance externe requise.
 * Le CSS (DaisyUI + Tailwind + styles custom) est injecté automatiquement
 * dans <head> par Vite au build.
 *
 * Utilise le light DOM (pas de Shadow DOM) pour que Tailwind / DaisyUI
 * s'appliquent normalement.
 */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '../app/App'
import './styles.css'

// URL absolue de ce fichier (import.meta.url) — utilisée par l'export HTML
// pour retrouver exactement le bon élément <script src> dans la page hôte.
window.__sqljobScriptUrl = import.meta.url

// Avertissement file:// : les iframes avec contenu externe (Carto, OSM…) échouent
// car l'origine null de file:// est exclue par CSP frame-ancestors et X-Frame-Options.
if (window.location.protocol === 'file:') {
    console.warn(
        '[sqljob] Page servie via file:// — les cellules iframe avec contenu externe ' +
        '(cartes, Carto, OpenStreetMap…) ne fonctionneront pas : origine null bloquée ' +
        'par les CSP des sites tiers.\n' +
        'Solution : servir via HTTP → npm run dev:cdn puis ouvrir http://localhost:5174/test-cdn.html'
    )
}

// ─── Custom Element ────────────────────────────────────────────────────────────

class SQLJobApp extends HTMLElement {
    private _root: ReturnType<typeof createRoot> | null = null

    connectedCallback() {
        // Appliquer les classes body si pas déjà fait
        if (!document.body.classList.contains('font-sans')) {
            document.body.classList.add(
                'min-h-screen', 'font-sans', 'bg-base-100',
                'text-base-content', 'transition-colors', 'duration-200'
            )
        }

        // Rendu React en light DOM : DaisyUI/Tailwind fonctionnent nativement
        this._root = createRoot(this)
        this._root.render(React.createElement(App))
    }

    disconnectedCallback() {
        this._root?.unmount()
        this._root = null
    }
}

if (!customElements.get('sqljob-app')) {
    customElements.define('sqljob-app', SQLJobApp)
}
