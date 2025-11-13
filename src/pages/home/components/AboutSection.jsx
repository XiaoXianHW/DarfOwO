import { motion } from 'framer-motion'
import { useInView } from '../../../hooks/useInView'
import { useLayout } from '../../../contexts/LayoutContext'
import ProfileCard from './ProfileCard'
import TechStackSection from './TechStackSection'
import ProjectStatsSection from './ProjectStatsSection'
import ContactsSection from './ContactsSection'
import GamesSection from './GamesSection'

const AboutSection = ({ config }) => {
  const [ref, isInView] = useInView({ threshold: 0.1 })
  const { getMaxWidth } = useLayout()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section ref={ref} className="relative py-32 px-6 lg:px-12">
      <div className={`${getMaxWidth()} mx-auto transition-all duration-300 ease-in-out`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-24"
        >
          {/* 个人资料卡片（包含Bio） */}
          <ProfileCard config={config} itemVariants={itemVariants} />

          {/* 技术栈 */}
          <TechStackSection 
            techStacks={config.techStacks} 
            isInView={isInView} 
            itemVariants={itemVariants} 
          />

          {/* 项目数据 */}
          <ProjectStatsSection 
            projectStats={config.projectStats} 
            isInView={isInView} 
            itemVariants={itemVariants} 
          />

          {/* 联系方式 */}
          <ContactsSection 
            contacts={config.contacts} 
            isInView={isInView} 
            itemVariants={itemVariants} 
          />

          {/* 游戏领域 */}
          <GamesSection 
            games={config.games} 
            isInView={isInView} 
            itemVariants={itemVariants} 
          />
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
