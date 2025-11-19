import { createContext, useContext, useState, useEffect } from 'react'

const ArticleSettingsContext = createContext(null)

export const useArticleSettings = () => {
  const context = useContext(ArticleSettingsContext)
  if (!context) {
    throw new Error('useArticleSettings must be used within ArticleSettingsProvider')
  }
  return context
}

export const ArticleSettingsProvider = ({ children }) => {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('articleViewMode') || 'card'
  })

  const [categoryDisplayMode, setCategoryDisplayMode] = useState(() => {
    return localStorage.getItem('articleCategoryDisplayMode') || 'tags'
  })

  useEffect(() => {
    localStorage.setItem('articleViewMode', viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem('articleCategoryDisplayMode', categoryDisplayMode)
  }, [categoryDisplayMode])

  const value = {
    viewMode,
    setViewMode,
    categoryDisplayMode,
    setCategoryDisplayMode
  }

  return (
    <ArticleSettingsContext.Provider value={value}>
      {children}
    </ArticleSettingsContext.Provider>
  )
}
