/* Rozálie Stoklasová — common site UI, navigation, footer and lightweight interactions.
   Edit socialLinks and pressKitUrl in one place. Contact forms are embedded from Notion. */
(() => {
  'use strict';
  document.addEventListener('keydown', event => { if (event.key === 'Tab') document.documentElement.classList.add('keyboard-navigation'); });
  document.addEventListener('pointerdown', () => document.documentElement.classList.remove('keyboard-navigation'), {passive:true});
  const url = (path = '') => '/' + path.replace(/^\/+/, '');
  const asset = (path) => url('static/' + path);
  const page = document.body.dataset.page || 'home';
  // Load optional third-party connections only after the visitor's choice.
  const consent = {notion:false,youtube:false};
  for (const service of Object.keys(consent)) { try { consent[service]=sessionStorage.getItem(`rozalie-external-${service}`)==='yes'; } catch {} }
  const locale = () => {
    const q=new URL(location.href).searchParams.get('lang');let saved;try{saved=localStorage.getItem('rozalie-language');}catch{}
    const language=q||saved||navigator.language;return /^(cz|cs)(-|$)/i.test(language||'')?'cz':'en';
  };
  const externalCopy = key => window.ROZALIE_CONTENT?.[key]?.[locale()] || window.ROZALIE_CONTENT?.[key]?.en || '';
  const externalGates = [];
  function offerExternal(service, target, initialize) {
    if(!target)return;
    if(consent[service]) {initialize();return;}
    target.setAttribute('data-external-pending','');
    const gate=document.createElement('div');gate.className='external-content-choice';
    const note=document.createElement('p'),button=document.createElement('button'),link=document.createElement('a');
    const noticeKey=service==='notion'?'external_notion_notice_n4t8p':'external_youtube_notice_j7b2a';
    const buttonKey=service==='notion'?'external_notion_load_c3r7x':'external_youtube_load_f8m2s';
    note.dataset.content=noticeKey;note.textContent=externalCopy(noticeKey);
    button.type='button';button.className='button button-primary';button.dataset.content=buttonKey;button.textContent=externalCopy(buttonKey);
    link.href='/privacy-policy/';link.dataset.content='external_privacy_link_q7e4n';link.textContent=externalCopy(link.dataset.content);
    gate.append(note,button,link);target.before(gate);externalGates.push([service,gate]);
    button.addEventListener('click',()=>{
      consent[service]=true;try{sessionStorage.setItem(`rozalie-external-${service}`,'yes');}catch{}
      externalGates.filter(([kind])=>kind===service).forEach(([,element])=>element.remove());target.removeAttribute('data-external-pending');initialize();
      if(service==='notion')target.querySelector('iframe')?.focus();
      else document.querySelector('.video-thumb')?.focus();
    },{once:true});
  }
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-external-reset]')) {
      for(const service of Object.keys(consent)){try{sessionStorage.removeItem(`rozalie-external-${service}`);}catch{}}
      location.reload();
    }
  });
  const darkHeader = ['about', 'media'].includes(page);
  const darkFooter = ['home', 'about', 'media'].includes(page);

  const settings = {
    email: 'rozalie.stoklasova@gmail.com',
    // Authoritative profile links supplied by the site owner.
    socialLinks: {
      youtube: 'https://www.youtube.com/@RozalieThePianist?sub_confirmation=1',
      instagram: 'https://www.instagram.com/rozalie.the.pianist',
      facebook: 'https://www.facebook.com/rozalie.stoklasova',
      linkedin: 'https://www.linkedin.com/in/roz%C3%A1lie-stoklasov%C3%A1-4a620a34b',
      links: '/links/',
    },
    pressKitUrl: '/documents/rozalie-stoklasova-press-kit.pdf',
  };

  const menu = [
    ['home', 'Home', ''],
    ['piano-lessons', 'Piano Lessons', 'piano-lessons/'],
    ['about', 'About', 'about/'],
    ['media', 'Media', 'media/'],
    ['contact', 'Contact', 'contact/'],
  ];
  const socialLabels = { youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', links: 'Links' };
  const socialIcon = (kind) => {
    const href = settings.socialLinks[kind];
    const inner = `<img src="${asset('image/icons/' + kind + '.svg')}" alt="" width="20" height="20" loading="lazy">`;
    const label = socialLabels[kind];
    return href
      ? `<a class="social-icon" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} (opens in a new tab)">${inner}</a>`
      : `<button class="social-icon" type="button" data-pending-social="${label}" aria-label="${label} profile link not yet configured" title="${label} profile link not yet configured">${inner}</button>`;
  };

  function renderHeader() {
    const el = document.querySelector('[data-site-header]');
    if (!el) return;
    const logoFile = 'logo-black.svg';
    const nav = menu.map(([id, label, path]) => `<a href="${url(path)}" class="nav-link${page === id ? ' is-active' : ''}"${page === id ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    el.innerHTML = `
      <header class="site-header${darkHeader ? ' header-dark' : ''}" id="top">
        <div class="header-inner">
          <a class="header-logo" href="${url('')}" aria-label="Rozalie The Pianist — home">
            <img src="${asset('image/icons/' + logoFile)}" alt="Rozálie the pianist" width="137" height="83" fetchpriority="high">
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation">
            <span></span><span></span><span></span>
          </button>
          <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">${nav}</nav>
          ${['about', 'media'].includes(page) ? `<a class="press-link" data-press-kit href="${settings.pressKitUrl}" target="_blank" rel="noopener noreferrer">Press kit</a>` : ''}
        </div>
      </header>`;
    const toggle = el.querySelector('.menu-toggle');
    const navEl = el.querySelector('.primary-nav');
    let menuScroll = null;
    const setOpen = (open) => {
      if (open && menuScroll === null) {
        menuScroll = window.scrollY;
        document.body.style.width = `${document.documentElement.clientWidth}px`;
        document.body.style.position = 'fixed';
        document.body.style.top = `${-menuScroll}px`;
      } else if (!open && menuScroll !== null) {
        const restoreY = menuScroll; menuScroll = null;
        document.body.style.removeProperty('width');
        document.body.style.removeProperty('position');
        document.body.style.removeProperty('top');
        window.scrollTo({top:restoreY,behavior:'instant'});
      }
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      el.classList.toggle('nav-open', open);
      document.body.classList.toggle('nav-open-body', open);
      if (open) navEl.querySelector('a')?.focus({preventScroll:true});
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    navEl.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', (event) => { if (!el.contains(event.target)) setOpen(false); });
    el.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
      const links = [...navEl.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === toggle) { event.preventDefault(); links.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === links.at(-1)) { event.preventDefault(); toggle.focus(); }
    });
    // Browsers may blur an element as its responsive display rule changes,
    // before the media-query event runs. Retain its last header focus.
    let lastHeaderFocus = null;
    el.addEventListener('focusin', event => { lastHeaderFocus = event.target; });
    document.addEventListener('focusin', event => { if (!el.contains(event.target) && event.target !== document.body) lastHeaderFocus = null; });
    document.addEventListener('pointerdown', event => { if (!el.contains(event.target)) lastHeaderFocus = null; });
    const desktop = matchMedia('(min-width: 786px)');
    desktop.addEventListener('change', () => {
      const active = document.activeElement === document.body ? lastHeaderFocus : document.activeElement;
      const focusInMenu = navEl.contains(active);
      const focusOnToggle = active === toggle;
      setOpen(false);
      if (!desktop.matches && focusInMenu) toggle.focus();
      else if (desktop.matches && focusOnToggle) (navEl.querySelector('[aria-current]') || navEl.querySelector('a')).focus();
    });
  }

  function renderSocialRail() {
    const el = document.querySelector('[data-social-rail]');
    if (!el) return;
    const railItem = kind => {
      const label = socialLabels[kind];
      const destination = settings.socialLinks[kind];
      return destination
        ? `<a href="${destination}" target="_blank" rel="noopener noreferrer">${label}</a>`
        : `<button type="button" data-pending-social="${label}">${label}</button>`;
    };
    el.innerHTML = `<aside class="social-rail" aria-label="Social media">${['youtube','instagram','facebook'].map(railItem).join('')}</aside>`;
  }

  function renderFooter() {
    const el = document.querySelector('[data-site-footer]');
    if (!el) return;
    el.innerHTML = `<footer class="site-footer${darkFooter ? ' footer-dark' : ''}">
        <div class="footer-inner">
          <div class="footer-legal">
            <p>© <time datetime="${new Date().getFullYear()}">${new Date().getFullYear()}</time> <strong>Rozálie Stoklasová.</strong> All rights reserved.</p>
            <p><a href="${url('privacy-policy/')}">Privacy policy</a> <span aria-hidden="true">&amp;</span> <a href="${url('terms-of-service/')}">Terms of service</a></p>
          </div>
          <div class="footer-right"><div class="footer-contact-row"><a class="footer-contact-link" href="/contact/">Contact</a><a class="footer-email" href="mailto:${settings.email}">${settings.email}</a></div>
            <div class="footer-social">${['youtube', 'instagram', 'facebook', 'linkedin', 'links'].map(s => socialIcon(s)).join('')}
              <button class="social-icon" type="button" data-share-page aria-label="Share" title="Share" style="color:inherit;cursor:pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></svg>
                <span data-share-status role="status" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap"></span>
              </button>
            </div>
          </div>
        </div>
      </footer>`;
  }

  // One published Notion form powers both contact locations. The embedding
  // URL comes from Notion's "Embed this page" dialog (not the response database).
  const NOTION_FORM_URL = 'https://honorable-hose-085.notion.site/ebd/415ebc93c4a28025bd11e066249bb4cf';

  function renderForms() {
    const interestLabels = {
      'piano-lessons': 'Piano lessons in Maastricht',
      'online-lessons': 'Online piano lessons',
      'press-kit': 'Press and performances',
      'other': 'Other inquiry',
    };

    document.querySelectorAll('[data-contact-form]').forEach(el => {
      const dark = el.dataset.variant === 'dark';
      const form = document.createElement('div');
      form.className = `contact-form notion-contact-form${dark ? ' contact-form-dark notion-contact-form--dark' : ' notion-contact-form--light'}`;

      // The Contact page already has an external "Send request" heading.
      /*
      if (dark) {
        const heading = document.createElement('h3');
        heading.textContent = 'Send request';
        form.appendChild(heading);
      }
      */

      // Cross-origin iframes cannot be prefilled by manipulating their fields.
      // Retain useful context for visitors arriving from the lesson offer links.
      const interest = new URLSearchParams(window.location.search).get('interest');
      if (!dark && Object.hasOwn(interestLabels, interest)) {
        const hint = document.createElement('p');
        hint.className = 'notion-contact-interest-hint';
        hint.textContent = `Primary interest: please select “${interestLabels[interest]}” in the form below.`;
        form.appendChild(hint);
      }

      const frameContainer = document.createElement('div');
      frameContainer.className = 'notion-contact-frame-wrap';
      const iframe = document.createElement('iframe');
      iframe.className = 'notion-contact-iframe';
      iframe.src = NOTION_FORM_URL;
      iframe.title = 'Contact Rozalie The Pianist — Notion form';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      frameContainer.appendChild(iframe);
      form.appendChild(frameContainer);

      // Always provide a direct link for browsers that block third-party frames.
      const fallback = document.createElement('p');
      fallback.className = 'notion-contact-fallback';
      const link = document.createElement('a');
      link.href = NOTION_FORM_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Form not displaying? Open it in a new tab';
      fallback.appendChild(link);
      form.appendChild(fallback);
      el.replaceChildren(form);
    });
  }

  let youtubeAPI;
  const videoSettings = window.ROZALIE_VIDEOS || { media: [], home: [] };
  const uploads = videoSettings.uploadsPlaylist || '';
  // YouTube selects adaptive playback quality automatically; do not force a resolution.
  function configureUploads(iframe, index, autoplay = false, onSelection, videoId) {
    const source = new URL(iframe.src);
    source.searchParams.set('enablejsapi', '1');
    source.searchParams.set('origin', location.origin);
    source.searchParams.delete('index');
    iframe.src = source.href;
    youtubeAPI ||= new Promise(resolve => {
      if (window.YT?.Player) { resolve(); return; }
      window.onYouTubeIframeAPIReady = resolve;
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.head.append(script);
    });
    youtubeAPI.then(() => {
      if (!iframe.isConnected) return;
      iframe._youtubePlayer = new window.YT.Player(iframe, { events: { onReady(event) {
        if (videoId) { event.target.cueVideoById(videoId); return; }
        const selection = { list: uploads, listType: 'playlist', index: Number(index) };
        if (autoplay) event.target.loadPlaylist(selection);
        else event.target.cuePlaylist(selection);
      }, onStateChange(event) {
        if (event.data === 5 && (videoId || event.target.getPlaylistIndex() === Number(index))) onSelection?.(event.target.getVideoData());
      } } });
    });
  }

  function renderVideoDialog() {
    const dialog = document.createElement('div');
    dialog.className = 'video-modal';
    dialog.hidden = true;
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-label', 'Video player');
    dialog.setAttribute('aria-modal', 'true');
    dialog.innerHTML = `<div class="video-modal-panel"><button class="video-close" aria-label="Close video" type="button">×</button><div class="video-iframe-holder"></div><a class="video-external-link" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a></div>`;
    document.body.append(dialog);
    let previousFocus;
    let backgroundState = [];
    const close = () => { dialog.hidden = true; backgroundState.forEach(([el, inert]) => { el.inert = inert; }); backgroundState = []; dialog.querySelector('.video-iframe-holder iframe')?._youtubePlayer?.destroy(); dialog.querySelector('.video-iframe-holder').replaceChildren(); document.body.classList.remove('modal-open'); previousFocus?.focus(); };
    dialog.querySelector('.video-close').addEventListener('click', close);
    const pauseVideo = () => {
      const iframe = dialog.querySelector('.video-iframe-holder iframe');
      iframe?._youtubePlayer?.pauseVideo();
      iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), 'https://www.youtube-nocookie.com');
    };
    const externalLink = dialog.querySelector('.video-external-link');
    externalLink.addEventListener('click', pauseVideo);
    externalLink.addEventListener('auxclick', event => { if (event.button === 1) pauseVideo(); });

    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !dialog.hidden) close(); });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const first = dialog.querySelector('.video-close');
      const last = dialog.querySelector('.video-external-link');
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    document.querySelectorAll('[data-video], [data-video-playlist]').forEach(btn => btn.addEventListener('click', () => {
      if(!consent.youtube){document.querySelector('.external-content-choice button')?.focus();return;}
      const id = btn.dataset.videoId || btn.dataset.video || '';
      const playlistIndex = btn.dataset.videoPlaylist;
      if (playlistIndex === undefined && !/^[\w-]{11}$/.test(id)) return;
      previousFocus = document.activeElement;
      const iframe = document.createElement('iframe');
      iframe.title = btn.querySelector('.video-card-title')?.textContent || 'Rozálie Stoklasová piano performance';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = playlistIndex !== undefined ? `https://www.youtube-nocookie.com/embed/videoseries?list=${uploads}&index=${Number(playlistIndex) + 1}&autoplay=1&rel=0` : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(location.origin)}`;
      dialog.querySelector('.video-iframe-holder').replaceChildren(iframe);
      if (playlistIndex !== undefined) configureUploads(iframe, playlistIndex, true);
      dialog.querySelector('.video-external-link').href = playlistIndex !== undefined ? `https://www.youtube.com/playlist?list=${uploads}` : `https://www.youtube.com/watch?v=${id}`;
      backgroundState = [...document.body.children].filter(el => el !== dialog).map(el => [el, el.inert]);
      backgroundState.forEach(([el]) => { el.inert = true; });
      dialog.hidden = false;
      document.body.classList.add('modal-open');
      dialog.querySelector('.video-close').focus();
    }));
  }

  function renderPhotoDialog() {
    const triggers = [...document.querySelectorAll('[data-photo-enlarge]')];
    if (!triggers.length) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'photo-modal';
    dialog.setAttribute('aria-label', 'Enlarged photograph');
    dialog.innerHTML = '<button class="photo-close" type="button" aria-label="Close photograph" autofocus>×</button><figure><img alt=""><figcaption></figcaption></figure>';
    document.body.append(dialog);
    let previousFocus;
    const cleanup = () => {
      if (dialog.open) return;
      document.body.classList.remove('modal-open');
      dialog.querySelector('img').removeAttribute('src');
      previousFocus?.focus({ preventScroll: true });
      previousFocus = null;
    };
    const close = () => { dialog.close(); cleanup(); };
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    dialog.querySelector('.photo-close').addEventListener('click', close);
    dialog.addEventListener('keydown', event => {
      if (event.key === 'Tab') { event.preventDefault(); dialog.querySelector('.photo-close').focus(); }
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    dialog.addEventListener('close', cleanup);
    triggers.forEach(button => {
      const image = button.querySelector('img');
      button.setAttribute('aria-label', `Enlarge photo: ${image.alt}`);
      button.addEventListener('click', () => {
        previousFocus = button;
        const enlarged = dialog.querySelector('img');
        enlarged.src = button.dataset.photoSrc || image.currentSrc || image.src;
        enlarged.alt = image.alt;
        dialog.querySelector('figcaption').textContent = image.alt;
        dialog.showModal();
        document.body.classList.add('modal-open');
      });
    });
  }

  document.querySelectorAll('[data-press-kit]').forEach(el => { el.href = settings.pressKitUrl; });
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-press-kit],a[data-pdf-document]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const documentUrl = link.href;
    const download = () => {
      const anchor = document.createElement('a');
      anchor.href = documentUrl;
      anchor.download = new URL(documentUrl).pathname.split('/').pop() || 'document.pdf';
      document.body.append(anchor);anchor.click();anchor.remove();
    };
    let popup;
    try {
      popup = window.open('about:blank', '_blank');
      if (!popup || popup.closed) { download();return; }
      popup.opener = null;
      popup.location.replace(documentUrl);
    } catch {
      popup?.close();download();
    }
  });

  document.querySelectorAll('[data-youtube-video]').forEach(el => { el.href = settings.socialLinks.youtube; });
  function renderCurrentAdviserArt() {
    if (page !== 'dutch') return;
    const layer = document.createElement('div');
    layer.className = 'adviser-current-art';layer.setAttribute('aria-hidden', 'true');
    const pieces = [
      { anchor: '#offers', x: -4.646, y: -19.522, width: 32.29, angle: 0, opacity: .31 },
      { anchor: '#audience', x: -12.409, y: -28.8, width: 26.624, angle: -39.768, opacity: .31 },
      { anchor: '#story', x: -9.8565, y: -10.0, width: 27.6073, angle: 21.0637, opacity: .31 },
      { anchor: '.adviser-opinion h2', x: -5.5, y: -8.1, width: 25.944, angle: 0, opacity: .23 }
    ];
    pieces.forEach((piece, index) => { const img = document.createElement('img');img.src = ['/static/image/optimized/adviser-current-0-882d3ffa6ccc.webp','/static/image/optimized/adviser-current-1-716e1098fb45.webp','/static/image/optimized/adviser-current-2-e9b4120717c7.webp','/static/image/optimized/adviser-current-3-b5db5fb982aa.webp'][index];img.alt = '';layer.append(img);piece.image = img; });
    document.body.append(layer);
    const update = () => {
      const body = document.body.getBoundingClientRect(), main = document.querySelector('main').getBoundingClientRect(), unit = main.width / 100;
      pieces.forEach(piece => {
        const image = piece.image;
        image.style.left = `${main.left - body.left + piece.x * unit}px`;
        image.style.width = `${piece.width * unit}px`;
        image.style.transform = `rotate(${piece.angle}deg)`;
        image.style.clipPath = piece.anchor === '#story' ? 'inset(0 0 33.333% 0)' : 'none';
        image.style.opacity = innerWidth <= 1100 ? '.16' : piece.opacity;
        if (piece.anchor) image.style.top = `${document.querySelector(piece.anchor).getBoundingClientRect().top - body.top + piece.y * unit}px`;
        else image.style.bottom = `${piece.bottom * unit}px`;
      });
      const photoRects = [...document.querySelectorAll('.adviser-hero-photo,.adviser-tulips,.adviser-story-crop')].map(photo => { const r = photo.getBoundingClientRect();return `<rect x="${r.left-body.left}" y="${r.top-body.top}" width="${r.width}" height="${r.height}" fill="black"/>`; }).join('');
      const edge = document.body.classList.contains('canvas-fits-viewport') ? '' : `<defs><linearGradient id="edge"><stop stop-color="white" stop-opacity="0"/><stop offset="${44/body.width}" stop-color="white"/><stop offset="${1-44/body.width}" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${body.width}" height="${body.height}">${edge}<rect width="100%" height="100%" fill="${edge ? 'url(#edge)' : 'white'}"/>${photoRects}</svg>`;
      layer.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    };
    new ResizeObserver(update).observe(document.body);document.fonts.ready.then(update);update();
  }

  const connection = navigator.connection;
  if (connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '')) document.querySelectorAll('[data-adaptive-thumbnail]').forEach(img => img.removeAttribute('srcset'));
  const updateEdgeBlend = () => { document.querySelectorAll('.lessons-hero-photo,.adviser-hero-photo,.contact-photo-c5').forEach(photo => photo.classList.toggle('hero-fills-viewport', photo.getBoundingClientRect().width >= document.documentElement.clientWidth - 1)); document.body.style.setProperty('--viewport-width', `${document.documentElement.clientWidth}px`); const main = document.querySelector('main'); document.body.classList.toggle('canvas-fits-viewport', !!main && main.getBoundingClientRect().width >= document.documentElement.clientWidth - 1); };
  new ResizeObserver(updateEdgeBlend).observe(document.documentElement);
  updateEdgeBlend();
  // Root scrollbar variables inherit the current page's right-margin palette.
  const pagePaint = getComputedStyle(document.body);
  const scrollTrack = pagePaint.getPropertyValue('--outside-right').trim() || '#111';
  const rootPaint = document.documentElement.style;
  rootPaint.setProperty('--scroll-track', scrollTrack);
  rootPaint.setProperty('--scroll-accent', pagePaint.getPropertyValue('--blue').trim());
  // Resolve the track color before choosing a contrasting hover tone.
  const probe = document.createElement('span');
  probe.style.color = scrollTrack;
  document.body.append(probe);
  const rgb = getComputedStyle(probe).color.match(/[\d.]+/g)?.slice(0,3).map(Number) || [0,0,0];
  probe.remove();
  rootPaint.setProperty('--scroll-contrast', rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722 > 150 ? '#000' : '#fff');

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

  renderHeader();
  renderSocialRail();
  renderFooter();
  const shareLabel = () => ['cs', 'cz'].includes(document.documentElement.lang.toLowerCase().split('-')[0]) ? 'Sdílet' : 'Share';
  const updateShareLabel = () => {
    const button = document.querySelector('[data-share-page]');
    if (!button) return;
    button.setAttribute('aria-label', shareLabel());
    button.title = shareLabel();
  };
  updateShareLabel();
  new MutationObserver(updateShareLabel).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  document.querySelector('[data-share-page]')?.addEventListener('click', async event => {
    const button = event.currentTarget;
    if (button.disabled) return;
    const shareUrl = location.href;
    const isCzech = ['cs', 'cz'].includes(document.documentElement.lang.toLowerCase().split('-')[0]);
    button.disabled = true;
    try {
      if (navigator.share) {
        try {
          await navigator.share({ title: document.title, url: shareUrl });
          return;
        } catch (error) {
          if (error.name === 'AbortError') return;
        }
      }
      try {
        await navigator.clipboard.writeText(shareUrl);
        const status = button.querySelector('[data-share-status]');
        status.textContent = isCzech ? 'Odkaz zkopírován' : 'Link copied';
        button.title = status.textContent;
        setTimeout(() => {
          status.textContent = '';
          button.title = shareLabel();
        }, 2000);
      } catch {
        window.prompt(isCzech ? 'Zkopírovat odkaz:' : 'Copy link:', shareUrl);
      }
    } finally {
      button.disabled = false;
    }
  });

  const endingPlane = document.querySelector('.page-plane');
  if (endingPlane) {
    const updateEndingPlane = () => {
      const reviews = endingPlane.querySelector('.lessons-reviews,.adviser-reviews');
      if (!reviews) return;
      const frame = endingPlane.getBoundingClientRect();
      const top = reviews.getBoundingClientRect().top - frame.top;
      const start = frame.width * .6031;
      // Reverse the same continuous diagonal at the final section before the footer.
      const opinion = endingPlane.querySelector('.lessons-opinion,.adviser-opinion');
      const bendTop = (opinion ? opinion.getBoundingClientRect().top - frame.top : frame.height) - 65;
      const slope = Math.tan(15 * Math.PI / 180);
      const bend = start + (bendTop - top) * slope;
      const end = bend - (frame.height - bendTop) * slope;
      const overlap = parseFloat(getComputedStyle(endingPlane).getPropertyValue('--background-paint-overlap')) || 0;
      endingPlane.style.setProperty('--ending-bend-top', `${bendTop - top + overlap}px`);
      endingPlane.style.setProperty('--ending-x-bend', `${bend}px`);
      endingPlane.style.setProperty('--ending-top', `${top}px`);
      endingPlane.style.setProperty('--ending-x-start', `${start}px`);
      endingPlane.style.setProperty('--ending-x-end', `${end}px`);
    };
    new ResizeObserver(updateEndingPlane).observe(endingPlane);
    document.fonts.ready.then(updateEndingPlane);
    updateEndingPlane();
  }

  // YouTube can return a tiny placeholder with HTTP 200 for unavailable sizes.
  function setYouTubeThumbnail(image, id) {
    const standard = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    image.dataset.thumbnailVideo = id;
    image.removeAttribute('srcset');
    image.onerror = null;
    image.src = standard;
    if (navigator.connection?.saveData || /^(slow-2g|2g|3g)$/.test(navigator.connection?.effectiveType || '')) return;
    const candidate = new Image();
    candidate.onload = () => {
      if (candidate.naturalWidth < 640 || candidate.naturalHeight < 360 || image.dataset.thumbnailVideo !== id || !image.isConnected) return;
      image.onerror = () => { image.onerror = null; image.src = standard; };
      image.src = candidate.src;
    };
    // Leave the already displayed standard thumbnail untouched on a failed probe.
    candidate.onerror = () => {};
    candidate.src = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  }

  // Build the video cards before binding player controls and metadata resolvers.
  function configuredVideoId(value) {
    try {
      if (typeof value !== 'string') return null;
      const url = new URL(value.trim());
      if (url.protocol !== 'https:' || !['youtu.be', 'youtube.com', 'www.youtube.com', 'www.youtube-nocookie.com'].includes(url.hostname)) return null;
      const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : url.pathname === '/watch' ? url.searchParams.get('v') : /^\/(embed|shorts)\//.test(url.pathname) ? url.pathname.split('/')[2] : null;
      return /^[\w-]{11}$/.test(id || '') ? id : null;
    } catch { return null; }
  }
  function configuredCard(id, slot, autoIndex) {
    const button = document.createElement('button');
    button.className = 'video-thumb'; button.type = 'button';
    button.setAttribute('aria-label', 'Play on YouTube');
    if (autoIndex !== undefined) {
      button.dataset.liveUpload = autoIndex;
      button.dataset.videoPlaylist = autoIndex;
    } else { button.dataset.video = id; button.dataset.videoSlot = slot; }
    const image = document.createElement('img'); image.alt = ''; image.width = 480; image.height = 360; image.loading = 'lazy';
    if (id && consent.youtube) image.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    const badge = document.createElement('span'); badge.className = 'youtube-badge'; badge.textContent = 'YouTube';
    const title = document.createElement('span'); title.className = 'video-card-title'; title.textContent = autoIndex === undefined ? 'YouTube video' : 'Latest YouTube performance';
    button.append(image, badge, title); return button;
  }
  const aboutVideoGrid = document.querySelector('.about-media-grid');
  if (aboutVideoGrid) {
    aboutVideoGrid.replaceChildren();
    (Array.isArray(videoSettings.media) ? videoSettings.media : []).forEach((url, index) => {
      const id = configuredVideoId(url); if (!id) return;
      const figure = document.createElement('figure');
      figure.append(configuredCard(id, `about-${index + 1}`));
      aboutVideoGrid.append(figure);
    });
  }
  const homeVideoGrid = document.querySelector('.home-videos');
  if (homeVideoGrid) {
    homeVideoGrid.replaceChildren(); let automaticIndex = 0;
    [0, 1].forEach(index => {
      const value = videoSettings.home?.[index];
      const id = configuredVideoId(value);
      if (id) homeVideoGrid.append(configuredCard(id, `home-${index + 1}`));
      else if (uploads && (value === undefined || value === null || value === '' || value === 'auto')) homeVideoGrid.append(configuredCard(null, null, automaticIndex++));
    });
  }

  offerExternal('notion',document.querySelector('[data-contact-form]'),renderForms);
  renderVideoDialog();
  renderPhotoDialog();
  renderCurrentAdviserArt();
  offerExternal('youtube',document.querySelector('.about-media-grid,.home-videos'),()=>{
  document.querySelectorAll('[data-live-upload], [data-video-slot]').forEach(button => {
    const configuredVideo = button.hasAttribute('data-live-upload') ? null : button.dataset.video;
    if(configuredVideo)setYouTubeThumbnail(button.querySelector('img'),configuredVideo);
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-metadata-resolver';
    iframe.title = 'YouTube upload metadata resolver';
    iframe.setAttribute('aria-hidden', 'true'); iframe.tabIndex = -1;
    iframe.style.cssText = 'position:absolute;top:0;left:-10000px;width:200px;height:113px;border:0;pointer-events:none';
    iframe.src = configuredVideo ? `https://www.youtube-nocookie.com/embed/${configuredVideo}?rel=0` : `https://www.youtube-nocookie.com/embed/videoseries?list=${uploads}&rel=0`;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    document.body.append(iframe);
    configureUploads(iframe, button.dataset.liveUpload, false, video => {
      if (!/^[\w-]{11}$/.test(video.video_id)) return;
      button.dataset.video = video.video_id;
      delete button.dataset.videoPlaylist;
      button.setAttribute('aria-label', `Play on YouTube: ${video.title}`);
      button.querySelector('.video-card-title').textContent = video.title;
      setYouTubeThumbnail(button.querySelector('img'), video.video_id);
    }, configuredVideo);
  });
  });
  if (page === 'home') {
    const main = document.querySelector('main');
    const updateSeam = () => {
      const frame = main.getBoundingClientRect();
      const body = document.body.getBoundingClientRect();
      const start = frame.left - body.left + frame.width * .62278;
      const end = start - (.62278 / 2.6717) * body.height;
      document.body.style.setProperty('--home-seam-start', `${start}px`);
      document.body.style.setProperty('--home-seam-end', `${end}px`);
    };
    new ResizeObserver(updateSeam).observe(document.body);
    document.fonts.ready.then(updateSeam);
    updateSeam();
  }
  const artistQuote = document.querySelector('.home-quote');
  if (artistQuote) {
    const alignClosingQuote = () => {
      const paragraph = artistQuote.querySelector('p:last-child');
      const range = document.createRange();
      range.selectNodeContents(paragraph);
      const lines = [...range.getClientRects()].filter(rect => rect.height > 0);
      const last = lines.at(-1);
      if (last) artistQuote.style.setProperty('--quote-end-y', `${last.top + last.height / 2 - artistQuote.getBoundingClientRect().top}px`);
    };
    new ResizeObserver(alignClosingQuote).observe(artistQuote);
    document.fonts.ready.then(alignClosingQuote);
    alignClosingQuote();
  }
})();
