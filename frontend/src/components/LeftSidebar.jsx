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

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { setAuthUser } from "@/redux/authSlice"
import person from "../assets/person.png"
import logo from "../assets/logo2.png"
import CreatePost from "./CreatePost"
import { Button } from "./ui/button"

const LeftSidebar = () => {
  const navigate = useNavigate()
  const { user } = useSelector((store) => store.auth)
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  )
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [isSearchClicked, setSearchClicked] = useState(false)
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchResult, setSearchResult] = useState([])

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
    console.log(user)
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
                <span className="hidden lg:flex text-slate-100">
                  {item.text}
                </span>

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
                                  <Link
                                    to={`/profile/${notification.userDetails?._id}`}
                                  >
                                    <Avatar>
                                      <AvatarImage
                                        src={
                                          notification.userDetails
                                            ?.profilePicture
                                        }
                                        alt="post_image"
                                      />
                                      <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                  </Link>

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
        <div className="absolute top-16 left-24 md:left-52 lg:left-96 bg-white w-[60dvw] h-[85dvh] z-40 rounded-md p-7">
          <h2 className="pb-5 text-xl font-semibold">Search for a user</h2>

          <form
            className="flex items-center w-full gap-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter the username..."
              className="px-3 py-2 text-[15px] font-light border border-gray-200 rounded-lg outline-none bg-gray-50 w-[70%]"
            />

            {isLoading ? (
              <Button>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">Search</Button>
            )}
          </form>
          <hr className="w-full my-4 border border-gray-100" />

          {isLoading ? (
            <div className="flex items-center justify-center w-full h-96">
              <p className="">
                {" "}
                <Loader2 className="mr-2 h-14 w-14 animate-spin" />
              </p>
            </div>
          ) : searchResult && searchResult.length > 0 ? (
            <div className="flex flex-col w-full gap-1 p-4 overflow-scroll h-fit search-container">
              {searchResult.map((user, userIndex) => {
                return (
                  <Link
                    to={`/profile/${user?._id}`}
                    key={userIndex}
                    onClick={() => {
                      setSearchClicked(false)
                    }}
                    className="flex items-center justify-between px-2 py-3 my-2 rounded-lg w-96 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${user?._id}`}>
                        <Avatar>
                          <AvatarImage
                            src={user?.profilePicture}
                            alt="post_image"
                          />
                          <AvatarFallback>
                            <img src={person} alt="default_image" />
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <h1 className="text-sm font-semibold text-gray-800 capitalize">
                          <Link to={`/profile/${user?._id}`}>
                            {user?.username}
                          </Link>
                        </h1>
                        <span className="text-[13px] text-gray-600">
                          Suggested for you
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default LeftSidebar
