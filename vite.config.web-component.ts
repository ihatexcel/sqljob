import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    resolve: {
        alias: {
            // Replace @sqlrooms/monaco-editor with a no-op stub in the CDN build.
            // Monaco is too large to bundle and not used by sqljob itself.
            '@sqlrooms/monaco-editor': path.resolve(__dirname, 'src/stubs/monaco-editor-stub.ts'),
        },
    },

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
            // monaco-editor (the underlying lib) reste externalisé car il est très lourd
            // et n'est pas utilisé directement par sqljob.
            external: [/^monaco-editor/],
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
