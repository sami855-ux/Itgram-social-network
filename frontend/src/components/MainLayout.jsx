import { Outlet, useNavigate, useLocation } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchNotifications } from "@/redux/notification"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)

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
    <div className="flex">
      <LeftSidebar />
      <div className="flex-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
