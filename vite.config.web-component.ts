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
            // @sqlrooms/monaco-editor est stubbé dans le build CDN :
            // Monaco (~4MB) est trop lourd à bundler et ses imports ESM directs
            // (ex: monaco-editor/esm/vs/language/json/monaco.contribution) ne peuvent
            // pas être résolus comme bare specifiers dans le navigateur.
            // Le SqlEditorModal fonctionnera sans l'éditeur Monaco (schema tree OK).
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
        assetsInlineLimit: 100_000_000,
        sourcemap: true,
        rollupOptions: {
            external: [/^monaco-editor/],
            output: {
                assetFileNames: 'sqljob[extname]',
                inlineDynamicImports: true,
            },
            onwarn(warning, warn) {
                if (warning.code === 'EVAL') return
                warn(warning)
            },
        },
    },
})
