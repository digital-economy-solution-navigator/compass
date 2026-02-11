/**
 * Visualization Components
 * Radar charts and bar charts for pillar comparison
 */

(function() {
  'use strict';

  /**
   * Render radar chart for pillar comparison
   */
  function renderRadarChart(country, data, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !country || !data) return;

    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames || [];
    const scores = country.scores || {};
    
    // Filter out Overall pillar
    const displayPillars = pillars.filter(p => p !== 'Overall');
    
    if (displayPillars.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No pillar data available</p>';
      return;
    }

    const size = options.size || 400;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = Math.min(size / 2 - 40, 150);
    
    // Get scores for each pillar
    const pillarScores = displayPillars.map(pillar => {
      const pillarInfo = scores[pillar];
      const tier = pillarInfo?.tier;
      const score = tier?.score || tier?.number || 0;
      return {
        pillar: pillar,
        score: Math.min(4, Math.max(0, score)), // Normalize to 0-4
        color: ancillary.pillarColorMap[pillar]?.base || '#6366f1'
      };
    });

    // Calculate angles
    const angleStep = (2 * Math.PI) / displayPillars.length;
    
    // Create SVG
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    
    // Draw grid circles (for 4 tiers)
    for (let i = 1; i <= 4; i++) {
      const r = (radius / 4) * i;
      svg += `<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="1" opacity="0.5" />`;
    }
    
    // Draw axis lines
    displayPillars.forEach((pillar, idx) => {
      const angle = -Math.PI / 2 + angleStep * idx;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      svg += `<line x1="${centerX}" y1="${centerY}" x2="${x}" y2="${y}" stroke="#e5e7eb" stroke-width="1" />`;
      
      // Label
      const labelX = centerX + (radius + 20) * Math.cos(angle);
      const labelY = centerY + (radius + 20) * Math.sin(angle);
      svg += `<text x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="middle" class="text-xs font-medium" fill="var(--text)">${pillar}</text>`;
    });
    
    // Draw data polygon
    const points = pillarScores.map((item, idx) => {
      const angle = -Math.PI / 2 + angleStep * idx;
      const r = (radius / 4) * item.score;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    
    svg += `<polygon points="${points}" fill="rgba(0, 163, 224, 0.2)" stroke="#00A3E0" stroke-width="2" />`;
    
    // Draw data points
    pillarScores.forEach((item, idx) => {
      const angle = -Math.PI / 2 + angleStep * idx;
      const r = (radius / 4) * item.score;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      svg += `<circle cx="${x}" cy="${y}" r="4" fill="${item.color}" stroke="white" stroke-width="2" />`;
    });
    
    svg += '</svg>';
    
    container.innerHTML = svg;
  }

  /**
   * Render bar chart for pillar comparison
   */
  function renderBarChart(country, data, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !country || !data) return;

    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames || [];
    const scores = country.scores || {};
    
    // Filter out Overall pillar
    const displayPillars = pillars.filter(p => p !== 'Overall');
    
    if (displayPillars.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No pillar data available</p>';
      return;
    }

    const width = options.width || 600;
    const height = options.height || 400;
    const barHeight = 30;
    const spacing = 10;
    const maxScore = 4;
    const chartHeight = displayPillars.length * (barHeight + spacing);

    let svg = `<svg width="${width}" height="${Math.max(chartHeight, height)}" viewBox="0 0 ${width} ${chartHeight}">`;
    
    displayPillars.forEach((pillar, idx) => {
      const pillarInfo = scores[pillar];
      const tier = pillarInfo?.tier;
      const score = tier?.score || tier?.number || 0;
      const normalizedScore = Math.min(maxScore, Math.max(0, score));
      const barWidth = (normalizedScore / maxScore) * (width - 200);
      const y = idx * (barHeight + spacing);
      const color = ancillary.pillarColorMap[pillar]?.base || '#6366f1';
      
      // Bar background
      svg += `<rect x="0" y="${y}" width="${width - 200}" height="${barHeight}" fill="#e5e7eb" opacity="0.3" rx="4" />`;
      
      // Bar fill
      svg += `<rect x="0" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" />`;
      
      // Pillar label
      svg += `<text x="10" y="${y + barHeight / 2}" dominant-baseline="middle" class="text-sm font-medium" fill="var(--text)">${pillar}</text>`;
      
      // Score label
      svg += `<text x="${barWidth + 10}" y="${y + barHeight / 2}" dominant-baseline="middle" class="text-sm font-semibold" fill="var(--text)">${score.toFixed(2)}</text>`;
      
      // Tier label
      if (tier) {
        svg += `<text x="${width - 100}" y="${y + barHeight / 2}" dominant-baseline="middle" class="text-xs" fill="var(--muted)">${tier.name}</text>`;
      }
    });
    
    svg += '</svg>';
    
    container.innerHTML = svg;
  }

  /**
   * Render comparison chart (multiple countries)
   */
  function renderComparisonChart(countries, data, containerId, pillar, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !countries || !data || !pillar) return;

    const width = options.width || 600;
    const height = options.height || 400;
    const barWidth = 40;
    const spacing = 20;
    const maxScore = 4;
    const chartWidth = countries.length * (barWidth + spacing);

    let svg = `<svg width="${Math.max(chartWidth, width)}" height="${height}" viewBox="0 0 ${chartWidth} ${height}">`;
    
    countries.forEach((country, idx) => {
      const pillarInfo = country.scores?.[pillar];
      const tier = pillarInfo?.tier;
      const score = tier?.score || tier?.number || 0;
      const normalizedScore = Math.min(maxScore, Math.max(0, score));
      const barHeight = (normalizedScore / maxScore) * (height - 60);
      const x = idx * (barWidth + spacing);
      const y = height - barHeight - 30;
      const color = data.ancillary.pillarColorMap[pillar]?.base || '#6366f1';
      
      // Bar
      svg += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="${color}" rx="4" />`;
      
      // Country label
      svg += `<text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" class="text-xs" fill="var(--text)">${country.name.substring(0, 8)}</text>`;
      
      // Score label
      svg += `<text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" class="text-xs font-semibold" fill="var(--text)">${score.toFixed(1)}</text>`;
    });
    
    svg += '</svg>';
    
    container.innerHTML = svg;
  }

  // Export functions
  window.Visualizations = {
    renderRadarChart: renderRadarChart,
    renderBarChart: renderBarChart,
    renderComparisonChart: renderComparisonChart
  };
})();


