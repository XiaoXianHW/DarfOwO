import { useBackground } from '../../contexts/BackgroundContext'
import { useConfig } from '../../contexts/ConfigContext'
import { useState, useEffect } from 'react'

const BackgroundEffect = () => {
  const { backgroundType } = useBackground()
  const config = useConfig()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [cachedImage, setCachedImage] = useState(null)
  
  const backgroundImage = config.backgroundImages?.[0]

  useEffect(() => {
    const cacheKey = `bg_img_${backgroundImage}`
    const cachedData = localStorage.getItem(cacheKey)
    const cacheTime = localStorage.getItem(`${cacheKey}_time`)
    const now = Date.now()
    const cacheExpiry = 7 * 24 * 60 * 60 * 1000 // 7天缓存

    if (cachedData && cacheTime && (now - parseInt(cacheTime)) < cacheExpiry) {
      setCachedImage(cachedData)
      setImageLoaded(true)
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
        
        localStorage.setItem(cacheKey, dataUrl)
        localStorage.setItem(`${cacheKey}_time`, now.toString())
        setCachedImage(dataUrl)
      } catch (e) {
        console.warn('图片缓存失败，使用原始URL:', e)
        setCachedImage(backgroundImage)
      }
      setImageLoaded(true)
    }
    
    img.onerror = () => {
      console.warn('图片加载失败，使用原始URL')
      setCachedImage(backgroundImage)
      setImageLoaded(true)
    }
    
    img.src = backgroundImage
  }, [backgroundImage])

  if (backgroundType === 'none') {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {backgroundType === 'gradient' && (
        <>
          {/* 图片背景 */}
          <div 
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-md transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: cachedImage ? `url("${cachedImage}")` : 'none'
            }}
          />
          {/* 渐变遮罩层 - 增强可读性 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-white/80 dark:from-black/70 dark:via-black/60 dark:to-black/70" />
          {/* 额外的整体遮罩 */}
          <div className="absolute inset-0 bg-white/40 dark:bg-black/40" />
        </>
      )}
      
      {backgroundType === 'dots' && (
        <div 
          className="absolute inset-0 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            color: 'currentColor'
          }}
        />
      )}
      
      {backgroundType === 'grid' && (
        <div 
          className="absolute inset-0 opacity-20 dark:opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            color: 'currentColor'
          }}
        />
      )}
    </div>
  )
}

export default BackgroundEffect
