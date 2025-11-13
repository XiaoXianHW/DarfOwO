import { useEffect } from 'react'
import { useConfig } from '../contexts/ConfigContext'

export const usePageTitle = (pageTitle) => {
  const config = useConfig()
  
  useEffect(() => {
    const siteName = config?.site?.title || 'DarfOwORD'
    
    if (pageTitle) {
      document.title = `${pageTitle} - ${siteName}`
    } else {
      document.title = siteName
    }
    
    // 清理函数：当组件卸载时重置为默认标题
    return () => {
      document.title = siteName
    }
  }, [pageTitle, config?.site?.title])
}
