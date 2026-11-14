// Compatibility bridge. New pages load content/shared.js plus page content modules and static/js/content.js.
window.rozalieCzech ||= Object.fromEntries(Object.values(window.ROZALIE_CONTENT || {}).map(text => [text.en, text.cz || text.en]));
