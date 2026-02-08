// One-off: extract GeoJSON for demo countries only (read from main project, write to html-demo).
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '../../ui/database/raw/country-geojson.json');
const dest = path.join(__dirname, '../data/country-geojson.json');
const codes = ['SGP', 'FIN', 'FRA', 'USA'];
const geojson = JSON.parse(fs.readFileSync(src, 'utf8'));
geojson.features = geojson.features.filter(f => f.properties && codes.includes(f.properties.ISO3CD));
fs.writeFileSync(dest, JSON.stringify(geojson));
console.log('Wrote', dest, 'with', geojson.features.length, 'features');
