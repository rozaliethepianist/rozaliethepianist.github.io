/* Build event lists before the existing content and language scripts run. */
(() => {
 'use strict';
 const catalogue = window.ROZALIE_CONTENT || (window.ROZALIE_CONTENT = {});
 const localize = value => {
   const en = typeof value?.en === 'string' ? value.en.trim() : '';
   const cz = typeof value?.cz === 'string' ? value.cz.trim() : '';
   return {en:en || cz,cz:cz || en};
 };
 for (const group of ['past','upcoming']) {
   const target = document.querySelector(`[data-events-list="${group}"]`);
   const title = document.querySelector(`[data-events-title="${group}"]`);
   if (!target || !title) continue;
   const data = window.ROZALIE_EVENTS?.[group] || {};
   const titleKey = `events_${group}_title`;
   catalogue[titleKey] = localize(data.title);title.dataset.content = titleKey;
   const fragment = document.createDocumentFragment();
   for (const [index,item] of (Array.isArray(data.items) ? data.items : []).entries()) {
     const heading = localize(item?.heading);
     if (!heading.en) continue;
     const article = document.createElement('article');
     const append = (tag,text,key) => {
       catalogue[key] = text;
       const element = document.createElement(tag),span = document.createElement('span');
       span.dataset.content = key;element.append(span);article.append(element);
     };
     append('strong',heading,`events_${group}_${index}_heading`);
     const paragraphs = Array.isArray(item.paragraphs) ? item.paragraphs : [];
     paragraphs.forEach((value,paragraphIndex) => {
       const text = localize(value);
       if (text.en) append('p',text,`events_${group}_${index}_paragraph_${paragraphIndex}`);
     });
     fragment.append(article);
   }
   target.replaceChildren(fragment);
 }
})();
