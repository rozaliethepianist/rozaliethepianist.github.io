// Compatibility bridge. New pages load content/site-texts.js and static/js/content.js.
window.rozalieCzech ||= Object.fromEntries(Object.values(window.ROZALIE_CONTENT || {}).map(text => [text.en, text.cz || text.en]));
