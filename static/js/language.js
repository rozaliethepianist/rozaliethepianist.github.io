/* URL choice wins over remembered choice and browser language. */
(() => {
 'use strict';
 const current = new URL(location.href);
 const normalize = value => value === 'cs' || value === 'cz' ? 'cz' : value === 'en' ? 'en' : null;
 let saved;
 try { saved = normalize(localStorage.getItem('rozalie-language')); } catch {}
 const browser = (navigator.languages?.[0] || navigator.language || 'en').toLowerCase();
 const language = normalize(current.searchParams.get('lang')) || saved || (browser.startsWith('cs') ? 'cz' : 'en');
 current.searchParams.set('lang', language);
 history.replaceState(history.state, '', current.href);
 document.documentElement.lang = language === 'cz' ? 'cs' : 'en';
 const dictionary = new Map(Object.entries(window.rozalieCzech || {}).map(([key,value]) => [key.replace(/\s+/g,' ').trim().toLowerCase(),value]));
 const translate = text => {
   const key = text.replace(/\s+/g,' ').trim().toLowerCase();
   const value = dictionary.get(key);
   if (value) return text.replace(/\S[\s\S]*\S|\S/, value);
   if (text.startsWith('Play on YouTube:')) return text.replace('Play on YouTube:', 'Přehrát na YouTube:');
   if (text.startsWith('Enlarge photo:')) return 'Zvětšit fotografii: ' + translate(text.slice('Enlarge photo:'.length).trim());
   if (text.endsWith(' (opens in a new tab)')) return text.replace(' (opens in a new tab)', ' (otevře se v nové kartě)');
   return text;
 };
 const localizeLink = link => {
   const raw = link.getAttribute('href');
   if (!raw || raw.startsWith('#') || link.closest('.language-switch') || link.hasAttribute('download') || link.hasAttribute('data-press-kit')) return;
   const destination = new URL(raw, location.href);
   if (destination.origin !== location.origin || /\.[a-z0-9]+$/i.test(destination.pathname)) return;
   destination.searchParams.set('lang', language);
   const href = destination.pathname + destination.search + destination.hash;
   if (raw !== href) link.setAttribute('href', href);
 };
 const process = root => {
   if (root.nodeType === Node.TEXT_NODE) {
     if (language === 'cz' && !root.parentElement?.closest('script,style,.language-switch,textarea,input')) {
       const value = translate(root.data);if (value !== root.data) root.data = value;
     }
     return;
   }
   if (root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
   if (root.nodeType === Node.ELEMENT_NODE && root.matches('script,style,.language-switch')) return;
   if (root.nodeType === Node.ELEMENT_NODE) {
     if (language === 'cz') for (const name of ['aria-label','alt','title','placeholder']) {
       const value = root.getAttribute(name);
       if (value && translate(value) !== value) root.setAttribute(name,translate(value));
     }
     if (root.matches('a[href]')) localizeLink(root);
     if (language === 'cz' && root.matches('meta[name="description"]')) root.content = translate(root.content);
   }
   for (const node of [...root.childNodes]) process(node);
 };
 const makeSwitch = () => {
   const span = document.createElement('span');span.className='language-switch';span.setAttribute('aria-label',language === 'cz' ? 'Jazyk' : 'Language');
   for (const [index,code] of ['en','cz'].entries()) {
     if (index) { const separator=document.createElement('span');separator.textContent=' | ';separator.setAttribute('aria-hidden','true');span.append(separator); }
     const link=document.createElement('a');const target=new URL(location.href);target.searchParams.set('lang',code);link.href=target.pathname+target.search+target.hash;link.textContent=code.toUpperCase();link.hreflang=code==='cz'?'cs':'en';link.lang=link.hreflang;
     link.setAttribute('aria-label',code==='cz'?'Čeština':'English');
     if (code === language) { link.className='is-active';link.setAttribute('aria-current','true'); }
     link.addEventListener('click',()=>{try{localStorage.setItem('rozalie-language',code);}catch{}});
     span.append(link);
   }
   return span;
 };
 document.querySelector('.header-inner')?.append(makeSwitch());
 document.querySelector('.footer-social')?.append(makeSwitch());
 const headerLanguage = document.querySelector('.header-inner > .language-switch');
 const updateHeroOverlap = () => {
   if (!headerLanguage) return;
   const r = headerLanguage.getBoundingClientRect();
   const photo = document.querySelector('.home-hero-photo,.lessons-hero-photo,.adviser-hero-photo,.contact-photo-c5');
   const p = photo?.getBoundingClientRect();
   headerLanguage.classList.toggle('is-over-hero', !!p && r.left < p.right && r.right > p.left && r.top < p.bottom && r.bottom > p.top);
   requestAnimationFrame(() => {
    headerLanguage.classList.add('is-positioned');
  });
 };
 new ResizeObserver(updateHeroOverlap).observe(document.documentElement);
 window.addEventListener('resize',updateHeroOverlap,{passive:true});
 document.fonts.ready.then(updateHeroOverlap);
 updateHeroOverlap();
 process(document);
 new MutationObserver(records => {
   for (const record of records) {
     if (record.type === 'childList') record.addedNodes.forEach(process);
     else process(record.target);
   }
 }).observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','alt','title','placeholder','href']});
})();
