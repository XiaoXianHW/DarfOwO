import { motion } from 'framer-motion'

const ProjectStatsSection = ({ projectStats, isInView, itemVariants }) => {
  if (!projectStats || projectStats.length === 0) return null

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-primary-600 dark:bg-accent-400 rounded-full" />
        <h3 className="text-3xl md:text-4xl font-bold">项目数据</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {projectStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            className="p-4 md:p-8 rounded-lg ui-card border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-300 text-center"
          >
            <div className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">{stat.value}</div>
            <div className="text-xs md:text-base text-gray-600 dark:text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default ProjectStatsSection
