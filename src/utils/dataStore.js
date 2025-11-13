// 数据存储和管理
// 直接从 config 读取数据
import { APP_CONFIG } from '../config'

// 获取项目列表
export const getProjects = () => {
  return APP_CONFIG.projects?.list || []
}

// 获取朋友列表
export const getFriends = () => {
  return APP_CONFIG.friends?.list || []
}
