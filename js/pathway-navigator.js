/**
 * Transformation Pathway Navigator
 * Analyzes country gaps and links to solutions
 */

(function() {
  'use strict';

  const GAP_THRESHOLD = 2.0; // Tier score below which is considered a gap

  /**
   * Analyze gaps in country scores
   */
  function analyzeGaps(country, data) {
    if (!country || !country.scores || !data) return [];
    
    const gaps = [];
    const ancillary = data.ancillary;
    const pillars = ancillary.pillarNames || [];
    
    pillars.forEach(pillar => {
      if (pillar === 'Overall') return;
      
      const pillarInfo = country.scores[pillar];
      if (!pillarInfo || !pillarInfo.tier) return;
      
      const tierScore = pillarInfo.tier.score || pillarInfo.tier.number;
      if (tierScore < GAP_THRESHOLD) {
        gaps.push({
          pillar: pillar,
          tier: pillarInfo.tier,
          score: tierScore,
          dimensions: getDimensionGaps(pillarInfo, pillar, ancillary)
        });
      }
    });
    
    return gaps.sort((a, b) => a.score - b.score); // Sort by worst gaps first
  }

  /**
   * Get gaps at dimension level
   */
  function getDimensionGaps(pillarInfo, pillar, ancillary) {
    const dimensions = ancillary.pillars[pillar] || [];
    const gaps = [];
    
    dimensions.forEach(dim => {
      const dimInfo = pillarInfo[dim];
      if (dimInfo && dimInfo.tier) {
        const dimScore = dimInfo.tier.score || dimInfo.tier.number;
        if (dimScore < GAP_THRESHOLD) {
          gaps.push({
            dimension: dim,
            tier: dimInfo.tier,
            score: dimScore
          });
        }
      }
    });
    
    return gaps;
  }

  /**
   * Link gaps to solutions
   */
  function linkSolutions(gaps, solutionsMapping) {
    if (!solutionsMapping) return [];
    
    const linkedSolutions = [];
    
    gaps.forEach(gap => {
      const pillarSolutions = solutionsMapping[gap.pillar] || [];
      const solutions = pillarSolutions.map(sol => ({
        ...sol,
        relevance: calculateRelevance(sol, gap),
        gap: gap
      }));
      
      linkedSolutions.push(...solutions);
    });
    
    // Sort by relevance
    return linkedSolutions.sort((a, b) => b.relevance - a.relevance);
  }

  /**
   * Calculate solution relevance score
   */
  function calculateRelevance(solution, gap) {
    let score = 50; // Base relevance
    
    // Increase if solution targets this pillar
    if (solution.pillars && solution.pillars.includes(gap.pillar)) {
      score += 30;
    }
    
    // Increase if solution targets this tier
    if (solution.tiers && solution.tiers.includes(gap.tier.name)) {
      score += 20;
    }
    
    // Increase if solution targets specific dimensions
    if (solution.dimensions && gap.dimensions) {
      const matchingDims = gap.dimensions.filter(d => 
        solution.dimensions.includes(d.dimension)
      );
      score += matchingDims.length * 10;
    }
    
    return Math.min(100, score);
  }

  /**
   * Generate bespoke service menu
   */
  function generateServiceMenu(country, gaps, solutionsMapping) {
    const overallTier = country.scores?.Overall?.tier?.name || 'Foundational';
    const linkedSolutions = linkSolutions(gaps, solutionsMapping);
    
    // Group solutions by category
    const categories = {
      'Upskilling Programs': [],
      'Center of Excellence Setups': [],
      'Policy Frameworks': [],
      'Infrastructure Development': [],
      'Other': []
    };
    
    linkedSolutions.forEach(sol => {
      const category = sol.category || 'Other';
      if (categories[category]) {
        categories[category].push(sol);
      } else {
        categories['Other'].push(sol);
      }
    });
    
    return {
      country: country.name,
      overallTier: overallTier,
      gaps: gaps,
      solutions: linkedSolutions,
      categories: categories,
      recommendations: generateRecommendations(gaps, overallTier)
    };
  }

  /**
   * Generate recommendations based on gaps and tier
   */
  function generateRecommendations(gaps, overallTier) {
    const recommendations = [];
    
    if (overallTier === 'Foundational') {
      recommendations.push({
        priority: 'High',
        area: 'Infrastructure',
        action: 'Focus on building foundational infrastructure and connectivity'
      });
    }
    
    gaps.slice(0, 3).forEach((gap, idx) => {
      recommendations.push({
        priority: idx === 0 ? 'High' : idx === 1 ? 'Medium' : 'Low',
        area: gap.pillar,
        action: `Address ${gap.pillar} gap (currently ${gap.tier.name} tier)`
      });
    });
    
    return recommendations;
  }

  /**
   * Render pathway navigator UI
   */
  function renderPathwayNavigator(country, data, solutionsMapping, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !country || !data) return;
    
    const gaps = analyzeGaps(country, data);
    const serviceMenu = generateServiceMenu(country, gaps, solutionsMapping);
    
    if (gaps.length === 0) {
      container.innerHTML = `
        <div class="p-6 border rounded-lg theme-border theme-card">
          <h3 class="text-xl font-bold mb-2">Transformation Pathways</h3>
          <p class="text-gray-600">No significant gaps identified. Country is performing well across all pillars.</p>
        </div>
      `;
      return;
    }
    
    let html = `
      <div class="space-y-6">
        <div>
          <h3 class="text-xl font-bold mb-2">Transformation Pathways</h3>
          <p class="text-sm text-gray-600 mb-4">Identified ${gaps.length} area${gaps.length !== 1 ? 's' : ''} requiring attention</p>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-semibold text-lg">Priority Recommendations</h4>
          <div class="space-y-3">
    `;
    
    serviceMenu.recommendations.forEach(rec => {
      const priorityColor = rec.priority === 'High' ? '#ef4444' : rec.priority === 'Medium' ? '#f59e0b' : '#10b981';
      html += `
        <div class="border-l-4 p-4 rounded theme-border theme-card" style="border-left-color: ${priorityColor}">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-semibold uppercase px-2 py-1 rounded" style="background-color: ${priorityColor}20; color: ${priorityColor}">${rec.priority} Priority</span>
            <span class="text-sm font-medium">${rec.area}</span>
          </div>
          <p class="text-sm text-gray-600">${rec.action}</p>
        </div>
      `;
    });
    
    html += `
          </div>
        </div>
        
        <div class="space-y-4">
          <h4 class="font-semibold text-lg">Recommended Solutions</h4>
          <div id="pathway-solutions-list" class="space-y-3"></div>
        </div>
      </div>
    `;
    
    container.innerHTML = html;
    
    // Render solutions
    const solutionsList = document.getElementById('pathway-solutions-list');
    if (solutionsList && serviceMenu.solutions.length > 0) {
      serviceMenu.solutions.slice(0, 10).forEach(sol => {
        const solDiv = document.createElement('div');
        solDiv.className = 'border rounded-lg p-4 theme-border theme-card';
        solDiv.innerHTML = `
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-semibold">${sol.title || sol.name || 'Solution'}</h5>
            <span class="text-xs px-2 py-1 rounded" style="background-color: rgba(0, 163, 224, 0.1); color: #00A3E0;">
              ${Math.round(sol.relevance)}% match
            </span>
          </div>
          ${sol.description ? `<p class="text-sm text-gray-600 mb-2">${sol.description}</p>` : ''}
          <div class="flex items-center gap-2 mt-3">
            ${sol.category ? `<span class="text-xs px-2 py-1 rounded theme-border">${sol.category}</span>` : ''}
            ${sol.pillars ? `<span class="text-xs text-gray-500">Pillars: ${sol.pillars.join(', ')}</span>` : ''}
          </div>
          ${sol.url ? `
            <a href="${sol.url}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:underline mt-2 inline-block">
              Learn more →
            </a>
          ` : ''}
        `;
        solutionsList.appendChild(solDiv);
      });
    } else if (solutionsList) {
      solutionsList.innerHTML = '<p class="text-sm text-gray-500">No solutions mapped yet. Check back soon.</p>';
    }
  }

  // Export functions
  window.PathwayNavigator = {
    analyzeGaps: analyzeGaps,
    linkSolutions: linkSolutions,
    generateServiceMenu: generateServiceMenu,
    render: renderPathwayNavigator
  };
})();


