/* Bootstrap + router.
   Hash routes only, so refreshing or deep-linking any screen on GitHub Pages
   still just loads index.html. */

import * as store from './store.js';
import { ICONS, toast, handleSheetPopState, hasOpenSheet, closeTopSheet } from './ui.js';
import { go, segments, HOME } from './router.js';

import * as home from './views/home.js';
import * as creators from './views/creators.js';
import * as discovery from './views/discovery.js';
import * as bank from './views/bank.js';
import * as queue from './views/queue.js';
import * as video from './views/video.js';
import * as settings from './views/settings.js';

const viewEl = document.getElementById('view');
const topbarEl = document.getElementById('topbar');
const tabbarEl = document.getElementById('tabbar');

const TABS = [
  { hash: '#/',        label: 'Home',     icon: ICONS.home,     match: ['', 'settings'] },
  { hash: '#/creators',label: 'Creators', icon: ICONS.creators, match: ['creators'] },
  { hash: '#/bank',    label: 'Bank',     icon: ICONS.bank,     match: ['bank', 'video'] },
  { hash: '#/queue',   label: 'Queue',    icon: ICONS.queue,    match: ['queue'] },
];

/* ------------------------------------------------------------- routing -- */

function resolve() {
  const [head, ...rest] = segments();
  const [name, query = ''] = (head || '').split('?');
  const params = Object.fromEntries(new URLSearchParams(query));

  switch (name) {
    case '':          return { key: 'home', view: home, params };
    case 'creators':  return { key: 'creators', view: creators, params };
    case 'discovery': return { key: 'discovery', view: discovery, params };
    case 'bank':      return { key: 'bank', view: bank, params };
    case 'queue':     return { key: 'queue', view: queue, params };
    case 'settings':  return { key: 'settings', view: settings, params };
    case 'video':     return { key: `video:${rest[0]}`, view: video, params: { ...params, id: rest[0] } };
    default:          return { key: 'home', view: home, params, redirect: HOME };
  }
}

function renderTabbar(activeName) {
  tabbarEl.hidden = false;
  const s = store.stats();
  const badges = { '#/queue': s.toEdit + s.editing + s.ready, '#/creators': s.due };

  tabbarEl.innerHTML = TABS.map((tab) => {
    const active = tab.match.includes(activeName);
    const badge = badges[tab.hash];
    return `<button type="button" class="tab" data-go="${tab.hash}"
              ${active ? 'aria-current="page"' : ''}>
              ${tab.icon}<span>${tab.label}</span>
              ${badge ? `<span class="badge">${badge > 99 ? '99+' : badge}</span>` : ''}
            </button>`;
  }).join('');
}

function renderTopbar(config) {
  if (!config) { topbarEl.hidden = true; topbarEl.innerHTML = ''; return; }
  topbarEl.hidden = false;
  topbarEl.innerHTML = `
    ${config.back
      ? `<button type="button" class="icon-btn" data-go="${config.back}" data-back
                 aria-label="Back">${ICONS.back}</button>`
      : ''}
    <h1>${config.title || ''}</h1>
    ${config.actions || ''}`;
}

const scrollPositions = new Map();
let current = { key: null, onLeave: [] };
let rendering = false;

async function renderRoute({ force = false } = {}) {
  if (rendering) return;
  const route = resolve();

  if (route.redirect) { go(route.redirect, { replace: true }); return; }
  if (!force && route.key === current.key) return;

  rendering = true;
  try {
    if (current.key) {
      scrollPositions.set(current.key, window.scrollY);
      for (const fn of current.onLeave) { try { fn(); } catch { /* ignore */ } }
    }

    const sameRoute = route.key === current.key;
    // A refresh of the current screen must not jump the user to the top.
    const targetScroll = sameRoute ? window.scrollY : (scrollPositions.get(route.key) ?? 0);

    const output = route.view.render(route.params) || {};
    const onLeave = [];
    const ctx = {
      refresh: () => renderRoute({ force: true }),
      onLeave: (fn) => onLeave.push(fn),
      params: route.params,
    };

    renderTopbar(output.topbar || null);
    viewEl.className = `view${output.tabbar === false ? ' no-tabbar' : ''}`;

    // Each render gets a brand new container element. Views attach delegated
    // listeners to it, so throwing it away also throws away their listeners —
    // re-rendering can never stack duplicate handlers.
    const container = document.createElement('div');
    container.className = 'view-inner';
    container.innerHTML = output.html || '';
    viewEl.replaceChildren(container);

    if (output.tabbar === false) { tabbarEl.hidden = true; }
    else { renderTabbar((segments()[0] || '').split('?')[0]); }

    current = { key: route.key, onLeave };

    output.mount?.(container, route.params, ctx);
    window.scrollTo(0, targetScroll);
  } catch (err) {
    console.error('[RCFZ] render failed', err);
    current = { key: null, onLeave: [] };
    viewEl.innerHTML = `<div class="empty"><div class="big">⚠️</div>
      <h3>Something went wrong</h3>
      <p>${String(err?.message || err)}</p>
      <button type="button" class="btn primary" data-go="#/">Back to Home</button></div>`;
  } finally {
    rendering = false;
  }
}

/* ---------------------------------------------------- global behaviour -- */

document.addEventListener('click', (ev) => {
  const target = ev.target.closest('[data-go]');
  if (!target) return;
  ev.preventDefault();
  go(target.dataset.go);
});

function onNavEvent() {
  if (handleSheetPopState()) return;
  renderRoute();
}

window.addEventListener('hashchange', onNavEvent);
window.addEventListener('popstate', onNavEvent);

// Fired by flows that mutate data from outside the current view's own handlers.
window.addEventListener('rcfz:data-changed', () => renderRoute({ force: true }));

document.addEventListener('keydown', (ev) => {
  if (ev.key === 'Escape' && hasOpenSheet()) {
    ev.preventDefault();
    closeTopSheet();
  }
});

/* Chrome fires this instead of showing its own install UI. */
window.addEventListener('beforeinstallprompt', (ev) => {
  ev.preventDefault();
  window.__rcfzInstallPrompt = ev;
  document.getElementById('install-btn')?.removeAttribute('hidden');
});

/* -------------------------------------------------------- service worker */

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol === 'file:') return;
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
    reg.addEventListener('updatefound', () => {
      const sw = reg.installing;
      sw?.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          toast('Update ready — reopen the app');
        }
      });
    });
  } catch (err) {
    console.warn('[RCFZ] service worker registration failed', err);
  }
}

/* ----------------------------------------------------------------- boot -- */

async function boot() {
  try {
    await store.init();
  } catch (err) {
    console.error('[RCFZ] database failed to open', err);
    viewEl.innerHTML = `<div class="empty"><div class="big">🗄️</div>
      <h3>Local storage unavailable</h3>
      <p>RCFZ Content Radar needs IndexedDB. Private browsing or blocked site data
         will prevent it from working.</p></div>`;
    return;
  }

  if (!location.hash) go(HOME, { replace: true });
  await renderRoute({ force: true });
  registerServiceWorker();
}

boot();
