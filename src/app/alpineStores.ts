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
                },

                // ─── EChart TaleShape templates ───────────────────────────
                {
                    name: "EChart: Bar chart simple",
                    description: "Bar chart avec XAXIS + BARCHART",
                    code: `SELECT
    month AS XAXIS,
    revenue AS BARCHART
FROM (VALUES
    ('Jan', 42000), ('Feb', 38000), ('Mar', 51000),
    ('Apr', 47000), ('May', 60000), ('Jun', 55000)
) t(month, revenue);`
                },
                {
                    name: "EChart: Bar chart multiple séries",
                    description: "Plusieurs colonnes BARCHART côte à côte",
                    code: `SELECT
    month        AS XAXIS,
    revenue      AS Revenue_BARCHART,
    cost         AS "Coûts_BARCHART"
FROM (VALUES
    ('Jan', 42000, 28000), ('Feb', 38000, 25000),
    ('Mar', 51000, 31000), ('Apr', 47000, 29000)
) t(month, revenue, cost);`
                },
                {
                    name: "EChart: Bar chart horizontal",
                    description: "Bar horizontal avec YAXIS au lieu de XAXIS",
                    code: `SELECT
    department AS YAXIS,
    headcount  AS BARCHART
FROM (VALUES
    ('Engineering', 42), ('Sales', 38),
    ('Marketing', 25), ('Support', 31)
) t(department, headcount);`
                },
                {
                    name: "EChart: Bar chart empilé (stacked)",
                    description: "Barres empilées avec CATEGORY",
                    code: `SELECT
    quarter   AS XAXIS,
    product   AS CATEGORY,
    revenue   AS BARCHART_STACKED
FROM (VALUES
    ('Q1', 'Produit A', 120), ('Q1', 'Produit B', 80),
    ('Q2', 'Produit A', 150), ('Q2', 'Produit B', 95),
    ('Q3', 'Produit A', 170), ('Q3', 'Produit B', 110),
    ('Q4', 'Produit A', 200), ('Q4', 'Produit B', 130)
) t(quarter, product, revenue);`
                },
                {
                    name: "EChart: Bar chart 100% empilé",
                    description: "Barres empilées en pourcentage (fractions 0-1)",
                    code: `SELECT
    quarter   AS XAXIS,
    product   AS CATEGORY,
    share     AS BARCHART_STACKED_PERCENT
FROM (VALUES
    ('Q1', 'Produit A', 0.60), ('Q1', 'Produit B', 0.40),
    ('Q2', 'Produit A', 0.61), ('Q2', 'Produit B', 0.39),
    ('Q3', 'Produit A', 0.607), ('Q3', 'Produit B', 0.393)
) t(quarter, product, share);`
                },
                {
                    name: "EChart: Line chart simple",
                    description: "Courbe avec XAXIS + LINECHART",
                    code: `SELECT
    month AS XAXIS,
    sessions AS LINECHART
FROM (VALUES
    ('Jan', 1200), ('Feb', 1500), ('Mar', 1800),
    ('Apr', 2100), ('May', 2400), ('Jun', 2800)
) t(month, sessions);`
                },
                {
                    name: "EChart: Line chart multi-séries",
                    description: "Plusieurs courbes avec CATEGORY",
                    code: `SELECT
    month   AS XAXIS,
    channel AS CATEGORY,
    visits  AS LINECHART
FROM (VALUES
    ('Jan', 'Web', 1200), ('Jan', 'Mobile', 800),
    ('Feb', 'Web', 1500), ('Feb', 'Mobile', 1100),
    ('Mar', 'Web', 1800), ('Mar', 'Mobile', 1400),
    ('Apr', 'Web', 2100), ('Apr', 'Mobile', 1700)
) t(month, channel, visits);`
                },
                {
                    name: "EChart: Mixed bar + line",
                    description: "Barres et courbe sur le même graphique",
                    code: `SELECT
    month        AS XAXIS,
    revenue      AS Revenue_BARCHART,
    target       AS Objectif_LINECHART
FROM (VALUES
    ('Jan', 42000, 40000), ('Feb', 38000, 40000),
    ('Mar', 51000, 45000), ('Apr', 47000, 45000),
    ('May', 60000, 50000), ('Jun', 55000, 50000)
) t(month, revenue, target);`
                },
                {
                    name: "EChart: Pie chart",
                    description: "Camembert avec CATEGORY + PIECHART",
                    code: `SELECT
    browser AS CATEGORY,
    users   AS PIECHART
FROM (VALUES
    ('Chrome', 65), ('Firefox', 15),
    ('Safari', 12), ('Edge', 8)
) t(browser, users);`
                },
                {
                    name: "EChart: Donut chart",
                    description: "Donut avec CATEGORY + DONUTCHART",
                    code: `SELECT
    status  AS CATEGORY,
    count   AS DONUTCHART
FROM (VALUES
    ('Terminé', 45), ('En cours', 30),
    ('En attente', 15), ('Annulé', 10)
) t(status, count);`
                },
                {
                    name: "EChart: Gauge simple",
                    description: "Jauge avec GAUGE (valeur brute)",
                    code: `SELECT 72 AS GAUGE;`
                },
                {
                    name: "EChart: Gauge pourcentage",
                    description: "Jauge en pourcentage (fraction 0-1 x100)",
                    code: `SELECT 0.72 AS "Satisfaction_GAUGE_PERCENT";`
                },
                {
                    name: "EChart: Gauge avec couleurs custom",
                    description: "Jauge avec COLORS et RANGE personnalisés",
                    code: `SELECT
    73          AS Performance_GAUGE,
    '[0, 150]'  AS RANGE,
    '[[0.3, "#ee6666"], [0.7, "#fac858"], [1, "#91cc75"]]' AS COLORS;`
                },
                {
                    name: "EChart: KPI label simple",
                    description: "KPI card avec LABEL",
                    code: `SELECT
    '1 234' AS "Utilisateurs actifs_LABEL";`
                },
                {
                    name: "EChart: KPI avec PERCENT",
                    description: "KPI pourcentage avec barre de progression (fraction 0-1)",
                    code: `SELECT
    'SLA' AS LABEL,
    0.973 AS "Disponibilité_PERCENT";`
                },
                {
                    name: "EChart: KPI avec TREND (delta)",
                    description: "KPI tendance avec flèche (delta positif/négatif)",
                    code: `SELECT
    '42 500 €' AS "CA Mensuel_LABEL",
    3200       AS "vs mois dernier_TREND";`
                },
                {
                    name: "EChart: KPI avec TREND (ratio)",
                    description: "KPI tendance avec ratio (> 1 = hausse, < 1 = baisse)",
                    code: `SELECT
    '42 500 €' AS "CA Mensuel_LABEL",
    1.12       AS "vs mois dernier_TREND";`
                },
                {
                    name: "EChart: KPI avec COMPARE",
                    description: "KPI comparaison avec triangle haut/bas",
                    code: `SELECT
    '42 500 €' AS "CA Mensuel_LABEL",
    0.85       AS "Marge_PERCENT",
    3200       AS "vs N-1_COMPARE";`
                },
                {
                    name: "EChart: Boxplot (valeurs brutes)",
                    description: "Boxplot calculé à partir de valeurs brutes groupées",
                    code: `SELECT
    department AS XAXIS,
    salary     AS BOXPLOT
FROM (VALUES
    ('Dev', 45000), ('Dev', 52000), ('Dev', 58000), ('Dev', 62000), ('Dev', 95000),
    ('Sales', 35000), ('Sales', 42000), ('Sales', 48000), ('Sales', 55000),
    ('HR', 38000), ('HR', 42000), ('HR', 45000), ('HR', 50000)
) t(department, salary);`
                },
                {
                    name: "EChart: Boxplot (5 colonnes directes)",
                    description: "Boxplot avec min, Q1, médiane, Q3, max",
                    code: `SELECT
    department AS XAXIS,
    min_sal AS min_BOXPLOT,
    q1_sal  AS q1_BOXPLOT,
    med_sal AS med_BOXPLOT,
    q3_sal  AS q3_BOXPLOT,
    max_sal AS max_BOXPLOT
FROM (VALUES
    ('Dev', 45000, 50000, 55000, 65000, 95000),
    ('Sales', 35000, 40000, 46000, 52000, 55000),
    ('HR', 38000, 41000, 43000, 47000, 50000)
) t(department, min_sal, q1_sal, med_sal, q3_sal, max_sal);`
                },
                {
                    name: "EChart: Bar chart avec couleurs custom",
                    description: "Couleurs personnalisées par barre via COLOR",
                    code: `SELECT
    status  AS XAXIS,
    count   AS BARCHART,
    color   AS COLOR
FROM (VALUES
    ('Succès', 120, '#22c55e'),
    ('Warning', 35, '#f59e0b'),
    ('Erreur', 8, '#ef4444')
) t(status, count, color);`
                },
                {
                    name: "EChart: Line chart avec markLine",
                    description: "Courbe avec ligne de référence horizontale (YLINE)",
                    code: `SELECT
    month    AS XAXIS,
    revenue  AS LINECHART,
    50000    AS "Objectif_YLINE"
FROM (VALUES
    ('Jan', 42000), ('Feb', 38000), ('Mar', 51000),
    ('Apr', 47000), ('May', 60000), ('Jun', 55000)
) t(month, revenue);`
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
