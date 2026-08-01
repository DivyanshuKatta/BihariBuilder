/**
 * navbar.js
 * Biharibuilder — Navbar Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Sticky navigation with transparent → white scroll transition
 *   - Active navigation link detection
 *   - Shadow appearance after 60px scroll
 *   - Mobile hamburger toggle (delegates to drawer.js)
 *   - Keyboard accessibility
 */

'use strict';

const Navbar = (() => {

  /* -------------------------------------------------------
     STATE
     ------------------------------------------------------- */

  let navEl       = null;
  let headerEl    = null;
  let isScrolled  = false;
  let scrollRAF   = null;

  const SCROLL_THRESHOLD = (window.BB_CONFIG && window.BB_CONFIG.scroll.navSolid) || 60;

  /* -------------------------------------------------------
     SCROLL HANDLER
     ------------------------------------------------------- */

  function handleScroll() {
    if (scrollRAF) cancelAnimationFrame(scrollRAF);

    scrollRAF = requestAnimationFrame(() => {
      const scrollY = window.BB ? window.BB.getScrollY() : (window.scrollY || 0);
      const shouldBeScrolled = scrollY > SCROLL_THRESHOLD;

      if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        updateNavState();
      }
    });
  }

  function updateNavState() {
    if (!headerEl) return;

    if (isScrolled) {
      headerEl.classList.add('is-scrolled');
    } else {
      headerEl.classList.remove('is-scrolled');
    }
  }

  /* -------------------------------------------------------
     ACTIVE NAVIGATION LINK
     Compares current path against nav link hrefs.
     ------------------------------------------------------- */

  function setActiveLink() {
    const rawPath  = window.location.pathname;
    const pageName = rawPath.split('/').filter(Boolean).pop() || 'index.html';
    const links    = document.querySelectorAll('.navbar__nav-link, .drawer__nav-link');

    links.forEach(link => {
      const linkHref = link.getAttribute('href') || '';
      const linkPage = linkHref.split('/').filter(Boolean).pop() || 'index.html';

      const isHome   = (pageName === 'index.html' || pageName === 'BihariBuilders');
      const isActive = isHome
        ? (linkPage === 'index.html' || linkHref === './' || linkHref === '/' || linkHref === '#')
        : (pageName.includes(linkPage) && linkPage !== 'index.html');

      link.classList.toggle('is-active', isActive);
      link.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init() {
    headerEl = document.querySelector('.site-header');
    navEl    = document.querySelector('.navbar');

    if (!headerEl) return;

    // Initial state check
    handleScroll();

    // Passive scroll listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Set active state
    setActiveLink();

    // Re-check on hash change
    window.addEventListener('hashchange', setActiveLink);
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy() {
    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('hashchange', setActiveLink);
    if (scrollRAF) cancelAnimationFrame(scrollRAF);
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy, setActiveLink };

})();

window.BB = window.BB || {};
window.BB.Navbar = Navbar;
