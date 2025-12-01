import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendar, HiTag, HiFolder, HiFolderOpen } from 'react-icons/hi'
import { useConfig } from '../../contexts/ConfigContext'
import { useLayout } from '../../contexts/LayoutContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useArticleSettings } from '../../contexts/ArticleSettingsContext'
import { getArticles, getAllCategories, getArticleById } from '../../utils/articleLoader'
import { countWords, formatWordCount } from '../../utils/textUtils'

const ARTICLES_PER_PAGE = 5

const ArticlesPage = () => {
  const config = useConfig()
  const { getMaxWidth } = useLayout()
  
  // 设置页面标题
  usePageTitle('文章')
  const [allArticles, setAllArticles] = useState([])
  const [displayedArticles, setDisplayedArticles] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState(['all'])
  const [loading, setLoading] = useState(true)
  const [articleStats, setArticleStats] = useState({ count: 0, totalWords: 0 })
  const [loadingMore, setLoadingMore] = useState(false)
  const loadMoreRef = useRef(null)
  const { viewMode, categoryDisplayMode } = useArticleSettings()

  // 加载所有文章（异步）
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [articlesData, categoriesData] = await Promise.all([
        getArticles(),
        getAllCategories()
      ])
      setAllArticles(articlesData)
      setCategories(categoriesData)
      
      // 计算统计数据 - 加载所有文章内容来计算准确字数
      let totalWords = 0
      for (const articleMeta of articlesData) {
        try {
          const fullArticle = await getArticleById(articleMeta.id)
          if (fullArticle && fullArticle.content) {
            totalWords += countWords(fullArticle.content)
          }
        } catch (error) {
          console.warn(`Failed to load article ${articleMeta.id} for word count:`, error)
          // 如果加载失败，使用摘要作为备选
          totalWords += countWords(articleMeta.excerpt || '')
        }
      }
      
      setArticleStats({
        count: articlesData.length,
        totalWords: totalWords
      })
      
      setLoading(false)
    }
    loadData()
  }, [])

  // 获取当前分类的所有文章
  const filteredArticles = selectedCategory === 'all'
    ? allArticles
    : allArticles.filter(a => a.category === selectedCategory)

  // 初始加载 - 当分类或文章列表变化时重新加载
  useEffect(() => {
    if (allArticles.length === 0) return // 等待文章加载完成
    
    const initialArticles = filteredArticles.slice(0, ARTICLES_PER_PAGE)
    setDisplayedArticles(initialArticles)
  }, [selectedCategory, allArticles, filteredArticles])

  // 检查是否还有更多文章
  const hasMore = displayedArticles.length < filteredArticles.length

  // 加载更多文章
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    const startIndex = displayedArticles.length
    const endIndex = startIndex + ARTICLES_PER_PAGE
    const newArticles = filteredArticles.slice(startIndex, endIndex)
    
    // 模拟加载延迟，防止闪烁
    setTimeout(() => {
      setDisplayedArticles(prev => [...prev, ...newArticles])
      setLoadingMore(false)
    }, 300)
  }, [displayedArticles.length, filteredArticles, loadingMore, hasMore])

  // 滚动加载
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef && hasMore && !loading) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loadMore, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载文章中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-6 lg:px-12 py-20">
      <div className={`${getMaxWidth()} mx-auto transition-all duration-300 ease-in-out`}>
        {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex items-center justify-between gap-8"
        >
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-1 h-12 md:h-16 bg-primary-600 dark:bg-accent-400 rounded-full" />
              <h1 className="text-5xl md:text-7xl font-bold">文章</h1>
            </div>
            {/* 副标题 */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-5"
            >
              我写过 {articleStats.count} 篇文章，总计 {formatWordCount(articleStats.totalWords)}
            </motion.p>
          </div>
          {/* 置顶文章 */}
          {config.articles?.pinnedArticle && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block flex-shrink-0"
            >
              <a
                href={config.articles.pinnedArticle.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="relative pb-3">
                  <div className="text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 mb-1 text-right">
                    {config.articles.pinnedArticle.title}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-right">
                    {config.articles.pinnedArticle.subtitle}
                  </p>
                  {/* 底部装饰线 */}
                  <div className="absolute bottom-0 right-0 w-16 h-0.5 bg-primary-500 dark:bg-accent-400 transition-all duration-300 group-hover:w-24 group-hover:bg-primary-600 dark:group-hover:bg-accent-500" />
                </div>
              </a>
            </motion.div>
          )}
        </motion.div>

        {/* 分类筛选 */}
        {config.articles?.showCategories && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div>
              {categoryDisplayMode === 'tags' ? (
                /* 标签模式 */
                <div className="flex flex-wrap gap-2.5">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                        selectedCategory === cat
                          ? 'border-primary-500 dark:border-accent-400 bg-gray-100 dark:bg-gray-900'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      {cat === 'all' ? '全部' : cat}
                    </button>
                  ))}
                </div>
              ) : (
                /* 树状图模式 */
                <div className="space-y-2">
                  {categories.map(cat => {
                    const isSelected = selectedCategory === cat
                    const count = cat === 'all' ? allArticles.length : allArticles.filter(a => a.category === cat).length
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full flex items-center justify-between gap-4 px-4 py-2.5 rounded-lg transition-all duration-300 text-left group ${
                          isSelected
                            ? 'bg-gray-100 dark:bg-gray-900 border border-primary-500 dark:border-accent-400'
                            : 'border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isSelected ? (
                            <HiFolderOpen className={`w-5 h-5 flex-shrink-0 ${
                              isSelected ? 'text-primary-600 dark:text-accent-400' : 'text-gray-400'
                            }`} />
                          ) : (
                            <HiFolder className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                          )}
                          <span className={`font-medium ${
                            isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {cat === 'all' ? '全部文章' : cat}
                          </span>
                        </div>
                        <span className={`text-sm px-2.5 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-primary-100 dark:bg-accent-900/30 text-primary-700 dark:text-accent-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        }`}>
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 文章列表 */}
        <div className={viewMode === 'card' ? 'space-y-8' : 'space-y-0'}>
          {displayedArticles.length > 0 ? (
            <>
              {displayedArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                >
                  <Link
                    to={`/articles/${article.id}`}
                    className="group block"
                  >
                    {viewMode === 'card' ? (
                      /* 卡片视图 */
                      <div className="relative space-y-4 py-6 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
                        {/* 日期和分类 */}
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <HiCalendar className="w-4 h-4" />
                            <span>{new Date(article.date).toLocaleDateString('zh-CN')}</span>
                          </div>
                          <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                          <span className="px-2.5 py-0.5 rounded ui-tag-secondary border border-transparent">
                            {article.category}
                          </span>
                        </div>

                        {/* 标题 */}
                        <h2 className="text-2xl md:text-3xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                          {article.title}
                        </h2>

                        {/* 摘要 */}
                        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg leading-relaxed line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* 标签 */}
                        {config.articles?.showTags && article.tags && article.tags.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <HiTag className="w-4 h-4 text-gray-400" />
                            {article.tags.map(tag => (
                              <span
                                key={tag}
                                className="text-sm text-gray-500 dark:text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* 底部装饰线 */}
                        <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-primary-500 dark:bg-accent-400 transition-all duration-300 group-hover:w-32" />
                      </div>
                    ) : (
                      /* 紧凑视图 */
                      <div className="relative flex items-center justify-between gap-6 py-4 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
                        <div className="flex-1 min-w-0">
                          <h2 className="text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 truncate">
                            {article.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs ui-tag-secondary border border-transparent">
                            {article.category}
                          </span>
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                            <HiCalendar className="w-4 h-4" />
                            <span className="hidden md:inline">{new Date(article.date).toLocaleDateString('zh-CN')}</span>
                            <span className="md:hidden">{new Date(article.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}</span>
                          </div>
                        </div>
                        
                        {/* 底部装饰线 */}
                        <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-primary-500 dark:bg-accent-400 transition-all duration-300 group-hover:w-24" />
                      </div>
                    )}
                  </Link>
                </motion.div>
              ))}

              {/* 加载更多触发器 */}
              {hasMore && (
                <div ref={loadMoreRef} className="py-8 text-center">
                  {loadingMore ? (
                    <div className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <div className="w-2 h-2"></div>
                  )}
                </div>
              )}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-lg text-gray-600 dark:text-gray-400">暂无文章</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
