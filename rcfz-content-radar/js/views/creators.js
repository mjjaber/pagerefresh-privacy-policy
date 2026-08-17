/* CREATORS — the approved-creator database. */

import * as store from './../store.js';
import {
  ICONS, platformIcon, permissionPill, creatorPriorityPill, duePill,
  openMenu, confirmSheet, toast, emptyState, searchInput, selectField, field, segmented,
  openSheet, bindSegments, readForm,
} from './../ui.js';
import {
  PLATFORMS, PERMISSIONS, CREATOR_PRIORITIES, PLATFORM_BY_ID, FREQ_BY_ID,
} from './../constants.js';
import {
  esc, ago, isDue, matches, openExternal, plural, frequencyDays, debounce,
} from './../util.js';
import { openCreatorForm, openQuickSave } from './../forms.js';
import { go } from './../router.js';

/* Filter state lives for the life of the tab; the sort order is remembered
   across launches because it is a real preference. */
const filters = { q: '', platform: '', permission: '', priority: '' };

const activeFilterCount = () =>
  Number(Boolean(filters.platform)) + Number(Boolean(filters.permission)) + Number(Boolean(filters.priority));

function applyFilters(list) {
  return list.filter((c) => {
    if (filters.platform && c.platform !== filters.platform) return false;
    if (filters.permission && c.permission !== filters.permission) return false;
    if (filters.priority && c.priority !== filters.priority) return false;
    if (filters.q) {
      const hay = `${c.name} ${c.username} ${PLATFORM_BY_ID[c.platform]?.label || ''} ${c.notes}`;
      if (!matches(hay, filters.q)) return false;
    }
    return true;
  });
}

export function creatorCard(creator) {
  const due = isDue(creator) && creator.permission === 'approved';
  const freq = FREQ_BY_ID[creator.checkFrequency];
  const freqLabel = creator.checkFrequency === 'custom'
    ? `Every ${frequencyDays(creator)}d`
    : (freq?.label || 'Weekly');

  return `
    <article class="item${due ? ' flag-due' : ''}" data-creator="${esc(creator.id)}">
      <div class="item-head">
        <span class="avatar">${platformIcon(creator.platform)}</span>
        <div class="item-title">
          <div class="name">${esc(creator.name)}</div>
          <div class="sub">${creator.username ? `@${esc(creator.username)} · ` : ''}${esc(PLATFORM_BY_ID[creator.platform]?.label || 'Other')}</div>
        </div>
        <button type="button" class="icon-btn" data-menu-creator="${esc(creator.id)}"
                aria-label="More actions for ${esc(creator.name)}">${ICONS.more}</button>
      </div>

      <div class="meta-row" style="margin-top:10px">
        ${due ? duePill() : ''}
        ${permissionPill(creator.permission)}
        ${creatorPriorityPill(creator.priority)}
      </div>

      <div class="tele-line">
        <span>Checked <b>${esc(ago(creator.lastChecked))}</b></span>
        <span>Cycle <b>${esc(freqLabel)}</b></span>
      </div>

      <div class="item-actions">
        <button type="button" class="btn quiet sm" data-open="${esc(creator.id)}">Open</button>
        <button type="button" class="btn quiet sm" data-check="${esc(creator.id)}">Checked</button>
        <button type="button" class="btn quiet sm" data-save="${esc(creator.id)}">Save Video</button>
      </div>
    </article>`;
}

function filterSheet(rerender) {
  return openSheet({
    title: 'Filter Creators',
    body: `<form id="cfilter">
      ${field('Platform', segmented('platform',
        [{ id: '', label: 'All' }, ...PLATFORMS.map((p) => ({ id: p.id, label: p.label }))],
        filters.platform, { wrap: true }))}
      ${field('Permission', segmented('permission',
        [{ id: '', label: 'All' }, ...PERMISSIONS.map((p) => ({ id: p.id, label: p.label, tone: p.tone }))],
        filters.permission, { wrap: true }))}
      ${field('Priority', segmented('priority',
        [{ id: '', label: 'All' }, ...CREATOR_PRIORITIES.map((p) => ({ id: p.id, label: p.label, tone: p.tone }))],
        filters.priority, { wrap: true }))}
    </form>`,
    foot: `
      <button type="button" class="btn primary" data-apply>Apply</button>
      <button type="button" class="btn ghost" data-clear>Clear All</button>`,
    onMount(sheet, close) {
      const form = sheet.querySelector('#cfilter');
      bindSegments(form);
      sheet.querySelector('[data-apply]').addEventListener('click', () => {
        Object.assign(filters, readForm(form));
        close(true);
        rerender();
      });
      sheet.querySelector('[data-clear]').addEventListener('click', () => {
        filters.platform = ''; filters.permission = ''; filters.priority = '';
        close(true);
        rerender();
      });
    },
  });
}

export function render() {
  const sort = store.getMeta('creatorSort', 'due') || 'due';
  const all = store.allCreators();
  const shown = store.sortCreators(applyFilters(all), sort);
  const dueCount = all.filter((c) => c.permission === 'approved' && isDue(c)).length;

  return {
    tabbar: true,
    topbar: {
      title: 'Creators',
      actions: `<button type="button" class="icon-btn" data-add-creator
                        aria-label="Add creator">${ICONS.plus}</button>`,
    },
    html: `
      <div class="filterbar">
        ${searchInput('q', 'Search creators', filters.q)}
        <button type="button" class="fbtn${activeFilterCount() ? ' on' : ''}" data-filter
                aria-label="Filter">${ICONS.filter}</button>
      </div>

      <div class="field" style="margin:10px 0 4px">
        ${selectField('sort', store.CREATOR_SORTS, sort)}
      </div>

      <div class="list-meta">
        <span>${plural(shown.length, 'creator')}${shown.length !== all.length ? ` of ${all.length}` : ''}</span>
        <span>${dueCount} due</span>
      </div>

      <div class="stack" id="creator-list">
        ${shown.length
          ? shown.map(creatorCard).join('')
          : emptyState({
              icon: all.length ? '🔍' : '🛩️',
              title: all.length ? 'No matches' : 'No creators yet',
              text: all.length
                ? 'Try clearing the search or filters.'
                : 'Add your approved RC creators, or import a seed file from Settings.',
              actionHtml: `<div class="stack">
                <button type="button" class="btn primary" data-add-creator>
                  ${ICONS.plus}<span>Add Creator</span></button>
                <button type="button" class="btn quiet" data-bulk-add>
                  ${ICONS.creators}<span>Bulk Add From A List</span></button>
              </div>`,
            })}
      </div>`,

    mount(root, _params, ctx) {
      const rerender = () => ctx.refresh();

      document.querySelectorAll('[data-add-creator]').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const created = await openCreatorForm(null);
          if (created) rerender();
        });
      });

      const search = root.querySelector('input[name="q"]');
      search?.addEventListener('input', debounce(() => {
        filters.q = search.value.trim();
        // Re-render only the list so the keyboard and caret stay put.
        const list = root.querySelector('#creator-list');
        const sorted = store.sortCreators(applyFilters(store.allCreators()), sort);
        list.innerHTML = sorted.length
          ? sorted.map(creatorCard).join('')
          : emptyState({ icon: '🔍', title: 'No matches', text: 'Try a different search.' });
        root.querySelector('.list-meta span').textContent =
          `${plural(sorted.length, 'creator')}${sorted.length !== store.allCreators().length ? ` of ${store.allCreators().length}` : ''}`;
      }, 140));

      root.querySelector('[data-bulk-add]')?.addEventListener('click', async () => {
        const { openBulkAdd } = await import('./../bulkadd.js');
        const added = await openBulkAdd();
        if (added) rerender();
      });

      root.querySelector('[data-filter]')?.addEventListener('click', () => filterSheet(rerender));

      root.querySelector('select[name="sort"]')?.addEventListener('change', async (ev) => {
        await store.setMeta('creatorSort', ev.target.value);
        rerender();
      });

      root.addEventListener('click', async (ev) => {
        const openBtn = ev.target.closest('[data-open]');
        if (openBtn) {
          const creator = store.getCreator(openBtn.dataset.open);
          if (!creator?.profileUrl) { toast('No profile URL saved', 'bad'); return; }
          openExternal(creator.profileUrl);
          return;
        }

        const checkBtn = ev.target.closest('[data-check]');
        if (checkBtn) {
          const creator = await store.markChecked(checkBtn.dataset.check);
          toast(`${creator.name} marked checked`, 'ok');
          rerender();
          return;
        }

        const saveBtn = ev.target.closest('[data-save]');
        if (saveBtn) {
          const saved = await openQuickSave({ creatorId: saveBtn.dataset.save });
          if (saved) rerender();
          return;
        }

        const menuBtn = ev.target.closest('[data-menu-creator]');
        if (menuBtn) {
          const creator = store.getCreator(menuBtn.dataset.menuCreator);
          if (!creator) return;
          const choice = await openMenu(creator.name, [
            { id: 'edit', label: 'Edit Creator', icon: ICONS.edit },
            { id: 'save', label: 'Save Video', icon: ICONS.save },
            { id: 'open', label: 'Open Profile', icon: ICONS.external },
            { id: 'videos', label: 'View Saved Videos', icon: ICONS.bank },
            { id: 'delete', label: 'Delete Creator', icon: ICONS.trash, danger: true },
          ]);

          if (choice === 'edit') {
            const updated = await openCreatorForm(creator);
            if (updated) rerender();
          } else if (choice === 'save') {
            const saved = await openQuickSave({ creatorId: creator.id });
            if (saved) rerender();
          } else if (choice === 'open') {
            openExternal(creator.profileUrl);
          } else if (choice === 'videos') {
            go(`#/bank?creator=${encodeURIComponent(creator.id)}`);
          } else if (choice === 'delete') {
            const ok = await confirmSheet({
              title: `Delete ${creator.name}?`,
              message: 'The creator is removed. Videos saved from them are kept but lose their creator link.',
              confirmLabel: 'Delete Creator',
            });
            if (ok) {
              const detached = await store.deleteCreator(creator.id);
              toast(detached ? `Deleted · ${plural(detached, 'video')} kept` : 'Creator deleted');
              rerender();
            }
          }
        }
      });

      store.setResume({ type: 'creators' });
    },
  };
}
