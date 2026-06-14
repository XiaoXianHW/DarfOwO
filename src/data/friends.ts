// 朋友 / 友链数据 —— 这里是示例，替换为真实的朋友与友链即可。
// url 留空或为 '#' 时，卡片渲染为不可点击（避免空链接）。

export interface Friend {
  name: string;
  /** 社交昵称 / handle，如 @xiaoxian */
  handle?: string;
  /** 一句话标签：身份 / 关系 */
  role?: string;
  url?: string;
  /** 头像直链；留空则用首字母渐变占位 */
  avatar?: string;
  accent: string;
}

export interface FriendLink {
  name: string;
  url?: string;
  desc?: string;
  accent: string;
}

export const FRIENDS: Friend[] = [
  { name: 'Luna', handle: '@luna', role: '插画师 · 同好', accent: '#f472b6' },
  { name: '星野', handle: '@hoshino', role: '独立游戏开发', accent: '#818cf8' },
  { name: 'Kerwin', handle: '@kerwin', role: '全栈 · 老搭档', accent: '#38bdf8' },
  { name: '陌路', handle: '@molu', role: '摄影 · 旅行', accent: '#34d399' },
  { name: 'Aria', handle: '@aria', role: '音乐人', accent: '#fb923c' },
  { name: '青柠', handle: '@lime', role: '设计师', accent: '#a3e635' },
];

export const FRIEND_LINKS: FriendLink[] = [
  { name: "Darf's Blog", url: 'https://darf.dev', desc: '理性侧 · 技术博客', accent: '#5B89D2' },
  { name: 'ArcYuan', url: 'https://arcyuan.cn', desc: '感性侧 · 随笔与作品', accent: '#fb923c' },
  { name: '友人小站', desc: '在此添加友链描述', accent: '#34d399' },
  { name: '某某的博客', desc: '在此添加友链描述', accent: '#c084fc' },
  { name: 'Someone.dev', desc: '在此添加友链描述', accent: '#22d3ee' },
  { name: 'Another Site', desc: '在此添加友链描述', accent: '#f472b6' },
];
