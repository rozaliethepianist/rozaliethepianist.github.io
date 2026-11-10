/* Register Q&A copy with the existing content and language system. */
(() => {
 'use strict';
 const section = document.querySelector('.lessons-faq');
 if (!section) return;
 const settings = window.ROZALIE_QA || {};
 const catalogue = window.ROZALIE_CONTENT || (window.ROZALIE_CONTENT = {});
 const localized = value => {
   const en = typeof value?.en === 'string' ? value.en.trim() : '';
   const cz = typeof value?.cz === 'string' ? value.cz.trim() : '';
   return {en:en || cz, cz:cz || en};
 };
 const items = (Array.isArray(settings.items) ? settings.items : []).map(item => ({question:localized(item?.question),answer:localized(item?.answer)})).filter(item => item.question.en && item.answer.en);
 section.hidden = !items.length;
 const title = section.querySelector('[data-qa-title]');
 const grid = section.querySelector('[data-qa-items]');
 if (!title || !grid) return;
 catalogue.qa_heading_elocd = localized(settings.title);
 title.dataset.content = 'qa_heading_elocd';
 const fragment = document.createDocumentFragment();
 items.forEach((item,index) => {
   const article = document.createElement('article');article.className = 'lessons-faq-item';
   for (const [field,tag] of [['question','h3'],['answer','p']]) {
     const key = `qa_item_${index}_${field}_oyezf`;
     catalogue[key] = item[field];
     const element = document.createElement(tag),text = document.createElement('span');
     text.dataset.content = key;element.append(text);article.append(element);
   }
   fragment.append(article);
 });
 grid.replaceChildren(fragment);
})();
