/* Same overlay scrollbar behavior as the main website. */
(() => {
'use strict';
  const fineScroll = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const scrollRail = document.createElement('div');
  scrollRail.className = 'page-scroll-rail'; scrollRail.setAttribute('aria-hidden','true');
  const scrollThumb = document.createElement('div'); scrollThumb.className = 'page-scroll-thumb';
  scrollRail.append(scrollThumb); document.body.append(scrollRail);
  let dragScroll = null, scrollFrame = 0;
  const paintScroll = () => {
    scrollFrame = 0;
    const root = document.documentElement, range = root.scrollHeight - root.clientHeight;
    const active = fineScroll.matches && range > 0 && !document.body.classList.contains('nav-open-body') && !document.body.classList.contains('modal-open');
    root.classList.toggle('overlay-scrollbar', fineScroll.matches);
    scrollRail.hidden = !active;
    const height = Math.max(44, root.clientHeight * root.clientHeight / Math.max(root.scrollHeight,1));
    scrollThumb.style.height = `${height}px`;
    scrollThumb.style.transform = `translateY(${range > 0 ? window.scrollY / range * (root.clientHeight - height) : 0}px)`;
  };
  const scheduleScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
  window.addEventListener('scroll',scheduleScroll,{passive:true});
  window.addEventListener('resize',scheduleScroll);
  new ResizeObserver(scheduleScroll).observe(document.body);
  fineScroll.addEventListener('change',scheduleScroll);
  scrollRail.addEventListener('pointerdown',event => {
    if (event.button !== 0) return;
    event.preventDefault();
    if (event.target === scrollThumb) {
      dragScroll = {y:event.clientY,scroll:window.scrollY};
      scrollThumb.setPointerCapture(event.pointerId);scrollRail.classList.add('is-dragging');
    } else window.scrollBy({top:(event.clientY < scrollThumb.getBoundingClientRect().top ? -1:1)*innerHeight*.85,behavior:'instant'});
  });
  scrollThumb.addEventListener('pointermove',event => {
    if (!dragScroll) return;
    const root=document.documentElement, travel=root.clientHeight-scrollThumb.offsetHeight;
    window.scrollTo({top:dragScroll.scroll+(event.clientY-dragScroll.y)*(root.scrollHeight-root.clientHeight)/Math.max(travel,1),behavior:'instant'});
  });
  const endScrollDrag = () => {dragScroll=null;scrollRail.classList.remove('is-dragging');};
  scrollThumb.addEventListener('pointerup',endScrollDrag);scrollThumb.addEventListener('pointercancel',endScrollDrag);scrollThumb.addEventListener('lostpointercapture',endScrollDrag);
  paintScroll();

})();
