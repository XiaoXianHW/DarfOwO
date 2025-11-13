import { createContext, useContext } from 'react'
import { APP_CONFIG } from '../config'

const ConfigContext = createContext(null)

export const useConfig = () => {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider')
  }
  return context
}

export const ConfigProvider = ({ children }) => {
  return (
    <ConfigContext.Provider value={APP_CONFIG}>
      {children}
    </ConfigContext.Provider>
  )
}

