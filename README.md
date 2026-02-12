# AI & Digital for Industry Navigator

Static HTML/CSS/JS demo (UNIDO branding). No build step; runs with any static file server.

## How to run

Because the demo loads `data/demo.json` via `fetch()`, use a local server (avoids CORS; don’t open `file://`):

- **Node (no install):** from this folder run  
  `node serve.js`  
  Then open **http://localhost:8080** (default port; set `PORT` to override). (or the port shown in the console; set `PORT` env var to use another port).

- **npx serve:** from this folder run  
  `npx serve -p 8080`  
  Then open **http://localhost:8080**

- **Python:** from this folder run  
  `python -m http.server 8080`  
  Then open **http://localhost:8080**

## Contents

- **index.html** – Home: hero, pillar filter, country selector, country card overlay.
- **country.html** – Country detail (use `?code=SGP` etc.); breadcrumb, flag, score ring, pillars.
- **about.html**, **data.html**, **methodology.html** – Minimal pages with same header/footer.
- **fourlevel.html** – Four-Level Framework hub (Level 1 to Level 4 workflow).
- **data/demo.json** – Countries, pillars, scores, and definitions (generated from UNDP raw data).
- **data/four-level-framework.json** – Shared schema + starter datasets for Levels 2-4.
- **css/global.css** – Global styles (no Tailwind; Tailwind is loaded via CDN in the HTML).
- **js/app.js** – Vanilla JS for header, footer, hero, pillar filter, stage gauge, readiness scale, search, mobile menu, country page.
- **assets/** – Optional; logos are loaded from UNIDO’s official site (header/footer). Header search and menu use text buttons when assets are empty.

## Same UI

Layout and data structure are based on the reference app in `undp/ui`. Data is derived from the raw sources there (pillars, 5-stage names: Basic, Opportunistic, Systematic, Differentiating, Transformational). Branding is UNIDO (AI & Digital for Industry Navigator).

## Regenerating demo data

Demo data is built from the **undp** folder’s raw data. To refresh `data/demo.json` and `data/country-geojson.json`:

1. From the repo root, run:  
   `node scripts/build-demo-data.js`

2. The script reads from `undp/ui/database/raw/` (scores.csv, pillar-definitions.csv, definitions.csv, countries-manifest.csv, latlon.json, country-geojson.json) and writes:
   - **data/demo.json** – countries, globeData, ancillary (pillarNames, pillarColorMap, pillars), definitions
   - **data/country-geojson.json** – GeoJSON features only for countries that appear in globeData

No need to run the UNDP app or `prepare-data.js`; the script uses the raw files directly. If you have already run `prepare-data.js` in `undp/ui` and have `undp/ui/database/processed/db.json`, you could extend the script to use that instead for consistency with the full app.
