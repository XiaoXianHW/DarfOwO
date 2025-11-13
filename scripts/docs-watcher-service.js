import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 递归获取目录中所有 .md 文件
function getAllMdFiles(dir, baseDir = dir, category = null) {
  const files = []
  
  if (!fs.existsSync(dir)) return files

  const items = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    
    if (item.isDirectory()) {
      const subCategory = item.name
      files.push(...getAllMdFiles(fullPath, baseDir, subCategory))
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      files.push({
        fullPath,
        relativePath,
        category: category || '未分类',
        filename: item.name
      })
    }
  }
  
  return files
}

class DocsWatcherService {
  constructor(sourceDir, targetDir) {
    this.sourceDir = sourceDir
    this.targetDir = targetDir
    // manifest.json 放在 dist 根目录
    this.manifestPath = path.join(path.dirname(targetDir), 'manifest.json')
    this.debounceTimer = null
    this.isUpdating = false
  }

  log(emoji, message) {
    const timestamp = new Date().toLocaleTimeString('zh-CN')
    console.log(`[${timestamp}] ${emoji} ${message}`)
  }

  // 同步 markdown 文件到目标目录（包括子目录和删除操作）
  syncMarkdownFiles() {
    if (!fs.existsSync(this.targetDir)) {
      fs.mkdirSync(this.targetDir, { recursive: true })
    }

    const sourceFiles = getAllMdFiles(this.sourceDir)
    const targetFiles = getAllMdFiles(this.targetDir)

    let copiedCount = 0
    let deletedCount = 0

    // 复制/更新文件
    sourceFiles.forEach(({ fullPath, relativePath }) => {
      const dest = path.join(this.targetDir, relativePath)
      const destDir = path.dirname(dest)
      
      // 确保目标目录存在
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      
      // 检查文件是否需要更新
      if (!fs.existsSync(dest) || 
          fs.statSync(fullPath).mtime > fs.statSync(dest).mtime) {
        fs.copyFileSync(fullPath, dest)
        copiedCount++
      }
    })

    // 删除目标目录中多余的文件
    const sourceRelativePaths = sourceFiles.map(f => f.relativePath)
    targetFiles.forEach(({ fullPath, relativePath }) => {
      if (!sourceRelativePaths.includes(relativePath)) {
        fs.unlinkSync(fullPath)
        deletedCount++
        this.log('🗑️', `已删除: ${relativePath}`)
      }
    })

    // 清理空目录
    this.cleanEmptyDirs(this.targetDir)

    if (copiedCount > 0) {
      this.log('📋', `已复制 ${copiedCount} 个文件`)
    }
    
    if (deletedCount > 0) {
      this.log('✨', `已清理 ${deletedCount} 个冗余文件`)
    }

    if (copiedCount === 0 && deletedCount === 0) {
      this.log('✓', '所有文件已是最新')
    }
  }

  // 清理空目录
  cleanEmptyDirs(dir) {
    if (!fs.existsSync(dir)) return
    
    const items = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const item of items) {
      if (item.isDirectory()) {
        const subDir = path.join(dir, item.name)
        this.cleanEmptyDirs(subDir)
        
        // 检查目录是否为空
        if (fs.readdirSync(subDir).length === 0) {
          fs.rmdirSync(subDir)
        }
      }
    }
  }

  async updateManifest() {
    if (this.isUpdating) {
      this.log('⏳', '更新中，跳过...')
      return
    }

    this.isUpdating = true

    try {
      this.log('🔄', '开始同步文档...')

      // 1. 同步文件（包括删除）
      this.syncMarkdownFiles()

      // 2. 读取所有 markdown 文件（包括子目录）
      const markdownFiles = getAllMdFiles(this.targetDir)
      const articles = []

      for (const { fullPath, relativePath, category } of markdownFiles) {
        try {
          const content = fs.readFileSync(fullPath, 'utf-8')
          const { data: frontmatter } = matter(content)
          
          const id = relativePath.replace('.md', '').replace(/\\/g, '/')
          
          articles.push({
            id,
            title: frontmatter.title || 'Untitled',
            excerpt: frontmatter.excerpt || '',
            category, // 只使用目录名作为分类
            tags: frontmatter.tags || [],
            date: frontmatter.date || new Date().toISOString(),
            author: frontmatter.author || undefined,
            path: relativePath
          })
        } catch (error) {
          this.log('⚠️', `解析失败: ${relativePath} - ${error.message}`)
        }
      }

      // 3. 按日期排序
      articles.sort((a, b) => new Date(b.date) - new Date(a.date))

      // 4. 统计分类
      const categories = [...new Set(articles.map(a => a.category))]

      // 5. 写入 manifest.json
      fs.writeFileSync(this.manifestPath, JSON.stringify(articles, null, 2))

      this.log('✅', `更新成功! 共 ${articles.length} 篇文章，${categories.length} 个分类`)
    } catch (error) {
      this.log('❌', `更新失败: ${error.message}`)
    } finally {
      this.isUpdating = false
    }
  }

  handleChange(eventType, filename) {
    // 监听所有文件和目录变化
    const eventMap = {
      'rename': '文件变化',
      'change': '文件修改'
    }
    const eventText = eventMap[eventType] || eventType

    if (filename) {
      this.log('📝', `检测到${eventText}: ${filename}`)
    }

    // 防抖：避免频繁更新
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }

    this.debounceTimer = setTimeout(() => {
      this.updateManifest()
    }, 500)
  }

  start() {
    // 检查源目录是否存在
    if (!fs.existsSync(this.sourceDir)) {
      this.log('❌', `源目录不存在: ${this.sourceDir}`)
      process.exit(1)
    }

    this.log('🚀', '文档监听服务已启动')
    this.log('📂', `监听目录: ${this.sourceDir}`)
    this.log('📍', `同步目标: ${this.targetDir}`)
    this.log('---', '等待文件变化...\n')

    // 初始化时同步一次
    this.updateManifest()

    // 监听源目录文件变化（递归监听子目录）
    fs.watch(this.sourceDir, { recursive: true }, (eventType, filename) => {
      this.handleChange(eventType, filename)
    })

    // 处理进程退出
    process.on('SIGINT', () => {
      this.log('👋', '服务已停止')
      process.exit(0)
    })

    process.on('SIGTERM', () => {
      this.log('👋', '服务已停止')
      process.exit(0)
    })
  }
}

// 从命令行参数或默认路径获取配置
const sourceDir = path.join(__dirname, '../docs')
const targetDir = path.join(__dirname, '../dist/docs')

// 启动服务
const watcher = new DocsWatcherService(sourceDir, targetDir)
watcher.start()
