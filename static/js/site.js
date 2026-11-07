/* Rozálie Stoklasová — common site UI, navigation, footer and lightweight interactions.
   Edit socialLinks and pressKitUrl in one place. No form backend is included. */
(() => {
  'use strict';
  const url = (path = '') => '/' + path.replace(/^\/+/, '');
  const asset = (path) => url('static/' + path);
  const page = document.body.dataset.page || 'home';
  const darkHeader = ['about', 'dutch'].includes(page);
  const darkFooter = ['home', 'about', 'dutch'].includes(page);
  const videoId = 'S_CacDghMmc';

  const settings = {
    email: 'rozalie.stoklasova@gmail.com',
    videoId,
    // Authoritative profile links supplied by the site owner.
    socialLinks: {
      youtube: 'https://www.youtube.com/@RozalieThePianist?sub_confirmation=1',
      instagram: 'https://www.instagram.com/rozalie.the.pianist',
      facebook: 'https://www.facebook.com/rozalie.stoklasova',
      linkedin: 'https://www.linkedin.com/in/roz%C3%A1lie-stoklasov%C3%A1-4a620a34b',
      linktree: 'https://linktr.ee/rozalie.stoklasova',
    },
    pressKitUrl: 'https://assets.muvac.com/profiles/rozalie-stoklasova-1/docs/851404/1775391208837-rozlie_stoklasov_-_press_kit_2025.pdf?download=',
  };

  const menu = [
    ['home', 'Home', ''],
    ['piano-lessons', 'Piano Lessons', 'piano-lessons/'],
    ['dutch', 'Dutch Study Adviser', 'dutch-study-adviser/'],
    ['about', 'About', 'about/'],
    ['contact', 'Contact', 'contact/'],
  ];
  const socialLabels = { youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', linktree: 'Linktree' };
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
          <a class="header-logo" href="${url('')}" aria-label="Rozálie Stoklasová — home">
            <img src="${asset('image/icons/' + logoFile)}" alt="Rozálie the pianist" width="137" height="83" fetchpriority="high">
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Open navigation">
            <span></span><span></span><span></span>
          </button>
          <nav class="primary-nav" id="primary-navigation" aria-label="Main navigation">${nav}</nav>
          ${page === 'about' ? `<a class="press-link" href="${settings.pressKitUrl}" target="_blank" rel="noopener noreferrer">Press kit</a>` : ''}
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
    const desktop = matchMedia('(min-width: 769px)');
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
            <div class="footer-social">${['youtube', 'instagram', 'facebook', 'linkedin', 'linktree'].map(s => socialIcon(s)).join('')}</div>
          </div>
        </div>
      </footer>`;
  }

  function renderForms() {
    document.querySelectorAll('[data-contact-form]').forEach((el, index) => {
      const compact = el.dataset.variant === 'dark';
      const prefix = `contact-${index}`;
      el.innerHTML = `<form class="contact-form${compact ? ' contact-form-dark' : ''}" aria-label="Contact request (submission unavailable)" novalidate>
        <h3>Send request</h3>
        <div class="form-grid">
          <div class="form-group"><label for="${prefix}-name">Full name <span class="required">*</span></label><input id="${prefix}-name" name="name" required autocomplete="name" type="text" /></div>
          <div class="form-group"><label for="${prefix}-email">Email address <span class="required">*</span></label><input id="${prefix}-email" name="email" required autocomplete="email" type="email" /></div>
          <div class="form-group"><label for="${prefix}-interest">Primary interest</label><select id="${prefix}-interest" name="interest">
            <option value="">Select an option</option>
            <option value="piano-lessons">Piano lessons in Maastricht</option>
            <option value="online-lessons">Online piano lessons</option>
            <option value="dutch-study">Dutch study advising</option>
            <option value="press-kit">Press and performances</option>
            <option value="other">Other inquiry</option>
          </select></div>
          <div class="form-group"><label for="${prefix}-phone">Phone number</label><input id="${prefix}-phone" name="phone" type="tel" autocomplete="tel" /></div>
          <div class="form-group form-full"><label for="${prefix}-message">Message <span class="required">*</span></label><textarea id="${prefix}-message" name="message" required rows="5"></textarea></div>
        </div>
        <div class="form-action"><button class="button button-primary form-submit-preview" type="button" disabled>Submission unavailable</button></div>
        <p class="form-status" id="${prefix}-status" role="status" aria-live="polite"></p>
      </form>`;
      const selectedInterest = new URLSearchParams(window.location.search).get('interest');
      if (selectedInterest) {
        const select = el.querySelector('select[name="interest"]');
        if ([...select.options].some(option => option.value === selectedInterest)) select.value = selectedInterest;
      }
      el.querySelector('form').addEventListener('submit', event => event.preventDefault());
    });
  }

  let youtubeAPI;
  const uploads = 'UUG5_aMyEhXXVwi5zO8ttx0g';
  function configureUploads(iframe, index, autoplay = false, onSelection) {
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
        const selection = { list: uploads, listType: 'playlist', index: Number(index) };
        if (autoplay) event.target.loadPlaylist(selection);
        else event.target.cuePlaylist(selection);
      }, onStateChange(event) {
        if (event.data === 5 && event.target.getPlaylistIndex() === Number(index)) onSelection?.(event.target.getVideoData());
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
      const id = btn.dataset.videoId || btn.dataset.video || settings.videoId;
      const playlistIndex = btn.dataset.videoPlaylist;
      if (playlistIndex === undefined && !/^[\w-]{11}$/.test(id)) return;
      previousFocus = document.activeElement;
      const iframe = document.createElement('iframe');
      iframe.title = btn.querySelector('.video-card-title')?.textContent || 'Rozálie Stoklasová piano performance';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = playlistIndex !== undefined ? `https://www.youtube-nocookie.com/embed/videoseries?list=UUG5_aMyEhXXVwi5zO8ttx0g&index=${Number(playlistIndex) + 1}&autoplay=1&rel=0` : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      dialog.querySelector('.video-iframe-holder').replaceChildren(iframe);
      if (playlistIndex !== undefined) configureUploads(iframe, playlistIndex, true);
      dialog.querySelector('.video-external-link').href = playlistIndex !== undefined ? `https://www.youtube.com/playlist?list=UUG5_aMyEhXXVwi5zO8ttx0g` : `https://www.youtube.com/watch?v=${id}`;
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
  document.querySelectorAll('[data-youtube-video]').forEach(el => { el.href = settings.socialLinks.youtube; });
  function renderCurrentAdviserArt() {
    if (page !== 'dutch') return;
    const layer = document.createElement('div');
    layer.className = 'adviser-current-art';layer.setAttribute('aria-hidden', 'true');
    const pieces = [
      { anchor: '#offers', x: -4.646, y: -19.522, width: 32.29, angle: 0, opacity: .31 },
      { anchor: '#audience', x: -12.409, y: -21.8, width: 26.624, angle: -39.768, opacity: .31 },
      { anchor: '#story', x: -9.8565, y: -12.6638, width: 27.6073, angle: 21.0637, opacity: .31 },
      { anchor: '.adviser-opinion h2', x: -3.8458, y: -7.5287, width: 25.944, angle: 0, opacity: .23 }
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
        image.style.opacity = innerWidth <= 1100 ? '.16' : piece.opacity;
        if (piece.anchor) image.style.top = `${document.querySelector(piece.anchor).getBoundingClientRect().top - body.top + piece.y * unit}px`;
        else image.style.bottom = `${piece.bottom * unit}px`;
      });
      const photoRects = [...document.querySelectorAll('.adviser-hero-photo,.adviser-portrait,.adviser-tulips,.adviser-story-crop')].map(photo => { const r = photo.getBoundingClientRect();return `<rect x="${r.left-body.left}" y="${r.top-body.top}" width="${r.width}" height="${r.height}" fill="black"/>`; }).join('');
      const edge = document.body.classList.contains('canvas-fits-viewport') ? '' : `<defs><linearGradient id="edge"><stop stop-color="white" stop-opacity="0"/><stop offset="${44/body.width}" stop-color="white"/><stop offset="${1-44/body.width}" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient></defs>`;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${body.width}" height="${body.height}">${edge}<rect width="100%" height="100%" fill="${edge ? 'url(#edge)' : 'white'}"/>${photoRects}</svg>`;
      layer.style.maskImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    };
    new ResizeObserver(update).observe(document.body);document.fonts.ready.then(update);update();
  }

  const connection = navigator.connection;
  if (connection?.saveData || /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '')) document.querySelectorAll('[data-adaptive-thumbnail]').forEach(img => img.removeAttribute('srcset'));
  const updateEdgeBlend = () => { document.body.style.setProperty('--viewport-width', `${document.documentElement.clientWidth}px`); const main = document.querySelector('main'); document.body.classList.toggle('canvas-fits-viewport', !!main && main.getBoundingClientRect().width >= document.documentElement.clientWidth - 1); };
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
  const endingPlane = document.querySelector('.page-plane');
  if (endingPlane) {
    const updateEndingPlane = () => {
      const reviews = endingPlane.querySelector('.lessons-reviews,.adviser-reviews');
      if (!reviews) return;
      const frame = endingPlane.getBoundingClientRect();
      const top = reviews.getBoundingClientRect().top - frame.top;
      const start = frame.width * .6031;
      const end = start + (frame.height - top) * Math.tan(13 * Math.PI / 180);
      endingPlane.style.setProperty('--ending-top', `${top}px`);
      endingPlane.style.setProperty('--ending-x-start', `${start}px`);
      endingPlane.style.setProperty('--ending-x-end', `${end}px`);
    };
    new ResizeObserver(updateEndingPlane).observe(endingPlane);
    document.fonts.ready.then(updateEndingPlane);
    updateEndingPlane();
  }
  renderForms();
  renderVideoDialog();
  renderPhotoDialog();
  renderCurrentAdviserArt();
  document.querySelectorAll('[data-live-upload]').forEach(button => {
    const iframe = document.createElement('iframe');
    iframe.className = 'youtube-metadata-resolver';
    iframe.title = 'YouTube upload metadata resolver';
    iframe.setAttribute('aria-hidden', 'true'); iframe.tabIndex = -1;
    iframe.style.cssText = 'position:absolute;top:0;left:-10000px;width:200px;height:113px;border:0;pointer-events:none';
    iframe.src = `https://www.youtube-nocookie.com/embed/videoseries?list=${uploads}&rel=0`;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    document.body.append(iframe);
    configureUploads(iframe, button.dataset.liveUpload, false, video => {
      if (!/^[\w-]{11}$/.test(video.video_id)) return;
      button.dataset.video = video.video_id;
      button.setAttribute('aria-label', `Play on YouTube: ${video.title}`);
      button.querySelector('.video-card-title').textContent = video.title;
      const image = button.querySelector('img');
      image.src = `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`;
      if (!navigator.connection?.saveData && !/^(slow-2g|2g|3g)$/.test(navigator.connection?.effectiveType || '')) {
        image.srcset = `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg 480w, https://i.ytimg.com/vi/${video.video_id}/maxresdefault.jpg 1280w`;
        image.sizes = '(max-width: 1100px) 90vw, 450px';
      }
      image.onerror = () => { image.removeAttribute('srcset'); image.onerror = null; image.src = `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`; };
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
})();
