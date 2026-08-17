/* Service worker: precache the whole app shell, serve it cache-first, and fall
   back to index.html for navigations so the app opens offline and never 404s.
   Bump CACHE_VERSION whenever any precached file changes. */

const CACHE_VERSION = 'v1.1.0';
const CACHE_NAME = `rcfz-radar-${CACHE_VERSION}`;

/* Relative to the service worker scope, so the app works from any sub-path. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/router.js',
  './js/store.js',
  './js/db.js',
  './js/ui.js',
  './js/util.js',
  './js/forms.js',
  './js/bulkadd.js',
  './js/constants.js',
  './js/version.js',
  './js/views/home.js',
  './js/views/creators.js',
  './js/views/discovery.js',
  './js/views/bank.js',
  './js/views/queue.js',
  './js/views/video.js',
  './js/views/settings.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // addAll() is all-or-nothing; add individually so one missing optional file
    // can never break the whole install.
    await Promise.all(PRECACHE.map(async (url) => {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch (err) {
        console.warn('[sw] precache miss', url, err);
      }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names.filter((n) => n.startsWith('rcfz-radar-') && n !== CACHE_NAME)
        .map((n) => caches.delete(n)),
    );
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'skip-waiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;   // never touch external links

  // Navigations: serve the cached shell so a refresh or deep link always works.
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match('./index.html'))
          || (await cache.match('./'))
          || Response.error();
      }
    })());
    return;
  }

  // Everything else: cache-first for instant startup, then refresh in the
  // background so the next launch picks up new code.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });

    const network = fetch(request).then((response) => {
      if (response && response.ok && response.type === 'basic') {
        cache.put(request, response.clone());
      }
      return response;
    }).catch(() => null);

    return cached || (await network) || Response.error();
  })());
});
