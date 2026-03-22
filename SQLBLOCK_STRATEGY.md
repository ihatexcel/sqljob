# Stratégie SqlBlock — Catalogue de transformations DuckDB

## Philosophie

Inspiré de :
- **PRQL** — pipeline orthogonal (un seul moyen d'exprimer chaque opération), 12 primitives suffisent
- **Power Query** — catalogue exhaustif d'étapes visuelles, chaque clic génère du code
- **Omni** — modélisation en couches (raw → governed → aggregate)
- **Hex** — DuckDB natif, chaînage de cellules, SQL cells = first-class citizens

**Principe central** : chaque step est une transformation pure `table → table`, exprimable en SQL DuckDB valide,
réversible en AST, prévisualisable via l'icône œil.

---

## État actuel (P0 — implémenté)

| Step | SQL DuckDB | Description |
|------|-----------|-------------|
| `select_columns` | `SELECT col1, col2 FROM src` | Garde un sous-ensemble de colonnes |
| `exclude_columns` | `SELECT * EXCLUDE (col1, col2) FROM src` | Retire des colonnes |
| `change_type` | `SELECT * REPLACE (CAST(col AS TYPE) AS col) FROM src` | Change le type d'une colonne |

---

## P1 — Essentiels data analyst (prochaine itération)

Ces 6 steps couvrent ~80% des besoins quotidiens d'un data analyst.

### `filter_rows` — Filtrer des lignes

```sql
SELECT * FROM src WHERE <condition>
```

**UI :** Constructeur de conditions visuelles (colonne / opérateur / valeur).
Opérateurs : `=`, `≠`, `>`, `<`, `≥`, `≤`, `IN (...)`, `NOT IN`, `IS NULL`, `IS NOT NULL`, `LIKE`, `ILIKE`, `BETWEEN`.
Possibilité d'ajouter plusieurs conditions avec AND / OR.
Bouton "Mode SQL libre" pour les cas complexes (expr DuckDB directe).

```typescript
interface FilterRowsStep {
    type: 'filter_rows';
    conditions: FilterCondition[];
    logicOp: 'AND' | 'OR';   // opérateur entre les conditions
}
interface FilterCondition {
    column: string;
    op: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'not_in' | 'is_null' | 'not_null' | 'like' | 'ilike' | 'between';
    value: string | string[] | [string, string]; // string[] pour IN, tuple pour BETWEEN
    rawSql?: string;  // mode SQL libre (op = 'raw')
}
```

---

### `sort` — Trier

```sql
SELECT * FROM src ORDER BY col1 ASC, col2 DESC NULLS LAST
```

**UI :** Liste de colonnes avec sélecteur ASC/DESC et NULLS FIRST/LAST.

```typescript
interface SortStep {
    type: 'sort';
    keys: SortKey[];
}
interface SortKey {
    column: string;
    direction: 'asc' | 'desc';
    nulls: 'first' | 'last';
}
```

---

### `top_n` — Limiter / échantillonner

```sql
-- Mode limit :
SELECT * FROM src LIMIT 100 OFFSET 50

-- Mode sample (DuckDB natif) :
SELECT * FROM src USING SAMPLE 10%
SELECT * FROM src USING SAMPLE 500 ROWS
```

**UI :** Toggle entre Limit (N lignes + offset optionnel) et Sample (% ou N rows, méthode : reservoir/bernoulli/system).

```typescript
interface TopNStep {
    type: 'top_n';
    mode: 'limit' | 'sample_percent' | 'sample_rows';
    n: number;
    offset?: number;         // pour mode limit
    sampleMethod?: 'reservoir' | 'bernoulli' | 'system';
}
```

---

### `rename_columns` — Renommer des colonnes

```sql
SELECT * RENAME (old_name AS new_name, old2 AS new2) FROM src
-- Fallback si plusieurs renames complexes :
SELECT col1 AS new1, col2 AS new2, ... FROM src
```

**UI :** Tableau de mapping old → new. Colonne old = select, colonne new = input texte.

```typescript
interface RenameColumnsStep {
    type: 'rename_columns';
    renames: { from: string; to: string }[];
}
```

---

### `derive` — Ajouter / calculer une colonne

```sql
SELECT *, <expr> AS new_column FROM src
-- Ou remplacer une colonne existante :
SELECT * REPLACE (<expr> AS col) FROM src
```

**UI :** Champ "Nom de colonne" + éditeur d'expression SQL (avec suggestions de colonnes).
Checkbox "Remplacer la colonne source" si le nom existe déjà.
Shortuts : templates d'expressions communes (UPPER, ROUND, DATE_TRUNC, CONCAT...).

```typescript
interface DeriveStep {
    type: 'derive';
    columns: DeriveColumn[];
}
interface DeriveColumn {
    name: string;       // nouveau nom de colonne
    expr: string;       // expression SQL DuckDB (ex: "UPPER(first_name)")
    replace: boolean;   // true → REPLACE, false → ajout avec SELECT *
}
```

---

### `fill_null` — Remplacer les nulls

```sql
-- Par valeur :
SELECT * REPLACE (COALESCE(col, 'valeur') AS col) FROM src
-- Par colonne (forward fill via window) :
SELECT * REPLACE (LAST_VALUE(col IGNORE NULLS) OVER (ORDER BY rowid) AS col) FROM src
```

**UI :** Pour chaque colonne : sélecteur de stratégie (valeur fixe / moyenne / médiane / 0 / "vide") + champ valeur si fixe.

```typescript
interface FillNullStep {
    type: 'fill_null';
    fills: FillNullEntry[];
}
interface FillNullEntry {
    column: string;
    strategy: 'value' | 'mean' | 'median' | 'zero' | 'empty_string';
    value?: string;     // uniquement si strategy = 'value'
}
```

---

## P2 — Reshaping & combinaison

Ces steps couvrent les transformations structurelles : agrégation, jointure, pivot.

### `group_by` — Agréger / grouper

```sql
SELECT
    col1, col2,
    SUM(montant) AS total_montant,
    COUNT(*) AS nb_lignes,
    AVG(score) AS score_moyen
FROM src
GROUP BY col1, col2
```

**UI :**
- Sélection des colonnes de regroupement (drag & drop)
- Ajout de métriques : colonne cible + fonction (COUNT, SUM, AVG, MIN, MAX, COUNT DISTINCT, MEDIAN, STDDEV, STRING_AGG...)
- Nom de la colonne résultante éditable

```typescript
interface GroupByStep {
    type: 'group_by';
    groupCols: string[];
    aggregations: Aggregation[];
}
interface Aggregation {
    column: string;         // colonne source ('*' pour COUNT(*))
    fn: 'count' | 'count_distinct' | 'sum' | 'avg' | 'min' | 'max' | 'median' | 'stddev' | 'string_agg' | 'list';
    alias: string;          // nom de la colonne résultante
    separator?: string;     // pour string_agg
}
```

---

### `join` — Joindre une table

```sql
SELECT src.*, right."col1", right."col2"
FROM src
LEFT JOIN other_table AS right
ON src."key" = right."key"
```

**UI :**
- Sélection de la table de droite (dropdown des tables DuckDB)
- Type de jointure : LEFT, INNER, RIGHT, FULL OUTER, CROSS, ANTI
- Conditions de jointure : col gauche = col droite (multi-clés)
- Sélection des colonnes à importer depuis la table de droite

```typescript
interface JoinStep {
    type: 'join';
    rightTable: string;
    joinType: 'left' | 'inner' | 'right' | 'full' | 'cross' | 'anti';
    on: JoinCondition[];
    selectRight: string[] | '*';   // colonnes à garder de la table droite
}
interface JoinCondition {
    left: string;
    right: string;
}
```

---

### `union` — Empiler des tables (UNION)

```sql
SELECT * FROM src
UNION ALL
SELECT * FROM other_table
-- Ou UNION (dédoublonnage) :
SELECT * FROM src
UNION
SELECT * FROM other_table
```

**UI :** Sélection de la table à empiler, toggle UNION / UNION ALL, aperçu des colonnes appariées.

```typescript
interface UnionStep {
    type: 'union';
    table: string;
    mode: 'all' | 'distinct';
}
```

---

### `pivot` — Pivoter (lignes → colonnes)

```sql
-- DuckDB PIVOT natif
PIVOT src
ON status
USING SUM(amount)
GROUP BY category
```

**UI :**
- Colonne à pivoter (valeurs → colonnes)
- Colonne(s) de valeur + fonction d'agrégation
- Colonne(s) de regroupement (rows)

```typescript
interface PivotStep {
    type: 'pivot';
    onColumn: string;       // colonne dont les valeurs deviennent des colonnes
    valueColumn: string;    // colonne à agréger
    valueFn: string;        // SUM, COUNT, AVG...
    groupCols: string[];    // colonnes conservées en lignes
}
```

---

### `unpivot` — Dépivoter (colonnes → lignes)

```sql
-- DuckDB UNPIVOT natif
UNPIVOT src
ON jan, feb, mar
INTO
    NAME month
    VALUE amount
```

**UI :**
- Sélection des colonnes à "fondre" en lignes
- Nom de la colonne de labels (ex: "mois")
- Nom de la colonne de valeurs (ex: "montant")

```typescript
interface UnpivotStep {
    type: 'unpivot';
    columns: string[];      // colonnes à transformer en lignes
    nameCol: string;        // nom de la colonne label
    valueCol: string;       // nom de la colonne valeur
}
```

---

## P3 — DuckDB avancé

Ces steps exploitent les fonctionnalités natives DuckDB non disponibles dans les autres outils.

### `window` — Fonctions de fenêtre

```sql
SELECT *,
    ROW_NUMBER() OVER (PARTITION BY category ORDER BY date DESC) AS rn,
    SUM(amount) OVER (PARTITION BY category) AS total_par_cat,
    LAG(amount, 1) OVER (ORDER BY date) AS amount_prev
FROM src
```

**UI :**
- Fonction (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, SUM, AVG, COUNT, FIRST_VALUE, LAST_VALUE, NTILE...)
- Colonne de valeur (si applicable)
- PARTITION BY (colonnes)
- ORDER BY (colonnes + direction)
- Nom de la colonne résultante
- Frame optionnel (ROWS BETWEEN ... AND ...)

```typescript
interface WindowStep {
    type: 'window';
    columns: WindowColumn[];
}
interface WindowColumn {
    fn: string;             // 'ROW_NUMBER', 'SUM', 'LAG'...
    col?: string;           // colonne source (pour SUM, LAG...)
    partitionBy: string[];
    orderBy: SortKey[];
    alias: string;
    frame?: string;         // ex: 'ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW'
    offset?: number;        // pour LAG/LEAD
}
```

---

### `unnest` — Exploser les arrays/structs

```sql
-- Array :
SELECT src.*, unnested.tag
FROM src, UNNEST(src.tags) AS t(tag)

-- DuckDB json/struct :
SELECT src.*, json_each.key, json_each.value
FROM src, json_each(src.metadata)
```

**UI :**
- Sélection de la colonne array/JSON
- Nom de la colonne résultante
- Checkbox "Conserver les lignes sans valeur" (LEFT JOIN vs CROSS JOIN)

```typescript
interface UnnestStep {
    type: 'unnest';
    column: string;
    alias: string;
    keepEmpty: boolean;     // LEFT vs INNER join UNNEST
}
```

---

### `json_extract` — Extraire du JSON

```sql
SELECT *,
    src.payload->>'$.user.name' AS user_name,
    json_extract_string(src.payload, '$.user.email') AS user_email
FROM src
```

**UI :**
- Colonne JSON source
- Liste d'extractions : chemin JSONPath + nom de colonne résultante + type cible

```typescript
interface JsonExtractStep {
    type: 'json_extract';
    column: string;
    extractions: { path: string; alias: string; targetType?: string }[];
}
```

---

### `date_trunc` — Tronquer / extraire des dates

```sql
SELECT * REPLACE (
    DATE_TRUNC('month', event_date) AS event_date
) FROM src
-- Ou ajout d'une colonne dérivée :
SELECT *, DATE_TRUNC('week', event_date) AS event_week FROM src
```

**UI :**
- Colonne date source
- Granularité : second, minute, hour, day, week, month, quarter, year
- Mode : remplacer la colonne ou créer une nouvelle colonne

```typescript
interface DateTruncStep {
    type: 'date_trunc';
    column: string;
    granularity: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    mode: 'replace' | 'add';
    alias?: string;   // uniquement si mode = 'add'
}
```

---

## Tableau de bord récapitulatif

| Step | Priorité | SQL DuckDB | Complexité UI | Valeur métier |
|------|----------|-----------|--------------|---------------|
| `select_columns` | ✅ P0 | SELECT cols | Simple | ★★★ |
| `exclude_columns` | ✅ P0 | SELECT * EXCLUDE | Simple | ★★★ |
| `change_type` | ✅ P0 | REPLACE CAST | Simple | ★★★ |
| `filter_rows` | 🔜 P1 | WHERE | Moyen | ★★★★★ |
| `sort` | 🔜 P1 | ORDER BY | Simple | ★★★★ |
| `top_n` | 🔜 P1 | LIMIT / USING SAMPLE | Simple | ★★★ |
| `rename_columns` | 🔜 P1 | RENAME / AS | Simple | ★★★★ |
| `derive` | 🔜 P1 | SELECT *, expr AS col | Moyen | ★★★★★ |
| `fill_null` | 🔜 P1 | COALESCE / REPLACE | Moyen | ★★★★ |
| `group_by` | 📅 P2 | GROUP BY + agg | Complexe | ★★★★★ |
| `join` | 📅 P2 | JOIN | Complexe | ★★★★★ |
| `union` | 📅 P2 | UNION ALL | Simple | ★★★★ |
| `pivot` | 📅 P2 | PIVOT (DuckDB natif) | Moyen | ★★★★ |
| `unpivot` | 📅 P2 | UNPIVOT (DuckDB natif) | Moyen | ★★★ |
| `window` | 🔮 P3 | OVER (PARTITION BY) | Complexe | ★★★★ |
| `unnest` | 🔮 P3 | UNNEST | Moyen | ★★★ |
| `json_extract` | 🔮 P3 | json_extract_string | Moyen | ★★★ |
| `date_trunc` | 🔮 P3 | DATE_TRUNC | Simple | ★★★★ |

---

## Architecture d'implémentation

### Principe CTE chain (déjà en place)

Chaque step génère un CTE `_sqlblock_s0`, `_sqlblock_s1`… Le SQL final sélectionne depuis le dernier CTE.
Pour les steps qui requièrent des syntaxes non-SELECT (PIVOT, UNPIVOT, UNION), on les wrap dans des sous-requêtes.

```sql
-- Exemple : filter → sort → top_n
WITH
  _sqlblock_s0 AS (SELECT * FROM source WHERE status = 'active'),
  _sqlblock_s1 AS (SELECT * FROM _sqlblock_s0 ORDER BY date DESC),
  _sqlblock_s2 AS (SELECT * FROM _sqlblock_s1 LIMIT 100)
SELECT * FROM _sqlblock_s2
```

### Cas spéciaux DuckDB

```sql
-- PIVOT wrap en sous-requête
WITH _sqlblock_s0 AS (...),
_sqlblock_s1 AS (PIVOT _sqlblock_s0 ON status USING SUM(amount) GROUP BY category)
SELECT * FROM _sqlblock_s1

-- UNION (table externe)
WITH _sqlblock_s0 AS (...),
_sqlblock_s1 AS (SELECT * FROM _sqlblock_s0 UNION ALL SELECT * FROM other_table)
SELECT * FROM _sqlblock_s1
```

### Fichiers à modifier

| Fichier | Rôle |
|---------|------|
| `src/lib/SqlBlockTypes.ts` | Ajouter les nouvelles interfaces de step |
| `src/lib/SqlBlockService.ts` | Ajouter `astToSql` cases + `sqlToAst` parsers |
| `src/app/components/sqlblock/SqlBlockEditor.tsx` | Ajouter les composants UI par step |

### Ordre d'implémentation recommandé P1

1. **`sort`** — Le plus simple, SQL trivial, UI immédiate (drag & drop de clés)
2. **`top_n`** — SQL trivial (LIMIT), UI simple, USING SAMPLE = différenciateur DuckDB
3. **`rename_columns`** — SQL trivial (RENAME), UI = tableau from/to
4. **`filter_rows`** — Le plus impactant, constructeur de conditions (colonne/op/valeur)
5. **`derive`** — Éditeur d'expression (réutilise Monaco inline), replace ou add
6. **`fill_null`** — COALESCE wrapping, dépend de derive pour les cas avancés

---

## Notes de design UI

- **Cohérence visuelle** : chaque step a un header avec (œil | numéro | label | ▲▼ ✕ ▸)
- **Aperçu systématique** : l'icône œil sur chaque step → résultat dans le DataTable gauche (LIMIT 10 dans `_sqlblock` schema)
- **SQL généré** : colonne Monaco toggle à droite (lecture + édition manuelle avec bascule mode dégradé)
- **Colonnes contextuelles** : chaque step voit uniquement les colonnes disponibles EN SORTIE de l'étape précédente (`computeStepSchemas`)
- **Feedback d'erreur** : si le SQL généré échoue, afficher l'erreur DuckDB directement sous le step concerné
- **Templates** : pour `derive`, proposer des templates d'expressions par catégorie (string, date, math, conditional)
