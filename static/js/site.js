/* Rozálie Stoklasová — common site UI, navigation, footer and lightweight interactions.
   Edit socialLinks and pressKitUrl in one place. No form backend is included. */
(() => {
  'use strict';
  const script = document.currentScript;
  const root = new URL('../../', script.src);
  const url = (path = '') => new URL(path, root).href;
  const asset = (path) => url('static/' + path);
  const page = document.body.dataset.page || 'home';
  const darkHeader = ['about', 'dutch'].includes(page);
  const darkFooter = ['home', 'about', 'dutch'].includes(page);
  const videoId = 'S_CacDghMmc';

  const settings = {
    email: 'rozalie.stoklasova@gmail.com',
    videoId,
    // Only the YouTube destination was embedded in the original PDF.
    // Add verified artist-profile URLs here. Other controls explain this gracefully.
    socialLinks: {
      youtube: `https://www.youtube.com/watch?v=${videoId}`,
      instagram: null,
      facebook: null,
      linkedin: null,
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
  const socialLabels = { youtube: 'YouTube', instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn' };
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
    const logoFile = darkHeader ? 'logo-cream.svg' : 'logo-dark.svg';
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
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      el.classList.toggle('nav-open', open);
      document.body.classList.toggle('nav-open-body', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    navEl.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setOpen(false); });
    document.addEventListener('click', (event) => { if (!el.contains(event.target)) setOpen(false); });
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
            <p>© ${new Date().getFullYear()} <strong>Rozálie Stoklasová.</strong> All rights reserved.</p>
            <p><a href="${url('privacy-policy/')}">Privacy policy</a> <span aria-hidden="true">&amp;</span> <a href="${url('terms-of-service/')}">Terms of service</a></p>
          </div>
          <div class="footer-right"><a class="footer-email" href="mailto:${settings.email}">${settings.email}</a>
            <div class="footer-social">${['youtube', 'instagram', 'facebook', 'linkedin'].map(s => socialIcon(s)).join('')}</div>
          </div>
        </div>
      </footer>`;
  }

  function renderForms() {
    document.querySelectorAll('[data-contact-form]').forEach((el, index) => {
      const compact = el.dataset.variant === 'dark';
      const prefix = `contact-${index}`;
      el.innerHTML = `<form class="contact-form${compact ? ' contact-form-dark' : ''}" aria-label="Contact request (preview only)" novalidate>
        <h3>Send request</h3>
        <div class="form-grid">
          <div class="form-group"><label for="${prefix}-name">Full name <span class="required">*</span></label><input id="${prefix}-name" name="name" autocomplete="name" type="text" /></div>
          <div class="form-group"><label for="${prefix}-email">Email address <span class="required">*</span></label><input id="${prefix}-email" name="email" autocomplete="email" type="email" /></div>
          <div class="form-group"><label for="${prefix}-interest">Primary interest</label><select id="${prefix}-interest" name="interest">
            <option value="">Select an option</option>
            <option value="piano-lessons">Piano lessons in Maastricht</option>
            <option value="online-lessons">Online piano lessons</option>
            <option value="dutch-study">Dutch study advising</option>
            <option value="press-kit">Press and performances</option>
            <option value="other">Other inquiry</option>
          </select></div>
          <div class="form-group"><label for="${prefix}-phone">Phone number</label><input id="${prefix}-phone" name="phone" type="tel" autocomplete="tel" /></div>
          <div class="form-group form-full"><label for="${prefix}-message">Message <span class="required">*</span></label><textarea id="${prefix}-message" name="message" rows="5"></textarea></div>
        </div>
        <div class="form-action"><button class="button button-primary form-submit-preview" type="button" aria-describedby="${prefix}-status">${compact ? 'Send message' : 'Submit'}</button></div>
        <p class="form-status" id="${prefix}-status" role="status" aria-live="polite"></p>
      </form>`;
      const selectedInterest = new URLSearchParams(window.location.search).get('interest');
      if (selectedInterest) {
        const select = el.querySelector('select[name="interest"]');
        if ([...select.options].some(option => option.value === selectedInterest)) select.value = selectedInterest;
      }
      el.querySelector('button.form-submit-preview').addEventListener('click', () => {
        const status = el.querySelector('.form-status');
        status.textContent = 'Online submission is not connected yet. Please contact Rozálie by email.';
        status.classList.add('is-visible');
      });
      el.querySelector('form').addEventListener('submit', event => event.preventDefault());
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
    const close = () => { dialog.hidden = true; dialog.querySelector('.video-iframe-holder').replaceChildren(); document.body.classList.remove('modal-open'); previousFocus?.focus(); };
    dialog.querySelector('.video-close').addEventListener('click', close);
    dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && !dialog.hidden) close(); });
    document.querySelectorAll('[data-video]').forEach(btn => btn.addEventListener('click', () => {
      const id = btn.dataset.videoId || settings.videoId;
      if (!/^[\w-]{11}$/.test(id)) return;
      previousFocus = document.activeElement;
      const iframe = document.createElement('iframe');
      iframe.title = 'Rozálie Stoklasová piano performance';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      dialog.querySelector('.video-iframe-holder').replaceChildren(iframe);
      dialog.querySelector('.video-external-link').href = `https://www.youtube.com/watch?v=${id}`;
      dialog.hidden = false;
      document.body.classList.add('modal-open');
      dialog.querySelector('.video-close').focus();
    }));
  }

  function renderToast() {
    const el = document.createElement('div');
    el.className = 'site-toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
    let timeout;
    document.addEventListener('click', event => {
      const button = event.target.closest('[data-pending-social]');
      if (!button) return;
      el.textContent = `${button.dataset.pendingSocial} profile URL has not been provided yet.`;
      el.classList.add('visible');
      clearTimeout(timeout);
      timeout = setTimeout(() => el.classList.remove('visible'), 3900);
    });
  }
  document.querySelectorAll('[data-press-kit]').forEach(el => { el.href = settings.pressKitUrl; });
  document.querySelectorAll('[data-youtube-video]').forEach(el => { el.href = settings.socialLinks.youtube; });
  renderHeader();
  renderSocialRail();
  renderFooter();
  renderForms();
  renderVideoDialog();
  renderToast();
})();
