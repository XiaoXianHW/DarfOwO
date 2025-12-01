import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const docsDir = path.join(__dirname, '../docs')
const publicDir = path.join(__dirname, '../public')
const manifestPath = path.join(publicDir, 'manifest.json')

// 统计字数（中英文混合）
function countWords(text) {
  if (!text) return 0
  
  let cleanText = text
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/[#*_~`>]/g, '')
    .replace(/\n+/g, ' ')
  
  const chineseChars = cleanText.match(/[\u4e00-\u9fa5]/g) || []
  const englishWords = cleanText
    .replace(/[\u4e00-\u9fa5]/g, ' ')
    .match(/[a-zA-Z0-9]+/g) || []
  
  return chineseChars.length + englishWords.length
}

// 递归读取所有 markdown 文件
function getAllMarkdownFiles(dir, baseDir = dir, category = null) {
  const files = []
  
  if (!fs.existsSync(dir)) {
    return files
  }

  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory()) {
      // 递归读取子目录，使用目录名作为分类
      const subCategory = item.name
      files.push(...getAllMarkdownFiles(fullPath, baseDir, subCategory))
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // 计算相对路径作为文件路径
      const relativePath = path.relative(baseDir, fullPath)
      files.push({
        fullPath,
        relativePath: relativePath.replace(/\\/g, '/'), // 统一使用 /
        category: category || '未分类',
        filename: item.name
      })
    }
  }
  
  return files
}

// 确保源docs目录存在
if (!fs.existsSync(docsDir)) {
  console.error(`❌ Source directory not found: ${docsDir}`)
  process.exit(1)
}

// 确保public目录存在
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

// 读取所有markdown文件（包括子目录）
const markdownFiles = getAllMarkdownFiles(docsDir)

const articles = []
let hiddenCount = 0

markdownFiles.forEach(({ fullPath, relativePath, category, filename }) => {
  const content = fs.readFileSync(fullPath, 'utf-8')
  
  try {
    const { data: frontmatter, content: markdown } = matter(content)
    
    // 检查文章是否设置为不可见（默认为可见）
    const visible = frontmatter.visible !== false
    
    if (!visible) {
      hiddenCount++
      console.log(`⏭️  跳过隐藏文章: ${relativePath}`)
      return
    }
    
    // 生成唯一ID（使用相对路径，去掉.md后缀）
    const id = relativePath.replace('.md', '').replace(/\\/g, '/')
    
    // 计算文章字数
    const wordCount = countWords(markdown)
    
    articles.push({
      id,
      title: frontmatter.title || 'Untitled',
      excerpt: frontmatter.excerpt || '',
      category, // 只使用目录名作为分类
      tags: frontmatter.tags || [],
      date: frontmatter.date || new Date().toISOString(),
      author: frontmatter.author || undefined,
      path: relativePath, // 保存完整相对路径
      wordCount // 添加字数统计
    })
  } catch (error) {
    console.error(`Failed to parse ${relativePath}:`, error)
  }
})

// 按日期排序
articles.sort((a, b) => new Date(b.date) - new Date(a.date))

// 统计分类
const categories = [...new Set(articles.map(a => a.category))]

// 写入manifest.json 到 public 目录
fs.writeFileSync(manifestPath, JSON.stringify(articles, null, 2))

console.log(`✅ 已生成 manifest.json`)
console.log(`   📄 可见文章: ${articles.length}`)
console.log(`   🔒 隐藏文章: ${hiddenCount}`)
console.log(`   📝 总文件数: ${markdownFiles.length}`)
console.log(`   📁 分类数量: ${categories.length}`)
console.log(`   📂 分类列表: ${categories.join(', ')}`)

