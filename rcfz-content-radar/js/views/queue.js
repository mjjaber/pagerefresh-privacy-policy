/* QUEUE — the production pipeline: To Edit → Editing → Ready To Post.
   Posted and Skipped videos stay out of the way. */

import * as store from './../store.js';
import {
  ICONS, platformIcon, videoPriorityPill, toast, emptyState, openMenu, confirmSheet,
} from './../ui.js';
import { PLATFORM_BY_ID } from './../constants.js';
import { esc, ago, openExternal, plural, truncate } from './../util.js';
import { openQuickSave } from './../forms.js';
import { go } from './../router.js';

const SECTIONS = [
  { status: 'saved',   title: 'To Edit',      action: 'Start Editing', next: 'editing', tone: 'tele'    },
  { status: 'editing', title: 'Editing',      action: 'Mark Ready',    next: 'ready',   tone: 'primary' },
  { status: 'ready',   title: 'Ready To Post',action: 'Mark Posted',   next: 'posted',  tone: 'ok'      },
];

function queueCard(video, section) {
  const creator = store.getCreator(video.creatorId);
  const hot = video.priority === 'must';

  return `
    <article class="item vcard${hot ? ' flag-hot' : ''}" data-video="${esc(video.id)}">
      <div class="item-head">
        <span class="avatar">${platformIcon(video.platform)}</span>
        <div class="item-title">
          <div class="name">${esc(creator ? creator.name : 'No creator')}</div>
          <div class="sub">${esc(PLATFORM_BY_ID[video.platform]?.label || 'Other')} · saved ${esc(ago(video.dateSaved))}</div>
        </div>
        <button type="button" class="icon-btn" data-menu-video="${esc(video.id)}"
                aria-label="More actions">${ICONS.more}</button>
      </div>

      <div style="margin-top:9px">
        <div class="idea${video.idea ? '' : ' empty'}">${esc(video.idea || truncate(video.url, 46))}</div>
        <div class="meta-row">
          ${videoPriorityPill(video.priority)}
          ${video.category ? `<span class="pill neutral">${esc(video.category)}</span>` : ''}
        </div>
      </div>

      <div class="stack" style="margin-top:11px">
        <button type="button" class="btn ${section.tone}" data-advance="${esc(video.id)}"
                data-next="${esc(section.next)}">${esc(section.action)}</button>
        <div class="btn-row three">
          <button type="button" class="btn quiet sm" data-open="${esc(video.id)}">Original</button>
          <button type="button" class="btn quiet sm" data-detail="${esc(video.id)}">Details</button>
          <button type="button" class="btn quiet sm" data-skip="${esc(video.id)}">Skip</button>
        </div>
      </div>
    </article>`;
}

export function render() {
  const active = store.allVideos().filter((v) => v.status !== 'posted' && v.status !== 'skipped');
  const total = active.length;

  const sectionsHtml = SECTIONS.map((section) => {
    const items = store.sortVideosDefault(active.filter((v) => v.status === section.status));
    return `
      <div class="section">
        <h2>${esc(section.title)}</h2><div class="rule"></div>
        <span class="count">${items.length}</span>
      </div>
      <div class="stack">
        ${items.length
          ? items.map((v) => queueCard(v, section)).join('')
          : `<p class="about" style="padding:4px 2px 6px">Nothing here right now.</p>`}
      </div>`;
  }).join('');

  return {
    tabbar: true,
    topbar: {
      title: 'Queue',
      actions: `<button type="button" class="icon-btn" data-quick-save
                        aria-label="Quick save a video">${ICONS.plus}</button>`,
    },
    html: total
      ? `<div class="list-meta"><span>${plural(total, 'video')} in production</span>
           <span>Must Make first</span></div>${sectionsHtml}`
      : emptyState({
          icon: '🎬',
          title: 'Queue is clear',
          text: 'Save some videos in Discovery Mode and they land here ready to edit.',
          actionHtml: `<div class="stack">
            <button type="button" class="btn primary" data-go="#/discovery">
              ${ICONS.radar}<span>Start Discovery</span></button>
            <button type="button" class="btn quiet" data-quick-save>
              ${ICONS.save}<span>Quick Save a Video</span></button>
          </div>`,
        }),

    mount(root, _p, ctx) {
      const rerender = () => ctx.refresh();

      document.querySelectorAll('[data-quick-save]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const saved = await openQuickSave({});
          if (saved) rerender();
        });
      });

      root.addEventListener('click', async (ev) => {
        const advanceBtn = ev.target.closest('[data-advance]');
        if (advanceBtn) {
          const next = advanceBtn.dataset.next;
          await store.setVideoStatus(advanceBtn.dataset.advance, next);
          toast(next === 'editing' ? 'Moved to Editing'
            : next === 'ready' ? 'Ready to post' : 'Marked posted', 'ok');
          rerender();
          return;
        }

        const openBtn = ev.target.closest('[data-open]');
        if (openBtn) {
          const video = store.getVideo(openBtn.dataset.open);
          if (!video?.url) { toast('No URL saved', 'bad'); return; }
          openExternal(video.url);
          return;
        }

        const detailBtn = ev.target.closest('[data-detail]');
        if (detailBtn) { go(`#/video/${detailBtn.dataset.detail}`); return; }

        const skipBtn = ev.target.closest('[data-skip]');
        if (skipBtn) {
          await store.setVideoStatus(skipBtn.dataset.skip, 'skipped');
          toast('Skipped — still in the Content Bank');
          rerender();
          return;
        }

        const menuBtn = ev.target.closest('[data-menu-video]');
        if (menuBtn) {
          const video = store.getVideo(menuBtn.dataset.menuVideo);
          if (!video) return;
          const choice = await openMenu(video.idea || 'Video', [
            { id: 'detail', label: 'Open Details', icon: ICONS.spark },
            { id: 'edit', label: 'Edit Details', icon: ICONS.edit },
            { id: 'back', label: 'Move Back To Saved', icon: ICONS.back },
            { id: 'posted', label: 'Mark Posted', icon: ICONS.checkCircle },
            { id: 'delete', label: 'Delete Video', icon: ICONS.trash, danger: true },
          ]);

          if (choice === 'detail') go(`#/video/${video.id}`);
          else if (choice === 'edit') {
            const saved = await openQuickSave({ video });
            if (saved) rerender();
          } else if (choice === 'back') {
            await store.setVideoStatus(video.id, 'saved');
            toast('Moved back to To Edit'); rerender();
          } else if (choice === 'posted') {
            await store.setVideoStatus(video.id, 'posted');
            toast('Marked posted', 'ok'); rerender();
          } else if (choice === 'delete') {
            const ok = await confirmSheet({
              title: 'Delete this video?',
              message: 'The saved link, notes and ideas are removed from this device permanently.',
              confirmLabel: 'Delete Video',
            });
            if (ok) { await store.deleteVideo(video.id); toast('Video deleted'); rerender(); }
          }
        }
      });
    },
  };
}
