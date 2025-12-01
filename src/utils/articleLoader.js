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
  
  // 如果在 manifest 中找到文章元数据
  if (articleMeta) {
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
      category: articleMeta.category,
      tags: articleData.frontmatter.tags || articleMeta.tags,
      date: articleData.frontmatter.date || articleMeta.date,
      author: articleData.frontmatter.author || articleMeta.author,
      password: articleData.frontmatter.password || null
    }
  }
  
  // 如果 manifest 中没有找到（可能是隐藏文章），尝试直接加载
  // id 格式如 "技术/文章名" 或 "文章名"，需要加 .md 后缀
  const articlePath = `${id}.md`
  const articleData = await loadArticleContent(articlePath)
  
  if (!articleData) {
    return null
  }
  
  // 从文件路径提取分类（取第一级目录名，如果有的话）
  const pathParts = id.split('/')
  const category = pathParts.length > 1 ? pathParts[0] : '未分类'
  
  return {
    id,
    title: articleData.frontmatter.title || 'Untitled',
    excerpt: articleData.frontmatter.excerpt || '',
    content: articleData.content,
    category,
    tags: articleData.frontmatter.tags || [],
    date: articleData.frontmatter.date || new Date().toISOString(),
    author: articleData.frontmatter.author || null,
    password: articleData.frontmatter.password || null
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
