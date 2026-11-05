# Rozálie Stoklasová — static website

Responsive, static HTML/CSS/JavaScript implementation based on the supplied five-page Canva/PDF design. The layout uses selected images and vector assets extracted from that PDF, not full-page screenshots. All website copy and source comments are in English.

## Files

```text
index.html                            Home
about/index.html                      About / biography / video gallery
piano-lessons/index.html              Teaching, rates, reviews
dutch-study-adviser/index.html         Dutch study adviser
contact/index.html                    Contact (visual form only)
privacy-policy/index.html             Clearly marked legal-text placeholder
terms-of-service/index.html           Clearly marked legal-text placeholder
articles/mental-piano-practice/index.html  Clearly marked article placeholder
static/css/site.css                   One shared stylesheet
static/js/site.js                     Shared header, navigation, footer, social links,
                                      contact form markup and interactions
static/image/photos/                  Photos and page-specific imagery (WebP)
static/image/decor/                   Floral/decorative imagery (WebP)
static/image/icons/                   Extracted logo and icons (SVG)
static/image/video/                   Video thumbnail (WebP)
static/favicon/                       Favicons
static/videos/                        Reserved for any future self-hosted videos
```

## Open and deploy

Deploy the **contents** of this folder to the web root of any static host, such as Cloudflare Pages, GitHub Pages on a custom domain, or Netlify. A root `index.html` is present, and each internal page has a corresponding `<slug>/index.html`.

For a local preview from the parent directory:

```sh
cd rozalie-website
python -m http.server 8000
```

Then open `http://localhost:8000/`. If deployed at a subdirectory, relative links and shared JavaScript resolve relative to `static/js/site.js`.

## Shared content / maintenance

* `static/js/site.js` is the single place to edit **navigation**, **header logo**, **copyright/footer**, **social profile URLs**, **contact form fields**, **contact email**, and the **YouTube video ID**. Shared elements are inserted into page placeholders (`data-site-header`, `data-social-rail`, `data-site-footer`, `data-contact-form`).
* `static/css/site.css` contains global colors, typography, breakpoints, layout primitives, page-specific styling, and component styling.
* Header logo SVGs `static/image/icons/logo-dark.svg` and `logo-cream.svg` contain **filled paths without SVG `stroke` attributes**, as requested.
* The main YouTube video ID is `S_CacDghMmc`, linked inside the supplied PDF. The same video is used for multiple thumbnails because no distinct links were provided.
* A publicly available press-kit PDF link is configured centrally in `site.js`. It may change; update `pressKitUrl` when necessary.

## Features working now

* Internal navigation between all pages; smooth in-page links and visible active page indicator.
* Responsive header with keyboard-friendly mobile menu (Escape dismisses).
* Offer buttons link to their pages; lesson purchase CTAs route to contact with interest pre-selected (no payment checkout was supplied).
* Video preview buttons open a single YouTube-nocookie embedded video in a dialog. Escape, close button and outside click dismiss the dialog, and the iframe is cleared when closed.
* Email link and known YouTube/press-kit destinations.
* Functional, intentionally disabled-submission contact form preview: clicking its button explains that submission is not connected.
* Privacy Policy, Terms of Service and Mental Piano Practice links resolve to clearly marked placeholder pages, rather than broken routes.

## Missing details before public launch

1. **No contact backend:** integrate a form endpoint, email service or serverless function, enable HTML5/JS validation, and add spam protection if required.
2. **No payment gateway:** "Buy now" buttons currently send visitors to the contact form; connect checkout links when ready.
3. **Social URLs missing in the source:** Instagram, Facebook and LinkedIn buttons explain that no verified URL was supplied rather than linking to a possibly unrelated person. Set their URLs under `settings.socialLinks`.
4. **Policy and article placeholders:** supply approved Privacy Policy, Terms of Service, and Mental Piano Practice article content before publishing. These pages are marked `noindex` for now.
5. **Dutch study adviser detailed content:** the supplied PDF has only a hero composition and mostly empty page; the implementation preserves this instead of inventing a service description or rates.
6. **Actual videos:** the supplied PDF linked just one unique YouTube ID; optionally update each thumbnail when distinct source videos are available.

## Optimization / browsers

* Photos and decorations are compressed WebP; logos and icons are SVG; responsive dimensions are set to minimize layout shift.
* Below-the-fold images use native `loading="lazy"`.
* The site requires no frameworks, package manager, runtime API, or client-side router.
* Page-specific content is in semantic HTML. Shared site components require JavaScript; keep JS enabled in the browser.
* Google Fonts are optional remote requests; CSS provides fallbacks when unavailable.
* Tested using Chromium at desktop 1440 px and mobile 390 px, including menu, video dialog, contact preview and internal-path checks.
