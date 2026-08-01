# Biharibuilder — Technology-Enabled Turnkey Construction

## Project Overview
Biharibuilder is a technology-enabled turnkey home construction platform designed to deliver premium, engineering-driven residential and commercial construction from plot to keys.

## Features & Highlights
- **Design System**: Vanilla HTML5, CSS3, and JavaScript modular architecture. No frameworks or third-party dependencies required.
- **Mobile-First & Fully Responsive**: Optimized across break points from 320px to 1600px+.
- **Accessibility**: Built to WCAG 2.1 AA standards with full keyboard support, focus trap, and ARIA landmarks.
- **ASP.NET Core MVC Ready**: Clean component markup and Razor partial view boundary annotations (`<!-- Partial: _Navbar -->`, `<!-- Partial: _Footer -->`, etc.).

## Directory Structure
```
BihariBuilders/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── service-detail.html     # Service detail page
├── projects.html           # Projects portfolio
├── project-detail.html     # Project detail page
├── gallery.html            # Media gallery
├── blog.html               # Article index
├── blog-detail.html        # Article detail page
├── contact.html            # Contact & estimate request
├── privacy-policy.html     # Privacy Policy
├── terms-and-conditions.html # Terms & Conditions
├── 404.html                # Custom 404 Error page
│
├── assets/
│   ├── css/                # Modular CSS architecture
│   ├── js/                 # Feature-based JavaScript modules
│   ├── images/             # Optimized WebP assets by section
│   ├── icons/              # Vector SVG icons
│   ├── fonts/              # Custom web fonts
│   ├── downloads/          # PDFs & brochures
│   └── data/               # Static JSON data
└── favicon/                # Cross-platform icons
```

## Setup & Local Development
Simply open `index.html` in any web browser, or serve using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js npx
npx serve .
```

## CSS Architecture Load Order
1. `variables.css` (Design tokens)
2. `reset.css` (Browser reset)
3. `base.css` (Global styles)
4. `typography.css` (Type scale & headings)
5. `layout.css` (Grids & containers)
6. `utilities.css` (Helper classes)
7. `buttons.css` (Button system)
8. `forms.css` (Inputs & forms)
9. `cards.css` (Card system)
10. `navigation.css` (Navbar & mobile drawer)
11. `footer.css` (Footer component)
12. `components.css` (Widgets & interactive components)
13. `animations.css` (Keyframes & scroll triggers)
14. `responsive.css` (Breakpoint overrides)
15. `style.css` (Master import file)

## License & Copyright
© 2026 Biharibuilder. All rights reserved.
