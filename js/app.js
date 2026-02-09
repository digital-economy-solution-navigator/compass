(function () {
  'use strict';

  const LOGO_HEADER = 'https://www.unido.org/themes/custom/unido_radix/logo.svg';
  const LOGO_FOOTER = 'https://www.unido.org/sites/default/files/2022-12/unido-logo-white.png';
  let data = null;

  function getData() {
    return data;
  }

  function renderHeader(countries, isCountryPage) {
    const header = document.getElementById('header');
    if (!header) return;
    const mobileMenuOpen = false;
    header.innerHTML = `
      <div class="lg:hidden p-4 flex items-center justify-between h-[72px]">
        <div class="flex items-center">
          <div><a href="index.html" class="block relative z-[100] h-[48px] w-[48px] object-contain"><img src="${LOGO_HEADER}" alt="UNIDO Logo" class="h-full w-auto object-contain" /></a></div>
          <div class="pl-3 max-w-[220px]"><a href="index.html"><h1 class="text-base font-semibold text-white leading-tight">AI & Digital for Industry Navigator</h1></a></div>
        </div>
        <div class="flex items-start gap-2">
          <button type="button" id="search-trigger-mobile" class="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 theme-muted" aria-label="Search">Search</button>
          <button type="button" data-theme-toggle class="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 theme-muted" aria-label="Toggle theme">Light</button>
          <button type="button" id="mobile-menu-btn" class="border rounded-full px-3 py-2 text-lg theme-text theme-border" aria-label="Menu">
            <span id="mobile-menu-icon">&#9776;</span>
          </button>
        </div>
      </div>
      <div class="hidden mx-auto px-6 lg:flex lg:items-center lg:justify-between lg:space-x-4 py-5">
        <div class="flex items-center">
          <div class="h-[64px] flex-shrink-0"><a href="index.html" class="block relative z-[100] h-[64px] w-[56px] object-contain"><img src="${LOGO_HEADER}" alt="UNIDO Logo" class="h-full w-auto object-contain" /></a></div>
          <div class="pl-4 max-w-[260px]"><a href="index.html"><h1 class="text-base font-semibold text-white leading-tight">AI & Digital for Industry Navigator</h1></a></div>
        </div>
        <div class="flex items-center justify-end space-x-10">
          <a href="about.html" class="text-sm text-white/70 hover:text-white font-medium theme-muted">About</a>
          <a href="data.html" class="text-sm text-white/70 hover:text-white font-medium theme-muted">Data</a>
          <a href="methodology.html" class="text-sm text-white/70 hover:text-white font-medium theme-muted">Methodology</a>
        </div>
        <div class="flex items-center justify-end gap-3">
          <button type="button" id="search-trigger" class="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white theme-muted" aria-label="Search">Search</button>
          <button type="button" data-theme-toggle class="px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 hover:text-white theme-muted" aria-label="Toggle theme">Light</button>
          <a href="#globe-area" class="text-white px-4 py-2 rounded-full text-sm font-semibold theme-btn" style="background-color: var(--button-primary);" onmouseover="this.style.backgroundColor='var(--button-primary-hover)'" onmouseout="this.style.backgroundColor='var(--button-primary)'">Explore</a>
        </div>
      </div>
    `;
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuIcon = document.getElementById('mobile-menu-icon');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        const menu = document.getElementById('mobile-menu');
        const open = !menu.classList.contains('-translate-x-full');
        menu.classList.toggle('-translate-x-full', open);
        menu.classList.toggle('translate-x-0', !open);
        if (menuIcon) menuIcon.textContent = open ? '\u2630' : '\u00D7';
      });
    }
    document.getElementById('search-trigger')?.addEventListener('click', openSearch);
    document.getElementById('search-trigger-mobile')?.addEventListener('click', openSearch);
    renderMobileMenu();
  }

  function renderMobileMenu() {
    const el = document.getElementById('mobile-menu');
    if (!el) return;
    el.innerHTML = `
      <nav class="flex flex-col w-full justify-center space-y-7 pt-[90px] px-6 text-white">
        <a href="about.html" class="text-base w-full font-medium text-white/80 hover:text-white theme-muted">About</a>
        <a href="data.html" class="text-base w-full font-medium text-white/80 hover:text-white theme-muted">Data</a>
        <a href="methodology.html" class="text-base w-full font-medium text-white/80 hover:text-white theme-muted">Methodology</a>
      </nav>
    `;
  }

  function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <div class="max-w-screen-xl mx-auto px-6 lg:px-12 py-10 text-white">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex flex-row items-center space-x-0">
            <div class="w-[48px] flex-shrink-0"><img src="${LOGO_FOOTER}" width="48" height="60" alt="UNIDO Logo" class="object-contain" /></div>
            <div class="text-sm pl-3 font-normal text-white/70">
              <span>United Nations Industrial Development Organization</span>
            </div>
          </div>
          <div class="flex flex-wrap justify-center lg:justify-end gap-6 text-sm text-white/60">
            <a href="https://www.facebook.com/UNIDO" target="_blank" rel="noopener noreferrer" class="hover:text-white">Facebook</a>
            <a href="https://www.linkedin.com/company/unido" target="_blank" rel="noopener noreferrer" class="hover:text-white">LinkedIn</a>
            <a href="https://www.instagram.com/unido" target="_blank" rel="noopener noreferrer" class="hover:text-white">Instagram</a>
            <a href="https://twitter.com/UNIDO" target="_blank" rel="noopener noreferrer" class="hover:text-white">X</a>
            <a href="https://www.youtube.com/unido" target="_blank" rel="noopener noreferrer" class="hover:text-white">YouTube</a>
          </div>
        </div>
        <div class="border-t border-white/10 w-full mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/50 uppercase tracking-[0.2em]">
          <p>&copy; ${year} UNIDO</p>
          <a href="https://www.unido.org" class="hover:text-white">Terms of use</a>
        </div>
      </div>
    `;
  }

  function renderHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.innerHTML = `
      <div>
        <h1 class="text-[38px] sm:text-[40px] md:text-[42px] lg:text-[44px] leading-[1.05] font-semibold theme-text">Search a country to start the analysis.</h1>
        <p class="text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] leading-7 mt-4 text-left theme-muted">Jump directly into a country snapshot, then explore pillars, stages, and regional benchmarks.</p>
        <div class="mt-6 space-y-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <input type="text" id="hero-search-input" class="w-full flex-1 rounded-2xl border px-4 py-3 text-sm theme-text theme-border" style="background-color: var(--controls-bg);" placeholder="Search country or ISO3 code" />
            <button type="button" id="hero-search-btn" class="text-white px-5 py-3 rounded-2xl text-sm font-semibold theme-button">Search</button>
          </div>
          <div id="hero-search-results" class="text-sm theme-muted"></div>
        </div>
        <div class="mt-6">
          <p class="text-[11px] uppercase tracking-[0.24em] theme-muted">Quick picks</p>
          <div id="hero-quick-picks" class="mt-3 flex flex-wrap gap-2"></div>
        </div>
      </div>
    `;
  }

  function renderPillarFilter(selectedPillar, onChange) {
    const container = document.getElementById('pillar-filter');
    if (!container || !data) return;
    const ancillary = data.ancillary;
    container.innerHTML = `
      <fieldset>
        <div class="overflow-x-auto">
          <div class="flex gap-2 min-w-max" id="pillar-radios"></div>
        </div>
      </fieldset>
    `;
    const radios = document.getElementById('pillar-radios');
    ancillary.pillarNames.forEach(function (pillar) {
      const color = ancillary.pillarColorMap[pillar].base;
      const checked = pillar === selectedPillar;
      const label = document.createElement('label');
      if (checked) {
        label.className = 'px-3 py-1.5 font-medium cursor-pointer flex items-center rounded-full transition-all text-xs border';
        label.style.borderColor = 'var(--pillar-active)';
        label.style.backgroundColor = 'rgba(0, 163, 224, 0.1)';
        label.style.color = 'var(--pillar-active)';
      } else {
        label.className = 'px-3 py-1.5 font-medium cursor-pointer flex items-center rounded-full transition-all text-xs border theme-border';
        label.style.backgroundColor = 'var(--pillar-inactive-bg)';
        label.style.color = 'var(--pillar-inactive-text)';
        label.addEventListener('mouseenter', function() {
          label.style.borderColor = 'var(--border)';
        });
        label.addEventListener('mouseleave', function() {
          label.style.borderColor = 'var(--border)';
        });
      }
      label.innerHTML = `
        <div class="w-2 h-2 rounded-full mr-2 flex-shrink-0" style="background-color:${checked ? 'var(--pillar-active)' : color}"></div>
        <input type="radio" name="pillar-radio" value="${pillar}" class="sr-only" ${checked ? 'checked' : ''} />
        <p class="${checked ? 'font-semibold' : ''}" style="color: inherit;" id="${pillar}">${pillar}</p>
      `;
      label.querySelector('input').addEventListener('change', function () { onChange(pillar); });
      radios.appendChild(label);
    });
  }

  function arcPath(innerR, outerR, startDeg, endDeg) {
    const start = (startDeg * Math.PI) / 180;
    const end = (endDeg * Math.PI) / 180;
    const arc = d3.arc().innerRadius(innerR).outerRadius(outerR).startAngle(start).endAngle(end);
    return arc();
  }

  function renderStageGauge(country, pillar, definitions, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !data || !country || !country.scores) return;
    const ancillary = data.ancillary;
    const scores = country.scores;
    const pillarInfo = scores[pillar];
    const primaryColor = ancillary.pillarColorMap[pillar].base;
    const subpillars = ancillary.pillars[pillar] || ['Overall'];
    const numSub = pillar === 'Overall' ? ancillary.pillarNames.filter(function (p) { return p !== 'Overall'; }).length : subpillars.length;
    const size = 250;
    const ringSize = size / 4;
    const innerSize = ringSize / 1.5;
    const outerSize = ringSize * 2;
    const arcSize = outerSize - innerSize;
    const offset = 4;
    const angleStep = 220 / numSub;
    let paths = '';
    for (let i = 0; i < numSub; i++) {
      const startRad = -110 + angleStep * i + offset;
      const endRad = startRad + angleStep - offset * 2;
      const stageInfo = pillar === 'Overall' ? (scores[ancillary.pillarNames[i + 1]]?.stage) : (pillarInfo[subpillars[i]]?.stage);
      const num = (stageInfo && stageInfo.number) ? stageInfo.number : 0;
      const fillR = innerSize + (arcSize / 5) * num;
      const outerPath = arcPath(innerSize, outerSize, startRad, endRad);
      const fillPath = arcPath(innerSize, fillR, startRad, endRad);
      paths += `<path d="${outerPath}" fill="${primaryColor}" opacity="0.2" /><path d="${fillPath}" fill="${primaryColor}" />`;
      for (let s = 0; s < 5; s++) {
        const r = innerSize + (arcSize / 5) * s;
        const linePath = arcPath(r, r, startRad, endRad);
        paths += `<path d="${linePath}" fill="none" stroke="white" stroke-width="2" />`;
      }
    }
    const overallStage = pillar === 'Overall' ? (scores.Overall?.stage) : (pillarInfo?.stage);
    const stageNum = overallStage?.number || 0;
    const stageName = overallStage?.name || 'No Data';
    container.innerHTML = `
      <div style="width:${size}px">
        <svg width="${size}" height="${size/2}" viewBox="0 0 ${size} ${size/6}" class="overflow-visible p-2">
          <g transform="translate(${size/2},${size/3})">${paths}</g>
        </svg>
        <div class="text-center relative">
          <div class="pt-3"><span class="text-xs text-white font-medium uppercase tracking-widest py-0.5 px-3 rounded-full" style="background:${primaryColor}">${pillar}</span></div>
          <div class="mt-4"><p class="text-sm font-medium uppercase tracking-widest" style="color:${primaryColor}">Stage ${stageNum}: ${stageName}</p><p class="font-medium text-lg">${pillar === 'Overall' ? 'Overall' : pillar}</p><p class="text-sm text-gray-600">${overallStage?.description || ''}</p></div>
        </div>
      </div>
    `;
  }

  function renderReadinessScale(scores, activePillar, onPillarClick) {
    if (!data) return '';
    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames;
    let html = '<div class="flex h-6 border-t px-1 theme-border">';
    pillars.forEach(function (pillar) {
      const info = scores && scores[pillar];
      const stage = info?.stage;
      const percent = (stage && stage.number) ? stage.number * 20 : 0;
      const color = ancillary.pillarColorMap[pillar].base;
      const active = pillar === activePillar;
      const borderStyle = active ? 'border-color: var(--panel-strong);' : 'border-color: var(--border);';
      const bgStyle = active ? 'background-color: var(--panel-strong);' : '';
      html += `<button type="button" class="relative flex-1 h-full appearance-none focus:outline-none transition-opacity border border-b-0" style="${borderStyle} ${bgStyle}" title="${pillar}: ${stage ? stage.name : 'No Data'}" data-pillar="${pillar}"><div class="absolute left-0 bottom-0 right-0" style="height:${percent}%;background:${color}"></div></button>`;
    });
    html += '</div>';
    return html;
  }

  function renderCountryCard(country, pillar, showFooterLink) {
    if (!country || !data) return '';
    const ancillary = data.ancillary;
    const scores = country.scores || {};
    const flagUrl = 'https://flagcdn.com/w80/' + (country.alpha2 || '').toLowerCase() + '.png';
    const readinessHtml = renderReadinessScale(scores, pillar, function () {});
    return `
      <div class="country-card-dark border shadow-xl pb-0 w-full flex-1 rounded-2xl flex flex-col items-center backdrop-blur-xl overflow-hidden theme-border theme-card theme-text" style="background-color: var(--card-bg);">
        <div class="p-4 flex flex-col items-center">
          <a href="country.html?code=${country.alpha3}#${country.alpha3}" class="theme-text" style="color: var(--text);" onmouseover="this.style.color='var(--link-hover)'" onmouseout="this.style.color='var(--text)'">
            <div class="flex flex-col items-center group cursor-pointer">
              <div class="flex-shrink-0"><img src="${flagUrl}" alt="" width="48" height="36" style="object-fit:cover" /></div>
              <div class="flex-1 ml-2"><h3 class="text-xl"><span class="group-hover:underline">${country.name}</span></h3></div>
            </div>
          </a>
          <div class="py-4 flex items-center justify-center text-center w-full" id="country-card-gauge"></div>
        </div>
        ${showFooterLink ? `<div class="mb-4"><a href="country.html?code=${country.alpha3}#${country.alpha3}" class="text-sm font-semibold px-5 py-3 text-white rounded-full inline-flex items-center transition-colors theme-button" style="background-color: var(--button-primary);" onmouseover="this.style.backgroundColor='var(--button-primary-hover)'" onmouseout="this.style.backgroundColor='var(--button-primary)'">View more</a></div>` : ''}
        <div class="w-full flex-1 flex flex-col justify-end">${readinessHtml}</div>
      </div>
    `;
  }

  function showCountryCard(country, pillar) {
    const container = document.getElementById('country-card-container');
    if (!container) return;
    if (!country) {
      container.classList.add('hidden');
      container.innerHTML = '';
      container.removeAttribute('style');
      return;
    }
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="flex justify-end mb-2">
        <button type="button" id="close-country-card" class="text-white/60 hover:text-white flex items-center p-2 text-xs uppercase tracking-[0.2em]" aria-label="Close">Close</button>
      </div>
      ${renderCountryCard(country, pillar, true)}
    `;
    const gaugeWrap = container.querySelector('#country-card-gauge');
    if (gaugeWrap && typeof renderStageGauge === 'function') {
      const gaugeDiv = document.createElement('div');
      gaugeDiv.id = 'inline-stage-gauge';
      gaugeWrap.appendChild(gaugeDiv);
      renderStageGauge(country, pillar, data.definitions, 'inline-stage-gauge');
    }
    document.getElementById('close-country-card')?.addEventListener('click', function () {
      if (window.setActiveCountry) window.setActiveCountry(null);
    });
  }

  function openSearch() {
    const dialog = document.getElementById('search-dialog');
    const backdrop = document.getElementById('search-dialog-backdrop');
    if (dialog) dialog.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    const input = document.getElementById('search-input');
    if (input) { input.value = ''; input.focus(); }
    fillSearchResults('');
  }

  function closeSearch() {
    document.getElementById('search-dialog')?.classList.add('hidden');
    document.getElementById('search-dialog-backdrop')?.classList.add('hidden');
  }

  function initThemeToggle() {
    var root = document.documentElement;
    var body = document.body;
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-theme-toggle]'));
    if (!buttons.length) return;

    function applyTheme(mode) {
      root.setAttribute('data-theme', mode);
      root.classList.toggle('theme-light', mode === 'light');
      root.classList.toggle('theme-dark', mode !== 'light');
      body.classList.toggle('theme-light', mode === 'light');
      body.classList.toggle('theme-dark', mode !== 'light');
      buttons.forEach(function (btn) {
        btn.textContent = mode === 'light' ? 'Dark' : 'Light';
      });
    }

    var stored = 'dark';
    try {
      stored = localStorage.getItem('theme') || 'dark';
    } catch (e) {}

    applyTheme(stored);

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = root.getAttribute('data-theme') || 'dark';
        var next = current === 'light' ? 'dark' : 'light';
        try { localStorage.setItem('theme', next); } catch (e) {}
        applyTheme(next);
      });
    });
  }

  function initHeroSearch(countries) {
    const input = document.getElementById('hero-search-input');
    const resultsEl = document.getElementById('hero-search-results');
    const quickEl = document.getElementById('hero-quick-picks');
    const btn = document.getElementById('hero-search-btn');
    if (!input || !resultsEl || !quickEl) return;

    const list = (countries || []).slice().sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    const quick = list.slice(0, 8);
    quickEl.innerHTML = quick.map(function (c) {
      return '<a href="country.html?code=' + c.alpha3 + '#' + c.alpha3 + '" class="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white/80 hover:text-white hover:bg-white/20">' + c.name + '</a>';
    }).join('');

    function renderResults(matches) {
      if (!matches.length) {
        resultsEl.innerHTML = '<p class="text-white/50">No matches yet. Try another name or ISO3 code.</p>';
        return;
      }
      resultsEl.innerHTML = '<div class="grid gap-2">' + matches.slice(0, 6).map(function (c) {
        return '<a class="px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:border-white/30" href="country.html?code=' + c.alpha3 + '#' + c.alpha3 + '">' + c.name + '</a>';
      }).join('') + '</div>';
    }

    function findMatches(value) {
      const q = (value || '').trim().toLowerCase();
      if (!q) return [];
      return list.filter(function (c) {
        return c.name.toLowerCase().indexOf(q) !== -1 ||
          (c.alpha3 || '').toLowerCase() === q ||
          (c.alpha2 || '').toLowerCase() === q;
      });
    }

    input.addEventListener('input', function () {
      const matches = findMatches(input.value);
      resultsEl.innerHTML = matches.length ? '' : '';
      if (input.value.trim()) renderResults(matches);
      else resultsEl.innerHTML = '';
    });

    if (btn) {
      btn.addEventListener('click', function () {
        const matches = findMatches(input.value);
        if (matches.length === 1) {
          window.location.href = 'country.html?code=' + matches[0].alpha3 + '#' + matches[0].alpha3;
          return;
        }
        renderResults(matches);
      });
    }
  }

  function fillSearchResults(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl || !data) return;
    const q = (query || '').toLowerCase().trim();
    const list = q ? data.countries.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1; }) : data.countries.slice(0, 20);
    resultsEl.innerHTML = list.map(function (c) {
      return '<a href="country.html?code=' + c.alpha3 + '#' + c.alpha3 + '" class="block px-4 py-3 border-b border-white/10 text-white/80 hover:bg-white/5 hover:text-white">' + c.name + '</a>';
    }).join('') || '<p class="p-4 text-white/60">No countries found</p>';
  }

  function toHex(s) {
    if (typeof s !== 'string') return s;
    var t = s.replace(/^["']|["']$/g, '').trim();
    return /^#[0-9A-Fa-f]{3,8}$/.test(t) ? t : s;
  }
  function getCSSVariable(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function makePillarScales(ancillary) {
    const scales = {};
    ancillary.pillarNames.forEach(function (p) {
      const raw = ancillary.pillarColorMap[p] && ancillary.pillarColorMap[p].triple;
      if (raw && raw.length >= 2) {
        const triple = raw.map(toHex);
        scales[p] = d3.scaleLinear().domain([0, 2.5, 5]).range(triple).interpolate(d3.interpolateRgb).clamp(true);
      } else {
        scales[p] = function () { return '#c7d7ed'; };
      }
    });
    return scales;
  }

  function initGlobe(globeData, geojson, ancillary, pillarRef, activeCountryIdRef, onCountrySelect) {
    if (typeof Globe === 'undefined' || typeof THREE === 'undefined') return null;
    const featuresByCode = {};
    (geojson.features || []).forEach(function (f) {
      const code = f.properties && f.properties.ISO3CD;
      if (code) featuresByCode[code] = f;
    });
    const merged = globeData.filter(function (c) { return featuresByCode[c.alpha3]; }).map(function (c) {
      const geojsonFeature = featuresByCode[c.alpha3];
      const scores = c.scores || {};
      ancillary.pillarNames.forEach(function (p) {
        if (scores[p] && scores[p].stage && scores[p].stage.number !== undefined && scores[p].score === undefined) {
          scores[p].score = scores[p].stage.number;
        }
      });
      return { geojson: geojsonFeature, name: c.name, alpha2: c.alpha2, alpha3: c.alpha3, latitude: c.latitude, longitude: c.longitude, unMember: c.unMember !== false, scores: scores };
    }).filter(function (d) {
      var g = d.geojson && d.geojson.geometry;
      return g && typeof g.type === 'string';
    });
    const pillarScales = makePillarScales(ancillary);
    const globeEl = document.getElementById('globe-viz');
    if (!globeEl || merged.length === 0) return null;
    const globeAtmosphere = getCSSVariable('--globe-atmosphere') || '#DCE9FE';
    const globeMaterial = getCSSVariable('--globe-material') || '#0f172a';
    const globeDefault = getCSSVariable('--globe-default') || '#1f2937';
    const globeActive = getCSSVariable('--globe-active') || '#6366f1';
    const globeStroke = getCSSVariable('--globe-stroke') || '#94a3b8';
    const polygonSideColor = getCSSVariable('--panel') || 'rgba(255, 255, 255, 0.08)';
    
    const globe = new Globe(globeEl)
      .showGraticules(true)
      .showAtmosphere(true)
      .atmosphereAltitude(0.23)
      .atmosphereColor(globeAtmosphere)
      .backgroundColor('rgba(0,0,0,0)')
      .showGlobe(true)
      .globeMaterial(new THREE.MeshPhysicalMaterial({ color: globeMaterial }))
      .polygonsData(merged)
      .polygonGeoJsonGeometry(function (d) {
        var g = d && d.geojson && d.geojson.geometry;
        return (g && typeof g.type === 'string') ? g : undefined;
      })
      .polygonCapMaterial(function (d) {
        var p = pillarRef.current;
        var score = d.scores && d.scores[p] && d.scores[p].score;
        var isActive = activeCountryIdRef.current === d.alpha3;
        var defaultColor = globeDefault;
        var numScore = score != null && score !== '' ? Number(score) : NaN;
        var useScale = pillarScales[p] && !Number.isNaN(numScore);
        var color = isActive ? (pillarScales[p] ? pillarScales[p](6) : globeActive) : (useScale ? pillarScales[p](numScore) : defaultColor);
        return new THREE.MeshPhysicalMaterial({
          color: color,
          roughness: 0.65,
          reflectivity: 0.35,
          opacity: activeCountryIdRef.current ? (activeCountryIdRef.current === d.alpha3 ? 1 : 0.92) : 1,
          side: THREE.DoubleSide
        });
      })
      .polygonAltitude(function (d) { return activeCountryIdRef.current === d.alpha3 ? 0.032 : 0.008; })
      .polygonSideColor(function () { return polygonSideColor; })
      .polygonStrokeColor(function () { return globeStroke; })
      .polygonLabel(function (d) {
        if (!d || !d.unMember) return '';
        return '<div class="bg-white rounded-md shadow-lg px-4 py-1 uppercase text-xs tracking-widest font-medium text-black"><span>' + d.name + '</span></div>';
      })
      .onPolygonClick(function (d, event) {
        if (!d.unMember) return;
        if (d.alpha3 === activeCountryIdRef.current) {
          window.location.href = 'country.html?code=' + d.alpha3 + '#' + d.alpha3;
          return;
        }
        onCountrySelect(d.alpha3, event);
      })
      .onGlobeReady(function () {
        try {
          var ctrl = globe.controls && globe.controls();
          if (ctrl) {
            ctrl.autoRotate = true;
            ctrl.autoRotateSpeed = -0.25;
            ctrl.enableZoom = false;
          }
          globe.pointOfView({ lat: 0, lng: 0, altitude: 1.55 }, 0);
          var scene = globe.scene && globe.scene();
          if (scene) {
            setTimeout(function () {
              scene.children.filter(function (d) { return d.type === 'DirectionalLight'; }).forEach(function (d) { scene.remove(d); });
              var ambient = new THREE.AmbientLight(0xdce9fe, 0.2);
              scene.add(ambient);
              var camera = globe.camera && globe.camera();
              if (camera) {
                var light = new THREE.DirectionalLight(0xffffff, 0.1);
                light.position.set(0, 0, 1);
                camera.add(light);
                scene.add(camera);
              }
              scene.fog = new THREE.Fog(0xdce9fe, 150, 300);
            }, 300);
          }
        } catch (e) { console.warn('Globe ready setup:', e); }
      });
    function applyGlobeSize() {
      var w = globeEl.clientWidth;
      var h = globeEl.clientHeight;
      if (w && h) {
        globe.width(w);
        globe.height(h);
      }
    }
    applyGlobeSize();
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(function () { applyGlobeSize(); });
      ro.observe(globeEl);
    } else {
      window.addEventListener('resize', applyGlobeSize);
    }
    return globe;
  }

  function initIndexPage() {
    Promise.all([
        fetch('data/demo.json').then(function (r) { if (!r.ok) throw new Error('demo.json failed'); return r.json(); }),
        fetch('data/country-geojson.json').then(function (r) { if (!r.ok) throw new Error('country-geojson.json failed'); return r.json(); })
      ])
      .then(function (results) {
        var d = results[0];
        var geojson = results[1] || { type: 'FeatureCollection', features: [] };
        if (!geojson.features || !geojson.features.length) console.warn('country-geojson.json has no features');
        data = d;
        const countries = d.countries || [];
        renderHeader(countries);
        initThemeToggle();
        renderFooter();
        renderHero();
        let pillar = 'Overall';
        let activeCountry = null;
        const globeData = d.globeData || [];
        initHeroSearch(globeData);
        var pillarRef = { current: pillar };
        var activeCountryIdRef = { current: null };
        var globeInstance = null;
        function refreshGlobe() {
          if (globeInstance && mergedForGlobe) {
            pillarRef.current = pillar;
            activeCountryIdRef.current = activeCountry ? activeCountry.alpha3 : null;
            globeInstance.polygonsData(mergedForGlobe.slice());
            if (activeCountry && activeCountry.latitude != null) {
              if (globeInstance.controls) { var c = globeInstance.controls(); if (c) c.autoRotate = false; }
              globeInstance.pointOfView({ lat: activeCountry.latitude, lng: activeCountry.longitude, altitude: 1.5 }, 1200);
            } else {
              if (globeInstance.controls) { var c = globeInstance.controls(); if (c) c.autoRotate = true; }
              if (globeInstance.toGeoCoords && globeInstance.camera) {
                var pos = globeInstance.camera().position;
                var geo = globeInstance.toGeoCoords(pos);
                globeInstance.pointOfView({ lat: geo.lat, lng: geo.lng, altitude: 1.9 }, 1200);
              }
            }
          }
        }
        var featuresByCode = {};
        (geojson.features || []).forEach(function (f) {
          var code = f.properties && f.properties.ISO3CD;
          if (code) featuresByCode[code] = f;
        });
        var mergedForGlobe = globeData.filter(function (c) { return featuresByCode[c.alpha3]; }).map(function (c) {
          var gf = featuresByCode[c.alpha3];
          var scores = c.scores || {};
          (data.ancillary.pillarNames || []).forEach(function (p) {
            if (scores[p] && scores[p].stage && scores[p].stage.number !== undefined && scores[p].score === undefined) scores[p].score = scores[p].stage.number;
          });
          return { geojson: gf, name: c.name, alpha2: c.alpha2, alpha3: c.alpha3, latitude: c.latitude, longitude: c.longitude, unMember: c.unMember !== false, scores: scores };
        }).filter(function (d) {
          var g = d.geojson && d.geojson.geometry;
          return g && typeof g.type === 'string';
        });
        function positionCountryCard(event) {
          var container = document.getElementById('country-card-container');
          if (!container) return;
          if (!event || typeof event.clientX !== 'number' || typeof event.clientY !== 'number') {
            container.style.position = '';
            container.style.left = '';
            container.style.top = '';
            container.style.right = '';
            container.style.bottom = '';
            container.style.transform = '';
            return;
          }
          var margin = 16;
          var width = container.offsetWidth || 320;
          var height = container.offsetHeight || 360;
          var x = Math.min(window.innerWidth - width - margin, Math.max(margin, event.clientX - width / 2));
          var y = Math.min(window.innerHeight - height - margin, Math.max(margin, event.clientY - height / 2));
          container.style.position = 'fixed';
          container.style.left = x + 'px';
          container.style.top = y + 'px';
          container.style.right = 'auto';
          container.style.bottom = 'auto';
          container.style.transform = 'none';
        }

        globeInstance = initGlobe(globeData, geojson, data.ancillary, pillarRef, activeCountryIdRef, function (alpha3, event) {
          activeCountry = globeData.find(function (c) { return c.alpha3 === alpha3; }) || null;
          var sel = document.getElementById('country-select');
          if (sel) sel.value = alpha3 || '';
          showCountryCard(activeCountry, pillar);
          positionCountryCard(event);
          refreshGlobe();
        });
        if (!globeInstance) {
          var globeEl = document.getElementById('globe-viz');
          if (globeEl) globeEl.innerHTML = '<div class="flex items-center justify-center h-full text-gray-500 p-4">No country data for globe. Ensure data/country-geojson.json is loaded and matches demo.json.</div>';
        }
        const pillarFilterContainer = document.getElementById('pillar-filter');
        const selectEl = document.createElement('div');
        selectEl.className = 'mt-4';
        selectEl.innerHTML = '';
        function updatePillar(p) {
          pillar = p;
          pillarRef.current = pillar;
          renderPillarFilter(pillar, updatePillar);
          pillarFilterContainer.appendChild(selectEl);
          if (activeCountry) showCountryCard(activeCountry, pillar);
          if (globeInstance && mergedForGlobe) globeInstance.polygonsData(mergedForGlobe.slice());
        }
        renderPillarFilter(pillar, updatePillar);
        pillarFilterContainer.appendChild(selectEl);
        window.setActiveCountry = function (c) {
          activeCountry = c;
          try {
            if (c && c.alpha3) sessionStorage.setItem('lastCountryCode', c.alpha3);
          } catch (e) {}
          activeCountryIdRef.current = c ? c.alpha3 : null;
          showCountryCard(activeCountry, pillar);
          document.getElementById('country-select').value = (c && c.alpha3) || '';
          refreshGlobe();
        };
        document.getElementById('search-dialog-backdrop')?.addEventListener('click', closeSearch);
        document.getElementById('search-input')?.addEventListener('input', function () { fillSearchResults(this.value); });
        document.getElementById('search-input')?.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSearch(); });
      })
      .catch(function (err) { console.error(err); });
  }

  function initCountryPage() {
    const params = new URLSearchParams(window.location.search);
    var code = (params.get('code') || '').trim();
    if (code) code = code.toUpperCase();
    if (!code || code === 'UNDEFINED') {
      var hash = (window.location.hash || '').replace(/^#/, '').trim();
      if (hash) {
        var fromHash = hash.indexOf('code=') === 0 ? hash.split('=')[1] : hash;
        fromHash = (fromHash || '').trim().toUpperCase();
        if (fromHash && fromHash !== 'UNDEFINED') code = fromHash;
      }
    }
    if (!code || code === 'UNDEFINED') {
      try {
        var stored = (sessionStorage.getItem('lastCountryCode') || '').trim().toUpperCase();
        if (stored) {
          code = stored;
          if (history.replaceState) history.replaceState(null, '', 'country.html?code=' + encodeURIComponent(code) + '#' + encodeURIComponent(code));
        }
      } catch (e) {}
    }
    fetch('data/demo.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load data');
        return r.json();
      })
      .then(function (d) {
        data = d;
        const countries = d.countries || [];
        const globeData = d.globeData || [];
        const country = code ? (globeData.find(function (c) { return c.alpha3 === code; }) || countries.find(function (c) { return c.alpha3 === code; })) : null;
        renderHeader(countries, true);
        initThemeToggle();
        renderFooter();
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) breadcrumb.innerHTML = '<a href="index.html" class="mr-4 theme-muted" style="color: var(--muted);" onmouseover="this.style.color=\'var(--button-primary)\'" onmouseout="this.style.color=\'var(--muted)\'">Home</a><span class="theme-muted" style="color: var(--muted); opacity: 0.6;">/</span><span class="ml-4 font-medium" style="color: var(--button-primary);">' + (country ? country.name : (code ? 'Not found' : 'Country')) + '</span>';
        const flagEl = document.getElementById('country-flag');
        if (flagEl) {
          flagEl.innerHTML = '';
          if (country && country.alpha2) {
            const img = document.createElement('img');
            img.src = 'https://flagcdn.com/w160/' + (country.alpha2 || '').toLowerCase() + '.png';
            img.alt = '';
            img.width = 80;
            img.height = 60;
            img.style.objectFit = 'cover';
            flagEl.appendChild(img);
          }
        }
        document.getElementById('country-name').textContent = country ? country.name : (code ? 'Country not found' : 'Select a country');
        document.getElementById('country-region').textContent = country ? (country.region || '') + (country.subregion ? ' | ' + country.subregion : '') : 'Use the search or home page to open a country.';
        const ringContainer = document.getElementById('score-ring-container');
        const pillarsSection = document.getElementById('pillars-section');
        if (!country) {
          if (ringContainer) ringContainer.innerHTML = '<p class="py-4 theme-muted" style="color: var(--muted);"><a href="index.html" class="hover:underline" style="color: var(--button-primary);" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">Go to home</a> to select a country from the globe or search.</p>';
          if (pillarsSection) pillarsSection.innerHTML = '';
          document.getElementById('search-dialog-backdrop') && document.getElementById('search-dialog-backdrop').addEventListener('click', closeSearch);
          document.getElementById('search-input') && document.getElementById('search-input').addEventListener('input', function () { fillSearchResults(this.value); });
          return;
        }
        if (ringContainer && data.ancillary) {
          if (!country.scores) {
            ringContainer.innerHTML = '<p class="text-gray-500 py-4">No score data for this country in the demo.</p>';
          } else {
          const ancillary = data.ancillary;
          const pillars = ancillary.pillarNames.filter(function (p) { return p !== 'Overall'; });
          const size = 280;
          const r = size * 0.45;
          const innerRing = [r * 0.35, r * 0.55];
          const outerRing = [r * 0.55, r * 0.9];
          const totalSub = pillars.reduce(function (acc, p) { return acc + ((ancillary.pillars[p] && ancillary.pillars[p].length) || 1); }, 0);
          const step = Math.PI / totalSub;
          let paths = '';
          let a = -Math.PI / 2;
          pillars.forEach(function (pillar) {
            const subpillars = ancillary.pillars[pillar] || [];
            const color = ancillary.pillarColorMap[pillar].base;
            subpillars.forEach(function (sub) {
              const info = country.scores[pillar] && country.scores[pillar][sub];
              const num = (info && info.stage && info.stage.number) ? info.stage.number : 0;
              const fillOuter = innerRing[1] + (outerRing[1] - innerRing[1]) * (num / 5);
              const arc = d3.arc().innerRadius(innerRing[0]).outerRadius(outerRing[1]).startAngle(a).endAngle(a + step);
              paths += '<path d="' + arc() + '" fill="' + color + '" opacity="0.2" />';
              const fillArc = d3.arc().innerRadius(innerRing[1]).outerRadius(fillOuter).startAngle(a).endAngle(a + step);
              paths += '<path d="' + fillArc() + '" fill="' + color + '" />';
              a += step;
            });
          });
          ringContainer.innerHTML = '<svg width="' + size + '" height="' + (size * 0.55) + '" viewBox="0 0 ' + size + ' ' + (size * 0.55) + '"><g transform="translate(' + (size / 2) + ',' + (size * 0.45) + ')">' + paths + '</g></svg>';
          }
        }
        if (pillarsSection && data.ancillary) {
          if (!country.scores) {
            pillarsSection.innerHTML = '<h2 class="text-2xl font-bold mb-4">Pillars</h2><p class="text-gray-500">No score data for this country in the demo.</p>';
          } else {
          const ancillary = data.ancillary;
          const pillars = ancillary.pillarNames.filter(function (p) { return p !== 'Overall'; });
          let html = '<h2 class="text-2xl font-bold mb-4">Pillars</h2><div class="space-y-4">';
          pillars.forEach(function (p) {
            const color = ancillary.pillarColorMap[p].base;
            const stage = country.scores[p] && country.scores[p].stage;
            const name = (stage && stage.name) ? stage.name : 'No Data';
            const num = (stage && stage.number) ? stage.number : 0;
            html += '<div class="border rounded-lg p-4" style="border-left:4px solid ' + color + '"><h3 class="font-bold" style="color:' + color + '">' + p + '</h3><p class="text-sm text-gray-600">Stage ' + num + ': ' + name + '</p></div>';
          });
          html += '</div>';
          pillarsSection.innerHTML = html;
          }
        }
        document.getElementById('search-dialog-backdrop')?.addEventListener('click', closeSearch);
        document.getElementById('search-input')?.addEventListener('input', function () { fillSearchResults(this.value); });
      })
      .catch(function (err) {
        console.error(err);
        renderHeader([], true);
        renderFooter();
        var msg = document.getElementById('country-name');
        if (msg) msg.textContent = 'Could not load data';
        var region = document.getElementById('country-region');
        if (region) region.innerHTML = 'Open this demo from a local server (e.g. <code>node serve.js</code> in the html-demo folder). <a href="index.html" class="text-accent underline">Back to home</a>';
        var ring = document.getElementById('score-ring-container');
        if (ring) ring.innerHTML = '';
        var pillarsEl = document.getElementById('pillars-section');
        if (pillarsEl) pillarsEl.innerHTML = '<p class="text-gray-500">Data failed to load. See README for how to run the demo.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.getElementById('hero') || document.getElementById('globe-viz')) initIndexPage();
    });
  } else {
    if (document.getElementById('hero') || document.getElementById('globe-viz')) initIndexPage();
  }

  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
  window.initCountryPage = initCountryPage;
})();
