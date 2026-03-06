import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env': '{}',
    },

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
            // Monaco editor externalisé — utilisé uniquement par RoomShell.CommandPalette
            // que sqljob n'utilise pas. Réduit considérablement la taille du bundle CDN.
            external: [/@sqlrooms\/monaco-editor/, /monaco-editor/],
            output: {
                // CSS exportée en sqljob.css (fichier distinct du JS)
                assetFileNames: 'sqljob[extname]',
                // Force un seul fichier JS (pas de code splitting)
                inlineDynamicImports: true,
            },
            onwarn(warning, warn) {
                // safeEvalJs utilise new Function() intentionnellement dans un sandbox restreint
                if (warning.code === 'EVAL') return;
                warn(warning);
            },
        },
    },
})
