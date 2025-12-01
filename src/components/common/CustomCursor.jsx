import { useEffect, useRef, useCallback, useState } from 'react'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const positionRef = useRef({ x: 0, y: 0 })
  const requestRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  // 检测是否为移动端
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || ('ontouchstart' in window)
        || (window.innerWidth < 1280)
      setIsMobile(mobile)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isInteractiveElement = useCallback((element) => {
    if (!element) return false
    
    // 检查元素本身
    const tagName = element.tagName
    if (
      tagName === 'A' ||
      tagName === 'BUTTON' ||
      tagName === 'INPUT' ||
      tagName === 'TEXTAREA' ||
      tagName === 'SELECT' ||
      element.getAttribute('role') === 'button' ||
      element.onclick !== null ||
      element.getAttribute('data-clickable') === 'true'
    ) {
      return true
    }

    // 检查是否有 cursor 样式或可点击的父元素
    const styles = window.getComputedStyle(element)
    if (styles.cursor === 'pointer') return true

    // 检查父元素
    const parent = element.closest('a, button, [role="button"], [onclick], [data-clickable]')
    return parent !== null
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let currentElement = null

    const handleMouseMove = (e) => {
      positionRef.current = { x: e.clientX, y: e.clientY }
      
      // 确保光标可见
      cursor.style.opacity = '1'
      
      // 检查当前元素
      const target = e.target
      if (target !== currentElement) {
        currentElement = target
        
        if (isInteractiveElement(target)) {
          cursor.classList.add('hover')
        } else {
          cursor.classList.remove('hover')
        }
      }
    }

    const handleMouseLeave = () => {
      // 鼠标离开窗口时隐藏光标
      cursor.style.opacity = '0'
    }

    const handleMouseEnter = () => {
      // 鼠标进入窗口时显示光标
      cursor.style.opacity = '1'
    }

    const animate = () => {
      if (cursor) {
        cursor.style.left = `${positionRef.current.x}px`
        cursor.style.top = `${positionRef.current.y}px`
      }
      requestRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    requestRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isInteractiveElement])

  // 移动端不显示自定义光标
  if (isMobile) return null

  return <div id="custom-cursor" ref={cursorRef} />
}

export default CustomCursor
