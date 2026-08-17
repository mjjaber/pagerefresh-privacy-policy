/* Navigation primitives. Hash routing keeps GitHub Pages happy: refreshing or
   deep-linking any screen only ever requests index.html. */

export const HOME = '#/';

export function currentHash() {
  return location.hash || HOME;
}

export function go(hash, { replace = false } = {}) {
  const target = hash.startsWith('#') ? hash : `#${hash}`;
  if (currentHash() === target) return;
  if (replace) history.replaceState(history.state, '', target);
  else location.hash = target;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function back(fallback = HOME) {
  if (history.length > 1) history.back();
  else go(fallback);
}

/** Split "#/video/abc" into ["video", "abc"]. */
export function segments(hash = currentHash()) {
  return hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
}
