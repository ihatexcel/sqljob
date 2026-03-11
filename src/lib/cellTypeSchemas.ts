// @ts-nocheck

export const CELL_TYPE_SCHEMAS = {
            common: {
                name: { label: 'Nom', tooltip: "Identifiant unique (tous types confondus). Pour source = nom de la table SQL (ex: source1). Pour onglets tabsChild = libellé affiché.", placeholder: 'Identifiant unique de la cellule', inputType: 'text', required: true },
                title: { label: 'Titre', tooltip: null, placeholder: null, inputType: 'text' },
                queries: { label: null, inputType: 'textarea', placeholder: null },
                subtitle: { label: 'Description de la stat', tooltip: "Texte descriptif affiché sous le titre de la statistique", placeholder: 'Jan 1st - Feb 1st', inputType: 'text' },
                icon: { label: "Icône (Iconify)", tooltip: "Nom de l'icône Iconify (ex: material-symbols-light:join-right)", placeholder: 'material-symbols-light:join-right', inputType: 'text' },
                buttonLabel: { label: "Label du bouton", tooltip: "Les boutons interrompent le flux d'exécution des cellules ; un clic permet de le reprendre.", placeholder: null, inputType: 'text' }
            },
            types: {
                markdown: {
                    executeHandler: 'executeMarkdownCell',
                    defaultNamePrefix: 'markdown',
                    bodyDisplay: { showSkeleton: { when: 'running', skipWhenEngineText: true } },
                    exportFields: ['queries'],
                    contentKey: 'queries.main',
                    contentResultKey: '_markdownContent',
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    specificParams: [
                        { key: 'queries.main.engine', label: 'Type de langage', tooltip: "Texte: Markdown saisi directement | SQL: requête retournant du Markdown | JS: expression JavaScript retournant du Markdown", inputType: 'select', options: [{ value: 'text', label: 'Texte' }, { value: 'sql', label: 'SQL' }, { value: 'js', label: 'JavaScript' }] },
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur en mode client", inputType: 'checkbox' }
                    ],
                    defaults: { queries: [{ name: 'main', sql: '# Nouvelle section', engine: 'text', clientVisible: false }] },
                    bodyFamily: 'markdown',
                    bodyConfig: { devModeToolbar: ['bold', 'italic', 'heading', '|', 'quote', 'unordered-list', 'ordered-list', '|', 'link', 'image', '|', 'preview', '|', 'guide'], devTextareaId: 'markdown_dev_', clientTextareaId: 'markdown_cli_' }
                },
                source: {
                    executeHandler: 'executeSourceCell',
                    defaultNamePrefix: 'source',
                    secondQueryName: 'fallback',
                    requiresFileBeforeRun: true,
                    exportRuntimeBlob: true,
                    namePattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                    exportFields: ['name', 'title', 'queries', 'json'],
                    exportFileSlot: 'source',
                    initProps: { _isDragging: false, _loaded: false },
                    initFileSlot: { slot: 'source', asBlob: true },
                    commonParams: ['name', 'title', 'queries'],
                    queryCount: 2,
                    queryNames: ['main', 'fallback'],
                    queryLabels: { main: "Requête d'import", fallback: "Requête de fallback (si erreur)" },
                    titleLabel: "Texte de la zone d'import",
                    titleTooltip: "Texte affiché dans la zone de drag & drop",
                    specificParams: [
                        { key: 'json.xlsx', label: 'Configuration Excel (JSON)', tooltip: "Options pour la conversion des fichiers .xlsx/.xls", inputType: 'textarea', rows: 5 }
                    ],
                    defaults: {
                        title: 'Glissez-déposez votre fichier ici',
                        queries: [
                            { name: 'main', sql: "CREATE OR REPLACE TABLE {{name}} AS SELECT * FROM '{{fileName}}'", engine: 'sql', clientVisible: false },
                            { name: 'fallback', sql: "CREATE OR REPLACE TABLE {{name}} AS SELECT * FROM query( CASE WHEN lower('{{fileName}}') LIKE '%.csv' OR lower('{{fileName}}') LIKE '%.csv.gz' THEN 'SELECT * FROM read_csv(''' || '{{fileName}}' || ''', HEADER = true, AUTO_DETECT = true, SAMPLE_SIZE = -1, IGNORE_ERRORS = true, store_rejects = true)' WHEN lower('{{fileName}}') LIKE '%.xlsx' THEN 'SELECT * FROM read_xlsx(''' || '{{fileName}}' || ''', HEADER = true, STOP_AT_EMPTY = false, EMPTY_AS_VARCHAR = true, IGNORE_ERRORS = true)' WHEN lower('{{fileName}}') LIKE '%.tsv' OR lower('{{fileName}}') LIKE '%.tsv.gz' OR lower('{{fileName}}') LIKE '%.txt' OR lower('{{fileName}}') LIKE '%.txt.gz' THEN 'SELECT * FROM read_csv(''' || '{{fileName}}' || ''', HEADER = true, DELIM = ''\t'', AUTO_DETECT = true, SAMPLE_SIZE = -1, IGNORE_ERRORS = true, store_rejects = true)' WHEN lower('{{fileName}}') LIKE '%.parquet' OR lower('{{fileName}}') LIKE '%.parquet.gz' THEN 'SELECT * FROM read_parquet(''' || '{{fileName}}' || ''')' ELSE 'SELECT 1' END );", engine: 'sql', clientVisible: false }
                        ],
                        json: { xlsx: { options: { type: 'array', raw: false, dateNF: 'dd/mm/yyyy', cellDates: true }, toCsvOptions: { dateNF: 'dd/mm/yyyy', FS: ',', RS: '\n' }, sheetSelection: { type: { auto: true }, index: 0, name: '' } } }
                    },
                    bodyFamily: 'fileDropZone',
                    bodyConfig: { fileSlot: 'source', fileKey: '_fileName', fileBase64Key: 'fileBase64', fileFileNameKey: 'fileName', accept: '.csv,.parquet,.xlsx,.xls', inputId: 'fileInput_', emptyIcon: 'material-symbols-light:create-new-folder', emptyTitleKey: 'title', emptySubtitle: "→ {name}", handlers: { drop: 'handleSingleSourceDrop', select: 'handleSingleSourceFileSelect', remove: 'removeSingleSourceFile', download: 'downloadSourceFile' }, minHeight: '80px', showQueryInDevMode: true },
                    bodyDisplay: { showSkeleton: { when: 'running', sourceLoading: true } }
                },
                buttonRunNextCells: {
                    executeHandler: null,
                    defaultNamePrefix: 'button',
                    blocksAutoFlow: true,
                    showOnlyWhenButtonLabel: true,
                    exportFields: ['buttonLabel'],
                    commonParams: ['name', 'buttonLabel'],
                    specificParams: [],
                    defaults: { buttonLabel: 'Exécuter' },
                    bodyFamily: 'buttonRun',
                    bodyConfig: { defaultLabel: 'Exécuter', action: 'runCellsAfter' }
                },
                sqlRecursiveParse: {
                    executeHandler: 'executeSqlRecursiveParseCell',
                    defaultNamePrefix: 'sql',
                    hideInViewMode: true,
                    exportFields: ['queries'],
                    initProps: {},
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    specificParams: [
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur SQL en mode client", tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur. En mode client, seul le résultat sera affiché.", inputType: 'checkbox' }
                    ],
                    defaults: { queries: [{ name: 'main', sql: 'SELECT * FROM source1 LIMIT 100', engine: 'sql', clientVisible: false }] },
                    bodyFamily: 'sqlWithTable',
                    bodyConfig: { queryKey: 'query', showTextResult: true, showResultInfo: true },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true }, resultInfo: { showDevOnly: false } }
                },
                table: {
                    executeHandler: 'executeTableCell',
                    defaultNamePrefix: 'table',
                    exportFields: ['queries', 'maxRows'],
                    initProps: {},
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    specificParams: [
                        { key: 'maxRows', label: "Nombre max de lignes", tooltip: "Limite le nombre de lignes affichées dans le tableau pour éviter les surcharges mémoire", inputType: 'number', placeholder: '100000' },
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur SQL en mode client", tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur. En mode client, seul le résultat sera affiché.", inputType: 'checkbox' }
                    ],
                    defaults: { queries: [{ name: 'main', sql: 'SELECT * FROM source1 LIMIT 100', engine: 'sql', clientVisible: false }], maxRows: 100000 },
                    bodyFamily: 'sqlWithTable',
                    bodyConfig: { queryKey: 'query', showTextResult: false, showResultInfo: true },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true }, resultInfo: { showDevOnly: false } }
                },
                iframe: {
                    executeHandler: 'executeIframeCell',
                    defaultNamePrefix: 'iframe',
                    showInViewWhenResultOrRunning: true,
                    exportFields: ['queries'],
                    initProps: {},
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    specificParams: [
                        { key: 'queries.main.engine', label: 'Type de langage', tooltip: "SQL: requête retournant du HTML | JS: retourne une chaîne HTML | Texte: HTML saisi directement", inputType: 'select', options: [{ value: 'sql', label: 'SQL' }, { value: 'js', label: 'JavaScript' }, { value: 'text', label: 'Texte' }] },
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur SQL en mode client", tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur. En mode client, seul le résultat sera affiché.", inputType: 'checkbox' }
                    ],
                    defaults: { queries: [{ name: 'main', sql: '<html><body><h1>Hello</h1></body></html>', engine: 'text', clientVisible: false }] },
                    bodyFamily: 'sqlWithIframe',
                    bodyConfig: { useIframeEditor: true },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true } }
                },
                sqlStat: {
                    executeHandler: 'executeSqlStatCell',
                    defaultNamePrefix: 'sqlStat',
                    showInViewWhenResultOrRunning: true,
                    exportFields: ['queries', 'title', 'subtitle', 'icon'],
                    initProps: {},
                    commonParams: ['name', 'title', 'subtitle', 'icon', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    queryLabels: { main: 'Requête SQL' },
                    titleLabel: 'Titre de la stat',
                    titleTooltip: "Titre affiché au-dessus de la valeur statistique",
                    specificParams: [
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur SQL en mode client", tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur. En mode client, seul le résultat sera affiché.", inputType: 'checkbox' }
                    ],
                    defaults: { title: 'Total Lignes', subtitle: '', icon: 'material-symbols-light:join-right', queries: [{ name: 'main', sql: 'SELECT COUNT(*) FROM source1', engine: 'sql', clientVisible: false }] },
                    bodyFamily: 'sqlStat',
                    bodyConfig: { defaultIcon: 'mdi:information-outline', showResultInfoDevOnly: true },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true }, resultInfo: { showDevOnly: true } }
                },
                uiParameter: {
                    executeHandler: 'executeUiParameterCell',
                    defaultNamePrefix: 'param',
                    useNameAsReference: true,
                    namePattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                    exportFields: ['name', 'paramType', 'title', 'queries', 'inputType', 'rangeMin', 'rangeMax', 'rangeStep', 'userVisible', 'userEditable', 'preserveUserValue'],
                    initProps: { _value: '', _options: [], _initialized: false, _paramError: null },
                    commonParams: ['name', 'title', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    titleLabel: "Libellé",
                    titleTooltip: "Texte affiché à gauche du champ de saisie",
                    specificParams: [
                        { key: 'queries.main.engine', label: 'Type de langage', tooltip: "SQL: exécute une requête SQL | JS: exécute une expression JavaScript | Texte: valeur retournée directement sans moteur", inputType: 'select', options: [{ value: 'sql', label: 'SQL' }, { value: 'js', label: 'JavaScript' }, { value: 'text', label: 'Texte' }] },
                        { key: 'paramType', label: 'Type de composant', tooltip: "Choisissez le type de composant d'interface pour ce paramètre", inputType: 'select', options: [{ value: 'input', label: 'Champ texte (input)' }, { value: 'dropdown', label: 'Liste déroulante (dropdown)' }, { value: 'range', label: 'Curseur (range)' }] },
                        { key: 'userVisible', label: 'Visible en mode client', tooltip: "Si décoché, ce paramètre sera caché en mode client (paramètre intermédiaire)", inputType: 'checkbox' },
                        { key: 'userEditable', label: 'Modifiable par l\'utilisateur', tooltip: "Si décoché, l'utilisateur ne pourra pas modifier la valeur calculée par SQL", inputType: 'checkbox' },
                        { key: 'preserveUserValue', label: 'Préserver la valeur utilisateur lors de la ré-exécution', tooltip: "Si coché et que l'utilisateur a modifié la valeur, la ré-exécution de la cellule ne réinitialisera pas la valeur", inputType: 'checkbox' },
                        { key: 'inputType', label: 'Type de champ', tooltip: "Choisissez le type HTML du champ de saisie", inputType: 'select', when: { paramType: 'input' }, options: [{ value: 'text', label: 'Texte' }, { value: 'password', label: 'Mot de passe' }, { value: 'email', label: 'Email' }, { value: 'number', label: 'Nombre' }, { value: 'date', label: 'Date' }, { value: 'datetime-local', label: 'Date et heure' }, { value: 'week', label: 'Semaine' }, { value: 'month', label: 'Mois' }, { value: 'tel', label: 'Téléphone' }, { value: 'url', label: 'URL' }, { value: 'search', label: 'Recherche' }, { value: 'time', label: 'Heure' }] },
                        { key: 'rangeMin', label: 'Valeur minimum', tooltip: "Valeur minimale du curseur (défaut: 0)", inputType: 'number', when: { paramType: 'range' }, placeholder: '0' },
                        { key: 'rangeMax', label: 'Valeur maximum', tooltip: "Valeur maximale du curseur (défaut: 100)", inputType: 'number', when: { paramType: 'range' }, placeholder: '100' },
                        { key: 'rangeStep', label: 'Pas (step)', tooltip: "Incrément entre chaque valeur du curseur (défaut: 1)", inputType: 'number', when: { paramType: 'range' }, placeholder: '1', min: 0.001 }
                    ],
                    defaults: {
                        title: '',
                        paramType: 'input',
                        inputType: 'text',
                        rangeMin: 0, rangeMax: 100, rangeStep: 1,
                        userVisible: true, userEditable: true,
                        preserveUserValue: false,
                        queries: [{
                            name: 'main', sql: '',
                            engine: 'sql',
                            clientVisible: false
                        }]
                    },
                    bodyFamily: 'uiParameter',
                    bodyConfig: {
                        showDevRef: true,
                        paramTypes: ['input', 'dropdown', 'range']
                    },
                    bodyDisplay: { showSkeleton: { when: 'never' } }
                },
                publipostageWord: {
                    executeHandler: 'executePublipostageWordCell',
                    defaultNamePrefix: 'docx',
                    secondQueryName: 'filename',
                    skippedWhenButtonLabel: true,
                    exportTemplateBase64: true,
                    exportFields: ['queries', 'buttonLabel'],
                    exportFileSlot: 'docxTemplate',
                    initProps: { _isDragging: false },
                    initFileSlot: { slot: 'docxTemplate', asBlob: false },
                    commonParams: ['name', 'buttonLabel'],
                    queryCount: 2,
                    queryNames: ['main', 'filename'],
                    queryLabels: { main: 'Requête SQL (données)', filename: 'Requête nom de fichier' },
                    specificParams: [],
                    defaults: {
                        queries: [
                            { name: 'main', sql: 'SELECT * FROM source1 LIMIT 10', engine: 'sql', clientVisible: false },
                            { name: 'filename', sql: "SELECT 'document_' || STRFTIME(current_timestamp::TIMESTAMP, '%Y-%m-%d_%H-%M-%S') || '.docx' AS filename;", engine: 'sql', clientVisible: false }
                        ],
                        buttonLabel: 'Générer les documents'
                    },
                    bodyFamily: 'publipostageWord',
                    bodyConfig: {
                        fileSlot: 'docxTemplate',
                        fileKey: 'docxTemplateFileName',
                        fileBase64Key: 'docxTemplateBase64',
                        fileFileNameKey: 'docxTemplateFileName',
                        accept: '.docx', emptyIcon: 'material-symbols-light:description',
                        emptyTitle: 'Glissez-déposez votre template Word (.docx)',
                        emptySubtitle: 'Template de publipostage',
                        queryLabels: ['Requête de données', 'Requête de nom de fichier'],
                        defaultButtonLabel: 'Générer les documents',
                        buttonDisabledCondition: '!cellItem.cell.docxTemplateFileName'
                    }
                },
                pdfme: {
                    executeHandler: 'executePdfmeCell',
                    defaultNamePrefix: 'pdfme',
                    secondQueryName: 'filename',
                    skippedWhenButtonLabel: true,
                    exportFields: ['queries', 'json', 'buttonLabel'],
                    exportJsonMode: 'string',
                    initProps: {},
                    commonParams: ['name', 'queries', 'buttonLabel'],
                    queryCount: 2,
                    queryNames: ['main', 'filename'],
                    queryLabels: { main: 'Requête SQL (données pour le PDF)', filename: "Requête nom de fichier PDF" },
                    specificParams: [
                        { key: 'json', label: 'Template pdfme (JSON)', tooltip: "Template pdfme avec basePdf et schemas. Voir https://pdfme.com/docs/getting-started", inputType: 'textarea', rows: 15, placeholder: '{"basePdf": {...}, "schemas": [...]}' }
                    ],
                    defaults: {
                        json: '',
                        queries: [
                            { name: 'main', sql: "with v_source as (select * from source1 limit 10)\nSELECT 'Titre' as header, 'Pied de page' as footer, json_group_array(json_array(col1, col2, col3)) as datatable\nFROM v_source LIMIT 10", engine: 'sql', clientVisible: false },
                            { name: 'filename', sql: "SELECT '$loop' || '_2.pdf'", engine: 'sql', clientVisible: false }
                        ],
                        buttonLabel: '📑 Générer le PDF'
                    },
                    bodyFamily: 'pdfme',
                    bodyConfig: {
                        queryLabels: ['Requête de données', 'Requête nom de fichier PDF'],
                        jsonLabel: 'Template pdfme (JSON)',
                        jsonPlaceholder: '{"basePdf": {...}, "schemas": [...]}',
                        defaultButtonLabel: '📑 Générer le PDF'
                    }
                },
                echart: {
                    executeHandler: 'executeEchartCell',
                    defaultNamePrefix: 'echart',
                    showInViewWhenResultOrRunning: true,
                    exportFields: ['queries'],
                    initProps: { _echartInstance: null, _echartReady: false },
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    queryLabels: { main: 'Requête SQL (alias de colonnes = rôles visuels)' },
                    specificParams: [
                        {
                            key: 'queries.main.clientVisible',
                            label: "Afficher l'éditeur SQL en mode client",
                            tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur. En mode client, seul le graphique sera affiché.",
                            inputType: 'checkbox'
                        }
                    ],
                    defaults: {
                        queries: [{
                            name: 'main',
                            sql: "SELECT\n    month::XAXIS,\n    revenue::BARCHART AS \"Revenue\",\n    target::LINECHART  AS \"Target\"\nFROM (VALUES\n    ('Jan', 42000, 40000),\n    ('Feb', 38000, 40000),\n    ('Mar', 51000, 45000),\n    ('Apr', 47000, 45000),\n    ('May', 60000, 50000),\n    ('Jun', 55000, 50000)\n) t(month, revenue, target)",
                            engine: 'sql',
                            clientVisible: false
                        }]
                    },
                    bodyFamily: 'sqlWithEchart',
                    bodyConfig: { minHeight: '350px' },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true } }
                },
                perspective: {
                    executeHandler: 'executePerspectiveCell',
                    defaultNamePrefix: 'perspective',
                    exportFields: ['queries', 'json'],
                    exportJsonMode: 'object',
                    initProps: { _perspectiveReady: false, _perspectiveWorker: null, _perspectiveTable: null, _arrowTable: null },
                    commonParams: ['name', 'queries'],
                    queryCount: 1,
                    queryNames: ['main'],
                    queryLabels: { main: 'Requête SQL (données pour Perspective)' },
                    specificParams: [
                        { key: 'json.perspectiveConfig', label: 'Configuration Perspective (JSON optionnel)', tooltip: "Configuration JSON pour le viewer Perspective (group_by, columns, sort, plugin, theme, etc.)", inputType: 'textarea', rows: 10, placeholder: '{"plugin": "Datagrid", "theme": "Pro Dark", ...}' },
                        { key: 'perspectiveCdns', label: 'CDN Perspective.js à charger', tooltip: "Sélectionnez les modules CDN nécessaires", inputType: 'perspectiveCdns' },
                        { key: 'queries.main.clientVisible', label: "Afficher l'éditeur SQL en mode client", tooltip: "Si décoché, l'éditeur SQL ne sera visible qu'en mode développeur.", inputType: 'checkbox' }
                    ],
                    defaults: {
                        queries: [{ name: 'main', sql: 'SELECT * FROM source1', engine: 'sql', clientVisible: false }],
                        json: { perspectiveConfig: '' },
                        perspectiveCdns: { viewer: true, datagrid: true, d3fc: true, openlayers: false }
                    },
                    bodyFamily: 'sqlWithPerspective',
                    bodyConfig: { theme: 'Pro Light', minHeight: '400px' },
                    bodyDisplay: { showSkeleton: { excludeWhenSqlEditor: true } }
                }
            }
        };

        // ═══════════════════════════════════════════════════════════════════════════
        // HANDLERS PAR TYPE DE CELLULE (logique spécifique non factorisable)
        // ═══════════════════════════════════════════════════════════════════════════
        export const CELL_TYPE_HANDLERS = {
            uiParameter: {
                onInit(cell, newCell) {
                    if (cell.referenceName && (!cell.name || !String(cell.name).trim())) {
                        newCell.name = String(cell.referenceName).trim();
                    }
                },
                getExportValue(cell, field) {
                    if (field === 'name') return (cell.name || cell.referenceName || '').trim() || undefined;
                    return undefined;
                }
            },
            perspective: {
                onInit(cell, newCell) {
                    if (cell.json?.perspectiveConfig !== undefined) {
                        if (!newCell.json || typeof newCell.json !== 'object') newCell.json = {};
                        newCell.json.perspectiveConfig = cell.json.perspectiveConfig;
                    }
                }
            },
            publipostageWord: {
                onInit(cell, newCell) {
                    if (newCell.buttonLabel === undefined) newCell.buttonLabel = 'Générer les documents';
                }
            },
            pdfme: {
                onInit(cell, newCell) {
                    if (newCell.buttonLabel === undefined) newCell.buttonLabel = '📑 Générer le PDF';
                }
            }
        };
