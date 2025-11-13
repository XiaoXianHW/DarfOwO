import { useLocation } from 'react-router-dom'
import SideNav from './SideNav'
import BackgroundEffect from './BackgroundEffect'
import SettingsPanel from '../common/SettingsPanel'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="relative min-h-screen text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
      {/* 背景效果 */}
      <BackgroundEffect />
      
      {/* 侧边导航 */}
      <SideNav />
      
      {/* 设置面板 */}
      <SettingsPanel />
      
      {/* 主内容区 - 移除动画避免双重动画 */}
      <main key={location.pathname} className="relative z-10 lg:pt-0 lg:ml-20 min-h-screen">
        {children}
      </main>
    </div>
  )
}

export default Layout
