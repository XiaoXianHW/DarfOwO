// 朋友 / 友链数据。

export interface Friend {
  name: string;
  /** 一句话简介 / 站点域名 */
  description?: string;
  link?: string;
  avatar?: string;
}

export interface FriendLink {
  name: string;
  url: string;
}

// 朋友区标语。
export const FRIENDS_TAGLINE = '群除我佬';

export const FRIENDS: Friend[] = [
  {
    name: 'Shuakami',
    description: 'sdjz.wiki',
    link: 'https://sdjz.wiki',
    avatar: 'https://sdjz.wiki/shuakami.jpg',
  },
  {
    name: '量子猫步',
    description: 'shanshui.site',
    link: 'https://shanshui.site/',
    avatar: 'https://static.shanshui.site/logo/avatar.webp',
  },
  {
    name: '幻歆',
    description: 'blog.huanxinbot.com',
    link: 'https://blog.huanxinbot.com/',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=3485462167&s=100',
  },
  {
    name: '自孤',
    description: 'zigu.me',
    link: 'https://zigu.me/',
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=1772270306&s=100',
  },
  {
    name: 'Rainbow SPY',
    description: 'github.com/Rainbow-SPY',
    link: 'https://github.com/Rainbow-SPY',
    avatar: 'https://avatars.githubusercontent.com/u/141826358?v=4',
  },
];

// 友链 —— 站点网络。
export const FRIEND_LINKS: FriendLink[] = [
  { name: 'AxT', url: 'https://www.axtn.net' },
  { name: 'ArcTower', url: 'https://www.axtrk.com' },
  { name: 'DarfDEV', url: 'https://darf.dev' },
  { name: 'DeepArc', url: 'https://arcyuan.cn' },
  { name: 'UApi', url: 'https://uapis.cn' },
  { name: 'Blog', url: 'https://blog.xiaoxian.org' },
  { name: 'ArcLibrary', url: 'https://wiki.darf.dev' },
];
