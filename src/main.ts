// @ts-nocheck
import { registerAlpineStores } from './app/alpineStores'
import { mountApp } from './app/mount'

// Enregistre les stores Alpine (templateModal, etc.) avant qu'Alpine démarre
registerAlpineStores();

// Montage SPA : Alpine est chargé depuis CDN dans index.html (defer),
// il sera disponible via window.Alpine au moment où Alpine.initTree() est appelé.
(async function main() {
    const container = document.getElementById('app-container');
    if (container) await mountApp(container);
})();
