import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { HiArrowDown } from 'react-icons/hi'
import { useLayout } from '../../../contexts/LayoutContext'

const HeroSection = ({ config, onScrollDown }) => {
  const { getMaxWidth } = useLayout()
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [touchStart, setTouchStart] = useState(null)
  const sectionRef = useRef(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  // 监听滚动，隐藏提示
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 5) {
        setShowScrollHint(false)
      } else {
        setShowScrollHint(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 处理触摸/滚轮事件，自动滚动到下一区域
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.scrollY < 100 && e.deltaY > 0) {
        e.preventDefault()
        onScrollDown?.()
      }
    }

    const handleTouchStart = (e) => {
      setTouchStart(e.touches[0].clientY)
    }

    const handleTouchMove = (e) => {
      if (!touchStart) return
      
      const touchEnd = e.touches[0].clientY
      const diff = touchStart - touchEnd

      if (window.scrollY < 100 && diff > 50) {
        onScrollDown?.()
        setTouchStart(null)
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener('wheel', handleWheel, { passive: false })
      section.addEventListener('touchstart', handleTouchStart, { passive: true })
      section.addEventListener('touchmove', handleTouchMove, { passive: true })
    }

    return () => {
      if (section) {
        section.removeEventListener('wheel', handleWheel)
        section.removeEventListener('touchstart', handleTouchStart)
        section.removeEventListener('touchmove', handleTouchMove)
      }
    }
  }, [touchStart, onScrollDown])

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 overflow-hidden"
    >
      {/* 主内容 */}
      <motion.div
        className={`relative z-10 ${getMaxWidth()} w-full transition-all duration-300 ease-in-out`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center lg:text-left space-y-8">
          {/* 问候语 */}
          <motion.div variants={itemVariants} className="text-lg md:text-xl text-gray-500 dark:text-gray-500 font-medium">
            {config.home?.hello || "Hi, I'm"}
          </motion.div>

          {/* 名字 */}
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl lg:text-9xl font-bold"
          >
            {config.home?.name}
          </motion.h1>

          {/* 标题 */}
          {config.home?.title && (
            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400">
                {config.home.title}
              </p>
        
            </motion.div>
          )}

          {/* 简介 */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center lg:flex-row lg:items-start gap-4"
          >
            {/* 桌面端使用 border-left */}
            <div className="hidden lg:block w-1 bg-primary-600 dark:bg-accent-400 rounded-full flex-shrink-0 self-stretch" />
            <div className="flex flex-col items-center lg:items-start gap-4 w-full">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed text-center lg:text-left">
                {config.home?.subtitle}
              </p>
              {/* 手机端和平板端底部短线条 */}
              <div className="lg:hidden w-16 h-1 bg-primary-600 dark:bg-accent-400 rounded-full" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 滚动提示 - 固定在屏幕底部中央，可点击 */}
      <motion.div
        className="fixed bottom-12 left-0 right-0 z-20 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: showScrollHint ? 1 : 0,
          y: showScrollHint ? [0, 10, 0] : 0
        }}
        transition={{
          opacity: { duration: 0.3 },
          y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{ pointerEvents: showScrollHint ? 'auto' : 'none' }}
      >
        <button
          onClick={onScrollDown}
          className="flex flex-col items-center gap-2 cursor-pointer hover:scale-110 transition-transform"
        >
          <span className="text-sm text-gray-500 dark:text-gray-400">向下滚动</span>
          <HiArrowDown className="w-6 h-6 text-gray-500 dark:text-gray-400" />
        </button>
      </motion.div>
    </section>
  )
}

export default HeroSection
