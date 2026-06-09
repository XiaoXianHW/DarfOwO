// =============================================================================
// 音乐库配置 — 手动编辑这个文件即可，无需从网易云拉数据。
//
// 三个列表：artists（喜欢的歌手）、albums（专辑）、songs（歌曲）。
// 数量随意，歌手建议 <10，专辑一两个，歌曲挑你喜欢的几首即可。
//
// 封面 cover 可不填：留空会自动用「纯色 + 首字母」占位（不用渐变）。
// 想用真实封面就填一个图片 URL（例如网易云图片直链 https://p1.music.126.net/...）。
//
// 歌词 lyrics 直接粘贴整段：
//   - 纯文本：一行一句，用换行分隔即可；
//   - 或网易云的 LRC 时间轴格式 "[00:12.34]这一句"，展示时会自动去掉时间戳。
// =============================================================================

export interface Artist {
  id: string;
  name: string;
  /** 可选拉丁文/英文名，显示在中文名下方 */
  enName?: string;
  /** 可选封面图 URL；留空用首字母占位 */
  cover?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year?: string;
  cover?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  cover?: string;
  /** 完整歌词：纯文本（\n 分行）或 LRC 时间轴 */
  lyrics?: string;
}

// ----------------------------------------------------------------------------
// 歌手（示例，替换成你喜欢的）
// ----------------------------------------------------------------------------
export const ARTISTS: Artist[] = [
  { id: 'ar1', name: '周杰伦', enName: 'Jay Chou' },
  { id: 'ar2', name: '陈奕迅', enName: 'Eason Chan' },
  { id: 'ar3', name: '五月天', enName: 'Mayday' },
  { id: 'ar4', name: '久石让', enName: 'Joe Hisaishi' },
  { id: 'ar5', name: 'The Weeknd' },
  { id: 'ar6', name: 'Daft Punk' },
];

// ----------------------------------------------------------------------------
// 专辑（示例，一两个即可）
// ----------------------------------------------------------------------------
export const ALBUMS: Album[] = [
  { id: 'al1', title: '范特西', artist: '周杰伦', year: '2001' },
  { id: 'al2', title: 'After Hours', artist: 'The Weeknd', year: '2020' },
];

// ----------------------------------------------------------------------------
// 歌曲（示例，挑你喜欢的几首；lyrics 粘贴真实歌词替换占位）
// ----------------------------------------------------------------------------
export const SONGS: Song[] = [
  {
    id: 's1',
    title: '晴天',
    artist: '周杰伦',
    album: '叶惠美',
    lyrics: [
      '（示例歌词占位 — 替换成真实歌词）',
      '故事的小黄花',
      '从出生那年就飘着',
      '童年的荡秋千',
      '随记忆一直晃到现在',
      '',
      '吹着前奏望着天空',
      '我想起花瓣试着掉落',
      '为你翘课的那一天',
      '花落的那一天',
      '教室的那一间',
      '我怎么看不见',
      '消失的下雨天',
    ].join('\n'),
  },
  {
    id: 's2',
    title: '富士山下',
    artist: '陈奕迅',
    album: 'What\'s Going On...?',
    lyrics: '（示例歌词占位 — 替换成真实歌词）\n拦路雨偏似雪花\n饮泣的你冻吗\n这风褛我给你磨到有襟花',
  },
  {
    id: 's3',
    title: '温柔',
    artist: '五月天',
    album: '爱情万岁',
    lyrics: '（示例歌词占位 — 替换成真实歌词）\n走在风中\n今天阳光突然好温柔',
  },
  {
    id: 's4',
    title: 'One Summer\'s Day',
    artist: '久石让',
    album: '千与千寻',
    lyrics: '（纯音乐 · 无歌词）',
  },
  {
    id: 's5',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    lyrics: '(Sample lyrics placeholder — replace with the real lyrics)\nYeah\nI\'ve been tryna call\nI\'ve been on my own for long enough',
  },
];
