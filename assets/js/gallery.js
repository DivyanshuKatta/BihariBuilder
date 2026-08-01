/**
 * gallery.js
 * Biharibuilder — Gallery & Lightbox Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Gallery grid initialization
 *   - Lightbox open/close
 *   - Keyboard navigation (arrow keys, Escape)
 *   - Touch swipe support
 *   - ARIA attributes
 *   - Focus management
 */

'use strict';

const Gallery = (() => {

  let lightbox   = null;
  let lightboxImg = null;
  let prevBtn    = null;
  let nextBtn    = null;
  let closeBtn   = null;
  let items      = [];
  let currentIdx = 0;
  let touchStartX = 0;

  /* -------------------------------------------------------
     BUILD LIGHTBOX
     ------------------------------------------------------- */

  function buildLightbox() {
    if (document.querySelector('.lightbox')) return;

    lightbox = document.createElement('div');
    lightbox.className   = 'lightbox';
    lightbox.id          = 'gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image gallery');
    lightbox.setAttribute('aria-hidden', 'true');

    lightbox.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Close gallery">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="lightbox__prev" type="button" aria-label="Previous image">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="lightbox__image-wrap">
        <img class="lightbox__image" src="" alt="Gallery image" loading="eager" />
      </div>
      <button class="lightbox__next" type="button" aria-label="Next image">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;

    document.body.appendChild(lightbox);

    // Cache elements
    lightboxImg = lightbox.querySelector('.lightbox__image');
    prevBtn     = lightbox.querySelector('.lightbox__prev');
    nextBtn     = lightbox.querySelector('.lightbox__next');
    closeBtn    = lightbox.querySelector('.lightbox__close');

    // Events
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Touch swipe
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    document.addEventListener('keydown', handleKeydown);
  }

  /* -------------------------------------------------------
     OPEN LIGHTBOX
     ------------------------------------------------------- */

  function openLightbox(index) {
    if (!lightbox) buildLightbox();

    currentIdx = index;
    updateLightboxImage();

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open'); // reuse scroll lock

    // Focus close button
    setTimeout(() => closeBtn?.focus(), 100);

    // Show/hide nav buttons
    prevBtn.style.display = items.length <= 1 ? 'none' : '';
    nextBtn.style.display = items.length <= 1 ? 'none' : '';
  }

  /* -------------------------------------------------------
     CLOSE LIGHTBOX
     ------------------------------------------------------- */

  function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');

    // Return focus to triggering element
    const triggerEl = items[currentIdx];
    triggerEl?.focus();
  }

  /* -------------------------------------------------------
     NAVIGATE
     ------------------------------------------------------- */

  function navigate(direction) {
    currentIdx = (currentIdx + direction + items.length) % items.length;
    updateLightboxImage();
  }

  /* -------------------------------------------------------
     UPDATE IMAGE
     ------------------------------------------------------- */

  function updateLightboxImage() {
    const item    = items[currentIdx];
    const imgEl   = item?.querySelector('img');
    const fullSrc = item?.dataset.full || imgEl?.src || '';
    const altText = imgEl?.alt || `Gallery image ${currentIdx + 1}`;

    if (lightboxImg) {
      lightboxImg.src = fullSrc;
      lightboxImg.alt = altText;
    }

    // Update counter if exists
    const counter = lightbox?.querySelector('.lightbox__counter');
    if (counter) counter.textContent = `${currentIdx + 1} / ${items.length}`;
  }

  /* -------------------------------------------------------
     KEYBOARD HANDLER
     ------------------------------------------------------- */

  function handleKeydown(e) {
    if (!lightbox?.classList.contains('is-open')) return;

    switch (e.key) {
      case 'Escape':    e.preventDefault(); closeLightbox(); break;
      case 'ArrowLeft': e.preventDefault(); navigate(-1);    break;
      case 'ArrowRight':e.preventDefault(); navigate(1);     break;
    }
  }

  /* -------------------------------------------------------
     INIT
     ------------------------------------------------------- */

  function init(containerSelector = '.gallery-grid') {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    items = Array.from(container.querySelectorAll('.card-gallery'));
    if (!items.length) return;

    buildLightbox();

    items.forEach((item, index) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image ${index + 1} of ${items.length} in lightbox`);

      item.addEventListener('click', () => openLightbox(index));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });
    });
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy() {
    document.removeEventListener('keydown', handleKeydown);
    lightbox?.remove();
    lightbox = null;
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy, openLightbox, closeLightbox };

})();

window.BB = window.BB || {};
window.BB.Gallery = Gallery;
