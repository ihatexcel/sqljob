import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
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
        sourcemap: true,
        rollupOptions: {
            // Tout est bundlé — aucune dépendance externe
            external: [],
            output: {
                // CSS exportée en sqljob.css (fichier distinct du JS)
                assetFileNames: 'sqljob[extname]',
            },
            onwarn(warning, warn) {
                // safeEvalJs utilise new Function() intentionnellement dans un sandbox restreint
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
        },
    },
})
