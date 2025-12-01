import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiOutlineMenuAlt2, HiChevronDown } from 'react-icons/hi'

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([])
  const [activeId, setActiveId] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    // 解析 markdown 内容提取标题
    const extractHeadings = () => {
      // 先移除代码块（包括行内代码和代码块）
      let cleanContent = content
        // 移除三个反引号的代码块
        .replace(/```[\s\S]*?```/g, '')
        // 移除单个反引号的行内代码
        .replace(/`[^`\n]+`/g, '')
      
      const headingRegex = /^(#{1,3})\s+(.+)$/gm
      const matches = []
      let match

      while ((match = headingRegex.exec(cleanContent)) !== null) {
        const level = match[1].length
        const text = match[2].trim()
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
        
        matches.push({ level, text, id })
      }

      setHeadings(matches)
    }

    if (content) {
      extractHeadings()
    }
  }, [content])

  useEffect(() => {
    // 监听滚动，高亮当前章节
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    // 观察所有标题元素
    headings.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [headings])

  const scrollToHeading = (id) => {
    // 使用 setTimeout 确保 DOM 完全渲染
    setTimeout(() => {
      const element = document.getElementById(id)
      if (!element) return
      
      // 移动端使用较小的offset，桌面端使用较大的offset
      const isMobile = window.innerWidth < 1280
      const offset = isMobile ? 100 : 120
      
      // 获取元素相对于视口的位置
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const targetPosition = rect.top + scrollTop - offset
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
    }, 50)
  }

  if (headings.length === 0) return null

  const activeIndex = headings.findIndex(h => h.id === activeId)

  return (
    <>
      {/* 桌面端 - 右上角目录 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className="hidden xl:block fixed right-6 2xl:right-12 top-20 z-20"
      >
        <div className="relative flex justify-end">
          {/* 目录按钮 */}
          <motion.button
            animate={{ 
              opacity: isExpanded ? 0 : 1,
              scale: isExpanded ? 0.98 : 1
            }}
            transition={{ 
              duration: 0.15, 
              ease: [0.4, 0, 0.2, 1],
              delay: isExpanded ? 0 : 0.15
            }}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-accent-400 transition-colors duration-200 group"
            style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
          >
            <HiOutlineMenuAlt2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="text-sm font-medium">目录</span>
          </motion.button>

          {/* 展开状态 - 无背景列表 */}
          <motion.nav
            initial={false}
            animate={{ 
              opacity: isExpanded ? 1 : 0,
              y: isExpanded ? 0 : -8,
              scale: isExpanded ? 1 : 0.96
            }}
            transition={{ 
              duration: 0.28, 
              ease: [0.25, 0.8, 0.25, 1],
              delay: isExpanded ? 0.08 : 0
            }}
            className="absolute top-0 right-0 min-w-[240px] max-w-[320px] pr-2 max-h-[70vh] overflow-y-auto custom-scrollbar py-2"
            style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
          >
                <ul className="space-y-1">
                  {headings.map((heading, index) => (
                    <li
                      key={`${heading.id}-${index}`}
                      className="relative"
                    >
                      <button
                        onClick={() => scrollToHeading(heading.id)}
                        className={`
                          w-full text-right text-sm py-2 transition-all duration-200 group
                          ${activeId === heading.id
                            ? 'text-primary-600 dark:text-accent-400 font-semibold'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                          }
                        `}
                        style={{ paddingRight: `${16 + (heading.level - 1) * 12}px` }}
                      >
                        <span className="line-clamp-1 leading-snug block">{heading.text}</span>
                      </button>
                      
                      {/* 右侧线条 */}
                      <motion.div 
                        className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${
                          activeId === heading.id
                            ? 'bg-primary-600 dark:bg-accent-400'
                            : 'bg-gray-300 dark:bg-gray-700 group-hover:bg-gray-500 dark:group-hover:bg-gray-500'
                        }`}
                        animate={{
                          width: activeId === heading.id ? '3px' : '2px',
                          height: activeId === heading.id ? '20px' : '14px'
                        }}
                        whileHover={{ height: activeId === heading.id ? '20px' : '16px' }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </li>
                  ))}
                </ul>
          </motion.nav>
        </div>
      </motion.div>

      {/* 移动端 - 文章开头 */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="xl:hidden mb-8"
      >
        <div className="ui-tag rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <HiOutlineMenuAlt2 className="w-4 h-4 text-primary-600 dark:text-accent-400 transition-transform duration-200 group-hover:scale-110" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">目录</h3>
            </div>
            <motion.div
              animate={{ rotate: isMobileOpen ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-200" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isMobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden border-t border-gray-200 dark:border-gray-800"
              >
                <div className="px-4 py-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <ul className="space-y-1.5">
                    {headings.map((heading, index) => (
                      <li
                        key={`mobile-${heading.id}-${index}`}
                        className="relative"
                        style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // 先关闭列表，再执行跳转
                            setIsMobileOpen(false)
                            // 延迟执行跳转，确保列表关闭动画完成
                            setTimeout(() => {
                              scrollToHeading(heading.id)
                            }, 350)
                          }}
                          className={`
                            w-full text-left text-sm py-2 pl-4 pr-2 rounded-lg transition-all duration-200 group relative
                            ${activeId === heading.id
                              ? 'text-primary-600 dark:text-accent-400 font-semibold'
                              : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                            }
                          `}
                        >
                          <span className="leading-relaxed block">{heading.text}</span>
                          
                          {/* 左侧指示线 */}
                          <motion.div
                            className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 ${
                              activeId === heading.id
                                ? 'bg-primary-600 dark:bg-accent-400'
                                : 'bg-transparent'
                            }`}
                            animate={{
                              width: activeId === heading.id ? '3px' : '0px',
                              height: activeId === heading.id ? '20px' : '0px'
                            }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}

export default TableOfContents
