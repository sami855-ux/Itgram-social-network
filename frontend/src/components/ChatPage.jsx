import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { MessageCircleCode } from "lucide-react"
import { useEffect, useState } from "react"
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
  const { user, selectedUser } = useSelector((store) => store.auth)
  const { onlineUsers, messages } = useSelector((store) => store.chat)
  const { language } = useLanguage()

  const dispatch = useDispatch()

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]))
        setTextMessage("")
      }
    } catch (error) {
      console.log(error)
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
    return () => {
      const loadUsers = async () => {
        const allUsers = await fetchUsersForMessaging()
        setSuggestedUsers(allUsers)
        console.log(allUsers)
      }

      loadUsers()
      dispatch(setSelectedUser(null))
    }
  }, [])

  return (
    <div className="flex md:ml-[16%] h-screen">
      <section className="w-56 py-8 pl-4 border-r border-gray-200 md:w-1/4">
        <h1 className="px-3 mb-4 text-xl font-bold text-gray-800 capitalize">
          <TranslatableText text={user?.username} language={language} />
        </h1>
        <div className="pb-7">
          <Avatar className="w-16 h-16 m-3 border">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="overflow-y-auto h-[80vh]">
          <h1 className="px-3 mb-4 text-xl font-bold text-gray-800 capitalize">
            <TranslatableText text={" Messages"} language={language} />
          </h1>
          {suggestedUsers.map((suggestedUser, id) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id)
            return (
              <div
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                key={id}
              >
                <Avatar className="w-16 h-16">
                  <AvatarImage src={suggestedUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium capitalize">
                    <TranslatableText
                      text={suggestedUser?.username}
                      language={language}
                    />
                  </span>
                  <span
                    className={`text-xs font-[400] ${
                      isOnline ? "text-green-600" : "text-red-600"
                    } `}
                  >
                    {isOnline ? (
                      <TranslatableText text={"online"} language={language} />
                    ) : (
                      <TranslatableText text={"offline"} language={language} />
                    )}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex flex-col flex-1 h-full py-5 border-l border-l-gray-300">
          <div className="sticky top-0 z-10 flex items-center gap-3 px-3 py-3 border-b border-gray-300">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col py-1 capitalize">
              <span className="text-lg capitalize">
                <TranslatableText
                  text={selectedUser?.username}
                  language={language}
                />
              </span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 border-gray-300 rounded-xl focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button
              className="px-16"
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              <TranslatableText text={" Send"} language={language} />
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4" />
          <h1 className="font-medium">
            <TranslatableText text={"Your messages"} language={language} />
          </h1>
          <span>
            <TranslatableText
              text={"Send a message to start a chat."}
              language={language}
            />
          </span>
        </div>
      )}
    </div>
  )
}

export default ChatPage
