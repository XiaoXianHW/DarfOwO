import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useConfig } from '../../contexts/ConfigContext'
import { HiHome, HiDocumentText, HiBriefcase, HiUserGroup, HiCog, HiMenu, HiX } from 'react-icons/hi'
import SettingsPanel from '../common/SettingsPanel'

const SideNav = () => {
  const location = useLocation()
  const config = useConfig()
  const navItems = config.navigation || []
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // 检测滚动
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const iconMap = {
    '主页': HiHome,
    '文章': HiDocumentText,
    '作品': HiBriefcase,
    '朋友': HiUserGroup,
  }

  return (
    <>
      {/* 移动端顶部导航 - 简洁设计 */}
      <nav className={`lg:hidden fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'pt-3 px-4' 
          : 'pt-4 px-4'
      }`}>
        <div className={`flex justify-between items-center h-14 px-4 rounded-xl transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-white/80 dark:bg-black/60 border border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
        }`}>
          {/* 左侧菜单按钮 */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded-lg transition-all ${
              isScrolled
                ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                : 'text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-black/20'
            }`}
          >
            {isMobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiMenu className="w-5 h-5" />}
          </button>

          {/* 右侧设置按钮 */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-2 rounded-lg transition-all ${
              isScrolled
                ? 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'
                : 'text-gray-900 dark:text-gray-100 hover:bg-white/20 dark:hover:bg-black/20'
            }`}
          >
            <HiCog className="w-5 h-5" />
          </button>
        </div>

        {/* 移动端下拉菜单 */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-3 rounded-xl backdrop-blur-xl bg-white/90 dark:bg-black/70 border border-gray-200/50 dark:border-gray-800/50"
            >
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = iconMap[item.name]
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'text-primary-600 dark:text-accent-400 font-semibold'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 桌面端侧边导航 - 简洁设计 */}
      <nav className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-2 py-4 px-3">
          {/* 头像 */}
          <Link 
            to="/" 
            className="mb-3 pb-3 w-full flex justify-center group"
          >
            <img 
              src={config.home?.avatar} 
              alt={config.site?.author || 'Avatar'}
              className="w-10 h-10 rounded-lg object-cover transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg"
            />
          </Link>

          {/* 导航链接 */}
          <div className="flex flex-col items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = iconMap[item.name]
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative group p-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-primary-600 dark:text-accent-400'
                      : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                  title={item.name}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  
                  {/* 左侧指示线 */}
                  <motion.div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-600 dark:bg-accent-400'
                        : 'bg-transparent'
                    }`}
                    animate={{
                      width: isActive ? '3px' : '0px',
                      height: isActive ? '20px' : '0px'
                    }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  />

                  {/* 悬浮提示 */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                    {item.name}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* 设置按钮 */}
          <div className="mt-2 pt-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="relative group p-2.5 rounded-lg transition-all duration-200 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="设置"
            >
              <HiCog className="w-5 h-5" />
              
              {/* 悬浮提示 */}
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-3 py-1.5 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                设置
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 设置面板 */}
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}

export default SideNav
