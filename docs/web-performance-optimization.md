---
title: Web 性能优化实战指南
date: 2024-02-15
tags: [性能优化, Web, 前端]
excerpt: 全面的Web性能优化指南，涵盖加载优化、渲染优化、网络优化等多个方面。
---

# Web 性能优化实战指南

性能优化是前端开发的重要课题。一个快速响应的网站不仅能提供更好的用户体验，还能提高转化率和SEO排名。

## 📊 性能指标

### Core Web Vitals

Google 定义的三个核心指标：

| 指标 | 含义 | 目标值 |
|------|------|--------|
| LCP | 最大内容绘制 | < 2.5s |
| FID | 首次输入延迟 | < 100ms |
| CLS | 累计布局偏移 | < 0.1 |

### 其他重要指标

- **TTFB** (Time to First Byte) - 首字节时间
- **FCP** (First Contentful Paint) - 首次内容绘制
- **TTI** (Time to Interactive) - 可交互时间

## 🚀 加载优化

### 1. 资源压缩

```javascript
// Vite 配置示例
export default {
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
}
```

### 2. 代码分割

```javascript
// React 懒加载
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./Dashboard'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}
```

### 3. 预加载关键资源

```html
<!-- HTML 预加载 -->
<link rel="preload" href="/fonts/main.woff2" as="font" crossorigin>
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://cdn.example.com">
```

## 🎨 渲染优化

### 避免强制同步布局

```javascript
// ❌ 不推荐
function updateElements() {
  elements.forEach(el => {
    el.style.width = el.offsetWidth + 100 + 'px' // 强制回流
  })
}

// ✅ 推荐
function updateElements() {
  const widths = elements.map(el => el.offsetWidth) // 批量读取
  elements.forEach((el, i) => {
    el.style.width = widths[i] + 100 + 'px' // 批量写入
  })
}
```

### 使用 requestAnimationFrame

```javascript
function smoothScroll(element, target) {
  const start = element.scrollTop
  const change = target - start
  const duration = 500
  let startTime = null
  
  function animation(currentTime) {
    if (!startTime) startTime = currentTime
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    element.scrollTop = start + change * easeInOutQuad(progress)
    
    if (progress < 1) {
      requestAnimationFrame(animation)
    }
  }
  
  requestAnimationFrame(animation)
}
```

## 🌐 网络优化

### 1. HTTP/2 服务器推送

```nginx
# Nginx 配置
location / {
  http2_push /style.css;
  http2_push /script.js;
}
```

### 2. 使用 CDN

```javascript
// 配置 CDN 加速
const CDN_URL = 'https://cdn.example.com'

function getAssetUrl(path) {
  return `${CDN_URL}${path}`
}
```

### 3. 缓存策略

```javascript
// Service Worker 缓存策略
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中
      if (response) {
        return response
      }
      
      // 缓存未命中，发起网络请求
      return fetch(event.request).then((response) => {
        // 缓存响应
        if (response.status === 200) {
          const clonedResponse = response.clone()
          caches.open('v1').then((cache) => {
            cache.put(event.request, clonedResponse)
          })
        }
        return response
      })
    })
  )
})
```

## 🖼️ 图片优化

### 响应式图片

```html
<picture>
  <source 
    srcset="image-large.webp" 
    type="image/webp"
    media="(min-width: 1200px)"
  >
  <source 
    srcset="image-medium.webp" 
    type="image/webp"
    media="(min-width: 768px)"
  >
  <img 
    src="image-small.jpg" 
    alt="Responsive image"
    loading="lazy"
  >
</picture>
```

### 懒加载

```javascript
// Intersection Observer 实现图片懒加载
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove('lazy')
      imageObserver.unobserve(img)
    }
  })
})

document.querySelectorAll('img.lazy').forEach(img => {
  imageObserver.observe(img)
})
```

## 📦 打包优化

### Tree Shaking

```javascript
// package.json
{
  "sideEffects": false  // 启用 tree shaking
}

// 或指定有副作用的文件
{
  "sideEffects": [
    "*.css",
    "*.scss"
  ]
}
```

### 代码分割策略

```javascript
// webpack 配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
}
```

## 🔍 性能监控

### 使用 Performance API

```javascript
// 测量关键性能指标
const perfData = {
  dns: timing.domainLookupEnd - timing.domainLookupStart,
  tcp: timing.connectEnd - timing.connectStart,
  ttfb: timing.responseStart - timing.requestStart,
  download: timing.responseEnd - timing.responseStart,
  domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
  load: timing.loadEventEnd - timing.navigationStart
}

console.table(perfData)
```

### Web Vitals 监控

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics({ name, value, id }) {
  // 发送到分析服务
  console.log('Metric:', name, value)
  
  // 或发送到后端
  navigator.sendBeacon('/analytics', JSON.stringify({
    metric: name,
    value: value,
    id: id
  }))
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## ✅ 最佳实践清单

- [ ] 启用 Gzip/Brotli 压缩
- [ ] 使用 CDN 加速静态资源
- [ ] 实现代码分割和懒加载
- [ ] 优化图片（WebP、懒加载）
- [ ] 移除未使用的代码
- [ ] 使用缓存策略
- [ ] 减少 HTTP 请求数
- [ ] 使用 HTTP/2
- [ ] 添加性能监控
- [ ] 定期审查性能指标

## 🎯 性能预算

设定性能预算，确保网站性能不会退化：

```javascript
// performance-budget.json
{
  "budgets": [
    {
      "resourceType": "script",
      "maximum": "300kb"
    },
    {
      "resourceType": "image",
      "maximum": "500kb"
    },
    {
      "resourceType": "total",
      "maximum": "1mb"
    }
  ]
}
```

## 总结

> **记住**: 性能优化是一个持续的过程，需要：
> 
> 1. 定期测量和监控
> 2. 设定明确的性能目标
> 3. 优先优化影响最大的部分
> 4. 在开发过程中考虑性能

通过系统的性能优化，你的网站可以获得更快的加载速度、更好的用户体验和更高的转化率！

---

**相关资源**:
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

