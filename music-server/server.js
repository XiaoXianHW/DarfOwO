// XiaoXian 音乐服务 —— 扫描本地音乐目录，对外提供：
//   GET /api/library        整库 JSON（featured / songs / artists / albums）
//   GET /api/audio/:id      音频流（支持 Range，可拖动 / 边下边播）
//   GET /api/cover/:id      封面图（内嵌 ID3 封面或同目录图片）
//   POST /api/rescan        手动重新扫描
//   GET  /api/health        健康检查
//
// 配置见 config.js（支持环境变量覆盖）。把网易云批量下载的音乐 + 同名 .lrc
// 按文件夹放进 musicDir，服务会自动解析、分组并热更新。

import http from 'node:http';
import { promises as fs, createReadStream } from 'node:fs';
import path from 'node:path';
import { parseFile } from 'music-metadata';
import { config } from './config.js';
import { scanLibrary } from './lib/scan.js';

const MIME = {
  '.mp3': 'audio/mpeg', '.flac': 'audio/flac', '.m4a': 'audio/mp4', '.aac': 'audio/aac',
  '.ogg': 'audio/ogg', '.oga': 'audio/ogg', '.opus': 'audio/opus', '.wav': 'audio/wav',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
};

let cache = { library: null, tracks: new Map(), covers: new Map() };
let scanning = null;

async function rescan() {
  if (scanning) return scanning;
  scanning = (async () => {
    const t0 = Date.now();
    try {
      cache = await scanLibrary(config);
      const c = cache.library.counts;
      console.log(
        `[scan] 完成：${c.tracks} 曲目 / ${c.songs} 含歌词 / ${c.artists} 歌手 / ${c.albums} 专辑（${Date.now() - t0}ms）`,
      );
    } catch (err) {
      console.error('[scan] 失败:', err);
    } finally {
      scanning = null;
    }
  })();
  return scanning;
}

function setCors(res) {
  if (!config.cors) return;
  res.setHeader('Access-Control-Allow-Origin', config.corsOrigin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Range,Content-Type');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range,Accept-Ranges,Content-Length');
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

async function serveAudio(req, res, id) {
  const entry = cache.tracks.get(id);
  if (!entry) return sendJson(res, 404, { error: 'track not found' });
  let stat;
  try {
    stat = await fs.stat(entry.file);
  } catch {
    return sendJson(res, 404, { error: 'file missing' });
  }
  const type = MIME[entry.ext.toLowerCase()] || 'application/octet-stream';
  const total = stat.size;
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m && m[1] ? parseInt(m[1], 10) : 0;
    let end = m && m[2] ? parseInt(m[2], 10) : total - 1;
    if (isNaN(start) || start < 0) start = 0;
    if (isNaN(end) || end >= total) end = total - 1;
    if (start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${total}` });
      return res.end();
    }
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Cache-Control': 'public, max-age=86400',
    });
    createReadStream(entry.file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Type': type,
      'Content-Length': total,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=86400',
    });
    createReadStream(entry.file).pipe(res);
  }
}

async function serveCover(req, res, id) {
  const src = cache.covers.get(id);
  if (!src) return sendJson(res, 404, { error: 'no cover' });
  res.setHeader('Cache-Control', 'public, max-age=86400');
  if (src === 'embedded') {
    const entry = cache.tracks.get(id);
    if (!entry) return sendJson(res, 404, { error: 'no cover' });
    try {
      const meta = await parseFile(entry.file);
      const pic = meta.common.picture && meta.common.picture[0];
      if (!pic) return sendJson(res, 404, { error: 'no cover' });
      res.writeHead(200, { 'Content-Type': pic.format || 'image/jpeg' });
      return res.end(Buffer.from(pic.data));
    } catch {
      return sendJson(res, 404, { error: 'no cover' });
    }
  }
  const type = MIME[path.extname(src).toLowerCase()] || 'image/jpeg';
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(src).pipe(res);
}

const server = http.createServer(async (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean); // e.g. ['api','audio','<id>']

  try {
    if (url.pathname === '/api/health') {
      return sendJson(res, 200, { ok: true, counts: cache.library?.counts ?? null });
    }
    if (url.pathname === '/api/library') {
      if (!cache.library || url.searchParams.get('refresh') === '1') await rescan();
      return sendJson(res, 200, cache.library || { error: 'not ready' });
    }
    if (url.pathname === '/api/rescan' && req.method === 'POST') {
      await rescan();
      return sendJson(res, 200, { ok: true, counts: cache.library?.counts ?? null });
    }
    if (parts[0] === 'api' && parts[1] === 'audio' && parts[2]) {
      return serveAudio(req, res, decodeURIComponent(parts[2]));
    }
    if (parts[0] === 'api' && parts[1] === 'cover' && parts[2]) {
      return serveCover(req, res, decodeURIComponent(parts[2]));
    }
    if (url.pathname === '/') {
      return sendJson(res, 200, {
        name: 'xiaoxian-music-server',
        endpoints: ['/api/library', '/api/audio/:id', '/api/cover/:id', '/api/rescan (POST)', '/api/health'],
        counts: cache.library?.counts ?? null,
      });
    }
    sendJson(res, 404, { error: 'not found' });
  } catch (err) {
    console.error('[server]', err);
    sendJson(res, 500, { error: 'internal error' });
  }
});

// 启动：先扫描一次再监听。
await rescan();
server.listen(config.port, config.host, () => {
  console.log(`[server] XiaoXian 音乐服务 → http://${config.host}:${config.port}`);
  console.log(`[server] 音乐目录: ${path.resolve(config.musicDir)}`);
  if (config.publicBaseUrl) console.log(`[server] 对外域名: ${config.publicBaseUrl}`);
});

// 目录热更新：上传 / 删除文件后自动重新扫描（防抖）。
if (config.watch) {
  try {
    const { watch } = await import('node:fs');
    let timer = null;
    watch(path.resolve(config.musicDir), { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('[watch] 检测到变更，重新扫描…');
        rescan();
      }, config.watchDebounceMs || 1500);
    });
    console.log('[server] 已开启目录热更新监听');
  } catch (err) {
    console.warn('[server] 目录监听不可用（可手动 POST /api/rescan）:', err.message);
  }
}
