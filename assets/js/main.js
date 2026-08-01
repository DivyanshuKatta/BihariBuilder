/**
 * main.js
 * Biharibuilder — Application Bootstrap
 * Version: 1.0
 *
 * Responsibilities:
 *   - Initialize all modules in correct order
 *   - Detect current page and run page-specific init
 *   - Register global event listeners
 *   - Initialize lazy loading
 *   - Handle page loader
 *   - Set up floating action buttons behavior
 *
 * NOTE: Never place feature logic here. Delegate to modules.
 * Load order: config.js → utilities.js → main.js → feature modules
 */

'use strict';

/* =========================================================
   INITIALIZATION — runs after DOM is ready
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // -------------------------------------------------------
  // Core modules (order matters)
  // -------------------------------------------------------

  initNavbar();
  initDrawer();
  initAnimations();
  initLazyLoad();
  initScroll();
  initAccordion();
  initCounter();
  initFloatingButtons();

  // -------------------------------------------------------
  // Page-specific initialization
  // -------------------------------------------------------

  const page = detectPage();
  initPage(page);

  // -------------------------------------------------------
  // Page loader hide
  // -------------------------------------------------------

  hidePageLoader();

});

/* =========================================================
   MODULE INITIALIZERS
   Each safely checks if module exists before calling.
   ========================================================= */

function initNavbar() {
  window.BB?.Navbar?.init();
}

function initDrawer() {
  window.BB?.Drawer?.init();
}

function initAnimations() {
  window.BB?.Animations?.init();
}

function initLazyLoad() {
  window.BB?.LazyLoad?.init();
}

function initScroll() {
  window.BB?.Scroll?.init();
}

function initAccordion() {
  window.BB?.Accordion?.init('.faq');
}

function initCounter() {
  window.BB?.Counter?.init();
}

/* =========================================================
   FLOATING ACTION BUTTONS
   - Show at all times
   - Pulse every 15 seconds (FAB_PULSE_INTERVAL from config)
   - Hide when mobile keyboard is open
   ========================================================= */

function initFloatingButtons() {
  const fabContainer = document.querySelector('.fab-container');
  if (!fabContainer) return;

  const cfg        = window.BB_CONFIG || {};
  const pulseInterval = cfg.animation?.fab || 15000;

  // Initial pulse
  triggerFabPulse();

  // Recurring pulse
  setInterval(triggerFabPulse, pulseInterval);

  // Hide when mobile keyboard opens (viewport shrinks significantly)
  if (window.BB?.isMobile && window.BB.isMobile()) {
    let lastHeight = window.innerHeight;

    const handleResize = window.BB?.debounce
      ? window.BB.debounce(checkKeyboard, 200)
      : checkKeyboard;

    window.addEventListener('resize', handleResize, { passive: true });

    function checkKeyboard() {
      const currentHeight = window.innerHeight;
      const diff = lastHeight - currentHeight;

      if (diff > 150) {
        // Keyboard likely opened
        fabContainer.classList.add('is-hidden');
      } else {
        fabContainer.classList.remove('is-hidden');
        lastHeight = currentHeight;
      }
    }
  }
}

function triggerFabPulse() {
  const whatsappBtn = document.querySelector('.fab--whatsapp .fab__btn');
  const phoneBtn    = document.querySelector('.fab--phone .fab__btn');

  if (whatsappBtn) {
    whatsappBtn.classList.remove('fab--pulse');
    void whatsappBtn.offsetWidth; // force reflow
    whatsappBtn.classList.add('fab--pulse');
  }

  if (phoneBtn) {
    // Slightly delay phone pulse
    setTimeout(() => {
      if (!phoneBtn) return;
      phoneBtn.classList.remove('fab--pulse-copper');
      void phoneBtn.offsetWidth;
      phoneBtn.classList.add('fab--pulse-copper');
    }, 1000);
  }
}

/* =========================================================
   PAGE DETECTION
   Returns current page identifier based on HTML filename or body class.
   ========================================================= */

function detectPage() {
  const path = window.location.pathname;
  const body = document.body;

  if (path.includes('about'))    return 'about';
  if (path.includes('services')) return 'services';
  if (path.includes('projects')) return 'projects';
  if (path.includes('gallery'))  return 'gallery';
  if (path.includes('contact'))  return 'contact';
  if (path.includes('blog'))     return 'blog';
  if (path.includes('privacy'))  return 'privacy';
  if (path.includes('terms'))    return 'terms';
  if (path.includes('404'))      return '404';

  // Check body data attribute
  if (body.dataset.page) return body.dataset.page;

  return 'home'; // default
}

/* =========================================================
   PAGE-SPECIFIC INITIALIZATION
   ========================================================= */

function initPage(page) {
  switch (page) {
    case 'home':
      initHomePage();
      break;
    case 'gallery':
      window.BB?.Gallery?.init();
      break;
    case 'contact':
      window.BB?.Forms?.init();
      break;
    default:
      break;
  }
}

function initHomePage() {
  // Home-specific init: hero, estimate form etc.
  // Hero form is initialized by forms.js when found on page
  window.BB?.Forms?.init();
}

/* =========================================================
   PAGE LOADER — hide after everything is ready
   ========================================================= */

function hidePageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  // Small delay for visual smoothness
  setTimeout(() => {
    loader.classList.add('is-hidden');
    // Remove from DOM after transition
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 300);
}

/* =========================================================
   GLOBAL ERROR HANDLING — friendly, no stack traces exposed
   ========================================================= */

window.addEventListener('error', (e) => {
  // Log in development only
  if (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1') {
    console.error('[BB Error]', e.message, e.filename, e.lineno);
  }
  return false; // don't suppress native behavior
});

window.addEventListener('unhandledrejection', (e) => {
  if (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1') {
    console.error('[BB Unhandled Promise]', e.reason);
  }
});
