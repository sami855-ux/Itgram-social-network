import {
  Bookmark,
  Loader2,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { setPosts, setSelectedPost } from "@/redux/postSlice"
import CommentDialog from "./CommentDialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Link } from "react-router-dom"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const Post = ({ post }) => {
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const { posts } = useSelector((store) => store.post)
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const [postLike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isClickedLoading, setIsClcikedLoading] = useState(false)
  const [isPostBookmarked, setIsPostBookmarked] = useState(false)
  const { language } = useLanguage()
  const [commentStyle] = useState(
    language === "am" ? "አስተያየት ይስቱ" : "Add comments"
  )
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("")
    }
  }

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like"
      const res = await axios.get(
        `http://localhost:3000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      )
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1
        setPostLike(updatedLikes)
        setLiked(!liked)

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      console.log(res.data)
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map((p) =>
          p?._id === post?._id ? { ...p, comments: updatedCommentData } : p
        )

        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      )
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.messsage)
    }
  }

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post/${post?._id}/bookmark`,
        { withCredentials: true }
      )
      if (res.data.success) {
        toast.success(res.data.message)
      }
      setIsPostBookmarked((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

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
      const isFollowed = await checkIfFollowed(post?.author?._id)
      setIsFollowing(isFollowed)

      // Handle the response
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
        return response.data.isFollowing // true or false
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  const checkIfBookmarked = async (postId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post/isbookmarked/${postId}`,
        { withCredentials: true }
      )

      if (response.data.success) {
        return response.data.isBookmarked // true or false
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      if (post?.author?._id) {
        const status = await checkIfFollowed(post?.author?._id)
        setIsFollowing(status)
      }
    }
    const checkBookmarkStatus = async () => {
      if (post?._id) {
        const status = await checkIfBookmarked(post?._id)
        setIsPostBookmarked(status)
      }
    }
    checkFollowStatus()
    checkBookmarkStatus()
  }, [post?.author?._id, post?._id])

  return (
    <div className="w-[500px] max-w-sm mx-auto my-8 border-b border-gray-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?._id}`}>
            <Avatar>
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-semibold capitalize text-[14px]">
              <TranslatableText
                text={post.author?.username}
                language={language}
              />
            </h1>
            {user?._id === post.author?._id && (
              <Badge
                variant="secondary"
                className="pt-1 border border-gray-200"
              >
                <TranslatableText text={"Author"} language={language} />
              </Badge>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            {post?.author?._id !== user?._id &&
              (isClickedLoading ? (
                <Button>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  className="cursor-pointer w-fit text-[#f46c78] font-bold"
                  onClick={() => {
                    followOrUnfollowUser(post?.author?._id)
                  }}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              ))}

            <Button variant="ghost" className="cursor-pointer w-fit">
              <TranslatableText text={"Add to favorites"} language={language} />
            </Button>
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="cursor-pointer w-fit"
              >
                <TranslatableText text={" Delete"} language={language} />
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="object-cover w-full my-2 rounded-md h-[450px] aspect-square"
        src={post?.image}
        alt="post_img"
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              onClick={likeOrDislikeHandler}
              size={"24"}
              className="text-red-600 cursor-pointer"
            />
          ) : (
            <FaRegHeart
              onClick={likeOrDislikeHandler}
              size={"22px"}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post))
              setOpen(true)
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        {isPostBookmarked ? (
          <Bookmark
            onClick={bookmarkHandler}
            className="text-black cursor-pointer hover:text-gray-600 fill-black"
          />
        ) : (
          <Bookmark
            onClick={bookmarkHandler}
            className="cursor-pointer hover:text-gray-600 "
          />
        )}
      </div>
      <span className="block mb-2 font-medium">
        {postLike} <TranslatableText text="likes" language={language} />
      </span>
      <p>
        <span className="mr-2 font-semibold">
          <TranslatableText text={post.author?.username} language={language} />
        </span>
        <span className="text-[15px]">
          <TranslatableText text={post?.caption} language={language} />
        </span>
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }}
          className="py-2 text-sm text-gray-400 cursor-pointer"
        >
          <TranslatableText text={"View all"} language={language} />{" "}
          {comment.length}{" "}
          <TranslatableText text={"comments"} language={language} />
        </span>
      )}
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between py-2">
        <input
          type="text"
          placeholder={commentStyle}
          value={text}
          onChange={changeEventHandler}
          className="w-full text-sm outline-none"
        />
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            <TranslatableText text={"Post"} language={language} />
          </span>
        )}
      </div>
    </div>
  )
}

export default Post
