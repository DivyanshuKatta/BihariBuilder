/**
 * accordion.js
 * Biharibuilder — FAQ Accordion Module
 * Version: 1.0
 *
 * Responsibilities:
 *   - Toggle FAQ items open/closed
 *   - Only one item open at a time
 *   - Smooth height animation via CSS max-height
 *   - Keyboard accessibility (Enter, Space)
 *   - ARIA attributes (aria-expanded, aria-controls)
 *   - Chevron rotation animation
 */

'use strict';

const Accordion = (() => {

  /* -------------------------------------------------------
     INIT — can be called for multiple accordion instances
     ------------------------------------------------------- */

  function init(containerSelector = '.faq') {
    const containers = document.querySelectorAll(containerSelector);

    containers.forEach(container => {
      const items = container.querySelectorAll('.accordion__item');

      items.forEach((item, index) => {
        const trigger = item.querySelector('.accordion__trigger');
        const content = item.querySelector('.accordion__content');

        if (!trigger || !content) return;

        // Set ARIA attributes
        const contentId = content.id || `accordion-content-${index}`;
        const triggerId = trigger.id || `accordion-trigger-${index}`;

        content.id = contentId;
        trigger.id = triggerId;
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', contentId);
        content.setAttribute('aria-labelledby', triggerId);
        content.setAttribute('role', 'region');

        // Click handler
        trigger.addEventListener('click', () => toggleItem(item, container));

        // Keyboard: Enter and Space
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem(item, container);
          }
        });
      });

      // Open first item by default (optional — remove if all should start closed)
      // openItem(items[0], container);
    });
  }

  /* -------------------------------------------------------
     TOGGLE ITEM
     ------------------------------------------------------- */

  function toggleItem(item, container) {
    const isItemOpen = item.classList.contains('is-open');

    // Close all items in this container
    closeAll(container);

    // If this item was closed, open it
    if (!isItemOpen) {
      openItem(item);
    }
  }

  /* -------------------------------------------------------
     OPEN ITEM
     ------------------------------------------------------- */

  function openItem(item) {
    if (!item) return;

    const trigger = item.querySelector('.accordion__trigger');
    const content = item.querySelector('.accordion__content');

    item.classList.add('is-open');
    trigger?.setAttribute('aria-expanded', 'true');
    content?.classList.add('is-open');
  }

  /* -------------------------------------------------------
     CLOSE ITEM
     ------------------------------------------------------- */

  function closeItem(item) {
    if (!item) return;

    const trigger = item.querySelector('.accordion__trigger');
    const content = item.querySelector('.accordion__content');

    item.classList.remove('is-open');
    trigger?.setAttribute('aria-expanded', 'false');
    content?.classList.remove('is-open');
  }

  /* -------------------------------------------------------
     CLOSE ALL ITEMS IN CONTAINER
     ------------------------------------------------------- */

  function closeAll(container) {
    const items = container?.querySelectorAll('.accordion__item.is-open');
    items?.forEach(closeItem);
  }

  /* -------------------------------------------------------
     DESTROY
     ------------------------------------------------------- */

  function destroy(containerSelector = '.faq') {
    // Clone nodes to remove all event listeners
    const containers = document.querySelectorAll(containerSelector);
    containers.forEach(container => {
      const triggers = container.querySelectorAll('.accordion__trigger');
      triggers.forEach(trigger => {
        const newTrigger = trigger.cloneNode(true);
        trigger.replaceWith(newTrigger);
      });
    });
  }

  /* -------------------------------------------------------
     PUBLIC API
     ------------------------------------------------------- */

  return { init, destroy, openItem, closeItem, closeAll };

})();

window.BB = window.BB || {};
window.BB.Accordion = Accordion;
