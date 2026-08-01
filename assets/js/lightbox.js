/**
 * lightbox.js
 * Biharibuilder — Lightbox Component Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Dedicated Lightbox overlay management
 *   - Used by gallery.js and project detail views
 *   - Touch gestures & keyboard controls
 */

'use strict';

const Lightbox = (() => {

  let lightboxEl  = null;
  let imageEl     = null;
  let prevBtn     = null;
  let nextBtn     = null;
  let closeBtn    = null;
  let itemsList   = [];
  let currentIndex = 0;
  let touchStartX  = 0;

  function build() {
    if (document.querySelector('.lightbox')) return;

    lightboxEl = document.createElement('div');
    lightboxEl.className = 'lightbox';
    lightboxEl.id = 'bb-lightbox';
    lightboxEl.setAttribute('role', 'dialog');
    lightboxEl.setAttribute('aria-modal', 'true');
    lightboxEl.setAttribute('aria-label', 'Image preview');
    lightboxEl.setAttribute('aria-hidden', 'true');

    lightboxEl.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Close lightbox">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="lightbox__prev" type="button" aria-label="Previous image">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <div class="lightbox__image-wrap">
        <img class="lightbox__image" src="" alt="Enlarged view" loading="eager" />
      </div>
      <button class="lightbox__next" type="button" aria-label="Next image">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    `;

    document.body.appendChild(lightboxEl);

    imageEl  = lightboxEl.querySelector('.lightbox__image');
    prevBtn  = lightboxEl.querySelector('.lightbox__prev');
    nextBtn  = lightboxEl.querySelector('.lightbox__next');
    closeBtn = lightboxEl.querySelector('.lightbox__close');

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => navigate(-1));
    nextBtn.addEventListener('click', () => navigate(1));

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) close();
    });

    lightboxEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    lightboxEl.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        navigate(diff > 0 ? 1 : -1);
      }
    }, { passive: true });

    document.addEventListener('keydown', handleKeydown);
  }

  function open(index, items) {
    if (!lightboxEl) build();
    itemsList = items || [];
    currentIndex = index;
    updateImage();

    lightboxEl.classList.add('is-open');
    lightboxEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');

    setTimeout(() => closeBtn?.focus(), 100);

    const hasMultiple = itemsList.length > 1;
    if (prevBtn) prevBtn.style.display = hasMultiple ? '' : 'none';
    if (nextBtn) nextBtn.style.display = hasMultiple ? '' : 'none';
  }

  function close() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('is-open');
    lightboxEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
  }

  function navigate(direction) {
    if (!itemsList.length) return;
    currentIndex = (currentIndex + direction + itemsList.length) % itemsList.length;
    updateImage();
  }

  function updateImage() {
    const item = itemsList[currentIndex];
    if (!item) return;

    const fullSrc = item.src || item.dataset?.full || '';
    const altText = item.alt || 'Gallery Preview';

    if (imageEl) {
      imageEl.src = fullSrc;
      imageEl.alt = altText;
    }
  }

  function handleKeydown(e) {
    if (!lightboxEl?.classList.contains('is-open')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); navigate(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); navigate(1); }
  }

  return { open, close, navigate };

})();

window.BB = window.BB || {};
window.BB.Lightbox = Lightbox;
