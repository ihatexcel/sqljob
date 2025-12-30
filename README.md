# 🦆 sqlJob Notebook

**Client-side SQL notebook powered by DuckDB-WASM**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![DuckDB](https://img.shields.io/badge/DuckDB-WASM-blue)](https://duckdb.org/)
[![AI-Assisted Development](https://img.shields.io/badge/Development-AI--Assisted-purple)](https://cursor.sh)

> **I Hate Excel, so I built a simple, client-side SQL job runner.** 📊  
> 📥 Load, 🔄 transform, and 📈 visualize your data directly in the browser—no setup, no fuss. 🚀

---

## ✨ Features

- **🌐 Zero Setup**: Pure client-side execution—no server, no installation
- **📂 Multi-Source Support**: Load multiple CSV, Parquet, Excel files simultaneously
- **📓 Notebook Interface**: Organize your analysis in executable cells (Markdown, SQL, Charts, Tables)
- **📊 Plotly Visualizations**: Create interactive charts with full Plotly.js support
- **💾 Portable Exports**: Export standalone HTML files with embedded data
- **🔄 Auto-execution**: Configure cells to run automatically after data loads
- **🎨 Dark Mode UI**: Modern, responsive interface
- **📄 PDF Export**: Print-friendly output for reports

---

## ⚠️ Early Development Notice

**This project started on December 19, 2025 and is far from finalized.**

- 🚧 **Not production-ready** - Active development, APIs may change
- 🐛 **Expect bugs** - Testing and stabilization ongoing
- 📝 **Documentation incomplete** - Features being added daily
- 💡 **Feedback welcome** - Open issues/PRs to help shape the project

**Current status**: Experimental / Proof of concept  
**Use at your own risk** - Not recommended for critical workflows yet

---

## 🚀 Quick Start

### Option 1: Download & Open
1. Download [`index.html`](https://github.com/ihatexcel/sqljob/releases/latest)
2. Open it in your browser
3. Drag & drop your CSV/Excel file
4. Start querying with SQL!

### Option 2: Use Online
👉 [Try it now](https://ihatexcel.github.io/sqljob)

### Option 3: Build from Source
```bash
git clone https://github.com/ihatexcel/sqljob.git
cd sqljob
# Open index.html in your browser - that's it!
```
---

## 🎯 Use Cases

| Scenario | Solution |
|----------|----------|
| 📊 **Replace Excel Data Pipelines** | Distribute SQL-based data processing without requiring end-users to install anything |
| 🔄 **Power Query Alternative** | Share transformation logic as portable HTML—no Excel license needed |
| 📤 **Data Products for Non-Technical Users** | Package your SQL workflows into self-service tools colleagues can run in their browser |
| 🎓 **SQL Training Without Setup** | Give students/analysts a zero-install environment to learn data manipulation |
| 📈 **Quick Data QA/Validation** | Drop files, run checks, export results—2 minutes from raw data to insights |

---

## 🏗️ Architecture

### Cell Types

| Type | Description | Use Case |
|------|-------------|----------|
| 📝 **Markdown** | Rich text, HTML, SVG | Documentation, headers |
| 📂 **Sources** | File upload zones | Load CSV/Excel/Parquet |
| 🗄️ **SQL** | Execute queries | Data exploration |
| 📊 **Table** | Display results | Preview datasets |
| 📈 **Plot** | Plotly charts | Visualizations |
| 📤 **SQL Export** | Download results | Export transformed data |
| 🖼️ **Iframe** | Render HTML | Custom reports |

### Technology Stack

**Core:**
- [DuckDB-WASM](https://github.com/duckdb/duckdb-wasm) - In-browser SQL engine
- [Alpine.js](https://alpinejs.dev/)- Reactive UI framework

**UI Components:**
- [Tabulator](https://tabulator.info/) - Interactive tables
- [Plotly.js](https://plotly.com/javascript/) - Charting library
- [Marked.js](https://marked.js.org/) - Markdown rendering

**File Processing:**
- [SheetJS (xlsx)](https://sheetjs.com/) `0.18.5` - Excel parsing
---

## 🎨 Inspiration

This project draws inspiration from:

- [**SQLrooms**](https://sqlrooms.org/) - Production-ready data webapp leveraging DuckDB-WASM
- [**Perspective.js**](https://perspective.finos.org/) - Streaming data visualization (note: Plotly.js used here requires intermediate arrays, not streaming-capable)
- [**Huey**](https://github.com/rpbouman/huey) - Vanilla JS approach to DuckDB-WASM (no framework overhead)
- [**Power Query (Excel)**](https://support.microsoft.com/en-us/office/about-power-query-in-excel-7104fbee-9e62-4cb9-a02e-5bfb1a6c536a) - ETL for the masses

Special thanks to these projects for pioneering accessible data tools!

---

## 🤖 AI-Assisted Development

This project contains code generated and refined with:
- [Claude](https://claude.ai) (Anthropic)
- [Cursor](https://cursor.sh) (AI-powered IDE)

Human-written architecture, AI-assisted implementation. 🤝

---

## 📦 Configuration Format

sqlJob uses a JSON configuration format for cells:
```json
{
  "job": {
    "autoExecuteWithoutSources": false,
    "cells": [
      {
        "type": "markdown",
        "content": "# sqlJob ⚡💻\n## I Hate Excel, so I built a simple, client-side SQL job runner. 🛠️\n📥 Load, 🔄 transform, and 📊 visualize your data directly in the browser—no setup, no fuss. 🚀"
      },
      {
        "type": "sources",
        "autoRunNextCells": true,
        "sources": [
          {
            "name": "source1",
            "importText": "Glissez-déposez votre fichier ici",
            "query": "CREATE OR REPLACE TABLE source1 AS SELECT * FROM read_csv_auto('{fileNameUpload}', ALL_VARCHAR=true, HEADER=true)",
            "xlsx": {
              "options": {
                "type": "array",
                "raw": false,
                "dateNF": "dd/mm/yyyy",
                "cellDates": true,
                "cellNF": false,
                "cellText": false
              },
              "toCsvOptions": {
                "dateNF": "dd/mm/yyyy",
                "FS": ",",
                "RS": "\n"
              },
              "sheetSelection": {
                "type": {
                  "auto": true,
                  "index": false,
                  "name": false
                },
                "index": 0,
                "name": ""
              }
            }
          }
        ]
      },
      {
        "type": "table",
        "query": "SELECT * FROM source1 LIMIT 100",
        "maxRows": 1000
      },
      {
        "type": "sqlExport",
        "query": "COPY (SELECT * from source1) TO '{fileName}' (FORMAT CSV, HEADER, DELIMITER ';')",
        "fileNameQuery": "SELECT 'export_' || current_timestamp::text || '.csv' as file_name",
        "mimeType": ""
      },
      {
        "type": "plot",
        "query": "// Variables: container, Plotly, + les tables configurées\nconst limitedSource = source1.slice(0, 1000);\nconst x = limitedSource.map(r => Object.values(r)[0]);\nconst y = limitedSource.map(r => Object.values(r)[1]);\n\nPlotly.newPlot(container, [{\n    x: x,\n    y: y,\n    type: \"bar\"\n}], { title: \"Graphique\" });",
        "tables": "source1"
      }
    ]
  },
  "ui": {
    "devMode": true
  }
}
```

### Export Formats

- **JSON Config**: Portable configuration file
- **Base64 Config**: Embed in file
- **Standalone HTML**: Fully self-contained with embedded data
- **PDF**: Print-ready reports via browser print

---

## 🛠️ Development

### File Structure
```
sqljob/
├── index.html              # Main notebook interface
├── README.md
├── LICENSE
```

### Key Classes
```javascript
ConfigManager    // Configuration handling
FileHandler      // File I/O & compression
DuckDBManager    // Database operations
PlotlyManager    // Chart generation
```

**Requirements:**
- Modern browser with WASM support
- `CompressionStream` API (for exports)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **DuckDB Team** - For the incredible WASM build
- **Alpine.js Community** - For the reactive simplicity
- **Plotly Team** - For open-source charting
- **Open Source Community** - For the tools that made this possible

---

## 📬 Contact

**Théo Nobella-Pichonnier**

- 💼 LinkedIn: [Linkedin](https://fr.linkedin.com/in/th%C3%A9o-nobella-97a9b3157)

---

## ⭐ Star History

If this project helped you, consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=ihatexcel/sqljob&type=Date)](https://star-history.com/#ihatexcel/sqljob&Date)

---

**Made with ❤️ by Théo Nobella-Pichonnier**
*"I hate Excel, so I built this."* 
