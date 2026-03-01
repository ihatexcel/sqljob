import { createRoot } from 'react-dom/client'
import { App } from './app/App'

const container = document.getElementById('app-container')!
createRoot(container).render(<App />)
