import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiSun, HiMoon, HiDesktopComputer } from 'react-icons/hi'
import { 
  HiSparkles, 
  HiPhotograph, 
  HiViewGrid, 
  HiTemplate 
} from 'react-icons/hi'
import { 
  HiRectangleStack, 
  HiArrowsPointingOut 
} from 'react-icons/hi2'
import { useTheme } from '../../contexts/ThemeContext'
import { useBackground } from '../../contexts/BackgroundContext'
import { useLayout } from '../../contexts/LayoutContext'

const SettingsPanel = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme()
  const { backgroundType, setBackgroundType } = useBackground()
  const { layoutMode, setLayoutMode } = useLayout()

  const themeOptions = [
    { value: 'light', label: '浅色', Icon: HiSun },
    { value: 'dark', label: '深色', Icon: HiMoon },
    { value: 'system', label: '系统', Icon: HiDesktopComputer },
  ]

  const backgroundOptions = [
    { value: 'none', label: '纯色', Icon: HiSparkles },
    { value: 'gradient', label: '图片', Icon: HiPhotograph },
    { value: 'dots', label: '点阵', Icon: HiViewGrid },
    { value: 'grid', label: '网格', Icon: HiTemplate },
  ]

  const layoutOptions = [
    { value: 'default', label: '紧凑', Icon: HiRectangleStack },
    { value: 'wide', label: '默认', Icon: HiTemplate },
    { value: 'full', label: '宽屏', Icon: HiArrowsPointingOut },
  ]

  return (
    <AnimatePresence>
        {isOpen && (
          <>
            {/* 背景遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* 对话框内容 - 居中显示 */}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                className="w-[90vw] max-w-lg ui-card backdrop-blur-md border border-transparent rounded-2xl shadow-2xl"
              >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-6 bg-primary-600 dark:bg-accent-400 rounded-full" />
                  <h2 className="text-xl font-bold">设置</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:ui-tag-secondary transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* 设置内容 */}
              <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* 主题设置 */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 text-gray-600 dark:text-gray-400 uppercase tracking-wider">主题</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                            theme === option.value
                              ? 'border-primary-500 dark:border-accent-400 bg-primary-50 dark:bg-accent-900 shadow-md'
                              : 'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-accent-600 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 transition-colors ${
                            theme === option.value
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 背景设置 */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 text-gray-600 dark:text-gray-400 uppercase tracking-wider">背景</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {backgroundOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setBackgroundType(option.value)}
                          className={`group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                            backgroundType === option.value
                              ? 'border-primary-500 dark:border-accent-400 bg-primary-50 dark:bg-accent-900 shadow-md'
                              : 'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-accent-600 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 transition-colors ${
                            backgroundType === option.value
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 布局设置 */}
                <div>
                  <h3 className="text-sm font-semibold mb-4 text-gray-600 dark:text-gray-400 uppercase tracking-wider">布局</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {layoutOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setLayoutMode(option.value)}
                          className={`group flex flex-col items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                            layoutMode === option.value
                              ? 'border-primary-500 dark:border-accent-400 bg-primary-50 dark:bg-accent-900 shadow-md'
                              : 'border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-accent-600 hover:bg-gray-50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 transition-colors ${
                            layoutMode === option.value
                              ? 'text-gray-900 dark:text-gray-100'
                              : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
  )
}

export default SettingsPanel
