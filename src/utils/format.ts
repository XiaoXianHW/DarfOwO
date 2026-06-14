const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

// Mi Fitness timestamps use the +08:00 offset; format in that zone for stable labels.
function parse(at: string): Date {
  return new Date(at);
}

export function shortDate(at: string): string {
  const d = parse(at);
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${m}-${day}`;
}

export function weekday(at: string): string {
  return WEEKDAYS[parse(at).getDay()];
}

export function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

// "m:ss" playhead label (negative clamped to 0). Used by the players.
export function clockTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Track-duration label: same as clockTime but blank when the length is unknown.
export function trackTime(sec: number): string {
  return isFinite(sec) && sec > 0 ? clockTime(sec) : '';
}

// Local "MM-DD HH:MM" used for the "last refreshed" subtitle.
export function formatClock(at: string): string {
  const d = parse(at);
  const hh = `${d.getHours()}`.padStart(2, '0');
  const mm = `${d.getMinutes()}`.padStart(2, '0');
  return `${shortDate(at)} ${hh}:${mm}`;
}
