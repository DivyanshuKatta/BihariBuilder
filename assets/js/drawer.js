/**
 * drawer.js
 * Biharibuilder — Mobile Drawer Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Open/close mobile navigation drawer
 *   - Overlay backdrop
 *   - Close on: outside click, Escape key, nav link click
 *   - Body scroll lock when open
 *   - Focus trapping for accessibility
 *   - ARIA attributes (aria-expanded, aria-hidden)
 */

'use strict';

const Drawer = (() => {

  /* -------------------------------------------------------
     ELEMENTS
     ------------------------------------------------------- */

  let drawerEl    = null;
  let overlayEl   = null;
  let hamburgerEl = null;
  let closeBtn    = null;
  let navLinks    = null;
  let isOpen      = false;
  let releaseFocusFn = null;

  /* -------------------------------------------------------
     OPEN
     ------------------------------------------------------- */

  function open() {
    if (!drawerEl || isOpen) return;
    isOpen = true;

    drawerEl.classList.add('is-open');
    overlayEl?.classList.add('is-visible');
    document.body.classList.add('drawer-open');

    hamburgerEl?.setAttribute('aria-expanded', 'true');
    drawerEl.setAttribute('aria-hidden', 'false');

    // Focus trap
    if (window.BB?.trapFocus) {
      releaseFocusFn = window.BB.trapFocus(drawerEl);
    }

    // Listen for Escape
    document.addEventListener('keydown', handleKeydown);
  }

  /* -------------------------------------------------------
     CLOSE
     ------------------------------------------------------- */

  function close() {
    if (!drawerEl || !isOpen) return;
    isOpen = false;

    drawerEl.classList.remove('is-open');
    overlayEl?.classList.remove('is-visible');
    document.body.classList.remove('drawer-open');

    hamburgerEl?.setAttribute('aria-expanded', 'false');
    drawerEl.setAttribute('aria-hidden', 'true');

    // Release focus trap
    if (releaseFocusFn) {
      releaseFocusFn();
      releaseFocusFn = null;
    }

    // Return focus to hamburger
    hamburgerEl?.focus();

    document.removeEventListener('keydown', handleKeydown);
  }

  /* -------------------------------------------------------
     TOGGLE
     ------------------------------------------------------- */

  function toggle() {
    isOpen ? close() : open();
  }

  /* -------------------------------------------------------
     EVENT HANDLERS
     ------------------------------------------------------- */

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    }
  }

  function handleOverlayClick(e) {
    if (e.target === overlayEl) close();
  }

  function handleNavLinkClick(e) {
    // Close drawer when a nav link is clicked
    // (unless it's just an anchor — let the scroll happen)
    close();
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init() {
    drawerEl    = document.querySelector('.mobile-drawer');
    overlayEl   = document.querySelector('.drawer-overlay');
    hamburgerEl = document.querySelector('.hamburger');
    closeBtn    = document.querySelector('.drawer__close');
    navLinks    = document.querySelectorAll('.drawer__nav-link');

    if (!drawerEl) return;

    // Initial ARIA state
    drawerEl.setAttribute('aria-hidden', 'true');
    hamburgerEl?.setAttribute('aria-expanded', 'false');
    hamburgerEl?.setAttribute('aria-controls', drawerEl.id || 'mobile-drawer');
    hamburgerEl?.setAttribute('aria-label', 'Open navigation menu');

    // Event listeners
    hamburgerEl?.addEventListener('click', toggle);
    closeBtn?.addEventListener('click', close);
    overlayEl?.addEventListener('click', handleOverlayClick);

    navLinks?.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy() {
    hamburgerEl?.removeEventListener('click', toggle);
    closeBtn?.removeEventListener('click', close);
    overlayEl?.removeEventListener('click', handleOverlayClick);
    navLinks?.forEach(link => link.removeEventListener('click', handleNavLinkClick));
    document.removeEventListener('keydown', handleKeydown);

    if (isOpen) close();
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy, open, close, toggle };

})();

window.BB = window.BB || {};
window.BB.Drawer = Drawer;
