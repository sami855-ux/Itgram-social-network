import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { MessageCircleCode, Send, ImageIcon, X } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import axios from "axios"

import { setSelectedUser } from "@/redux/authSlice"
import { setMessages } from "@/redux/chatSlice"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Messages from "./Messages"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("")
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { user, selectedUser } = useSelector((store) => store.auth)
  const { onlineUsers, messages } = useSelector((store) => store.chat)
  const { language } = useLanguage()

  const dispatch = useDispatch()

  const sendMessageHandler = async (receiverId) => {
    if (!textMessage.trim()) return

    const formData = new FormData()
    if (textMessage.trim()) formData.append("textMessage", textMessage)
    if (selectedImage) formData.append("image", selectedImage)

    console.log("selectedImage", selectedImage)
    console.log("textMessage", textMessage)
    try {
      setIsUploading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/message/send/${receiverId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]))
        setTextMessage("")
        setSelectedImage(null)
        setImagePreview(null)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const fetchUsersForMessaging = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/userForMessaging`,
        {
          withCredentials: true,
        }
      )
      return response.data.users
    } catch (error) {
      console.error("Failed to fetch messaging users:", error)
      return []
    }
  }

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await fetchUsersForMessaging()
      setSuggestedUsers(allUsers)
    }

    loadUsers()
    dispatch(setSelectedUser(null))
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex md:ml-[16%] h-screen"
    >
      {/* Left sidebar */}
      <motion.section
        className="w-56 py-8 bg-white border-r border-gray-200 md:w-1/4"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="px-3 mb-4 text-xl font-bold text-gray-800 capitalize">
            <TranslatableText text={user?.username} language={language} />
          </h1>
          <div className="pb-7">
            <Avatar className="w-16 h-16 m-3 border-2 border-blue-500">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        <div className="overflow-y-auto h-[80vh] custom-scrollbar">
          <h1 className="px-3 mb-4 text-xl font-bold text-gray-800 capitalize">
            <TranslatableText text={"Messages"} language={language} />
          </h1>
          <AnimatePresence>
            {suggestedUsers.map((suggestedUser, id) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id)
              return (
                <motion.div
                  key={id}
                  onClick={() => dispatch(setSelectedUser(suggestedUser))}
                  className="flex items-center gap-3 p-3 transition-colors rounded-lg cursor-pointer hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: id * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={suggestedUser?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium capitalize">
                      <TranslatableText
                        text={suggestedUser?.username}
                        language={language}
                      />
                    </span>
                    <span
                      className={`text-xs font-[400] ${
                        isOnline ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {isOnline ? (
                        <TranslatableText text={"online"} language={language} />
                      ) : (
                        <TranslatableText
                          text={"offline"}
                          language={language}
                        />
                      )}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Right chat area */}
      <AnimatePresence>
        {selectedUser ? (
          <motion.section
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col flex-1 h-full bg-gray-50"
          >
            {/* Chat header */}
            <motion.div
              className="sticky top-0 z-10 flex items-center gap-3 px-6 py-4 bg-white border-b border-gray-200 shadow-sm"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              <Avatar className="border-2 border-blue-500">
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-medium capitalize">
                  <TranslatableText
                    text={selectedUser?.username}
                    language={language}
                  />
                </span>
                <span className="text-xs text-gray-500">
                  {onlineUsers.includes(selectedUser?._id) ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                      <TranslatableText text={"Online"} language={language} />
                    </span>
                  ) : (
                    <TranslatableText text={"Offline"} language={language} />
                  )}
                </span>
              </div>
            </motion.div>

            {/* Messages */}
            <Messages selectedUser={selectedUser} />

            {/* Image preview */}
            {imagePreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative p-4 bg-gray-100 border-t border-gray-200"
              >
                <div className="relative max-w-xs mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-0 right-0 p-1 text-white translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Message input */}
            <motion.div
              className="sticky bottom-0 p-4 bg-white border-t border-gray-200"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
            >
              <div className="flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="p-2 mr-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100"
                >
                  <ImageIcon className="w-5 h-5" />
                </label>
                <Input
                  value={textMessage}
                  onChange={(e) => setTextMessage(e.target.value)}
                  type="text"
                  className="flex-1 mr-3 border-gray-300 rounded-full focus-visible:ring-2 focus-visible:ring-blue-500/50"
                  placeholder="Type a message..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessageHandler(selectedUser?._id)
                    }
                  }}
                />
                <Button
                  className="px-6 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  onClick={() => sendMessageHandler(selectedUser?._id)}
                  disabled={
                    (!textMessage.trim() && !selectedImage) || isUploading
                  }
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.section>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center flex-1 mx-auto"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                transition: { duration: 2, repeat: Infinity },
              }}
            >
              <MessageCircleCode className="w-32 h-32 my-4 text-gray-300" />
            </motion.div>
            <h1 className="text-xl font-medium text-gray-700">
              <TranslatableText text={"Your messages"} language={language} />
            </h1>
            <p className="max-w-md px-4 text-center text-gray-500">
              <TranslatableText
                text={"Select a conversation or start a new one"}
                language={language}
              />
            </p>
            <motion.div className="mt-6" whileHover={{ scale: 1.05 }}>
              <Button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-500">
                <TranslatableText text={"New message"} language={language} />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default ChatPage
