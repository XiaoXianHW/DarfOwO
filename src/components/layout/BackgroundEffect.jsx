import { useBackground } from '../../contexts/BackgroundContext'
import { useConfig } from '../../contexts/ConfigContext'

const BackgroundEffect = () => {
  const { backgroundType } = useBackground()
  const config = useConfig()
  
  // 随机选择背景图片
  const backgroundImage = config.backgroundImages?.[0] || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=2070&q=80'

  if (backgroundType === 'none') {
    return null
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {backgroundType === 'gradient' && (
        <>
          {/* 图片背景 */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
            style={{
              backgroundImage: `url("${backgroundImage}")`
            }}
          />
          {/* 遮罩层 - 半透明黑色 */}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
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

