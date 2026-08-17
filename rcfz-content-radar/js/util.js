/* Small, dependency-free helpers. Nothing here touches IndexedDB or the DOM
   structure of a specific view. */

import { FREQ_BY_ID } from './constants.js';

/* --------------------------------------------------------------- ids ---- */

export function uid(prefix = 'x') {
  const rnd = (crypto?.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36))
    .replace(/-/g, '')
    .slice(0, 16);
  return `${prefix}_${rnd}`;
}

/* -------------------------------------------------------------- html ---- */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape a value for interpolation into an HTML template string. */
export function esc(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (c) => ESC[c]);
}

/** Escape for use inside a `"…"` HTML attribute (same rules, kept explicit). */
export const attr = esc;

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* -------------------------------------------------------------- time ---- */

export const nowISO = () => new Date().toISOString();

export function parseDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** YYYY-MM-DD in the device's local timezone (used for backup filenames). */
export function localDateStamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fmtDate(iso) {
  const d = parseDate(iso);
  if (!d) return 'Never';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function fmtDateTime(iso) {
  const d = parseDate(iso);
  if (!d) return 'Never';
  return d.toLocaleString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

/** Whole days elapsed since `iso`. Returns Infinity when never set. */
export function daysSince(iso) {
  const d = parseDate(iso);
  if (!d) return Infinity;
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

/** Human "time ago" tuned for short telemetry lines. */
export function ago(iso) {
  const d = parseDate(iso);
  if (!d) return 'Never';
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (days < 60) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* ---------------------------------------------------------- creators ---- */

/** How many days a creator's check frequency allows between checks. */
export function frequencyDays(creator) {
  const freq = FREQ_BY_ID[creator?.checkFrequency] || FREQ_BY_ID.weekly;
  if (freq.id === 'custom') {
    const n = Number(creator?.customDays);
    return Number.isFinite(n) && n > 0 ? n : 7;
  }
  return freq.days;
}

/** A creator is due when it has never been checked, or the interval elapsed. */
export function isDue(creator) {
  if (!creator?.lastChecked) return true;
  return daysSince(creator.lastChecked) >= frequencyDays(creator);
}

/** Days overdue — negative when the creator is not due yet. Used for sorting. */
export function overdueBy(creator) {
  if (!creator?.lastChecked) return Number.MAX_SAFE_INTEGER;
  return daysSince(creator.lastChecked) - frequencyDays(creator);
}

/* ---------------------------------------------------------- platforms --- */

const PLATFORM_HOST_RULES = [
  [/(^|\.)(facebook\.com|fb\.com|fb\.watch|m\.facebook\.com)$/i, 'facebook'],
  [/(^|\.)(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)$/i,      'tiktok'],
  [/(^|\.)(youtube\.com|youtu\.be|m\.youtube\.com)$/i,           'youtube'],
  [/(^|\.)(instagram\.com|instagr\.am)$/i,                       'instagram'],
];

/** Best-effort platform detection from a pasted URL. Never throws. */
export function detectPlatform(rawUrl) {
  const host = hostOf(rawUrl);
  if (!host) return 'other';
  for (const [re, id] of PLATFORM_HOST_RULES) if (re.test(host)) return id;
  return 'other';
}

export function hostOf(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return '';
  try { return new URL(url).hostname; } catch { return ''; }
}

/** Accepts what a phone clipboard usually holds and returns a usable https URL. */
export function normalizeUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(s)) return `https://${s}`;
  return '';
}

export function isValidUrl(raw) {
  const url = normalizeUrl(raw);
  if (!url) return false;
  try { new URL(url); return true; } catch { return false; }
}

/** Pull a plausible @handle out of a profile URL, for the Add Creator form. */
export function guessUsername(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return '';
  let path;
  try { path = new URL(url).pathname; } catch { return ''; }
  const parts = path.split('/').filter(Boolean);
  if (!parts.length) return '';
  const skip = new Set(['p', 'profile.php', 'pages', 'watch', 'reel', 'reels', 'video',
    'videos', 'shorts', 'channel', 'c', 'user']);
  for (const part of parts) {
    if (skip.has(part.toLowerCase())) continue;
    const clean = part.replace(/^@/, '').split('?')[0]
      // Facebook page slugs carry the numeric page id: "SomePage-61500000000000".
      .replace(/-\d{8,}$/, '');
    if (clean && !/^\d+$/.test(clean)) return clean;
  }
  return '';
}

/* ---------------------------------------------------------- clipboard --- */

export async function copyText(text) {
  const value = String(text ?? '');
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch { /* fall through to the legacy path below */ }

  try {
    const ta = document.createElement('textarea');
    ta.value = value;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export async function readClipboard() {
  try {
    if (navigator.clipboard?.readText) return await navigator.clipboard.readText();
  } catch { /* permission denied / unsupported — caller falls back to manual paste */ }
  return '';
}

/* ------------------------------------------------------------- links ---- */

/** Open a link so Android can hand it to the TikTok/YouTube/Facebook app. */
export function openExternal(rawUrl) {
  const url = normalizeUrl(rawUrl);
  if (!url) return false;
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

/* -------------------------------------------------------------- misc ---- */

export function debounce(fn, ms = 180) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function sortBy(list, ...keyFns) {
  return [...list].sort((a, b) => {
    for (const fn of keyFns) {
      const va = fn(a);
      const vb = fn(b);
      if (va < vb) return -1;
      if (va > vb) return 1;
    }
    return 0;
  });
}

export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function truncate(s, n) {
  const str = String(s || '');
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}

/** Case/accent-insensitive contains, used by every search box. */
export function matches(haystack, needle) {
  if (!needle) return true;
  return String(haystack || '').toLowerCase().includes(String(needle).toLowerCase());
}

export function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
