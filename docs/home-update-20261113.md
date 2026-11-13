# Home and shared UI update — November 13, 2026

Source: rozaliethepianist.github.io(3).zip only. The original archive and its embedded Git metadata were not modified.

- Replace midnight stage surfaces with black on Home, About and Media; the service card returns to charcoal gray. Keep warm backgrounds on other pages.
- Restore the earlier blue #408bb6 and hover #32769d, including direct occurrences, and the earlier warm/blue price-card colors on Lessons.
- Render footer social artwork as CSS masks painted with currentColor, matching the Share glyph and supporting each footer's light/dark context. Source icon files remain untouched.
- Bold the main navigation. Make the Home identity title bold and slightly smaller while retaining Cinzel.
- Replace the hero testimonial and attribution, background card copy, personal introduction, work-card descriptions and newest-videos subtitle. Maintain EN/CZ content definitions and the certificate PDF link. Correct English spelling and grammar without adding claims.
- Remove the introductory subheading and align a mixed-case sans-serif welcome heading with the paragraph's left edge.

Validation: JavaScript syntax checks; content-key checks; desktop Home hero and introduction visually inspected; Home phone frame at 390 CSS px visually inspected with no horizontal overflow. Header and paragraph left edges matched exactly in the inspected desktop layout. Desktop checks on Home, Lessons, About, Media, Contact, Articles, Privacy and Terms found a single shared computed color across all footer icons including Share, and no horizontal overflow. About and Media reported --bg-dark #000; the Home background card reported rgb(41,41,41). Czech rendering checked. Physical-device tests and production deployment were not performed.

Apply every file in the patch at its existing relative path. Updated asset query versions avoid retaining stale shared text, styles or JS in browser caches. No deletion is required.
