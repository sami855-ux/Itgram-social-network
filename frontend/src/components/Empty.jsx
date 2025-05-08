import { motion } from "framer-motion"
import { PlusCircle, FileText, Image, Users, MessageSquare } from "lucide-react"

const Empty = ({ type = "post", title, description, actionText, onAction }) => {
  // Icon mapping based on type
  const iconMap = {
    post: <FileText className="w-10 h-10" />,
    image: <Image className="w-10 h-10" />,
    job: <MessageSquare className="w-10 h-10" />,
    user: <Users className="w-10 h-10" />,
    default: <PlusCircle className="w-10 h-10" />,
  }

  // Default messages based on type
  const defaultMessages = {
    post: {
      title: "No posts yet",
      description: "When you create posts, they'll appear here",
    },
    image: {
      title: "No images yet",
      description: "Upload your first image to get started",
    },
    job: {
      title: "No job yet",
      description: "We will post if there is any new things",
    },
    user: {
      title: "No users found",
      description: "Try adjusting your search or invite friends",
    },
    default: {
      title: "Nothing here yet",
      description: "Get started by creating something new",
    },
  }

  // Get the appropriate content
  const content = {
    icon: iconMap[type] || iconMap.default,
    title:
      title || defaultMessages[type]?.title || defaultMessages.default.title,
    description:
      description ||
      defaultMessages[type]?.description ||
      defaultMessages.default.description,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <motion.div
        className="p-4 mb-6 text-blue-500 rounded-full bg-blue-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {content.icon}
      </motion.div>

      <motion.h3
        className="mb-2 text-lg font-semibold text-gray-800"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {content.title}
      </motion.h3>

      <motion.p
        className="max-w-md mb-6 text-gray-500 text-[16px]"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {content.description}
      </motion.p>

      {actionText && (
        <motion.button
          onClick={onAction}
          className="px-6 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {actionText}
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty
