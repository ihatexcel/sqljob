/**
 * Déclarations globales TypeScript pour les extensions de Window et les modules sans types.
 */

// Extensions de l'objet Window
interface Window {
    // Config & Gist
    _pendingEncryptedGist?: string;
    _encryptedSource?: string;
    _loadedConfig?: unknown;
    GistEncrypt?: unknown;

    // DuckDB
    duckdbModule?: unknown;
    ducklingsModule?: unknown;

    // Perspective
    perspectiveClient?: any;

    // Docx / templating (chargés dynamiquement)
    docxtemplater?: any;

    // Web-component
    __sqljobScriptUrl?: string;
}

// Modules @univerjs/preset-sheets-table locales (sous-chemins non déclarés)
declare module '@univerjs/preset-sheets-table/lib/locales/en-US' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/fr-FR' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/zh-CN' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/zh-TW' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/ru-RU' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/ja-JP' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/es-ES' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/ca-ES' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/sk-SK' { const v: any; export default v; }
declare module '@univerjs/preset-sheets-table/lib/locales/fa-IR' { const v: any; export default v; }

// Modules CSS sans types
declare module 'simple-datatables/dist/style.css' {
    const content: string;
    export default content;
}

declare module 'easymde/dist/easymde.min.css' {
    const content: string;
    export default content;
}

// Imports CDN distants
declare module 'https://cdn.jsdelivr.net/npm/@perspective-dev/viewer@4.1.0/dist/cdn/perspective-viewer.js' {
    const mod: unknown;
    export default mod;
}
declare module 'https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-datagrid@4.1.0/dist/cdn/perspective-viewer-datagrid.js' {
    const mod: unknown;
    export default mod;
}
declare module 'https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-d3fc@4.1.0/dist/cdn/perspective-viewer-d3fc.js' {
    const mod: unknown;
    export default mod;
}
declare module 'https://cdn.jsdelivr.net/npm/@perspective-dev/viewer-openlayers@4.1.0/dist/cdn/perspective-viewer-openlayers.js' {
    const mod: unknown;
    export default mod;
}
declare module 'https://cdn.jsdelivr.net/npm/@perspective-dev/client@4.1.0/dist/cdn/perspective.js' {
    const mod: { default: unknown };
    export default mod;
}

// CDN-loaded globals
declare const XLSX: any
declare const PizZip: any

// Monaco editor worker (Vite)
declare module 'monaco-editor/esm/vs/editor/editor.worker?worker' {
    const Worker: new () => globalThis.Worker;
    export default Worker;
}

// JSX intrinsic elements pour web components
declare namespace JSX {
    interface IntrinsicElements {
        'perspective-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            ref?: React.Ref<HTMLElement>;
            theme?: string;
            class?: string;
        };
        'univer-sheet': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            ref?: React.Ref<HTMLElement>;
            class?: string;
        };
    }
}
