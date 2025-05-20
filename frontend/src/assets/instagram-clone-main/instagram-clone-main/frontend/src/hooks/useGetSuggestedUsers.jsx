import { useDispatch } from "react-redux"
import { useEffect } from "react"
import axios from "axios"

import { setSuggestedUsers } from "@/redux/authSlice"

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_UR}/api/v1/user/suggested`,
          { withCredentials: true }
        )
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users))
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchSuggestedUsers()
  }, [])
}
export default useGetSuggestedUsers
