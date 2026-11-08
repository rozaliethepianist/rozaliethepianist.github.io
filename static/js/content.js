/* Populate keyed copy before shared UI and language handling run. */
(() => {
 'use strict';
 const catalogue = window.ROZALIE_CONTENT || {};
 const resolve = (id, language, parents = []) => {
   if (parents.includes(id)) throw new Error(`Circular content reference: ${id}`);
   const entry = catalogue[id];
   if (!entry) throw new Error(`Unknown content key: ${id}`);
   return (entry[language] || entry.en || '').replace(/\{\{([a-z0-9_]+)\}\}/g, (_, child) => resolve(child, language, [...parents, id]));
 };
 window.rozalieCzech = Object.fromEntries(Object.keys(catalogue).filter(id => !id.startsWith('price_')).map(id => [resolve(id, 'en'), resolve(id, 'cz')]));
 const query = new URL(location.href).searchParams.get('lang');
 let saved; try { saved = localStorage.getItem('rozalie-language'); } catch {}
 const normalize = value => ['cz','cs'].includes(value) ? 'cz' : value === 'en' ? 'en' : null;
 const browser = navigator.languages?.[0] || navigator.language || 'en';
 const lang = normalize(query) || normalize(saved) || (browser.toLowerCase().startsWith('cs') ? 'cz' : 'en');
 const text = id => resolve(id, lang);
 const apply = root => {
   if (root.nodeType !== 1 && root.nodeType !== 9) return;
   const elements = [...(root.matches?.('[data-content],[data-content-attrs]') ? [root] : []), ...root.querySelectorAll('[data-content],[data-content-attrs]')];
   for (const element of elements) {
     if (element.dataset.content) { const value = text(element.dataset.content); if (element.textContent !== value) element.textContent = value; }
     if (element.dataset.contentAttrs) for (const [attribute, id] of Object.entries(JSON.parse(element.dataset.contentAttrs))) {
       const value = text(id); if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
     }
   }
 };
 window.rozalieContentApply = apply;
 apply(document);
 new MutationObserver(records => { for (const record of records) for (const node of record.addedNodes) apply(node); }).observe(document.body, {childList:true,subtree:true});
})();
