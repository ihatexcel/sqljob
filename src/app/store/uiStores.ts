// @ts-nocheck
/**
 * Stores Zustand pour les modals globaux (remplace alpineStores.ts)
 */
import { create } from 'zustand'

// ─── Template Modal ───────────────────────────────────────────────────────────

const SQL_TEMPLATES = [
    {
        name: "Liste des colonnes avec position",
        description: "Affiche les colonnes d'une table avec leur position ordinale",
        code: `SELECT\n    column_name, ordinal_position::text || ' - ' || column_name\nFROM information_schema.columns\nWHERE table_name = 'source1'\nORDER BY ordinal_position;`
    },
    {
        name: "Liste des colonnes",
        description: "Affiche les noms des colonnes d'une table",
        code: `SELECT\n    column_name\nFROM information_schema.columns\nWHERE table_name = 'source1'\nORDER BY ordinal_position;`
    },
    {
        name: "SELECT DISTINCT dynamique",
        description: "Génère un SELECT DISTINCT avec toutes les colonnes",
        code: "SELECT\n    column_name\nFROM information_schema.columns\nWHERE table_name = 'source1'\nORDER BY ordinal_position;"
    },
    {
        name: "Valeurs Ajouter/Enlever",
        description: "Table de valeurs pour opérations +/-",
        code: `SELECT *\nFROM (\n  VALUES\n  ('+', '+ Ajouter'),\n  ('-', '- Enlever')\n) AS t(id, libelle);`
    },
    {
        name: "SELECT DISTINCT paramétré",
        description: "DISTINCT sur une colonne paramétrable",
        code: `SELECT\n    DISTINCT "$param1"\nFROM source1\nORDER BY "$param1";`
    },
    {
        name: "Import CSV avec géométrie",
        description: "Import CSV SF avec extraction lon/lat depuis shape (DuckDB)",
        code: `CREATE OR REPLACE TABLE source1 AS\nSELECT *,\n    CAST(regexp_extract(shape, 'POINT \\\\(([^ ]+)', 1) AS DOUBLE) as lon,\n    CAST(regexp_extract(shape, 'POINT \\\\([^ ]+ ([^)]+)', 1) AS DOUBLE) as lat\nFROM read_csv('https://data.sfgov.org/resource/5cei-gny5.csv?$limit=50000', ALL_VARCHAR=true, HEADER=true)\nWHERE shape IS NOT NULL;`
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
        code: `COPY (SELECT * FROM read_csv_auto(\n'http://raw.githubusercontent.com/fivethirtyeight/data/master/bechdel/movies.csv'))\nTO 'movies.parquet' (FORMAT 'parquet');`
    },
    {
        name: "SELECT colonnes avec préfixe",
        description: "Sélectionne uniquement les colonnes commençant par 'dim_'",
        code: `-- select only the column names that start with the dim_\nSELECT COLUMNS('^dim_') FROM source1;`
    },
    // ── EChart templates ─────────────────────────────────────────────────────
    {
        name: "EChart – Bar simple",
        description: "Graphique en barres : une mesure sur un axe X (syntaxe ::XAXIS / ::BARCHART)",
        code: `SELECT\n  month::XAXIS,\n  revenue::BARCHART AS "Revenue"\nFROM (VALUES\n  ('Jan', 12000),\n  ('Feb', 15000),\n  ('Mar', 18000),\n  ('Apr', 14000),\n  ('May', 21000),\n  ('Jun', 19000)\n) t(month, revenue);`
    },
    {
        name: "EChart – Bar multi-séries (CATEGORY)",
        description: "Barres groupées par catégorie : ::XAXIS + ::CATEGORY + ::BARCHART",
        code: `SELECT\n  month::XAXIS,\n  product::CATEGORY,\n  sales::BARCHART AS "Sales"\nFROM (VALUES\n  ('Jan', 'Product A', 5000),\n  ('Jan', 'Product B', 7000),\n  ('Feb', 'Product A', 6000),\n  ('Feb', 'Product B', 9000),\n  ('Mar', 'Product A', 8000),\n  ('Mar', 'Product B', 10000)\n) t(month, product, sales);`
    },
    {
        name: "EChart – Bar empilées (BARCHART_STACKED)",
        description: "Barres empilées par catégorie : ::CATEGORY + ::BARCHART_STACKED",
        code: `SELECT\n  month::XAXIS,\n  channel::CATEGORY,\n  revenue::BARCHART_STACKED AS "Revenue"\nFROM (VALUES\n  ('Jan', 'Web', 6000),\n  ('Jan', 'Mobile', 4000),\n  ('Feb', 'Web', 9000),\n  ('Feb', 'Mobile', 6000),\n  ('Mar', 'Web', 11000),\n  ('Mar', 'Mobile', 7000)\n) t(month, channel, revenue);`
    },
    {
        name: "EChart – Bar 100% (BARCHART_PERCENT)",
        description: "Barres empilées normalisées à 100 % : ::BARCHART_PERCENT",
        code: `SELECT\n  month::XAXIS,\n  channel::CATEGORY,\n  revenue::BARCHART_PERCENT AS "Share"\nFROM (VALUES\n  ('Jan', 'Web', 6000),\n  ('Jan', 'Mobile', 4000),\n  ('Feb', 'Web', 9000),\n  ('Feb', 'Mobile', 6000),\n  ('Mar', 'Web', 11000),\n  ('Mar', 'Mobile', 7000)\n) t(month, channel, revenue);`
    },
    {
        name: "EChart – Bar horizontale (YAXIS)",
        description: "Barres horizontales : ::YAXIS remplace ::XAXIS pour inverser les axes",
        code: `SELECT\n  country::YAXIS,\n  sales::BARCHART AS "Sales"\nFROM (VALUES\n  ('France',  42000),\n  ('Germany', 38000),\n  ('UK',      55000),\n  ('Spain',   29000),\n  ('Italy',   31000)\n) t(country, sales);`
    },
    {
        name: "EChart – Line simple",
        description: "Courbe simple avec plusieurs séries nommées : ::LINECHART",
        code: `SELECT\n  month::XAXIS,\n  revenue::LINECHART AS "Revenue",\n  target::LINECHART  AS "Target"\nFROM (VALUES\n  ('Jan', 12000, 13000),\n  ('Feb', 15000, 14000),\n  ('Mar', 18000, 16000),\n  ('Apr', 14000, 17000),\n  ('May', 21000, 18000),\n  ('Jun', 19000, 20000)\n) t(month, revenue, target);`
    },
    {
        name: "EChart – Line multi-séries (CATEGORY)",
        description: "Courbes groupées par catégorie : ::CATEGORY + ::LINECHART",
        code: `SELECT\n  month::XAXIS,\n  region::CATEGORY,\n  sales::LINECHART AS "Sales"\nFROM (VALUES\n  ('Jan', 'North', 8000), ('Jan', 'South', 5000),\n  ('Feb', 'North', 9500), ('Feb', 'South', 6200),\n  ('Mar', 'North', 11000),('Mar', 'South', 7800),\n  ('Apr', 'North', 10200),('Apr', 'South', 8100)\n) t(month, region, sales);`
    },
    {
        name: "EChart – Bar + Line (combo)",
        description: "Mix barres + courbe sur le même graphique : ::BARCHART + ::LINECHART",
        code: `SELECT\n  month::XAXIS,\n  revenue::BARCHART AS "Revenue",\n  target::LINECHART  AS "Target"\nFROM (VALUES\n  ('Jan', 12000, 13000),\n  ('Feb', 15000, 14000),\n  ('Mar', 18000, 16000),\n  ('Apr', 14000, 17000),\n  ('May', 21000, 18000),\n  ('Jun', 19000, 20000)\n) t(month, revenue, target);`
    },
    {
        name: "EChart – Pie chart",
        description: "Camembert : ::CATEGORY pour les tranches, ::PIECHART pour les valeurs",
        code: `SELECT\n  dept::CATEGORY,\n  budget::PIECHART AS "Budget"\nFROM (VALUES\n  ('Engineering', 45),\n  ('Marketing',   25),\n  ('Sales',       20),\n  ('Support',     10)\n) t(dept, budget);`
    },
    {
        name: "EChart – Donut chart",
        description: "Graphique en anneau : ::DONUTCHART (variante de PIECHART avec trou central)",
        code: `SELECT\n  status::CATEGORY,\n  count::DONUTCHART AS "Users"\nFROM (VALUES\n  ('Active',  680),\n  ('Trial',   220),\n  ('Churned', 100)\n) t(status, count);`
    },
    {
        name: "EChart – Donut 100% (DONUTCHART_PERCENT)",
        description: "Anneau normalisé en pourcentage : ::DONUTCHART_PERCENT",
        code: `SELECT\n  status::CATEGORY,\n  share::DONUTCHART_PERCENT AS "Share"\nFROM (VALUES\n  ('Active',  68),\n  ('Trial',   22),\n  ('Churned', 10)\n) t(status, share);`
    }
]

const JS_TEMPLATES = [
    {
        name: "Dropdown simple",
        description: "Retourne un tableau d'options pour un dropdown",
        code: `["Option 1", "Option 2", "Option 3"];`
    },
    {
        name: "Valeur calculée",
        description: "Retourne une valeur calculée dynamiquement",
        code: `// Exemple de calcul\nconst today = new Date().toISOString().split('T')[0];\nreturn today;`
    },
    {
        name: "Dropdown conditionnel",
        description: "Options qui dépendent d'un autre paramètre",
        code: `// Options basées sur un autre paramètre\nif ($param1 === "Type A") {\n    return ["A1", "A2", "A3"];\n} else {\n    return ["B1", "B2", "B3"];\n}`
    }
]

interface TemplateModalState {
    isOpen: boolean
    currentCellId: string | null
    currentQueryType: string | null
    currentLanguageType: string
    searchQuery: string
    filteredTemplates: any[]
    sqlTemplates: any[]
    jsTemplates: any[]
    open: (cellId: string, queryType: string, languageType?: string) => void
    close: () => void
    getCurrentTemplates: () => any[]
    getModalTitle: () => string
    filterTemplates: () => void
    selectTemplate: (templateIndex: number) => void
    // callback set by the notebook store when selectTemplate is called
    _onSelectTemplate: ((cellId: string, queryType: string, templateIndex: number, languageType: string) => void) | null
}

export const useTemplateModal = create<TemplateModalState>((set, get) => ({
    isOpen: false,
    currentCellId: null,
    currentQueryType: null,
    currentLanguageType: 'sql',
    searchQuery: '',
    filteredTemplates: [],
    sqlTemplates: SQL_TEMPLATES,
    jsTemplates: JS_TEMPLATES,
    _onSelectTemplate: null,

    open(cellId, queryType, languageType = 'sql') {
        set({ currentCellId: cellId, currentQueryType: queryType, currentLanguageType: languageType, searchQuery: '', isOpen: true })
        get().filterTemplates()
    },

    close() {
        set({ isOpen: false, currentCellId: null, currentQueryType: null, currentLanguageType: 'sql', searchQuery: '', filteredTemplates: [] })
    },

    getCurrentTemplates() {
        return get().currentLanguageType === 'js' ? get().jsTemplates : get().sqlTemplates
    },

    getModalTitle() {
        return get().currentLanguageType === 'js' ? 'Templates JavaScript' : 'Templates SQL'
    },

    filterTemplates() {
        const query = get().searchQuery.toLowerCase().trim()
        const templates = get().getCurrentTemplates()
        if (!query) {
            set({ filteredTemplates: templates.map((t, i) => ({ ...t, originalIndex: i })) })
            return
        }
        set({
            filteredTemplates: templates
                .map((t, i) => ({ ...t, originalIndex: i }))
                .filter(t => `${t.name} ${t.description} ${t.code}`.toLowerCase().includes(query))
        })
    },

    selectTemplate(templateIndex) {
        const { currentCellId, currentQueryType, currentLanguageType, _onSelectTemplate } = get()
        if (currentCellId && currentQueryType && _onSelectTemplate) {
            _onSelectTemplate(currentCellId, currentQueryType, templateIndex, currentLanguageType)
        }
        get().close()
    }
}))

// ─── Confirm Modal ────────────────────────────────────────────────────────────

interface ConfirmModalState {
    isOpen: boolean
    message: string
    _resolve: ((v: boolean) => void) | null
    show: (message: string) => Promise<boolean>
    confirm: () => void
    cancel: () => void
}

export const useConfirmModal = create<ConfirmModalState>((set, get) => ({
    isOpen: false,
    message: '',
    _resolve: null,

    show(message) {
        return new Promise<boolean>(resolve => {
            set({ _resolve: resolve, message, isOpen: true })
        })
    },

    confirm() {
        const { _resolve } = get()
        set({ isOpen: false, _resolve: null })
        _resolve?.(true)
    },

    cancel() {
        const { _resolve } = get()
        set({ isOpen: false, _resolve: null })
        _resolve?.(false)
    }
}))
