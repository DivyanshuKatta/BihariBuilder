/**
 * utilities.js
 * Biharibuilder Design System — Utility Functions
 * Version: 1.0
 *
 * Reusable helper functions used across all modules.
 * No DOM manipulation here — pure functions only.
 *
 * Available utilities:
 *   debounce(), throttle(), formatPhone(), validateEmail(),
 *   validatePhone(), sanitizeInput(), scrollToElement(),
 *   addClass(), removeClass(), toggleClass(), hasClass(),
 *   createElement(), getScrollY(), isMobile(), isTablet(),
 *   isReducedMotion(), trapFocus(), releaseFocus()
 */

'use strict';

/* =========================================================
   DEBOUNCE
   Delays function execution until after wait ms have passed.
   Use for: scroll events, resize events, search input.
   ========================================================= */

/**
 * @param {Function} fn - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(fn, wait = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* =========================================================
   THROTTLE
   Ensures function runs at most once per wait period.
   Use for: scroll handlers, mousemove, resize.
   ========================================================= */

/**
 * @param {Function} fn - Function to throttle
 * @param {number} wait - Milliseconds between calls
 * @returns {Function} Throttled function
 */
function throttle(fn, wait = 100) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/* =========================================================
   CLASS MANIPULATION
   ========================================================= */

/**
 * Add CSS class(es) to element
 * @param {Element} el
 * @param {...string} classes
 */
function addClass(el, ...classes) {
  if (!el) return;
  el.classList.add(...classes);
}

/**
 * Remove CSS class(es) from element
 * @param {Element} el
 * @param {...string} classes
 */
function removeClass(el, ...classes) {
  if (!el) return;
  el.classList.remove(...classes);
}

/**
 * Toggle CSS class on element
 * @param {Element} el
 * @param {string} cls
 * @param {boolean} [force]
 */
function toggleClass(el, cls, force) {
  if (!el) return;
  if (force !== undefined) {
    el.classList.toggle(cls, force);
  } else {
    el.classList.toggle(cls);
  }
}

/**
 * Check if element has class
 * @param {Element} el
 * @param {string} cls
 * @returns {boolean}
 */
function hasClass(el, cls) {
  if (!el) return false;
  return el.classList.contains(cls);
}

/* =========================================================
   DOM HELPERS
   ========================================================= */

/**
 * Shorthand for querySelector
 * @param {string} selector
 * @param {Element|Document} [context]
 * @returns {Element|null}
 */
function qs(selector, context = document) {
  return context.querySelector(selector);
}

/**
 * Shorthand for querySelectorAll → returns Array
 * @param {string} selector
 * @param {Element|Document} [context]
 * @returns {Element[]}
 */
function qsa(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

/**
 * Create element with options
 * @param {string} tag - HTML tag name
 * @param {Object} [opts] - attributes, classes, text
 * @returns {Element}
 */
function createElement(tag, opts = {}) {
  const el = document.createElement(tag);
  if (opts.className) el.className = opts.className;
  if (opts.id)        el.id = opts.id;
  if (opts.text)      el.textContent = opts.text;
  if (opts.html)      el.innerHTML = opts.html; // only use with safe content
  if (opts.attrs) {
    Object.entries(opts.attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return el;
}

/* =========================================================
   SCROLL
   ========================================================= */

/**
 * Get current vertical scroll position
 * @returns {number}
 */
function getScrollY() {
  return window.scrollY || window.pageYOffset;
}

/**
 * Smooth scroll to element
 * @param {Element|string} target - Element or CSS selector
 * @param {number} [offset] - px offset from top (e.g. navbar height)
 */
function scrollToElement(target, offset = 96) {
  const el = typeof target === 'string' ? qs(target) : target;
  if (!el) return;

  const top = el.getBoundingClientRect().top + getScrollY() - offset;

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}

/* =========================================================
   VALIDATION
   ========================================================= */

const cfg = window.BB_CONFIG || {};
const validationRules = cfg.validation || {};

/**
 * Validate email address
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  const regex = validationRules.emailRegex || /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).trim().toLowerCase());
}

/**
 * Validate Indian mobile phone number
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhone(phone) {
  const cleaned = String(phone).replace(/[\s\-().+]/g, '');
  const regex = validationRules.phoneRegex || /^[6-9]\d{9}$/;
  return regex.test(cleaned);
}

/**
 * Format phone number for display
 * @param {string} phone
 * @returns {string}
 */
function formatPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/* =========================================================
   SANITIZATION
   ========================================================= */

/**
 * Remove dangerous characters from user input
 * Never inject unsanitized text as innerHTML.
 * @param {string} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>"'`&]/g, '')
    .trim()
    .slice(0, 2000); // hard limit
}

/**
 * Escape HTML special characters for safe display
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(str).replace(/[&<>"']/g, m => map[m]);
}

/* =========================================================
   RESPONSIVE DETECTION
   ========================================================= */

const bp = (cfg.breakpoints) || {};

/**
 * Is current viewport mobile?
 * @returns {boolean}
 */
function isMobile() {
  return window.innerWidth < (bp.tablet || 768);
}

/**
 * Is current viewport tablet?
 * @returns {boolean}
 */
function isTablet() {
  return window.innerWidth >= (bp.tablet || 768) &&
         window.innerWidth < (bp.desktop || 992);
}

/**
 * Is current viewport desktop?
 * @returns {boolean}
 */
function isDesktop() {
  return window.innerWidth >= (bp.desktop || 992);
}

/* =========================================================
   ACCESSIBILITY
   ========================================================= */

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
function isReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Trap focus within an element (modal, drawer)
 * @param {Element} container
 * @returns {Function} Cleanup function
 */
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), ' +
    'textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handler(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  container.addEventListener('keydown', handler);
  if (first) first.focus();

  return () => container.removeEventListener('keydown', handler);
}

/* =========================================================
   INTERSECTION OBSERVER HELPER
   ========================================================= */

/**
 * Create an IntersectionObserver that calls callback once when element enters view
 * @param {Function} callback - (entries, observer) => void
 * @param {Object} [options]
 * @returns {IntersectionObserver}
 */
function createObserver(callback, options = {}) {
  const defaults = {
    root:       null,
    rootMargin: '0px 0px -10% 0px',
    threshold:  0.1,
  };
  return new IntersectionObserver(callback, { ...defaults, ...options });
}

/* =========================================================
   STORAGE HELPERS
   ========================================================= */

/**
 * Safe localStorage setter
 * @param {string} key
 * @param {*} value
 */
function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (_) {
    // Storage may be unavailable (private mode, etc.)
  }
}

/**
 * Safe localStorage getter
 * @param {string} key
 * @param {*} [fallback]
 * @returns {*}
 */
function getLocalStorage(key, fallback = null) {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch (_) {
    return fallback;
  }
}

/* =========================================================
   EXPORTS — make utilities globally available
   ========================================================= */

window.BB = window.BB || {};

Object.assign(window.BB, {
  debounce,
  throttle,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  qs,
  qsa,
  createElement,
  getScrollY,
  scrollToElement,
  validateEmail,
  validatePhone,
  formatPhone,
  sanitizeInput,
  escapeHtml,
  isMobile,
  isTablet,
  isDesktop,
  isReducedMotion,
  trapFocus,
  createObserver,
  setLocalStorage,
  getLocalStorage,
});

/* =========================================================
   PROTECTED SECURE STEALTH CONTACT SYSTEM
   Prevents phone number & WhatsApp links from appearing in:
   - DOM Tree Inspection
   - Hover Cursor Link Previews (bottom-left browser tooltip)
   - Console logs & Network tabs
   - Web Scraping Crawlers
   ========================================================= */
(function initProtectedContacts() {
  const TEL_TOKEN = "KzkxNjIwNzI1OTI5NA=="; // +916207259294
  const WA_TOKEN  = "OTE2MjA3MjU5Mjk0";   // 916207259294

  function getDecoded(token) {
    try {
      return atob(token);
    } catch (e) {
      return '';
    }
  }

  function handleCall(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const tel = getDecoded(TEL_TOKEN);
    if (tel) {
      window.location.href = 'tel:' + tel;
    }
  }

  function handleWhatsApp(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const wa = getDecoded(WA_TOKEN);
    if (wa) {
      const msg = encodeURIComponent("Hello, I am interested in a free construction estimate.");
      window.open(`https://wa.me/${wa}?text=${msg}`, '_blank', 'noopener,noreferrer');
    }
  }

  function applyProtectedContacts() {
    try {
      document.querySelectorAll('.js-protected-call, a[href*="tel:"]').forEach(el => {
        el.removeAttribute('href');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.style.cursor = 'pointer';
        el.addEventListener('click', handleCall);
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleCall(e);
        });
      });

      document.querySelectorAll('.js-protected-wa, a[href*="wa.me"]').forEach(el => {
        el.removeAttribute('href');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.style.cursor = 'pointer';
        el.addEventListener('click', handleWhatsApp);
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') handleWhatsApp(e);
        });
      });
    } catch (e) {
      /* quiet fail — zero console entries */
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyProtectedContacts);
  } else {
    applyProtectedContacts();
  }
})();

