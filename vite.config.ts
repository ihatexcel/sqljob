import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  // Base relative pour que les assets fonctionnent en standalone (file://)
  base: './',

  // antlr4ts (dep of @malloydata/malloy) uses Node's `util` module pour
  // util.inspect.custom — pre-bundling forces esbuild to resolve it via the
  // browser-compatible `util` shim.
  optimizeDeps: {
    include: ['antlr4ts'],
    esbuildOptions: {
      define: { 'process.env.NODE_ENV': '"production"' },
    },
  },
  resolve: {
    alias: [
      // @malloydata/malloy-real → package réel (pour briser la circularité dans le shim)
      {
        find: '@malloydata/malloy-real',
        replacement: path.resolve(__dirname, 'node_modules/@malloydata/malloy/dist/index.js'),
      },
      // @malloydata/malloy/connection → sous-chemin réel (doit être AVANT l'alias malloy)
      {
        find: '@malloydata/malloy/connection',
        replacement: path.resolve(__dirname, 'node_modules/@malloydata/malloy/dist/connection/index.js'),
      },
      // @malloydata/malloy → shim qui ajoute l'export Segment manquant
      // (requis par @malloydata/query-composer@0.0.269)
      // Regex pour éviter de matcher @malloydata/malloy-interfaces, @malloydata/malloy-filter, etc.
      {
        find: /^@malloydata\/malloy$/,
        replacement: path.resolve(__dirname, 'src/shims/malloy-with-segment.ts'),
      },
      // @malloydata/render/webcomponent → stub vide
      // (@malloydata/render@0.0.362 a supprimé ce sous-chemin)
      {
        find: '@malloydata/render/webcomponent',
        replacement: path.resolve(__dirname, 'src/shims/malloy-render-webcomponent.ts'),
      },
      // util → shim browser-compatible
      { find: 'util', replacement: 'util/' },
    ],
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
