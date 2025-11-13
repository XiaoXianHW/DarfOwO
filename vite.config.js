import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readdirSync, existsSync, readFileSync, rmSync, statSync } from 'fs'
import { join, relative } from 'path'

// Vite 插件：开发时和构建时处理 docs 目录
function docsPlugin() {
  let isDev = false
  
  return {
    name: 'docs-plugin',
    configResolved(config) {
      isDev = config.command === 'serve'
    },
    configureServer(server) {
      // 开发模式：添加中间件来服务 docs 目录（支持子目录）
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith('/docs/') && req.url.endsWith('.md')) {
          // 解码 URL 以支持中文路径
          const relativePath = decodeURIComponent(req.url.replace('/docs/', ''))
          const filePath = join(process.cwd(), 'docs', relativePath)
          
          if (existsSync(filePath)) {
            try {
              const content = readFileSync(filePath, 'utf-8')
              res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
              res.setHeader('Cache-Control', 'no-cache')
              res.statusCode = 200
              res.end(content)
              return
            } catch (error) {
              console.error('Error reading file:', error)
              res.statusCode = 500
              res.end('Error reading file')
              return
            }
          }
        }
        next()
      })
    },
    closeBundle() {
      // 构建模式：同步 docs 到 dist（包括子目录和删除操作）
      if (isDev) return
      
      const docsDir = 'docs'
      const outDir = 'dist/docs'
      
      if (!existsSync(docsDir)) return
      
      // 清空目标目录（确保完全同步）
      if (existsSync(outDir)) {
        rmSync(outDir, { recursive: true, force: true })
      }
      
      // 递归复制所有文件和目录结构
      function copyDirRecursive(src, dest) {
        mkdirSync(dest, { recursive: true })
        
        const items = readdirSync(src, { withFileTypes: true })
        let count = 0
        
        for (const item of items) {
          const srcPath = join(src, item.name)
          const destPath = join(dest, item.name)
          
          if (item.isDirectory()) {
            count += copyDirRecursive(srcPath, destPath)
          } else if (item.isFile() && item.name.endsWith('.md')) {
            copyFileSync(srcPath, destPath)
            count++
          }
        }
        
        return count
      }
      
      const count = copyDirRecursive(docsDir, outDir)
      console.log(`✅ 已同步 ${count} 个文档到 dist/docs`)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), docsPlugin()],
})
