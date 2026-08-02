/* ============================================================
   JAI Home Care Services — interactions
   Animation by anime.js v4 (vendored at assets/vendor/)
   ============================================================ */

import {
  animate, createTimeline, createDrawable, stagger, onScroll, utils
} from './vendor/anime.esm.min.js';

import { REVIEWS, SHOW_SAMPLE_NOTICE } from './reviews.js';
import { PHONE, ENQUIRY_ENDPOINT } from './config.js';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* ══════════════ reviews ══════════════ */
(function renderReviews () {
  const grid = $('#reviewGrid');
  if (!grid) return;

  if (SHOW_SAMPLE_NOTICE) $('#reviewNotice').hidden = false;

  const star = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 17.3-6.2 3.7 1.7-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.5 4.8 1.7 7z"/></svg>';

  grid.innerHTML = REVIEWS.map(r => `
    <article class="glass rev" data-anim="card">
      <div class="rev__stars" role="img" aria-label="${r.stars} out of 5 stars">${star.repeat(r.stars)}</div>
      <p class="rev__text">“${r.text}”</p>
      <div class="rev__who">
        <img src="${r.avatar}" alt="" width="44" height="44" loading="lazy">
        <div><strong>${r.name}</strong><small>${r.place}</small></div>
      </div>
    </article>`).join('');
})();

/* ══════════════ footer year ══════════════ */
const yr = $('#yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ══════════════ dropdown menus ══════════════
   One controller for every .drop — nav groups and the appearance menu.
   On desktop they float; inside the burger menu the CSS makes them
   expand in place, so the same markup works on every screen.        */
const drops = $$('.drop');

const closeDrops = except => drops.forEach(d => {
  if (d === except) return;
  d.classList.remove('open');
  d.querySelector('button[aria-expanded]')?.setAttribute('aria-expanded', 'false');
});

drops.forEach(drop => {
  const btn = drop.querySelector('button[aria-expanded]');
  if (!btn) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = !drop.classList.contains('open');
    closeDrops(drop);
    drop.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });

  // choosing something closes the menu
  drop.querySelector('.drop__menu')?.addEventListener('click', () => {
    setTimeout(() => { drop.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }, 60);
  });
});

document.addEventListener('click', e => { if (!e.target.closest('.drop')) closeDrops(null); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeDrops(null);
  setMenu(false);
});

/* ══════════════ appearance: calm / warm / dark ══════════════
   Applied by the inline script in <head> before first paint; this only
   wires up the menu and remembers the choice.                       */
(function theme () {
  const root = document.documentElement;
  const meta = $('meta[name="theme-color"]');
  const bar = { calm: '#0A6E86', warm: '#0E9C99', dark: '#071A24' };
  const options = $$('[data-theme-set]');

  const paint = mode => {
    root.dataset.theme = mode;
    if (meta) meta.content = bar[mode] || bar.calm;
    options.forEach(o => o.setAttribute('aria-current', String(o.dataset.themeSet === mode)));
  };

  paint(['calm', 'warm', 'dark'].includes(root.dataset.theme) ? root.dataset.theme : 'calm');

  options.forEach(opt => opt.addEventListener('click', () => {
    const mode = opt.dataset.themeSet;
    root.classList.add('theming');                       // brief colour cross-fade
    paint(mode);
    try { localStorage.setItem('jai-theme', mode); } catch (e) { /* private mode */ }
    setTimeout(() => root.classList.remove('theming'), 400);
  }));

  /* follow the OS only while the visitor has not chosen for themselves */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem('jai-theme'); } catch (err) { /* ignore */ }
    if (!saved) paint(e.matches ? 'dark' : 'calm');
  });
})();

/* ══════════════ share with family ══════════════
   Care decisions get made by families spread across cities, so make
   passing the page on a single tap.                                */
(function share () {
  const btn = $('#shareBtn');
  if (!btn) return;

  const text = 'JAI Home Care Services — 24×7 medical and personal care at home. +91 99903 02693';

  btn.addEventListener('click', async () => {
    const url = location.href.split('?')[0];

    // native share sheet on phones (WhatsApp, SMS, mail…)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'JAI Home Care Services', text, url });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return;             // user dismissed; do nothing
      }
    }

    // desktop: copy the link, fall back to WhatsApp Web
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      const original = btn.getAttribute('aria-label');
      btn.classList.add('is-done');
      btn.setAttribute('aria-label', 'Link copied');
      setTimeout(() => { btn.classList.remove('is-done'); btn.setAttribute('aria-label', original); }, 1800);
    } catch (e) {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`, '_blank', 'noopener');
    }
  });
})();

/* ══════════════ enquiry logging ══════════════
   WhatsApp alone leaves no record — if the visitor never presses send,
   the lead is gone. When an endpoint is configured we also post a copy.
   Deliberately fire-and-forget: a failed log must never delay or block
   the WhatsApp handover, which is the thing the visitor actually wants. */
function logEnquiry (fields) {
  if (!ENQUIRY_ENDPOINT) return;
  try {
    const body = new FormData();
    Object.entries(fields).forEach(([k, v]) => body.append(k, v));
    body.append('page', location.href);
    body.append('at', new Date().toISOString());
    fetch(ENQUIRY_ENDPOINT, { method: 'POST', body, mode: 'no-cors', keepalive: true })
      .catch(() => { /* logging is best-effort */ });
  } catch (e) { /* never let logging break the form */ }
}

/* ══════════════ sticky nav ══════════════ */
const nav = $('#nav');
const onScrollNav = () => nav.classList.toggle('is-stuck', window.scrollY > 8);
onScrollNav();
window.addEventListener('scroll', onScrollNav, { passive: true });

/* ══════════════ mobile menu ══════════════ */
const burger = $('#burger');
const menu = $('#menu');
const setMenu = open => {
  menu.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

/* ══════════════ animation ══════════════ */
if (reduced) {
  // Nothing moves; make sure nothing stays hidden either.
  $$('[data-anim]').forEach(el => el.classList.add('is-in'));
} else {

  /* --- logo draws itself in, once, on load --- */
  if ($('#heroLogoSvg')) {
    animate(createDrawable('#heroLogoSvg path'), {
      draw: ['0 0', '0 1'],
      duration: 1400,
      delay: stagger(90),
      ease: 'inOutQuad'
    });
  }

  /* --- hero entrance timeline --- */
  const tl = createTimeline({ defaults: { ease: 'out(3)', duration: 900 } });

  tl.add('[data-anim="hero"]', {
      opacity: [0, 1],
      y: [26, 0],
      delay: stagger(110),
      onBegin: () => $$('[data-anim="hero"]').forEach(el => el.classList.add('is-in'))
    }, 0)
    .add('[data-anim="hero-title"]', {
      opacity: [0, 1],
      y: [34, 0],
      duration: 1000,
      onBegin: () => $$('[data-anim="hero-title"]').forEach(el => el.classList.add('is-in'))
    }, 80)
    .add('[data-anim="hero-art"]', {
      opacity: [0, 1],
      scale: [.94, 1],
      duration: 1100,
      onBegin: () => $$('[data-anim="hero-art"]').forEach(el => el.classList.add('is-in'))
    }, 220)
    .add('[data-anim="float"]', {
      opacity: [0, 1],
      y: [18, 0],
      delay: stagger(140),
      onBegin: () => $$('[data-anim="float"]').forEach(el => el.classList.add('is-in'))
    }, 620);

  /* --- the two floating cards drift gently, forever --- */
  animate('.float--a', { y: [0, -10], duration: 3200, alternate: true, loop: true, ease: 'inOutSine' });
  animate('.float--b', { y: [0, 10], duration: 3600, alternate: true, loop: true, ease: 'inOutSine', delay: 400 });

  /* --- scroll-triggered reveals --------------------------------
     Grouped per container so cards stagger against their siblings
     rather than against every card on the page.                  */
  const groups = new Map();
  $$('[data-anim="card"], [data-anim="head"], [data-anim="stat"]').forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });

  groups.forEach(els => {
    animate(els, {
      opacity: [0, 1],
      y: [30, 0],
      duration: 800,
      delay: stagger(85),
      ease: 'out(3)',
      onBegin: () => els.forEach(el => el.classList.add('is-in')),
      autoplay: onScroll({ target: els[0], enter: 'bottom-=80 top', once: true })
    });
  });

  /* --- count the stat numbers up --- */
  $$('.stat strong[data-count]').forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const obj = { n: 0 };
    animate(obj, {
      n: target,
      duration: 1600,
      ease: 'out(4)',
      modifier: utils.round(0),
      onUpdate: () => { el.textContent = Math.round(obj.n) + suffix; },
      autoplay: onScroll({ target: el, enter: 'bottom-=60 top', once: true })
    });
  });

  /* --- backstop -------------------------------------------------
     Everything above starts at opacity:0, so a scroll animation that
     never ticks would leave the page blank. This watches each element
     independently and force-shows anything still hidden ~1s after it
     has genuinely come into view. It does not drive the animation —
     it only guarantees the content is readable no matter what.      */
  if ('IntersectionObserver' in window) {
    const guard = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        setTimeout(() => {
          if (getComputedStyle(target).opacity === '0') {
            target.classList.add('is-in');
            target.style.opacity = 1;
            target.style.transform = 'none';
          }
        }, 1000);
        guard.unobserve(target);
      });
    }, { threshold: 0.1 });

    $$('[data-anim]').forEach(el => guard.observe(el));
  } else {
    $$('[data-anim]').forEach(el => el.classList.add('is-in'));
  }
}

/* ══════════════ callback strip ══════════════ */
const cb = $('#callback');
if (cb) {
  cb.addEventListener('input', e => e.target.classList.remove('err'));

  cb.addEventListener('submit', e => {
    e.preventDefault();
    const name = cb.elements.cbname;
    const phone = cb.elements.cbphone;

    let bad = false;
    if (!name.value.trim()) { name.classList.add('err'); bad = true; }
    if (phone.value.replace(/\D/g, '').length < 10) { phone.classList.add('err'); bad = true; }
    if (bad) {
      cb.querySelector('.err').focus();
      if (!reduced) animate(cb, { x: [0, -8, 8, -4, 0], duration: 360, ease: 'out(3)' });
      return;
    }

    logEnquiry({ type: 'callback', name: name.value.trim(), phone: phone.value.trim() });

    const msg = [
      'Hello JAI Home Care Services, please call me back.',
      '',
      `Name: ${name.value.trim()}`,
      `Phone: ${phone.value.trim()}`
    ].join('\n');

    window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
  });
}

/* ══════════════ booking form ══════════════ */
const form = $('#booking');
if (form) {
  const f = form.elements;   // NB: form.name would be the form's own name attribute
  const daysField = f.days;
  const ongoing = f.ongoing;

  const flag = (field, bad) => {
    field.classList.toggle('err', bad);
    field.setAttribute('aria-invalid', String(bad));
  };

  /* quick duration presets */
  const quickBtns = $$('.quick button');
  const syncQuick = () => quickBtns.forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.days === daysField.value)));

  quickBtns.forEach(btn => btn.addEventListener('click', () => {
    daysField.value = btn.dataset.days;
    ongoing.checked = false;
    daysField.disabled = false;
    flag(daysField, false);
    syncQuick();
    if (!reduced) animate(btn, { scale: [1, 1.12, 1], duration: 320, ease: 'out(3)' });
  }));

  daysField.addEventListener('input', syncQuick);

  /* "ongoing" makes the day count irrelevant */
  ongoing.addEventListener('change', () => {
    daysField.disabled = ongoing.checked;
    if (ongoing.checked) { daysField.value = ''; flag(daysField, false); }
    syncQuick();
  });

  form.addEventListener('input', e => {
    if (e.target.classList.contains('err')) flag(e.target, false);
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = f.name.value.trim();
    const phone = f.phone.value.trim();
    const need = f.need.value;
    const days = daysField.value.trim();
    const hours = f.hours.value;

    let bad = false;
    if (!name) { flag(f.name, true); bad = true; }
    if (phone.replace(/\D/g, '').length < 10) { flag(f.phone, true); bad = true; }
    if (!need) { flag(f.need, true); bad = true; }
    if (!hours) { flag(f.hours, true); bad = true; }
    if (!ongoing.checked && (!days || Number(days) < 1)) { flag(daysField, true); bad = true; }

    if (bad) {
      const first = form.querySelector('.err');
      first.focus();
      if (!reduced) animate(form, { x: [0, -9, 9, -5, 0], duration: 380, ease: 'out(3)' });
      return;
    }

    const duration = ongoing.checked
      ? 'Ongoing / not decided yet'
      : `${days} day${Number(days) === 1 ? '' : 's'}`;

    logEnquiry({
      type: 'booking', name, phone, service: need, duration,
      hours, start: f.start.value, area: f.area.value.trim(), note: f.note.value.trim()
    });

    const lines = [
      'Hello JAI Home Care Services, I would like to book care.',
      '',
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Service needed: ${need}`,
      `Duration: ${duration}`,
      `Hours per day: ${hours}`
    ];
    if (f.start.value) lines.push(`Preferred start: ${f.start.value}`);
    if (f.area.value.trim()) lines.push(`Area: ${f.area.value.trim()}`);
    if (f.note.value.trim()) lines.push(`Details: ${f.note.value.trim()}`);

    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(lines.join('\n'))}`,
      '_blank', 'noopener'
    );
  });
}
