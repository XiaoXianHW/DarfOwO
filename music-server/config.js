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

  // ===== 左 / 右分区规则（重点）=====
  // 站点音乐页分两块：左侧是「我最常听」单曲列表，右侧是歌手 / 专辑卡片。
  //   · 凡是在下面 artists / albums 里【写了名字】的歌手 / 专辑 →
  //     只出现在右侧（作为可点进详情的卡片），其歌曲【从左侧列表移除】。
  //   · 没写名字的歌曲 → 正常留在左侧「我最常听」列表里。
  // 所以：想把某个歌手 / 专辑单独突出，就在下面写上它的名字即可（值可留空 {}）。

  // 左侧列表排序（可选）：默认按扫描顺序；若写了，命中的曲目排到最前。
  // 元素可为 相对路径 / "歌手 - 歌名" / 歌名。
  liked: [],

  // 右侧歌手卡片。key = 歌手名（与标签 / 文件名一致）；值用于覆盖别名 / 简介 / 头像，可留空 {}。
  // 写在这里的歌手，其全部歌曲会从左侧列表移到该歌手卡片下。
  artists: {
    // 'The Weeknd': {},  // 仅突出，不改信息
    // 'Lukas Graham': { alias: 'Lukas', bio: '丹麦流行乐队。', cover: 'https://…' },
  },

  // 右侧专辑卡片。key = 文件夹名（或音频标签里的专辑名）；值可留空 {}。
  // 写在这里的专辑 / 文件夹，其全部歌曲会从左侧列表移到该专辑卡片下。
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
