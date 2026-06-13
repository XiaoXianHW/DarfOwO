// Tiny in-memory image cache shared across the whole app.
//
// Covers are requested from many places (library list, mini-player, lyric
// page) and the library list re-mounts its <img> nodes whenever the user
// switches sort/group mode. Without a cache that re-mount makes the browser
// re-request every cover. We keep the decoded HTMLImageElement alive in a Map
// so the bytes stay in memory and any later <img src> hits the cache instantly
// (no flicker, no refetch), independent of server cache headers.

const cache = new Map<string, HTMLImageElement>();
const loaded = new Set<string>();
const failed = new Set<string>();
const inflight = new Map<string, Promise<boolean>>();

export const isLoaded = (url?: string): boolean => !!url && loaded.has(url);
export const hasFailed = (url?: string): boolean => !!url && failed.has(url);

/** Warm the cache for a URL; resolves true on success, false on error. */
export function preload(url?: string): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  if (loaded.has(url)) return Promise.resolve(true);
  if (failed.has(url)) return Promise.resolve(false);

  const existing = inflight.get(url);
  if (existing) return existing;

  const p = new Promise<boolean>((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      cache.set(url, img); // retain so the browser keeps it in memory
      loaded.add(url);
      inflight.delete(url);
      resolve(true);
    };
    img.onerror = () => {
      failed.add(url);
      inflight.delete(url);
      resolve(false);
    };
    img.src = url;
  });
  inflight.set(url, p);
  return p;
}
