import { createContext, useContext, useState, useEffect } from 'react'

const LayoutContext = createContext(null)

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return context
}

export const LayoutProvider = ({ children }) => {
  const [layoutMode, setLayoutMode] = useState(() => {
    return localStorage.getItem('layoutMode') || 'wide'
  })

  useEffect(() => {
    localStorage.setItem('layoutMode', layoutMode)
  }, [layoutMode])

  const getMaxWidth = () => {
    switch (layoutMode) {
      case 'default':
        return 'max-w-4xl'
      case 'wide':
        return 'max-w-6xl'
      case 'full':
        return 'max-w-7xl'
      default:
        return 'max-w-6xl'
    }
  }

  return (
    <LayoutContext.Provider value={{ layoutMode, setLayoutMode, getMaxWidth }}>
      {children}
    </LayoutContext.Provider>
  )
}

