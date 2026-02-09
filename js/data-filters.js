/**
 * Data Filters Component
 * Provides filtering sidebar with country search, region/subregion dropdowns, and pillar score range sliders
 */

(function() {
  'use strict';

  let allData = [];
  let filters = {
    country: '',
    region: '*',
    subregion: '*',
    pillarRanges: {}
  };
  let onFilterChange = null;
  let pillarNames = [];
  let regions = [];
  let subregions = [];

  /**
   * Initialize filters
   */
  function initFilters(data, schema, onFilterCallback) {
    allData = data.globeData || [];
    pillarNames = schema?.pillarNames || [];
    onFilterChange = onFilterCallback;
    
    // Extract unique regions
    regions = [...new Set(allData.map(c => c.region).filter(Boolean))].sort();
    
    // Initialize subregions based on current region filter
    updateSubregions();
    
    // Initialize pillar ranges
    pillarNames.forEach(pillar => {
      filters.pillarRanges[pillar] = null; // null means no filter
    });
    
    renderFilters();
    applyFilters();
  }

  /**
   * Render filter UI
   */
  function renderFilters() {
    const container = document.getElementById('data-filters');
    if (!container) return;

    container.innerHTML = `
      <div class="data-filters-content space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-2 uppercase tracking-wider" style="color: var(--muted);">
            Country Name
          </label>
          <input 
            type="text" 
            id="filter-country" 
            class="w-full rounded-lg border px-3 py-2 text-sm theme-border theme-text" 
            style="background-color: var(--controls-bg);"
            placeholder="Search countries..."
            value="${filters.country}"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2 uppercase tracking-wider" style="color: var(--muted);">
            Region
          </label>
          <select 
            id="filter-region" 
            class="w-full rounded-lg border px-3 py-2 text-sm theme-border theme-text" 
            style="background-color: var(--controls-bg);"
          >
            <option value="*">All Regions</option>
            ${regions.map(r => `<option value="${r}" ${filters.region === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2 uppercase tracking-wider" style="color: var(--muted);">
            Sub-region
          </label>
          <select 
            id="filter-subregion" 
            class="w-full rounded-lg border px-3 py-2 text-sm theme-border theme-text" 
            style="background-color: var(--controls-bg);"
            ${filters.region === '*' ? 'disabled' : ''}
          >
            <option value="*">All Sub-regions</option>
            ${(filters.region === '*' ? [] : subregions).map(sr => `<option value="${sr}" ${filters.subregion === sr ? 'selected' : ''}>${sr}</option>`).join('')}
          </select>
        </div>

        <div class="border-t pt-4" style="border-color: var(--border);">
          <label class="block text-sm font-semibold mb-4 uppercase tracking-wider" style="color: var(--muted);">
            Pillar Score Ranges
          </label>
          <div class="space-y-4" id="pillar-range-filters"></div>
        </div>

        <div class="pt-4">
          <button 
            id="clear-filters" 
            class="w-full px-4 py-2 rounded-lg border text-sm font-medium theme-border theme-text hover:opacity-80"
            style="background-color: var(--controls-bg);"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    `;

    // Render pillar range filters
    renderPillarRanges();

    // Attach event listeners
    document.getElementById('filter-country')?.addEventListener('input', (e) => {
      filters.country = e.target.value.toLowerCase().trim();
      applyFilters();
    });

    document.getElementById('filter-region')?.addEventListener('change', (e) => {
      filters.region = e.target.value;
      if (filters.region === '*') {
        filters.subregion = '*';
      } else {
        // Reset subregion if it's not valid for the new region
        updateSubregions();
        if (!subregions.includes(filters.subregion)) {
          filters.subregion = '*';
        }
      }
      renderFilters();
      applyFilters();
    });

    document.getElementById('filter-subregion')?.addEventListener('change', (e) => {
      filters.subregion = e.target.value;
      applyFilters();
    });

    document.getElementById('clear-filters')?.addEventListener('click', () => {
      filters.country = '';
      filters.region = '*';
      filters.subregion = '*';
      pillarNames.forEach(pillar => {
        filters.pillarRanges[pillar] = null;
      });
      renderFilters();
      applyFilters();
    });
  }

  /**
   * Update subregions based on selected region
   */
  function updateSubregions() {
    if (filters.region === '*') {
      subregions = [];
    } else {
      subregions = [...new Set(
        allData
          .filter(c => c.region === filters.region)
          .map(c => c.subregion)
          .filter(Boolean)
      )].sort();
    }
  }

  /**
   * Render pillar range filters
   */
  function renderPillarRanges() {
    const container = document.getElementById('pillar-range-filters');
    if (!container) return;

    container.innerHTML = pillarNames.map(pillar => {
      const range = filters.pillarRanges[pillar];
      const min = range ? range[0] : 0;
      const max = range ? range[1] : 4;
      
      return `
        <div class="pillar-range-filter">
          <label class="block text-xs font-medium mb-2" style="color: var(--text);">${pillar}</label>
          <div class="flex items-center gap-2 mb-1">
            <input 
              type="number" 
              class="pillar-range-min w-16 rounded border px-2 py-1 text-xs theme-border theme-text" 
              style="background-color: var(--controls-bg);"
              min="0" 
              max="4" 
              step="0.1" 
              value="${min.toFixed(1)}"
              data-pillar="${pillar}"
              data-type="min"
            />
            <span class="text-xs" style="color: var(--muted);">to</span>
            <input 
              type="number" 
              class="pillar-range-max w-16 rounded border px-2 py-1 text-xs theme-border theme-text" 
              style="background-color: var(--controls-bg);"
              min="0" 
              max="4" 
              step="0.1" 
              value="${max.toFixed(1)}"
              data-pillar="${pillar}"
              data-type="max"
            />
            <button 
              class="pillar-range-clear text-xs px-2 py-1 rounded hover:opacity-80" 
              style="color: var(--muted);"
              data-pillar="${pillar}"
              title="Clear filter"
            >
              ✕
            </button>
          </div>
          <input 
            type="range" 
            class="pillar-range-slider w-full" 
            min="0" 
            max="4" 
            step="0.1" 
            value="${max}"
            data-pillar="${pillar}"
            data-type="slider"
          />
        </div>
      `;
    }).join('');

    // Attach event listeners for pillar ranges
    container.querySelectorAll('.pillar-range-min, .pillar-range-max').forEach(input => {
      input.addEventListener('input', (e) => {
        const pillar = e.target.getAttribute('data-pillar');
        const type = e.target.getAttribute('data-type');
        const value = parseFloat(e.target.value);
        
        if (!filters.pillarRanges[pillar]) {
          filters.pillarRanges[pillar] = [0, 4];
        }
        
        if (type === 'min') {
          filters.pillarRanges[pillar][0] = Math.max(0, Math.min(value, filters.pillarRanges[pillar][1]));
        } else {
          filters.pillarRanges[pillar][1] = Math.min(4, Math.max(value, filters.pillarRanges[pillar][0]));
        }
        
        updatePillarRangeInputs(pillar);
        applyFilters();
      });
    });

    container.querySelectorAll('.pillar-range-clear').forEach(button => {
      button.addEventListener('click', (e) => {
        const pillar = e.target.getAttribute('data-pillar');
        filters.pillarRanges[pillar] = null;
        renderPillarRanges();
        applyFilters();
      });
    });
  }

  /**
   * Update pillar range inputs
   */
  function updatePillarRangeInputs(pillar) {
    const range = filters.pillarRanges[pillar];
    if (!range) return;
    
    const minInput = document.querySelector(`.pillar-range-min[data-pillar="${pillar}"]`);
    const maxInput = document.querySelector(`.pillar-range-max[data-pillar="${pillar}"]`);
    
    if (minInput) minInput.value = range[0].toFixed(1);
    if (maxInput) maxInput.value = range[1].toFixed(1);
  }

  /**
   * Apply filters and update filtered data
   */
  function applyFilters() {
    let filtered = [...allData];

    // Country name filter
    if (filters.country) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(filters.country)
      );
    }

    // Region filter
    if (filters.region !== '*') {
      filtered = filtered.filter(c => c.region === filters.region);
    }

    // Sub-region filter
    if (filters.subregion !== '*') {
      filtered = filtered.filter(c => c.subregion === filters.subregion);
    }

    // Pillar score range filters
    pillarNames.forEach(pillar => {
      const range = filters.pillarRanges[pillar];
      if (range) {
        filtered = filtered.filter(c => {
          const score = window.DataTable?.getScore(c, pillar);
          return score !== null && score >= range[0] && score <= range[1];
        });
      }
    });

    // Update filter badges
    updateFilterBadges();

    // Callback with filtered data
    if (onFilterChange) {
      onFilterChange(filtered);
    }
  }

  /**
   * Update filter badges
   */
  function updateFilterBadges() {
    const container = document.getElementById('filter-badges');
    if (!container) return;

    const badges = [];
    
    if (filters.country) {
      badges.push({
        label: 'Country',
        value: filters.country,
        onClear: () => {
          filters.country = '';
          document.getElementById('filter-country').value = '';
          applyFilters();
        }
      });
    }

    if (filters.region !== '*') {
      badges.push({
        label: 'Region',
        value: filters.region,
        onClear: () => {
          filters.region = '*';
          filters.subregion = '*';
          document.getElementById('filter-region').value = '*';
          updateSubregions();
          applyFilters();
        }
      });
    }

    if (filters.subregion !== '*') {
      badges.push({
        label: 'Sub-region',
        value: filters.subregion,
        onClear: () => {
          filters.subregion = '*';
          document.getElementById('filter-subregion').value = '*';
          applyFilters();
        }
      });
    }

    pillarNames.forEach(pillar => {
      const range = filters.pillarRanges[pillar];
      if (range && (range[0] !== 0 || range[1] !== 4)) {
        badges.push({
          label: pillar,
          value: `${range[0].toFixed(1)}-${range[1].toFixed(1)}`,
          onClear: () => {
            filters.pillarRanges[pillar] = null;
            renderPillarRanges();
            applyFilters();
          }
        });
      }
    });

    if (badges.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="flex flex-wrap gap-2">
        ${badges.map(badge => `
          <span class="filter-badge inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" 
                style="background-color: var(--panel); color: var(--text); border: var(--border);">
            <span>${badge.label}: ${badge.value}</span>
            <button class="filter-badge-clear hover:opacity-80" data-label="${badge.label}" title="Remove filter">✕</button>
          </span>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('.filter-badge-clear').forEach(button => {
      button.addEventListener('click', () => {
        const label = button.getAttribute('data-label');
        const badge = badges.find(b => b.label === label);
        if (badge) badge.onClear();
      });
    });
  }

  // Export functions
  window.DataFilters = {
    init: initFilters,
    getFilters: () => filters
  };
})();

