// =============================================================================
// 音乐库类型定义与运行时数据容器。
// 不内置任何固定/示例曲目：所有数据在应用挂载前由「XiaoXian 音乐服务」
// (music-server/) 通过 loadLibrary() 拉取并填充（见文件末尾）。服务不可用时，
// 下面的 ARTISTS / ALBUMS / SONGS / FEATURED 均保持为空数组。
// =============================================================================

export interface LyricLine {
  /** 时间轴（秒），用于歌词高亮 / 自动滚动 */
  time: number;
  /** 原文 */
  t: string;
  /** 译文（中文翻译，无则留空） */
  x?: string;
}

/** 轻量曲目（列表展示用，无歌词） */
export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  cover: string;
  /** 时长（秒） */
  dur: number;
  /** 可直接播放的音频直链；填入后即真实播放，留空则回退到可视进度。 */
  audio?: string;
}

export interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  year?: number;
  cover: string;
  lines: LyricLine[];
}

export interface Artist {
  id: string;
  name: string;
  /** 别名 / 英文名 */
  alias?: string;
  cover: string;
  bio?: string;
  /** 热门曲目（左侧歌单列表） */
  hot: Track[];
}

export interface Album {
  id: string;
  name: string;
  artist: string;
  year?: number;
  cover: string;
  /** 一句话说明 */
  note?: string;
  /** 专辑曲目（左侧歌单列表） */
  tracks: Track[];
}

// 运行时由「XiaoXian 音乐服务」(music-server/) 填充（见文件末尾 loadLibrary）。
// 不再内置任何固定曲目数据：服务不可用时这些列表保持为空。
export const ARTISTS: Artist[] = [];

export const ALBUMS: Album[] = [];

export const SONGS: Song[] = [];

/** 默认左侧歌单：我最常听（即精选 SONGS，含歌词） */
export const FEATURED: Track[] = SONGS.map((s) => ({
  id: s.id, name: s.name, artist: s.artist, album: s.album, cover: s.cover,
  dur: s.lines.length ? Math.ceil(s.lines[s.lines.length - 1].time + 8) : 0,
}));

// 全部曲目索引（精选 + 歌手热门 + 专辑曲目），用于详情页按 id 查找。
const TRACK_INDEX: Record<string, Track> = {};
function rebuildIndex(): void {
  for (const k of Object.keys(TRACK_INDEX)) delete TRACK_INDEX[k];
  for (const t of [
    ...FEATURED,
    ...ARTISTS.flatMap((a) => a.hot),
    ...ALBUMS.flatMap((a) => a.tracks),
  ]) {
    if (!TRACK_INDEX[t.id]) TRACK_INDEX[t.id] = t;
  }
}
rebuildIndex();

// =============================================================================
// 从「XiaoXian 音乐服务」(music-server/) 拉取真实音乐库。
// VITE_MUSIC_API 指向服务地址（如 https://music.xiaoxian.org）；留空则用内置回退数据。
// 拉取成功后整库替换，音频 / 封面的相对地址会补全为服务的绝对地址。
// =============================================================================
const MUSIC_API = ((import.meta.env.VITE_MUSIC_API as string | undefined) ?? '').replace(/\/+$/, '');

const absUrl = (u: string | undefined): string =>
  u && u.startsWith('/') && MUSIC_API ? MUSIC_API + u : (u ?? '');

const fixTrack = (t: Track): Track => ({ ...t, cover: absUrl(t.cover), audio: absUrl(t.audio) });

function replaceArr<T>(target: T[], items: T[]): void {
  target.splice(0, target.length, ...items);
}

interface LibraryResponse {
  featured?: Track[];
  songs?: Song[];
  artists?: Artist[];
  albums?: Album[];
}

let loaded = false;

/**
 * 从音乐服务加载整库；失败则保留内置回退数据。
 * 在应用挂载前调用（见 main.tsx），确保各页面渲染时已是真实数据。
 */
export async function loadLibrary(): Promise<boolean> {
  if (loaded) return true;
  try {
    const res = await fetch(`${MUSIC_API}/api/library`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as LibraryResponse;

    if (data.featured) replaceArr(FEATURED, data.featured.map(fixTrack));
    if (data.songs)
      replaceArr(SONGS, data.songs.map((s) => ({ ...s, cover: absUrl(s.cover) })));
    if (data.artists)
      replaceArr(
        ARTISTS,
        data.artists.map((a) => ({ ...a, cover: absUrl(a.cover), hot: a.hot.map(fixTrack) })),
      );
    if (data.albums)
      replaceArr(
        ALBUMS,
        data.albums.map((a) => ({ ...a, cover: absUrl(a.cover), tracks: a.tracks.map(fixTrack) })),
      );

    rebuildIndex();
    loaded = true;
    return true;
  } catch (err) {
    console.warn('[music] 无法从音乐服务加载，使用内置回退数据：', err);
    return false;
  }
}

/**
 * 真实音频直链覆盖表（song id → 可直接播放的音频 URL）。
 * 在这里填入直链即可让对应歌曲真实播放（音频驱动进度 / 自动切歌）；
 * 未配置的歌曲自动回退到「可视进度」模拟。
 * 例：{ "405599119": "https://static.xiaoxian.org/audio/7-years.mp3" }
 */
export const AUDIO_SOURCES: Record<string, string> = {};

/** 取某首歌的真实音频直链（覆盖表优先，其次曲目自带的 audio 字段）。 */
export const getAudioSrc = (id: string | null | undefined): string =>
  (id ? AUDIO_SOURCES[id] ?? TRACK_INDEX[id]?.audio ?? '' : '');

export const getTrack = (id: string): Track | undefined => TRACK_INDEX[id];
export const getSong = (id: string): Song | undefined => SONGS.find((s) => s.id === id);
export const getArtist = (id: string): Artist | undefined => ARTISTS.find((a) => a.id === id);
export const getAlbum = (id: string): Album | undefined => ALBUMS.find((a) => a.id === id);
