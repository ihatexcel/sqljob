import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base relative pour que les assets fonctionnent en standalone (file://)
  base: './',

  // antlr4ts (dep of @malloydata/malloy) uses Node's `util` module for
  // util.inspect.custom — pre-bundling forces esbuild to resolve it via the
  // browser-compatible `util` shim.
  optimizeDeps: {
    include: ['antlr4ts'],
    esbuildOptions: {
      define: { 'process.env.NODE_ENV': '"production"' },
    },
  },
  resolve: {
    alias: { util: 'util/' },
  },

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
