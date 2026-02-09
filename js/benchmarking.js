/**
 * Benchmarking functionality
 * Compare country performance against peer groups
 */

(function() {
  'use strict';

  /**
   * Get peer countries by region
   */
  function getPeersByRegion(country, data) {
    if (!country || !data || !country.region) return [];
    
    return data.globeData.filter(c => 
      c.region === country.region && 
      c.alpha3 !== country.alpha3
    );
  }

  /**
   * Get peer countries by income level
   */
  function getPeersByIncomeLevel(country, data) {
    // This would require income level data in the country object
    // For now, return empty array
    return [];
  }

  /**
   * Calculate average score for peer group
   */
  function calculatePeerAverage(peers, pillar) {
    if (!peers || peers.length === 0) return null;
    
    const scores = peers
      .map(c => {
        const pillarInfo = c.scores?.[pillar];
        return pillarInfo?.tier?.score || pillarInfo?.tier?.number || null;
      })
      .filter(s => s !== null);
    
    if (scores.length === 0) return null;
    
    const sum = scores.reduce((a, b) => a + b, 0);
    return sum / scores.length;
  }

  /**
   * Compare country to peers
   */
  function compareToPeers(country, data, pillar) {
    const peers = getPeersByRegion(country, data);
    const peerAverage = calculatePeerAverage(peers, pillar);
    const countryScore = country.scores?.[pillar]?.tier?.score || country.scores?.[pillar]?.tier?.number || null;
    
    if (countryScore === null || peerAverage === null) {
      return null;
    }
    
    const difference = countryScore - peerAverage;
    const percentile = calculatePercentile(countryScore, peers, pillar);
    
    return {
      countryScore: countryScore,
      peerAverage: peerAverage,
      difference: difference,
      percentile: percentile,
      comparison: difference > 0 ? 'above' : difference < 0 ? 'below' : 'equal'
    };
  }

  /**
   * Calculate percentile rank
   */
  function calculatePercentile(countryScore, peers, pillar) {
    const scores = peers
      .map(c => {
        const pillarInfo = c.scores?.[pillar];
        return pillarInfo?.tier?.score || pillarInfo?.tier?.number || null;
      })
      .filter(s => s !== null)
      .sort((a, b) => a - b);
    
    if (scores.length === 0) return null;
    
    const below = scores.filter(s => s < countryScore).length;
    return Math.round((below / scores.length) * 100);
  }

  /**
   * Render benchmarking comparison
   */
  function renderBenchmarking(country, data, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !country || !data) return;

    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames.filter(p => p !== 'Overall');
    const peers = getPeersByRegion(country, data);
    
    if (peers.length === 0) {
      container.innerHTML = '<p class="text-gray-500">No peer countries available for comparison</p>';
      return;
    }

    let html = `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-bold mb-2">Benchmarking</h3>
          <p class="text-sm text-gray-600 mb-4">Comparison with ${peers.length} peer countries in ${country.region || 'same region'}</p>
        </div>
        
        <div class="space-y-4">
    `;

    pillars.forEach(pillar => {
      const comparison = compareToPeers(country, data, pillar);
      if (!comparison) return;

      const color = comparison.comparison === 'above' ? '#10b981' : comparison.comparison === 'below' ? '#ef4444' : '#6b7280';
      const icon = comparison.comparison === 'above' ? '↑' : comparison.comparison === 'below' ? '↓' : '=';

      html += `
        <div class="border rounded-lg p-4 theme-border theme-card">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-semibold">${pillar}</h4>
            <span class="text-sm font-medium" style="color: ${color}">
              ${icon} ${Math.abs(comparison.difference).toFixed(2)} vs peers
            </span>
          </div>
          <div class="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p class="text-gray-500">Country Score</p>
              <p class="font-semibold">${comparison.countryScore.toFixed(2)}</p>
            </div>
            <div>
              <p class="text-gray-500">Peer Average</p>
              <p class="font-semibold">${comparison.peerAverage.toFixed(2)}</p>
            </div>
            <div>
              <p class="text-gray-500">Percentile</p>
              <p class="font-semibold">${comparison.percentile}th</p>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;

    container.innerHTML = html;
  }

  // Export functions
  window.Benchmarking = {
    getPeersByRegion: getPeersByRegion,
    getPeersByIncomeLevel: getPeersByIncomeLevel,
    compareToPeers: compareToPeers,
    render: renderBenchmarking
  };
})();

