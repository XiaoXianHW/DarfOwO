import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useConfig } from '../../contexts/ConfigContext'
import { useLayout } from '../../contexts/LayoutContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { getFriends } from '../../utils/dataStore'
import { useInView } from '../../hooks/useInView'

const FriendsPage = () => {
  const config = useConfig()
  const { getMaxWidth } = useLayout()
  const [friends, setFriends] = useState([])
  const [ref, isInView] = useInView({ threshold: 0.1 })
  
  // 设置页面标题
  usePageTitle('朋友')

  useEffect(() => {
    const data = getFriends()
    setFriends(data)
  }, [])

  return (
    <div className="min-h-screen px-6 lg:px-12 py-20">
      <div className={`${getMaxWidth()} mx-auto transition-all duration-300 ease-in-out`}>
                {/* 头部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1 h-12 md:h-16 bg-primary-600 dark:bg-accent-400 rounded-full" />
            <h1 className="text-5xl md:text-7xl font-bold">朋友</h1>
          </div>
                    {config.friends?.description && (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-5">
              {config.friends.description}
            </p>
          )}
        </motion.div>

        {/* 朋友网格 */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <motion.a
                key={friend.link}
                href={friend.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative block"
              >
                                <div className="relative h-full p-6 rounded-xl ui-card border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-300 overflow-hidden">
                  <div className="relative z-10 flex items-center gap-4">
                    {/* 头像 */}
                    {friend.avatar ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-800 flex-shrink-0">
                        <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                          {friend.name.charAt(0)}
                        </span>
                      </div>
                    )}

                    {/* 信息 */}
                    <div className="flex-1 min-w-0">
                      {/* 名字和别名 - 模仿主页样式 */}
                      <div className="mb-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <h2 className="text-lg md:text-xl font-bold group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors duration-300">
                            {friend.name}
                          </h2>
                          {friend.alias && (
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              / {friend.alias}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {friend.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-20"
            >
              <div className="inline-block p-8 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-gray-800">
                <p className="text-lg text-gray-600 dark:text-gray-400">暂无友链</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
