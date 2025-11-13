import matter from 'gray-matter'

// 文章清单缓存
let manifestCache = null

// 加载文章清单
export const loadManifest = async () => {
  if (manifestCache) {
    return manifestCache
  }

  try {
    const response = await fetch('/manifest.json')
    if (!response.ok) {
      throw new Error('Failed to load articles manifest')
    }
    manifestCache = await response.json()
    return manifestCache
  } catch (error) {
    console.error('Error loading manifest:', error)
    return []
  }
}

// 加载单篇文章内容
export const loadArticleContent = async (articlePath) => {
  try {
    // articlePath 可能是 "welcome.md" 或 "技术/react-hooks.md"
    const response = await fetch(`/docs/${articlePath}`)
    if (!response.ok) {
      throw new Error(`Failed to load article: ${articlePath}`)
    }
    const content = await response.text()
    const { data: frontmatter, content: markdown } = matter(content)
    
    return {
      frontmatter,
      content: markdown
    }
  } catch (error) {
    console.error(`Error loading article ${articlePath}:`, error)
    return null
  }
}

// 获取所有文章列表（仅元数据）
export const getArticles = async () => {
  const manifest = await loadManifest()
  return manifest
}

// 根据ID获取文章（包含完整内容）
export const getArticleById = async (id) => {
  const manifest = await loadManifest()
  const articleMeta = manifest.find(article => article.id === id)
  
  if (!articleMeta) {
    return null
  }

  // 使用 path 字段加载文章内容（支持子目录）
  const articleData = await loadArticleContent(articleMeta.path)
  
  if (!articleData) {
    return null
  }

  return {
    id: articleMeta.id,
    title: articleData.frontmatter.title || articleMeta.title,
    excerpt: articleData.frontmatter.excerpt || articleMeta.excerpt,
    content: articleData.content,
    category: articleMeta.category, // 使用目录结构的分类
    tags: articleData.frontmatter.tags || articleMeta.tags,
    date: articleData.frontmatter.date || articleMeta.date,
    author: articleData.frontmatter.author || articleMeta.author
  }
}

// 根据分类获取文章
export const getArticlesByCategory = async (category) => {
  const articles = await getArticles()
  if (category === 'all') return articles
  return articles.filter(article => article.category === category)
}

// 获取所有分类
export const getAllCategories = async () => {
  const articles = await getArticles()
  const categories = new Set(articles.map(a => a.category))
  return ['all', ...Array.from(categories)]
}

