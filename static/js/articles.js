/* Article catalogue and local PDF opening with a blocked-window download fallback. */
(() => {
  'use strict';
  Object.assign(window.rozalieCzech ||= {}, {
    'My Articles': 'Moje Práce',
    'Articles': 'Práce',
    'Articles | Rozálie Stoklasová': 'Práce | Rozálie Stoklasová',
    'Sight reading': 'Čtení z listu',
    'Check my other articles': 'Prohlédnout další práce',
    'About piano teaching and musical education.': 'O výuce klavíru a hudebním vzdělávání.',
    'Open PDF': 'Otevřít PDF',
    'Read article': 'Přečíst práci',
    'PDF opens in a new tab. If the new tab is blocked, the file will download.': 'PDF se otevře na nové kartě. Pokud je otevření zablokováno, soubor se stáhne.',
    'No articles are currently available.': 'Momentálně nejsou k dispozici žádné práce.'
  });
  // Register article translations from the editable catalogue before language.js runs.
  for (const article of Array.isArray(window.ROZALIE_ARTICLES) ? window.ROZALIE_ARTICLES : []) {
    for (const field of ['title', 'description']) {
      const english = article[field];
      const czech = article[`${field}Cz`];
      if (typeof english === 'string' && english.trim()) {
        window.rozalieCzech[english] = typeof czech === 'string' && czech.trim() ? czech : english;
      }
    }
  }
  const list = document.querySelector('[data-articles-list]');
  if (list && Array.isArray(window.ROZALIE_ARTICLES)) {
    list.replaceChildren();
    for (const article of window.ROZALIE_ARTICLES) {
      let url;
      try { url = new URL(article.url, location.href); } catch { continue; }
      const pdf = article.type === 'pdf';
      if (!article.title || !['pdf', 'external'].includes(article.type)) continue;
      if (pdf ? url.origin !== location.origin || !/\.pdf$/i.test(url.pathname) : url.protocol !== 'https:') continue;
      const item = document.createElement('li'); item.className = 'article-entry';
      const heading = document.createElement('h2'); heading.textContent = article.title;
      item.append(heading);
      if (article.description) { const p = document.createElement('p'); p.textContent = article.description; item.append(p); }
      const link = document.createElement('a'); link.className = 'button button-primary';
      link.href = url.href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      link.textContent = pdf ? 'Open PDF' : 'Read article';
      if (pdf) link.dataset.articlePdf = '';
      item.append(link); list.append(item);
    }
    if (!list.children.length) { const item = document.createElement('li'); item.textContent = 'No articles are currently available.'; list.append(item); }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-article-pdf]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || !/\.pdf$/i.test(url.pathname)) return;
    event.preventDefault();
    const download = () => {
      const anchor = document.createElement('a'); anchor.href = url.href;
      anchor.download = decodeURIComponent(url.pathname.split('/').pop());
      document.body.append(anchor); anchor.click(); anchor.remove();
    };
    let popup;
    try {
      popup = window.open('about:blank', '_blank');
      if (!popup || popup.closed) { download(); return; }
      popup.opener = null; popup.location.replace(url.href);
    } catch { popup?.close(); download(); }
  });
})();
