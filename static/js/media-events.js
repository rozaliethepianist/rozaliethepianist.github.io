/* Cap event lists independently, reserving room for the Instagram invitation. */
(() => {
 'use strict';
 const labels={more:{en:'Show more events',cz:'Zobrazit další akce'},less:{en:'Show fewer events',cz:'Sbalit seznam akcí'}};
 const setup=()=>{
  document.querySelectorAll('.page-media .about-event-column').forEach((column,index)=>{
   const list=column.querySelector('[data-events-list]');
   if(!list) return;
   const follow=column.querySelector('.about-follow');
   const button=document.createElement('button');
   button.type='button';button.className='media-events-toggle';button.hidden=true;
   list.id ||= `media-events-list-${index}`;
   button.setAttribute('aria-controls',list.id);button.setAttribute('aria-expanded','false');
   button.innerHTML='<span class="media-events-symbol" aria-hidden="true">+</span>';
   list.after(button);list.classList.add('media-events-list');
   let expanded=false,frame=0;
   const update=()=>{
    const style=follow?getComputedStyle(follow):null;
    const reserved=follow?follow.getBoundingClientRect().height+parseFloat(style.marginTop)+parseFloat(style.marginBottom):0;
    const total=Math.max(0,550-reserved);
    const overflow=list.scrollHeight>total+1;
    button.hidden=!overflow;
    const budget=Math.max(0,total-(overflow?48:0));
    list.style.maxHeight=expanded?'none':`${budget}px`;
    list.classList.toggle('is-collapsed',overflow&&!expanded);
    button.setAttribute('aria-expanded',String(expanded));
    const lang=document.documentElement.lang==='cs'?'cz':'en';
    button.setAttribute('aria-label',labels[expanded?'less':'more'][lang]);
    button.querySelector('span').textContent=expanded?'−':'+';
   };
   const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);};
   button.addEventListener('click',()=>{expanded=!expanded;update();});
   const observer=new ResizeObserver(schedule);observer.observe(column);if(follow)observer.observe(follow);
   new MutationObserver(schedule).observe(list,{childList:true,subtree:true,characterData:true});
   new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
   window.addEventListener('resize',schedule,{passive:true});
   document.fonts?.ready.then(schedule);update();
  });
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();
