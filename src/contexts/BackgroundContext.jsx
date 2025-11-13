import { createContext, useContext, useState, useEffect } from 'react'

const BackgroundContext = createContext(null)

export const useBackground = () => {
  const context = useContext(BackgroundContext)
  if (!context) {
    throw new Error('useBackground must be used within BackgroundProvider')
  }
  return context
}

export const BackgroundProvider = ({ children }) => {
  const [backgroundType, setBackgroundType] = useState(() => {
    return localStorage.getItem('backgroundType') || 'none'
  })

  useEffect(() => {
    localStorage.setItem('backgroundType', backgroundType)
  }, [backgroundType])

  return (
    <BackgroundContext.Provider value={{ backgroundType, setBackgroundType }}>
      {children}
    </BackgroundContext.Provider>
  )
}

