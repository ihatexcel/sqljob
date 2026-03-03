# Plan de migration sqljob : HTML monolithique → React + Vite

## Contexte

`sqljob` est actuellement une application **full-static, zéro-serveur** distribuée comme un unique fichier `index.html` de ~9 900 lignes. Toute la logique (ConfigManager, DuckDBManager, GistEncrypt, CDNManager, rendu des cellules, etc.) est embarquée dans une balise `<script>` au fond du fichier, pilotée par Alpine.js.

**Problèmes actuels :**
- Impossible à tester unitairement (tout est dans le DOM)
- Maintenabilité catastrophique (9 900 lignes, un seul fichier)
- Pas de typage TypeScript
- Alpine.js limite l'expressivité et la composabilité

**Objectif final :** migrer vers la stack de `talshape-com/shaper` (Vite + React + TypeScript + TanStack Router + Tailwind CSS), tout en gardant une distribution **full-static sans serveur Node**. Dans un second temps (hors scope immédiat) : packager le build en web component CDN utilisable via `<sqljob-app>`.

---

## Stratégie de branches

| Branche | Rôle |
|---------|------|
| `main` | Production — jamais modifié directement pendant la migration |
| `react-refactoring` | Branche de travail principale pour toutes les phases 1→3 |
| `feat/*` | Sous-branches éventuelles par phase/composant, mergées dans `react-refactoring` |

> **Règle :** aucun commit de migration ne touche `main` avant que les phases 1 à 3 soient validées (build fonctionnel + tests verts).

---

## Phases de migration

### Phase 1 — Scaffolding Vite + extraction des classes métier *(branche : `react-refactoring`)*

**But :** Créer la structure de projet sans casser l'existant. Le build Vite produit un `index.html` fonctionnellement identique à l'actuel.

#### Fichiers à créer

```
sqljob/
├── package.json              # Vite, TypeScript, ESLint
├── vite.config.ts            # Config Vite (single-page, inline assets)
├── tsconfig.json             # Config TypeScript strict
├── tsconfig.node.json        # Pour vite.config.ts
├── index.html                # Shell HTML (remplace l'actuel, charge le bundle)
├── src/
│   ├── main.ts               # Point d'entrée (remplace le <script> monolithique)
│   ├── types/
│   │   └── index.ts          # Types partagés (Cell, Group, Page, Query, Config…)
│   ├── lib/
│   │   ├── ConfigManager.ts  # Extrait du HTML actuel (~ligne 1277)
│   │   ├── DuckDBManager.ts  # Extrait du HTML actuel (~ligne 2437)
│   │   ├── GistEncrypt.ts    # Extrait du HTML actuel (~ligne 2055)
│   │   ├── CDNManager.ts     # Extrait du HTML actuel
│   │   └── defaults.ts       # defaultConfigBase64 + CELL_TYPE_SCHEMAS
│   └── alpine/
│       ├── notebookApp.ts    # Fonction Alpine notebookApp() (~ligne 4486)
│       └── gistModal.ts      # Fonction Alpine gistPassphraseModal() (~ligne 2956)
```

#### Dépendances phase 1 (package.json)

```json
{
  "devDependencies": {
    "vite": "^5",
    "typescript": "^5",
    "@types/node": "^20"
  }
}
```

Alpine.js, DaisyUI, Tailwind Browser, Iconify restent chargés **via CDN** dans `index.html` — aucun changement pour l'utilisateur final.

#### Config Vite clé

```ts
// vite.config.ts
export default defineConfig({
  build: {
    // Tout inline dans index.html pour rester "single-file distributable"
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
  }
})
```

#### Résultat attendu

- `npm run build` → `dist/index.html` fonctionne identiquement à l'actuel
- Les classes `lib/` sont testables en isolation (Vitest)
- Alpine.js est toujours là, inchangé côté UX

---

### Phase 2 — Introduction React + TypeScript, migration composant par composant *(branche : `react-refactoring`)*

**But :** Remplacer Alpine.js progressivement, en commençant par les composants feuilles.

#### Nouvelles dépendances

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@tanstack/react-router": "latest",
    "tailwindcss": "^4"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "vitest": "^2",
    "@testing-library/react": "^16"
  }
}
```

#### Ordre de migration (du plus isolé au plus complexe)

1. **Modals** — `GistPassphraseModal`, `ExportModal`, `SettingsModal`
2. **Cellules feuilles** — `MarkdownCell`, `SqlCell`, `TableCell`, `ChartCell`
3. **GroupRenderer** — remplace `getCellsForPath()` + `getFlattenedGroupsForAllPages()`
4. **PageTabs** — gestion des onglets
5. **Navbar** — barre d'actions globales
6. **NotebookApp** — root React, remplace `notebookApp()` Alpine

#### Structure `src/` à l'issue de la phase 2

```
src/
├── main.tsx                  # ReactDOM.createRoot()
├── App.tsx                   # Root component + router
├── router.tsx                # TanStack Router config
├── types/index.ts
├── lib/                      # Inchangé depuis phase 1
│   ├── ConfigManager.ts
│   ├── DuckDBManager.ts
│   ├── GistEncrypt.ts
│   ├── CDNManager.ts
│   └── defaults.ts
├── store/
│   └── notebookStore.ts      # État global (Zustand ou Context + useReducer)
├── components/
│   ├── cells/
│   │   ├── MarkdownCell.tsx
│   │   ├── SqlCell.tsx
│   │   ├── TableCell.tsx
│   │   └── ChartCell.tsx
│   ├── groups/
│   │   └── GroupRenderer.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── PageTabs.tsx
│   └── modals/
│       ├── GistPassphraseModal.tsx
│       ├── ExportModal.tsx
│       └── SettingsModal.tsx
└── hooks/
    ├── useDuckDB.ts
    ├── useConfig.ts
    └── useExecution.ts
```

> **Note Tailwind :** passe du "browser bundle" CDN à l'intégration PostCSS Vite via `@tailwindcss/vite`. DaisyUI reste via CDN ou intégré selon la taille du bundle final.

---

### Phase 3 — Finalisation & nettoyage *(branche : `react-refactoring`)*

- Suppression complète d'Alpine.js
- Tests unitaires Vitest sur les classes `lib/`
- Tests composants avec Testing Library
- CI GitHub Actions : `npm run build` + `npm test`
- Optimisation du bundle (tree-shaking DuckDB-WASM)
- **Merge `react-refactoring` → `main`** une fois build + tests verts

---

### Phase 4 — Web Component CDN *(HORS SCOPE IMMÉDIAT — à planifier après phase 3)*

**Concept (inspiré de PerspectiveJS / `<perspective-viewer>`) :**

L'utilisateur final n'écrit que :
```html
<script src="https://cdn.jsdelivr.net/npm/sqljob@latest/dist/sqljob.js"></script>
<sqljob-app config="..."></sqljob-app>
```

**Implémentation envisagée :**

- `src/web-component/index.ts` — Custom Element `<sqljob-app>` via `customElements.define()`
- React monté dans un Shadow DOM ou light DOM (à décider selon contraintes CSS)
- Config Vite dédiée `vite.config.web-component.ts` en mode `lib` + `formats: ['es', 'umd']`

**Question ouverte :** bundler React dans le build (self-contained, ~140 KB gzip) ou le déclarer `external` (l'hôte doit fournir React) ?

---

## Fichiers critiques de l'état actuel

| Fichier | Contenu concerné |
|---------|-----------------|
| `index.html` (~9 900 lignes) | Tout — shell HTML + CSS inline + logique Alpine.js |
| `index.html:1277` | Début classe `ConfigManager` |
| `index.html:2055` | Début classe `GistEncrypt` |
| `index.html:2437` | Début classe `DuckDBManager` |
| `index.html:2956` | Début fonction `gistPassphraseModal()` Alpine |
| `index.html:4486` | Début fonction `notebookApp()` Alpine (root component) |

## Classes/fonctions à porter (ne pas réécrire from scratch)

- `ConfigManager` → `src/lib/ConfigManager.ts`
- `DuckDBManager` → `src/lib/DuckDBManager.ts`
- `GistEncrypt` → `src/lib/GistEncrypt.ts`
- `CELL_TYPE_SCHEMAS` + `formatValueForInputType()` → `src/lib/defaults.ts`

---

## Checklist de régression fonctionnelle (à valider à chaque phase)

- [ ] Chargement et déchiffrement de config Gist chiffrée
- [ ] Exécution SQL sur DuckDB-WASM (CSV, Parquet, Excel)
- [ ] Rendu cellules (Markdown, SQL, Table, Chart)
- [ ] Export DOCX (PizZip + Docxtemplater)
- [ ] Export PDF (PDFMe)
- [ ] Drag & drop des pages/groupes/cellules
- [ ] Changement de thème DaisyUI

## Commandes de vérification

```bash
# Phase 1
npm install && npm run build
# Ouvrir dist/index.html dans le navigateur — doit être identique à l'actuel

# Phase 2+
npm run dev       # Dev server Vite avec HMR
npm test          # Vitest sur les classes lib/
npm run build     # dist/index.html standalone fonctionnel
```
