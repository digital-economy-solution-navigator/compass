(function () {
  'use strict';

  const ASSETS = 'assets';
  let data = null;

  function getData() {
    return data;
  }

  function renderHeader(countries, isCountryPage) {
    const header = document.getElementById('header');
    if (!header) return;
    const mobileMenuOpen = false;
    header.innerHTML = `
      <div class="lg:hidden p-3 flex items-center justify-between h-[75px]">
        <div class="flex items-center">
          <div><a href="index.html" class="block relative z-[100] h-[75px] w-[40px]"><img src="${ASSETS}/undp-logo.svg" alt="UNDP Logo" /></a></div>
          <div class="pl-3 md:pl-6 w-4"><a href="index.html"><h1 class="text-base font-semibold lg:text-xl" style="color:#000">Digital Development Compass</h1></a></div>
        </div>
        <div class="flex items-start">
          <button type="button" id="mobile-menu-btn" class="header-nav-bg-color font-semibold px-5 py-4 flex items-center" aria-label="Menu">
            <img src="${ASSETS}/hamburger.svg" width="24" height="24" alt="" id="mobile-menu-icon" />
          </button>
          <button type="button" id="search-trigger-mobile" class="p-2" aria-label="Search"><img src="${ASSETS}/search.svg" width="24" height="24" alt="" /></button>
        </div>
      </div>
      <div class="hidden mx-auto px-6 lg:flex lg:items-center lg:justify-between lg:space-x-4">
        <div class="flex items-center">
          <div class="h-[115px] flex-shrink-0"><a href="index.html" class="block relative z-[100] h-[122px] w-[60px]"><img src="${ASSETS}/undp-logo.svg" alt="UNDP Logo" /></a></div>
          <div class="pl-6 w-4"><a href="index.html"><h1 class="text-base font-semibold lg:text-xl" style="color:#000">Digital Development Compass</h1></a></div>
        </div>
        <div class="flex items-center justify-end space-x-14">
          <a href="about.html" class="uppercase text-sm hover:text-brand-blue-dark font-semibold tracking-wider">About</a>
          <a href="data.html" class="uppercase text-sm hover:text-brand-blue-dark font-semibold tracking-wider">Data</a>
          <a href="methodology.html" class="uppercase text-sm hover:text-brand-blue-dark font-semibold tracking-wider">Methodology</a>
        </div>
        <div class="flex items-center justify-end pr-16"><button type="button" id="search-trigger" class="p-2" aria-label="Search"><img src="${ASSETS}/search.svg" width="24" height="24" alt="" /></button></div>
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
        if (menuIcon) menuIcon.src = open ? ASSETS + '/hamburger.svg' : ASSETS + '/times-blue.svg';
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
      <nav class="flex flex-col w-full justify-center space-y-9 pt-[90px] px-6">
        <a href="about.html" class="uppercase text-base w-full font-bold tracking-extra-tight">About</a>
        <a href="data.html" class="uppercase text-base w-full font-bold tracking-extra-tight">Data</a>
        <a href="methodology.html" class="uppercase text-base w-full font-bold tracking-extra-tight">Methodology</a>
      </nav>
    `;
  }

  function renderFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <div class="max-w-screen-xl mx-auto px-4 lg:px-[140px] h-[440px] sm:h-[440px] md:h-[435px] lg:h-[333px] pt-12 md:pt-[52px] lg:pt-[52px]">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-8 md:pb-12 lg:pb-12">
          <div class="flex flex-row items-center space-x-0 mb-0 md:mb-4 lg:mb-0">
            <div class="w-[60px] flex-shrink-0"><img src="${ASSETS}/undp-white-logo.svg" width="60" height="123" alt="UNDP Logo" /></div>
            <div class="text-xl md:text-[25px] md:leading-[1.15] pl-4 font-normal md:text-left lg:text-left">
              <span>United Nations</span><br /><span>Development Programme</span>
            </div>
          </div>
          <div class="hidden md:block lg:block">
            <div class="flex justify-center space-x-8 mb-6">
              <a href="https://www.facebook.com/UNDP" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.linkedin.com/company/undp" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://www.instagram.com/UNDP" target="_blank" rel="noopener noreferrer"><img height="20" width="20" src="${ASSETS}/instagram-brands-solid.svg" alt="Instagram" /></a>
              <a href="https://twitter.com/UNDP" target="_blank" rel="noopener noreferrer"><img height="20" width="20" src="${ASSETS}/x-twitter-brands-solid.svg" alt="X" /></a>
              <a href="https://www.youtube.com/user/undp" target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
        </div>
        <div class="border-t border-white w-full"></div>
        <div class="flex flex-col lg:flex-row justify-between items-start w-full pt-[34px] text-center lg:text-left pb-5 md:mb-6 pl-0 sm:pl-4 md:pl-0 lg:pl-0">
          <p class="text-sm md:text-base font-normal lg:order-1 mb-2 lg:mb-0">&copy; ${year} United Nations Development Programme</p>
          <a href="https://www.undp.org/copyright-terms-use" class="text-base font-normal order-1 lg:order-2 mb-2 lg:mb-0 opacity-100 hover:opacity-70">Terms Of Use</a>
        </div>
        <div class="md:hidden lg:hidden"><div class="flex space-x-8 pl-12"><a href="https://www.facebook.com/UNDP" target="_blank" rel="noopener noreferrer">Facebook</a><a href="https://www.linkedin.com/company/undp" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://www.instagram.com/UNDP" target="_blank" rel="noopener noreferrer"><img height="20" width="20" src="${ASSETS}/instagram-brands-solid.svg" alt="Instagram" /></a><a href="https://twitter.com/UNDP" target="_blank" rel="noopener noreferrer"><img height="20" width="20" src="${ASSETS}/x-twitter-brands-solid.svg" alt="X" /></a><a href="https://www.youtube.com/user/undp" target="_blank" rel="noopener noreferrer">YouTube</a></div></div>
      </div>
    `;
  }

  function renderHero() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    hero.innerHTML = `
      <div>
        <h1 class="text-[40px] sm:text-[40px] md:text-[35px] lg:text-[35px] leading-[1.1] font-bold">Is your nation ready to navigate digital transformation?</h1>
        <p class="text-base md:text-[20px] lg:text-[20px] leading-7 mt-4 text-left" style="color:#333333">Explore your nation's digital progress using the world's largest database of digital development data. Leveraging the pillars of UNDP's Digital Transformation Framework, the Digital Development Compass lets you discover and compare progress across a range of key issues.</p>
      </div>
    `;
  }

  function renderPillarFilter(selectedPillar, onChange) {
    const container = document.getElementById('pillar-filter');
    if (!container || !data) return;
    const ancillary = data.ancillary;
    container.innerHTML = `
      <fieldset>
        <h6 class="text-[16px] leading-[18px] tracking-normal font-bold text-[#333333] block uppercase pb-3">Filter by pillar</h6>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2" id="pillar-radios"></div>
      </fieldset>
    `;
    const radios = document.getElementById('pillar-radios');
    ancillary.pillarNames.forEach(function (pillar) {
      const color = ancillary.pillarColorMap[pillar].base;
      const checked = pillar === selectedPillar;
      const label = document.createElement('label');
      label.className = 'p-4 font-bold cursor-pointer flex items-center rounded-md overflow-hidden transition-all relative text-sm group border';
      label.style.borderColor = checked ? color : '';
      label.innerHTML = `
        <div class="absolute w-full h-full inset-0 z-0 opacity-0 group-hover:opacity-20 transition-opacity flex-shrink-0" style="background-color:${color};${checked ? 'opacity:0.1' : ''}"></div>
        <div class="w-3 h-3 rounded-full mr-2 flex-shrink-0" style="background-color:${color}"></div>
        <input type="radio" name="pillar-radio" value="${pillar}" class="sr-only" ${checked ? 'checked' : ''} />
        <p style="color:${checked ? color : ''};font-weight:600" id="${pillar}">${pillar}</p>
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
          <div class="mt-4"><p class="text-sm font-medium uppercase tracking-widest" style="color:${primaryColor}">Stage ${stageNum}: ${stageName}</p><p class="font-medium text-lg">Overall</p><p class="text-sm text-gray-600">${overallStage?.description || ''}</p></div>
        </div>
      </div>
    `;
  }

  function renderReadinessScale(scores, activePillar, onPillarClick) {
    if (!data) return '';
    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames;
    let html = '<div class="flex h-6 border-t px-1">';
    pillars.forEach(function (pillar) {
      const info = scores && scores[pillar];
      const stage = info?.stage;
      const percent = (stage && stage.number) ? stage.number * 20 : 0;
      const color = ancillary.pillarColorMap[pillar].base;
      const active = pillar === activePillar;
      html += `<button type="button" class="relative flex-1 h-full appearance-none focus:outline-none transition-opacity border border-b-0 ${active ? 'bg-gray-100 border-gray-100' : 'border-white'}" title="${pillar}: ${stage ? stage.name : 'No Data'}" data-pillar="${pillar}"><div class="absolute left-0 bottom-0 right-0" style="height:${percent}%;background:${color}"></div></button>`;
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
      <div class="border-gray-200 shadow-lg pb-0 w-full flex-1 border rounded-lg flex flex-col items-center bg-white overflow-hidden">
        <div class="p-4 flex flex-col items-center">
          <a href="country.html?code=${country.alpha3}#${country.alpha3}">
            <div class="flex flex-col items-center group cursor-pointer">
              <div class="flex-shrink-0"><img src="${flagUrl}" alt="" width="48" height="36" style="object-fit:cover" /></div>
              <div class="flex-1 ml-2"><h3 class="text-xl"><span class="group-hover:underline">${country.name}</span></h3></div>
            </div>
          </a>
          <div class="py-4 flex items-center justify-center text-center w-full" id="country-card-gauge"></div>
        </div>
        ${showFooterLink ? `<div class="mb-4"><a href="country.html?code=${country.alpha3}#${country.alpha3}" class="bg-[#006EB5] hover:button-bg-color text-base uppercase font-bold px-6 py-4 text-white flex-shrink-0 inline-flex items-center">view more</a></div>` : ''}
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
      return;
    }
    container.classList.remove('hidden');
    container.innerHTML = `
      <div class="flex justify-end mb-2">
        <button type="button" id="close-country-card" class="text-brand-blue flex items-center p-2" aria-label="Close">
          <span class="uppercase text-xs tracking-widest font-medium">Close</span>
        </button>
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

  function fillSearchResults(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl || !data) return;
    const q = (query || '').toLowerCase().trim();
    const list = q ? data.countries.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1; }) : data.countries.slice(0, 20);
    resultsEl.innerHTML = list.map(function (c) {
      return '<a href="country.html?code=' + c.alpha3 + '#' + c.alpha3 + '" class="block px-4 py-3 border-b hover:bg-gray-50">' + c.name + '</a>';
    }).join('') || '<p class="p-4 text-gray-500">No countries found</p>';
  }

  function makePillarScales(ancillary) {
    const scales = {};
    ancillary.pillarNames.forEach(function (p) {
      const triple = ancillary.pillarColorMap[p] && ancillary.pillarColorMap[p].triple;
      if (triple && triple.length >= 2) {
        scales[p] = d3.scaleLinear().domain([0, 2.5, 5]).range(triple).interpolate(d3.interpolateLab).clamp(true);
      } else {
        scales[p] = function () { return '#eee'; };
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
    });
    const pillarScales = makePillarScales(ancillary);
    const globeEl = document.getElementById('globe-viz');
    if (!globeEl || merged.length === 0) return null;
    const globe = new Globe(globeEl)
      .showGraticules(true)
      .showAtmosphere(true)
      .atmosphereAltitude(0.23)
      .atmosphereColor('#DCE9FE')
      .backgroundColor('rgba(0,0,0,0)')
      .showGlobe(true)
      .globeMaterial(new THREE.MeshPhysicalMaterial({ color: '#fff' }))
      .polygonsData(merged)
      .polygonGeoJsonGeometry(function (d) { return d.geojson && d.geojson.geometry; })
      .polygonCapMaterial(function (d) {
        var p = pillarRef.current;
        var score = d.scores && d.scores[p] && d.scores[p].score;
        var isActive = activeCountryIdRef.current === d.alpha3;
        var color = isActive ? (pillarScales[p] ? pillarScales[p](6) : '#6366f1') : (score ? (pillarScales[p] ? pillarScales[p](score) : '#eee') : '#eee');
        return new THREE.MeshPhysicalMaterial({
          color: color,
          roughness: 0.5,
          reflectivity: 1.2,
          opacity: activeCountryIdRef.current ? (activeCountryIdRef.current === d.alpha3 ? 1 : 0.9) : 1
        });
      })
      .polygonAltitude(function (d) { return activeCountryIdRef.current === d.alpha3 ? 0.035 : 0.01; })
      .polygonSideColor(function () { return 'rgba(255,255,255,255)'; })
      .polygonStrokeColor(function () { return '#111'; })
      .polygonLabel(function (d) {
        if (!d || !d.unMember) return '';
        return '<div class="bg-white rounded-md shadow-lg px-4 py-1 uppercase text-xs tracking-widest font-medium text-black"><span>' + d.name + '</span></div>';
      })
      .onPolygonClick(function (d) {
        if (!d.unMember) return;
        if (d.alpha3 === activeCountryIdRef.current) {
          window.location.href = 'country.html?code=' + d.alpha3 + '#' + d.alpha3;
          return;
        }
        onCountrySelect(d.alpha3);
      })
      .onGlobeReady(function () {
        try {
          var ctrl = globe.controls && globe.controls();
          if (ctrl) {
            ctrl.autoRotate = true;
            ctrl.autoRotateSpeed = -0.25;
            ctrl.enableZoom = false;
          }
          globe.pointOfView({ altitude: 1.9 }, 0);
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
    return globe;
  }

  function initIndexPage() {
    Promise.all([fetch('data/demo.json').then(function (r) { return r.json(); }), fetch('data/country-geojson.json').then(function (r) { return r.json(); })])
      .then(function (results) {
        var d = results[0];
        var geojson = results[1];
        data = d;
        const countries = d.countries || [];
        renderHeader(countries);
        renderFooter();
        renderHero();
        let pillar = 'Overall';
        let activeCountry = null;
        const globeData = d.globeData || [];
        var pillarRef = { current: pillar };
        var activeCountryIdRef = { current: null };
        var globeInstance = null;
        function refreshGlobe() {
          if (globeInstance && mergedForGlobe) {
            pillarRef.current = pillar;
            activeCountryIdRef.current = activeCountry ? activeCountry.alpha3 : null;
            globeInstance.polygonsData(mergedForGlobe);
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
        });
        globeInstance = initGlobe(globeData, geojson, data.ancillary, pillarRef, activeCountryIdRef, function (alpha3) {
          activeCountry = globeData.find(function (c) { return c.alpha3 === alpha3; }) || null;
          var sel = document.getElementById('country-select');
          if (sel) sel.value = alpha3 || '';
          showCountryCard(activeCountry, pillar);
          refreshGlobe();
        });
        const pillarFilterContainer = document.getElementById('pillar-filter');
        const selectEl = document.createElement('div');
        selectEl.className = 'mt-4';
        selectEl.innerHTML = '<label class="block text-[16px] font-bold text-[#333333] uppercase pb-2">Select a country</label><select id="country-select" class="w-full border border-gray-300 rounded px-3 py-2"><option value="">-- Choose --</option>' + globeData.map(function (c) { return '<option value="' + c.alpha3 + '">' + c.name + '</option>'; }).join('') + '</select>';
        function updatePillar(p) {
          pillar = p;
          pillarRef.current = pillar;
          renderPillarFilter(pillar, updatePillar);
          pillarFilterContainer.appendChild(selectEl);
          if (activeCountry) showCountryCard(activeCountry, pillar);
          if (globeInstance && mergedForGlobe) globeInstance.polygonsData(mergedForGlobe);
        }
        renderPillarFilter(pillar, updatePillar);
        pillarFilterContainer.appendChild(selectEl);
        document.getElementById('country-select').addEventListener('change', function () {
          const code = this.value;
          activeCountry = code ? globeData.find(function (c) { return c.alpha3 === code; }) || null : null;
          activeCountryIdRef.current = activeCountry ? activeCountry.alpha3 : null;
          showCountryCard(activeCountry, pillar);
          refreshGlobe();
        });
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
        renderFooter();
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) breadcrumb.innerHTML = '<a href="index.html" class="mr-4 text-black hover:text-red-500 uppercase">Home</a><span class="text-[#D12800]">/</span><span class="ml-4 text-[#D12800] uppercase">' + (country ? country.name : (code ? 'Not found' : 'Country')) + '</span>';
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
          if (ringContainer) ringContainer.innerHTML = '<p class="text-gray-500 py-4"><a href="index.html" class="text-brand-blue hover:underline">Go to home</a> to select a country from the globe or search.</p>';
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
        if (region) region.innerHTML = 'Open this demo from a local server (e.g. <code>node serve.js</code> in the html-demo folder). <a href="index.html" class="text-brand-blue underline">Back to home</a>';
        var ring = document.getElementById('score-ring-container');
        if (ring) ring.innerHTML = '';
        var pillarsEl = document.getElementById('pillars-section');
        if (pillarsEl) pillarsEl.innerHTML = '<p class="text-gray-500">Data failed to load. See README for how to run the demo.</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (document.getElementById('hero')) initIndexPage();
    });
  } else {
    if (document.getElementById('hero')) initIndexPage();
  }

  window.openSearch = openSearch;
  window.closeSearch = closeSearch;
  window.initCountryPage = initCountryPage;
})();
