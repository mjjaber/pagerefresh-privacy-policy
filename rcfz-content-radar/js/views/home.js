/* HOME — the daily HUD. Stats, the two big calls to action, and a way back
   into whatever was in progress. */

import * as store from './../store.js';
import { ICONS, emptyState } from './../ui.js';
import { esc, ago, plural, truncate } from './../util.js';
import { go } from './../router.js';

const stat = (n, label, tone = '', hot = false) => `
  <div class="stat ${tone}${hot ? ' is-hot' : ''}">
    <span class="n">${n}</span><span class="l">${esc(label)}</span>
  </div>`;

function resumeCard() {
  const r = store.getResume();
  if (!r) return '';

  let icon = ICONS.radar;
  let head = '';
  let sub = '';
  let route = '';

  if (r.type === 'discovery') {
    const queue = r.queue || [];
    const remaining = Math.max(0, queue.length - (r.index || 0));
    if (!remaining) return '';
    head = 'Discovery session in progress';
    sub = `${plural(remaining, 'creator')} left · ${ago(r.at)}`;
    route = '#/discovery';
  } else if (r.type === 'video') {
    const video = store.getVideo(r.id);
    if (!video) return '';
    icon = ICONS.edit;
    head = video.idea ? truncate(video.idea, 42) : 'Untitled video';
    sub = `Last opened ${ago(r.at)}`;
    route = `#/video/${video.id}`;
  } else if (r.type === 'creators') {
    icon = ICONS.creators;
    head = 'Creators list';
    sub = `Last opened ${ago(r.at)}`;
    route = '#/creators';
  } else {
    return '';
  }

  return `
    <div class="section"><h2>Continue Where You Left Off</h2><div class="rule"></div></div>
    <button type="button" class="resume" data-go="${esc(route)}">
      <span class="ic">${icon}</span>
      <span class="t"><span class="a">${esc(head)}</span><span class="b">${esc(sub)}</span></span>
      <span class="go">${ICONS.chevron}</span>
    </button>`;
}

export function render() {
  const s = store.stats();
  const empty = s.totalCreators === 0 && s.savedVideos === 0;

  return {
    tabbar: true,
    html: `
      <section class="hud-head">
        <div style="display:flex;align-items:flex-start;gap:8px">
          <div style="flex:1;min-width:0">
            <p class="eyebrow">RCFZ · CONTENT OPS</p>
            <h1>RCFZ Content Radar</h1>
          </div>
          <button type="button" class="icon-btn" data-go="#/settings"
                  aria-label="Settings">${ICONS.settings}</button>
        </div>
        <p class="sub">${esc(
          s.due > 0
            ? `${plural(s.due, 'creator')} due for a check.`
            : (s.approvedCreators ? 'All creators checked. Nice.' : 'Add your approved creators to begin.')
        )}</p>
      </section>

      <div class="stats">
        ${stat(s.approvedCreators, 'Approved Creators', 'is-ok')}
        ${stat(s.due, 'Creators Due', s.due ? 'is-accent' : '', s.due > 0)}
        ${stat(s.savedVideos, 'Saved Videos', 'is-tele')}
        ${stat(s.must, 'Must Make', s.must ? 'is-accent' : '', s.must > 0)}
        ${stat(s.editing, 'Editing', 'is-warn')}
        ${stat(s.ready, 'Ready', 'is-ok')}
      </div>

      <div class="cta-stack">
        <button type="button" class="btn primary xl" data-act="discovery">
          ${ICONS.radar}<span>Start Discovery</span></button>
        <button type="button" class="btn tele xl" data-go="#/queue">
          ${ICONS.queue}<span>Open Queue</span></button>
      </div>

      ${resumeCard()}

      ${empty ? `
        <div style="margin-top:22px">
          ${emptyState({
            icon: '🛩️',
            title: 'Nothing loaded yet',
            text: 'Import your creator list, or add your first creator to start the loop.',
            actionHtml: `<div class="btn-row">
              <button type="button" class="btn quiet" data-go="#/settings">Import</button>
              <button type="button" class="btn quiet" data-go="#/creators">Add Creator</button>
            </div>`,
          })}
        </div>` : `
        <div class="section"><h2>Pipeline</h2><div class="rule"></div></div>
        <div class="btn-row three">
          <button type="button" class="btn quiet sm" data-go="#/queue">To Edit · ${s.toEdit}</button>
          <button type="button" class="btn quiet sm" data-go="#/queue">Editing · ${s.editing}</button>
          <button type="button" class="btn quiet sm" data-go="#/queue">Ready · ${s.ready}</button>
        </div>
        <p class="about" style="margin-top:14px">
          <strong>${s.posted}</strong> posted · <strong>${s.totalCreators}</strong> creators tracked ·
          all data stored locally on this device.
        </p>`}
    `,

    mount(root) {
      root.querySelector('[data-act="discovery"]')?.addEventListener('click', async () => {
        const resume = store.getResume();
        const hasSession = resume?.type === 'discovery'
          && Array.isArray(resume.queue)
          && resume.index < resume.queue.length;
        if (!hasSession) await store.setResume(null);
        go('#/discovery');
      });
    },
  };
}
