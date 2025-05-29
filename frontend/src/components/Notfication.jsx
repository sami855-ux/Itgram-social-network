import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  MessageCircle,
  UserPlus,
  Briefcase,
  Send,
  CheckCircle2,
  XCircle,
  Reply,
  Tag,
  Bell,
  MoreVertical,
  Trash2,
  MailCheck,
  ChevronLeft,
  Search,
  X,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import person from "../assets/person.png"
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/redux/notification"

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const getNotificationIcon = () => {
    const iconClass = "w-5 h-5"
    switch (notification.type) {
      case "like":
        return <Heart className={`${iconClass} text-rose-500`} />
      case "comment":
        return <MessageCircle className={`${iconClass} text-blue-500`} />
      case "follow":
        return <UserPlus className={`${iconClass} text-green-500`} />
      case "jobApplication":
        return <Briefcase className={`${iconClass} text-amber-500`} />
      case "jobAccept":
        return <CheckCircle2 className={`${iconClass} text-green-500`} />
      case "jobReject":
        return <XCircle className={`${iconClass} text-red-500`} />
      case "mention":
        return <Tag className={`${iconClass} text-purple-500`} />
      case "message":
        return <Send className={`${iconClass} text-sky-500`} />
      case "storyReply":
        return <Reply className={`${iconClass} text-indigo-500`} />
      case "postTag":
        return <Tag className={`${iconClass} text-fuchsia-500`} />
      default:
        return <Bell className={`${iconClass} text-gray-500`} />
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const created = new Date(date) // Convert string to Date
    const diffInSeconds = Math.floor((now - created) / 1000)

    if (isNaN(diffInSeconds)) return "Invalid date"

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    return `${Math.floor(diffInSeconds / 86400)}d`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`px-4 py-3 flex items-center gap-3 ${
        !notification.isRead ? "bg-blue-50/50" : "bg-white"
      } hover:bg-gray-50 relative`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 overflow-hidden border border-gray-200 rounded-full">
          <img
            src={notification?.sender?.profilePicture || person}
            alt={notification?.sender?.username}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
          {getNotificationIcon()}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold truncate">
            {notification?.sender?.username}
          </span>
          {notification?.sender?.verified && (
            <svg
              className="w-3 h-3 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">
          {notification?.type === "like" && "liked your post"}
          {notification?.type === "comment" &&
            `commented: ${notification?.message}`}
          {notification?.type === "follow" && "started following you"}
          {notification?.type === "jobApplication" && "applied to your job"}
          {notification?.type === "jobAccept" && "accepted your application"}
          {notification?.type === "jobReject" && "rejected your application"}
          {notification?.type === "mention" && "mentioned you"}
          {notification?.type === "message" && "sent you a message"}
          {notification?.type === "storyReply" && "replied to your story"}
          {notification?.type === "postTag" && "tagged you in a post"}
        </p>
        <span className="text-xs text-gray-400">
          {formatTime(notification?.createdAt)}
        </span>
      </div>

      {notification?.post && (
        <div className="flex-shrink-0 w-12 h-12 overflow-hidden border border-gray-200 rounded-md">
          <img
            src={notification.post.image}
            alt="Post"
            className="object-cover w-full h-full"
          />
        </div>
      )}

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute right-0 z-10 w-48 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  onMarkAsRead(notification._id)
                  setMenuOpen(false)
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <MailCheck className="w-4 h-4" />
                Mark as read
              </button>
              <button
                onClick={() => {
                  onDelete(notification._id)
                  setMenuOpen(false)
                }}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const Notification = () => {
  const { items: notifi, loading } = useSelector((state) => state.notifications)
  const { user: currentUser } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dispatch = useDispatch()

  const markAsRead = (id) => {
    dispatch(markNotificationRead(id))
    dispatch(fetchNotifications(currentUser._id))
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    dispatch(markAllNotificationsRead(currentUser._id))
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotificationUi = (id) => {
    dispatch(deleteNotification(id))
    setNotifications((prev) => prev.filter((n) => n._id !== id))
  }

  const filteredNotifications = notifications.filter((n) => {
    const matchesTab = activeTab === "all" || !n.isRead
    const matchesSearch =
      n.sender?.username?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      n.message?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    return matchesTab && (searchQuery === "" || matchesSearch)
  })

  useEffect(() => {
    if (!loading && Array.isArray(notifi) && notifi?.length > 0) {
      setNotifications(notifi)
    }
    console.log("Notifications:", notifi)
    console.log("Loading:", loading)
    console.log(notifications.length, "notifications loaded")
  }, [notifi, loading, notifi?.length])

  return (
    <div className="flex flex-col h-screen bg-white  md:ml-0 w-full  md:w-full min-h-screen md:px-4 py-10 sm:px-6 md:pl-[18%] md:pr-7">
      {/* Header */}
      <header className="sticky top-0 bg-white z-5 ">
        <div className="flex items-center px-4 pb-3">
          {searchOpen ? (
            <div className="flex items-center w-full">
              <button
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery("")
                }}
                className="mr-2 text-gray-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Search notifications..."
                className=" w-[400px] px-2 py-1 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Notifications</h1>
              <button
                onClick={() => setSearchOpen(true)}
                className="ml-auto text-gray-700"
              >
                <Search className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex  w-[70%]">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "all"
                ? "text-black border-t-2 border-gray-200 bg-gray-200 rounded-lg"
                : "text-gray-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === "unread"
                ? "text-black border-t-2 border-gray-200 bg-gray-200 rounded-lgk"
                : "text-gray-500"
            }`}
          >
            Unread
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <Bell className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-700">
                No notifications
              </h3>
              <p className="mt-1 text-gray-500">
                {searchQuery
                  ? "No results found"
                  : "When you get notifications, they will appear here"}
              </p>
            </motion.div>
          ) : (
            <>
              {filteredNotifications.some((n) => !n.isRead) && (
                <motion.div
                  layout
                  transition={{ duration: 0.2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200"
                >
                  <span className="text-sm text-gray-500">
                    New notifications
                  </span>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm font-medium text-blue-500"
                  >
                    Mark all as read
                  </button>
                </motion.div>
              )}
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotificationUi}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default Notification
