import { defineConfig } from 'vite'

export default defineConfig({
  // Base relative pour que les assets fonctionnent en standalone (file://)
  base: './',

  build: {
    outDir: 'dist',
    // Pas de minification agressive pour faciliter le debug Phase 1
    sourcemap: true,
  },

  // COOP uniquement — pas de COEP.
  // COEP (require-corp ou credentialless) activerait crossOriginIsolated, ce qui
  // hériterait dans les iframes créées via doc.write() et forcerait le chargement
  // des ressources imbriquées (Carto, OpenStreetMap…) sans cookies → erreur auth.
  // DuckDB WASM fonctionne sans SharedArrayBuffer grâce au bundle MVP (single-thread).
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },

  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
})
