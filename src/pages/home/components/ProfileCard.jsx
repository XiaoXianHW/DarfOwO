import { motion } from 'framer-motion'
import { HiBriefcase } from 'react-icons/hi'

const ProfileCard = ({ config, itemVariants }) => {
  const aboutInfo = config.aboutInfo || {}
  const bio = aboutInfo.bio || ''

  return (
    <motion.div variants={itemVariants}>

      {/* 个人信息 */}
      <div className="space-y-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* 头像 */}
          <img
            src={config.home?.avatar}
            alt={aboutInfo.name || 'Avatar'}
            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-gray-200 dark:border-gray-800 object-cover flex-shrink-0"
          />
          
          {/* 个人信息 - 手机端居中 */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            {/* 名字和别名 */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {aboutInfo.name || 'XiaoXian'}
                {/* PC端：别名跟在后面 */}
                {aboutInfo.aliases && (
                  <span className="hidden md:inline text-xl md:text-2xl text-gray-500 dark:text-gray-500 font-normal ml-4">
                    {aboutInfo.aliases.join(' / ')}
                  </span>
                )}
              </h2>
              {/* 手机端：别名换行显示 */}
              {aboutInfo.aliases && (
                <div className="md:hidden text-lg text-gray-500 dark:text-gray-500 font-normal">
                  {aboutInfo.aliases.join(' / ')}
                </div>
              )}
            </div>
            
            {/* 描述 */}
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {aboutInfo.description || ''}
            </p>
            
            {/* 就职标签 */}
            {aboutInfo.workTags && aboutInfo.workTags.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg ui-tag-secondary">
                  <HiBriefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">就职于</span>
                </div>
                {aboutInfo.workTags.map((tag) => (
                  <a
                    key={tag.name}
                    href={tag.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-1.5 rounded-lg ui-tag border border-transparent hover:border-primary-500 dark:hover:border-accent-400 text-sm font-medium transition-all duration-200"
                  >
                    {tag.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 个人简介 */}
        {bio && (
          <div className="relative pl-6 md:pl-8 border-l-2 border-gray-200 dark:border-gray-800">
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed italic whitespace-pre-line">
              {bio}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProfileCard

