# RCFZ Content Radar

A private, offline-first Progressive Web App for running an RC short-form content
workflow from a phone.

**Live app:** https://mjjaber.github.io/pagerefresh-privacy-policy/rcfz-content-radar/

---

## Purpose

The app exists to make one loop fast and deliberate:

```
Open app → Discovery Mode → next creator → open profile → find a strong video
        → copy URL → Quick Save → next creator
                        ↓
              Queue → edit → ready → post → posted
```

It is a workflow tool, not a feed. There is no infinite scroll, no
recommendations and nothing to browse — you open it with a purpose, capture what
you found, and close it.

### What it does

- **Creators** — the database of RC creators you have permission to repost, with
  permission status, priority, check frequency and a "due" calculation.
- **Discovery Mode** — walks approved creators one at a time, most-overdue first,
  with a progress counter and a Quick Save panel that never drops the session.
- **Bulk Add** — paste a whole list of creators at once (markdown links,
  `Name | URL`, or bare profile URLs). Platform, username and credit handle are
  detected per line; headings and emoji bullets are ignored, and links already
  in the database are flagged and skipped. Reachable from Settings, the empty
  Creators screen, and the Add Creator sheet.
- **Quick Save** — paste a URL, hit save. Platform is auto-detected. Everything
  else is optional.
- **Content Bank** — every saved video, filterable by creator, platform,
  category, priority, status and date; sorted Must Make → Good → Maybe.
- **Queue** — the production pipeline: To Edit → Editing → Ready To Post, with
  one big button per stage.
- **Video detail** — hook idea, caption idea, editing notes and a one-tap
  copyable credit line (`Credit: @handle`).

### What it deliberately does not do

No accounts, no cloud sync, no scraping, no social media APIs, no automatic
posting, no analytics, no AI features, no backend.

---

## Architecture

Vanilla HTML, CSS and ES modules. No framework, no build step, no dependencies —
what is in the repository is exactly what the browser runs.

```
rcfz-content-radar/
├── index.html                 app shell
├── manifest.webmanifest       PWA manifest (relative paths)
├── sw.js                      service worker — precache + offline shell
├── css/styles.css             the whole design system
├── icons/                     generated PNG icons
├── tools/make-icons.mjs       regenerates every icon from code
└── js/
    ├── app.js                 bootstrap + hash router
    ├── router.js              navigation primitives
    ├── db.js                  IndexedDB wrapper (promises, transactions)
    ├── store.js               domain layer: creators, videos, backup, sorting
    ├── constants.js           platforms, statuses, priorities, categories
    ├── util.js                dates, due logic, URL/platform detection, clipboard
    ├── ui.js                  icons, pills, bottom sheets, toasts, confirms
    ├── forms.js               Quick Save + Add/Edit Creator sheets
    ├── bulkadd.js             paste-a-list bulk creator import
    └── views/                 home, creators, discovery, bank, queue, video, settings
```

**Routing is hash-based** (`#/creators`, `#/video/<id>`). That is a deliberate
choice for GitHub Pages: every URL only ever requests `index.html`, so
refreshing or deep-linking any screen can never 404.

**Rendering model** — each view exports `render(params)` returning
`{ topbar, html, tabbar, mount }`. The router builds a fresh container element
per render and hands it to `mount`, so delegated listeners are discarded with
the DOM they were attached to and can never stack up across re-renders.

---

## Local data storage

Everything lives in IndexedDB (database `rcfz-content-radar`) in three stores:

| Store      | Contents                                                   |
| ---------- | ---------------------------------------------------------- |
| `creators` | creator records, permission, priority, frequency, credits  |
| `videos`   | saved URLs, ideas, status, priority, production notes      |
| `meta`     | preferences, custom categories, resume state, backup dates |

The whole database is loaded into memory once at startup — a personal database
is small — so every screen renders instantly, with write-through to IndexedDB.

### Due logic

A creator is **due** when it has never been checked, or when
`days since lastChecked >= checkFrequency`. Frequencies are Daily, Every 3 Days,
Weekly (default), Every 2 Weeks, Monthly, or a custom number of days.

Discovery Mode orders creators as: approved only → due before not-due → most
overdue first (never-checked sort to the very top) → High priority gets a
five-day equivalent bonus.

---

## Privacy model

- **No creator or video data is in this repository.** The repo contains the
  application only.
- Nothing is transmitted anywhere. There is no server, no API key, no token, no
  analytics and no external request for your data — the only network traffic is
  fetching the app's own files.
- Your database is scoped to this origin in your browser. Clearing the site's
  storage, or uninstalling the PWA with "clear data", deletes it.
- `.gitignore` blocks `*backup*.json` and `*seed*.json` so a personal export
  can't be committed by accident.

**Because the data lives only on the device, exported backups are the only copy.
Export regularly.**

---

## Backup process

**Settings → Export Backup** writes a single file:

```
rcfz-content-radar-backup-YYYY-MM-DD.json
```

containing every creator, video, custom category and setting.

**Settings → Import Backup** (file) or **Import From Pasted Text** validates the
file, shows how many creators and videos it contains, and then asks how to apply
it:

- **Merge** — adds and updates by id, keeping everything already on the device.
- **Replace Everything** — wipes the local database first. This requires a second
  explicit confirmation; nothing is ever overwritten silently.

The importer also accepts a bare seed file (`{ "creators": [ ... ] }` or a plain
array of creators), which is how a starter creator list is loaded without
committing it here.

---

## PWA installation (Android)

1. Open the live URL in **Chrome** on the phone.
2. Tap the **⋮** menu.
3. Choose **Add to Home screen** (or **Install app**).
4. Confirm **Install**.

It then launches from the home screen in standalone mode — no address bar, no
browser chrome — and works with no connection. Settings also exposes an
**Install App** button when Chrome offers the native prompt.

---

## GitHub Pages deployment

The app is served as a static sub-directory of this repository by
`.github/workflows/deploy-pages.yml`, which uploads the repository to Pages on
every push to a deploy branch.

All paths in `index.html`, `manifest.webmanifest` and `sw.js` are **relative**
(`./js/app.js`, `"start_url": "./"`), so the app works from any sub-path without
a base-path build flag. A `.nojekyll` file at the repository root stops Jekyll
from stripping files.

---

## Development commands

No install, no build, no dependencies. Serve the repository root over HTTP —
service workers do not run from `file://`:

```bash
# from the repository root
python3 -m http.server 8000
# then open http://localhost:8000/rcfz-content-radar/
```

Regenerate the icon set after changing the artwork in `tools/make-icons.mjs`:

```bash
cd rcfz-content-radar && node tools/make-icons.mjs
```

---

## How to modify the application later

| Change                        | Where                                                          |
| ----------------------------- | -------------------------------------------------------------- |
| Add a category / status / platform | `js/constants.js` — every form, filter and pill reads from it |
| Change colours, spacing, type | the token block at the top of `css/styles.css`                  |
| Change a screen               | the matching file in `js/views/`                                |
| Change Quick Save fields      | `js/forms.js`                                                   |
| Change due / discovery ordering | `isDue`/`overdueBy` in `js/util.js`, `buildDiscoveryQueue` in `js/store.js` |
| Add a stored field            | `normalizeCreator` / `normalizeVideo` in `js/store.js` (they run on import too) |
| Add a route                   | `resolve()` in `js/app.js`                                      |

**When you add, rename or delete any file under `js/`, `css/` or `icons/`:**
update the `PRECACHE` list in `sw.js` and bump `CACHE_VERSION` there (and
`APP_VERSION` in `js/version.js`). Otherwise installed copies keep serving the
old cached shell.

### Database migrations

`DB_VERSION` in `js/db.js` is 1. To add a store or index, bump it and extend
`onupgradeneeded`. Adding a *field* needs no migration — give it a default in
`normalizeCreator`/`normalizeVideo` and existing records pick it up on read.

---

## Testing

Version 1 was verified with an automated end-to-end suite (Playwright, Chromium,
412×915 Android viewport) covering 88 checks: creator add/edit/delete, mark
checked, due-date calculations across every frequency, Discovery Mode ordering
and session resume, Quick Save with platform auto-detection, queue status
transitions, filtering and search on both lists, JSON export and import
(merge / replace / invalid input), persistence across reloads, deep-link refresh,
manifest and icon integrity, service worker activation, offline app shell,
three viewport widths and touch-target sizes.
