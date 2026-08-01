/**
 * hero.js
 * Biharibuilder — Hero Section Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Hero background entry animations
 *   - Scroll indicator click behavior
 *   - Hero form interactions
 */

'use strict';

const Hero = (() => {

  function init() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const nextSection = document.querySelector('section:nth-of-type(2)');
        if (nextSection && window.BB?.scrollToElement) {
          window.BB.scrollToElement(nextSection);
        }
      });
    }
  }

  return { init };

})();

window.BB = window.BB || {};
window.BB.Hero = Hero;
