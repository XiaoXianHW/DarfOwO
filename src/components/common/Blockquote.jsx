import { HiInformationCircle, HiLightBulb, HiExclamation } from 'react-icons/hi'

const Blockquote = ({ children }) => {
  const extractText = (node) => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (node?.props?.children) return extractText(node.props.children)
    return ''
  }

  const content = extractText(children)
  
  let icon = null
  let borderColor = 'border-l-4 border-gray-300 dark:border-gray-600'
  let bgColor = 'bg-gray-50/50 dark:bg-gray-800/30'
  let textColor = 'text-gray-700 dark:text-gray-300'
  let iconColor = 'text-gray-400 dark:text-gray-500'

  if (content.toLowerCase().includes('tip') || content.includes('💡') || content.includes('提示')) {
    icon = HiLightBulb
    borderColor = 'border-l-4 border-blue-500 dark:border-blue-400'
    bgColor = 'bg-blue-50/50 dark:bg-blue-900/20'
    iconColor = 'text-blue-500 dark:text-blue-400'
  } else if (content.toLowerCase().includes('warning') || content.includes('⚠️') || content.includes('注意')) {
    icon = HiExclamation
    borderColor = 'border-l-4 border-orange-500 dark:border-orange-400'
    bgColor = 'bg-orange-50/50 dark:bg-orange-900/20'
    iconColor = 'text-orange-500 dark:text-orange-400'
  } else if (content.toLowerCase().includes('info') || content.includes('ℹ️') || content.includes('信息')) {
    icon = HiInformationCircle
    borderColor = 'border-l-4 border-green-500 dark:border-green-400'
    bgColor = 'bg-green-50/50 dark:bg-green-900/20'
    iconColor = 'text-green-500 dark:text-green-400'
  }

  const Icon = icon

  return (
    <blockquote className={`relative my-6 ${borderColor} ${bgColor} ${textColor} rounded-r-lg`}>
      <div className="flex gap-3 px-4 py-3">
        {Icon && (
          <div className={`flex-shrink-0 ${iconColor} mt-0.5`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1 text-base leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0">
          {children}
        </div>
      </div>
    </blockquote>
  )
}

export default Blockquote
