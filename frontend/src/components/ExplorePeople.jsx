import { motion, AnimatePresence } from "framer-motion"
import { useSelector } from "react-redux"
import image from "../assets/person.png"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function ExplorePeople() {
  const { suggestedUsers } = useSelector((store) => store.auth)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen pl-[20%] py-10 pr-7 flex flex-col items-center gap-4"
    >
      <motion.div
        className="w-full py-1"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-gray-800">Discover People</h1>
        <p className="text-sm text-gray-500">
          Connect with interesting accounts
        </p>
      </motion.div>

      <AnimatePresence>
        {suggestedUsers && suggestedUsers.length > 0 ? (
          suggestedUsers.map((user, userId) => (
            <SingleUser key={userId} user={user} />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <motion.div
              className="flex items-center justify-center p-6 mb-6 rounded-full bg-blue-50/80"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              {/* <Users className="w-8 h-8 text-blue-500" /> */}
            </motion.div>
            <h3 className="mb-2 text-xl font-medium text-gray-800">
              No suggestions yet
            </h3>
            <p className="max-w-md text-gray-500">
              We'll suggest accounts for you to follow based on your activity
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SingleUser = ({ user }) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsFollowing(!isFollowing)
      setIsLoading(false)
    }, 800)
  }

  return (
    <motion.section
      className="h-24 w-full max-w-[600px] flex items-center justify-between px-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center h-full gap-4 w-fit">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.profilePicture} alt="profile" />
            <AvatarFallback>
              <img src={image} alt="default" className="w-full h-full" />
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <section className="flex flex-col justify-center h-full w-fit">
          <motion.h2
            className="font-semibold text-[15px] capitalize hover:text-blue-600 transition-colors cursor-pointer"
            whileHover={{ x: 2 }}
          >
            {user.username}
          </motion.h2>
          <p className="text-gray-700 text-[14px] line-clamp-1">{user?.bio}</p>
          <p className="text-xs text-gray-500">Suggested for you</p>
        </section>
      </div>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button
          className={`px-7 ${
            isFollowing
              ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleFollow}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : isFollowing ? (
            "Following"
          ) : (
            "Follow"
          )}
        </Button>
      </motion.div>
    </motion.section>
  )
}
