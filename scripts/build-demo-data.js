/**
 * Build data/demo.json and data/country-geojson.json from UNDP raw data.
 * Run from repo root: node scripts/build-demo-data.js
 * Requires: undp/ui/database/raw/ (scores.csv, pillar-definitions.csv, definitions.csv,
 *   countries-manifest.csv, latlon.json, country-geojson.json)
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'undp', 'ui', 'database', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data');

const STAGE_NAMES = ['Basic', 'Opportunistic', 'Systematic', 'Differentiating', 'Transformational'];

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  const headers = parseCSVLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const obj = {};
    headers.forEach((h, j) => { obj[h] = values[j] !== undefined ? values[j] : ''; });
    rows.push(obj);
  }
  return rows;
}

function parseCSVLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      i++;
      let s = '';
      while (i < line.length && line[i] !== '"') {
        s += line[i];
        i++;
      }
      if (line[i] === '"') i++;
      out.push(s.trim());
      if (line[i] === ',') i++;
    } else {
      let s = '';
      while (i < line.length && line[i] !== ',') {
        s += line[i];
        i++;
      }
      out.push(s.trim());
      if (line[i] === ',') i++;
    }
  }
  return out;
}

function getStage(score) {
  const n = parseFloat(score);
  if (!Number.isFinite(n)) return 1;
  return Math.max(Math.floor(n), 1);
}

function roundNumber(num, decimals = 2) {
  if (num == null) return null;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function getStageInfo(value, pillar, subpillar, definitions) {
  if (value == null) return null;
  const stage = Math.min(getStage(value), 5);
  const stageName = STAGE_NAMES[stage - 1];
  const def = definitions.find(
    (d) =>
      String(d['Pillar'] || '').toLowerCase() === String(pillar || '').toLowerCase() &&
      (!subpillar || String(d['Sub-Pillar'] || '').toLowerCase() === String(subpillar || '').toLowerCase())
  );
  const description = def && def[stageName] ? def[stageName] : '';
  return { number: stage, name: stageName, description: description || '' };
}

function getPillarScore(scores, countryName, pillar) {
  const m = scores.find(
    (s) =>
      String(s['Country Name'] || '').toLowerCase() === String(countryName || '').toLowerCase() &&
      String(s['Pillar'] || '').toLowerCase() === String(pillar || '').toLowerCase() &&
      !(s['Sub-Pillar'] || '').trim()
  );
  return m && m['new_rank_score'] !== undefined && m['new_rank_score'] !== '' ? parseFloat(m['new_rank_score']) : null;
}

function getSubpillarScore(scores, countryName, pillar, subpillar) {
  const m = scores.find(
    (s) =>
      String(s['Country Name'] || '').toLowerCase() === String(countryName || '').toLowerCase() &&
      String(s['Pillar'] || '').toLowerCase() === String(pillar || '').toLowerCase() &&
      String(s['Sub-Pillar'] || '').toLowerCase() === String(subpillar || '').toLowerCase() &&
      !(s['Indicator'] || '').trim()
  );
  return m && m['new_rank_score'] !== undefined && m['new_rank_score'] !== '' ? parseFloat(m['new_rank_score']) : null;
}

function getOverallScore(scores, countryName) {
  const m = scores.find(
    (s) =>
      String(s['Country Name'] || '').toLowerCase() === String(countryName || '').toLowerCase() &&
      !(s['Pillar'] || '').trim() &&
      !(s['Sub-Pillar'] || '').trim()
  );
  return m && m['new_rank_score'] !== undefined && m['new_rank_score'] !== '' ? parseFloat(m['new_rank_score']) : null;
}

function main() {
  if (!fs.existsSync(RAW_DIR)) {
    console.error('Raw data dir not found:', RAW_DIR);
    process.exit(1);
  }

  const pillarDefs = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'pillar-definitions.csv'), 'utf8'));
  const definitions = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'definitions.csv'), 'utf8'));
  const countriesManifest = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'countries-manifest.csv'), 'utf8'));
  const scores = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'scores.csv'), 'utf8'));
  const latlon = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'latlon.json'), 'utf8'));
  const geojson = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'country-geojson.json'), 'utf8'));

  const pillarNames = pillarDefs.map((p) => (p['Pillar'] || '').trim()).filter(Boolean);
  const pillarColorMap = {};
  pillarDefs.forEach((p) => {
    const name = (p['Pillar'] || '').trim();
    if (!name) return;
    pillarColorMap[name] = {
      base: (p['ColorBase'] || '').trim(),
      triple: [(p['ColorTriple1'] || '').trim(), (p['ColorTriple2'] || '').trim(), (p['ColorTriple3'] || '').trim()].filter(Boolean),
    };
  });

  const pillars = {};
  pillarNames.forEach((pillar) => {
    const subpillars = [...new Set(
      definitions
        .filter((d) => String(d['Pillar'] || '').toLowerCase() === String(pillar || '').toLowerCase())
        .map((d) => (d['Sub-Pillar'] || '').trim())
        .filter(Boolean)
    )];
    pillars[pillar] = subpillars.length ? subpillars : (pillar === 'Overall' ? ['Overall'] : []);
  });
  if (pillars['Overall'] === undefined) pillars['Overall'] = ['Overall'];

  const countriesWithOverall = new Set();
  scores.forEach((s) => {
    if (!(s['Pillar'] || '').trim() && !(s['Sub-Pillar'] || '').trim() && (s['Country Name'] || '').trim()) {
      countriesWithOverall.add(String(s['Country Name']).trim());
    }
  });

  const countriesList = [];
  const globeData = [];
  const alpha3ToCountry = {};

  countriesManifest.forEach((c) => {
    const name = (c['Country or Area'] || '').trim();
    const alpha2 = (c['ISO-alpha2 Code'] || '').trim();
    const alpha3 = (c['ISO-alpha3 Code'] || '').trim();
    if (!name || !alpha3) return;
    const unMember = (c['UN Member States'] || '').trim().toLowerCase() === 'x';
    const region = (c['Region Name'] || '').trim();
    const subregion = (c['Sub-region Name'] || '').trim();
    countriesList.push({ name, alpha2, alpha3 });
    alpha3ToCountry[alpha3] = { name, alpha2, alpha3, region, subregion, unMember };
  });

  const latlonByAlpha2 = {};
  latlon.forEach((ll) => { latlonByAlpha2[ll.alpha2] = { latitude: ll.latitude, longitude: ll.longitude }; });

  const countryNamesWithScores = new Set();
  scores.forEach((s) => {
    const cn = (s['Country Name'] || '').trim();
    if (cn) countryNamesWithScores.add(cn);
  });

  countryNamesWithScores.forEach((countryName) => {
    const manifestRow = countriesManifest.find(
      (c) => String(c['Country or Area'] || '').trim().toLowerCase() === countryName.toLowerCase()
    );
    if (!manifestRow) return;
    const alpha2 = (manifestRow['ISO-alpha2 Code'] || '').trim();
    const alpha3 = (manifestRow['ISO-alpha3 Code'] || '').trim();
    const name = (manifestRow['Country or Area'] || '').trim();
    const region = (manifestRow['Region Name'] || '').trim();
    const subregion = (manifestRow['Sub-region Name'] || '').trim();
    const unMember = (manifestRow['UN Member States'] || '').trim().toLowerCase() === 'x';
    const ll = latlonByAlpha2[alpha2];
    const overallScore = getOverallScore(scores, countryName);
    if (overallScore == null) return;

    const scoresOut = {};
    const overallStage = getStageInfo(overallScore, null, null, definitions);
    if (overallStage) {
      const defOverall = definitions.find((d) => !(d['Pillar'] || '').trim() && !(d['Sub-Pillar'] || '').trim());
      const desc = defOverall && defOverall[overallStage.name] ? defOverall[overallStage.name] : '';
      scoresOut['Overall'] = {
        score: roundNumber(overallScore),
        stage: { number: overallStage.number, name: overallStage.name, description: desc || '' },
      };
    }

    pillarNames.filter((p) => p !== 'Overall').forEach((pillar) => {
      const pillarScore = getPillarScore(scores, countryName, pillar);
      const stageInfo = getStageInfo(pillarScore, pillar, null, definitions);
      const subpillarList = pillars[pillar] || [];
      const pillarScores = {};
      if (stageInfo) {
        pillarScores.stage = {
          number: stageInfo.number,
          name: stageInfo.name,
          description: stageInfo.description || '',
        };
      }
      subpillarList.forEach((sp) => {
        const subScore = getSubpillarScore(scores, countryName, pillar, sp);
        const spStage = getStageInfo(subScore, pillar, sp, definitions);
        if (spStage) {
          pillarScores[sp] = {
            stage: {
              number: spStage.number,
              name: spStage.name,
              description: spStage.description || '',
            },
          };
        }
      });
      if (Object.keys(pillarScores).length) scoresOut[pillar] = pillarScores;
    });

    globeData.push({
      name,
      alpha2,
      alpha3,
      latitude: ll ? ll.latitude : null,
      longitude: ll ? ll.longitude : null,
      region,
      subregion,
      unMember,
      scores: scoresOut,
    });
  });

  const countriesForSearch = countriesList.filter((c) => countryNamesWithScores.has(c.name));
  if (countriesForSearch.length === 0) {
    countriesForSearch.push(...countriesList.slice(0, 50));
  }

  const demo = {
    countries: countriesForSearch.map((c) => ({ name: c.name, alpha2: c.alpha2, alpha3: c.alpha3 })),
    ancillary: {
      pillarNames,
      pillarColorMap,
      pillars,
    },
    definitions: definitions.map((d) => ({
      Pillar: d['Pillar'],
      'Sub-Pillar': d['Sub-Pillar'],
      Definition: d['Definition'],
      Basic: d['Basic'],
      Opportunistic: d['Opportunistic'],
      Systematic: d['Systematic'],
      Differentiating: d['Differentiating'],
      Transformational: d['Transformational'],
    })),
    globeData: globeData.filter((c) => c.latitude != null && c.longitude != null),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'demo.json'), JSON.stringify(demo, null, 2), 'utf8');
  console.log('Wrote data/demo.json: countries=%d, globeData=%d', demo.countries.length, demo.globeData.length);

  const globeAlpha3 = new Set(demo.globeData.map((c) => c.alpha3));
  const featuresFiltered = (geojson.features || []).filter(
    (f) => f.properties && globeAlpha3.has(f.properties.ISO3CD)
  );
  const geojsonOut = { type: 'FeatureCollection', features: featuresFiltered };
  fs.writeFileSync(path.join(OUT_DIR, 'country-geojson.json'), JSON.stringify(geojsonOut), 'utf8');
  console.log('Wrote data/country-geojson.json: features=%d', featuresFiltered.length);
}

main();
