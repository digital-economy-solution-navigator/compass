# HTML Demo – Digital Development Compass

Static HTML/CSS/JS demo that replicates the Digital Development Compass UI. No build step; runs with any static file server.

## How to run

Because the demo loads `data/demo.json` via `fetch()`, use a local server (avoids CORS; don’t open `file://`):

- **Node (no install):** from this folder run  
  `node serve.js`  
  Then open **http://localhost:3456**

- **npx serve:** from this folder run  
  `npx serve -p 3456`  
  Then open **http://localhost:3456**

- **Python:** from this folder run  
  `python -m http.server 3456`  
  Then open **http://localhost:3456**

## Contents

- **index.html** – Home: hero, pillar filter, country selector, country card overlay.
- **country.html** – Country detail (use `?code=SGP` etc.); breadcrumb, flag, score ring, pillars.
- **about.html**, **data.html**, **methodology.html** – Minimal pages with same header/footer.
- **data/demo.json** – Dummy countries, pillars, and scores.
- **css/global.css** – Global styles (no Tailwind; Tailwind is loaded via CDN in the HTML).
- **js/app.js** – Vanilla JS for header, footer, hero, pillar filter, stage gauge, readiness scale, search, mobile menu, country page.
- **assets/** – Copied logos and icons (no dependency on the main project).

## Same UI

Layout, typography, and colors match the Next.js app in `../ui`. The globe is replaced by a placeholder and a country dropdown; all other sections (header, footer, hero, pillar radios, country card with stage gauge and readiness scale, country page with score ring and pillars) mirror the original.
