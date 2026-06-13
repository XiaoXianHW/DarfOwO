// XiaoXian 音乐服务配置。
// 所有项都可用环境变量覆盖（见每行 process.env），方便部署时不改代码。

export const config = {
  // 监听端口 / 地址
  port: Number(process.env.MUSIC_PORT) || 8080,
  host: process.env.MUSIC_HOST || '0.0.0.0',

  // 音乐根目录：把网易云下载的音乐 + 同名 .lrc 按文件夹放进来。
  // 例：music/Lukas Graham/Lukas Graham - 7 Years.mp3 (+ .lrc)
  musicDir: process.env.MUSIC_DIR || './music',

  // 对外域名 / 基地址：用于拼出音频与封面的绝对 URL。
  // 站点跨域请求本服务时建议填，例：https://music.xiaoxian.org
  // 留空则返回相对路径（/api/audio/:id），适合反代到同源路径下。
  publicBaseUrl: process.env.MUSIC_BASE_URL || '',

  // 识别为音频的扩展名
  audioExts: ['.mp3', '.flac', '.m4a', '.aac', '.ogg', '.oga', '.opus', '.wav'],

  // 「我最常听」(FEATURED) 选取规则，优先级从上到下：
  //   1) liked：精确匹配，元素可为相对路径 / "歌手 - 歌名" / 歌名
  //   2) likedFolder：指定某个文件夹名作为「喜欢」歌单
  //   3) 自动识别名为 喜欢/我喜欢/Liked/Favorites 的文件夹
  //   4) 取前 featuredLimit 首
  liked: [],
  likedFolder: process.env.MUSIC_LIKED_FOLDER || null,
  featuredLimit: 50,

  // 歌手信息覆盖（可选）：补充别名 / 简介 / 头像。
  // key 为歌手名（与标签 / 文件名一致）。
  artists: {
    // 'The Weeknd': { alias: 'Abel', bio: '加拿大 R&B / 流行歌手。', cover: 'https://…' },
  },

  // 专辑 / 文件夹信息覆盖（可选）。key 为文件夹名。
  albums: {
    // 'After Hours': { note: '2020 专辑', year: 2020, cover: 'https://…' },
  },

  // CORS（站点跨域拉取 /api/library 需要）
  cors: true,
  corsOrigin: process.env.MUSIC_CORS_ORIGIN || '*',

  // 目录热更新：上传 / 删除后自动重新扫描
  watch: process.env.MUSIC_WATCH !== '0',
  watchDebounceMs: 1500,
};
