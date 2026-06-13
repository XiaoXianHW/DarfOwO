// 扫描音乐目录，读取音频内嵌标签（ID3/FLAC…）+ 同名 .lrc，
// 按文件夹自动分组为 专辑 / 歌手 / 我最常听（FEATURED），输出站点可直接消费的库 JSON。

import { promises as fs } from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseFile } from 'music-metadata';
import { parseLrc } from './lrc.js';

const COVER_NAMES = ['cover', 'folder', 'front', 'albumart'];
const COVER_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

/** 用相对路径生成稳定、URL 安全的短 id。 */
function makeId(relPath) {
  return crypto.createHash('sha1').update(relPath).digest('hex').slice(0, 12);
}

/** 名称 → slug（用于歌手 / 专辑 id）。 */
function slug(s) {
  return (
    'g' +
    crypto.createHash('sha1').update(String(s).toLowerCase()).digest('hex').slice(0, 10)
  );
}

/** 从文件名解析「歌手 - 歌名」。 */
function parseFilename(base) {
  const i = base.indexOf(' - ');
  if (i > 0) {
    return { artist: base.slice(0, i).trim(), title: base.slice(i + 3).trim() };
  }
  return { artist: '', title: base.trim() };
}

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, acc = []) {
  let items;
  try {
    items = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const it of items) {
    if (it.name.startsWith('.')) continue;
    const full = path.join(dir, it.name);
    if (it.isDirectory()) await walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

/** 找到与音频同目录、可作为封面的图片文件（无内嵌封面时回退）。 */
async function findFolderCover(fileFull, audioBase) {
  const dir = path.dirname(fileFull);
  const candidates = [audioBase, ...COVER_NAMES];
  for (const name of candidates) {
    for (const ext of COVER_EXTS) {
      const p = path.join(dir, name + ext);
      if (await exists(p)) return p;
    }
  }
  return '';
}

/**
 * 扫描目录并构建音乐库。
 * @param {object} cfg 见 config.js
 * @returns {Promise<{library:object, tracks:Map, covers:Map}>}
 */
export async function scanLibrary(cfg) {
  const root = path.resolve(cfg.musicDir);
  const base = (cfg.publicBaseUrl || '').replace(/\/+$/, '');
  const audioExts = cfg.audioExts.map((e) => e.toLowerCase());

  const files = (await walk(root)).filter((f) =>
    audioExts.includes(path.extname(f).toLowerCase()),
  );

  /** id → { file, mime } 用于音频流。 */
  const tracks = new Map();
  /** id → 封面文件路径（内嵌封面则为 'embedded'）。 */
  const covers = new Map();
  /** 全量曲目（Track），含分组所需的内部字段。 */
  const all = [];
  /** 含歌词的曲目（Song）。 */
  const songs = [];

  for (const file of files.sort()) {
    const rel = path.relative(root, file);
    const id = makeId(rel);
    const ext = path.extname(file);
    const baseName = path.basename(file, ext);
    const folderRel = path.dirname(rel) === '.' ? '' : path.dirname(rel);
    const folderName = folderRel ? path.basename(folderRel) : '单曲';
    const fromName = parseFilename(baseName);

    let tag = {};
    let duration = 0;
    let hasEmbeddedCover = false;
    try {
      const meta = await parseFile(file, { duration: true });
      tag = meta.common || {};
      duration = (meta.format && meta.format.duration) || 0;
      hasEmbeddedCover = Array.isArray(tag.picture) && tag.picture.length > 0;
    } catch (err) {
      console.warn(`[scan] 读取标签失败 ${rel}: ${err.message}`);
    }

    const title = (tag.title && tag.title.trim()) || fromName.title || baseName;
    const artist =
      (tag.artist && tag.artist.trim()) ||
      (Array.isArray(tag.artists) && tag.artists[0]) ||
      fromName.artist ||
      folderName ||
      '未知歌手';
    const album = (tag.album && tag.album.trim()) || folderName;
    const year = tag.year || undefined;

    // 封面
    let coverUrl = '';
    if (hasEmbeddedCover) {
      covers.set(id, 'embedded');
      coverUrl = `${base}/api/cover/${id}`;
    } else {
      const folderCover = await findFolderCover(file, baseName);
      if (folderCover) {
        covers.set(id, folderCover);
        coverUrl = `${base}/api/cover/${id}`;
      }
    }

    // 歌词（同名 .lrc）
    let lines = [];
    const lrcPath = path.join(path.dirname(file), baseName + '.lrc');
    if (await exists(lrcPath)) {
      try {
        const raw = await fs.readFile(lrcPath, 'utf8');
        lines = parseLrc(raw).lines;
      } catch (err) {
        console.warn(`[scan] 解析歌词失败 ${rel}: ${err.message}`);
      }
    }

    if (!duration && lines.length) duration = Math.ceil(lines[lines.length - 1].time + 6);

    const track = {
      id,
      name: title,
      artist,
      album,
      cover: coverUrl,
      dur: Math.round(duration) || 0,
      audio: `${base}/api/audio/${id}`,
      _folder: folderRel,
      _folderName: folderName,
      _rel: rel,
    };
    all.push(track);
    tracks.set(id, { file, ext });

    if (lines.length) {
      songs.push({ id, name: title, artist, album, year, cover: coverUrl, lines });
    }
  }

  // ===== 分组：专辑（按文件夹）=====
  const albumOverrides = cfg.albums || {};
  const albumMap = new Map();
  for (const t of all) {
    const key = t._folder || '__root__';
    if (!albumMap.has(key)) {
      const ov = albumOverrides[t._folderName] || albumOverrides[key] || {};
      albumMap.set(key, {
        id: slug('album:' + key),
        name: ov.name || t._folderName,
        artist: ov.artist || t.artist,
        year: ov.year,
        cover: ov.cover || '',
        note: ov.note,
        tracks: [],
        _artists: new Set(),
      });
    }
    const a = albumMap.get(key);
    a.tracks.push(publicTrack(t));
    a._artists.add(t.artist);
    if (!a.cover && t.cover) a.cover = t.cover;
  }
  const albums = [...albumMap.values()].map((a) => {
    if (a._artists.size > 1 && !albumOverrides[a.name]?.artist) a.artist = 'Various Artists';
    delete a._artists;
    return a;
  });

  // ===== 分组：歌手 =====
  const artistOverrides = cfg.artists || {};
  const artistMap = new Map();
  for (const t of all) {
    const name = t.artist;
    if (!artistMap.has(name)) {
      const ov = artistOverrides[name] || {};
      artistMap.set(name, {
        id: slug('artist:' + name),
        name,
        alias: ov.alias || '',
        cover: ov.cover || '',
        bio: ov.bio || '',
        hot: [],
      });
    }
    const a = artistMap.get(name);
    a.hot.push(publicTrack(t));
    if (!a.cover && t.cover) a.cover = t.cover;
  }
  const artists = [...artistMap.values()];

  // ===== 我最常听（FEATURED）=====
  const featured = pickFeatured(cfg, all);

  const library = {
    generatedAt: new Date().toISOString(),
    counts: { tracks: all.length, songs: songs.length, artists: artists.length, albums: albums.length },
    featured: featured.map(publicTrack),
    songs,
    artists,
    albums,
  };

  return { library, tracks, covers };
}

/** 去掉内部字段（_folder 等），返回站点可见的 Track。 */
function publicTrack(t) {
  return { id: t.id, name: t.name, artist: t.artist, album: t.album, cover: t.cover, dur: t.dur, audio: t.audio };
}

/** 选出「我最常听」：config.liked > 指定文件夹 > 含歌词曲目 > 全部。 */
function pickFeatured(cfg, all) {
  const liked = cfg.liked || [];
  if (liked.length) {
    const out = [];
    for (const want of liked) {
      const w = String(want).toLowerCase();
      const hit = all.find(
        (t) =>
          t._rel.toLowerCase() === w ||
          `${t.artist} - ${t.name}`.toLowerCase() === w ||
          t.name.toLowerCase() === w,
      );
      if (hit) out.push(hit);
    }
    if (out.length) return out;
  }
  const folder = cfg.likedFolder;
  if (folder) {
    const inFolder = all.filter(
      (t) => t._folderName === folder || t._folder === folder,
    );
    if (inFolder.length) return inFolder;
  }
  const known = ['喜欢', '我喜欢', '我最常听', 'liked', 'favorites', 'favourite'];
  const auto = all.filter((t) => known.includes(t._folderName.toLowerCase()));
  if (auto.length) return auto;

  const withLyrics = all.filter((t) => t.dur > 0);
  const pool = withLyrics.length ? all : all;
  return pool.slice(0, cfg.featuredLimit || 50);
}
