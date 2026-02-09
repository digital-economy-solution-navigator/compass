/**
 * Indicators Display Component
 * Displays indicator-level data, sources, and data availability on country pages
 */

(function() {
  'use strict';

  /**
   * Render indicators section
   */
  function renderIndicators(country, schema) {
    const container = document.getElementById('indicators-container');
    if (!container || !country || !country.indicators || country.indicators.length === 0) {
      if (container) {
        container.innerHTML = '<p class="text-sm" style="color: var(--muted);">No indicator-level data available for this country.</p>';
      }
      return;
    }

    // Group indicators by pillar and dimension
    const indicatorsByPillar = {};
    country.indicators.forEach(ind => {
      const pillar = ind.pillar || 'Other';
      const dimension = ind.dimension || pillar;
      
      if (!indicatorsByPillar[pillar]) {
        indicatorsByPillar[pillar] = {};
      }
      if (!indicatorsByPillar[pillar][dimension]) {
        indicatorsByPillar[pillar][dimension] = [];
      }
      indicatorsByPillar[pillar][dimension].push(ind);
    });

    let html = '<div class="mb-8"><h2 class="text-3xl font-bold mb-2" style="color: var(--text);">Indicators</h2>';
    if (country.dataAvailability !== null && country.dataAvailability !== undefined) {
      const availabilityPercent = country.dataAvailability.toFixed(1);
      const availabilityColor = country.dataAvailability >= 80 ? 'var(--success)' : country.dataAvailability >= 50 ? 'var(--brand)' : 'var(--muted)';
      html += `<p class="text-sm mb-6" style="color: var(--muted);">Data Availability: <span class="font-semibold px-2 py-1 rounded-full" style="background: ${availabilityColor}20; color: ${availabilityColor};">${availabilityPercent}%</span> <span class="ml-2" style="color: var(--muted);">(${country.indicators.filter(i => i.score !== null).length} of ${country.indicators.length} indicators have data)</span></p>`;
    }
    html += '</div>';

      // Render by pillar
      Object.keys(indicatorsByPillar).sort().forEach(pillar => {
        const pillarColor = schema?.pillarColorMap?.[pillar]?.base || '#6366f1';
        html += `
          <div class="mb-8 border rounded-2xl p-6 theme-border transition-all duration-300 hover:shadow-lg" style="background: var(--card-bg); box-shadow: var(--shadow); border-left: 4px solid ${pillarColor};">
            <h3 class="text-xl font-semibold mb-6 flex items-center gap-3" style="color: var(--text);">
              <span class="w-4 h-4 rounded-full shadow-sm" style="background-color: ${pillarColor};"></span>
              ${pillar}
            </h3>
      `;

      Object.keys(indicatorsByPillar[pillar]).sort().forEach(dimension => {
        const indicators = indicatorsByPillar[pillar][dimension];
        html += `
          <div class="mb-6">
            <h4 class="text-lg font-medium mb-3" style="color: var(--text);">${dimension}</h4>
            <div class="space-y-3">
        `;

        indicators.forEach(ind => {
          const scoreDisplay = ind.score !== null && !isNaN(ind.score) 
            ? `<span class="font-semibold" style="color: var(--text);">${ind.score.toFixed(2)}</span>` 
            : '<span class="text-sm" style="color: var(--muted);">No data</span>';
          
          const sourceDisplay = ind.sourceName 
            ? `<span class="text-xs" style="color: var(--muted);">Source: ${ind.sourceName}${ind.year ? ' (' + ind.year + ')' : ''}</span>`
            : '';
          
          const sourceLink = ind.sourceURL 
            ? `<a href="${ind.sourceURL}" target="_blank" rel="noopener noreferrer" class="text-xs ml-2 hover:underline" style="color: var(--brand);">View source</a>`
            : '';

          html += `
            <div class="border rounded-xl p-4 mb-3 theme-border transition-all duration-200 hover:shadow-md" style="background-color: var(--panel); border-color: var(--border);">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-sm mb-2" style="color: var(--text);">${ind.indicator || 'Unknown Indicator'}</div>
                  ${sourceDisplay ? `<div class="mt-2 flex flex-wrap items-center gap-2">${sourceDisplay}${sourceLink}</div>` : ''}
                </div>
                <div class="flex-shrink-0 text-right">
                  ${scoreDisplay}
                </div>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += '</div>';
    });

    container.innerHTML = html;
  }

  /**
   * Render sources section
   */
  function renderSources(country, sourcesData) {
    const container = document.getElementById('sources-container');
    if (!container) return;

    if (!country || !country.sources || country.sources.length === 0) {
      container.innerHTML = '';
      return;
    }

    let html = '<div class="mb-8"><h2 class="text-3xl font-bold mb-2" style="color: var(--text);">Data Sources</h2>';
    html += `<p class="text-sm mb-6" style="color: var(--muted);">This country's data is sourced from <span class="font-semibold" style="color: var(--text);">${country.sources.length}</span> source${country.sources.length !== 1 ? 's' : ''}.</p>`;
    html += '</div><div class="grid md:grid-cols-2 gap-6">';

    country.sources.forEach(sourceName => {
      const sourceInfo = sourcesData?.sources?.[sourceName] || sourcesData?.defaultSource;
      if (sourceInfo) {
        html += `
          <div class="border rounded-2xl p-6 theme-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1" style="background: var(--card-bg); box-shadow: var(--shadow);">
            <h3 class="font-semibold mb-3 text-lg" style="color: var(--text);">${sourceInfo.name || sourceName}</h3>
            ${sourceInfo.description ? `<p class="text-sm mb-4 leading-relaxed" style="color: var(--muted);">${sourceInfo.description}</p>` : ''}
            <div class="flex flex-wrap items-center gap-3">
              ${sourceInfo.url ? `<a href="${sourceInfo.url}" target="_blank" rel="noopener noreferrer" class="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:shadow-md" style="background: var(--button-primary); color: white;">Visit Source</a>` : ''}
              ${sourceInfo.updateFrequency ? `<span class="text-xs px-3 py-1 rounded-full" style="background: var(--panel); color: var(--muted);">${sourceInfo.updateFrequency}</span>` : ''}
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="border rounded-2xl p-6 theme-border" style="background: var(--card-bg); box-shadow: var(--shadow);">
            <h3 class="font-semibold mb-2 text-lg" style="color: var(--text);">${sourceName}</h3>
            <p class="text-sm" style="color: var(--muted);">Source information not available</p>
          </div>
        `;
      }
    });

    html += '</div>';
    container.innerHTML = html;
  }

  /**
   * Update country metadata display with income, LDC/LLDC/SIDS flags
   */
  function updateCountryMetadata(country) {
    const regionEl = document.getElementById('country-region');
    if (!regionEl || !country) return;

    let metadataParts = [];
    
    if (country.region) {
      metadataParts.push(country.region);
    }
    if (country.subregion) {
      metadataParts.push(country.subregion);
    }
    if (country.incomeLevel) {
      metadataParts.push(country.incomeLevel);
    }
    
    const flags = [];
    if (country.ldc) flags.push('LDC');
    if (country.lldc) flags.push('LLDC');
    if (country.sids) flags.push('SIDS');
    if (flags.length > 0) {
      metadataParts.push(flags.join(', '));
    }

    regionEl.textContent = metadataParts.join(' | ') || 'Region information not available';
  }

  // Export functions
  window.IndicatorsDisplay = {
    renderIndicators: renderIndicators,
    renderSources: renderSources,
    updateCountryMetadata: updateCountryMetadata
  };
})();

