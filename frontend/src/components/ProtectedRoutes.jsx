import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setAuthUser } from "@/redux/authSlice"

const ProtectedRoutes = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/me`, {
          withCredentials: true,
        })

        dispatch(setAuthUser(res.data.user))
      } catch (err) {
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate, dispatch])

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        Loading...
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoutes
