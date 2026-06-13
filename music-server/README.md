# XiaoXian 音乐服务

扫描本地音乐目录（音频 + 同名 `.lrc` 歌词），**按文件夹自动分组**为 专辑 / 歌手 / 我最常听，
对外提供 JSON 歌单、音频流（支持拖动）与封面，供 [xiaoxian.org](https://xiaoxian.org) 音乐页直接消费。

> 用法：从网易云批量下载你喜欢的歌曲（连同 `.lrc`），按文件夹丢进 `music/`，启动服务即可自动解析、分组、热更新。

## 快速开始

```bash
cd music-server
npm install
# 把音乐放进 ./music（见下方目录结构），然后：
npm start
# → http://0.0.0.0:8080
```

校验扫描结果（只打印统计，不起服务）：

```bash
npm run scan
```

## 目录结构（按文件夹分组）

每个**子文件夹**会成为一个「专辑 / 合辑」，文件夹名即专辑名；歌手由标签或文件名推断。
文件名建议用 `歌手 - 歌名` 形式（网易云批量下载的默认命名即如此），歌词与音频**同名**：

```
music/
├── Lukas Graham/
│   ├── Lukas Graham - 7 Years.mp3
│   └── Lukas Graham - 7 Years.lrc
├── The Weeknd/
│   ├── The Weeknd - Blinding Lights.flac
│   └── The Weeknd - Blinding Lights.lrc
└── 喜欢/                     # 名为 喜欢/我喜欢/Liked/Favorites 的文件夹会成为「我最常听」
    └── ...
```

- 元数据优先读音频内嵌标签（标题 / 歌手 / 专辑 / 年份 / 封面 / 时长），缺失时回退到 `歌手 - 歌名` 文件名解析。
- 封面：优先内嵌封面，其次同目录的 `cover.jpg` / `folder.jpg` / `<同名>.jpg`。
- 歌词：同名 `.lrc`，兼容网易云格式（`[mm:ss.xx]` 标准行、`{"t":ms,"c":[…]}` JSON 行），
  自动跳过制作信息、合并相同时间戳的**原文 / 译文**双行。

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/library` | 整库 JSON：`{ featured, songs, artists, albums, counts }`（`?refresh=1` 强制重扫） |
| GET | `/api/audio/:id` | 音频流，支持 `Range`（拖动 / 边下边播） |
| GET | `/api/cover/:id` | 封面图 |
| POST | `/api/rescan` | 手动重新扫描 |
| GET | `/api/health` | 健康检查 |

库变更（上传 / 删除文件）会被**目录监听**自动重扫（防抖 1.5s），也可手动 `POST /api/rescan`。

## 配置（`config.js`，均可用环境变量覆盖）

| 配置 | 环境变量 | 默认 | 说明 |
| --- | --- | --- | --- |
| `port` | `MUSIC_PORT` | `8080` | 监听端口 |
| `host` | `MUSIC_HOST` | `0.0.0.0` | 监听地址 |
| `musicDir` | `MUSIC_DIR` | `./music` | 音乐根目录 |
| `publicBaseUrl` | `MUSIC_BASE_URL` | `''` | 对外域名；填了则音频 / 封面返回绝对 URL |
| `liked` | — | `[]` | 左侧列表排序（命中项排到最前），可留空 |
| `cors` / `corsOrigin` | `MUSIC_CORS_ORIGIN` | `*` | 跨域 |
| `watch` | `MUSIC_WATCH` | 开 | 目录热更新（`0` 关闭） |

### 左 / 右分区（`artists` / `albums`）

音乐页分两块：**左侧**是「我最常听」单曲列表，**右侧**是歌手 / 专辑卡片。

- 在 `config.js` 的 `artists` / `albums` 里**写了名字**的歌手 / 专辑 → 只出现在**右侧**（点进去看详情和歌曲列表），其歌曲**从左侧列表移除**。
- **没写**名字的歌曲 → 正常留在**左侧**列表。

```js
// config.js
artists: {
  'The Weeknd': {},                       // 仅突出到右侧
  'Lukas Graham': { alias: 'Lukas', bio: '…', cover: 'https://…' },
},
albums: {
  'After Hours': { year: 2020, note: '…', cover: 'https://…' }, // key = 文件夹名 / 专辑名
},
```

值可留空 `{}`（只突出，不改信息），也可覆盖别名 / 简介 / 头像 / 年份 / 封面。

## 与站点对接

站点 (`xiaoxian.org`) 启动时拉取 `/api/library` 整库替换内置数据，二选一：

- **A. 同源反代（推荐）**：站点 `.env` 留空 `VITE_MUSIC_API`，由反代把 `/api/library`、
  `/api/audio`、`/api/cover` 转发到本服务。开发期可设 `MUSIC_SERVER_URL=http://localhost:8080`，
  Vite 会自动反代（见站点 `vite.config.ts`）。生产用 Nginx 等价配置即可。
- **B. 独立域名**：本服务设 `MUSIC_BASE_URL=https://music.xiaoxian.org` 并开启 CORS，
  站点设 `VITE_MUSIC_API=https://music.xiaoxian.org`。

### Nginx 同源反代示例

```nginx
location ~ ^/api/(library|audio|cover|rescan) {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
}
```

### systemd 常驻示例

```ini
[Unit]
Description=XiaoXian Music Server
After=network.target

[Service]
WorkingDirectory=/opt/xiaoxian-music-server
Environment=MUSIC_DIR=/data/music
ExecStart=/usr/bin/node server.js
Restart=always

[Install]
WantedBy=multi-user.target
```

## 测试

```bash
npm test   # 歌词解析单测
```
