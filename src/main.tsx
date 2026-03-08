import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { configureMonacoLoader } from '@sqlrooms/monaco-editor'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

// Configure Monaco to use bundled workers (no CDN dependency, editor interactive immediately)
configureMonacoLoader({
    monaco,
    workers: { default: editorWorker },
})

const container = document.getElementById('app-container')!
createRoot(container).render(<App />)
