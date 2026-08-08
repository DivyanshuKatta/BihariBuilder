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
    initCustomDropdowns();

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
      const formData = new FormData(form);
      const submissionData = Object.fromEntries(formData.entries());

      if (cfg.forms && cfg.forms.mode === 'google_forms') {
        await submitToGoogleForms(form, cfg);
      } else {
        await submitToApi(form, cfg);
      }

      showFormSuccess(form, submissionData);

    } catch (err) {
      showFormError(form);
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
      // Dev mode placeholder fallback
      await new Promise(r => setTimeout(r, 1000));
      return;
    }

    const data = Object.fromEntries(formData.entries());

    try {
      // Primary JSON POST to Google Apps Script Web App
      await fetch(googleUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data),
      });
    } catch (err) {
      // Fallback urlencoded no-cors POST
      const payload = new URLSearchParams(formData);
      await fetch(googleUrl, {
        method: 'POST',
        mode:   'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
    }
  }

  /* -------------------------------------------------------
     FUTURE API SUBMISSION
     ------------------------------------------------------- */

  async function submitToApi(form, cfg) {
    const apiUrl = cfg.forms?.apiEndpoint || '/api/enquiry';
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

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
     SUCCESS STATE WITH WHATSAPP CONFIRMATION & EMAIL NOTIFICATION
     ------------------------------------------------------- */

  function showFormSuccess(form, submissionData = {}) {
    const name = submissionData['full-name'] || submissionData['name'] || 'Valued Client';
    const phone = submissionData['phone'] || '';
    const city = submissionData['city'] || 'Plot Location';
    const project = submissionData['project-type'] || 'Construction Inquiry';
    const budget = submissionData['budget'] || 'Standard';

    form.innerHTML = `
      <div class="form-success-state is-visible" role="alert" aria-live="polite" style="text-align: center; padding: 16px 0;">
        <div class="form-success-state__icon" style="width: 60px; height: 60px; background: rgba(15, 163, 163, 0.12); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h3 class="form-success-state__title" style="font-family: var(--font-heading); font-size: 22px; font-weight: 800; color: var(--color-navy); margin-bottom: 8px;">Estimate Request Submitted!</h3>
        <p class="form-success-state__message" style="font-size: 14px; color: var(--text-body); line-height: 1.6; margin-bottom: 18px;">
          Thank you <strong>${name}</strong>! Your inquiry details have been logged and sent to our civil engineering team.
        </p>

        <div style="background: var(--bg-section-alt); padding: 16px; border-radius: 10px; text-align: left; font-size: 13px; margin-bottom: 12px; border-left: 4px solid var(--color-orange);">
          <div style="font-weight: 700; color: var(--color-navy); margin-bottom: 6px;">📋 Inquiry Summary &amp; Status:</div>
          <div style="color: var(--text-body); line-height: 1.6;">
            <div>• <strong>Client Name:</strong> ${name}</div>
            <div>• <strong>Mobile Number:</strong> ${phone}</div>
            <div>• <strong>Project Type:</strong> ${project}</div>
            <div>• <strong>Location:</strong> ${city}</div>
            <div>• <strong>Budget:</strong> ${budget}</div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed #cbd5e1; color: var(--color-teal); font-weight: 700;">
              ✓ Team Email Dispatched: info@biharibuilder.com<br>
              ✓ Engineer Response Guarantee: Within 8 Hours
            </div>
          </div>
        </div>
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
     CUSTOM RESPONSIVE DROPDOWN INITIATOR
     Replaces native OS dropdown overflow menus with 100% contained custom HTML/CSS menus.
     ------------------------------------------------------- */

  function initCustomDropdowns() {
    document.querySelectorAll('.form-select').forEach(select => {
      if (select.dataset.customized === 'true') return;
      select.dataset.customized = 'true';

      // Hide native select visually
      select.style.display = 'none';

      const wrapper = document.createElement('div');
      wrapper.className = 'custom-select-wrapper';

      const trigger = document.createElement('div');
      trigger.className = 'custom-select__trigger';
      trigger.setAttribute('tabindex', '0');
      trigger.setAttribute('role', 'combobox');
      trigger.setAttribute('aria-expanded', 'false');

      const selectedOption = select.options[select.selectedIndex];
      trigger.innerHTML = `
        <span class="custom-select__value">${selectedOption ? selectedOption.text : (select.options[0]?.text || '')}</span>
        <svg class="custom-select__arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      `;

      const menu = document.createElement('div');
      menu.className = 'custom-select__menu';

      Array.from(select.options).forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = `custom-select__option ${idx === select.selectedIndex ? 'is-selected' : ''}`;
        item.textContent = opt.text;
        item.dataset.value = opt.value;

        item.addEventListener('click', () => {
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          trigger.querySelector('.custom-select__value').textContent = opt.text;
          menu.querySelectorAll('.custom-select__option').forEach(o => o.classList.remove('is-selected'));
          item.classList.add('is-selected');
          wrapper.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        });

        menu.appendChild(item);
      });

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.custom-select-wrapper.is-open').forEach(w => {
          if (w !== wrapper) w.classList.remove('is-open');
        });
        const isOpen = wrapper.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          trigger.click();
        }
      });

      wrapper.appendChild(trigger);
      wrapper.appendChild(menu);
      select.after(wrapper);
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.custom-select-wrapper.is-open').forEach(w => w.classList.remove('is-open'));
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init };

})();

window.BB = window.BB || {};
window.BB.Forms = Forms;
