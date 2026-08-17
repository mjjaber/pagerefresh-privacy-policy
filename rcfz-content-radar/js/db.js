/* Minimal promise wrapper around IndexedDB.
   Everything the app owns lives in three stores on the device — nothing is
   ever sent anywhere. */

const DB_NAME = 'rcfz-content-radar';
const DB_VERSION = 1;

export const STORES = { creators: 'creators', videos: 'videos', meta: 'meta' };

let dbPromise = null;

export function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      reject(err);
      return;
    }

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORES.creators)) {
        const s = db.createObjectStore(STORES.creators, { keyPath: 'id' });
        s.createIndex('by_lastChecked', 'lastChecked');
        s.createIndex('by_permission', 'permission');
        s.createIndex('by_platform', 'platform');
      }

      if (!db.objectStoreNames.contains(STORES.videos)) {
        const s = db.createObjectStore(STORES.videos, { keyPath: 'id' });
        s.createIndex('by_creator', 'creatorId');
        s.createIndex('by_status', 'status');
        s.createIndex('by_priority', 'priority');
        s.createIndex('by_dateSaved', 'dateSaved');
      }

      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: 'key' });
      }
    };

    req.onsuccess = () => {
      const db = req.result;
      // If another tab upgrades the schema, drop our handle so the next call
      // reopens cleanly instead of throwing InvalidStateError.
      db.onversionchange = () => { db.close(); dbPromise = null; };
      resolve(db);
    };

    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('Database upgrade blocked by another open tab.'));
  });

  return dbPromise;
}

function run(storeNames, mode, work) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(storeNames, mode);
    let result;
    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
    try {
      result = work(tx);
      if (result && typeof result.then === 'function') {
        reject(new Error('Transaction callbacks must be synchronous.'));
        tx.abort();
      }
    } catch (err) {
      reject(err);
      try { tx.abort(); } catch { /* already aborting */ }
    }
  }));
}

const wrap = (request) => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

/* ----------------------------------------------------------- read API -- */

export async function getAll(store) {
  const db = await openDB();
  return wrap(db.transaction(store, 'readonly').objectStore(store).getAll());
}

export async function get(store, key) {
  const db = await openDB();
  return wrap(db.transaction(store, 'readonly').objectStore(store).get(key));
}

export async function count(store) {
  const db = await openDB();
  return wrap(db.transaction(store, 'readonly').objectStore(store).count());
}

/* ---------------------------------------------------------- write API -- */

export function put(store, value) {
  return run(store, 'readwrite', (tx) => { tx.objectStore(store).put(value); }).then(() => value);
}

export function putMany(store, values) {
  return run(store, 'readwrite', (tx) => {
    const os = tx.objectStore(store);
    for (const v of values) os.put(v);
  }).then(() => values.length);
}

export function remove(store, key) {
  return run(store, 'readwrite', (tx) => { tx.objectStore(store).delete(key); });
}

export function clear(store) {
  return run(store, 'readwrite', (tx) => { tx.objectStore(store).clear(); });
}

/** Replace the entire database contents in a single atomic transaction. */
export function replaceAll({ creators = [], videos = [], meta = [] }) {
  const names = [STORES.creators, STORES.videos, STORES.meta];
  return run(names, 'readwrite', (tx) => {
    const c = tx.objectStore(STORES.creators);
    const v = tx.objectStore(STORES.videos);
    const m = tx.objectStore(STORES.meta);
    c.clear(); v.clear(); m.clear();
    for (const x of creators) c.put(x);
    for (const x of videos) v.put(x);
    for (const x of meta) m.put(x);
  });
}

/** Add-or-update across all stores without deleting anything already there. */
export function mergeAll({ creators = [], videos = [], meta = [] }) {
  const names = [STORES.creators, STORES.videos, STORES.meta];
  return run(names, 'readwrite', (tx) => {
    const c = tx.objectStore(STORES.creators);
    const v = tx.objectStore(STORES.videos);
    const m = tx.objectStore(STORES.meta);
    for (const x of creators) c.put(x);
    for (const x of videos) v.put(x);
    for (const x of meta) m.put(x);
  });
}

/** Delete a video and every reference to it, atomically. */
export function deleteVideo(id) {
  return run(STORES.videos, 'readwrite', (tx) => { tx.objectStore(STORES.videos).delete(id); });
}

/** Delete a creator and detach (never delete) the videos that pointed at it. */
export async function deleteCreatorCascade(creatorId) {
  const videos = await getAll(STORES.videos);
  const orphans = videos
    .filter((v) => v.creatorId === creatorId)
    .map((v) => ({ ...v, creatorId: null, updatedAt: new Date().toISOString() }));

  return run([STORES.creators, STORES.videos], 'readwrite', (tx) => {
    tx.objectStore(STORES.creators).delete(creatorId);
    const vs = tx.objectStore(STORES.videos);
    for (const v of orphans) vs.put(v);
  }).then(() => orphans.length);
}
