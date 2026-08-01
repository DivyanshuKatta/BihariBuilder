/**
 * counter.js
 * Biharibuilder — Statistics Counter Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Animate numbers from 0 to target when element enters viewport
 *   - Runs once per element (IntersectionObserver disconnect after trigger)
 *   - Supports suffix (e.g. "+" "%" "Cr")
 *   - Respects prefers-reduced-motion
 *   - Duration: 1500ms (from config)
 */

'use strict';

const Counter = (() => {

  const DURATION = (window.BB_CONFIG && window.BB_CONFIG.animation.counter) || 1500;

  /* -------------------------------------------------------
     ANIMATE A SINGLE COUNTER
     ------------------------------------------------------- */

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.counter) || 0;
    const suffix   = el.dataset.suffix || '';
    const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
    const start    = 0;
    const startTime = performance.now();

    // Easing — ease out cubic
    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(timestamp) {
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOut(progress);
      const current  = start + (target - start) * eased;

      el.textContent = current.toFixed(decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init() {
    const counters = document.querySelectorAll('[data-counter]');

    if (!counters.length) return;

    // Respect reduced motion — just show final value
    if (window.BB?.isReducedMotion && window.BB.isReducedMotion()) {
      counters.forEach(el => {
        const target   = parseFloat(el.dataset.counter) || 0;
        const suffix   = el.dataset.suffix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0;
        el.textContent = target.toFixed(decimals) + suffix;
      });
      return;
    }

    // Use IntersectionObserver to trigger on scroll
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target); // run only once
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold:  0.5,
    });

    counters.forEach(el => {
      // Set initial value
      const suffix = el.dataset.suffix || '';
      el.textContent = '0' + suffix;
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init };

})();

window.BB = window.BB || {};
window.BB.Counter = Counter;
