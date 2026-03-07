// Stub for JsonMonacoEditor in the CDN build.
// JsonMonacoEditor.js has a static import of monaco-editor/esm/vs/language/json/monaco.contribution
// which cannot be resolved as a bare ESM specifier in the browser.
// sqljob doesn't use JsonMonacoEditor, so we stub it to null.
export const JsonMonacoEditor = () => null;
