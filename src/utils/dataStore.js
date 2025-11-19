import { APP_CONFIG } from '../config'

export const getProjects = () => {
  return APP_CONFIG.projects?.list || []
}

export const getFriends = () => {
  return APP_CONFIG.friends?.list || []
}
