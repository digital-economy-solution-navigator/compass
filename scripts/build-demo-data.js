/**
 * Build data/demo.json and data/country-geojson.json for AIDIN.
 * Run from repo root: node scripts/build-demo-data.js
 * Requires: undp/ui/database/raw/ (scores.csv, pillar-definitions.csv, definitions.csv,
 *   countries-manifest.csv, latlon.json, country-geojson.json)
 * Uses: data/aidin-schema.json for AIDIN pillar and tier definitions
 */

const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'undp', 'ui', 'database', 'raw');
const OUT_DIR = path.join(__dirname, '..', 'data');
const SCHEMA_FILE = path.join(__dirname, '..', 'data', 'aidin-schema.json');

// Load AIDIN schema
let AIDIN_SCHEMA = null;
if (fs.existsSync(SCHEMA_FILE)) {
  AIDIN_SCHEMA = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
}

const TIER_NAMES = AIDIN_SCHEMA?.tiers?.names || ['Foundational', 'Emerging', 'Scaling', 'Frontier'];
const TIER_THRESHOLDS = AIDIN_SCHEMA?.tiers?.thresholds || {
  Foundational: { min: 0, max: 1.5 },
  Emerging: { min: 1.5, max: 2.5 },
  Scaling: { min: 2.5, max: 3.5 },
  Frontier: { min: 3.5, max: 4.0 }
};

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

function getTier(score) {
  const n = parseFloat(score);
  if (!Number.isFinite(n)) return 0;
  // Convert 1-5.99 scale to 0-4 scale for AIDIN tiers
  const normalizedScore = Math.max(0, Math.min(4, (n - 1) * (4 / 4.99)));
  return normalizedScore;
}

function getTierFromScore(score) {
  const normalizedScore = getTier(score);
  if (normalizedScore < TIER_THRESHOLDS.Emerging.min) return 0; // Foundational
  if (normalizedScore < TIER_THRESHOLDS.Scaling.min) return 1; // Emerging
  if (normalizedScore < TIER_THRESHOLDS.Frontier.min) return 2; // Scaling
  return 3; // Frontier
}

function roundNumber(num, decimals = 2) {
  if (num == null) return null;
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function getTierInfo(value, pillar, dimension) {
  if (value == null) return null;
  const tierIndex = getTierFromScore(value);
  const tierName = TIER_NAMES[tierIndex];
  const tierDesc = AIDIN_SCHEMA?.tiers?.descriptions?.[tierName] || '';
  return { 
    number: tierIndex + 1, 
    name: tierName, 
    description: tierDesc,
    score: roundNumber(value)
  };
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
  // Build AIDIN pillar structure from schema
  const aidinPillars = {
    enabling: AIDIN_SCHEMA?.pillars?.enabling || [],
    outcome: AIDIN_SCHEMA?.pillars?.outcome || []
  };
  
  const allPillarNames = [
    ...aidinPillars.enabling.map(p => p.name),
    ...aidinPillars.outcome.map(p => p.name)
  ];
  
  const pillarColorMap = AIDIN_SCHEMA?.pillarColorMap || {};
  const pillars = {};
  
  // Build pillar structure with dimensions
  aidinPillars.enabling.forEach(pillar => {
    pillars[pillar.name] = pillar.dimensions || [];
  });
  aidinPillars.outcome.forEach(pillar => {
    pillars[pillar.name] = pillar.dimensions || [];
  });

  // Try to load UNDP data if available (for country list and coordinates)
  let countriesManifest = [];
  let scores = [];
  let latlon = [];
  let geojson = { type: 'FeatureCollection', features: [] };
  
  if (fs.existsSync(RAW_DIR)) {
    try {
      countriesManifest = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'countries-manifest.csv'), 'utf8'));
      scores = parseCSV(fs.readFileSync(path.join(RAW_DIR, 'scores.csv'), 'utf8'));
      latlon = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'latlon.json'), 'utf8'));
      geojson = JSON.parse(fs.readFileSync(path.join(RAW_DIR, 'country-geojson.json'), 'utf8'));
    } catch (err) {
      console.warn('Warning: Could not load some UNDP data files:', err.message);
    }
  } else {
    console.warn('Warning: UNDP raw data directory not found. Using minimal data structure.');
  }

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

  // Get unique country names from scores or manifest
  const countryNamesWithScores = new Set();
  scores.forEach((s) => {
    const cn = (s['Country Name'] || '').trim();
    if (cn) countryNamesWithScores.add(cn);
  });
  
  // If no scores, use manifest countries
  if (countryNamesWithScores.size === 0) {
    countriesManifest.forEach((c) => {
      const name = (c['Country or Area'] || '').trim();
      if (name) countryNamesWithScores.add(name);
    });
  }

  // Process each country
  countryNamesWithScores.forEach((countryName) => {
    const manifestRow = countriesManifest.find(
      (c) => String(c['Country or Area'] || '').trim().toLowerCase() === countryName.toLowerCase()
    );
    
    // Create country entry even without manifest (for demo purposes)
    const alpha2 = manifestRow ? (manifestRow['ISO-alpha2 Code'] || '').trim() : '';
    const alpha3 = manifestRow ? (manifestRow['ISO-alpha3 Code'] || '').trim() : countryName.substring(0, 3).toUpperCase();
    const name = manifestRow ? (manifestRow['Country or Area'] || '').trim() : countryName;
    const region = manifestRow ? (manifestRow['Region Name'] || '').trim() : '';
    const subregion = manifestRow ? (manifestRow['Sub-region Name'] || '').trim() : '';
    const unMember = manifestRow ? (manifestRow['UN Member States'] || '').trim().toLowerCase() === 'x' : false;
    const ll = latlonByAlpha2[alpha2];
    
    // Calculate overall score (average of all pillar scores or use existing)
    const overallScore = getOverallScore(scores, countryName);
    
    const scoresOut = {};
    
    // Calculate overall tier
    if (overallScore != null) {
      const overallTier = getTierInfo(overallScore, null, null);
      if (overallTier) {
        scoresOut['Overall'] = {
          score: overallTier.score,
          tier: { 
            number: overallTier.number, 
            name: overallTier.name, 
            description: overallTier.description 
          },
        };
      }
    }

    // Process AIDIN pillars
    // Since UNDP data has different pillar names, we'll generate tier data based on overall score
    // with some variation to make it realistic
    const baseScore = overallScore || 2.5;
    
    allPillarNames.forEach((pillar) => {
      // Generate a score with some variation from overall (for demo purposes)
      // In production, this would come from actual AIDIN data
      const variation = (Math.random() - 0.5) * 1.0; // ±0.5 variation
      const pillarScore = Math.max(0, Math.min(4, baseScore + variation));
      const tierInfo = getTierInfo(pillarScore, pillar, null);
      const dimensionList = pillars[pillar] || [];
      const pillarScores = {};
      
      if (tierInfo) {
        pillarScores.tier = {
          number: tierInfo.number,
          name: tierInfo.name,
          description: tierInfo.description,
          score: roundNumber(pillarScore)
        };
      }
      
      // Process dimensions - generate scores with smaller variation
      dimensionList.forEach((dimension) => {
        const dimVariation = (Math.random() - 0.5) * 0.6; // ±0.3 variation
        const dimensionScore = Math.max(0, Math.min(4, pillarScore + dimVariation));
        const dimTier = getTierInfo(dimensionScore, pillar, dimension);
        if (dimTier) {
          pillarScores[dimension] = {
            tier: {
              number: dimTier.number,
              name: dimTier.name,
              description: dimTier.description,
              score: roundNumber(dimensionScore)
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


  const demo = {
    countries: countriesList.filter((c) => countryNamesWithScores.has(c.name)).map((c) => ({ 
      name: c.name, 
      alpha2: c.alpha2, 
      alpha3: c.alpha3 
    })),
    ancillary: {
      pillarNames: allPillarNames,
      pillarColorMap: pillarColorMap,
      pillars: pillars,
      pillarCategories: {
        enabling: aidinPillars.enabling.map(p => p.name),
        outcome: aidinPillars.outcome.map(p => p.name)
      },
      tiers: {
        names: TIER_NAMES,
        thresholds: TIER_THRESHOLDS,
        descriptions: AIDIN_SCHEMA?.tiers?.descriptions || {}
      }
    },
    definitions: allPillarNames.map((pillarName) => {
      const pillarDef = [...aidinPillars.enabling, ...aidinPillars.outcome].find(p => p.name === pillarName);
      return {
        Pillar: pillarName,
        'Sub-Pillar': '',
        Definition: pillarDef ? `${pillarName} pillar for industrial AI and digital transformation` : '',
        Foundational: TIER_THRESHOLDS.Foundational ? AIDIN_SCHEMA?.tiers?.descriptions?.Foundational || '' : '',
        Emerging: TIER_THRESHOLDS.Emerging ? AIDIN_SCHEMA?.tiers?.descriptions?.Emerging || '' : '',
        Scaling: TIER_THRESHOLDS.Scaling ? AIDIN_SCHEMA?.tiers?.descriptions?.Scaling || '' : '',
        Frontier: TIER_THRESHOLDS.Frontier ? AIDIN_SCHEMA?.tiers?.descriptions?.Frontier || '' : ''
      };
    }),
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
