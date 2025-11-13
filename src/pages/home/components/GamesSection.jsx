import { motion } from 'framer-motion'
import { IoGameController, IoGameControllerOutline } from 'react-icons/io5'

const GamesSection = ({ games, isInView, itemVariants }) => {
  if (!games.currentlyPlaying?.length && !games.previouslyPlayed?.length) return null

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-primary-600 dark:bg-accent-400 rounded-full" />
        <h3 className="text-3xl md:text-4xl font-bold">游戏领域</h3>
      </div>
      
      <div className="space-y-8">
        {/* 目前常玩 */}
        {games.currentlyPlaying?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <h4 className="text-lg font-semibold">
                目前常玩
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {games.currentlyPlaying.map((game, index) => (
                <motion.span
                  key={game}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.5 + index * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg ui-tag border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-200 text-sm font-medium group"
                >
                  <IoGameController className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  {game}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {/* 游玩过的 */}
        {games.previouslyPlayed?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <h4 className="text-lg font-semibold">
                游玩过的
              </h4>
            </div>
            <div className="flex flex-wrap gap-3">
              {games.previouslyPlayed.map((game, index) => (
                <motion.span
                  key={game}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ 
                    duration: 0.3, 
                    delay: 0.6 + index * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg ui-tag-secondary border border-transparent hover:border-gray-500 dark:hover:border-gray-500 transition-all duration-200 text-sm font-medium group text-gray-700 dark:text-gray-400"
                >
                  <IoGameControllerOutline className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  {game}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default GamesSection

