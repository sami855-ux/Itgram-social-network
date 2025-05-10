import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { useRef, useEffect } from "react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useGetAllMessage from "@/hooks/useGetAllMessage"
import useGetRTM from "@/hooks/useGetRTM"
import { Button } from "./ui/button"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const Messages = ({ selectedUser }) => {
  useGetRTM()
  useGetAllMessage()

  const { messages } = useSelector((store) => store.chat)
  const { user } = useSelector((store) => store.auth)
  const { language } = useLanguage()

  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <div className="flex-1 p-4 overflow-y-auto shadow-inner bg-gradient-to-br from-white to-gray-100 rounded-xl">
      {/* Profile Section */}
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center">
          <Avatar className="transition-transform duration-300 w-28 h-28 ring ring-blue-400 ring-offset-2 hover:scale-105">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="py-2 text-lg font-semibold text-gray-700">
            <TranslatableText
              text={selectedUser?.username}
              language={language}
            />
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button
              className="h-8 px-10 mt-2 transition-all duration-300 rounded-full shadow-sm hover:shadow-md"
              variant="secondary"
            >
              <TranslatableText text="View profile" language={language} />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Message List */}
      <div className="flex flex-col gap-3 px-2">
        {messages &&
          messages.map((msg, index) => {
            const isSender = msg.senderId === user?._id
            return (
              <motion.div
                key={msg._id}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md shadow-sm text-sm font-medium ${
                    isSender
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <TranslatableText text={msg.message} language={language} />
                </div>
              </motion.div>
            )
          })}
        <div ref={endRef} />
      </div>
    </div>
  )
}

export default Messages
