import { motion, AnimatePresence } from "framer-motion"
import { Heart, MessageCircle } from "lucide-react"
import { useSelector } from "react-redux"
import Empty from "./Empty"
import { useState } from "react"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

export default function Explore() {
  const { posts } = useSelector((store) => store.post)
  const { language } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen md:ml-0 md:pl-[20%] py-10 md:pr-7"
    >
      <motion.h2
        className="mb-6 text-2xl font-bold text-gray-800"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TranslatableText text={"Explore Posts"} language={language} />
      </motion.h2>

      <AnimatePresence>
        {posts && posts.length > 0 ? (
          <motion.div
            className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 justify-items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {posts.map((post, postId) => (
              <SingleImage key={postId} post={post} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="absolute inset-0 flex items-center justify-center h-fit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Empty type="post" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SingleImage = ({ post }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-lg shadow-md cursor-pointer aspect-square"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.img
        src={post.image}
        alt="post image"
        className="object-cover w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.4 }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-6 text-white">
          <motion.button
            className="flex flex-col items-center gap-1"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="w-6 h-6" />
            </motion.div>
            <span className="text-sm font-medium">{post?.likes.length}</span>
          </motion.button>

          <motion.button
            className="flex flex-col items-center gap-1"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{
                scale: isHovered ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
            <span className="text-sm font-medium">{post?.comments.length}</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
