import { AtSign, Heart, MessageCircle } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useGetUserProfile from "@/hooks/useGetUserProfile"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import person from "../assets/person.png"

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const [activeTab, setActiveTab] = useState("posts")
  const [follow, setFollow] = useState(false)

  const { userProfile, user } = useSelector((store) => store.auth)

  const isLoggedInUserProfile = user?._id === userProfile?._id
  const isFollowing = false

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const followOrUnfollowUser = async (targetUserId) => {
    console.log()
    try {
      // Send the follow/unfollow request to the backend
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      )

      // Handle the response
      if (response.data.success) {
        console.log(response.data.message) // "Followed successfully" or "Unfollowed successfully"
      } else {
        console.log(response.data.message) // Error message
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error)
      alert("An error occurred while processing your request")
    }
  }

  const checkIfFollowed = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/isfollowing/${userId}`,
        { withCredentials: true }
      )

      if (response.data.success) {
        setFollow(response.data.isFollowing) // true or false
      } else {
        console.warn("Unexpected response:", response.data.message)
        setFollow(false)
      }
    } catch (error) {
      console.error("Error checking follow status:", error)
      setFollow(false)
    }
  }

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks

  useEffect(() => {
    checkIfFollowed()
  }, [])
  return (
    <div className="flex justify-center max-w-5xl pl-10 mx-auto">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>
                <img src={person} alt="default image" />
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="px-4 text-xl">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="h-8 hover:bg-gray-200"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-8 hover:bg-gray-200"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-[#c9dce9] hover:bg-[#3192d2] h-8 text-gray-800"
                      onClick={() => {
                        followOrUnfollowUser(userId)
                      }}
                    >
                      {follow ? "unfollow" : "follow"}
                    </Button>

                    <Button className="bg-[#eff2f3] text-gray-800 hover:bg-[#ccdbe5] h-8">
                      Message
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-10">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  <span className="text-gray-700">posts</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  <span className="text-gray-700">followers</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  <span className="text-gray-700">following</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-light capitalize">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative cursor-pointer group">
                  <img
                    src={post.image}
                    alt="postimage"
                    className="object-cover w-full my-2 rounded-sm aspect-square"
                  />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                    <div className="flex items-center space-x-4 text-white">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
