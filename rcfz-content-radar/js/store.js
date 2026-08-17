/* Domain layer.
   Loads everything into memory once at boot (a personal database is tiny) so
   every screen renders instantly, and write-throughs keep IndexedDB in sync. */

import * as db from './db.js';
import { STORES } from './db.js';
import {
  BACKUP_KIND, BACKUP_VERSION, DEFAULT_CATEGORIES,
  PLATFORM_BY_ID, PERMISSION_BY_ID, CPRIORITY_BY_ID, FREQ_BY_ID,
  VPRIORITY_BY_ID, VSTATUS_BY_ID,
} from './constants.js';
import {
  uid, nowISO, detectPlatform, normalizeUrl, overdueBy, isDue, sortBy,
} from './util.js';

const cache = { creators: new Map(), videos: new Map(), meta: new Map(), ready: false };
const listeners = new Set();

/* --------------------------------------------------------------- boot -- */

export async function init() {
  const [creators, videos, meta] = await Promise.all([
    db.getAll(STORES.creators),
    db.getAll(STORES.videos),
    db.getAll(STORES.meta),
  ]);
  cache.creators = new Map(creators.map((c) => [c.id, normalizeCreator(c)]));
  cache.videos = new Map(videos.map((v) => [v.id, normalizeVideo(v)]));
  cache.meta = new Map(meta.map((m) => [m.key, m.value]));
  cache.ready = true;
}

export const isReady = () => cache.ready;

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() { for (const fn of listeners) fn(); }

/* --------------------------------------------------------- normalizing -- */

const pick = (map, value, fallback) => (map[value] ? value : fallback);

export function normalizeCreator(raw = {}) {
  const dateAdded = raw.dateAdded || nowISO();
  return {
    id: raw.id || uid('c'),
    name: String(raw.name || '').trim() || 'Untitled creator',
    platform: pick(PLATFORM_BY_ID, raw.platform, 'other'),
    profileUrl: normalizeUrl(raw.profileUrl) || String(raw.profileUrl || '').trim(),
    username: String(raw.username || '').trim().replace(/^@/, ''),
    permission: pick(PERMISSION_BY_ID, raw.permission, 'approved'),
    priority: pick(CPRIORITY_BY_ID, raw.priority, 'normal'),
    checkFrequency: pick(FREQ_BY_ID, raw.checkFrequency, 'weekly'),
    customDays: Number.isFinite(Number(raw.customDays)) && Number(raw.customDays) > 0
      ? Number(raw.customDays) : null,
    lastChecked: raw.lastChecked || null,
    dateAdded,
    notes: String(raw.notes || ''),
    creditName: String(raw.creditName || '').trim(),
    creditHandle: String(raw.creditHandle || '').trim().replace(/^@/, ''),
    updatedAt: raw.updatedAt || dateAdded,
  };
}

export function normalizeVideo(raw = {}) {
  const dateSaved = raw.dateSaved || nowISO();
  const url = normalizeUrl(raw.url) || String(raw.url || '').trim();
  return {
    id: raw.id || uid('v'),
    url,
    creatorId: raw.creatorId || null,
    platform: pick(PLATFORM_BY_ID, raw.platform, detectPlatform(url)),
    idea: String(raw.idea || '').trim(),
    why: String(raw.why || ''),
    category: String(raw.category || ''),
    priority: pick(VPRIORITY_BY_ID, raw.priority, 'good'),
    status: pick(VSTATUS_BY_ID, raw.status, 'saved'),
    viewCount: String(raw.viewCount || '').trim(),
    dateSaved,
    notes: String(raw.notes || ''),
    hook: String(raw.hook || ''),
    caption: String(raw.caption || ''),
    editingNotes: String(raw.editingNotes || ''),
    creditText: String(raw.creditText || ''),
    postedAt: raw.postedAt || null,
    updatedAt: raw.updatedAt || dateSaved,
  };
}

/* ------------------------------------------------------------ creators -- */

export const allCreators = () => [...cache.creators.values()];
export const getCreator = (id) => (id ? cache.creators.get(id) || null : null);

export async function saveCreator(input) {
  const existing = input.id ? cache.creators.get(input.id) : null;
  const creator = normalizeCreator({ ...existing, ...input, updatedAt: nowISO() });
  cache.creators.set(creator.id, creator);
  await db.put(STORES.creators, creator);
  emit();
  return creator;
}

export async function markChecked(id, when = nowISO()) {
  const creator = cache.creators.get(id);
  if (!creator) return null;
  return saveCreator({ ...creator, lastChecked: when });
}

export async function deleteCreator(id) {
  const detached = await db.deleteCreatorCascade(id);
  cache.creators.delete(id);
  for (const [vid, v] of cache.videos) {
    if (v.creatorId === id) cache.videos.set(vid, { ...v, creatorId: null });
  }
  emit();
  return detached;
}

/** Display name used on cards and in credits. */
export const creatorLabel = (creator) =>
  creator ? (creator.name || creator.username || 'Unknown creator') : 'No creator';

/** `Credit: @handle` — prefers the creator's preferred credit fields. */
export function creditFor(creator) {
  if (!creator) return '';
  const handle = creator.creditHandle || creator.username;
  if (handle) return `Credit: @${handle}`;
  const name = creator.creditName || creator.name;
  return name ? `Credit: ${name}` : '';
}

/* --------------------------------------------------- creator ordering -- */

export const CREATOR_SORTS = [
  { id: 'due',      label: 'Due First' },
  { id: 'never',    label: 'Never Checked' },
  { id: 'oldest',   label: 'Oldest Checked' },
  { id: 'newest',   label: 'Newest Checked' },
  { id: 'priority', label: 'Priority' },
  { id: 'alpha',    label: 'Alphabetical' },
];

const PRIORITY_RANK = { high: 0, normal: 1, low: 2 };
const lastCheckedMs = (c) => (c.lastChecked ? new Date(c.lastChecked).getTime() : null);
const nameKey = (c) => (c.name || '').toLowerCase();

export function sortCreators(list, mode = 'due') {
  switch (mode) {
    case 'never':
      // Never-checked first, then the longest-neglected.
      return sortBy(list, (c) => (c.lastChecked ? 1 : 0), (c) => lastCheckedMs(c) ?? 0, nameKey);
    case 'oldest':
      return sortBy(list, (c) => lastCheckedMs(c) ?? -1, nameKey);
    case 'newest':
      return [...list].sort((a, b) => (lastCheckedMs(b) ?? -1) - (lastCheckedMs(a) ?? -1)
        || nameKey(a).localeCompare(nameKey(b)));
    case 'priority':
      return sortBy(list, (c) => PRIORITY_RANK[c.priority] ?? 1, (c) => -overdueBy(c), nameKey);
    case 'alpha':
      return sortBy(list, nameKey);
    case 'due':
    default:
      // Due creators first; inside each group the most overdue wins, and
      // never-checked creators sort to the very top by construction.
      return [...list].sort((a, b) => {
        const dueDiff = Number(isDue(b)) - Number(isDue(a));
        if (dueDiff) return dueDiff;
        const over = overdueBy(b) - overdueBy(a);
        if (over) return over;
        return nameKey(a).localeCompare(nameKey(b));
      });
  }
}

export const dueCreators = () => allCreators().filter((c) => c.permission === 'approved' && isDue(c));

/* -------------------------------------------------------------- videos -- */

export const allVideos = () => [...cache.videos.values()];
export const getVideo = (id) => (id ? cache.videos.get(id) || null : null);

export async function saveVideo(input) {
  const existing = input.id ? cache.videos.get(input.id) : null;
  const merged = { ...existing, ...input };

  // Keep a stored credit line in step with the creator unless it was edited.
  if (!merged.creditText && merged.creatorId) {
    merged.creditText = creditFor(getCreator(merged.creatorId));
  }
  merged.postedAt = merged.status === 'posted'
    ? (merged.postedAt || existing?.postedAt || nowISO())
    : null;

  const video = normalizeVideo({ ...merged, updatedAt: nowISO() });
  cache.videos.set(video.id, video);
  await db.put(STORES.videos, video);
  emit();
  return video;
}

export async function setVideoStatus(id, status) {
  const video = cache.videos.get(id);
  if (!video) return null;
  return saveVideo({ ...video, status });
}

export async function deleteVideo(id) {
  await db.deleteVideo(id);
  cache.videos.delete(id);
  emit();
}

/** Must Make → Good → Maybe, newest saved first inside each band. */
export function sortVideosDefault(list) {
  const rank = { must: 0, good: 1, maybe: 2 };
  return [...list].sort((a, b) => {
    const p = (rank[a.priority] ?? 3) - (rank[b.priority] ?? 3);
    if (p) return p;
    return new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime();
  });
}

export const videosByStatus = (status) => allVideos().filter((v) => v.status === status);

/* ----------------------------------------------------------- discovery -- */

/** Ordered creator ids for a Discovery session. */
export function buildDiscoveryQueue() {
  const approved = allCreators().filter((c) => c.permission === 'approved');
  const bonus = { high: 5, normal: 0, low: -5 };
  const score = (c) => {
    const base = c.lastChecked ? overdueBy(c) : Number.MAX_SAFE_INTEGER / 2;
    return base + (bonus[c.priority] ?? 0);
  };
  const ranked = [...approved].sort((a, b) => {
    const dueDiff = Number(isDue(b)) - Number(isDue(a));
    if (dueDiff) return dueDiff;
    const s = score(b) - score(a);
    if (s) return s;
    return nameKey(a).localeCompare(nameKey(b));
  });
  return ranked.map((c) => c.id);
}

/* ------------------------------------------------------------- meta kv -- */

export const getMeta = (key, fallback = null) =>
  (cache.meta.has(key) ? cache.meta.get(key) : fallback);

export async function setMeta(key, value) {
  cache.meta.set(key, value);
  await db.put(STORES.meta, { key, value });
  return value;
}

export async function deleteMeta(key) {
  cache.meta.delete(key);
  await db.remove(STORES.meta, key);
}

/* --------------------------------------------------------- categories -- */

export function categories() {
  const custom = getMeta('customCategories', []) || [];
  return [...DEFAULT_CATEGORIES, ...custom.filter((c) => !DEFAULT_CATEGORIES.includes(c))];
}

export async function addCategory(name) {
  const clean = String(name || '').trim();
  if (!clean || categories().includes(clean)) return categories();
  const custom = [...(getMeta('customCategories', []) || []), clean];
  await setMeta('customCategories', custom);
  emit();
  return categories();
}

/* ------------------------------------------------------------- resume -- */

export const RESUME_KEY = 'resume';

export async function setResume(entry) {
  await setMeta(RESUME_KEY, entry ? { ...entry, at: nowISO() } : null);
}

export const getResume = () => getMeta(RESUME_KEY, null);

/* ------------------------------------------------------------- backup -- */

export function buildBackup() {
  return {
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: nowISO(),
    counts: { creators: cache.creators.size, videos: cache.videos.size },
    data: {
      creators: allCreators(),
      videos: allVideos(),
      categories: getMeta('customCategories', []) || [],
      settings: Object.fromEntries([...cache.meta].filter(([k]) => k !== RESUME_KEY)),
    },
  };
}

/** Parse + validate a backup file. Throws a human-readable Error on failure. */
export function parseBackup(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('That file is not valid JSON.');
  }
  if (!parsed || typeof parsed !== 'object') throw new Error('That file is not a backup.');

  // Accept both a full backup envelope and a bare seed file
  // ({ creators: [...] } or a plain array of creators).
  let creators = [];
  let videos = [];
  let settings = {};
  let cats = [];

  if (Array.isArray(parsed)) {
    creators = parsed;
  } else if (parsed.data && typeof parsed.data === 'object') {
    if (parsed.kind && parsed.kind !== BACKUP_KIND) {
      throw new Error('That backup was made by a different app.');
    }
    creators = parsed.data.creators || [];
    videos = parsed.data.videos || [];
    settings = parsed.data.settings || {};
    cats = parsed.data.categories || [];
  } else if (Array.isArray(parsed.creators) || Array.isArray(parsed.videos)) {
    creators = parsed.creators || [];
    videos = parsed.videos || [];
    cats = parsed.categories || [];
  } else {
    throw new Error('No creators or videos found in that file.');
  }

  if (!Array.isArray(creators) || !Array.isArray(videos)) {
    throw new Error('The creators or videos section is malformed.');
  }
  if (!creators.length && !videos.length) {
    throw new Error('That file contains no creators and no videos.');
  }

  return {
    creators: creators.map(normalizeCreator),
    videos: videos.map(normalizeVideo),
    categories: Array.isArray(cats) ? cats.map(String) : [],
    settings: settings && typeof settings === 'object' ? settings : {},
  };
}

function metaRecordsFrom(payload, existingCustom = []) {
  const custom = [...new Set([...existingCustom, ...payload.categories])];
  const records = [{ key: 'customCategories', value: custom }];
  for (const [key, value] of Object.entries(payload.settings)) {
    if (key === RESUME_KEY || key === 'customCategories') continue;
    records.push({ key, value });
  }
  return records;
}

/** Add/overwrite by id, keeping everything already stored. */
export async function importMerge(payload) {
  const meta = metaRecordsFrom(payload, getMeta('customCategories', []) || []);
  await db.mergeAll({ creators: payload.creators, videos: payload.videos, meta });
  await init();
  emit();
  return { creators: payload.creators.length, videos: payload.videos.length };
}

/** Wipe the local database and install the backup exactly as it is. */
export async function importReplace(payload) {
  const meta = metaRecordsFrom(payload, []);
  await db.replaceAll({ creators: payload.creators, videos: payload.videos, meta });
  await init();
  emit();
  return { creators: payload.creators.length, videos: payload.videos.length };
}

export async function wipeAll() {
  await db.replaceAll({ creators: [], videos: [], meta: [] });
  await init();
  emit();
}

/* --------------------------------------------------------------- stats -- */

export function stats() {
  const creators = allCreators();
  const videos = allVideos();
  const approved = creators.filter((c) => c.permission === 'approved');
  return {
    approvedCreators: approved.length,
    totalCreators: creators.length,
    due: approved.filter(isDue).length,
    savedVideos: videos.length,
    must: videos.filter((v) => v.priority === 'must' && v.status !== 'posted' && v.status !== 'skipped').length,
    editing: videos.filter((v) => v.status === 'editing').length,
    ready: videos.filter((v) => v.status === 'ready').length,
    toEdit: videos.filter((v) => v.status === 'saved').length,
    posted: videos.filter((v) => v.status === 'posted').length,
  };
}
