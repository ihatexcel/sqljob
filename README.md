# sqljob

Client-side SQL notebook powered by DuckDB-WASM. Load files, write SQL, build charts and reports — entirely in the browser, no server required.

**[Try it →](https://ihatexcel.github.io/sqljob)**

---

## What it does

- Load CSV, Parquet, and Excel files directly into DuckDB
- Write SQL across multiple notebook pages with grouped, auto-executable cells
- Generate charts using SQL role syntax: `SELECT date::XAXIS, revenue::BARCHART FROM sales`
- Build dynamic reports with parameters, conditional groups, and Univer spreadsheet cells
- Export to standalone HTML, PDF, or share via GitHub Gist (with optional encryption)
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

MIT — © Théo Nobella-Pichonnier
