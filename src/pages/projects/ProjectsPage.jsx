import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { HiArrowRight, HiCalendar, HiLightningBolt, HiCheckCircle, HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import { useConfig } from '../../contexts/ConfigContext'
import { useLayout } from '../../contexts/LayoutContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getProjects } from '../../utils/dataStore'
import { useInView } from '../../hooks/useInView'

// 多媒体展示组件
const MediaCarousel = ({ media = [], title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [progress, setProgress] = useState(0)

  const nextMedia = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
    setProgress(0)
  }

  const prevMedia = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
    setProgress(0)
  }

  // 自动轮播逻辑
  useEffect(() => {
    if (!isHovered || media.length <= 1) return

    const duration = 3000 // 3秒轮播
    const interval = 50 // 更新频率
    const increment = (interval / duration) * 100

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextMedia()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timer)
  }, [isHovered, currentIndex, media.length])

  // 重置进度条
  useEffect(() => {
    if (!isHovered) {
      setProgress(0)
    }
  }, [isHovered])

  if (!media || media.length === 0) return null

  const currentMedia = media[currentIndex]

  return (
    <div 
      className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 装饰性渐变 */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 dark:to-black/20 pointer-events-none" />
      
      {/* 媒体内容 */}
      {currentMedia.type === 'image' || currentMedia.type === 'gif' ? (
        <img
          src={currentMedia.url}
          alt={currentMedia.caption || title}
          className="relative w-full h-full object-cover"
          loading="lazy"
        />
      ) : currentMedia.type === 'video' ? (
        <video
          src={currentMedia.url}
          className="relative w-full h-full object-cover"
          controls
          muted
          loop
        />
      ) : null}
      
      {/* 悬停遮罩 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300" />
      
      {/* 导航按钮 - 仅在有多个媒体时显示 */}
      {media.length > 1 && (
        <>
          <button
            onClick={prevMedia}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300"
            aria-label="上一个"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextMedia}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all duration-300"
            aria-label="下一个"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
          
          {/* 进度条指示器 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, index) => (
              <div key={index} className="relative">
                <button
                  onClick={() => setCurrentIndex(index)}
                  className={`block w-8 h-1 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`切换到第${index + 1}个媒体`}
                />
                {/* 当前项的进度条 */}
                {index === currentIndex && isHovered && (
                  <div 
                    className="absolute top-0 left-0 h-1 bg-white rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            ))}
          </div>
        </>
      )}
      
      {/* 媒体说明 */}
      {currentMedia.caption && (
        <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-black/50 text-white text-sm max-w-xs">
          {currentMedia.caption}
        </div>
      )}
    </div>
  )
}

const ProjectsPage = () => {
  const config = useConfig()
  const { getMaxWidth } = useLayout()
  const [projects, setProjects] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ref, isInView] = useInView({ threshold: 0.1 })

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

  // 找到AxT社区项目
  const axtProject = projects.find(p => p.id === '1' || p.title.includes('AxT社区'))

  return (
    <div className="min-h-screen px-6 lg:px-12 py-20">
      <div className={`${getMaxWidth()} mx-auto transition-all duration-300 ease-in-out`}>
                {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 md:h-16 bg-primary-600 dark:bg-accent-400 rounded-full" />
              <h1 className="text-5xl md:text-7xl font-bold">作品</h1>
            </div>
            {/* AxT社区项目 */}
            {axtProject && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block text-right"
              >
                <a
                  href={axtProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-right">
                      <div className="text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 mb-1">
                        {axtProject.title}
                      </div>
                      <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                        {axtProject.subtitle}
                      </p>
                    </div>
                    {axtProject.logo && (
                      <img
                        src={axtProject.logo}
                        alt={axtProject.title}
                        className="w-10 h-10 md:w-10 md:h-10 flex-shrink-0"
                      />
                    )}
                  </div>
                </a>
              </motion.div>
            )}
          </div>
          {/* 副标题 */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-5"
          >
            这里是我的一些作品和项目
          </motion.p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
                    initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-2.5 mb-12"
        >
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                selectedCategory === cat
                  ? 'border-gray-900 dark:border-gray-100 bg-gray-100 dark:bg-gray-900'
                  : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
              }`}
            >
              {cat === 'all' ? '全部' : cat}
            </button>
          ))}
        </motion.div>

        {/* 项目列表 */}
        <div ref={ref} className="space-y-12">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => {
              const isEven = index % 2 === 1 // 交错布局：奇数索引(第2、4...)右图左文
              
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div className={`grid lg:grid-cols-5 gap-8 p-8 rounded-xl ui-card border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-300 ${isEven ? 'lg:direction-rtl' : ''}`}>
                    {/* 图片容器 (占3列) */}
                    <div className={`lg:col-span-3 relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                      <MediaCarousel media={project.media || []} title={project.title} />
                    </div>

                    {/* 信息容器 (占2列) */}
                    <div className={`lg:col-span-2 flex flex-col justify-between space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      {/* 头部信息 */}
                      <div>
                        {/* 标题和标签 */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {project.link ? (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <h2 className="text-3xl md:text-4xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 hover:text-primary-600 dark:hover:text-accent-400 transition-colors duration-300 cursor-pointer">
                                {project.title}
                              </h2>
                            </a>
                          ) : (
                            <h2 className="text-3xl md:text-4xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                              {project.title}
                            </h2>
                          )}
                          <span className="px-3 py-1 rounded-lg ui-tag text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 flex-shrink-0">
                            {project.category}
                          </span>
                        </div>

                                            {/* 简介 */}
                      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {project.intro}
                      </p>

                                            {/* 时间和成就 */}
                      <div className="flex flex-wrap gap-4 mb-4">
                        {project.startedAt && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <HiCalendar className="w-4 h-4" />
                            <span>{project.startedAt}</span>
                          </div>
                        )}
                        {project.achievement && (
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <HiLightningBolt className="w-4 h-4" />
                            <span>{project.achievement}</span>
                          </div>
                        )}
                      </div>

                                            {/* 项目特点 */}
                      {project.features && project.features.length > 0 && (
                        <div className="space-y-1.5">
                          {project.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <HiCheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 底部：技术栈 */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      {/* 技术栈 */}
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map(tech => (
                            <span
                              key={tech}
                              className="px-3 py-1 rounded-lg text-xs ui-tag text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block p-8 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                <p className="text-xl text-gray-600 dark:text-gray-400">暂无项目</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
