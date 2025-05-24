import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Trash2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useGetAllMessage from "@/hooks/useGetAllMessage"
import useGetRTM from "@/hooks/useGetRTM"
import { Button } from "./ui/button"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/dialog"
import axios from "axios"
import { toast } from "sonner"
import { deleteMessage } from "@/redux/chatSlice"

const Messages = ({ selectedUser }) => {
  useGetRTM()
  useGetAllMessage()

  const { messages } = useSelector((store) => store.chat)
  const { user } = useSelector((store) => store.auth)
  const { language } = useLanguage()
  const dispatch = useDispatch()

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [messageToDelete, setMessageToDelete] = useState(null)

  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!messageToDelete) return

    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/message/${messageToDelete}`
      )

      dispatch(deleteMessage(messageToDelete))
      toast.success("Message deleted successfully")
    } catch (error) {
      console.log("Error deleting message:", error)
    } finally {
      setIsDeleteModalOpen(false)
      setMessageToDelete(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setMessageToDelete(null)
  }

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
                className={`flex items-end group ${
                  isSender ? "justify-end" : "justify-start"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.02 }}
              >
                <div className="relative flex items-end">
                  <button
                    onClick={() => handleDeleteClick(msg._id)}
                    className={`absolute p-1 text-gray-500 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-500 ${
                      isSender ? "-left-8" : "-right-8"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div
                    className={`p-3 rounded-2xl max-w-xs sm:max-w-sm md:max-w-md shadow-sm text-sm font-medium ${
                      isSender
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <TranslatableText text={msg.message} language={language} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        <div ref={endRef} />
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <TranslatableText text="Delete Message" language={language} />
            </DialogTitle>
            <DialogDescription>
              <TranslatableText
                text="Are you sure you want to delete this message? This action cannot be undone."
                language={language}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              <TranslatableText text="Cancel" language={language} />
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              <TranslatableText text="Delete" language={language} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Messages
