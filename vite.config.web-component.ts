import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        // JsonMonacoEditor.js a un import statique de side-effect :
        //   import 'monaco-editor/esm/vs/language/json/monaco.contribution'
        // Avec external: [/^monaco-editor/], cet import devient un bare specifier ESM
        // que le navigateur ne peut pas résoudre. On le supprime par transform (avant la
        // résolution external). sqljob n'utilise pas JsonMonacoEditor.
        // @sqlrooms/pivot@rc.2 ships PivotCellContent which imports toDataSourceTable /
        // fromDataSourceTable from @sqlrooms/cells — those symbols only exist in rc.2 of cells
        // (not our pinned rc.1). We never use PivotCellContent; stub it so Rollup can resolve.
        {
            name: 'stub-pivot-cell-content',
            load(id) {
                if (id.includes('@sqlrooms/pivot') && id.includes('PivotCellContent')) {
                    return 'export const PivotCellContent = () => null;'
                }
            },
        },
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
                // inlineDynamicImports retiré : avec Univer (~33k modules), inliner tout en mémoire
                // saturait la RAM du runner CI (OOM à 4 Go). Le code splitting réduit
                // l'empreinte mémoire de Rollup ; les chunks sont servis depuis le même dossier.
                chunkFileNames: 'sqljob-[hash].js',
                entryFileNames: 'sqljob.js',
            },
            onwarn(warning, warn) {
                if (warning.code === 'EVAL') return
                warn(warning)
            },
        },
    },
})
