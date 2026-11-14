/* Standalone link hub. No analytics, embedded players or external QR services. */
(() => {
 'use strict';
 const settings=window.ROZALIE_LINKS;
 if (!settings) return;
 const normalize=value=>['cs','cz'].includes(value)?'cz':value==='en'?'en':null;
 const current=new URL(location.href);let saved;try{saved=localStorage.getItem('rozalie-language')}catch{}
 const language=normalize(current.searchParams.get('lang'))||normalize(saved)||((navigator.languages?.[0]||navigator.language||'en').toLowerCase().startsWith('cs')?'cz':'en');
 current.searchParams.set('lang',language);history.replaceState(null,'',current.pathname+current.search+current.hash);document.documentElement.lang=language==='cz'?'cs':'en';
 const localized=value=>typeof value==='string'?value:value?.[language]||value?.en||'';
 const copy=key=>localized(settings.copy[key]);
 document.querySelectorAll('[data-copy]').forEach(node=>node.textContent=copy(node.dataset.copy));
 document.querySelector('h1').textContent=settings.name;document.title=(language==='cz'?'Rozcestník':'Links')+' | Rozalie The Pianist';
 const portrait=document.querySelector('.portrait');portrait.src=settings.portrait;
 portrait.alt=language==='cz'?'Rozálie Stoklasová u koncertního křídla':'Rozálie Stoklasová at a grand piano';
 document.querySelectorAll('[data-lang]').forEach(link=>{const target=new URL(location.href);target.searchParams.set('lang',link.dataset.lang);link.href=target.pathname+target.search;if(link.dataset.lang===language)link.setAttribute('aria-current','true');link.addEventListener('click',()=>{try{localStorage.setItem('rozalie-language',link.dataset.lang)}catch{}})});
 const root=document.querySelector('#link-groups'),dialog=document.querySelector('#qr-dialog');let active=null,previousFocus;
 const svgIcon="<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"4\" y=\"4\" width=\"6\" height=\"6\" rx=\"1.4\"/><rect x=\"14\" y=\"4\" width=\"6\" height=\"6\" rx=\"1.4\"/><rect x=\"4\" y=\"14\" width=\"6\" height=\"6\" rx=\"1.4\"/><circle cx=\"7\" cy=\"7\" r=\"0.9\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"17\" cy=\"7\" r=\"0.9\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"7\" cy=\"17\" r=\"0.9\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M14 17v-3h3M14 20h1M17 17h3v3\"/><circle cx=\"20\" cy=\"14\" r=\"0.9\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"17.5\" cy=\"20\" r=\"0.8\" fill=\"currentColor\" stroke=\"none\"/></svg>",externalIcon="<svg width=\"24\" height=\"24\" viewBox=\"0 0 384 384\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M12 0H127L191 64H64V320H320V194L384 258V372Q384 384 372 384H12Q0 384 0 372V12Q0 0 12 0Z\"/><path d=\"M220 0H372Q384 0 384 12V164L329 109Q325 105 321 109L169 261Q165 265 161 261L124 224Q120 220 124 216L276 64Q280 60 276 56Z\"/></svg>";
 const absolute=url=>new URL(url,settings.siteOrigin).href;
 const destination=item=>{const url=new URL(item.url,location.origin);if(url.origin===location.origin&&!/\.pdf$/i.test(url.pathname))url.searchParams.set('lang',language);return url.href};
 const valid=item=>{try{const url=new URL(item.url,settings.siteOrigin);return /^[a-z0-9-]+$/.test(item.id)&&url.protocol==='https:'&&localized(item.title)}catch{return false}};
 function icon(kind){const el=document.createElement('span');el.className='link-icon';if(['instagram','youtube','facebook','linkedin'].includes(kind)){const img=document.createElement('img');img.src=`/static/image/icons/${kind}.svg`;img.alt='';el.append(img)}else{if(kind==='web'){const img=document.createElement('img');img.src='/static/image/icons/website.svg';img.alt='';el.append(img)}else el.textContent={pdf:'EPK',mail:'✉'}[kind]||'';if(kind==='pdf')el.classList.add('link-icon--pdf');el.classList.add('link-icon--label')}return el}
 function showQr(id,url,title){
  let svg;try{svg=window.RozalieQR.svg(url)}catch(error){alert(error.message);return}
  previousFocus=document.activeElement;if(active)URL.revokeObjectURL(active.imageUrl);
  active={id,url,title,imageUrl:URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}))};
  document.querySelector('#qr-heading').textContent=title;document.querySelector('#qr-url').textContent=url;
  document.querySelector('#qr-image').src=active.imageUrl;document.querySelector('#qr-status').textContent='';
  document.body.classList.add('modal-open');dialog.showModal();document.querySelector('#qr-close').focus();
 }

 for(const group of ['explore','connect']){const items=settings.links.filter(item=>item.group===group&&valid(item));if(!items.length)continue;const section=document.createElement('section'),heading=document.createElement('h2'),list=document.createElement('div');heading.textContent=copy(group);list.className='link-list';section.append(heading,list);root.append(section);
 for(const item of items){const row=document.createElement('div');row.className='link-row'+(item.featured?' featured':'');const link=document.createElement('a');link.className='card-link';link.href=destination(item);link.target='_blank';link.rel='noopener noreferrer';if(item.type==='pdf')link.dataset.hubPdf='';const text=document.createElement('span');text.className='card-text';const title=document.createElement('strong'),desc=document.createElement('small');title.textContent=localized(item.title);const firstLine=document.createElement('span');firstLine.className='card-title';firstLine.append(title);if(item.account){const account=document.createElement('em');account.textContent=item.account;text.append(account)}desc.textContent=localized(item.description);text.prepend(firstLine);text.append(desc);const arrow=document.createElement('span');arrow.className='external';arrow.innerHTML=externalIcon;arrow.setAttribute('aria-hidden','true');link.append(icon(item.icon),text,arrow);row.append(link);
 row.dataset.link=item.id;const qrTarget=new URL(item.qrUrl||absolute(item.url));qrTarget.searchParams.delete('sub_confirmation');const qrUrl=qrTarget.href;{const button=document.createElement('button');button.className='qr-button';button.type='button';button.innerHTML=svgIcon;button.setAttribute('aria-label',`${copy('qr')}: ${localized(item.title)}`);button.addEventListener('click',()=>showQr(item.id,qrUrl,localized(item.title)));row.append(button)}list.append(row);
 if(['instagram','youtube','facebook'].includes(item.icon)){const shortcut=document.createElement('a');shortcut.href=link.href;shortcut.target='_blank';shortcut.rel='noopener noreferrer';shortcut.setAttribute('aria-label',localized(item.title));const glyph=document.createElement('span');glyph.className='social-glyph';glyph.dataset.socialKind=item.icon;shortcut.append(glyph);document.querySelector('#social-shortcuts').append(shortcut)}
 }}
 const profileUrl=new URL('/links/',settings.siteOrigin).href;
 document.querySelector('#share').setAttribute('aria-label',copy('share'));
 document.querySelector('#share').addEventListener('click',async()=>{if(navigator.share){try{await navigator.share({title:settings.name,url:profileUrl});return}catch(error){if(error.name==='AbortError')return}}showQr('profile',profileUrl,settings.name)});
 document.querySelector('#profile-qr').innerHTML=svgIcon;
 document.querySelector('#profile-qr').setAttribute('aria-label',copy('qr'));
 document.querySelector('#profile-qr').addEventListener('click',()=>showQr('profile',profileUrl,settings.name));
 document.querySelector('#qr-close').setAttribute('aria-label',copy('close'));
 document.querySelector('#qr-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');previousFocus?.focus()});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()});
 document.querySelector('#qr-copy').addEventListener('click',async()=>{if(!active)return;try{await navigator.clipboard.writeText(active.url);document.querySelector('#qr-status').textContent=copy('copied')}catch{document.querySelector('#qr-status').textContent=copy('manual');const range=document.createRange();range.selectNodeContents(document.querySelector('#qr-url'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range)}});
 const download=(url,filename)=>{const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove()};
 document.querySelector('#qr-svg').addEventListener('click',()=>{if(active)download(active.imageUrl,`${active.id}-qr.svg`)});
 document.querySelector('#qr-png').addEventListener('click',()=>{if(!active)return;const selected=active,img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,1024,1024);context.imageSmoothingEnabled=false;context.drawImage(img,0,0,1024,1024);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);download(url,`${selected.id}-qr.png`);setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')};img.src=selected.imageUrl});
 document.addEventListener('click',event=>{const link=event.target.closest('a[data-hub-pdf]');if(!link||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();let popup;try{popup=window.open('about:blank','_blank');if(!popup||popup.closed){download(link.href,'Rozalie-Stoklasova-Press-Kit.pdf');return}popup.opener=null;popup.location.replace(link.href)}catch{popup?.close();download(link.href,'Rozalie-Stoklasova-Press-Kit.pdf')}});
})();
