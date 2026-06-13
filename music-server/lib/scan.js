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

  // ===== 分组规则 =====
  // 只有「在 config 里显式写了名字」的歌手 / 专辑才会出现在右侧（作为可点进详情的卡片），
  // 且其歌曲从左侧「我最常听」列表中移除；其余歌曲正常留在左侧列表。
  const artistOverrides = cfg.artists || {};
  const albumOverrides = cfg.albums || {};
  const has = (obj, k) => Object.prototype.hasOwnProperty.call(obj, k);

  const claimedByArtist = (t) => has(artistOverrides, t.artist);
  const claimedByAlbum = (t) => has(albumOverrides, t._folderName) || has(albumOverrides, t.album);

  // 右侧：歌手卡片（仅 config 中写了的歌手，且确有歌曲）
  const artists = [];
  for (const [name, raw] of Object.entries(artistOverrides)) {
    const ov = raw || {};
    const hot = all.filter((t) => t.artist === name);
    if (!hot.length) continue;
    artists.push({
      id: slug('artist:' + name),
      name: ov.name || name,
      alias: ov.alias || '',
      cover: ov.cover || (hot.find((t) => t.cover) || {}).cover || '',
      bio: ov.bio || '',
      hot: hot.map(publicTrack),
    });
  }

  // 右侧：专辑卡片（仅 config 中写了的专辑 / 文件夹名，且确有歌曲）
  const albums = [];
  for (const [key, raw] of Object.entries(albumOverrides)) {
    const ov = raw || {};
    const tracks = all.filter((t) => t._folderName === key || t.album === key);
    if (!tracks.length) continue;
    const artistSet = new Set(tracks.map((t) => t.artist));
    albums.push({
      id: slug('album:' + key),
      name: ov.name || key,
      artist: ov.artist || (artistSet.size === 1 ? [...artistSet][0] : 'Various Artists'),
      year: ov.year,
      cover: ov.cover || (tracks.find((t) => t.cover) || {}).cover || '',
      note: ov.note,
      tracks: tracks.map(publicTrack),
    });
  }

  // 左侧：我最常听 = 未被任何已配置歌手 / 专辑「认领」的歌曲
  const leftover = all.filter((t) => !claimedByArtist(t) && !claimedByAlbum(t));
  const featured = orderFeatured(cfg, leftover);

  const library = {
    generatedAt: new Date().toISOString(),
    counts: { tracks: all.length, songs: songs.length, artists: artists.length, albums: albums.length },
    featured,
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

/**
 * 左侧「我最常听」的排序。默认按扫描顺序原样返回；
 * 若 config.liked 写了歌名/相对路径，则把命中的曲目排到最前面（其余跟在后面）。
 */
function orderFeatured(cfg, pool) {
  const liked = cfg.liked || [];
  if (!liked.length) return pool.map(publicTrack);

  const rest = [...pool];
  const head = [];
  for (const want of liked) {
    const w = String(want).toLowerCase();
    const idx = rest.findIndex(
      (t) =>
        t._rel.toLowerCase() === w ||
        `${t.artist} - ${t.name}`.toLowerCase() === w ||
        t.name.toLowerCase() === w,
    );
    if (idx >= 0) head.push(rest.splice(idx, 1)[0]);
  }
  return [...head, ...rest].map(publicTrack);
}
