/* BULK ADD — paste a list of creators and add them all at once.
   Accepts the shapes a list actually arrives in: markdown links, bulleted or
   emoji-prefixed lines, "Name | URL", or bare profile URLs. Platform headings
   like "**Facebook**" are ignored, because the platform is detected per URL. */

import { PERMISSIONS, CREATOR_PRIORITIES, FREQUENCIES, PLATFORM_BY_ID } from './constants.js';
import { detectPlatform, esc, guessUsername, normalizeUrl } from './util.js';
import {
  openSheet, field, segmented, selectField, bindSegments, readForm, toast, ICONS, platformIcon,
} from './ui.js';
import * as store from './store.js';

const MD_LINK = /\[([^\]]+)\]\(\s*(https?:\/\/[^)\s]+)\s*\)/g;
const BARE_URL = /(https?:\/\/[^\s<>()[\]|]+)/;

/** Strip bullets, emoji, markdown emphasis and separators from a display name. */
function cleanName(raw) {
  return String(raw || '')
    .replace(/^[\s*_>#•·–—\-|:]+/u, '')
    .replace(/^[^\p{L}\p{N}(]+/u, '')          // leading emoji / stars / numbering
    .replace(/[\s*_|:–—-]+$/u, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Parse pasted text into creator drafts.
 * @returns {{name:string, profileUrl:string, platform:string, username:string}[]}
 */
export function parseCreatorList(text) {
  const out = [];
  const seen = new Set();

  const push = (name, rawUrl) => {
    const profileUrl = normalizeUrl(rawUrl);
    if (!profileUrl) return;
    const key = profileUrl.replace(/\/+$/, '').toLowerCase();
    if (seen.has(key)) return;                 // same link twice in one paste
    seen.add(key);

    const platform = detectPlatform(profileUrl);
    const username = guessUsername(profileUrl);
    const clean = cleanName(name);
    out.push({
      name: clean || username || PLATFORM_BY_ID[platform]?.label || 'Untitled creator',
      profileUrl,
      platform,
      username,
    });
  };

  for (const rawLine of String(text || '').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // 1. markdown links — a line may hold more than one
    let matched = false;
    for (const m of line.matchAll(MD_LINK)) {
      push(m[1], m[2]);
      matched = true;
    }
    if (matched) continue;

    // 2. "Name | URL" / "Name - URL" / "Name URL" / bare URL
    const urlMatch = line.match(BARE_URL);
    if (!urlMatch) continue;                   // headings like "**Facebook**"
    const url = urlMatch[1];
    const before = line.slice(0, urlMatch.index);
    push(before, url);
  }

  return out;
}

function previewHtml(drafts, existingUrls) {
  const rows = drafts.map((d) => {
    const dupe = existingUrls.has(d.profileUrl.replace(/\/+$/, '').toLowerCase());
    return `
      <article class="item" style="padding:11px 12px${dupe ? ';opacity:.5' : ''}">
        <div class="item-head">
          <span class="avatar" style="width:34px;height:34px;border-radius:10px">
            ${platformIcon(d.platform)}</span>
          <div class="item-title">
            <div class="name" style="font-size:14.5px">${esc(d.name)}</div>
            <div class="sub" style="font-size:11.5px">
              ${esc(PLATFORM_BY_ID[d.platform]?.label || 'Other')}${d.username ? ` · @${esc(d.username)}` : ''}
            </div>
          </div>
          ${dupe ? '<span class="pill neutral">Already added</span>' : ''}
        </div>
      </article>`;
  }).join('');

  return `<div class="stack" style="margin-bottom:14px">${rows}</div>`;
}

/**
 * Open the Bulk Add sheet.
 * @returns {Promise<number|undefined>} how many creators were added
 */
export function openBulkAdd() {
  return openSheet({
    title: 'Bulk Add Creators',
    body: `
      <p class="about" style="margin:0 0 12px">
        Paste a list — markdown links, “Name | URL”, or plain profile URLs, one per line.
        Platform and username are detected automatically.
      </p>
      <form id="bulk-form">
        ${field('Creator List', `<textarea id="bulk-text" rows="8" spellcheck="false"
                 data-autofocus placeholder="[Creator Name](https://www.tiktok.com/@handle)
Another Creator | https://www.facebook.com/example
https://www.youtube.com/@somechannel"
                 style="font-family:var(--mono);font-size:13px"></textarea>`)}

        ${field('Permission Status', segmented('permission',
          PERMISSIONS.map((p) => ({ id: p.id, label: p.label, tone: p.tone })), 'approved'))}
        ${field('Priority', segmented('priority',
          CREATOR_PRIORITIES.map((p) => ({ id: p.id, label: p.label, tone: p.tone })), 'normal'))}
        ${field('Check Frequency', selectField('checkFrequency', FREQUENCIES, 'weekly'))}
      </form>
      <div id="bulk-preview"></div>`,
    foot: `<button type="button" class="btn primary" data-parse>
             ${ICONS.search}<span>Preview List</span></button>`,

    onMount(sheet, close) {
      const form = sheet.querySelector('#bulk-form');
      const preview = sheet.querySelector('#bulk-preview');
      const foot = sheet.querySelector('.foot');
      bindSegments(form);

      const existingUrls = new Set(
        store.allCreators()
          .map((c) => (c.profileUrl || '').replace(/\/+$/, '').toLowerCase())
          .filter(Boolean),
      );

      const showPreview = () => {
        const drafts = parseCreatorList(sheet.querySelector('#bulk-text').value);
        if (!drafts.length) {
          toast('No profile links found in that text', 'bad');
          return;
        }

        const fresh = drafts.filter(
          (d) => !existingUrls.has(d.profileUrl.replace(/\/+$/, '').toLowerCase()),
        );

        preview.innerHTML = `
          <div class="section"><h2>Found</h2><div class="rule"></div>
            <span class="count">${drafts.length}</span></div>
          ${previewHtml(drafts, existingUrls)}
          ${drafts.length !== fresh.length
            ? `<p class="about" style="margin:0 0 10px">
                 ${drafts.length - fresh.length} already in your database and will be skipped.
               </p>`
            : ''}`;

        foot.innerHTML = fresh.length
          ? `<button type="button" class="btn primary" data-add>
               ${ICONS.plus}<span>Add ${fresh.length} Creator${fresh.length === 1 ? '' : 's'}</span></button>
             <button type="button" class="btn ghost" data-parse>Re-check List</button>`
          : `<button type="button" class="btn ghost" data-parse>Re-check List</button>`;

        preview.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      const addAll = async () => {
        const settings = readForm(form);
        const drafts = parseCreatorList(sheet.querySelector('#bulk-text').value)
          .filter((d) => !existingUrls.has(d.profileUrl.replace(/\/+$/, '').toLowerCase()));

        let added = 0;
        for (const draft of drafts) {
          await store.saveCreator({
            ...draft,
            permission: settings.permission || 'approved',
            priority: settings.priority || 'normal',
            checkFrequency: settings.checkFrequency || 'weekly',
            creditHandle: draft.username,
            lastChecked: null,
          });
          added += 1;
        }

        toast(`Added ${added} creator${added === 1 ? '' : 's'}`, 'ok');
        close(added);
      };

      sheet.addEventListener('click', (ev) => {
        if (ev.target.closest('[data-parse]')) showPreview();
        else if (ev.target.closest('[data-add]')) addAll();
      });
    },
  });
}
