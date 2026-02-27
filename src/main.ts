// @ts-nocheck
import '@iconify/iconify'
import { formatValueForInputType } from './lib/utils'
import { CDNManager } from './lib/CDNManager'
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from './lib/cellTypeSchemas'
import { initializeCell, CellConfigService } from './lib/CellConfigService'
import { ConfigManager } from './lib/ConfigManager'
import { GistEncrypt } from './lib/GistEncrypt'
import { GitHubGistManager } from './lib/GitHubGistManager'
import { FileHandler } from './lib/FileHandler'
import { DuckDBManager } from './lib/DuckDBManager'
import { CellRenderer } from './lib/CellRenderer'
import { CellBodyRenderer, CELL_BODY_FAMILIES } from './lib/CellBodyRenderer'

import { generateAppHTML, generateGistPassphraseModalHTML } from './app/htmlTemplates'
import { gistPassphraseModal } from './app/gistModal'
import { notebookApp } from './app/notebookApp'

// ═══════════════════════════════════════════════════════════════════════════
// EXPOSITION GLOBALE pour Alpine.js
// Dans le code original (inline <script>), toutes les déclarations de classes
// et fonctions étaient automatiquement globales. En ES module, elles sont
// isolées dans le scope du module. Alpine.js évalue ses expressions
// (x-html, x-init, @change, :disabled...) dans le scope GLOBAL → on les
// expose ici explicitement, AVANT que le IIFE async démarre.
// ═══════════════════════════════════════════════════════════════════════════
Object.assign(window, {
    ConfigManager,
    CellConfigService,
    initializeCell,
    CellRenderer,
    CellBodyRenderer,
    CELL_BODY_FAMILIES,
    GistEncrypt,
    GitHubGistManager,
    FileHandler,
    DuckDBManager,
    CDNManager,
    CELL_TYPE_SCHEMAS,
    CELL_TYPE_HANDLERS,
    formatValueForInputType,
    // Exposer les fonctions app pour gistModal (window.generateAppHTML, window.notebookApp)
    generateAppHTML,
    notebookApp,
    gistPassphraseModal,
});

// ═══════════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════════════════
(async function main() {
    const loadResult = await ConfigManager.loadConfigFromGist();
    const container = document.getElementById('app-container');

    if (loadResult && loadResult.needsPassphrase && loadResult.encryptedContent) {
        window._pendingEncryptedGist = loadResult.encryptedContent;
        window._encryptedSource = loadResult.source || 'gist';
        if (container) {
            container.innerHTML = generateGistPassphraseModalHTML();
            if (window.Alpine) Alpine.initTree(container);
        }
    } else {
        window._loadedConfig = loadResult;
        if (container) {
            container.innerHTML = generateAppHTML();
            // Avec Vite (module différé), Alpine peut avoir déjà initialisé
            // le DOM vide → on re-init le container si nécessaire.
            if (window.Alpine) Alpine.initTree(container);
        }
    }
})();
