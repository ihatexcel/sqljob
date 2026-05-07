# sqljob

A browser-based tool for building shareable ETL pipelines and calculator interfaces — no server, no GAFAM, no cloud dependency.

**[Try it →](https://ihatexcel.github.io/sqljob)**

---

## Purpose

sqljob is designed for analysts and developers who need to build and share **data processing workflows** ("moulinettes") without relying on cloud infrastructure or proprietary tools.

The typical use case: you write SQL transformations, wire up input parameters, and package the whole thing as a single portable file — a JSON configuration, or a standalone HTML that embeds both the app and the data (Base64-encoded). The recipient opens it in a browser. No login, no server, no Excel.

Use it to build:
- ETL pipelines that run entirely client-side (DuckDB-WASM)
- Calculator or simulation interfaces driven by SQL
- Self-contained data reports shareable as a single HTML file
- Parameterized notebooks distributed via GitHub Gist (with optional encryption)

---

## What it does

- Load CSV, Parquet, and Excel files directly into DuckDB
- Write SQL across multiple notebook pages with grouped, auto-executable cells
- Generate charts using SQL role syntax: `SELECT date::XAXIS, revenue::BARCHART FROM sales`
- Build dynamic reports with parameters, conditional groups, and Univer spreadsheet cells
- Export to standalone HTML (data embedded as Base64), JSON config, or PDF
- Share via GitHub Gist with optional passphrase encryption
- Embed as a web component via CDN: `<sqljob-app>`

---

## Quick start

```bash
git clone https://github.com/ihatexcel/sqljob.git
cd sqljob
npm install
npm run dev
```

Or use it directly online — no installation needed.

---

## Stack

| Layer | Technology |
|---|---|
| SQL engine | [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview.html) 1.5.2 |
| UI framework | React 18 + [sqlrooms](https://sqlrooms.org/) |
| State | Zustand 5 |
| Build | Vite 5 + TypeScript |
| Styling | Tailwind CSS 4 |
| Charts | ECharts 5 |
| Spreadsheet | Univer |

---

## Development

```bash
npm run dev          # dev server (localhost:5173)
npm run build        # production build → dist/
npm run dev:cdn      # CDN web-component dev (localhost:5174)
```

The CI pipeline (`deploy.yml`) handles the CDN bundle build and GitHub Pages deployment automatically on push to `main`, `beta`, or `claude/dev`.

---

## Project structure

```
src/
  app/
    components/       # React components (panels, cells, modals)
    store/
      notebookStore.ts     # Main Zustand store
      slices/              # Feature slices (cells, execution, export…)
    room.tsx          # Root layout (RoomShell)
  lib/
    DuckDBManager.ts  # DuckDB singleton
    ConfigManager.ts  # Notebook config (load, save, Gist)
    EChartSqlParser.ts# SQL → ECharts config
    CDNManager.ts     # Dynamic CDN library loader
  web-component/
    sqljob-app.ts     # <sqljob-app> custom element
```

---

## License

AGPL-3.0 — © Théo Nobella-Pichonnier
