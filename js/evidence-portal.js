/**
 * Evidence Submission Portal
 * Handles evidence form submission and validation
 */

(function() {
  'use strict';

  let countriesData = null;

  /**
   * Initialize evidence page
   */
  async function initEvidencePage() {
    // Load data and render header/footer
    try {
      const response = await fetch('data/demo.json');
      const data = await response.json();
      countriesData = data;
      
      // Set global data variable for search functionality
      if (window.setData && typeof window.setData === 'function') {
        window.setData(data);
      }
      
      // Render header and footer using shared functions
      if (window.renderHeader && data.countries) {
        window.renderHeader(data.countries, false);
      }
      if (window.renderFooter) {
        window.renderFooter();
      }
      
      // Populate country dropdown
      const countrySelect = document.getElementById('country');
      if (countrySelect && data.countries) {
        data.countries.forEach(country => {
          const option = document.createElement('option');
          option.value = country.alpha3;
          option.textContent = country.name;
          countrySelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error initializing evidence page:', error);
      // Still render header/footer even if data fails
      if (window.renderHeader) window.renderHeader([], false);
      if (window.renderFooter) window.renderFooter();
    }
    
    setupFormHandlers();
  }


  /**
   * Setup form handlers
   */
  function setupFormHandlers() {
    const form = document.getElementById('evidence-form');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      await handleSubmission(form);
    });

    // File size validation
    const fileInput = document.getElementById('document');
    if (fileInput) {
      fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file && file.size > 10 * 1024 * 1024) {
          alert('File size exceeds 10MB limit. Please choose a smaller file.');
          e.target.value = '';
        }
      });
    }
  }

  /**
   * Handle form submission
   */
  async function handleSubmission(form) {
    const statusDiv = document.getElementById('submission-status');
    if (!statusDiv) return;

    // Validate form
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Collect form data
    const formData = new FormData(form);
    const evidenceData = {
      country: formData.get('country'),
      evidenceType: formData.get('evidenceType'),
      pillars: Array.from(form.querySelectorAll('#pillar option:checked')).map(opt => opt.value),
      title: formData.get('title'),
      description: formData.get('description'),
      url: formData.get('url'),
      submitterName: formData.get('submitterName'),
      submitterEmail: formData.get('submitterEmail'),
      submitterOrganization: formData.get('submitterOrganization'),
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    // Handle file upload if present
    const fileInput = document.getElementById('document');
    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      // In a real implementation, this would be uploaded to a server
      // For now, we'll store metadata only
      evidenceData.fileName = file.name;
      evidenceData.fileSize = file.size;
      evidenceData.fileType = file.type;
    }

    try {
      // In production, this would POST to a backend API
      // For now, store in localStorage as a demo
      const submissions = JSON.parse(localStorage.getItem('evidenceSubmissions') || '[]');
      submissions.push(evidenceData);
      localStorage.setItem('evidenceSubmissions', JSON.stringify(submissions));

      // Show success message
      statusDiv.className = 'border rounded-lg p-4 bg-green-50 border-green-200';
      statusDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <div>
            <p class="font-semibold text-green-800">Submission Successful</p>
            <p class="text-sm text-green-700">Your evidence has been submitted and will be reviewed. You will receive a confirmation email shortly.</p>
          </div>
        </div>
      `;
      statusDiv.classList.remove('hidden');

      // Reset form
      form.reset();

      // Scroll to status
      statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (error) {
      console.error('Submission error:', error);
      statusDiv.className = 'border rounded-lg p-4 bg-red-50 border-red-200';
      statusDiv.innerHTML = `
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <p class="font-semibold text-red-800">Submission Failed</p>
            <p class="text-sm text-red-700">There was an error submitting your evidence. Please try again.</p>
          </div>
        </div>
      `;
      statusDiv.classList.remove('hidden');
    }
  }

  /**
   * Get submissions (for admin/review purposes)
   */
  function getSubmissions() {
    return JSON.parse(localStorage.getItem('evidenceSubmissions') || '[]');
  }

  /**
   * Get submissions for a specific country
   */
  function getSubmissionsForCountry(countryCode) {
    const submissions = getSubmissions();
    return submissions.filter(s => s.country === countryCode);
  }

  // Export functions
  window.initEvidencePage = initEvidencePage;
  window.EvidencePortal = {
    getSubmissions: getSubmissions,
    getSubmissionsForCountry: getSubmissionsForCountry
  };
})();

