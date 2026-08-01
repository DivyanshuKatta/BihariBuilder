/**
 * forms.js
 * Biharibuilder — Form Submission Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Handle estimate form submission
 *   - Validate using Validation module
 *   - Submit to Google Forms (current mode)
 *   - Show loading, success, error states
 *   - Prevent duplicate submissions
 *   - Future API endpoint integration (config.forms.mode = 'api')
 *
 * Google Forms submission method:
 *   POST to the pre-filled form URL using fetch with no-cors.
 *   The submission is anonymous. Google Forms does not return JSON.
 */

'use strict';

const Forms = (() => {

  /* -------------------------------------------------------
     INIT — finds all forms on page
     ------------------------------------------------------- */

  function init() {
    const estimateForms = document.querySelectorAll('[data-form="estimate"]');
    estimateForms.forEach(setupEstimateForm);

    const newsletterForms = document.querySelectorAll('[data-form="newsletter"]');
    newsletterForms.forEach(setupNewsletterForm);
  }

  /* -------------------------------------------------------
     ESTIMATE FORM SETUP
     ------------------------------------------------------- */

  function setupEstimateForm(form) {
    if (!form) return;

    // Attach live validation
    window.BB?.Validation?.attachLiveValidation(form);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleEstimateSubmit(form);
    });
  }

  /* -------------------------------------------------------
     ESTIMATE FORM SUBMISSION
     ------------------------------------------------------- */

  async function handleEstimateSubmit(form) {
    // Prevent double submission
    if (form.dataset.submitting === 'true') return;

    // Validate
    const validation = window.BB?.Validation?.validateForm(form);
    if (validation && !validation.valid) return;

    // Set submitting state
    form.dataset.submitting = 'true';
    setLoadingState(form, true);

    try {
      const cfg = window.BB_CONFIG || {};

      if (cfg.forms && cfg.forms.mode === 'google_forms') {
        await submitToGoogleForms(form, cfg);
      } else {
        await submitToApi(form, cfg);
      }

      showFormSuccess(form);

    } catch (err) {
      showFormError(form);

      // Log in dev only
      if (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1') {
        console.error('[BB Forms]', err);
      }

    } finally {
      form.dataset.submitting = 'false';
      setLoadingState(form, false);
    }
  }

  /* -------------------------------------------------------
     GOOGLE FORMS SUBMISSION
     Uses no-cors mode — response is opaque, assume success.
     ------------------------------------------------------- */

  async function submitToGoogleForms(form, cfg) {
    const formData = new FormData(form);
    const googleUrl = cfg.forms?.estimateFormUrl || '';

    if (!googleUrl || googleUrl.includes('FORM_ID')) {
      // Google Forms URL not configured yet — simulate success in dev
      if (window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1') {
        console.info('[BB Forms] Google Forms URL not configured. Simulating success.');
        await new Promise(r => setTimeout(r, 1500)); // simulate delay
        return;
      }
      throw new Error('Google Forms URL not configured.');
    }

    // Map form fields to Google Forms entry IDs
    const fields = cfg.forms?.fields || {};
    const payload = new URLSearchParams();

    const mappings = {
      'full-name': fields.name,
      'phone':     fields.phone,
      'email':     fields.email,
      'city':      fields.city,
      'project-type': fields.projectType,
      'budget':    fields.budget,
      'message':   fields.message,
    };

    Object.entries(mappings).forEach(([fieldName, entryId]) => {
      if (entryId) {
        const value = formData.get(fieldName) || '';
        if (window.BB?.sanitizeInput) {
          payload.set(entryId, window.BB.sanitizeInput(value));
        } else {
          payload.set(entryId, value);
        }
      }
    });

    await fetch(googleUrl, {
      method: 'POST',
      mode:   'no-cors',   // Google Forms doesn't allow CORS
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });
    // Note: no-cors means response is opaque — assume success
  }

  /* -------------------------------------------------------
     FUTURE API SUBMISSION
     ------------------------------------------------------- */

  async function submitToApi(form, cfg) {
    const apiUrl = cfg.forms?.apiEndpoint || '/api/enquiry';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Sanitize
    if (window.BB?.sanitizeInput) {
      Object.keys(data).forEach(k => {
        data[k] = window.BB.sanitizeInput(data[k]);
      });
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
  }

  /* -------------------------------------------------------
     LOADING STATE
     ------------------------------------------------------- */

  function setLoadingState(form, isLoading) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
    } else {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
      submitBtn.setAttribute('aria-busy', 'false');
    }
  }

  /* -------------------------------------------------------
     SUCCESS STATE
     ------------------------------------------------------- */

  function showFormSuccess(form) {
    const cfg = window.BB_CONFIG || {};
    const msg = (cfg.messages && cfg.messages.formSuccess) || {};

    // Check if there's a dedicated success state element
    const card = form.closest('.estimate-form-card');
    if (card) {
      let successEl = card.querySelector('.form-success-state');
      if (!successEl) {
        successEl = createSuccessElement(msg);
        card.appendChild(successEl);
      }

      // Slide out form, show success
      form.style.display = 'none';
      successEl.classList.add('is-visible');

      // Announce to screen readers
      successEl.setAttribute('aria-live', 'polite');
      successEl.focus?.();
      return;
    }

    // Fallback: replace form content
    form.innerHTML = `
      <div class="form-success-state is-visible" role="alert" aria-live="polite">
        <div class="form-success-state__icon">
          <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="form-success-state__title">${msg.title || 'Thank You!'}</h3>
        <p class="form-success-state__message">${msg.body || 'Our team will contact you within 8 hours.'}</p>
      </div>
    `;
  }

  function createSuccessElement(msg) {
    const el = document.createElement('div');
    el.className = 'form-success-state';
    el.setAttribute('role', 'alert');
    el.innerHTML = `
      <div class="form-success-state__icon">
        <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" stroke="var(--color-success)" fill="none">
          <polyline points="20 6 9 17 4 12" stroke-width="2.5"/>
        </svg>
      </div>
      <h3 class="form-success-state__title">${msg.title || 'Thank You!'}</h3>
      <p class="form-success-state__message">${msg.body || 'We will contact you within 8 hours.'}</p>
    `;
    return el;
  }

  /* -------------------------------------------------------
     ERROR STATE
     ------------------------------------------------------- */

  function showFormError(form) {
    const cfg = window.BB_CONFIG || {};
    const msg = (cfg.messages && cfg.messages.formError) || {};

    // Show a non-intrusive error banner above submit button
    const submitBtn = form.querySelector('[type="submit"]');
    let errorBanner = form.querySelector('.form-submit-error');

    if (!errorBanner) {
      errorBanner = document.createElement('p');
      errorBanner.className = 'form-error form-submit-error';
      errorBanner.setAttribute('role', 'alert');
      errorBanner.setAttribute('aria-live', 'assertive');
      submitBtn?.before(errorBanner);
    }

    errorBanner.textContent = msg.body || 'Something went wrong. Please try again or contact us directly.';
  }

  /* -------------------------------------------------------
     NEWSLETTER FORM SETUP
     ------------------------------------------------------- */

  function setupNewsletterForm(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        // For now, just show a simple feedback
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
          btn.textContent = 'Subscribed!';
          btn.disabled = true;
          setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.disabled = false;
            input.value = '';
          }, 3000);
        }
      }
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init };

})();

window.BB = window.BB || {};
window.BB.Forms = Forms;
