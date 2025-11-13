import { motion } from 'framer-motion'
import { 
  HiCode,
  HiColorSwatch,
  HiCog,
  HiCube
} from 'react-icons/hi'
import { useConfig } from '../../../contexts/ConfigContext'
import { 
  SiPython,
  SiJavascript,
  SiPhp,
  SiVuedotjs,
  SiReact,
  SiVite,
  SiNextdotjs,
  SiTailwindcss,
  SiBootstrap,
  SiVuetify,
  SiElectron,
  SiNodedotjs,
  SiSpring,
  SiFlask,
  SiRedis,
  SiRabbitmq,
  SiIntellijidea,
  SiLinux,
  SiGit,
  SiDocker,
  SiNginx
} from 'react-icons/si'
import { FaJava, FaCode } from 'react-icons/fa'
import { VscVscode } from 'react-icons/vsc'
import { GrMysql } from 'react-icons/gr'

const TechStackSection = ({ techStacks, isInView, itemVariants }) => {
  const config = useConfig()
  if (!techStacks || Object.keys(techStacks).length === 0) return null

  // 根据技能名称选择对应的图标
  const getSkillIcon = (sk, category) => {
    const iconMap = {
      // 语言
      'Java': FaJava,
      'Python': SiPython,
      'JavaScript': SiJavascript,
      'PHP': SiPhp,
      // 前端
      'Vue': SiVuedotjs,
      'React': SiReact,
      'Vite': SiVite,
      'Next.js': SiNextdotjs,
      'Tailwind CSS': SiTailwindcss,
      'Bootstrap': SiBootstrap,
      'Vuetify': SiVuetify,
      'Electron': SiElectron,
      // 后端
      'Node.js': SiNodedotjs,
      'SpringBoot': SiSpring,
      'Flask API': SiFlask,
      'MySQL': GrMysql,
      'Redis': SiRedis,
      'RabbitMQ': SiRabbitmq,
      // 工具
      'VS Code': VscVscode,
      'IntelliJ IDEA': SiIntellijidea,
      'Linux': SiLinux,
      'Git': SiGit,
      'Docker': SiDocker,
      'Nginx': SiNginx
    }
    
    // 返回匹配的图标或默认图标
    if (iconMap[sk]) return iconMap[sk]
    if (category.includes('语言')) return HiCode
    if (category.includes('前端')) return HiColorSwatch
    if (category.includes('后端')) return HiCog
    if (category.includes('工具')) return HiCube
    return FaCode
  }

  // 获取技能对应的链接
  const getSkillLink = (sk) => {
    const linkMap = {
      // 语言
      'Java': 'https://www.java.com',
      'Python': 'https://www.python.org',
      'JavaScript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
      'PHP': 'https://www.php.net',
      // 前端
      'Vue': 'https://vuejs.org',
      'React': 'https://react.dev',
      'Vite': 'https://vitejs.dev',
      'Next.js': 'https://nextjs.org',
      'Tailwind CSS': 'https://tailwindcss.com',
      'Bootstrap': 'https://getbootstrap.com',
      'Vuetify': 'https://vuetifyjs.com',
      'Electron': 'https://www.electronjs.org',
      // 后端
      'Node.js': 'https://nodejs.org',
      'SpringBoot': 'https://spring.io/projects/spring-boot',
      'Flask API': 'https://flask.palletsprojects.com',
      'MySQL': 'https://www.mysql.com',
      'Redis': 'https://redis.io',
      'RabbitMQ': 'https://www.rabbitmq.com',
      // 工具
      'VS Code': 'https://code.visualstudio.com',
      'IntelliJ IDEA': 'https://www.jetbrains.com/idea',
      'Linux': 'https://www.linux.org',
      'Git': 'https://git-scm.com',
      'Docker': 'https://www.docker.com',
      'Nginx': 'https://nginx.org'
    }
    
    return linkMap[sk] || null
  }

  // 渲染单个技能标签
  const renderSkillTag = (skill, category, index, baseDelay = 0) => {
    const IconComponent = getSkillIcon(skill, category)
    const link = getSkillLink(skill)
    
    const tagContent = (
      <>
        <IconComponent className="w-3.5 h-3.5 md:w-4 md:h-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0" />
        <span className="whitespace-nowrap">{skill}</span>
      </>
    )

    const className = "inline-flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-1.5 md:py-2.5 rounded-lg ui-tag border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-200 text-xs md:text-sm font-medium group"
    
    if (link) {
      return (
        <motion.a
          key={skill}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ 
            duration: 0.3, 
            delay: baseDelay + index * 0.03,
            type: 'spring',
            stiffness: 200
          }}
          className={className}
        >
          {tagContent}
        </motion.a>
      )
    }

    return (
      <motion.span
        key={skill}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ 
          duration: 0.3, 
          delay: baseDelay + index * 0.03,
          type: 'spring',
          stiffness: 200
        }}
        className={className}
      >
        {tagContent}
      </motion.span>
    )
  }

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-primary-600 dark:bg-accent-400 rounded-full" />
        <h3 className="text-3xl md:text-4xl font-bold">技术栈</h3>
      </div>
      
      <div className="space-y-8">
        {Object.entries(techStacks).map(([category, skills], catIndex) => {
          const isLanguage = category === '语言'
          const isGrouped = Array.isArray(skills[0])
          
          return (
            <div key={category}>
              {/* 语言分类不显示标题 */}
              {!isLanguage && (
                <h4 className="text-lg font-semibold mb-5 text-gray-700 dark:text-gray-300">
                  {category}
                </h4>
              )}
              
              {/* 判断是否为分组结构 */}
              {isGrouped ? (
                // 有分组的情况（前端、后端）
                <div className="flex flex-wrap items-center gap-2 md:gap-3">
                  {skills.map((group, groupIndex) => (
                    <div key={groupIndex} className="flex flex-wrap items-center gap-2 md:gap-3">
                      {/* 渲染组内标签 */}
                      {group.map((skill, skillIndex) => 
                        renderSkillTag(skill, category, groupIndex * 10 + skillIndex, 0.2)
                      )}
                      {/* 添加分割线，最后一组不显示 */}
                      {groupIndex < skills.length - 1 && (
                        <div className="hidden sm:block h-6 w-px bg-gray-300 dark:bg-gray-700" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                // 无分组的情况（语言、工具）
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {skills.map((skill, index) => 
                    renderSkillTag(skill, category, index, 0.2)
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default TechStackSection

