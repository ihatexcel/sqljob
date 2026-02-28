import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import cssInjectedByJs from 'vite-plugin-css-injected-by-js'

export default defineConfig({
    plugins: [
        tailwindcss(),
        // Injecte le CSS dans le JS → fichier sqljob.js auto-suffisant (pas de sqljob.css séparé)
        cssInjectedByJs(),
    ],

    build: {
        lib: {
            entry: 'src/web-component/sqljob-app.ts',
            formats: ['es'],
            fileName: 'sqljob',
        },
        outDir: 'dist-cdn',
        // Inline les assets pour un fichier le plus autonome possible
        assetsInlineLimit: 100_000_000,
        cssCodeSplit: false,
        sourcemap: true,
        rollupOptions: {
            // Tout est bundlé — aucune dépendance externe
            external: [],
            onwarn(warning, warn) {
                // safeEvalJs utilise new Function() intentionnellement dans un sandbox restreint
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
        },
    },
})
