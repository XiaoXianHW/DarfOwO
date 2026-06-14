// 朋友 / 友链数据来源于 src/config.js，这里只做类型化导出。
import { config } from '../config';

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

export const FRIENDS_TAGLINE: string = config.friends.description;
export const FRIENDS: Friend[] = config.friends.list;
export const FRIEND_LINKS: FriendLink[] = config.friends.links;
