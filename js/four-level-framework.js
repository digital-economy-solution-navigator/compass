(function () {
  "use strict";

  function scoreBand(score, bands) {
    var s = Number(score) || 0;
    return bands.find(function (b) { return s >= b.min && s <= b.max; }) || bands[0];
  }

  function mean(values) {
    if (!values.length) return 0;
    return values.reduce(function (acc, v) { return acc + v; }, 0) / values.length;
  }

  function quadrantLabel(item) {
    var x = Number(item.competitiveness) || 0;
    var y = Number(item.aiPenetration) || 0;
    if (x >= 50 && y >= 50) return "High-Reward / Low-Risk";
    if (x < 50 && y >= 50) return "High-Reward / High-Risk";
    if (x >= 50 && y < 50) return "Selective / Defend";
    return "Low Immediate Priority";
  }

  function renderLevelNav() {
    var el = document.getElementById("framework-level-nav");
    if (!el) {
      console.error("Four-Level Framework: framework-level-nav element not found!");
      return;
    }
    // Remove loading placeholder
    var loadingEl = document.getElementById("nav-loading");
    if (loadingEl) loadingEl.remove();
    var cards = [
      { id: "level-1-panel", title: "Level 1", subtitle: "Country Strategic Posture", icon: "🌍", color: "#00A3E0" },
      { id: "level-2-panel", title: "Level 2", subtitle: "Sector Priority Mapping", icon: "📊", color: "#0891B2" },
      { id: "level-3-panel", title: "Level 3", subtitle: "Enterprise/SME Maturity", icon: "🏢", color: "#45FFD3" },
      { id: "level-4-panel", title: "Level 4", subtitle: "Lighthouse Feasibility", icon: "🚀", color: "#7c3aed" }
    ];
    el.innerHTML = cards.map(function (card) {
      return '<button type="button" data-target="' + card.id + '" class="group text-left rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style="background: var(--card-bg); border: var(--border); box-shadow: var(--shadow);">' +
        '<div class="flex items-start gap-4">' +
        '<div class="text-3xl flex-shrink-0">' + card.icon + '</div>' +
        '<div class="flex-1">' +
        '<p class="text-xs uppercase tracking-[0.24em] mb-2 font-semibold" style="color: ' + card.color + ';">' + card.title + '</p>' +
        '<p class="text-lg font-bold theme-text leading-tight">' + card.subtitle + "</p>" +
        '</div>' +
        '<svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style="color: var(--brand);" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>' +
        '</div>' +
        "</button>";
    }).join("");
    el.querySelectorAll("button[data-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-target");
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  function renderLevel1(demoData) {
    var panel = document.getElementById("level-1-panel");
    if (!panel) {
      console.error("Four-Level Framework: level-1-panel element not found!");
      return;
    }
    if (!demoData) {
      console.error("Four-Level Framework: demoData is missing!");
      panel.innerHTML = '<div class="p-8 text-center" style="color: var(--error);">Error: No demo data available</div>';
      return;
    }
    var topCountries = (demoData.globeData || []).slice(0, 6);
    panel.innerHTML =
      '<div class="p-8 lg:p-12">' +
      '<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">' +
      '<div>' +
      '<p class="text-xs uppercase tracking-[0.24em] mb-2 font-semibold" style="color: var(--brand);">Level 1</p>' +
      '<h2 class="text-3xl lg:text-4xl font-bold mb-2 theme-text">Country Level (Strategic Posture)</h2>' +
      '<p class="text-base leading-relaxed max-w-2xl theme-muted">Uses the current country benchmarking model and pillar scores as the entry point for downstream decisions.</p>' +
      '</div>' +
      '<a href="index.html" class="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg inline-flex items-center gap-2" style="background: var(--button-primary);">' +
      'Open Globe <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>' +
      '</a>' +
      '</div>' +
      '<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">' +
      topCountries.map(function (c) {
        return '<a href="country.html?code=' + c.alpha3 + "#" + c.alpha3 + '" class="group rounded-xl px-4 py-3 block transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg" style="background: var(--panel-strong); border: var(--border);">' +
          '<p class="font-semibold theme-text mb-1 group-hover:opacity-80">' + c.name + '</p>' +
          '<p class="text-xs theme-muted">' + c.alpha3 + "</p>" +
          "</a>";
      }).join("") +
      "</div>" +
      "</div>";
  }

  function renderLevel2(frameworkData) {
    var panel = document.getElementById("level-2-panel");
    if (!panel) {
      console.error("Four-Level Framework: level-2-panel element not found!");
      return;
    }
    if (!frameworkData || !frameworkData.level2) {
      console.error("Four-Level Framework: frameworkData.level2 is missing!");
      panel.innerHTML = '<div class="p-8 text-center" style="color: var(--error);">Error: Level 2 data not available</div>';
      return;
    }
    var countries = frameworkData.level2.countries || [];
    var countryOptions = countries.map(function (c) {
      return '<option value="' + c.alpha3 + '">' + c.name + "</option>";
    }).join("");
    panel.innerHTML =
      '<div class="p-8 lg:p-12">' +
      '<div class="mb-8">' +
      '<p class="text-xs uppercase tracking-[0.24em] mb-2 font-semibold" style="color: var(--brand);">Level 2</p>' +
      '<h2 class="text-3xl lg:text-4xl font-bold mb-3 theme-text">Sector Level (Priority Mapping)</h2>' +
      '<p class="text-base leading-relaxed max-w-2xl theme-muted">Identify which industrial sectors are most ready for Artificial Intelligence investment through a risk/reward matrix.</p>' +
      '</div>' +
      '<div class="grid lg:grid-cols-3 gap-4 mb-6">' +
      '<label class="block"><span class="text-sm font-medium theme-text mb-2 block">Country</span><select id="l2-country" class="w-full rounded-xl px-4 py-3 text-sm transition-all" style="background: var(--controls-bg); border: var(--border); color: var(--text);">' + countryOptions + "</select></label>" +
      '<label class="block"><span class="text-sm font-medium theme-text mb-2 block">Sector</span><select id="l2-sector" class="w-full rounded-xl px-4 py-3 text-sm transition-all" style="background: var(--controls-bg); border: var(--border); color: var(--text);"></select></label>' +
      '<div class="rounded-xl p-4" style="background: var(--panel-strong); border: var(--border);"><p class="text-xs uppercase tracking-[0.2em] theme-muted mb-2">Axes</p><p class="text-sm font-medium theme-text">X: Competitiveness<br>Y: AI Penetration</p></div>' +
      "</div>" +
      '<div id="l2-chart" class="rounded-2xl p-6 mb-6" style="background: var(--panel-strong); border: var(--border);"></div>' +
      '<div id="l2-recommendation" class="rounded-xl p-6" style="background: var(--panel-strong); border: var(--border);"></div>' +
      "</div>";

    var countrySelect = document.getElementById("l2-country");
    var sectorSelect = document.getElementById("l2-sector");
    var chartEl = document.getElementById("l2-chart");
    var recEl = document.getElementById("l2-recommendation");

    function draw() {
      var selectedCountry = countries.find(function (c) { return c.alpha3 === countrySelect.value; }) || countries[0];
      var sectors = (selectedCountry && selectedCountry.sectors) || [];
      var selectedSectorName = sectorSelect.value || (sectors[0] && sectors[0].name);
      var selected = sectors.find(function (s) { return s.name === selectedSectorName; }) || sectors[0];
      var width = 800;
      var height = 400;
      var p = 60;
      var brandColor = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim() || '#00A3E0';
      var mutedColor = getComputedStyle(document.documentElement).getPropertyValue('--muted').trim() || '#64748b';
      var svg = '<svg viewBox="0 0 ' + width + " " + height + '" class="w-full h-auto" style="max-height: 500px;">' +
        '<defs><linearGradient id="quad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:' + brandColor + ';stop-opacity:0.1" /><stop offset="100%" style="stop-color:' + brandColor + ';stop-opacity:0.05" /></linearGradient></defs>' +
        '<rect x="' + p + '" y="' + p + '" width="' + (width - p * 2) + '" height="' + (height - p * 2) + '" fill="url(#quad1)" stroke="currentColor" stroke-width="1.5" opacity="0.3" rx="8"/>' +
        '<line x1="' + (width / 2) + '" y1="' + p + '" x2="' + (width / 2) + '" y2="' + (height - p) + '" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3"/>' +
        '<line x1="' + p + '" y1="' + (height / 2) + '" x2="' + (width - p) + '" y2="' + (height / 2) + '" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.3"/>' +
        '<text x="' + (width / 2) + '" y="' + (p - 15) + '" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.6">High AI Penetration</text>' +
        '<text x="' + (width / 2) + '" y="' + (height - p + 30) + '" text-anchor="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.6">Low AI Penetration</text>' +
        '<text x="' + (p - 10) + '" y="' + (height / 2) + '" text-anchor="end" dominant-baseline="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.6">Low Competitiveness</text>' +
        '<text x="' + (width - p + 10) + '" y="' + (height / 2) + '" text-anchor="start" dominant-baseline="middle" font-size="12" font-weight="600" fill="currentColor" opacity="0.6">High Competitiveness</text>';
      svg += sectors.map(function (s) {
        var x = p + ((Number(s.competitiveness) || 0) / 100) * (width - p * 2);
        var y = (height - p) - ((Number(s.aiPenetration) || 0) / 100) * (height - p * 2);
        var r = 10 + ((Number(s.opportunity) || 0) / 100) * 20;
        var active = selected && s.name === selected.name;
        var fillColor = active ? brandColor : mutedColor;
        var opacity = active ? "0.8" : "0.4";
        var strokeWidth = active ? "2" : "1";
        return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + fillColor + '" fill-opacity="' + opacity + '" stroke="' + fillColor + '" stroke-width="' + strokeWidth + '" class="transition-all cursor-pointer" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));"></circle>' +
          '<text x="' + x + '" y="' + (y - r - 8) + '" text-anchor="middle" font-size="11" font-weight="600" fill="currentColor" opacity="' + (active ? "1" : "0.7") + '">' + s.name + "</text>";
      }).join("");
      svg += "</svg>";
      chartEl.innerHTML = svg;
      var q = quadrantLabel(selected);
      recEl.innerHTML = 
        '<div class="flex items-start gap-3 mb-4">' +
        '<div class="flex-1">' +
        '<p class="text-lg font-bold theme-text mb-1">' + selected.name + "</p>" +
        '<p class="text-sm font-semibold mb-2" style="color: var(--brand);">' + q + "</p>" +
        '<div class="grid grid-cols-3 gap-3 text-xs">' +
        '<div><p class="theme-muted mb-1">Competitiveness</p><p class="font-semibold theme-text">' + selected.competitiveness + '%</p></div>' +
        '<div><p class="theme-muted mb-1">AI Penetration</p><p class="font-semibold theme-text">' + selected.aiPenetration + '%</p></div>' +
        '<div><p class="theme-muted mb-1">Opportunity</p><p class="font-semibold theme-text">' + selected.opportunity + '%</p></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<button id="to-level3" type="button" class="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg" style="background: var(--button-primary);">Continue to Level 3 →</button>';
      document.getElementById("to-level3")?.addEventListener("click", function () {
        document.getElementById("level-3-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
        var target = document.getElementById("l3-context");
        if (target) target.textContent = selectedCountry.name + " / " + selected.name;
      });
    }

    function syncSectors() {
      var selectedCountry = countries.find(function (c) { return c.alpha3 === countrySelect.value; }) || countries[0];
      var sectors = (selectedCountry && selectedCountry.sectors) || [];
      sectorSelect.innerHTML = sectors.map(function (s) {
        return '<option value="' + s.name + '">' + s.name + "</option>";
      }).join("");
      draw();
    }

    countrySelect?.addEventListener("change", syncSectors);
    sectorSelect?.addEventListener("change", draw);
    syncSectors();
  }

  function renderLevel3(frameworkData) {
    var panel = document.getElementById("level-3-panel");
    if (!panel) {
      console.error("Four-Level Framework: level-3-panel element not found!");
      return;
    }
    if (!frameworkData || !frameworkData.level3) {
      console.error("Four-Level Framework: frameworkData.level3 is missing!");
      panel.innerHTML = '<div class="p-8 text-center" style="color: var(--error);">Error: Level 3 data not available</div>';
      return;
    }
    var level3 = frameworkData.level3 || {};
    var bands = frameworkData.scoreBands || [];
    panel.innerHTML =
      '<div class="p-8 lg:p-12">' +
      '<div class="mb-8">' +
      '<p class="text-xs uppercase tracking-[0.24em] mb-2 font-semibold" style="color: var(--brand);">Level 3</p>' +
      '<h2 class="text-3xl lg:text-4xl font-bold mb-3 theme-text">Enterprise and SME Level (Operational Maturity)</h2>' +
      '<p id="l3-context" class="text-base mb-4 theme-muted">Use Level 2 sector selection to set context.</p>' +
      '<div class="mb-6"><label class="block"><span class="text-sm font-medium theme-text mb-2 block">Assessment Mode</span><select id="l3-mode" class="w-full md:w-96 rounded-xl px-4 py-3 text-sm transition-all" style="background: var(--controls-bg); border: var(--border); color: var(--text);"><option value="enterprise">Enterprise Full Assessment (31 indicators)</option><option value="sme">SME Rapid Assessment (10-20 indicators)</option></select></label></div>' +
      '</div>' +
      '<div id="l3-indicators" class="grid lg:grid-cols-2 gap-4 mb-6"></div>' +
      '<div id="l3-result" class="rounded-xl p-6" style="background: var(--panel-strong); border: var(--border);"></div>' +
      "</div>";

    var modeSelect = document.getElementById("l3-mode");
    var indicatorsEl = document.getElementById("l3-indicators");
    var resultEl = document.getElementById("l3-result");

    function renderMode() {
      var mode = modeSelect.value;
      var modeData = level3.modes[mode];
      var indicators = (modeData && modeData.indicators) || [];
      indicatorsEl.innerHTML = indicators.map(function (i) {
        return '<label class="rounded-xl p-4 block transition-all hover:shadow-md" style="background: var(--panel-strong); border: var(--border);">' +
          '<p class="text-sm font-medium mb-3 theme-text">' + i.label + '</p>' +
          '<input data-dimension="' + i.dimension + '" type="range" min="0" max="5" value="2" step="0.5" class="w-full h-2 rounded-lg appearance-none cursor-pointer" style="background: var(--controls-bg); accent-color: var(--brand);" />' +
          '<div class="flex justify-between text-xs mt-1 theme-muted"><span>0</span><span>5</span></div>' +
          "</label>";
      }).join("");
      evaluate();
      indicatorsEl.querySelectorAll("input[type=range]").forEach(function (input) {
        input.addEventListener("input", evaluate);
      });
    }

    function evaluate() {
      var dimensions = level3.dimensions || [];
      var dimensionScores = {};
      dimensions.forEach(function (d) { dimensionScores[d.id] = []; });
      indicatorsEl.querySelectorAll("input[type=range]").forEach(function (input) {
        var dim = input.getAttribute("data-dimension");
        dimensionScores[dim].push(Number(input.value) || 0);
      });
      var weighted = dimensions.map(function (d) {
        var avg = mean(dimensionScores[d.id] || []);
        return (avg / 5) * d.weight;
      });
      var total = Math.round(weighted.reduce(function (acc, v) { return acc + v; }, 0));
      var band = scoreBand(total, bands);
      var weakest = dimensions
        .map(function (d) { return { name: d.name, avg: mean(dimensionScores[d.id] || []), id: d.id }; })
        .sort(function (a, b) { return a.avg - b.avg; })
        .slice(0, 2);
      resultEl.innerHTML =
        '<div class="mb-6">' +
        '<div class="flex items-center gap-4 mb-3">' +
        '<div class="text-4xl font-bold" style="color: var(--brand);">' + total + '</div>' +
        '<div class="flex-1">' +
        '<p class="text-lg font-bold theme-text mb-1">Maturity Score: ' + total + '/100</p>' +
        '<p class="text-sm font-semibold" style="color: var(--brand);">' + band.name + '</p>' +
        '</div>' +
        '</div>' +
        '<p class="text-sm leading-relaxed theme-muted">' + band.description + "</p>" +
        '</div>' +
        '<div class="mb-6 pt-6 border-t" style="border-color: var(--border);">' +
        '<p class="text-sm font-semibold theme-text mb-3">Priority Recommendations</p>' +
        '<ul class="space-y-2">' +
        weakest.map(function (w) { return '<li class="flex items-start gap-2 text-sm theme-muted"><span class="text-xs mt-1" style="color: var(--brand);">•</span><span>Strengthen <strong class="theme-text">' + w.name + '</strong> first.</span></li>'; }).join("") +
        "</ul>" +
        '</div>' +
        '<button id="to-level4" type="button" class="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg" style="background: var(--button-primary);">Continue to Level 4 →</button>';
      document.getElementById("to-level4")?.addEventListener("click", function () {
        document.getElementById("level-4-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    modeSelect?.addEventListener("change", renderMode);
    renderMode();
  }

  function avgReadiness(project) {
    var t = project.technicalReadiness || {};
    var s = project.socialReadiness || {};
    var vals = Object.keys(t).map(function (k) { return t[k]; }).concat(Object.keys(s).map(function (k) { return s[k]; }));
    return Math.round(mean(vals));
  }

  function renderLevel4(frameworkData) {
    var panel = document.getElementById("level-4-panel");
    if (!panel) {
      console.error("Four-Level Framework: level-4-panel element not found!");
      return;
    }
    if (!frameworkData || !frameworkData.level4) {
      console.error("Four-Level Framework: frameworkData.level4 is missing!");
      panel.innerHTML = '<div class="p-8 text-center" style="color: var(--error);">Error: Level 4 data not available</div>';
      return;
    }
    var projects = (frameworkData.level4 && frameworkData.level4.projects) || [];
    var options = projects.map(function (p) {
      return '<option value="' + p.id + '">' + p.country + " - " + p.name + "</option>";
    }).join("");
    panel.innerHTML =
      '<div class="p-8 lg:p-12">' +
      '<div class="mb-8">' +
      '<p class="text-xs uppercase tracking-[0.24em] mb-2 font-semibold" style="color: var(--brand);">Level 4</p>' +
      '<h2 class="text-3xl lg:text-4xl font-bold mb-3 theme-text">Project Level (Lighthouse Feasibility)</h2>' +
      '<p class="text-base leading-relaxed max-w-2xl theme-muted">Evaluate the readiness of specific technical cooperation or "lighthouse" pilot projects for successful deployment and long-term sustainability.</p>' +
      '</div>' +
      '<div class="mb-6"><label class="block"><span class="text-sm font-medium theme-text mb-2 block">Select Project</span><select id="l4-project" class="w-full lg:w-2/3 rounded-xl px-4 py-3 text-sm transition-all" style="background: var(--controls-bg); border: var(--border); color: var(--text);">' + options + "</select></label></div>" +
      '<div id="l4-content"></div>' +
      "</div>";
    var select = document.getElementById("l4-project");
    var content = document.getElementById("l4-content");

    function renderProject() {
      var p = projects.find(function (x) { return x.id === select.value; }) || projects[0];
      var tech = p.technicalReadiness || {};
      var social = p.socialReadiness || {};
      content.innerHTML =
        '<div class="grid lg:grid-cols-3 gap-4 mb-6">' +
        '<div class="rounded-xl p-4" style="background: var(--panel-strong); border: var(--border);"><p class="text-xs uppercase tracking-[0.2em] theme-muted mb-2">Phase</p><p class="text-lg font-bold theme-text">' + p.phase + '</p></div>' +
        '<div class="rounded-xl p-4" style="background: var(--panel-strong); border: var(--border);"><p class="text-xs uppercase tracking-[0.2em] theme-muted mb-2">Composite Readiness</p><p class="text-2xl font-bold" style="color: var(--brand);">' + avgReadiness(p) + '<span class="text-sm font-normal theme-muted">/100</span></p></div>' +
        '<a class="rounded-xl p-4 block text-center transition-all hover:shadow-lg font-semibold text-white" style="background: var(--button-primary);" href="levelref/index.html?case=' + encodeURIComponent(p.country.toLowerCase()) + '">Open Detailed View →</a>' +
        "</div>" +
        '<div class="grid md:grid-cols-2 gap-4 mb-6">' +
        '<div class="rounded-xl p-6" style="background: var(--panel-strong); border: var(--border);"><p class="text-sm font-bold theme-text mb-4 uppercase tracking-[0.2em]">Technical Readiness</p>' +
        Object.keys(tech).map(function (k) { return '<div class="mb-3"><div class="flex justify-between items-center mb-1"><span class="text-sm theme-text">' + k + '</span><span class="text-sm font-semibold" style="color: var(--brand);">' + tech[k] + '/100</span></div><div class="h-2 rounded-full" style="background: var(--controls-bg);"><div class="h-2 rounded-full transition-all" style="background: var(--brand); width: ' + tech[k] + '%;"></div></div></div>'; }).join("") +
        "</div>" +
        '<div class="rounded-xl p-6" style="background: var(--panel-strong); border: var(--border);"><p class="text-sm font-bold theme-text mb-4 uppercase tracking-[0.2em]">Social Readiness</p>' +
        Object.keys(social).map(function (k) { return '<div class="mb-3"><div class="flex justify-between items-center mb-1"><span class="text-sm theme-text">' + k + '</span><span class="text-sm font-semibold" style="color: var(--brand);">' + social[k] + '/100</span></div><div class="h-2 rounded-full" style="background: var(--controls-bg);"><div class="h-2 rounded-full transition-all" style="background: var(--brand); width: ' + social[k] + '%;"></div></div></div>'; }).join("") +
        "</div>" +
        "</div>" +
        '<div class="rounded-xl p-6 mb-6" style="background: var(--panel-strong); border: var(--border);"><p class="text-sm font-bold theme-text mb-4 uppercase tracking-[0.2em]">Performance Metrics</p><ul class="space-y-2">' +
        (p.metrics || []).map(function (m) { return '<li class="flex items-start gap-2 text-sm theme-muted"><span class="text-xs mt-1" style="color: var(--brand);">•</span><span>' + m + '</span></li>'; }).join("") +
        "</ul></div>" +
        '<div class="rounded-xl p-6" style="background: var(--panel-strong); border: var(--border);"><p class="text-sm font-bold theme-text mb-4 uppercase tracking-[0.2em]">Evidence & Sources</p>' +
        (p.evidence || []).map(function (e) { return '<a class="block text-sm mb-3 p-3 rounded-lg transition-all hover:shadow-md" style="background: var(--controls-bg); border: var(--border); color: var(--button-primary);" href="' + e.url + '" target="_blank" rel="noopener noreferrer">' + e.title + ' <svg class="inline w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg></a>'; }).join("") +
        "</div>";
    }

    select?.addEventListener("change", renderProject);
    renderProject();
  }

  function init() {
    console.log("Four-Level Framework: Starting initialization...");
    try {
      Promise.all([
        fetch("data/demo.json").then(function (r) { 
          if (!r.ok) throw new Error("Failed to load demo.json: " + r.status);
          return r.json(); 
        }),
        fetch("data/four-level-framework.json").then(function (r) { 
          if (!r.ok) throw new Error("Failed to load four-level-framework.json: " + r.status);
          return r.json(); 
        })
      ])
        .then(function (results) {
          console.log("Four-Level Framework: Data loaded successfully");
          try {
            var demoData = results[0];
            var frameworkData = results[1];
            console.log("Four-Level Framework: Rendering components...");
            if (window.setData) window.setData(demoData);
            if (window.renderHeader) window.renderHeader(demoData.countries || []);
            if (window.renderFooter) window.renderFooter();
            if (window.initThemeToggle) window.initThemeToggle();
            if (window.fillSearchResults) {
              document.getElementById("search-input")?.addEventListener("input", function () {
                window.fillSearchResults(this.value);
              });
              document.getElementById("search-dialog-backdrop")?.addEventListener("click", function () {
                if (window.closeSearch) window.closeSearch();
              });
            }
            renderLevelNav();
            renderLevel1(demoData);
            renderLevel2(frameworkData);
            renderLevel3(frameworkData);
            renderLevel4(frameworkData);
            console.log("Four-Level Framework: Rendering complete");
          } catch (err) {
            console.error("Error rendering Four-Level Framework:", err);
            console.error(err.stack);
            var navEl = document.getElementById("framework-level-nav");
            if (navEl) navEl.innerHTML = '<div class="p-4 text-center rounded-xl" style="background: var(--panel-strong); border: var(--border); color: var(--error);"><p>Error: ' + err.message + '</p></div>';
            var panels = ["level-1-panel", "level-2-panel", "level-3-panel", "level-4-panel"];
            panels.forEach(function(id) {
              var el = document.getElementById(id);
              if (el) el.innerHTML = '<div class="p-8 text-center" style="color: var(--error);"><p>Error loading content. Check console for details.</p></div>';
            });
          }
        })
        .catch(function (err) {
          console.error("Failed to load Four-Level Framework data:", err);
          console.error(err.stack);
          var navEl = document.getElementById("framework-level-nav");
          if (navEl) navEl.innerHTML = '<div class="p-4 text-center rounded-xl" style="background: var(--panel-strong); border: var(--border); color: var(--error);"><p>Failed to load data: ' + err.message + '</p></div>';
          var panels = ["level-1-panel", "level-2-panel", "level-3-panel", "level-4-panel"];
          panels.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="p-8 text-center" style="color: var(--error);"><p>Data loading failed: ' + err.message + '</p></div>';
          });
        });
    } catch (err) {
      console.error("Initialization error:", err);
      console.error(err.stack);
    }
  }

  // Ensure DOM is ready before initializing
  function startInit() {
    var navEl = document.getElementById("framework-level-nav");
    var panelEl = document.getElementById("level-1-panel");
    if (navEl && panelEl) {
      console.log("Four-Level Framework: DOM elements found, initializing...");
      init();
    } else {
      console.log("Four-Level Framework: Waiting for DOM elements...");
      setTimeout(startInit, 50);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function() {
      console.log("Four-Level Framework: DOMContentLoaded fired");
      startInit();
    });
  } else {
    console.log("Four-Level Framework: DOM already ready");
    startInit();
  }
})();

