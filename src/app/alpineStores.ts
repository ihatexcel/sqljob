// @ts-nocheck
/**
 * Enregistrement des stores Alpine.js partagés entre la SPA et le web component CDN.
 * À appeler avant Alpine.start().
 */
export function registerAlpineStores() {
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

        Alpine.store('confirmModal', {
            isOpen: false,
            message: '',
            _resolve: null,

            show(message) {
                return new Promise(resolve => {
                    this._resolve = resolve;
                    this.message = message;
                    this.isOpen = true;
                });
            },

            confirm() {
                this.isOpen = false;
                this._resolve?.(true);
                this._resolve = null;
            },

            cancel() {
                this.isOpen = false;
                this._resolve?.(false);
                this._resolve = null;
            }
        });
    });
}
