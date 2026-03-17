import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // JsonMonacoEditor.js a un import statique de side-effect :
        //   import 'monaco-editor/esm/vs/language/json/monaco.contribution'
        // Avec external: [/^monaco-editor/], cet import devient un bare specifier ESM
        // que le navigateur ne peut pas résoudre. On le supprime par transform (avant la
        // résolution external). sqljob n'utilise pas JsonMonacoEditor.
        {
            name: 'patch-json-monaco-editor',
            transform(code, id) {
                if (id.includes('JsonMonacoEditor')) {
                    return {
                        code: code.replace(
                            /import\s+['"]monaco-editor\/esm\/vs\/language\/json\/monaco\.contribution['"];?/,
                            '// (patched: JSON Monaco contribution not needed in CDN build)'
                        ),
                        map: null,
                    }
                }
            },
        },
    ],

    define: {
        'process.env.NODE_ENV': '"production"',
        'process.env': '{}',
    },

    // Resolve aliases for CDN build (mirrors vite.config.ts + stubs heavy deps).
    resolve: {
        alias: [
            // Stub @malloydata/query-composer → prevents bundling vega/d3/styled-components
            {
                find: /^@malloydata\/query-composer$/,
                replacement: path.resolve(__dirname, 'src/shims/malloy-query-composer-stub.ts'),
            },
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
            {
                find: /^@malloydata\/malloy$/,
                replacement: path.resolve(__dirname, 'src/shims/malloy-with-segment.ts'),
            },
            // @malloydata/render/webcomponent → stub vide
            {
                find: '@malloydata/render/webcomponent',
                replacement: path.resolve(__dirname, 'src/shims/malloy-render-webcomponent.ts'),
            },
            // util → shim browser-compatible
            { find: 'util', replacement: 'util/' },
        ],
    },

    build: {
        lib: {
            entry: 'src/web-component/sqljob-app.ts',
            formats: ['es'],
            fileName: 'sqljob',
        },
        outDir: 'dist-cdn',
        assetsInlineLimit: 100_000_000,
        sourcemap: false,
        rollupOptions: {
            // monaco-editor est externalisé (trop lourd à bundler).
            // Il est chargé au runtime depuis jsDelivr via AMD (@monaco-editor/react loader).
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
