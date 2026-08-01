/**
 * gallery.js
 * Biharibuilder — Gallery Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Gallery grid interaction
 *   - Delegates lightbox viewing to Lightbox module
 */

'use strict';

const Gallery = (() => {

  let galleryItems = [];

  function init(containerSelector = '.gallery-grid') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.card-gallery'));
    if (!cards.length) return;

    galleryItems = cards.map(card => {
      const img = card.querySelector('img');
      return {
        src: card.dataset.full || img?.src || '',
        alt: img?.alt || 'Gallery photo',
        element: card,
      };
    });

    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View image ${index + 1} of ${cards.length} in lightbox`);

      card.addEventListener('click', () => {
        window.BB?.Lightbox?.open(index, galleryItems);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.BB?.Lightbox?.open(index, galleryItems);
        }
      });
    });
  }

  return { init };

})();

window.BB = window.BB || {};
window.BB.Gallery = Gallery;
