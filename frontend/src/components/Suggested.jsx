import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"

import person from "@/assets/person.png"

export default function Suggested({ user }) {
  const [isClickedLoading, setIsClcikedLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const followOrUnfollowUser = async (targetUserId) => {
    try {
      setIsClcikedLoading(true)
      // Send the follow/unfollow request to the backend
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      )
      const isFollowed = await checkIfFollowed(targetUserId)
      setIsFollowing(isFollowed)

      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message) // Error message
      }
    } catch (error) {
      toast.error("Error in follow/unfollow:", error)
    } finally {
      setIsClcikedLoading(false)
    }
  }

  const checkIfFollowed = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/isfollowing/${userId}`,
        { withCredentials: true }
      )

      if (response.data.success) {
        console.log(response.data.isFollowing, userId)

        return response.data.isFollowing // true or false
      } else {
        return false
      }
    } catch (error) {
      console.error("Error checking follow status:", error)
      return false
    }
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (user._id) {
        const status = await checkIfFollowed(user._id)
        setIsFollowing(status)
      }
    }
    checkFollowStatus()
  }, [user._id])

  return (
    <div key={user._id} className="flex items-center justify-between my-5">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>
              {/* Default image or fallback */}
              <img src={person} alt="default_image" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="text-sm font-semibold text-gray-800 capitalize">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-[13px] text-gray-600">Suggested for you</span>
        </div>
      </div>

      {isClickedLoading ? (
        <span className="text-[#2da3f2] text-xs font-semibold cursor-pointer hover:text-[#3495d6]">
          Loading...
        </span>
      ) : (
        <span
          className="text-[#2da3f2] text-xs font-semibold cursor-pointer hover:text-[#3495d6]"
          onClick={() => {
            followOrUnfollowUser(user._id)
          }}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </span>
      )}
    </div>
  )
}
