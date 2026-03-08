# CLAUDE.md — Règles pour Claude sur le projet sqljob

## Branches & Git

### Branches principales

| Branche | Rôle | GitHub Pages |
|---------|------|-------------|
| `main`  | Production | `/` (racine) |
| `beta`  | Recette / pré-prod | `/beta` |
| `claude/dev` | Intégration continue | `/dev` |

### Règles de développement

- **Ne jamais committer directement sur `main`, `beta` ou `claude/dev`.** Tout développement se fait sur une branche `claude/<feature>`.
- Chaque branche `claude/<feature>` doit faire l'objet d'une **Pull Request** vers `claude/dev` avant tout merge.
- La promotion se fait par PR : `claude/dev` → `beta` → `main`.
- Toujours committer et pousser les changements sur la branche de travail désignée.

## Build CDN

- **Ne jamais lancer `npm run build:cdn` manuellement.** Le build du bundle `dist-cdn/` est géré par GitHub Actions :
  - `build-cdn.yml` : build déclenché manuellement (`workflow_dispatch`), commit sur `main`.
  - `deploy.yml` : build + déploiement GitHub Pages à chaque push sur `main`, `beta` ou `dev`.
    - `main` → déploie sur `/` via `peaceiris/actions-gh-pages` (branche `gh-pages`, racine)
    - `beta` → déploie sur `/beta` (branche `gh-pages`, sous-dossier `beta/`)
    - `dev` → déploie sur `/dev` (branche `gh-pages`, sous-dossier `dev/`)
  - ⚠️ GitHub Pages doit être configuré sur **Source : Deploy from a branch → `gh-pages` / `/ (root)`**.
- Ne pas committer les fichiers `dist-cdn/` sauf si explicitement demandé.

## Stack technique

### Framework UI — sqlrooms
- **`@sqlrooms/room-shell`** : layout mosaic (panneaux redimensionnables), sidebar avec boutons toggle par panneau, `RoomShell` / `RoomPanel` / `RoomShell.Sidebar` / `RoomShell.LayoutComposer`.
- **`@sqlrooms/ui`** : composants Shadcn/Radix (Button, Input, Tooltip, useToast…).
- **`@sqlrooms/dropzone`** : `FileDropzone` — drag & drop de fichiers.
- **`@sqlrooms/sql-editor`** : éditeur SQL CodeMirror.
- **`@sqlrooms/utils`** : utilitaires (`convertToValidColumnOrTableName`…).
- Version fixée : `0.29.0-rc.1`.

### State management — Zustand
- Store principal : `src/app/store/notebookStore.ts`
- Le store fusionne via un proxy `this → get/set` les 9 mixins Alpine migrés : `pagesMixin`, `helpersMixin`, `groupsMixin`, `cellsMixin`, `filesMixin`, `executionMixin`, `parametersMixin`, `editorsMixin`, `exportImportMixin`.
- La slice RoomShell (`createRoomShellSlice`) gère le layout mosaic et l'état des panneaux.

### DuckDB
- **Instance unique** : `src/lib/DuckDBManager.ts` — singleton statique partagé par toutes les cells et le dropzone.
- Deux moteurs possibles : `duckdb-wasm` (défaut) et `ducklings`.
- **`addRoomFile`** est overridé dans le store pour passer par `DuckDBManager` au lieu du connecteur sqlrooms (`get().db`).
- `refreshDuckdbTables()` (helpersMixin) synchronise `_duckdbTables` (état React) avec les tables réelles de DuckDB après chaque chargement.

### Rendu
- React 18 + Vite 5 + Tailwind CSS 4.
- Les icônes utilisent `@iconify/iconify` (data-icon sur des `<span>`).
- Les cellules SQL/Table utilisent SimpleDatatables pour l'affichage des résultats.

## Arborescence clé

```
src/
  app/
    components/         # Composants React (DataSourcesPanel, NotebookPanel, modals…)
    mixins/             # 9 mixins logique métier (ex-Alpine)
    store/
      notebookStore.ts  # Store Zustand principal
    room.tsx            # Composant racine (RoomShell)
  lib/
    DuckDBManager.ts    # Singleton DuckDB (init, requêtes, fichiers)
    ConfigManager.ts    # Config notebook (groupes, cells, pages)
    CDNManager.ts       # Chargement dynamique de libs CDN
.github/workflows/
  build-cdn.yml         # Build manuel dist-cdn → commit main
  deploy.yml            # Build + deploy GitHub Pages (main→/, beta→/beta, dev→/dev)
```
