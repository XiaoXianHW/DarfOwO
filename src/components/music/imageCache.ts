// Tracks which cover URLs have already finished loading (or failed) in this
// session. This does NOT prefetch anything — it only remembers outcomes so a
// cover that was already loaded can render instantly (no fade-in) when its row
// remounts after a sort/group switch. Actual de-duplication of network
// requests is handled by the browser's HTTP cache (covers are sent with
// `cache-control: public, max-age=...`).
const loaded = new Set<string>();
const failed = new Set<string>();

export const isLoaded = (url?: string): boolean => !!url && loaded.has(url);
export const hasFailed = (url?: string): boolean => !!url && failed.has(url);

export function markLoaded(url?: string): void {
  if (url) loaded.add(url);
}

export function markFailed(url?: string): void {
  if (url) failed.add(url);
}
