/* VIDEO DETAIL — everything about one saved clip, plus the production notes
   that turn it into a finished post. */

import * as store from './../store.js';
import {
  ICONS, videoPriorityPill, videoStatusPill, platformPill, toast, confirmSheet,
  openMenu, emptyState, field,
} from './../ui.js';
import { PLATFORM_BY_ID, VSTATUS_BY_ID } from './../constants.js';
import { esc, fmtDateTime, openExternal, copyText, ago } from './../util.js';
import { openQuickSave } from './../forms.js';
import { back } from './../router.js';

const block = (k, v, { mono = false } = {}) => `
  <div class="detail-block">
    <div class="k">${esc(k)}</div>
    <div class="v${mono ? ' mono' : ''}${v ? '' : ' none'}">${esc(v || 'Not set')}</div>
  </div>`;

const NEXT_ACTION = {
  saved:   { label: 'Start Editing', next: 'editing', cls: 'tele' },
  editing: { label: 'Mark Ready',    next: 'ready',   cls: 'primary' },
  ready:   { label: 'Mark Posted',   next: 'posted',  cls: 'ok' },
};

export function render(params) {
  const video = store.getVideo(params.id);

  if (!video) {
    return {
      tabbar: false,
      topbar: { title: 'Video', back: '#/bank' },
      html: emptyState({
        icon: '🚫',
        title: 'Video not found',
        text: 'It may have been deleted on this device.',
        actionHtml: `<button type="button" class="btn primary" data-go="#/bank">Back to Content Bank</button>`,
      }),
      mount() {},
    };
  }

  const creator = store.getCreator(video.creatorId);
  const credit = video.creditText || store.creditFor(creator);
  const action = NEXT_ACTION[video.status];

  return {
    tabbar: false,
    topbar: {
      title: 'Video Detail',
      back: '#/bank',
      actions: `<button type="button" class="icon-btn" data-menu aria-label="More actions">${ICONS.more}</button>`,
    },
    html: `
      <section class="card" style="margin-bottom:14px">
        <div class="meta-row" style="margin-bottom:10px">
          ${videoPriorityPill(video.priority)}
          ${videoStatusPill(video.status)}
          ${platformPill(video.platform)}
          ${video.category ? `<span class="pill neutral">${esc(video.category)}</span>` : ''}
        </div>
        <h2 style="font-size:20px;line-height:1.25;overflow-wrap:anywhere">
          ${esc(video.idea || 'Untitled video')}</h2>
        <p class="about" style="margin-top:8px">
          ${esc(creator ? creator.name : 'No creator linked')} ·
          saved ${esc(ago(video.dateSaved))}
        </p>
      </section>

      <div class="stack">
        <button type="button" class="btn primary xl" data-act="open-original">
          ${ICONS.play}<span>Open Original</span></button>
        ${creator?.profileUrl ? `
        <button type="button" class="btn quiet" data-act="open-profile">
          ${ICONS.creators}<span>Open Creator Profile</span></button>` : ''}
        ${action ? `
        <button type="button" class="btn ${action.cls}" data-act="advance" data-next="${esc(action.next)}">
          ${ICONS.check}<span>${esc(action.label)}</span></button>` : ''}
      </div>

      ${credit ? `
      <div class="section"><h2>Credit</h2><div class="rule"></div></div>
      <div class="credit-box">
        <span class="txt" data-credit>${esc(credit)}</span>
        <button type="button" data-act="copy-credit">Copy</button>
      </div>` : ''}

      <div class="section"><h2>Details</h2><div class="rule"></div></div>
      <section class="card">
        <div class="kv-grid">
          ${block('Creator', creator ? creator.name : '')}
          ${block('Platform', PLATFORM_BY_ID[video.platform]?.label || 'Other')}
          ${block('Status', VSTATUS_BY_ID[video.status]?.label || '')}
          ${block('Category', video.category)}
          ${block('Date Saved', fmtDateTime(video.dateSaved))}
          ${block('Original Views', video.viewCount)}
        </div>
        ${block('Original Video', video.url, { mono: true })}
        ${creator?.profileUrl ? block('Creator Profile', creator.profileUrl, { mono: true }) : ''}
        ${block('Why It Is Good', video.why)}
        ${video.postedAt ? block('Posted', fmtDateTime(video.postedAt)) : ''}
      </section>

      <div class="section"><h2>Production Notes</h2><div class="rule"></div></div>
      <form id="prod-form" class="card">
        ${field('Hook Idea', `<textarea name="hook" rows="2"
                 placeholder="First 1.5 seconds — what stops the scroll?">${esc(video.hook)}</textarea>`)}
        ${field('Caption Idea', `<textarea name="caption" rows="3"
                 placeholder="Caption to publish with">${esc(video.caption)}</textarea>`)}
        ${field('Editing Notes', `<textarea name="editingNotes" rows="3"
                 placeholder="Cut points, speed ramps, sound">${esc(video.editingNotes)}</textarea>`)}
        ${field('Credit Text', `<input type="text" name="creditText"
                 placeholder="${esc(store.creditFor(creator) || 'Credit: @handle')}"
                 value="${esc(video.creditText)}" />`,
          { hint: 'Leave blank to use the creator’s preferred credit.' })}
        ${field('Notes', `<textarea name="notes" rows="3"
                 placeholder="Anything else">${esc(video.notes)}</textarea>`)}
        <div class="form-actions">
          <button type="button" class="btn primary" data-act="save-notes">
            ${ICONS.check}<span>Save Notes</span></button>
        </div>
      </form>`,

    mount(root, _p, ctx) {
      store.setResume({ type: 'video', id: video.id });

      const form = root.querySelector('#prod-form');
      let dirty = false;
      form?.addEventListener('input', () => { dirty = true; });

      const saveNotes = async ({ quiet = false } = {}) => {
        if (!form) return;
        const data = Object.fromEntries(new FormData(form).entries());
        await store.saveVideo({ ...store.getVideo(video.id), ...data });
        dirty = false;
        if (!quiet) toast('Notes saved', 'ok');
      };

      root.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('[data-act]');
        if (!btn) return;
        const act = btn.dataset.act;

        if (act === 'open-original') {
          if (!video.url) { toast('No URL saved', 'bad'); return; }
          openExternal(video.url);
        } else if (act === 'open-profile') {
          openExternal(creator.profileUrl);
        } else if (act === 'copy-credit') {
          const ok = await copyText(root.querySelector('[data-credit]').textContent);
          toast(ok ? 'Credit copied' : 'Copy blocked — long-press to copy', ok ? 'ok' : 'bad');
        } else if (act === 'advance') {
          if (dirty) await saveNotes({ quiet: true });
          await store.setVideoStatus(video.id, btn.dataset.next);
          toast('Status updated', 'ok');
          ctx.refresh();
        } else if (act === 'save-notes') {
          await saveNotes();
        }
      });

      root.closest('.app')?.querySelector('[data-menu]')?.addEventListener('click', async () => {
        const choice = await openMenu(video.idea || 'Video', [
          { id: 'edit', label: 'Edit Video Details', icon: ICONS.edit },
          { id: 'copy-url', label: 'Copy Original URL', icon: ICONS.link },
          { id: 'skip', label: 'Skip This Video', icon: ICONS.skip },
          { id: 'saved', label: 'Move Back To Saved', icon: ICONS.back },
          { id: 'delete', label: 'Delete Video', icon: ICONS.trash, danger: true },
        ]);

        if (choice === 'edit') {
          if (dirty) await saveNotes({ quiet: true });
          const saved = await openQuickSave({ video: store.getVideo(video.id) });
          if (saved) ctx.refresh();
        } else if (choice === 'copy-url') {
          const ok = await copyText(video.url);
          toast(ok ? 'URL copied' : 'Copy blocked', ok ? 'ok' : 'bad');
        } else if (choice === 'skip') {
          await store.setVideoStatus(video.id, 'skipped');
          toast('Skipped'); ctx.refresh();
        } else if (choice === 'saved') {
          await store.setVideoStatus(video.id, 'saved');
          toast('Moved back to Saved'); ctx.refresh();
        } else if (choice === 'delete') {
          const ok = await confirmSheet({
            title: 'Delete this video?',
            message: 'The saved link, notes and ideas are removed from this device permanently.',
            confirmLabel: 'Delete Video',
          });
          if (ok) {
            await store.deleteVideo(video.id);
            await store.setResume(null);
            toast('Video deleted');
            back('#/bank');
          }
        }
      });

      // Never lose typing to a background/close.
      const flush = () => { if (dirty) saveNotes({ quiet: true }); };
      document.addEventListener('visibilitychange', flush);
      window.addEventListener('pagehide', flush);
      ctx.onLeave(() => {
        flush();
        document.removeEventListener('visibilitychange', flush);
        window.removeEventListener('pagehide', flush);
      });
    },
  };
}
