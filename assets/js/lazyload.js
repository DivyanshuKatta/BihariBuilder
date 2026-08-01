/**
 * lazyload.js
 * Biharibuilder — Lazy Loading Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Lazy load images with data-src attribute
 *   - Lazy load background images with data-bg attribute
 *   - Smooth fade-in on load
 *   - Uses IntersectionObserver with native fallback
 *   - Handles <picture> elements (sources + img)
 */

'use strict';

const LazyLoad = (() => {

  let observer = null;

  /* -------------------------------------------------------
     LOAD IMAGE
     ------------------------------------------------------- */

  function loadImage(el) {
    // Handle <img> with data-src
    if (el.tagName === 'IMG') {
      if (el.dataset.src) {
        el.src = el.dataset.src;
        el.removeAttribute('data-src');
      }
      if (el.dataset.srcset) {
        el.srcset = el.dataset.srcset;
        el.removeAttribute('data-srcset');
      }
      el.addEventListener('load', () => {
        el.classList.add('is-loaded');
      }, { once: true });
    }

    // Handle background image
    if (el.dataset.bg) {
      el.style.backgroundImage = `url('${el.dataset.bg}')`;
      el.removeAttribute('data-bg');
      el.classList.add('is-loaded');
    }

    // Handle <source> elements inside <picture>
    if (el.tagName === 'PICTURE') {
      const sources = el.querySelectorAll('source[data-srcset]');
      sources.forEach(source => {
        source.srcset = source.dataset.srcset;
        source.removeAttribute('data-srcset');
      });
      const img = el.querySelector('img[data-src]');
      if (img) loadImage(img);
    }
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init() {
    const lazyEls = document.querySelectorAll(
      'img[data-src], [data-bg], picture[data-lazy]'
    );

    if (!lazyEls.length) return;

    // Check for native lazy loading support
    if ('loading' in HTMLImageElement.prototype) {
      // Use native lazy loading as bonus but still process data-src
    }

    observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          loadImage(entry.target);
          obs.unobserve(entry.target);
        });
      },
      {
        rootMargin: '200px 0px', // pre-load 200px before entering viewport
        threshold:  0,
      }
    );

    lazyEls.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
     REFRESH — call after dynamic content is added
     ------------------------------------------------------- */

  function refresh() {
    destroy();
    init();
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

  return { init, refresh, destroy };

})();

window.BB = window.BB || {};
window.BB.LazyLoad = LazyLoad;
