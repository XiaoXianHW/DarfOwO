import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiChevronLeft, HiChevronRight, HiEye, HiEyeOff, HiArrowsExpand, HiX, HiChevronDown } from 'react-icons/hi'
import { useConfig } from '../../contexts/ConfigContext'
import { useLayout } from '../../contexts/LayoutContext'
import { useTheme } from '../../contexts/ThemeContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getProjects } from '../../utils/dataStore'

const ProjectsPage = () => {
  const config = useConfig()
  const { getMaxWidth } = useLayout()
  const { actualTheme } = useTheme()
  const [projects, setProjects] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [infoVisible, setInfoVisible] = useState(true)
  const [immersiveMode, setImmersiveMode] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  // 设置页面标题
  usePageTitle('作品')

  useEffect(() => {
    const data = getProjects()
    setProjects(data)
  }, [])

  const categories = ['all', ...(config.projects?.categories || [])]
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  const currentProject = filteredProjects[currentIndex] || null
  const axtProject = projects.find(p => p.id === '1' || p.title.includes('AxT社区'))

  // 切换分类时重置索引
  useEffect(() => {
    setCurrentIndex(0)
  }, [selectedCategory])

  // 沉浸式模式：隐藏滚动条和sidebar
  useEffect(() => {
    if (immersiveMode) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('hide-sidebar')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('hide-sidebar')
    }
    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('hide-sidebar')
    }
  }, [immersiveMode])

  const nextProject = () => {
    if (currentIndex < filteredProjects.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const prevProject = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  return (
    <div className={`${
      immersiveMode 
        ? 'fixed inset-0 overflow-hidden' 
        : 'min-h-screen px-6 lg:px-12 py-20 overflow-hidden'
    }`}>
      <div className={`${
        immersiveMode ? 'w-full h-full flex flex-col' : `${getMaxWidth()} mx-auto`
      } transition-all duration-300`}>
        {/* 头部 - 可隐藏 */}
        {!immersiveMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center justify-between gap-8"
          >
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-1 h-12 md:h-16 bg-primary-600 dark:bg-accent-400 rounded-full" />
              <h1 className="text-5xl md:text-7xl font-bold">作品</h1>
            </div>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-5">
              这里是我的一些作品和项目
            </p>
          </div>
          
          {/* AxT社区项目 */}
          {axtProject && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block flex-shrink-0"
            >
              <a
                href={axtProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 mb-1">
                      {axtProject.title}
                    </div>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                      {axtProject.subtitle}
                    </p>
                  </div>
                    <div className="flex items-center justify-center w-16 h-16 flex-shrink-0">
                      <img
                      src={actualTheme === 'dark' ? 'https://static.axtn.net/logo/AxT_invert.png' : 'https://static.axtn.net/logo/AxT.png'}
                        alt={axtProject.title}
                        className="w-full h-full object-contain transition-opacity duration-300"
                      />
                    </div>
                </div>
              </a>
              </motion.div>
            )}
            </motion.div>
        )}

        {/* 分类筛选 - 右侧固定，类似sidebar */}
        {!immersiveMode && (
          <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center gap-2 py-4 px-3"
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'text-primary-600 dark:text-accent-400 font-semibold'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </motion.div>
          </div>
        )}

        {/* 作品展示区 */}
        {filteredProjects.length > 0 && currentProject ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            transition={{ 
              duration: 0.6, 
              delay: immersiveMode ? 0 : 0.3,
              ease: [0.16, 1, 0.3, 1]
            }}
            className={immersiveMode ? 'flex-1 flex flex-col px-6 lg:px-12 py-6' : 'relative w-full'}
          >
            {/* 控制栏 - 沉浸式时在顶部 */}
            {immersiveMode && (
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                {/* 左侧：切换按钮 */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevProject}
                    disabled={currentIndex === 0}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      currentIndex === 0 
                        ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title="上一个作品"
                  >
                    <HiChevronLeft className="w-6 h-6" />
                  </button>
                  
                  {/* 中间：分类标签 - 手机端可点击 */}
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="lg:pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 lg:cursor-default lg:bg-transparent bg-gray-100 dark:bg-gray-800 lg:border-0 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hover:bg-transparent lg:hover:text-gray-900 lg:dark:hover:text-gray-100 transition-all duration-200 active:scale-95"
                  >
                    <span>{currentProject.category}</span>
                    <HiChevronDown className="w-4 h-4 lg:hidden" />
                  </button>
                  
                  <button
                    onClick={nextProject}
                    disabled={currentIndex === filteredProjects.length - 1}
                    className={`p-2.5 rounded-lg transition-all duration-200 ${
                      currentIndex === filteredProjects.length - 1
                        ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    title="下一个作品"
                  >
                    <HiChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* 右侧：功能按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setInfoVisible(!infoVisible)}
                    className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                    title={infoVisible ? '隐藏信息' : '显示信息'}
                  >
                    {infoVisible ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => setImmersiveMode(!immersiveMode)}
                    className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                    title={immersiveMode ? '退出沉浸式' : '沉浸式模式'}
                  >
                    <HiArrowsExpand className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* 作品容器 - 带缩放动画 */}
            <motion.div
              initial={{ scale: 0.98 }}
              animate={{
                scale: immersiveMode ? 1 : 0.98
              }}
              transition={{ 
                duration: 0.4, 
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`relative rounded-2xl overflow-hidden ${
                immersiveMode 
                  ? 'flex-1 mb-6' 
                  : 'h-[calc(100vh-24rem)] min-h-[500px] mb-6'
              }`}
            >
              {/* 背景图片 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  {currentProject.media && currentProject.media[0] && (
                    <img
                      src={currentProject.media[0].url}
                      alt={currentProject.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* 信息层遮罩 - 可调节透明度 */}
              <motion.div
                animate={{ 
                  opacity: infoVisible ? 1 : 0.3
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"
              />

              {/* 信息内容层 */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProject.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: infoVisible ? 1 : 0.4
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 p-6 lg:p-8"
                >
                  {/* 左上角：标题 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl lg:text-5xl font-bold text-white drop-shadow-2xl">
                      {currentProject.title}
                    </h2>
                  </motion.div>

                  {/* 左下角：技术栈和介绍 */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="absolute left-6 lg:left-8 bottom-6 lg:bottom-8 space-y-3 max-w-2xl"
                  >
                    {/* 技术栈 */}
                    {currentProject.technologies && currentProject.technologies.length > 0 && (
                      <div className="text-white/90 text-xs font-medium drop-shadow">
                        {currentProject.technologies.slice(0, 6).map((tech, idx, arr) => (
                          <span key={tech}>
                            {tech}
                            {idx < arr.length - 1 && <span className="text-white/50 mx-1.5">·</span>}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* 介绍 */}
                    <p className="text-base lg:text-lg text-white/90 line-clamp-2 drop-shadow">
                      {currentProject.intro}
                    </p>
                  </motion.div>

                  {/* 右上角：访问项目按钮 */}
                  {currentProject.link && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="absolute right-6 lg:right-8 top-6 lg:top-8"
                    >
                      <a
                        href={currentProject.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-white/80 transition-all duration-200"
                      >
                        访问项目
                        <HiChevronRight className="w-4 h-4" />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* 进度指示器和作品数量 */}
            <div className={`${immersiveMode ? 'flex-shrink-0' : ''}`}>
              <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-600 dark:bg-accent-400"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentIndex + 1) / filteredProjects.length) * 100}%` }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>{currentProject.title}</span>
                <span>{currentIndex + 1} / {filteredProjects.length}</span>
              </div>
            </div>

            {/* 控制栏 - 正常模式在进度条下方 */}
            {!immersiveMode && (
            <div className="mt-4 flex items-center justify-between">
              {/* 左侧：切换按钮 */}
              <div className="flex items-center gap-3">
                <button
                  onClick={prevProject}
                  disabled={currentIndex === 0}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    currentIndex === 0 
                      ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title="上一个作品"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>
                
                {/* 中间：分类标签 - 手机端可点击 */}
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="lg:pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 lg:cursor-default lg:bg-transparent bg-gray-100 dark:bg-gray-800 lg:border-0 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hover:bg-transparent lg:hover:text-gray-900 lg:dark:hover:text-gray-100 transition-all duration-200 active:scale-95"
                >
                  <span>{currentProject.category}</span>
                  <HiChevronDown className="w-4 h-4 lg:hidden" />
                </button>
                
                <button
                  onClick={nextProject}
                  disabled={currentIndex === filteredProjects.length - 1}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    currentIndex === filteredProjects.length - 1
                      ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  title="下一个作品"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* 右侧：功能按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInfoVisible(!infoVisible)}
                  className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                  title={infoVisible ? '隐藏信息' : '显示信息'}
                >
                  {infoVisible ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setImmersiveMode(!immersiveMode)}
                  className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200"
                  title={immersiveMode ? '退出沉浸式' : '沉浸式模式'}
                >
                  <HiArrowsExpand className="w-5 h-5" />
                </button>
              </div>
            </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 dark:text-gray-400">暂无项目</p>
          </div>
        )}

        {/* 手机端分类选择弹窗 */}
        <AnimatePresence>
          {showCategoryModal && (
            <>
              {/* 背景遮罩 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCategoryModal(false)}
                className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
              
              {/* 弹窗内容 */}
              <div className="lg:hidden fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                  className="w-[90vw] max-w-sm ui-card backdrop-blur-md border border-transparent rounded-xl shadow-2xl"
                >
                  {/* 头部 */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800/60">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-primary-600 dark:bg-accent-400 rounded-full" />
                      <h2 className="text-xl font-bold">选择分类</h2>
                    </div>
                    <button
                      onClick={() => setShowCategoryModal(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* 分类选项 */}
                  <div className="p-6">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 border border-transparent dark:border-gray-800">
                      <div className="grid grid-cols-2 gap-1 w-full">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setSelectedCategory(cat)
                              setShowCategoryModal(false)
                              setCurrentIndex(0)
                            }}
                            className={`flex items-center justify-center py-3 rounded-md transition-all duration-200 ${
                              selectedCategory === cat
                                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                          >
                            <span className="text-sm font-medium">{cat === 'all' ? '全部' : cat}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ProjectsPage
