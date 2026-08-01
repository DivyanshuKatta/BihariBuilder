/**
 * animations.js
 * Biharibuilder — Scroll Animation Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Trigger CSS animations when elements enter viewport
 *   - Handles [data-animation] and [data-stagger] attributes
 *   - Uses IntersectionObserver (no scroll libraries)
 *   - Respects prefers-reduced-motion
 *   - Performance: uses requestAnimationFrame for batching
 */

'use strict';

const Animations = (() => {

  let observer = null;

  /* -------------------------------------------------------
     OBSERVE ANIMATED ELEMENTS
     ------------------------------------------------------- */

  function init() {

    // Skip animation setup for reduced motion users
    if (window.BB?.isReducedMotion && window.BB.isReducedMotion()) {
      revealAll();
      return;
    }

    const animated = document.querySelectorAll('[data-animation], [data-stagger]');

    if (!animated.length) return;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-animated');
          observer.unobserve(entry.target); // animate once
        });
      },
      {
        root:       null,
        rootMargin: '0px 0px -8% 0px',
        threshold:  0.1,
      }
    );

    animated.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
     REVEAL ALL — for reduced motion or no-JS fallback
     ------------------------------------------------------- */

  function revealAll() {
    document.querySelectorAll('[data-animation], [data-stagger]')
      .forEach(el => el.classList.add('is-animated'));
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy, revealAll };

})();

window.BB = window.BB || {};
window.BB.Animations = Animations;
