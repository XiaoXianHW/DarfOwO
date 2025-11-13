import { useState } from 'react'
import { HiCheck, HiClipboard } from 'react-icons/hi'

const CodeBlock = ({ children, className }) => {
  const [copied, setCopied] = useState(false)
  
  const extractText = (node) => {
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(extractText).join('')
    if (node?.props?.children) return extractText(node.props.children)
    return ''
  }
  
  const code = extractText(children)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="my-6 group relative rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
      {/* 复制按钮 */}
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 z-10 p-2 rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label={copied ? "已复制" : "复制代码"}
      >
        {copied ? (
          <HiCheck className="w-4 h-4 text-green-500 dark:text-green-400" />
        ) : (
          <HiClipboard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      
      {/* 代码内容 */}
      <pre className="!m-0 overflow-x-auto" style={{ 
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        background: 'transparent'
      }}>
        <code className={`${className} !block p-4 pr-14 text-sm leading-relaxed`} style={{ background: 'transparent' }}>
          {children}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock

