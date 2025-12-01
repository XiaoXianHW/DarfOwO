import { HiMail } from 'react-icons/hi'
import { FaQq, FaTelegram, FaDiscord, FaGithub, FaXTwitter } from 'react-icons/fa6'
import { SiBilibili } from 'react-icons/si'
import { RiNeteaseCloudMusicLine } from 'react-icons/ri'

const iconMap = {
  HiMail,
  FaQq,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaXTwitter,
  SiBilibili,
  RiNeteaseCloudMusicLine,
}

export const getIcon = (iconName) => {
  return iconMap[iconName] || null
}
