import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { readFileAsDataURL } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setPosts } from "@/redux/postSlice"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const { posts } = useSelector((store) => store.post)
  const { language } = useLanguage()
  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)

    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/post/addpost`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts])) // [1] -> [1,2] -> total element = 2
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (error) {
      console.log(error.response.data.message)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
      setCaption("")
      setImagePreview("")
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="font-semibold text-center">
          <TranslatableText text={"Create New Post"} language={language} />
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xs font-semibold">
              <TranslatableText text={user?.username} language={language} />
            </h1>
            <span className="text-xs text-gray-600">
              <TranslatableText text={"Bio here..."} language={language} />
            </span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border-none focus-visible:ring-transparent"
          placeholder={language == "am" ? "መግለጫ ጣፍ" : "Write a caption..."}
        />
        {imagePreview && (
          <div className="flex items-center justify-center w-full h-64">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
        >
          <TranslatableText text={"Select from computer"} language={language} />
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <TranslatableText text={" Please wait..."} language={language} />
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              <TranslatableText text={"Post"} language={language} />
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
