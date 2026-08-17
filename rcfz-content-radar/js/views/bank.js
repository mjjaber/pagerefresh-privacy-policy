/* CONTENT BANK — every saved video, filterable and searchable. */

import * as store from './../store.js';
import {
  ICONS, platformIcon, videoPriorityPill, videoStatusPill, toast, emptyState,
  searchInput, field, segmented, selectField, openSheet, bindSegments, readForm,
  openMenu, confirmSheet,
} from './../ui.js';
import {
  PLATFORMS, VIDEO_PRIORITIES, VIDEO_STATUSES, PLATFORM_BY_ID,
} from './../constants.js';
import { esc, fmtDate, matches, openExternal, plural, truncate, debounce } from './../util.js';
import { openQuickSave } from './../forms.js';
import { go } from './../router.js';

const filters = {
  q: '', creatorId: '', platform: '', category: '', priority: '', status: '', since: '',
};

const activeFilterCount = () =>
  ['creatorId', 'platform', 'category', 'priority', 'status', 'since']
    .filter((k) => filters[k]).length;

function applyFilters(list) {
  const sinceMs = filters.since ? new Date(filters.since).getTime() : null;
  return list.filter((v) => {
    if (filters.creatorId && v.creatorId !== filters.creatorId) return false;
    if (filters.platform && v.platform !== filters.platform) return false;
    if (filters.category && v.category !== filters.category) return false;
    if (filters.priority && v.priority !== filters.priority) return false;
    if (filters.status && v.status !== filters.status) return false;
    if (sinceMs && new Date(v.dateSaved).getTime() < sinceMs) return false;
    if (filters.q) {
      const creator = store.getCreator(v.creatorId);
      const hay = `${v.idea} ${v.why} ${v.notes} ${v.category} ${v.url} ${creator?.name || ''} ${creator?.username || ''}`;
      if (!matches(hay, filters.q)) return false;
    }
    return true;
  });
}

export function videoCard(video, { showActions = true } = {}) {
  const creator = store.getCreator(video.creatorId);
  const hot = video.priority === 'must' && video.status !== 'posted' && video.status !== 'skipped';

  return `
    <article class="item vcard${hot ? ' flag-hot' : ''}" data-video="${esc(video.id)}">
      <div class="item-head">
        <span class="avatar">${platformIcon(video.platform)}</span>
        <div class="item-title">
          <div class="name">${esc(creator ? creator.name : 'No creator')}</div>
          <div class="sub">${esc(PLATFORM_BY_ID[video.platform]?.label || 'Other')} · ${esc(fmtDate(video.dateSaved))}</div>
        </div>
        <button type="button" class="icon-btn" data-menu-video="${esc(video.id)}"
                aria-label="More actions">${ICONS.more}</button>
      </div>

      <div style="margin-top:10px">
        <div class="idea${video.idea ? '' : ' empty'}">${esc(video.idea || 'No idea note yet')}</div>
        <div class="meta-row">
          ${videoPriorityPill(video.priority)}
          ${videoStatusPill(video.status)}
          ${video.category ? `<span class="pill neutral">${esc(video.category)}</span>` : ''}
        </div>
        <span class="url">${esc(truncate(video.url, 58))}</span>
      </div>

      ${showActions ? `
      <div class="item-actions">
        <button type="button" class="btn quiet sm" data-open="${esc(video.id)}">Original</button>
        ${video.status === 'saved'
          ? `<button type="button" class="btn quiet sm" data-start="${esc(video.id)}">Start Edit</button>`
          : `<button type="button" class="btn quiet sm" data-detail="${esc(video.id)}">Details</button>`}
        <button type="button" class="btn quiet sm" data-edit="${esc(video.id)}">Edit</button>
      </div>` : ''}
    </article>`;
}

function filterSheet(rerender) {
  const creatorOptions = store.sortCreators(store.allCreators(), 'alpha')
    .map((c) => ({ id: c.id, label: c.name }));

  return openSheet({
    title: 'Filter Content Bank',
    body: `<form id="vfilter">
      ${field('Creator', selectField('creatorId', creatorOptions, filters.creatorId,
        { placeholder: 'All creators' }))}
      ${field('Category', selectField('category', store.categories(), filters.category,
        { placeholder: 'All categories' }))}
      ${field('Platform', segmented('platform',
        [{ id: '', label: 'All' }, ...PLATFORMS.map((p) => ({ id: p.id, label: p.label }))],
        filters.platform, { wrap: true }))}
      ${field('Priority', segmented('priority',
        [{ id: '', label: 'All' }, ...VIDEO_PRIORITIES.map((p) => ({ id: p.id, label: p.short, tone: p.id === 'must' ? 'accent' : 'tele' }))],
        filters.priority, { wrap: true }))}
      ${field('Status', segmented('status',
        [{ id: '', label: 'All' }, ...VIDEO_STATUSES.map((s) => ({ id: s.id, label: s.label }))],
        filters.status, { wrap: true }))}
      ${field('Saved On Or After', `<input type="date" name="since" value="${esc(filters.since)}" />`)}
    </form>`,
    foot: `
      <button type="button" class="btn primary" data-apply>Apply</button>
      <button type="button" class="btn ghost" data-clear>Clear All</button>`,
    onMount(sheet, close) {
      const form = sheet.querySelector('#vfilter');
      bindSegments(form);
      sheet.querySelector('[data-apply]').addEventListener('click', () => {
        Object.assign(filters, readForm(form));
        close(true); rerender();
      });
      sheet.querySelector('[data-clear]').addEventListener('click', () => {
        Object.assign(filters, {
          creatorId: '', platform: '', category: '', priority: '', status: '', since: '',
        });
        close(true); rerender();
      });
    },
  });
}

/** Shared video action handling used by the Bank and the Queue. */
export function bindVideoActions(root, rerender) {
  root.addEventListener('click', async (ev) => {
    const openBtn = ev.target.closest('[data-open]');
    if (openBtn) {
      const video = store.getVideo(openBtn.dataset.open);
      if (!video?.url) { toast('No URL saved', 'bad'); return; }
      openExternal(video.url);
      return;
    }

    const detailBtn = ev.target.closest('[data-detail]');
    if (detailBtn) { go(`#/video/${detailBtn.dataset.detail}`); return; }

    const startBtn = ev.target.closest('[data-start]');
    if (startBtn) {
      await store.setVideoStatus(startBtn.dataset.start, 'editing');
      toast('Moved to Editing', 'ok');
      rerender();
      return;
    }

    const editBtn = ev.target.closest('[data-edit]');
    if (editBtn) {
      const video = store.getVideo(editBtn.dataset.edit);
      if (!video) return;
      const saved = await openQuickSave({ video });
      if (saved) rerender();
      return;
    }

    const menuBtn = ev.target.closest('[data-menu-video]');
    if (menuBtn) {
      const video = store.getVideo(menuBtn.dataset.menuVideo);
      if (!video) return;
      const creator = store.getCreator(video.creatorId);

      const choice = await openMenu(video.idea || 'Video', [
        { id: 'detail', label: 'Open Details', icon: ICONS.spark },
        { id: 'open', label: 'Open Original', icon: ICONS.external },
        { id: 'edit', label: 'Edit Details', icon: ICONS.edit },
        ...(creator?.profileUrl ? [{ id: 'profile', label: 'Open Creator Profile', icon: ICONS.creators }] : []),
        ...(video.status !== 'skipped' ? [{ id: 'skip', label: 'Skip This Video', icon: ICONS.skip }] : []),
        ...(video.status !== 'posted' ? [{ id: 'posted', label: 'Mark Posted', icon: ICONS.checkCircle }] : []),
        { id: 'delete', label: 'Delete Video', icon: ICONS.trash, danger: true },
      ]);

      if (choice === 'detail') go(`#/video/${video.id}`);
      else if (choice === 'open') openExternal(video.url);
      else if (choice === 'profile') openExternal(creator.profileUrl);
      else if (choice === 'edit') {
        const saved = await openQuickSave({ video });
        if (saved) rerender();
      } else if (choice === 'skip') {
        await store.setVideoStatus(video.id, 'skipped');
        toast('Skipped'); rerender();
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
}

export function render(params = {}) {
  if (params.creator) filters.creatorId = params.creator;

  const all = store.allVideos();
  const shown = store.sortVideosDefault(applyFilters(all));

  return {
    tabbar: true,
    topbar: {
      title: 'Content Bank',
      actions: `<button type="button" class="icon-btn" data-quick-save
                        aria-label="Quick save a video">${ICONS.plus}</button>`,
    },
    html: `
      <div class="filterbar">
        ${searchInput('q', 'Search saved videos', filters.q)}
        <button type="button" class="fbtn${activeFilterCount() ? ' on' : ''}" data-filter
                aria-label="Filter">${ICONS.filter}</button>
      </div>

      <div class="list-meta">
        <span data-count>${plural(shown.length, 'video')}${shown.length !== all.length ? ` of ${all.length}` : ''}</span>
        <span>Must first · newest first</span>
      </div>

      <div class="stack" id="video-list">
        ${shown.length
          ? shown.map((v) => videoCard(v)).join('')
          : emptyState({
              icon: all.length ? '🔍' : '🎬',
              title: all.length ? 'No matches' : 'Content Bank is empty',
              text: all.length
                ? 'Try clearing the search or filters.'
                : 'Paste a video link to save your first clip.',
              actionHtml: `<button type="button" class="btn primary" data-quick-save>
                ${ICONS.save}<span>Quick Save</span></button>`,
            })}
      </div>`,

    mount(root, _p, ctx) {
      const rerender = () => ctx.refresh();

      document.querySelectorAll('[data-quick-save]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const saved = await openQuickSave({});
          if (saved) rerender();
        });
      });

      const search = root.querySelector('input[name="q"]');
      search?.addEventListener('input', debounce(() => {
        filters.q = search.value.trim();
        const list = root.querySelector('#video-list');
        const sorted = store.sortVideosDefault(applyFilters(store.allVideos()));
        list.innerHTML = sorted.length
          ? sorted.map((v) => videoCard(v)).join('')
          : emptyState({ icon: '🔍', title: 'No matches', text: 'Try a different search.' });
        root.querySelector('[data-count]').textContent = plural(sorted.length, 'video');
      }, 140));

      root.querySelector('[data-filter]')?.addEventListener('click', () => filterSheet(rerender));

      bindVideoActions(root, rerender);
    },
  };
}
