import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiCalendar, HiTag, HiStar } from 'react-icons/hi'
import { useConfig } from '../../contexts/ConfigContext'
import { useLayout } from '../../contexts/LayoutContext'
import { usePageTitle } from '../../hooks/usePageTitle'
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
          className="mb-16"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1 h-12 md:h-16 bg-primary-600 dark:bg-accent-400 rounded-full" />
              <h1 className="text-5xl md:text-7xl font-bold">文章</h1>
            </div>
            {/* 置顶文章 */}
            {config.articles?.pinnedArticle && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block text-right"
              >
                <a
                  href={config.articles.pinnedArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center gap-2 text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300 mb-1">
                    <HiStar className="w-5 h-5 text-yellow-500" />
                    <span>{config.articles.pinnedArticle.title}</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {config.articles.pinnedArticle.subtitle}
                  </p>
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
            我总计写过 {articleStats.count} 篇文章，总计 {formatWordCount(articleStats.totalWords)}
          </motion.p>
        </motion.div>

        {/* 分类筛选 */}
        {config.articles?.showCategories && (
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
                    ? 'border-primary-500 dark:border-accent-400 ui-tag-secondary'
                    : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                }`}
              >
                {cat === 'all' ? '全部' : cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* 文章列表 */}
        <div className="space-y-8">
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
                    <div className="space-y-4 py-6 border-b border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300">
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
                    </div>
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
