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
        code: "SELECT DISTINCT {{ SELECT column_name FROM information_schema.columns\nWHERE table_name = 'source1'\nORDER BY ordinal_position;\n}} FROM source1;"
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
        return get().currentLanguageType === 'js' ? '📋 Templates JavaScript' : '📋 Templates SQL'
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
