import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Clapperboard,
} from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "sonner"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setAuthUser } from "@/redux/authSlice"
import CreatePost from "./CreatePost"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Button } from "./ui/button"
import logo from "../assets/logo2.png"
import person from "../assets/person.png"

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  )
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:3000/api/v1/user/logout", {
        withCredentials: true,
      })
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

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler()
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
    }
  }

  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <Clapperboard />, text: "Reel" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
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
    { icon: <LogOut />, text: "Logout" },
  ]
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 hidden md:block lg:w-[16%] md:w-24 h-screen bg-white transition-all ease duration-200">
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
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="relative flex items-center gap-3 p-3 my-3 cursor-pointer rounded-xl hover:bg-gray-100"
              >
                <span>{item.icon}</span>
                <span className="hidden lg:flex">{item.text}</span>
                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="icon"
                          className="absolute w-5 h-5 bg-red-500 rounded-full hover:bg-red-600 bottom-6 left-6"
                        >
                          {likeNotification.length}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <div>
                          {likeNotification.length === 0 ? (
                            <p>No new notification</p>
                          ) : (
                            likeNotification.map((notification) => {
                              return (
                                <div
                                  key={notification.userId}
                                  className="flex items-center gap-2 my-2"
                                >
                                  <Avatar>
                                    <AvatarImage
                                      src={
                                        notification.userDetails?.profilePicture
                                      }
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                  </Avatar>
                                  <p className="text-sm">
                                    <span className="font-bold">
                                      {notification.userDetails?.username}
                                    </span>{" "}
                                    liked your post
                                  </p>
                                </div>
                              )
                            })
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
              </div>
            )
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  )
}

export default LeftSidebar
