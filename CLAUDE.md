# CLAUDE.md — Règles pour Claude sur le projet sqljob

## Branches & Git

### Branches principales

| Branche | Rôle | GitHub Pages |
|---------|------|-------------|
| `main`  | Production | `/` (racine) |
| `beta`  | Recette / pré-prod | `/beta` |
| `claude/dev` | Intégration continue | `/dev` |

### Règles de développement

- **Ne jamais committer directement sur `main` ou `beta`.** Tout développement se fait sur une branche `claude/<feature>`.
- Une fois la feature terminée, **merger directement** la branche `claude/<feature>` dans `claude/dev` (pas de PR pour cette étape).
- La promotion vers les branches supérieures se fait par PR : `claude/dev` → `beta` → `main`.
- Toujours committer et pousser les changements sur la branche de travail désignée avant de merger dans `claude/dev`.

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
- **`@sqlrooms/room-shell`** : layout mosaic (panneaux redimensionnables), sidebar, `RoomShell` / `RoomPanel` / `RoomShell.Sidebar` / `RoomShell.SidebarButtons` / `RoomShell.LayoutComposer` / `RoomShell.LoadingProgress` / `RoomShell.CommandPalette`.
- **`@sqlrooms/ui`** : composants Shadcn/Radix (Button, Input, Tooltip, useToast, ThemeSwitch…).
- **`@sqlrooms/dropzone`** : `FileDropzone` — drag & drop de fichiers.
- **`@sqlrooms/sql-editor`** : éditeur SQL CodeMirror.
- **`@sqlrooms/utils`** : utilitaires (`convertToValidColumnOrTableName`…).
- Version fixée : `0.29.0-rc.1`.
- ⚠️ **Mise à jour rc.2 bloquée** (mai 2026) : `@sqlrooms/codemirror@0.29.0-rc.2` et `@sqlrooms/pivot@0.29.0-rc.2` ont été publiés avec des références `workspace:*` non résolues, rendant toute la chaîne de dépendances inutilisable hors monorepo. Attendre rc.3 pour l'upgrade.
- **APIs rc.1 disponibles mais pas encore utilisées** : `createRoomStore`, `createPersistHelpers`, `persistSliceConfigs`, `RoomShell.SidebarButtons`, `RoomShell.LoadingProgress`, `RoomShell.CommandPalette`, `ThemeSwitch`.

### State management — Zustand
- Store principal : `src/app/store/notebookStore.ts`
- Store créé via `createRoomStore<NotebookState>()` de `@sqlrooms/room-shell` — retourne `{ roomStore, useNotebookStore }`.
- `roomStore` est le store brut passé à `<RoomShell roomStore={roomStore}>` ; `useNotebookStore` est le hook React.
- Le store fusionne les slices sqlrooms (roomShell, sqlEditor, cells, notebook, canvas) et les 9 slices Zustand purs (pages, helpers, parameters, export, groups, cells, files, execution, copyPaste).
- La slice RoomShell (`createRoomShellSlice`) gère le layout mosaic et l'état des panneaux.
- Le layout est persisté via `persistSliceConfigs` (clé localStorage `sqljob-layout-state-v1`).

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
