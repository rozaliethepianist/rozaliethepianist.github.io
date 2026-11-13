# Rozalie The Pianist - unified color system

**Updated:** 2026-11-13  
**Purpose:** Coordinate site colors with the 17-page press kit, the previous Links composition and floral artwork without changing structural layout or the image assets.

## Color tokens

The **single source of truth** is `static/css/tokens.css`.

| CSS variable | Hex | Purpose |
| --- | --- | --- |
| `--palette-cream` | `#F5ECDE` | Main warm page background |
| `--palette-sand` | `#EAE5DB` | Secondary background; reviews |
| `--palette-ivory` | `#FCF8F1` | Cards, form surfaces and foreground panels |
| `--palette-linen` | `#DECFBD` | Soft panels, light borders and dark-surface copy |
| `--palette-navy` | `#0D1926` | Main text and stage/dark backgrounds |
| `--palette-navy-raised` | `#1C2B3B` | Elevated cards and form fields on dark surfaces |
| `--palette-brown` | `#5C4B46` | Warm dark stage on Piano Lessons |
| `--palette-brown-rich` | `#734F3A` | Featured Links card, warm highlighted accents |
| `--palette-brown-deep` | `#49362E` | Deep warm hover/accent |
| `--palette-gold` | `#B89B6C` | Decorative lines and borders; not small body copy |
| `--palette-gold-light` | `#D2AA76` | Warm rate-card accent |
| `--palette-blue` | `#3A6BB1` | Calls to action, active controls, focus outlines |
| `--palette-blue-hover` | `#2C5387` | Hover and text links |
| `--palette-blue-tint` | `#D9E4F4` | Light blue backgrounds / borders |
| `--palette-white` | `#FFFFFF` | Inverse text on featured/blue surfaces |

Legacy component variables, such as `--bg-light`, `--bg-dark`, `--blue`, `--brown` and `--surface-card-light`, remain supported as semantic aliases. Alter a brand color in `tokens.css` to apply it to all dependent elements; page-specific background roles remain assigned in individual page stylesheets.

## Page treatment

- **Home:** Cream/ivory foreground on a dark navy stage; blue CTAs; floral images untouched.
- **Piano Lessons:** Cream paper and warm brown contrast plane; neutral/gold in-person rate cards; blue-tinted online cards.
- **About & Media:** Midnight navy stage, cream bands, cream readable copy, and warm decorative accents.
- **Contact:** Cream page and ivory form containers with blue controls.
- **Links:** Existing curved cards, translucent paper and gradient retained; shared navy ink, deep brown featured card and blue focus/actions.
- **Articles, Privacy, Terms, 404, and in-progress:** Same warm paper and navy text roles. Unused/redirected Adviser CSS is also aligned to the shared palette.

## Scope and implementation

- Updated shared tokens and hardcoded color references in theme CSS.
- Added the shared token stylesheet to `/links/` and `/in-progress/`, which previously defined separate palettes.
- Updated CSS URLs with `?v=palette-20261113` to reduce cached-style conflicts after deployment.
- Harmonized mobile header/navigation, cards, light/dark sections, article/legal pages, form shells, rate cards and hover/focus states.
- Preserved all original floral illustrations, photography, logos, press kit, SVG certification badges, site copy, navigation and JavaScript behavior.
- Retained white/inverse text on dark and blue buttons, YouTube's recognizable red branding, white QR-code grounds, and functional dark/light image masks.

## Contrast checks

- Navy `#0D1926` on cream `#F5ECDE`: **15.15:1**.
- White on CTA blue `#3A6BB1`: **5.36:1**.
- White on featured brown `#734F3A`: **7.22:1**.
- Navy on gold-light `#D2AA76`: comfortable contrast for rate-card labels.

## Visual QA performed

Static-page preview in headless Chromium with site assets and scripts loaded: **390 px**, **768 px**, **1440 px**, and **1920 px** viewport widths. Primary pages Home, Piano Lessons, About, Media, Contact and Links were reviewed at desktop/mobile sizes; Articles, Privacy, Terms, 404 and in-progress at additional sizes. Checked horizontal overflow and JavaScript page errors. A few 1920px supplemental screenshots could not be completed due to the renderer timeout; core wide-screen pages completed successfully.

**External form limitation:** The embedded Notion contact form is cross-origin. Its exterior colors and framing are styled here, but the Notion form's internal design is owned by Notion and cannot be changed by local CSS. Do not modify iframe filter/functionality merely to match the palette.

## Design intent

The dark stage is **navy rather than pure black**; warm paper is **cream rather than pure white**. Brown anchors the teaching and press-kit identity, while blue is restricted to action and occasional floral accents. Keep gradients light and translucent to protect readable contrast. Maintain decorative flower assets at their original colors.
