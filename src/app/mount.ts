// @ts-nocheck
/**
 * Logique de montage partagée entre la SPA et le web component CDN.
 *
 * exposeGlobals() : expose toutes les classes/fonctions dans window pour
 *   que les expressions Alpine.js (x-data, x-init, @click...) puissent
 *   les résoudre (les ES modules sont isolés, Alpine évalue dans le scope global).
 *
 * mountApp(container) : charge la config depuis Gist/URL, injecte le HTML
 *   généré dans le container, et initialise Alpine sur ce sous-arbre.
 */
import '@iconify/iconify'
import { formatValueForInputType } from '../lib/utils'
import { CDNManager } from '../lib/CDNManager'
import { CELL_TYPE_SCHEMAS, CELL_TYPE_HANDLERS } from '../lib/cellTypeSchemas'
import { initializeCell, CellConfigService } from '../lib/CellConfigService'
import { ConfigManager } from '../lib/ConfigManager'
import { GistEncrypt } from '../lib/GistEncrypt'
import { GitHubGistManager } from '../lib/GitHubGistManager'
import { FileHandler } from '../lib/FileHandler'
import { DuckDBManager } from '../lib/DuckDBManager'
import { CellRenderer } from '../lib/CellRenderer'
import { CellBodyRenderer, CELL_BODY_FAMILIES } from '../lib/CellBodyRenderer'
import { EChartSqlParser } from '../lib/EChartSqlParser'

import { generateAppHTML, generateGistPassphraseModalHTML } from './htmlTemplates'
import { gistPassphraseModal } from './gistModal'
import { notebookApp } from './notebookApp'

export function exposeGlobals() {
    Object.assign(window, {
        ConfigManager,
        CellConfigService,
        initializeCell,
        CellRenderer,
        CellBodyRenderer,
        CELL_BODY_FAMILIES,
        EChartSqlParser,
        GistEncrypt,
        GitHubGistManager,
        FileHandler,
        DuckDBManager,
        CDNManager,
        CELL_TYPE_SCHEMAS,
        CELL_TYPE_HANDLERS,
        formatValueForInputType,
        generateAppHTML,
        notebookApp,
        gistPassphraseModal,
    });
}

export async function mountApp(container: HTMLElement) {
    exposeGlobals();

    const loadResult = await ConfigManager.loadConfigFromGist();

    if (loadResult && loadResult.needsPassphrase && loadResult.encryptedContent) {
        window._pendingEncryptedGist = loadResult.encryptedContent;
        window._encryptedSource = loadResult.source || 'gist';
        container.innerHTML = generateGistPassphraseModalHTML();
        if (window.Alpine) Alpine.initTree(container);
    } else {
        window._loadedConfig = loadResult;
        container.innerHTML = generateAppHTML();
        if (window.Alpine) Alpine.initTree(container);
    }
}
