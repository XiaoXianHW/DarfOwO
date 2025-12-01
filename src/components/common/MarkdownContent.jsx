import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import CodeBlock from './CodeBlock'
import Blockquote from './Blockquote'
import ImagePreview from './ImagePreview'

const MarkdownContent = ({ content }) => {
  // 预处理markdown内容，转换非标准图片格式
  const preprocessContent = (text) => {
    // 转换格式 ![alt][url] 到标准格式 ![alt](url)
    return text.replace(/!\[([^\]]*)\]\[([^\]]+)\]/g, '![$1]($2)')
  }

  // 生成标题的 ID
  const generateId = (text) => {
    if (!text) return ''
    
    // 处理各种类型的 children
    let textContent = ''
    if (typeof text === 'string') {
      textContent = text
    } else if (Array.isArray(text)) {
      textContent = text.map(child => 
        typeof child === 'string' ? child : (child?.props?.children || '')
      ).join('')
    } else if (typeof text === 'object' && text.props) {
      textContent = text.props.children || ''
    } else {
      textContent = String(text)
    }
    
    return textContent
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const processedContent = preprocessContent(content)

  return (
    <div className="text-gray-700 dark:text-gray-300">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
        h1: ({ children, ...props }) => (
          <h1 id={generateId(children)} className="text-3xl md:text-4xl font-bold mb-6 mt-12 first:mt-0 pb-3 border-b-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100" {...props}>{children}</h1>
        ),
        h2: ({ children, ...props }) => (
          <h2 id={generateId(children)} className="text-2xl md:text-3xl font-bold mb-5 mt-10 pb-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100" {...props}>{children}</h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 id={generateId(children)} className="text-xl md:text-2xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100" {...props}>{children}</h3>
        ),
        h4: (props) => (
          <h4 className="text-lg md:text-xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-200" {...props} />
        ),
        h5: (props) => (
          <h5 className="text-base md:text-lg font-semibold mb-2 mt-4" {...props} />
        ),
        h6: (props) => (
          <h6 className="text-sm md:text-base font-semibold mb-2 mt-3 text-gray-600 dark:text-gray-400" {...props} />
        ),
        p: ({ node, children, ...props }) => {
          // 检查是否包含块级元素或代码块
          const hasBlockElement = node?.children?.some(child => {
            if (!child.tagName) return false
            // 块级元素
            if (['pre', 'div', 'img', 'blockquote'].includes(child.tagName)) return true
            // 代码块（code 标签带语言类名）
            if (child.tagName === 'code') {
              const className = child.properties?.className
              if (Array.isArray(className) && className.some(c => c.startsWith('language-'))) {
                return true
              }
            }
            return false
          })
          
          if (hasBlockElement) {
            return <div className="text-base md:text-lg leading-relaxed mb-6">{children}</div>
          }
          return <p className="text-base md:text-lg leading-relaxed mb-6">{children}</p>
        },
        ul: ({ node, ...props }) => {
          const isTaskList = node?.children?.some(
            child => child.properties?.className?.includes('task-list-item')
          )
          return isTaskList 
            ? <ul className="space-y-2.5 mb-6 list-none pl-0" {...props} />
            : <ul className="list-disc mb-6 space-y-2 pl-6 marker:text-gray-400 dark:marker:text-gray-600" {...props} />
        },
        ol: (props) => (
          <ol className="list-decimal mb-6 space-y-2 pl-6 marker:text-gray-400 dark:marker:text-gray-600 marker:font-semibold" {...props} />
        ),
        li: ({ children, ...props }) => {
          const isTaskListItem = props.className?.includes('task-list-item')
          return isTaskListItem
            ? <li className="flex items-center gap-3 text-base md:text-lg leading-relaxed" {...props}>{children}</li>
            : <li className="text-base md:text-lg leading-relaxed">{children}</li>
        },
        blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
        code: ({ inline, className, children, ...props }) => {
          if (inline) {
            return (
              <code className="px-1.5 py-0.5 mx-0.5 rounded ui-tag text-[0.9em] font-mono border border-transparent">
                {children}
              </code>
            )
          }
          // 代码块由 pre 渲染器处理
          return <code className={className} {...props}>{children}</code>
        },
        pre: ({ children, ...props }) => {
          // 提取 code 元素的 className
          const codeElement = children?.props
          const className = codeElement?.className
          return <CodeBlock className={className}>{children}</CodeBlock>
        },
        a: (props) => (
          <a 
            className="text-primary-600 dark:text-accent-400 hover:text-primary-700 dark:hover:text-accent-300 underline decoration-2 underline-offset-2 transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
            {...props} 
          />
        ),
        img: (props) => <ImagePreview {...props} />,
        table: (props) => (
          <div className="my-6 overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-800" {...props} />
          </div>
        ),
        thead: (props) => <thead className="bg-gray-100 dark:bg-gray-900" {...props} />,
        th: (props) => <th className="border border-gray-200 dark:border-gray-800 px-4 py-2 text-left font-semibold" {...props} />,
        td: (props) => <td className="border border-gray-200 dark:border-gray-800 px-4 py-2" {...props} />,
        hr: (props) => <hr className="my-12 border-t-2 border-gray-200 dark:border-gray-800" {...props} />,
        strong: (props) => <strong className="font-bold" {...props} />,
        em: (props) => <em className="italic" {...props} />,
        input: (props) => {
          if (props.type === 'checkbox') {
            return (
              <input 
                type="checkbox"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                }}
                className="flex-shrink-0 w-[18px] h-[18px] rounded border border-gray-300 dark:border-gray-700 
                  checked:bg-gray-900 checked:border-gray-900 dark:checked:bg-gray-100 dark:checked:border-gray-100
                  cursor-pointer disabled:cursor-not-allowed transition-all duration-200 
                  checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNCw5TDgsIDEzTDE0LDUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] 
                  dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNNCw5TDgsIDEzTDE0LDUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPg==')] 
                  checked:bg-center checked:bg-no-repeat"
                checked={props.checked}
                disabled={props.disabled}
              />
            )
          }
          return <input {...props} />
        },
      }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownContent
