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
import { EChartSqlParser } from './lib/EChartSqlParser'

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
    EChartSqlParser,
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
// STORE ALPINE.JS POUR LA MODALE DES TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════
document.addEventListener('alpine:init', () => {
    Alpine.store('templateModal', {
        isOpen: false,
        currentCellId: null,
        currentQueryType: null,
        currentLanguageType: null,
        searchQuery: '',
        filteredTemplates: [],

        // Templates SQL
        sqlTemplates: [
            {
                name: "Liste des colonnes avec position",
                description: "Affiche les colonnes d'une table avec leur position ordinale",
                code: `SELECT
    column_name, ordinal_position::text || ' - ' || column_name
FROM information_schema.columns
WHERE table_name = 'source1'
ORDER BY ordinal_position;`
            },
            {
                name: "Liste des colonnes",
                description: "Affiche les noms des colonnes d'une table",
                code: `SELECT
    column_name
FROM information_schema.columns
WHERE table_name = 'source1'
ORDER BY ordinal_position;`
            },
            {
                name: "SELECT DISTINCT dynamique",
                description: "Génère un SELECT DISTINCT avec toutes les colonnes",
                code: `SELECT DISTINCT {{ SELECT column_name FROM information_schema.columns
WHERE table_name = 'source1'
ORDER BY ordinal_position;
}} FROM source1;`
            },
            {
                name: "Valeurs Ajouter/Enlever",
                description: "Table de valeurs pour opérations +/-",
                code: `SELECT *
FROM (
  VALUES
  ('+', '+ Ajouter'),
  ('-', '- Enlever')
) AS t(id, libelle);`
            },
            {
                name: "SELECT DISTINCT paramétré",
                description: "DISTINCT sur une colonne paramétrable",
                code: `SELECT
    DISTINCT "$param1"
FROM source1
ORDER BY "$param1";`
            },
            {
                name: "Import CSV avec géométrie",
                description: "Import CSV SF avec extraction lon/lat depuis shape (DuckDB)",
                code: `CREATE OR REPLACE TABLE source1 AS
SELECT *,
    CAST(regexp_extract(shape, 'POINT \\(([^ ]+)', 1) AS DOUBLE) as lon,
    CAST(regexp_extract(shape, 'POINT \\([^ ]+ ([^)]+)', 1) AS DOUBLE) as lat
FROM read_csv('https://data.sfgov.org/resource/5cei-gny5.csv?$limit=50000', ALL_VARCHAR=true, HEADER=true)
WHERE shape IS NOT NULL;`
            },
            {
                name: "SUMMARIZE",
                description: "Résumé statistique de la table",
                code: `SUMMARIZE FROM source1;`
            },
            {
                name: "Échantillon 50 lignes",
                description: "Sample aléatoire de 50 lignes",
                code: `SELECT * FROM source1 USING SAMPLE 50 ROWS;`
            },
            {
                name: "COPY Parquet vers CSV",
                description: "Export Parquet vers fichier CSV",
                code: `COPY (SELECT * FROM 'https://raw.githubusercontent.com/ihatexcel/sqljob/main/data/aws-edge-locations.parquet') TO 'source1.csv' (FORMAT csv, DELIMITER ';', HEADER);`
            },
            {
                name: "COPY CSV vers Parquet",
                description: "Export CSV vers fichier Parquet",
                code: `COPY (SELECT * FROM read_csv_auto(
'http://raw.githubusercontent.com/fivethirtyeight/data/master/bechdel/movies.csv'))
TO 'movies.parquet' (FORMAT 'parquet');`
            },
            {
                name: "SELECT colonnes avec préfixe",
                description: "Sélectionne uniquement les colonnes commençant par 'dim_'",
                code: `-- select only the column names that start with the dim_
SELECT COLUMNS('^dim_') FROM source1;`
            }
        ],

        // Templates JavaScript
        jsTemplates: [
            {
                name: "Dropdown simple",
                description: "Retourne un tableau d'options pour un dropdown",
                code: `["Option 1", "Option 2", "Option 3"];`
            },
            {
                name: "Valeur calculée",
                description: "Retourne une valeur calculée dynamiquement",
                code: `// Exemple de calcul
const today = new Date().toISOString().split('T')[0];
return today;`
            },
            {
                name: "Dropdown conditionnel",
                description: "Options qui dépendent d'un autre paramètre",
                code: `// Options basées sur un autre paramètre
if ($param1 === "Type A") {
    return ["A1", "A2", "A3"];
} else {
    return ["B1", "B2", "B3"];
}`
            }
        ],

        open(cellId, queryType, languageType = 'sql') {
            this.currentCellId = cellId;
            this.currentQueryType = queryType;
            this.currentLanguageType = languageType;
            this.searchQuery = '';
            this.filterTemplates();
            this.isOpen = true;
        },

        close() {
            this.isOpen = false;
            this.currentCellId = null;
            this.currentQueryType = null;
            this.currentLanguageType = null;
            this.searchQuery = '';
            this.filteredTemplates = [];
        },

        getCurrentTemplates() {
            return this.currentLanguageType === 'js' ? this.jsTemplates : this.sqlTemplates;
        },

        getModalTitle() {
            return this.currentLanguageType === 'js' ? '📋 Templates JavaScript' : '📋 Templates SQL';
        },

        filterTemplates() {
            const query = this.searchQuery.toLowerCase().trim();
            const templates = this.getCurrentTemplates();

            if (!query) {
                this.filteredTemplates = templates.map((template, idx) => ({
                    ...template,
                    originalIndex: idx
                }));
                return;
            }

            this.filteredTemplates = templates
                .map((template, idx) => ({ ...template, originalIndex: idx }))
                .filter(template => {
                    const searchIn = `${template.name} ${template.description} ${template.code}`.toLowerCase();
                    return searchIn.includes(query);
                });
        },

        selectTemplate(templateIndex) {
            if (this.currentCellId && this.currentQueryType && this.currentLanguageType) {
                const appContainer = document.querySelector('[x-data]');
                if (appContainer && appContainer._x_dataStack) {
                    const alpineInstance = appContainer._x_dataStack[0];
                    if (alpineInstance && alpineInstance.insertTemplate) {
                        alpineInstance.insertTemplate(this.currentCellId, this.currentQueryType, templateIndex, this.currentLanguageType);
                    }
                }
                this.close();
            }
        }
    });
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
