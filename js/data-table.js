/**
 * Enhanced Data Table Component
 * Provides sortable, filterable table with heatmap visualization
 */

(function() {
  'use strict';

  let allData = [];
  let filteredData = [];
  let sortColumn = null;
  let sortDirection = 'asc';
  let pillarColorMap = {};
  let pillarNames = [];

  /**
   * Initialize data table
   */
  function initDataTable(data, schema) {
    allData = data.globeData || [];
    filteredData = [...allData];
    pillarColorMap = schema?.pillarColorMap || {};
    pillarNames = schema?.pillarNames || [];
    
    renderTable();
  }

  /**
   * Get heatmap color for a score value
   */
  function getHeatmapColor(pillar, score) {
    if (!pillarColorMap[pillar] || score === null || score === undefined) {
      return 'transparent';
    }
    
    const colorTriple = pillarColorMap[pillar].triple || ['#FFFFFF', pillarColorMap[pillar].base, pillarColorMap[pillar].base];
    const normalizedScore = Math.max(0, Math.min(4, score || 0));
    const ratio = normalizedScore / 4;
    
    // Interpolate between colors based on score
    if (ratio <= 0.5) {
      // Between first and second color
      const t = ratio * 2;
      return interpolateColor(colorTriple[0], colorTriple[1], t);
    } else {
      // Between second and third color
      const t = (ratio - 0.5) * 2;
      return interpolateColor(colorTriple[1], colorTriple[2], t);
    }
  }

  /**
   * Interpolate between two hex colors
   */
  function interpolateColor(color1, color2, t) {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    
    const r = Math.round(c1.r + (c2.r - c1.r) * t);
    const g = Math.round(c1.g + (c2.g - c1.g) * t);
    const b = Math.round(c1.b + (c2.b - c1.b) * t);
    
    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * Convert hex to RGB
   */
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  }

  /**
   * Get score value for a country and pillar
   */
  function getScore(country, pillar) {
    if (pillar === 'Overall') {
      return country.scores?.Overall?.score || country.scores?.Overall?.tier?.score || null;
    }
    return country.scores?.[pillar]?.tier?.score || country.scores?.[pillar]?.score || null;
  }

  /**
   * Get tier name for a country and pillar
   */
  function getTierName(country, pillar) {
    if (pillar === 'Overall') {
      return country.scores?.Overall?.tier?.name || '-';
    }
    return country.scores?.[pillar]?.tier?.name || '-';
  }

  /**
   * Sort data
   */
  function sortData(column) {
    if (sortColumn === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      sortColumn = column;
      sortDirection = 'asc';
    }

    filteredData.sort((a, b) => {
      let aVal, bVal;

      if (column === 'name') {
        aVal = a.name || '';
        bVal = b.name || '';
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (column === 'region') {
        aVal = a.region || '';
        bVal = b.region || '';
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (column === 'subregion') {
        aVal = a.subregion || '';
        bVal = b.subregion || '';
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else if (column === 'Overall') {
        aVal = getScore(a, 'Overall');
        bVal = getScore(b, 'Overall');
      } else {
        // Pillar score
        aVal = getScore(a, column);
        bVal = getScore(b, column);
      }

      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortDirection === 'asc' ? 1 : -1;
      if (bVal === null) return sortDirection === 'asc' ? -1 : 1;

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    renderTable();
  }

  /**
   * Update filtered data
   */
  function updateFilteredData(newData) {
    filteredData = newData;
    sortColumn = null;
    sortDirection = 'asc';
    renderTable();
  }

  /**
   * Render table
   */
  function renderTable() {
    const container = document.getElementById('data-table-container');
    if (!container) return;

    const table = document.createElement('table');
    table.className = 'data-table-enhanced w-full text-sm';
    table.setAttribute('role', 'table');

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const columns = [
      { key: 'name', label: 'Country', width: 200, frozen: true },
      { key: 'region', label: 'Region', width: 120 },
      { key: 'subregion', label: 'Sub-region', width: 150 },
      { key: 'incomeLevel', label: 'Income', width: 120 },
      { key: 'Overall', label: 'Overall', width: 100 },
      ...pillarNames.map(p => ({ key: p, label: p, width: 120 }))
    ];

    columns.forEach(col => {
      const th = document.createElement('th');
      th.className = 'data-table-header p-3 text-left font-semibold cursor-pointer select-none';
      th.style.width = col.width + 'px';
      th.style.minWidth = col.width + 'px';
      th.setAttribute('data-column', col.key);
      
      const headerContent = document.createElement('div');
      headerContent.className = 'flex items-center gap-2';
      headerContent.innerHTML = `
        <span>${col.label}</span>
        ${sortColumn === col.key ? 
          `<span class="sort-indicator">${sortDirection === 'asc' ? '↑' : '↓'}</span>` : 
          '<span class="sort-indicator opacity-0">↕</span>'
        }
      `;
      
      th.appendChild(headerContent);
      th.addEventListener('click', () => sortData(col.key));
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    
    if (filteredData.length === 0) {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.className = 'p-8 text-center';
      cell.colSpan = columns.length;
      cell.textContent = 'No countries match your filters.';
      cell.style.color = 'var(--muted)';
      row.appendChild(cell);
      tbody.appendChild(row);
    } else {
      filteredData.forEach(country => {
        const row = document.createElement('tr');
        row.className = 'data-table-row hover:bg-opacity-50';
        
        columns.forEach(col => {
          const cell = document.createElement('td');
          cell.className = 'data-table-cell p-3 border-t';
          cell.style.borderColor = 'var(--border)';
          
          if (col.key === 'name') {
            cell.innerHTML = `<a href="country.html?code=${country.alpha3}#${country.alpha3}" class="text-accent hover:underline" style="color: var(--brand);">${country.name || '-'}</a>`;
          } else if (col.key === 'region') {
            cell.textContent = country.region || '-';
            cell.style.color = 'var(--text)';
          } else if (col.key === 'subregion') {
            cell.textContent = country.subregion || '-';
            cell.style.color = 'var(--text)';
          } else if (col.key === 'incomeLevel') {
            let incomeText = country.incomeLevel || '-';
            const flags = [];
            if (country.ldc) flags.push('LDC');
            if (country.lldc) flags.push('LLDC');
            if (country.sids) flags.push('SIDS');
            if (flags.length > 0) {
              incomeText += ` (${flags.join(', ')})`;
            }
            cell.textContent = incomeText;
            cell.style.color = 'var(--text)';
          } else {
            // Score column (Overall or pillar)
            const score = getScore(country, col.key);
            const tierName = getTierName(country, col.key);
            
            // Get data availability for this pillar
            let dataAvail = null;
            if (country.scores && country.scores[col.key]) {
              if (country.scores[col.key].tier && country.scores[col.key].tier.dataAvailability !== undefined) {
                dataAvail = country.scores[col.key].tier.dataAvailability;
              }
            }
            
            if (score !== null && score !== undefined && !isNaN(score)) {
              const heatmapColor = getHeatmapColor(col.key, score);
              cell.innerHTML = `
                <div class="score-cell flex flex-col gap-1" style="background-color: ${heatmapColor}; padding: 4px 8px; border-radius: 4px;">
                  <div class="flex items-center justify-between gap-2">
                    <span class="score-value font-medium" style="color: ${getTextColorForBackground(heatmapColor)};">${parseFloat(score).toFixed(2)}</span>
                    <span class="tier-badge text-xs opacity-75" style="color: ${getTextColorForBackground(heatmapColor)};">${tierName}</span>
                  </div>
                  ${dataAvail !== null ? `<div class="text-xs opacity-60" style="color: ${getTextColorForBackground(heatmapColor)};">${dataAvail.toFixed(0)}% data</div>` : ''}
                </div>
              `;
            } else {
              cell.innerHTML = `<div class="text-sm" style="color: var(--muted);">-${dataAvail !== null ? `<br><span class="text-xs">${dataAvail.toFixed(0)}% data</span>` : ''}</div>`;
            }
          }
          
          row.appendChild(cell);
        });
        
        tbody.appendChild(row);
      });
    }

    table.appendChild(tbody);
    
    // Replace existing table
    container.innerHTML = '';
    container.appendChild(table);
  }

  /**
   * Get appropriate text color for background
   */
  function getTextColorForBackground(bgColor) {
    if (!bgColor || bgColor === 'transparent') {
      return 'var(--text)';
    }
    
    const rgb = bgColor.match(/\d+/g);
    if (!rgb || rgb.length < 3) {
      return 'var(--text)';
    }
    
    // Calculate luminance
    const r = parseInt(rgb[0]);
    const g = parseInt(rgb[1]);
    const b = parseInt(rgb[2]);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  // Export functions
  window.DataTable = {
    init: initDataTable,
    updateFilteredData: updateFilteredData,
    getScore: getScore,
    getTierName: getTierName
  };
})();

