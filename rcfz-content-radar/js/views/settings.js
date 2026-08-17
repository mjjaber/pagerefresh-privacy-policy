/* SETTINGS — backup, restore, seed import, categories, storage hygiene.
   Nothing here talks to a network. */

import * as store from './../store.js';
import { ICONS, toast, confirmSheet, openSheet, field } from './../ui.js';
import { esc, localDateStamp, downloadJSON, plural, fmtDateTime } from './../util.js';
import { APP_VERSION } from './../version.js';

function importPreview(payload, sourceLabel) {
  const creatorNames = payload.creators.slice(0, 6).map((c) => c.name);

  return openSheet({
    title: 'Review Import',
    body: `
      <p class="about" style="margin:0 0 12px">From <strong>${esc(sourceLabel)}</strong></p>
      <div class="stats" style="margin-top:0">
        <div class="stat is-ok"><span class="n">${payload.creators.length}</span><span class="l">Creators</span></div>
        <div class="stat is-tele"><span class="n">${payload.videos.length}</span><span class="l">Videos</span></div>
        <div class="stat"><span class="n">${payload.categories.length}</span><span class="l">Categories</span></div>
      </div>
      ${creatorNames.length ? `
        <p class="about" style="margin-top:14px">
          Includes: ${esc(creatorNames.join(', '))}${payload.creators.length > 6
            ? ` and ${payload.creators.length - 6} more` : ''}.
        </p>` : ''}
      <div class="card" style="margin-top:14px">
        <p class="about" style="margin:0">
          <strong>Merge</strong> keeps everything already on this device and adds or updates
          entries from the file.<br><br>
          <strong>Replace Everything</strong> deletes the current local database first — your
          ${esc(plural(store.allCreators().length, 'creator'))} and
          ${esc(plural(store.allVideos().length, 'video'))} — then installs the file.
        </p>
      </div>`,
    foot: `
      <button type="button" class="btn primary" data-merge>${ICONS.plus}<span>Merge</span></button>
      <button type="button" class="btn danger" data-replace>Replace Everything</button>
      <button type="button" class="btn ghost" data-cancel>Cancel</button>`,
    onMount(sheet, close) {
      sheet.querySelector('[data-merge]')?.addEventListener('click', () => close('merge'));
      sheet.querySelector('[data-replace]').addEventListener('click', () => close('replace'));
      sheet.querySelector('[data-cancel]').addEventListener('click', () => close(undefined));
    },
  });
}

async function runImport(text, sourceLabel, refresh) {
  let payload;
  try {
    payload = store.parseBackup(text);
  } catch (err) {
    toast(err.message || 'That file could not be read', 'bad');
    return;
  }

  const mode = await importPreview(payload, sourceLabel);
  if (!mode) return;

  if (mode === 'replace') {
    const ok = await confirmSheet({
      title: 'Replace everything?',
      message: `This permanently deletes the ${plural(store.allCreators().length, 'creator')} and `
        + `${plural(store.allVideos().length, 'video')} currently on this device, then installs the file. `
        + 'Export a backup first if you are not sure.',
      confirmLabel: 'Yes, Replace Everything',
    });
    if (!ok) return;
    const res = await store.importReplace(payload);
    toast(`Replaced · ${res.creators} creators, ${res.videos} videos`, 'ok');
  } else {
    const res = await store.importMerge(payload);
    toast(`Merged · ${res.creators} creators, ${res.videos} videos`, 'ok');
  }

  await store.setMeta('lastImportAt', new Date().toISOString());
  refresh();
}

function pasteSheet(refresh) {
  return openSheet({
    title: 'Import From Text',
    body: `
      <p class="about" style="margin:0 0 12px">
        Paste a backup or seed JSON. Nothing leaves this device.
      </p>
      ${field('JSON', `<textarea id="paste-json" rows="9" spellcheck="false"
               placeholder='{ "creators": [ ... ] }'
               style="font-family:var(--mono);font-size:13px"></textarea>`)}`,
    foot: `<button type="button" class="btn primary" data-load>Review Import</button>`,
    onMount(sheet, close) {
      sheet.querySelector('[data-load]').addEventListener('click', () => {
        const text = sheet.querySelector('#paste-json').value.trim();
        if (!text) { toast('Nothing pasted', 'bad'); return; }
        close(text);
      });
    },
  }).then((text) => { if (text) runImport(text, 'pasted text', refresh); });
}

function categorySheet(refresh) {
  const custom = store.getMeta('customCategories', []) || [];
  return openSheet({
    title: 'Custom Categories',
    body: `
      ${custom.length
        ? `<div class="meta-row" style="margin-bottom:14px">${custom
            .map((c) => `<span class="pill neutral">${esc(c)}</span>`).join('')}</div>`
        : '<p class="about" style="margin:0 0 14px">No custom categories yet.</p>'}
      ${field('Add Category', `<input type="text" id="new-cat" data-autofocus
               placeholder="e.g. Night FPV" enterkeyhint="done" />`)}`,
    foot: `<button type="button" class="btn primary" data-add>Add Category</button>`,
    onMount(sheet, close) {
      const input = sheet.querySelector('#new-cat');
      const add = async () => {
        const value = input.value.trim();
        if (!value) return;
        await store.addCategory(value);
        toast(`Added ${value}`, 'ok');
        close(true);
        refresh();
      };
      sheet.querySelector('[data-add]').addEventListener('click', add);
      input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); add(); } });
    },
  });
}

export function render() {
  const s = store.stats();
  const lastExport = store.getMeta('lastExportAt', null);
  const lastImport = store.getMeta('lastImportAt', null);
  const standalone = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  return {
    tabbar: true,
    topbar: { title: 'Settings', back: '#/' },
    html: `
      <div class="section"><h2>Backup</h2><div class="rule"></div></div>
      <div class="stack">
        <button type="button" class="btn primary" data-act="export">
          ${ICONS.download}<span>Export Backup</span></button>
        <button type="button" class="btn tele" data-act="import-file">
          ${ICONS.upload}<span>Import Backup</span></button>
        <button type="button" class="btn quiet" data-act="import-paste">
          ${ICONS.copy}<span>Import From Pasted Text</span></button>
        <input type="file" id="import-file" accept="application/json,.json" hidden />
      </div>
      <p class="about" style="margin-top:10px">
        Export writes <strong>rcfz-content-radar-backup-${esc(localDateStamp())}.json</strong>
        containing every creator, video, category and setting.
        ${lastExport ? `<br>Last export: ${esc(fmtDateTime(lastExport))}.` : ''}
        ${lastImport ? `<br>Last import: ${esc(fmtDateTime(lastImport))}.` : ''}
      </p>

      <div class="section"><h2>Local Database</h2><div class="rule"></div></div>
      <div class="stats" style="margin-top:0">
        <div class="stat is-ok"><span class="n">${s.totalCreators}</span><span class="l">Creators</span></div>
        <div class="stat is-tele"><span class="n">${s.savedVideos}</span><span class="l">Videos</span></div>
        <div class="stat"><span class="n">${s.posted}</span><span class="l">Posted</span></div>
      </div>

      <div class="stack" style="margin-top:12px">
        <button type="button" class="btn quiet" data-act="categories">
          ${ICONS.spark}<span>Custom Categories</span></button>
        <button type="button" class="btn quiet" data-act="clear-resume">
          ${ICONS.clock}<span>Clear “Continue Where You Left Off”</span></button>
      </div>

      <div class="section"><h2>Install</h2><div class="rule"></div></div>
      <div class="card">
        <p class="about" style="margin:0">
          ${standalone
            ? 'Running as an installed app. '
            : 'Not installed yet. In Chrome on Android open the ⋮ menu and choose '
              + '<strong>Add to Home screen</strong> / <strong>Install app</strong>. '}
          Once installed it opens standalone, with no browser bars, and works offline.
        </p>
        <button type="button" class="btn quiet sm" data-act="install" id="install-btn"
                style="margin-top:12px" hidden>${ICONS.download}<span>Install App</span></button>
      </div>

      <div class="section"><h2>Privacy</h2><div class="rule"></div></div>
      <div class="card">
        <p class="about" style="margin:0">
          Every creator, video, note and status lives in <strong>IndexedDB on this device only</strong>.
          There is no account, no server, no analytics and no network request for your data.
          Clearing this site's browser storage deletes it — keep exported backups somewhere safe.
        </p>
      </div>

      <div class="section"><h2>Danger Zone</h2><div class="rule"></div></div>
      <div class="danger-zone">
        <p class="about" style="margin:0 0 12px">
          Deletes every creator and video stored on this device. Cannot be undone.
        </p>
        <button type="button" class="btn danger" data-act="wipe">
          ${ICONS.trash}<span>Erase All Local Data</span></button>
      </div>

      <p class="about" style="margin-top:22px;text-align:center">
        RCFZ Content Radar · v${esc(APP_VERSION)}
      </p>`,

    mount(root, _p, ctx) {
      const refresh = () => ctx.refresh();
      const fileInput = root.querySelector('#import-file');

      fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          await runImport(text, file.name, refresh);
        } catch {
          toast('Could not read that file', 'bad');
        } finally {
          fileInput.value = '';
        }
      });

      root.addEventListener('click', async (ev) => {
        const btn = ev.target.closest('[data-act]');
        if (!btn) return;
        const act = btn.dataset.act;

        if (act === 'export') {
          const backup = store.buildBackup();
          downloadJSON(`rcfz-content-radar-backup-${localDateStamp()}.json`, backup);
          await store.setMeta('lastExportAt', new Date().toISOString());
          toast(`Exported ${backup.counts.creators} creators, ${backup.counts.videos} videos`, 'ok');
          refresh();
        } else if (act === 'import-file') {
          fileInput.click();
        } else if (act === 'import-paste') {
          pasteSheet(refresh);
        } else if (act === 'categories') {
          categorySheet(refresh);
        } else if (act === 'clear-resume') {
          await store.setResume(null);
          toast('Cleared');
        } else if (act === 'install') {
          const prompt = window.__rcfzInstallPrompt;
          if (!prompt) { toast('Use the browser menu → Add to Home screen'); return; }
          prompt.prompt();
          const { outcome } = await prompt.userChoice;
          if (outcome === 'accepted') toast('Installing…', 'ok');
          window.__rcfzInstallPrompt = null;
        } else if (act === 'wipe') {
          const ok = await confirmSheet({
            title: 'Erase all local data?',
            message: `This permanently deletes ${plural(store.allCreators().length, 'creator')} and `
              + `${plural(store.allVideos().length, 'video')} from this device. Export a backup first.`,
            confirmLabel: 'Erase Everything',
          });
          if (ok) {
            await store.wipeAll();
            toast('All local data erased');
            refresh();
          }
        }
      });

      // Surface the native install button when Chrome offers it.
      const installBtn = root.querySelector('#install-btn');
      if (window.__rcfzInstallPrompt && installBtn) installBtn.hidden = false;
    },
  };
}
