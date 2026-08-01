/**
 * validation.js
 * Biharibuilder — Form Validation Module
 * Version: 1.0
 *
 * Provides inline validation for all form fields.
 * Uses rules from CONFIG.validation.
 * Displays error messages in .form-error elements.
 * Marks .form-group with is-error / is-success classes.
 */

'use strict';

const Validation = (() => {

  const cfg = window.BB_CONFIG || {};
  const rules = cfg.validation || {};
  const msgs  = (cfg.messages && cfg.messages.validation) || {};

  /* -------------------------------------------------------
     VALIDATE FIELD
     Returns { valid: bool, message: string }
     ------------------------------------------------------- */

  function validateField(input) {
    const name  = input.name || input.id || '';
    const value = input.value.trim();
    const type  = input.type;

    // Required check
    if (input.required && !value) {
      return { valid: false, message: getRequiredMsg(name) };
    }

    // Type-specific validation
    if (value) {
      if (type === 'email' || name.includes('email')) {
        const fn = window.BB?.validateEmail || (() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
        if (!fn(value)) {
          return { valid: false, message: msgs.emailInvalid || 'Please enter a valid email address.' };
        }
      }

      if (type === 'tel' || name.includes('phone')) {
        const fn = window.BB?.validatePhone || (() => /^[6-9]\d{9}$/.test(value.replace(/\D/g, '')));
        if (!fn(value)) {
          return { valid: false, message: msgs.phoneInvalid || 'Please enter a valid 10-digit mobile number.' };
        }
      }

      if (name.includes('name')) {
        const min = rules.nameMin || 2;
        if (value.length < min) {
          return { valid: false, message: msgs.nameMinLength || `Name must be at least ${min} characters.` };
        }
      }

      if (name.includes('message') || name.includes('description')) {
        const max = rules.messageMax || 1000;
        if (value.length > max) {
          return { valid: false, message: `Message cannot exceed ${max} characters.` };
        }
      }
    }

    return { valid: true, message: '' };
  }

  function getRequiredMsg(fieldName) {
    if (fieldName.includes('name'))    return msgs.nameRequired    || 'Please enter your full name.';
    if (fieldName.includes('phone'))   return msgs.phoneRequired   || 'Please enter your phone number.';
    if (fieldName.includes('email'))   return msgs.emailInvalid    || 'Please enter a valid email.';
    if (fieldName.includes('city'))    return msgs.cityRequired    || 'Please enter your city.';
    if (fieldName.includes('project')) return msgs.projectRequired || 'Please select a project type.';
    return 'This field is required.';
  }

  /* -------------------------------------------------------
     SHOW / CLEAR FIELD ERROR
     ------------------------------------------------------- */

  function showError(input, message) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.add('form-group--error');
    group.classList.remove('form-group--success');

    let errorEl = group.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-error';
      errorEl.setAttribute('role', 'alert');
      errorEl.setAttribute('aria-live', 'polite');
      input.after(errorEl);
    }
    errorEl.textContent = message;

    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', errorEl.id || `error-${input.name}`);
  }

  function showSuccess(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.remove('form-group--error');
    group.classList.add('form-group--success');

    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';

    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
  }

  function clearField(input) {
    const group = input.closest('.form-group');
    if (!group) return;

    group.classList.remove('form-group--error', 'form-group--success');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  /* -------------------------------------------------------
     VALIDATE ENTIRE FORM
     Returns { valid: bool, invalidFields: Element[] }
     ------------------------------------------------------- */

  function validateForm(formEl) {
    const inputs = Array.from(formEl.querySelectorAll(
      'input[required], select[required], textarea[required], input[type="email"], input[type="tel"]'
    ));

    let valid = true;
    const invalidFields = [];

    inputs.forEach(input => {
      const result = validateField(input);
      if (!result.valid) {
        showError(input, result.message);
        valid = false;
        invalidFields.push(input);
      } else {
        showSuccess(input);
      }
    });

    // Focus first invalid field
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
    }

    return { valid, invalidFields };
  }

  /* -------------------------------------------------------
     ATTACH LIVE VALIDATION
     Validates on blur, clears error on input.
     ------------------------------------------------------- */

  function attachLiveValidation(formEl) {
    const inputs = formEl.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.value.trim() || input.required) {
          const result = validateField(input);
          result.valid ? showSuccess(input) : showError(input, result.message);
        }
      });

      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group?.classList.contains('form-group--error')) {
          clearField(input);
        }
      });
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return {
    validateField,
    validateForm,
    showError,
    showSuccess,
    clearField,
    attachLiveValidation,
  };

})();

window.BB = window.BB || {};
window.BB.Validation = Validation;
