import { Outlet, useNavigate, useLocation, Link } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchNotifications } from "@/redux/notification"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"
import {
  Menu,
  Settings,
  X,
  Search,
  User,
  PlusSquare,
  LogOut,
  TrendingUp,
  Briefcase,
  ClipboardPlus,
  Heart,
  HomeIcon,
} from "lucide-react"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import { toast } from "sonner"
import LanguageSelector from "./LanguageSelector"
import { MessageCircle } from "lucide-react"
import CreatePost from "./CreatePost"

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

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

  // Fetch authenticated user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/me`,
          {
            withCredentials: true,
          }
        )

        if (response.data.success) {
          const fetchedUser = response.data.user
          dispatch(setAuthUser(fetchedUser))

          // 👇 Redirect admin users to /admin if not already there
          if (
            fetchedUser.role === "admin" &&
            !location.pathname.startsWith("/admin")
          ) {
            navigate("/admin")
          }
        } else {
          navigate("/login")
        }
      } catch (error) {
        console.error("Error fetching current user:", error)
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchCurrentUser()
  }, [dispatch, navigate, location.pathname])

  // Fetch notifications after user is loaded
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchNotifications(user._id))
    }
  }, [dispatch, user?._id])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center w-full gap-3 px-3 py-2 border-b border-gray-200 h-fit md:hidden">
        <button onClick={toggleMenu}>
          <Menu className="text-gray-700 dark:text-gray-300" />
        </button>
        <p className="text-2xl font-semibold">ItGram</p>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-xl font-bold">Menu</p>
          <button onClick={toggleMenu}>
            <X className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                to={`/explore`}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrendingUp className="w-5 h-5" />
                <span>Explore</span>
              </Link>
            </li>
            {user?.role !== "job seeker" && (
              <li>
                <Link
                  to={`/postJob`}
                  onClick={toggleMenu}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ClipboardPlus className="w-5 h-5" />
                  <span>Post a Jobs</span>
                </Link>
              </li>
            )}
            <li>
              <Link
                to={`/postedJob`}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Briefcase className="w-5 h-5" />
                <span>Posted Jobs</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/notification`}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Heart className="w-5 h-5" />
                <span>Notification</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/chat`}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Chat</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/chat`}
                onClick={() => {
                  setOpen(true)
                }}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <PlusSquare className="w-5 h-5" />
                <span>Create</span>
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${user?._id}`}
                onClick={toggleMenu}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </li>
            <li>
              <span
                onClick={logoutHandler}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </span>
            </li>
          </ul>
        </nav>
        <CreatePost open={open} setOpen={setOpen} />
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <LanguageSelector />
        </div>
      </div>
      <div className="flex">
        {/* Mobile Header */}

        <LeftSidebar />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default MainLayout
