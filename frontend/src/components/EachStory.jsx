import { MessageCircle, MoreHorizontal } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "sonner"
import { useSelector } from "react-redux"
import { useState } from "react"
import axios from "axios"

export default function EachStory({ story }) {
  const { user } = useSelector((store) => store.auth)
  const [liked, setLiked] = useState(story?.likes?.includes(user?._id) || false)
  const [storyLikes, setStoryLikes] = useState(story?.likes?.length)

  const navigate = useNavigate()

  const likeOrDislikeStoryHandler = async () => {
    try {
      const action = liked ? "dislike" : "like"

      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/story/${story._id}/${action}`,
        { withCredentials: true }
      )

      if (res.data.success) {
        // Update like count and toggle like status locally
        const updatedLikes = liked ? storyLikes - 1 : storyLikes + 1
        setStoryLikes(updatedLikes)
        setLiked((curr) => !curr)

        toast.success(res.data.message)

        console.log(liked)
        console.log(updatedLikes)
        console.log(story)
      }
    } catch (error) {
      toast.error("Something went wrong.")
    }
  }

  return (
    <div
      className="w-96 h-[90vh] bg-gray-300 rounded-2xl relative"
      key={story?._id}
    >
      <img
        src={story?.media}
        alt="story image"
        className="absolute z-10 object-cover w-full h-full rounded-2xl"
      />
      <div className="relative z-20 flex items-center justify-between w-full h-16 px-5 py-1 bg-gray-400/25 rounded-t-2xl">
        <section className="flex items-center h-full gap-4">
          <Link to={`/profile/${story?.author?._id}`}>
            <Avatar>
              <AvatarImage
                src={story?.author?.profilePicture}
                alt="post_image"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>

          <p className="font-semibold text-white capitalize">
            {story?.author?.username}
          </p>
          <span className="text-[14px] text-white pt-1">
            {getTimeAgo(story?.createdAt)}
          </span>
        </section>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="text-white cursor-pointer" size={30} />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {story?.author?._id !== user?._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit text-[#ED4956] font-bold"
              >
                Unfollow
              </Button>
            )}

            <Button variant="ghost" className="cursor-pointer w-fit">
              About this content
            </Button>
            {user && user?._id === story?.author._id && (
              <Button
                onClick={() => {
                  navigate(-1)
                }}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                Cancel
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="absolute z-20 flex items-center justify-between w-full h-16 px-2 bottom-2 left-3">
        <input
          type="text"
          placeholder="Send comment..."
          className="w-66 bg-transparent px-3 py-2 border-2 text-white outline-none border-gray-50 rounded-xl text-[15px]"
        />
        <section className="flex items-center gap-4 mr-5 h-fit w-fit">
          <span className="flex gap-1">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeStoryHandler}
                size={"24"}
                className="text-red-600 cursor-pointer"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeStoryHandler}
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
            {storyLikes}
          </span>

          <MessageCircle
            size={"25px"}
            className="text-white cursor-pointer hover:text-gray-200"
          />
        </section>
      </div>
    </div>
  )
}

function getTimeAgo(createdAt) {
  const now = new Date()
  const created = new Date(createdAt)

  const diffInSeconds = Math.floor((now - created) / 1000)

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds === 1 ? "" : "s"} ago`
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} h${diffInHours === 1 ? "" : "s"} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`
}
