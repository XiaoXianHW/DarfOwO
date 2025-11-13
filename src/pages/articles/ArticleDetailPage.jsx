import { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiUser, HiDocumentText, HiShieldCheck } from 'react-icons/hi'
import { useLayout } from '../../contexts/LayoutContext'
import { useConfig } from '../../contexts/ConfigContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getArticleById } from '../../utils/articleLoader'
import MarkdownContent from '../../components/common/MarkdownContent'
import SEO from '../../components/common/SEO'
import ScrollProgress from '../../components/common/ScrollProgress'
import { countWords, formatWordCount } from '../../utils/textUtils'

const ArticleDetailPage = () => {
  const location = useLocation()
  const { '*': slug } = useParams()
  const { getMaxWidth } = useLayout()
  const config = useConfig()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  // 设置动态页面标题
  usePageTitle(article ? article.title : '文章详情')

  // 从 location.pathname 提取文章 ID（支持子目录，解码 URL）
  const articleId = decodeURIComponent(location.pathname.replace('/articles/', ''))

  // 异步加载文章内容
  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true)
      const data = await getArticleById(articleId)
      setArticle(data)
      setLoading(false)
    }
    loadArticle()
  }, [articleId])

  // 计算字数
  const wordCount = article ? countWords(article.content) : 0

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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-6">文章未找到</h1>
          <Link
            to="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg ui-tag border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-300"
          >
            <HiArrowLeft className="w-5 h-5" />
            返回文章列表
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <SEO 
        title={article.title}
        description={article.excerpt}
        keywords={article.tags}
        type="article"
        article={{
          publishedTime: article.date,
          author: article.author || config.site?.author,
          section: article.category,
          tags: article.tags
        }}
      />
      <ScrollProgress />
      <div className="min-h-screen px-6 lg:px-12 py-20">
        <div className={`${getMaxWidth()} mx-auto transition-all duration-300 ease-in-out`}>
          {/* 返回按钮和分类 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-3 text-sm"
          >
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 transition-colors duration-300 group"
            >
              <HiArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
              <span>返回文章列表</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <span className="text-gray-500 dark:text-gray-500">{article.category}</span>
          </motion.div>

          {/* 文章头部 */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <header className="mb-16">
              {/* 标题和元数据 - 带左侧线条 */}
              <div className="relative pl-6 md:pl-8 border-l-4 border-gray-900 dark:border-gray-100 mb-8">
                {/* 标题 */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                >
                  {article.title}
                </motion.h1>

                {/* 元数据 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-gray-500 dark:text-gray-500"
                >
                  <div className="flex items-center gap-1.5">
                    <HiUser className="w-4 h-4" />
                    <span>{article.author || config.site?.author || 'XiaoXian'}</span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <span>{new Date(article.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span className="text-gray-300 dark:text-gray-700">•</span>
                  <div className="flex items-center gap-1.5">
                    <HiDocumentText className="w-4 h-4" />
                    <span>{formatWordCount(wordCount)}</span>
                  </div>
                </motion.div>
              </div>

              {/* 版权声明 */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex items-start gap-2.5 p-4 rounded-lg ui-tag-secondary border border-transparent"
              >
                <HiShieldCheck className="w-4 h-4 text-primary-600 dark:text-accent-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  本文为原创文章，版权归作者所有。未经授权，禁止转载、复制或以其他方式使用本文内容。
                </p>
              </motion.div>
            </header>

            {/* 文章内容 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="prose prose-lg max-w-none markdown-content mb-12"
            >
              <MarkdownContent content={article.content} />
            </motion.div>

            {/* 文章底部：标签 */}
            {article.tags && article.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-lg ui-tag border border-transparent hover:border-primary-500 dark:hover:border-accent-400 text-sm transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.article>
        </div>
      </div>
    </>
  )
}

export default ArticleDetailPage
