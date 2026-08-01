/**
 * config.js
 * Biharibuilder Design System — Application Configuration
 * Version: 1.0
 *
 * Single source of truth for all configurable values.
 * Change values here — never hunt through files.
 *
 * SECURITY NOTE: Phone numbers and business info are public data.
 * Never store API keys, passwords, or sensitive credentials here.
 */

'use strict';

const CONFIG = Object.freeze({

  /* =========================================================
     CONTACT INFORMATION
     ========================================================= */

  phone: {
    display: '+91 62072 59294',      // Shown in UI
    link:    'tel:+91 62072 59294',      // href value
    whatsapp: 'https://wa.me/916207259294', // WhatsApp deep link
    whatsappMessage: 'Hello, I am interested in a free construction estimate.',
  },

  email: {
    info:  'info@biharibuilder.com',
    support: 'support@biharibuilder.com',
  },

  address: {
    line1:   '',              // To be filled from company profile
    line2:   '',
    city:    '',
    state:   'Bihar',
    pincode: '',
    mapsLink: '',
  },

  businessHours: {
    weekdays:  'Mon – Sat',
    hours:     '9:00 AM – 7:00 PM',
    response:  'Response within 8 hours',
  },

  /* =========================================================
     FORMS
     ========================================================= */

  forms: {
    // Google Forms prefilled URL — replace with actual Form ID
    estimateFormUrl: 'https://docs.google.com/forms/d/e/FORM_ID/formResponse',

    // Field entry IDs from Google Forms URL
    // Obtain these by inspecting the pre-filled URL from Google Forms
    fields: {
      name:        'entry.XXXXXXXX',
      phone:       'entry.XXXXXXXX',
      email:       'entry.XXXXXXXX',
      city:        'entry.XXXXXXXX',
      projectType: 'entry.XXXXXXXX',
      budget:      'entry.XXXXXXXX',
      message:     'entry.XXXXXXXX',
    },

    // Future REST API endpoint (ASP.NET Core v2)
    apiEndpoint: '/api/enquiry',

    // Use Google Forms now; switch to 'api' for v2
    mode: 'google_forms',
  },

  /* =========================================================
     ANIMATION TIMINGS
     ========================================================= */

  animation: {
    fast:    150,   // ms
    normal:  250,   // ms
    slow:    400,   // ms
    counter: 1500,  // counter animation duration
    fab:     15000, // FAB pulse interval (15 seconds)
  },

  /* =========================================================
     BREAKPOINTS — mirrors CSS variables
     ========================================================= */

  breakpoints: {
    mobile:  360,
    large:   576,
    tablet:  768,
    desktop: 992,
    laptop:  1200,
    wide:    1440,
  },

  /* =========================================================
     SCROLL THRESHOLDS
     ========================================================= */

  scroll: {
    navSolid:  60,   // px scrolled before navbar turns white
    fabDelay: 1500,  // ms delay before showing FABs on load
  },

  /* =========================================================
     VALIDATION RULES
     ========================================================= */

  validation: {
    nameMin:      2,
    nameMax:    100,
    phoneLength:  10,   // Indian mobile numbers
    messageMax: 1000,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phoneRegex: /^[6-9]\d{9}$/, // Indian mobile format
  },

  /* =========================================================
     MESSAGES — user-facing strings
     ========================================================= */

  messages: {
    formSuccess: {
      title: 'Thank You!',
      body:  'We have received your enquiry and our engineering team will contact you within 8 hours.',
    },
    formError: {
      title:  'Something went wrong.',
      body:   'Please try again or contact us directly on WhatsApp.',
      retry:  'Try Again',
    },
    validation: {
      nameRequired:    'Please enter your full name.',
      nameMinLength:   'Name must be at least 2 characters.',
      phoneRequired:   'Please enter your phone number.',
      phoneInvalid:    'Please enter a valid 10-digit mobile number.',
      emailInvalid:    'Please enter a valid email address.',
      cityRequired:    'Please enter your city.',
      projectRequired: 'Please select a project type.',
    },
  },

  /* =========================================================
     PROJECT TYPES — used in estimate form select dropdown
     ========================================================= */

  projectTypes: [
    'Select Project Type',
    'Residential Construction',
    'Commercial Construction',
    'Villa / Luxury Home',
    'Apartment Building',
    'Renovation / Remodeling',
    'Interior Design',
    'Structural Consultation',
    'Other',
  ],

  /* =========================================================
     BUDGET RANGES
     ========================================================= */

  budgetRanges: [
    'Select Budget Range',
    'Under ₹25 Lakhs',
    '₹25 – ₹50 Lakhs',
    '₹50 – ₹1 Crore',
    '₹1 – ₹2 Crore',
    'Above ₹2 Crore',
    'Not Decided Yet',
  ],

  /* =========================================================
     SOCIAL LINKS
     ========================================================= */

  social: {
    instagram: 'https://instagram.com/biharibuilder',
    facebook:  'https://facebook.com/biharibuilder',
    youtube:   'https://youtube.com/@biharibuilder',
    linkedin:  'https://linkedin.com/company/biharibuilder',
    twitter:   'https://twitter.com/biharibuilder',
  },

  /* =========================================================
     SEO — default meta values
     ========================================================= */

  seo: {
    siteName:    'Biharibuilder',
    defaultTitle: 'Biharibuilder — Technology-Enabled Turnkey Construction',
    defaultDesc:  'India\'s premium technology-enabled construction company. Turnkey home building from plot to keys with engineering excellence and transparent pricing.',
    baseUrl:     'https://www.biharibuilder.com',
    locale:      'en_IN',
    twitterHandle: '@biharibuilder',
  },

});

// Make available globally
window.BB_CONFIG = CONFIG;
