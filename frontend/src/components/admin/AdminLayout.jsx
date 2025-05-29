import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useNavigate } from "react-router-dom"
import axios from "axios"

import { fetchAdminStats } from "@/redux/adminSlice"
import { setAuthUser } from "@/redux/authSlice"

export default function AdminLayout() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [loading, setLoading] = useState(true)

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
          dispatch(setAuthUser(response.data.user))

          // Optionally verify if user is admin
          if (response.data.user.role !== "admin") {
            navigate("/login") // or "/not-authorized"
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
  }, [dispatch, navigate])

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchAdminStats())
    }
  }, [dispatch, user?._id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">
          Loading Admin Panel<span className="animate-pulse">...</span>
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Preparing your dashboard
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Outlet />
    </div>
  )
}
