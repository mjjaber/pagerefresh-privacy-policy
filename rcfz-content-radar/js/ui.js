/* Reusable UI atoms: inline icons, pills, bottom sheets, toasts, confirms.
   Views render HTML strings; interaction runs through delegated data-act. */

import { esc } from './util.js';
import {
  PLATFORM_BY_ID, PERMISSION_BY_ID, CPRIORITY_BY_ID,
  VPRIORITY_BY_ID, VSTATUS_BY_ID,
} from './constants.js';

/* --------------------------------------------------------------- icons -- */

const SVG = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra ? ` ${extra}` : ''}>${d}</svg>`;

export const ICONS = {
  home:      SVG('<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-5h5v5"/>'),
  creators:  SVG('<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/><path d="M16.5 5.6a3.2 3.2 0 0 1 0 5.9"/><path d="M18 14.8c2 .7 3.4 2.4 3.4 4.7"/>'),
  bank:      SVG('<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M10 9.2 15 12l-5 2.8Z"/>'),
  queue:     SVG('<path d="M4 6.5h10"/><path d="M4 12h10"/><path d="M4 17.5h7"/><path d="m16.5 15.5 2.2 2.2 3.3-4"/>'),
  radar:     SVG('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 12 18.5 7"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'),
  play:      SVG('<path d="M7 5.5 19 12 7 18.5Z"/>'),
  external:  SVG('<path d="M14 4.5h5.5V10"/><path d="M19.5 4.5 11 13"/><path d="M18 14v4.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2h4.5"/>'),
  check:     SVG('<path d="m4.5 12.5 5 5 10-11"/>'),
  checkCircle: SVG('<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9"/>'),
  plus:      SVG('<path d="M12 5v14"/><path d="M5 12h14"/>'),
  save:      SVG('<path d="M12 3v11"/><path d="m7.5 10 4.5 4.5L16.5 10"/><path d="M4.5 17.5v2a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-2"/>'),
  more:      SVG('<circle cx="12" cy="5.5" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="18.5" r="1.4" fill="currentColor"/>'),
  back:      SVG('<path d="M15 5 8 12l7 7"/>'),
  chevron:   SVG('<path d="m9 5 7 7-7 7"/>'),
  settings:  SVG('<circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v2.4M12 18.8v2.4M4.5 12H2.1M21.9 12h-2.4M6.7 6.7 5 5M19 19l-1.7-1.7M6.7 17.3 5 19M19 5l-1.7 1.7"/>'),
  search:    SVG('<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4 4"/>'),
  filter:    SVG('<path d="M3.5 6.5h17"/><path d="M6.5 12h11"/><path d="M10 17.5h4"/>'),
  edit:      SVG('<path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17Z"/><path d="m14.5 6.5 3 3"/>'),
  trash:     SVG('<path d="M4.5 6.5h15"/><path d="M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7"/><path d="M6.5 6.5 7.4 20a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.9-13.5"/>'),
  copy:      SVG('<rect x="9" y="9" width="11" height="11" rx="2.2"/><path d="M15 6.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h.5"/>'),
  skip:      SVG('<path d="M5.5 5.5 13 12l-7.5 6.5Z"/><path d="M18.5 5.5v13"/>'),
  clock:     SVG('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.2V12l3.2 2"/>'),
  download:  SVG('<path d="M12 3.5v11"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M4.5 19.5h15"/>'),
  upload:    SVG('<path d="M12 20.5v-11"/><path d="M7.5 13.5 12 9l4.5 4.5"/><path d="M4.5 4.5h15"/>'),
  close:     SVG('<path d="M6 6 18 18"/><path d="M18 6 6 18"/>'),
  spark:     SVG('<path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5L3.5 12 10 10Z"/>'),
  flag:      SVG('<path d="M6 21V4"/><path d="M6 4.5h10.5l-2 3.5 2 3.5H6"/>'),
  link:      SVG('<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7L11.6 6.8"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>'),
};

export const PLATFORM_ICON = {
  facebook:  SVG('<path d="M14.5 21v-8h2.7l.5-3.2h-3.2V7.7c0-.9.3-1.6 1.7-1.6h1.7V3.2A22 22 0 0 0 15.4 3c-2.6 0-4.3 1.6-4.3 4.4v2.4H8.3V13h2.8v8Z"/>'),
  tiktok:    SVG('<path d="M15 3.2c.4 2.4 1.8 3.9 4.2 4.1v2.8c-1.5.1-2.9-.3-4.2-1.1v5.9c0 4.5-4.9 7-8.4 4.3-2.3-1.8-2.3-5.6.4-7.2 1-.6 2.2-.8 3.4-.6v2.9c-1.6-.4-2.6.6-2.4 1.8.2 1.3 1.9 1.8 2.9.9.4-.4.5-.9.5-1.5V3.2Z"/>'),
  youtube:   SVG('<rect x="2.8" y="5.5" width="18.4" height="13" rx="4"/><path d="m10.4 9.6 5 2.4-5 2.4Z"/>'),
  instagram: SVG('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>'),
  other:     SVG('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.5 3.6 5.4 3.6 8.5S14.4 18 12 20.5C9.6 18 8.4 15.1 8.4 12S9.6 6 12 3.5Z"/>'),
};

export const platformIcon = (id) => PLATFORM_ICON[id] || PLATFORM_ICON.other;

/* --------------------------------------------------------------- pills -- */

export function pill(text, tone = 'neutral', extraClass = '') {
  return `<span class="pill ${tone}${extraClass ? ` ${extraClass}` : ''}">${esc(text)}</span>`;
}

export const permissionPill = (id) => {
  const p = PERMISSION_BY_ID[id];
  return p ? pill(p.label, p.tone) : '';
};

export const creatorPriorityPill = (id) => {
  const p = CPRIORITY_BY_ID[id];
  if (!p || id === 'normal') return '';           // normal is the default; don't shout about it
  return pill(`${p.label} Priority`, id === 'high' ? 'hot' : 'neutral');
};

export const videoPriorityPill = (id) => {
  const p = VPRIORITY_BY_ID[id];
  return p ? pill(p.label, p.tone) : '';
};

export const videoStatusPill = (id) => {
  const s = VSTATUS_BY_ID[id];
  return s ? pill(s.label, s.tone) : '';
};

export const platformPill = (id) => {
  const p = PLATFORM_BY_ID[id];
  return p ? pill(p.label, 'neutral') : '';
};

export const duePill = () => `<span class="pill due">Due</span>`;

/* ------------------------------------------------------------ controls -- */

/** Segmented control. `options` = [{id,label,tone?}]. */
export function segmented(name, options, value, { wrap = false } = {}) {
  const buttons = options.map((o) => `
    <button type="button" data-seg="${esc(name)}" data-value="${esc(o.id)}"
            data-tone="${esc(o.tone || '')}"
            aria-pressed="${o.id === value ? 'true' : 'false'}">${esc(o.label)}</button>`).join('');
  return `<div class="seg${wrap ? ' wrap' : ''}" role="group" data-seg-group="${esc(name)}">${buttons}
    <input type="hidden" name="${esc(name)}" value="${esc(value ?? '')}" /></div>`;
}

export function selectField(name, options, value, { placeholder = '' } = {}) {
  const opts = [
    placeholder ? `<option value="">${esc(placeholder)}</option>` : '',
    ...options.map((o) => {
      const id = typeof o === 'string' ? o : o.id;
      const lbl = typeof o === 'string' ? o : o.label;
      return `<option value="${esc(id)}"${id === value ? ' selected' : ''}>${esc(lbl)}</option>`;
    }),
  ].join('');
  return `<select name="${esc(name)}">${opts}</select>`;
}

export function field(labelText, controlHtml, { hint = '', required = false } = {}) {
  return `<div class="field">
    <label>${esc(labelText)}${required ? ' <span class="req">*</span>' : ''}</label>
    ${controlHtml}
    ${hint ? `<p class="hint">${esc(hint)}</p>` : ''}
  </div>`;
}

export const searchInput = (name, placeholder, value = '') => `
  <div class="search-wrap">${ICONS.search}
    <input type="search" name="${esc(name)}" placeholder="${esc(placeholder)}"
           value="${esc(value)}" autocomplete="off" enterkeyhint="search" />
  </div>`;

/* -------------------------------------------------------------- sheets -- */

const sheetRoot = () => document.getElementById('sheet-root');
const openSheets = [];

/* Each open sheet owns one history entry, so the Android back gesture closes the
   sheet instead of leaving the screen behind it.
   pushState and back() are serialised through this queue: back() only takes
   effect on the next task, and interleaving a push with an in-flight back
   silently eats the wrong entry. */

const historyJobs = [];
let historyRunning = false;
let awaitingOurBack = null;

function runHistoryQueue() {
  if (historyRunning) return;
  const job = historyJobs.shift();
  if (!job) return;
  historyRunning = true;
  job(() => { historyRunning = false; runHistoryQueue(); });
}

function pushGuard() {
  historyJobs.push((done) => {
    try { history.pushState({ rcfzSheet: true }, '', location.href); } catch { /* no history */ }
    done();
  });
  runHistoryQueue();
}

/** Remove one guard entry, calling `then` once the browser has actually moved. */
function popGuard(then) {
  historyJobs.push((done) => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      awaitingOurBack = null;
      then?.();
      done();
    };
    awaitingOurBack = finish;
    // Safety net: if popstate never arrives, never wedge the queue.
    setTimeout(finish, 600);
    history.back();
  });
  runHistoryQueue();
}

/**
 * Called by the router before it handles a nav event.
 * @returns {boolean} true when the event was consumed by a sheet.
 */
export function handleSheetPopState() {
  if (awaitingOurBack) { awaitingOurBack(); return true; }
  const entry = openSheets[openSheets.length - 1];
  if (entry) {
    // The browser already consumed this sheet's guard entry.
    entry.dismiss(undefined, false);
    return true;
  }
  return false;
}

/**
 * Open a bottom sheet.
 * `render` receives a `close(result)` fn and returns the inner HTML.
 * Resolves with whatever `close()` is called with (undefined when dismissed).
 */
export function openSheet({ title, body, foot = '', onMount, dismissible = true }) {
  return new Promise((resolve) => {
    const scrim = document.createElement('div');
    scrim.className = 'scrim';

    const sheet = document.createElement('div');
    sheet.className = 'sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.innerHTML = `
      <div class="grip"></div>
      <header>
        <h2>${esc(title)}</h2>
        <button type="button" class="icon-btn" data-sheet-close aria-label="Close">${ICONS.close}</button>
      </header>
      <div class="body">${body}</div>
      ${foot ? `<div class="foot">${foot}</div>` : ''}`;

    let settled = false;
    /**
     * @param {*} result           value the openSheet() promise resolves with
     * @param {boolean} rewind     true when we must give back our history entry
     *                             (false when the browser already took it)
     */
    const dismiss = (result, rewind) => {
      if (settled) return;
      settled = true;
      scrim.remove();
      sheet.remove();
      const i = openSheets.indexOf(entry);
      if (i >= 0) openSheets.splice(i, 1);
      if (!openSheets.length) document.body.style.overflow = '';

      // Resolve only after history has settled, so a caller that navigates
      // straight after closing can't have its navigation undone by our back().
      if (rewind) popGuard(() => resolve(result));
      else resolve(result);
    };
    const close = (result) => dismiss(result, true);
    const entry = { close, dismiss };

    scrim.addEventListener('click', () => { if (dismissible) close(undefined); });
    sheet.querySelector('[data-sheet-close]').addEventListener('click', () => close(undefined));

    sheetRoot().append(scrim, sheet);
    openSheets.push(entry);
    document.body.style.overflow = 'hidden';
    pushGuard();

    if (onMount) onMount(sheet, close);

    // Focus the first meaningful control without yanking the Android keyboard up
    // for read-only sheets.
    const auto = sheet.querySelector('[data-autofocus]');
    if (auto) setTimeout(() => auto.focus(), 60);
  });
}

export function closeTopSheet() {
  const entry = openSheets[openSheets.length - 1];
  if (entry) { entry.close(undefined); return true; }
  return false;
}

export const hasOpenSheet = () => openSheets.length > 0;

/** Action menu (the three-dot menu). Resolves with the chosen action id. */
export function openMenu(title, items) {
  const body = `<div class="menu-list">${items.map((it) => `
    <button type="button" data-menu="${esc(it.id)}" class="${it.danger ? 'danger' : ''}">
      ${it.icon || ''}<span>${esc(it.label)}</span>
    </button>`).join('')}</div>`;

  return openSheet({
    title,
    body,
    onMount(sheet, close) {
      sheet.querySelectorAll('[data-menu]').forEach((btn) => {
        btn.addEventListener('click', () => close(btn.dataset.menu));
      });
    },
  });
}

/** Destructive-action confirm. Resolves true only on explicit confirmation. */
export function confirmSheet({ title, message, confirmLabel = 'Confirm', tone = 'danger' }) {
  return openSheet({
    title,
    body: `<p style="margin:2px 0 14px;color:var(--muted);font-size:14.5px;line-height:1.5">${esc(message)}</p>`,
    foot: `
      <button type="button" class="btn ${tone}" data-confirm>${esc(confirmLabel)}</button>
      <button type="button" class="btn ghost" data-cancel>Cancel</button>`,
    onMount(sheet, close) {
      sheet.querySelector('[data-confirm]').addEventListener('click', () => close(true));
      sheet.querySelector('[data-cancel]').addEventListener('click', () => close(false));
    },
  }).then((r) => r === true);
}

/* -------------------------------------------------------------- toasts -- */

export function toast(message, tone = '') {
  const root = document.getElementById('toast-root');
  // Never let toasts pile up over the action buttons.
  while (root.children.length >= 2) root.firstElementChild.remove();
  const node = document.createElement('div');
  node.className = `toast${tone ? ` ${tone}` : ''}`;
  node.textContent = message;
  root.appendChild(node);
  setTimeout(() => {
    node.classList.add('out');
    setTimeout(() => node.remove(), 240);
  }, 2100);
}

/* --------------------------------------------------------------- forms -- */

/** Wire segmented controls inside a container so they behave like radios. */
export function bindSegments(container) {
  container.querySelectorAll('[data-seg-group]').forEach((group) => {
    group.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-seg]');
      if (!btn || !group.contains(btn)) return;
      group.querySelectorAll('[data-seg]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const hidden = group.querySelector('input[type="hidden"]');
      if (hidden) {
        hidden.value = btn.dataset.value;
        hidden.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
}

/** Read a form into a plain object, trimming strings. */
export function readForm(form) {
  const out = {};
  for (const [key, value] of new FormData(form).entries()) {
    out[key] = typeof value === 'string' ? value.trim() : value;
  }
  return out;
}

export const emptyState = ({ icon = '📡', title, text, actionHtml = '' }) => `
  <div class="empty">
    <div class="big">${esc(icon)}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(text)}</p>
    ${actionHtml}
  </div>`;
