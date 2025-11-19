import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiSun, HiMoon, HiDesktopComputer, HiTag, HiFolder, HiViewList } from 'react-icons/hi'
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
import { useArticleSettings } from '../../contexts/ArticleSettingsContext'

const SettingsPanel = ({ isOpen, onClose }) => {
  const { theme, setTheme } = useTheme()
  const { backgroundType, setBackgroundType } = useBackground()
  const { layoutMode, setLayoutMode } = useLayout()
  const { viewMode, setViewMode, categoryDisplayMode, setCategoryDisplayMode } = useArticleSettings()

  const themeOptions = [
    { value: 'light', label: '浅色', Icon: HiSun },
    { value: 'dark', label: '深色', Icon: HiMoon },
    { value: 'system', label: '系统', Icon: HiDesktopComputer },
  ]

  const backgroundOptions = [
    { value: 'none', label: '纯色', Icon: HiSparkles },
    { value: 'gradient', label: '图片', Icon: HiPhotograph },
    { value: 'dots', label: '点阵', Icon: HiViewGrid },
  ]

  const layoutOptions = [
    { value: 'default', label: '紧凑', Icon: HiRectangleStack },
    { value: 'wide', label: '默认', Icon: HiTemplate },
    { value: 'full', label: '宽屏', Icon: HiArrowsPointingOut },
  ]

  const articleViewOptions = [
    { value: 'card', label: '卡片', Icon: HiViewGrid },
    { value: 'compact', label: '紧凑', Icon: HiViewList },
  ]

  const categoryDisplayOptions = [
    { value: 'tags', label: '标签', Icon: HiTag },
    { value: 'tree', label: '树状图', Icon: HiFolder },
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
                className="w-[90vw] max-w-lg ui-card backdrop-blur-md border border-transparent rounded-xl shadow-2xl"
              >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800/60">
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
              <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* 主题设置 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:w-20 flex-shrink-0">主题</label>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 sm:flex-1 border border-transparent dark:border-gray-800">
                    {themeOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setTheme(option.value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200 ${
                            theme === option.value
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 背景设置 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:w-20 flex-shrink-0">背景</label>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 sm:flex-1 border border-transparent dark:border-gray-800">
                    {backgroundOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setBackgroundType(option.value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200 ${
                            backgroundType === option.value
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 布局设置 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:w-20 flex-shrink-0">布局</label>
                  <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 sm:flex-1 border border-transparent dark:border-gray-800">
                    {layoutOptions.map((option) => {
                      const Icon = option.Icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => setLayoutMode(option.value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200 ${
                            layoutMode === option.value
                              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 分隔线 */}
                <div className="border-t border-gray-200 dark:border-gray-800/60" />

                {/* 文章页设置 */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <div className="w-0.5 h-4 bg-primary-600 dark:bg-accent-400 rounded-full" />
                    文章页
                  </h3>
                  
                  <div className="space-y-4">
                    {/* 视图模式 */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:w-20 flex-shrink-0">视图</label>
                      <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 sm:flex-1 border border-transparent dark:border-gray-800">
                        {articleViewOptions.map((option) => {
                          const Icon = option.Icon
                          return (
                            <button
                              key={option.value}
                              onClick={() => setViewMode(option.value)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200 ${
                                viewMode === option.value
                                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-medium">{option.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* 分类展示 */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-200 sm:w-20 flex-shrink-0">分类</label>
                      <div className="flex items-center bg-gray-100 dark:bg-gray-950/50 rounded-lg p-1 sm:flex-1 border border-transparent dark:border-gray-800">
                        {categoryDisplayOptions.map((option) => {
                          const Icon = option.Icon
                          return (
                            <button
                              key={option.value}
                              onClick={() => setCategoryDisplayMode(option.value)}
                              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md transition-all duration-200 ${
                                categoryDisplayMode === option.value
                                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-xs font-medium">{option.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
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
