/**
 * main.js
 * Biharibuilder — Application Bootstrap & Module Orchestration
 * Version: 1.0
 *
 * Responsibilities:
 *   - Initialize all modules in correct load order
 *   - Detect active page and execute page-specific controllers
 *   - Manage FAB pulse animations and keyboard-hide on mobile
 *   - Hide page preloader
 *   - Global error safety net
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // Core module initialization
  initNavbar();
  initDrawer();
  initHero();
  initAnimations();
  initLazyLoad();
  initScroll();
  initAccordion();
  initCounter();
  initFloatingButtons();

  // Page specific controller dispatch
  const page = detectPage();
  initPageControllers(page);

  // Hide page loader
  hidePageLoader();
});

function initNavbar() { window.BB?.Navbar?.init(); }
function initDrawer() { window.BB?.Drawer?.init(); }
function initHero()   { window.BB?.Hero?.init();   }
function initAnimations() { window.BB?.Animations?.init(); }
function initLazyLoad()   { window.BB?.LazyLoad?.init();   }
function initScroll()     { window.BB?.Scroll?.init();     }
function initAccordion()  { window.BB?.Accordion?.init('.faq'); }
function initCounter()    { window.BB?.Counter?.init();    }

function initFloatingButtons() {
  const fabContainer = document.querySelector('.fab-container');
  if (!fabContainer) return;

  const cfg = window.BB_CONFIG || {};
  const pulseInterval = cfg.animation?.fab || 15000;

  triggerFabPulse();
  setInterval(triggerFabPulse, pulseInterval);

  if (window.BB?.isMobile && window.BB.isMobile()) {
    let lastHeight = window.innerHeight;
    const handleResize = window.BB?.debounce
      ? window.BB.debounce(checkKeyboard, 200)
      : checkKeyboard;

    window.addEventListener('resize', handleResize, { passive: true });

    function checkKeyboard() {
      const currentHeight = window.innerHeight;
      if (lastHeight - currentHeight > 150) {
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
    void whatsappBtn.offsetWidth;
    whatsappBtn.classList.add('fab--pulse');
  }

  if (phoneBtn) {
    setTimeout(() => {
      if (!phoneBtn) return;
      phoneBtn.classList.remove('fab--pulse-copper');
      void phoneBtn.offsetWidth;
      phoneBtn.classList.add('fab--pulse-copper');
    }, 1000);
  }
}

function detectPage() {
  const body = document.body;
  if (body.dataset.page) return body.dataset.page;
  const path = window.location.pathname;

  if (path.includes('about'))          return 'about';
  if (path.includes('service-detail')) return 'service-detail';
  if (path.includes('services'))       return 'services';
  if (path.includes('project-detail')) return 'project-detail';
  if (path.includes('projects'))       return 'projects';
  if (path.includes('gallery'))        return 'gallery';
  if (path.includes('contact'))        return 'contact';
  if (path.includes('blog-detail'))    return 'blog-detail';
  if (path.includes('blog'))           return 'blog';
  if (path.includes('privacy'))        return 'privacy-policy';
  if (path.includes('terms'))          return 'terms-and-conditions';
  if (path.includes('404'))            return '404';

  return 'home';
}

function initPageControllers(page) {
  switch (page) {
    case 'home':
    case 'contact':
      window.BB?.Forms?.init();
      break;
    case 'gallery':
      window.BB?.Gallery?.init();
      break;
    default:
      break;
  }
}

function hidePageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;

  setTimeout(() => {
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 300);
}

window.addEventListener('error', (e) => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    /* quiet log */
  }
  return false;
});
