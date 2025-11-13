import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiZoomIn, HiZoomOut } from 'react-icons/hi'

const ImagePreview = ({ src, alt, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [imageError, setImageError] = useState(false)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5))
  }

  const handleClose = () => {
    setIsOpen(false)
    setScale(1)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // 如果没有 src，不渲染
  if (!src) {
    return null
  }

  // 如果图片加载失败，显示占位符
  if (imageError) {
    return (
      <div className="rounded-lg my-6 w-full border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 p-12 text-center">
        <div className="text-gray-400 dark:text-gray-600">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">{alt || '图片加载失败'}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* 缩略图 */}
      <img
        src={src}
        alt={alt}
        className="rounded-lg my-6 w-full border border-gray-200 dark:border-gray-800 cursor-zoom-in hover:opacity-90 transition-opacity duration-200"
        onClick={() => setIsOpen(true)}
        onError={handleImageError}
        {...props}
      />

      {/* 预览弹窗 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={handleClose}
          >
            {/* 工具栏 */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomOut()
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                aria-label="缩小"
              >
                <HiZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleZoomIn()
                }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                aria-label="放大"
              >
                <HiZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                aria-label="关闭"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* 图片 */}
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.8 }}
              animate={{ scale }}
              transition={{ type: 'spring', damping: 25 }}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
              style={{ cursor: scale > 1 ? 'zoom-out' : 'default' }}
            />

            {/* 提示文字 */}
            {alt && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/50 text-white text-sm max-w-2xl text-center">
                {alt}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImagePreview

