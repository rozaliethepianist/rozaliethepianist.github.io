/* Review content belongs in content/reviews-settings.js; names stay untranslated. */
(() => {
  'use strict';

  const normalizeLanguage = value => ['cz', 'cs'].includes(value) ? 'cz' : value === 'en' ? 'en' : null;
  const currentLanguage = () => {
    const query = new URL(location.href).searchParams.get('lang');
    let saved;
    try { saved = localStorage.getItem('rozalie-language'); } catch {}
    const browser = navigator.languages?.[0] || navigator.language || 'en';
    return normalizeLanguage(query) || normalizeLanguage(saved) || (browser.toLowerCase().startsWith('cs') ? 'cz' : 'en');
  };
  const localize = value => typeof value === 'string' ? value : value?.[currentLanguage()] || value?.en || '';

  document.querySelectorAll('[data-reviews]').forEach(grid => {
    const render = () => {
      const entries = window.ROZALIE_REVIEWS?.[grid.dataset.reviews] || [];
      const fragment = document.createDocumentFragment();
      for (const entry of entries) {
        const text = localize(entry.text);
        if (!text.trim() || !entry.author?.trim()) continue;
        const block = document.createElement('blockquote');
        block.className = 'review';
        const paragraph = document.createElement('p');
        const author = document.createElement('cite');
        paragraph.textContent = text;
        author.textContent = entry.author;
        author.lang = 'und';
        block.append(paragraph, author);
        fragment.append(block);
      }
      grid.replaceChildren(fragment);
    };
    render();
    new MutationObserver(render).observe(document.documentElement, {attributes: true, attributeFilter: ['lang']});
  });
})();
