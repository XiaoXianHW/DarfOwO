import { motion } from 'framer-motion'
import { getIcon } from '../../../utils/iconMapper'

const ContactsSection = ({ contacts, isInView, itemVariants }) => {
  if (!contacts || contacts.length === 0) return null

  return (
    <motion.div variants={itemVariants}>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-10 bg-primary-600 dark:bg-accent-400 rounded-full" />
        <h3 className="text-3xl md:text-4xl font-bold">社交平台</h3>
      </div>
      
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4">
        {contacts.map((contact, index) => {
          const Icon = getIcon(contact.icon)
          return (
            <motion.a
              key={contact.name}
              href={contact.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-4 p-4 md:p-5 rounded-lg ui-card border border-transparent hover:border-primary-500 dark:hover:border-accent-400 transition-all duration-300 group"
            >
              <div className={`p-2.5 md:p-3 rounded-lg ui-tag-secondary group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold mb-1">{contact.name}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {contact.value}
                </div>
              </div>
            </motion.a>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ContactsSection

