import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Loader2,
  Briefcase,
  ClipboardPlus,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { TranslatableText } from "@/utils/TranslatableText"
import { useLanguage } from "@/context/LanaguageContext"
import { setAuthUser } from "@/redux/authSlice"
import person from "../assets/person.png"
import logo from "../assets/logo2.png"
import CreatePost from "./CreatePost"
import { Button } from "./ui/button"
import { resetLikedNotification } from "@/redux/rtnSlice"

const LeftSidebar = () => {
  const { user } = useSelector((store) => store.auth)
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  )
  const { language } = useLanguage()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [isSearchClicked, setSearchClicked] = useState(false)
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])
  const [searchText] = useState(
    language == "am" ? "ተጠቃሚ ፍልግ" : "Search a user..."
  )
  const unreadNotifications = useSelector((state) =>
    state.notifications.items.filter((n) => !n.isRead)
  )
  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setAuthUser(null))
        dispatch(setSelectedPost(null))
        dispatch(setPosts([]))

        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!query.trim()) return

    setQuery((curr) => curr.trim())
    setSearchResult([])

    try {
      setIsLoading(true)
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/search?query=${query}`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        setSearchResult(res.data.users)
      }
    } catch (err) {
      toast.error(err.response.data.message)
    } finally {
      setIsLoading(false)
    }

    setQuery("")
  }

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler()
      dispatch(resetLikedNotification())
    } else if (textType === "Create") {
      setOpen(true)
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`)
    } else if (textType === "Home") {
      navigate("/")
    } else if (textType === "Messages") {
      navigate("/chat")
    } else if (textType === "Explore") {
      navigate("/explore")
    } else if (textType === "Post a Job") {
      navigate("/postJob")
    } else if (textType === "Posted Job") {
      navigate("/postedJob")
    } else if (textType === "Notifications") {
      navigate("/notification")
    }
  }

  const sidebarItems = [
    { icon: <Home color="#f2f2f2" />, text: "Home" },
    { icon: <Search color="#f2f2f2" />, text: "Search" },
    { icon: <TrendingUp color="#f2f2f2" />, text: "Explore" },
    { icon: <Briefcase color="#f2f2f2" />, text: "Posted Job" },
    { icon: <ClipboardPlus color="#f2f2f2" />, text: "Post a Job" },
    { icon: <MessageCircle color="#f2f2f2" />, text: "Messages" },
    { icon: <Heart color="#f2f2f2" />, text: "Notifications" },
    { icon: <PlusSquare color="#f2f2f2" />, text: "Create" },
    {
      icon: (
        <Avatar className="w-8 h-8 border border-gray-400">
          <AvatarImage src={user?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            <img src={person} alt="default image" />
          </AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut color="#f2f2f2" />, text: "Logout" },
  ]

  useEffect(() => {
    setSearchResult([])
  }, [isSearchClicked])

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 hidden md:block lg:w-[16%] md:w-24 h-screen bg-gray-900 transition-all ease duration-200">
      <div className="flex flex-col">
        <div className="flex items-center justify-center my-2">
          <img
            src={logo}
            alt="logo"
            className="invisible object-cover w-20 h-20 rounded-full lg:visible"
          />
        </div>
        <div>
          {sidebarItems.map((item, index) => {
            // Skip 'Posted Job' if the user is not a recruiter
            if (item.text === "Posted Job" && user?.role !== "job seeker") {
              return null
            }
            // Skip 'Post a Job' if the user is not a recruiter
            if (item.text === "Post a Job" && user?.role !== "recruiter") {
              return null
            }

            return (
              <div
                onClick={() => {
                  sidebarHandler(item.text)

                  if (item.text === "Search") {
                    setSearchClicked((curr) => !curr)
                  }
                }}
                key={index}
                className={`flex relative items-center gap-3 p-3 my-3 cursor-pointer rounded-xl hover:bg-gray-800`}
              >
                <span>{item.icon}</span>
                <span className="hidden font-semibold lg:flex text-slate-100">
                  <TranslatableText text={item.text} language={language} />
                </span>

                {item.text === "Notifications" &&
                  unreadNotifications.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="absolute w-5 h-5 bg-red-500 rounded-full hover:bg-red-600 bottom-6 left-6"
                        >
                          {unreadNotifications.length}
                        </Button>
                      </PopoverTrigger>
                    </Popover>
                  )}
              </div>
            )
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />

      {/* Overlay */}
      {isSearchClicked && (
        <div
          className="absolute top-0 left-0 z-30 w-screen h-screen bg-gray-900/75"
          onClick={() => {
            setSearchClicked(false)
          }}
        ></div>
      )}
      {isSearchClicked && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-16 left-24 md:left-52 lg:left-96 bg-white w-[60dvw] h-[85dvh] z-40 rounded-xl shadow-xl p-7 border border-gray-100"
        >
          <motion.h2
            className="pb-5 text-2xl font-bold text-gray-800"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <TranslatableText text={"Search for a user"} language={language} />
          </motion.h2>

          <motion.form
            className="flex items-center w-full gap-4 mb-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="relative w-full"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchText}
                className="w-full px-4 py-3 text-[15px] font-light border border-gray-200 rounded-xl outline-none bg-gray-50 focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all"
              />
              <motion.div className="absolute -translate-y-1/2 right-2 top-1/2">
                {isLoading ? (
                  <Button className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <TranslatableText text={"Searching"} language={language} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="px-6 py-2 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    <TranslatableText text={"Search"} language={language} />
                  </Button>
                )}
              </motion.div>
            </motion.div>
          </motion.form>

          <motion.hr
            className="w-full my-4 border border-gray-100"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.2 }}
          />

          <AnimatePresence>
            {isLoading ? (
              <motion.div
                className="flex items-center justify-center w-full h-96"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                >
                  <Loader2 className="w-16 h-16 text-blue-500" />
                </motion.div>
              </motion.div>
            ) : searchResult && searchResult.length > 0 ? (
              <motion.div
                className="flex flex-col w-full gap-2 p-4 overflow-y-auto max-h-[65vh] custom-scrollbar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {searchResult.map((user, userIndex) => (
                  <motion.div
                    key={userIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: userIndex * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Link
                      to={`/profile/${user?._id}`}
                      onClick={() => setSearchClicked(false)}
                      className="flex items-center justify-between px-4 py-3 transition-colors rounded-xl hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={user?.profilePicture}
                              alt="profile"
                            />
                            <AvatarFallback>
                              <img
                                src={person}
                                alt="default"
                                className="w-full h-full"
                              />
                            </AvatarFallback>
                          </Avatar>
                        </motion.div>
                        <div>
                          <motion.h1
                            className="text-sm font-semibold text-gray-800 capitalize transition-colors hover:text-blue-600"
                            whileHover={{ x: 2 }}
                          >
                            <TranslatableText
                              text={user?.username}
                              language={language}
                            />
                          </motion.h1>
                          <span className="text-xs text-gray-500">
                            <TranslatableText
                              text="Suggested for you"
                              language={language}
                            />
                          </span>
                        </div>
                      </div>
                      <motion.div
                        className="text-xs text-gray-400"
                        whileHover={{ scale: 1.1 }}
                      >
                        →
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center h-64 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="p-4 mb-4 text-blue-500 rounded-full bg-blue-50"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 1, repeat: Infinity },
                  }}
                >
                  <Search className="w-8 h-8" />
                </motion.div>
                <h3 className="text-lg font-medium text-gray-700">
                  <TranslatableText
                    text="No results found"
                    language={language}
                  />
                </h3>
                <p className="max-w-md text-gray-500">
                  <TranslatableText
                    text="Try searching with different keywords"
                    language={language}
                  />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default LeftSidebar
