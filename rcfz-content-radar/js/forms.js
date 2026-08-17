/* The two sheets that capture data: Quick Save and Add/Edit Creator.
   Both are sheets rather than routes so they can open on top of Discovery Mode
   without ever losing the session behind them. */

import {
  PLATFORMS, PERMISSIONS, CREATOR_PRIORITIES, FREQUENCIES,
  VIDEO_PRIORITIES, VIDEO_STATUSES,
} from './constants.js';
import {
  detectPlatform, esc, guessUsername, isValidUrl, normalizeUrl, readClipboard,
  localDateStamp, nowISO,
} from './util.js';
import {
  openSheet, field, segmented, selectField, bindSegments, readForm, toast, ICONS,
} from './ui.js';
import * as store from './store.js';

/* ---------------------------------------------------------- quick save -- */

/**
 * Open Quick Save. Only the video URL is required.
 * @param {{creatorId?:string, video?:object, title?:string}} opts
 * @returns {Promise<object|undefined>} the saved video, or undefined if cancelled
 */
export function openQuickSave({ creatorId = null, video = null, title } = {}) {
  const editing = Boolean(video);
  const creators = store.sortCreators(store.allCreators(), 'alpha');
  const initialCreator = video?.creatorId || creatorId || '';
  const creatorOptions = creators.map((c) => ({ id: c.id, label: c.name }));

  const dateValue = (video?.dateSaved ? localDateStamp(new Date(video.dateSaved)) : localDateStamp());

  const body = `
    <form id="qs-form" novalidate>
      ${field('Video URL', `
        <div style="display:flex;gap:8px;align-items:stretch">
          <input type="url" name="url" inputmode="url" autocomplete="off" spellcheck="false"
                 placeholder="Paste the video link" data-autofocus
                 value="${esc(video?.url || '')}" style="flex:1" />
          <button type="button" class="btn quiet" data-paste
                  style="width:auto;padding:0 14px;flex:0 0 auto">Paste</button>
        </div>`, { required: true, hint: 'Platform is detected automatically.' })}

      ${field('Creator', selectField('creatorId', creatorOptions, initialCreator,
        { placeholder: creators.length ? 'No creator' : 'No creators yet' }))}

      ${field('Platform', selectField('platform', PLATFORMS,
        video?.platform || detectPlatform(video?.url || '')))}

      ${field('Short Idea', `<input type="text" name="idea" placeholder="e.g. Turbine jet low pass"
              value="${esc(video?.idea || '')}" enterkeyhint="done" />`)}

      ${field('Priority', segmented('priority',
        VIDEO_PRIORITIES.map((p) => ({ id: p.id, label: p.short, tone: p.id === 'must' ? 'accent' : 'tele' })),
        video?.priority || 'good'))}

      <button type="button" class="btn ghost sm" data-more style="margin:2px 0 12px">
        More details</button>

      <div id="qs-more" hidden>
        ${field('Why It Is Good', `<textarea name="why" rows="3"
                 placeholder="What makes this clip strong?">${esc(video?.why || '')}</textarea>`)}
        ${field('Category', selectField('category', store.categories(), video?.category || '',
          { placeholder: 'No category' }))}
        ${field('Status', segmented('status',
          VIDEO_STATUSES.map((s) => ({ id: s.id, label: s.label })), video?.status || 'saved',
          { wrap: true }))}
        ${field('Original View Count', `<input type="text" name="viewCount" inputmode="numeric"
                 placeholder="e.g. 2.4M" value="${esc(video?.viewCount || '')}" />`)}
        ${field('Date Saved', `<input type="date" name="dateSavedLocal" value="${esc(dateValue)}" />`)}
        ${field('Notes', `<textarea name="notes" rows="3"
                 placeholder="Anything worth remembering">${esc(video?.notes || '')}</textarea>`)}
      </div>
    </form>`;

  return openSheet({
    title: title || (editing ? 'Edit Video' : 'Quick Save'),
    body,
    foot: `
      <button type="button" class="btn primary" data-save>
        ${ICONS.save}<span>${editing ? 'Save Changes' : 'Save Video'}</span></button>`,
    onMount(sheet, close) {
      const form = sheet.querySelector('#qs-form');
      const urlInput = form.querySelector('[name="url"]');
      const platformSelect = form.querySelector('[name="platform"]');
      let platformTouched = Boolean(video?.platform);

      bindSegments(form);

      platformSelect.addEventListener('change', () => { platformTouched = true; });

      const syncPlatform = () => {
        if (platformTouched) return;
        const detected = detectPlatform(urlInput.value);
        if (detected) platformSelect.value = detected;
      };
      urlInput.addEventListener('input', syncPlatform);
      urlInput.addEventListener('paste', () => setTimeout(syncPlatform, 0));

      sheet.querySelector('[data-paste]').addEventListener('click', async () => {
        const text = await readClipboard();
        if (text) {
          urlInput.value = text.trim();
          syncPlatform();
          toast('Pasted from clipboard');
        } else {
          urlInput.focus();
          toast('Clipboard blocked — paste manually');
        }
      });

      const moreBtn = sheet.querySelector('[data-more]');
      const more = sheet.querySelector('#qs-more');
      moreBtn.addEventListener('click', () => {
        const show = more.hidden;
        more.hidden = !show;
        moreBtn.textContent = show ? 'Fewer details' : 'More details';
      });
      if (editing) { more.hidden = false; moreBtn.textContent = 'Fewer details'; }

      const submit = async () => {
        const data = readForm(form);
        const url = normalizeUrl(data.url);
        if (!url || !isValidUrl(url)) {
          urlInput.focus();
          toast('A valid video URL is required', 'bad');
          return;
        }

        const payload = {
          ...(video || {}),
          id: video?.id,
          url,
          creatorId: data.creatorId || null,
          platform: data.platform || detectPlatform(url),
          idea: data.idea || '',
          priority: data.priority || 'good',
          why: data.why ?? video?.why ?? '',
          category: data.category ?? video?.category ?? '',
          status: data.status || video?.status || 'saved',
          viewCount: data.viewCount ?? video?.viewCount ?? '',
          notes: data.notes ?? video?.notes ?? '',
        };

        if (data.dateSavedLocal) {
          const existingTime = video?.dateSaved ? new Date(video.dateSaved) : new Date();
          const [y, m, d] = data.dateSavedLocal.split('-').map(Number);
          if (y && m && d) {
            const dt = new Date(existingTime);
            dt.setFullYear(y, m - 1, d);
            payload.dateSaved = dt.toISOString();
          }
        } else if (!video) {
          payload.dateSaved = nowISO();
        }

        const saved = await store.saveVideo(payload);
        toast(editing ? 'Video updated' : 'Saved to Content Bank', 'ok');
        close(saved);
      };

      sheet.querySelector('[data-save]').addEventListener('click', submit);
      form.addEventListener('submit', (ev) => { ev.preventDefault(); submit(); });
      form.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' && ev.target.tagName === 'INPUT') { ev.preventDefault(); submit(); }
      });
    },
  });
}

/* -------------------------------------------------------- creator form -- */

/**
 * Add or edit a creator.
 * @returns {Promise<object|undefined>} the saved creator, or undefined if cancelled
 */
export function openCreatorForm(creator = null) {
  const editing = Boolean(creator);

  const body = `
    <form id="cf-form" novalidate>
      ${field('Creator Name', `<input type="text" name="name" data-autofocus
              autocomplete="off" enterkeyhint="next" placeholder="Creator or channel name"
              value="${esc(creator?.name || '')}" />`, { required: true })}

      ${field('Platform', segmented('platform',
        PLATFORMS.map((p) => ({ id: p.id, label: p.label })),
        creator?.platform || 'facebook', { wrap: true }), { required: true })}

      ${field('Profile URL', `<input type="url" name="profileUrl" inputmode="url"
              autocomplete="off" spellcheck="false" placeholder="https://…"
              value="${esc(creator?.profileUrl || '')}" />`, { required: true })}

      ${field('Username', `<input type="text" name="username" autocomplete="off"
              spellcheck="false" placeholder="Optional — used for credits"
              value="${esc(creator?.username || '')}" />`)}

      ${field('Permission Status', segmented('permission',
        PERMISSIONS.map((p) => ({ id: p.id, label: p.label, tone: p.tone })),
        creator?.permission || 'approved'))}

      ${field('Priority', segmented('priority',
        CREATOR_PRIORITIES.map((p) => ({ id: p.id, label: p.label, tone: p.tone })),
        creator?.priority || 'normal'))}

      ${field('Check Frequency', selectField('checkFrequency', FREQUENCIES,
        creator?.checkFrequency || 'weekly'))}

      <div id="cf-custom" ${creator?.checkFrequency === 'custom' ? '' : 'hidden'}>
        ${field('Custom Interval (days)', `<input type="number" name="customDays" min="1" max="365"
                inputmode="numeric" value="${esc(creator?.customDays || 7)}" />`)}
      </div>

      <button type="button" class="btn ghost sm" data-more style="margin:2px 0 12px">
        Credit &amp; notes</button>

      <div id="cf-more" hidden>
        ${field('Preferred Credit Name', `<input type="text" name="creditName"
                 placeholder="Defaults to creator name"
                 value="${esc(creator?.creditName || '')}" />`)}
        ${field('Preferred Credit Handle', `<input type="text" name="creditHandle"
                 placeholder="Defaults to username" spellcheck="false"
                 value="${esc(creator?.creditHandle || '')}" />`)}
        ${field('Notes', `<textarea name="notes" rows="3"
                 placeholder="Permission details, DM history, anything useful">${esc(creator?.notes || '')}</textarea>`)}
      </div>
    </form>`;

  return openSheet({
    title: editing ? 'Edit Creator' : 'Add Creator',
    body,
    foot: `<button type="button" class="btn primary" data-save>
             ${ICONS.check}<span>${editing ? 'Save Changes' : 'Add Creator'}</span></button>
           ${editing ? '' : `<button type="button" class="btn ghost sm" data-bulk>
             Bulk add from a pasted list</button>`}`,
    onMount(sheet, close) {
      const form = sheet.querySelector('#cf-form');
      bindSegments(form);

      const urlInput = form.querySelector('[name="profileUrl"]');
      const usernameInput = form.querySelector('[name="username"]');
      const platformHidden = form.querySelector('input[name="platform"]');
      const freqSelect = form.querySelector('[name="checkFrequency"]');
      const customWrap = sheet.querySelector('#cf-custom');

      freqSelect.addEventListener('change', () => {
        customWrap.hidden = freqSelect.value !== 'custom';
      });

      // Pasting a profile URL fills in the platform and username for free.
      urlInput.addEventListener('input', () => {
        const url = urlInput.value;
        if (!url) return;
        const detected = detectPlatform(url);
        if (detected && detected !== 'other') {
          platformHidden.value = detected;
          form.querySelectorAll('[data-seg="platform"]').forEach((b) => {
            b.setAttribute('aria-pressed', b.dataset.value === detected ? 'true' : 'false');
          });
        }
        if (!usernameInput.value) {
          const guess = guessUsername(url);
          if (guess) usernameInput.value = guess;
        }
      });

      const moreBtn = sheet.querySelector('[data-more]');
      const more = sheet.querySelector('#cf-more');
      moreBtn.addEventListener('click', () => {
        const show = more.hidden;
        more.hidden = !show;
        moreBtn.textContent = show ? 'Hide credit & notes' : 'Credit & notes';
      });

      const submit = async () => {
        const data = readForm(form);
        if (!data.name) {
          form.querySelector('[name="name"]').focus();
          toast('Creator name is required', 'bad');
          return;
        }
        if (!data.profileUrl || !isValidUrl(data.profileUrl)) {
          urlInput.focus();
          toast('A valid profile URL is required', 'bad');
          return;
        }

        const saved = await store.saveCreator({
          ...(creator || {}),
          id: creator?.id,
          name: data.name,
          platform: data.platform,
          profileUrl: normalizeUrl(data.profileUrl),
          username: data.username || '',
          permission: data.permission,
          priority: data.priority,
          checkFrequency: data.checkFrequency,
          customDays: data.checkFrequency === 'custom' ? Number(data.customDays) || 7 : null,
          creditName: data.creditName ?? creator?.creditName ?? '',
          creditHandle: data.creditHandle ?? creator?.creditHandle ?? '',
          notes: data.notes ?? creator?.notes ?? '',
        });

        toast(editing ? 'Creator updated' : `Added ${saved.name}`, 'ok');
        close(saved);
      };

      sheet.querySelector('[data-save]').addEventListener('click', submit);
      form.addEventListener('submit', (ev) => { ev.preventDefault(); submit(); });

      sheet.querySelector('[data-bulk]')?.addEventListener('click', async () => {
        close(undefined);
        const { openBulkAdd } = await import('./bulkadd.js');
        const added = await openBulkAdd();
        if (added) window.dispatchEvent(new CustomEvent('rcfz:data-changed'));
      });
    },
  });
}
