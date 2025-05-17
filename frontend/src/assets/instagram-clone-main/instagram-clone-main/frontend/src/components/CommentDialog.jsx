import { useDispatch, useSelector } from "react-redux"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import axios from "axios"

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { setPosts } from "@/redux/postSlice"
import { Button } from "./ui/button"
import Comment from "./Comment"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("")
  const { selectedPost, posts } = useSelector((store) => store.post)
  const [comment, setComment] = useState([])
  const { language } = useLanguage()
  const [commentStyle] = useState(
    language === "am" ? "አስተያየት ይስቱ" : "Add comments"
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments)
    }
  }, [selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText("")
    }
  }

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post/${
          selectedPost?._id
        }/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment]
        setComment(updatedCommentData)

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res.data.message)
        setText("")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="flex flex-col max-w-5xl p-0"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="object-cover w-full h-full rounded-l-lg"
            />
          </div>
          <div className="flex flex-col justify-between w-1/2">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-xs font-semibold">
                    <TranslatableText
                      text={selectedPost?.author?.username}
                      language={language}
                    />
                  </Link>
                </div>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    <TranslatableText text={"Unfollow"} language={language} />
                  </div>
                  <div className="w-full cursor-pointer">
                    <TranslatableText text="Unfollow" language={language} />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 p-4 overflow-y-auto max-h-96">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder={commentStyle}
                  className="w-full p-2 text-sm border border-gray-300 rounded outline-none"
                />
                <Button
                  disabled={!text.trim()}
                  onClick={sendMessageHandler}
                  variant="outline"
                >
                  <TranslatableText text={"Send"} language={language} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog
