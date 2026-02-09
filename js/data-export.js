/**
 * Data Export Functionality
 * Download raw data and reports
 */

(function() {
  'use strict';

  /**
   * Export country data as JSON
   */
  function exportCountryJSON(country, data) {
    if (!country || !data) return;
    
    const exportData = {
      country: {
        name: country.name,
        alpha2: country.alpha2,
        alpha3: country.alpha3,
        region: country.region,
        subregion: country.subregion
      },
      scores: country.scores,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${country.name.replace(/\s+/g, '_')}_AIDIN_Data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export country data as CSV
   */
  function exportCountryCSV(country, data) {
    if (!country || !data) return;
    
    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames || [];
    const rows = [];
    
    // Header
    rows.push(['Pillar', 'Dimension', 'Tier', 'Score', 'Description']);
    
    // Overall
    if (country.scores.Overall) {
      const overall = country.scores.Overall;
      rows.push(['Overall', '', overall.tier?.name || '', overall.score || '', overall.tier?.description || '']);
    }
    
    // Pillars
    pillars.forEach(pillar => {
      if (pillar === 'Overall') return;
      
      const pillarInfo = country.scores[pillar];
      if (pillarInfo) {
        if (pillarInfo.tier) {
          rows.push([pillar, '', pillarInfo.tier.name || '', pillarInfo.tier.score || '', pillarInfo.tier.description || '']);
        }
        
        const dimensions = ancillary.pillars[pillar] || [];
        dimensions.forEach(dim => {
          const dimInfo = pillarInfo[dim];
          if (dimInfo && dimInfo.tier) {
            rows.push([pillar, dim, dimInfo.tier.name || '', dimInfo.tier.score || '', dimInfo.tier.description || '']);
          }
        });
      }
    });
    
    // Convert to CSV
    const csv = rows.map(row => 
      row.map(cell => {
        const str = String(cell || '');
        return str.includes(',') || str.includes('"') || str.includes('\n') 
          ? `"${str.replace(/"/g, '""')}"` 
          : str;
      }).join(',')
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${country.name.replace(/\s+/g, '_')}_AIDIN_Data.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Export transformation pathways as text
   */
  function exportPathways(serviceMenu) {
    if (!serviceMenu) return;
    
    let text = `Transformation Pathways Report\n`;
    text += `Country: ${serviceMenu.country}\n`;
    text += `Overall Tier: ${serviceMenu.overallTier}\n`;
    text += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    text += `PRIORITY RECOMMENDATIONS\n`;
    text += `========================\n\n`;
    
    serviceMenu.recommendations.forEach((rec, idx) => {
      text += `${idx + 1}. [${rec.priority} Priority] ${rec.area}\n`;
      text += `   ${rec.action}\n\n`;
    });
    
    text += `RECOMMENDED SOLUTIONS\n`;
    text += `====================\n\n`;
    
    serviceMenu.solutions.slice(0, 10).forEach((sol, idx) => {
      text += `${idx + 1}. ${sol.title || sol.name || 'Solution'}\n`;
      text += `   Relevance: ${Math.round(sol.relevance)}%\n`;
      if (sol.description) text += `   ${sol.description}\n`;
      if (sol.category) text += `   Category: ${sol.category}\n`;
      if (sol.url) text += `   Link: ${sol.url}\n`;
      text += `\n`;
    });
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${serviceMenu.country.replace(/\s+/g, '_')}_Pathways.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export functions
  window.DataExport = {
    exportCountryJSON: exportCountryJSON,
    exportCountryCSV: exportCountryCSV,
    exportPathways: exportPathways
  };
})();

