/**
 * scroll.js
 * Biharibuilder — Scroll Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Smooth scroll to sections via anchor links
 *   - Scroll spy: updates active nav link based on viewport position
 *   - "Scroll to top" button
 *   - Debounced scroll event for performance
 */

'use strict';

const Scroll = (() => {

  let scrollSpy   = false;
  let sections    = [];
  let navLinks    = [];
  let cleanup     = null;

  /* -------------------------------------------------------
     SMOOTH SCROLL — Handle anchor link clicks
     ------------------------------------------------------- */

  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const navHeight  = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height-desktop') || '88', 10);
      const utilHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--utility-bar-height') || '40', 10);
      const offset = navHeight + utilHeight + 16;

      window.BB?.scrollToElement
        ? window.BB.scrollToElement(target, offset)
        : target.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------
     SCROLL SPY — Highlight active nav link
     ------------------------------------------------------- */

  function initScrollSpy() {
    sections  = Array.from(document.querySelectorAll('section[id]'));
    navLinks  = Array.from(document.querySelectorAll('.navbar__nav-link[href^="#"]'));

    if (!sections.length || !navLinks.length) return;

    scrollSpy = true;

    const handleSpy = (window.BB?.debounce || ((f) => f))(updateActiveSpy, 100);
    window.addEventListener('scroll', handleSpy, { passive: true });

    cleanup = () => window.removeEventListener('scroll', handleSpy);
    updateActiveSpy();
  }

  function updateActiveSpy() {
    if (!scrollSpy) return;

    const scrollY  = window.scrollY || 0;
    const navHeight = 100; // rough offset

    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - navHeight;
      if (scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('href')?.slice(1);
      link.classList.toggle('is-active', linkTarget === current);
      link.setAttribute('aria-current', linkTarget === current ? 'page' : 'false');
    });
  }

  /* -------------------------------------------------------
     SCROLL TO TOP
     ------------------------------------------------------- */

  function initScrollToTop() {
    const btn = document.querySelector('.js-scroll-top');
    if (!btn) return;

    // Show/hide based on scroll position
    const toggleBtn = (window.BB?.throttle || ((f) => f))(() => {
      const show = (window.scrollY || 0) > 400;
      btn.classList.toggle('is-visible', show);
      btn.setAttribute('aria-hidden', show ? 'false' : 'true');
    }, 200);

    window.addEventListener('scroll', toggleBtn, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Keyboard
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init() {
    initSmoothScroll();
    initScrollSpy();
    initScrollToTop();
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy() {
    if (cleanup) cleanup();
    scrollSpy = false;
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy };

})();

window.BB = window.BB || {};
window.BB.Scroll = Scroll;
