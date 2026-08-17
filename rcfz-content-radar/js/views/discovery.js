/* DISCOVERY MODE — one creator at a time, no feed, no scrolling.
   The session (ordered ids + position) is persisted so it survives a reload,
   an app switch, or the phone going to sleep mid-run. */

import * as store from './../store.js';
import {
  ICONS, toast, emptyState, permissionPill, creatorPriorityPill, duePill,
} from './../ui.js';
import { PLATFORM_BY_ID } from './../constants.js';
import { esc, ago, isDue, openExternal, plural, fmtDateTime } from './../util.js';
import { openQuickSave } from './../forms.js';
import { go } from './../router.js';

const RESUMABLE = (r) => r?.type === 'discovery' && Array.isArray(r.queue) && r.queue.length > 0;

function loadSession() {
  const resume = store.getResume();
  if (RESUMABLE(resume)) {
    // Drop creators deleted since the session started.
    const queue = resume.queue.filter((id) => store.getCreator(id));
    const index = Math.min(resume.index || 0, queue.length);
    if (queue.length) return { queue, index, savedCount: resume.savedCount || 0 };
  }
  return { queue: store.buildDiscoveryQueue(), index: 0, savedCount: 0 };
}

export function render() {
  let session = loadSession();

  const persist = () => store.setResume({
    type: 'discovery',
    queue: session.queue,
    index: session.index,
    savedCount: session.savedCount,
  });

  const cardHtml = () => {
    const creator = store.getCreator(session.queue[session.index]);
    if (!creator) return doneHtml();

    const pct = Math.round((session.index / session.queue.length) * 100);
    return `
      <div class="disco-progress">
        <span>Creator ${session.index + 1} of ${session.queue.length}</span>
        <span class="bar"><i style="width:${pct}%"></i></span>
      </div>

      <div class="disco-card">
        <p class="plat">${esc(PLATFORM_BY_ID[creator.platform]?.label || 'Other')}</p>
        <h2>${esc(creator.name)}</h2>
        ${creator.username ? `<p class="handle">@${esc(creator.username)}</p>` : ''}
        <div class="meta-row pills">
          ${isDue(creator) ? duePill() : ''}
          ${permissionPill(creator.permission)}
          ${creatorPriorityPill(creator.priority)}
        </div>
        <div class="last">
          LAST CHECKED
          <b>${esc(creator.lastChecked ? ago(creator.lastChecked) : 'Never checked')}</b>
          ${creator.lastChecked ? `<span style="font-size:11px;color:var(--dim)">${esc(fmtDateTime(creator.lastChecked))}</span>` : ''}
        </div>
      </div>

      <div class="disco-actions">
        <button type="button" class="btn primary xl" data-act="open">
          ${ICONS.external}<span>Open Profile</span></button>
        <button type="button" class="btn tele" data-act="save">
          ${ICONS.save}<span>Save Video</span></button>
        <button type="button" class="btn ok" data-act="checked">
          ${ICONS.check}<span>Mark Checked</span></button>
        <div class="btn-row">
          <button type="button" class="btn ghost" data-act="skip">
            ${ICONS.skip}<span>Skip</span></button>
          <button type="button" class="btn ghost" data-act="next">
            <span>Next</span>${ICONS.chevron}</button>
        </div>
      </div>`;
  };

  const doneHtml = () => `
    <div class="disco-done">
      <div class="ring">${ICONS.checkCircle}</div>
      <h2 style="font-size:22px">Sweep complete</h2>
      <p style="color:var(--muted);margin:8px 0 22px;font-size:14px">
        ${esc(session.queue.length ? `${plural(session.queue.length, 'creator')} reviewed` : 'Nothing to review')}${
          session.savedCount ? ` · ${plural(session.savedCount, 'video')} saved` : ''}.
      </p>
      <div class="stack">
        <button type="button" class="btn primary xl" data-act="restart">
          ${ICONS.radar}<span>Run Again</span></button>
        <button type="button" class="btn tele" data-go="#/queue">
          ${ICONS.queue}<span>Open Queue</span></button>
        <button type="button" class="btn ghost" data-go="#/">Back to Home</button>
      </div>
    </div>`;

  const noCreatorsHtml = () => emptyState({
    icon: '📡',
    title: 'No approved creators',
    text: 'Discovery Mode only walks creators with Approved permission. Add some first.',
    actionHtml: `<button type="button" class="btn primary" data-go="#/creators">
      ${ICONS.creators}<span>Go to Creators</span></button>`,
  });

  const initialHtml = session.queue.length
    ? `<div class="disco" id="disco">${cardHtml()}</div>`
    : `<div class="disco" id="disco">${noCreatorsHtml()}</div>`;

  return {
    tabbar: false,
    topbar: {
      title: 'Discovery Mode',
      back: '#/',
      actions: `<button type="button" class="icon-btn" data-act="end" aria-label="End session">
                  ${ICONS.close}</button>`,
    },
    html: initialHtml,

    mount(root) {
      const container = root.querySelector('#disco');

      const paint = () => { container.innerHTML = cardHtml(); };

      const advance = async () => {
        session.index += 1;
        await persist();
        paint();
      };

      const currentCreator = () => store.getCreator(session.queue[session.index]);

      container.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('[data-act]');
        if (!btn) return;
        const act = btn.dataset.act;
        const creator = currentCreator();

        if (act === 'open') {
          if (!creator?.profileUrl) { toast('No profile URL saved', 'bad'); return; }
          openExternal(creator.profileUrl);
          return;
        }

        if (act === 'save') {
          const saved = await openQuickSave({ creatorId: creator?.id || null });
          if (saved) {
            session.savedCount += 1;
            await persist();
          }
          return;   // stay on the same creator — the session is never interrupted
        }

        if (act === 'checked') {
          if (creator) {
            await store.markChecked(creator.id);
            toast(`${creator.name} checked`, 'ok');
          }
          await advance();
          return;
        }

        if (act === 'skip' || act === 'next') {
          await advance();
          return;
        }

        if (act === 'restart') {
          session = { queue: store.buildDiscoveryQueue(), index: 0, savedCount: 0 };
          if (!session.queue.length) { container.innerHTML = noCreatorsHtml(); return; }
          await persist();
          paint();
        }
      });

      // Ending the session clears the resume entry so Home stays honest.
      root.closest('.app')?.querySelector('[data-act="end"]')
        ?.addEventListener('click', async () => {
          await store.setResume(null);
          go('#/');
        });

      persist();
    },
  };
}
