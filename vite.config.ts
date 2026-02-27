import { defineConfig } from 'vite'

export default defineConfig({
  // Base relative pour que les assets fonctionnent en standalone (file://)
  base: './',

  build: {
    outDir: 'dist',
    // Pas de minification agressive pour faciliter le debug Phase 1
    sourcemap: true,
  },

  // Le serveur de dev sert aussi les workers DuckDB-WASM (COOP/COEP headers)
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },

  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
})
