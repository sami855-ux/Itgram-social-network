import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Loader2, Plus } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { TranslatableText } from "@/utils/TranslatableText"
import { useLanguage } from "@/context/LanaguageContext"
import { readFileAsDataURL } from "@/lib/utils"
import { setStory } from "@/redux/storySlice"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function Story() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [allStories, setAllStories] = useState([])
  const { user } = useSelector((store) => store.auth)
  const imageRef = useRef()
  const [file, setFile] = useState("")
  const [caption, setCaption] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(false)
  const { stories } = useSelector((store) => store.story)
  const { language } = useLanguage()
  const dispatch = useDispatch()

  const handleModal = () => {
    setIsModalOpen((curr) => !curr)
  }

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
    }
  }

  const createStoryHandler = async () => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)

    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/story/add-story`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setStory([res.data.story, ...stories]))
        toast.success(res.data.message)
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
      setCaption("")
      setImagePreview("")
    }
  }

  const fetchAllStories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/story/all`
      )
      if (response.data.success) {
        return response.data.stories
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      return null
    }
  }

  useEffect(() => {
    const loadStories = async () => {
      const fetchedStories = await fetchAllStories()
      if (fetchedStories) {
        setAllStories(fetchedStories)
      }
    }

    loadStories()
  }, [])

  return (
    <>
      <div className="max-w-full h-28 md:pl-[28%] flex items-center gap-4 overflow-x-auto scrollbar-hide">
        <section
          className="flex items-center justify-center w-16 h-16 transition bg-gray-200 rounded-full shadow cursor-pointer hover:bg-gray-300"
          onClick={handleModal}
        >
          <Plus className="text-gray-700" />
        </section>

        {allStories.slice(0, 7).map((story) => (
          <ReelSingle key={story._id} story={story} />
        ))}
      </div>

      {isModalOpen && (
        <Dialog open={isModalOpen}>
          <DialogContent
            onInteractOutside={() => setIsModalOpen(false)}
            className="p-6 space-y-4 bg-white shadow-xl sm:max-w-md rounded-xl"
          >
            <DialogHeader className="text-lg font-semibold text-center">
              <TranslatableText text="Create New Story" language={language} />
            </DialogHeader>

            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profilePicture} alt="img" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-sm font-medium">
                  <TranslatableText text={user?.username} language={language} />
                </h1>
                <span className="text-xs text-gray-500">
                  <TranslatableText text="Bio here..." language={language} />
                </span>
              </div>
            </div>

            <Textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="border border-gray-300 rounded-md focus-visible:ring-0 focus-visible:ring-transparent"
              placeholder="Write a caption..."
            />

            {imagePreview && (
              <div className="w-full overflow-hidden border border-gray-300 rounded-md h-60">
                <img
                  src={imagePreview}
                  alt="preview_img"
                  className="object-cover w-full h-full"
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
              className="w-full text-white bg-blue-600 hover:bg-blue-700"
            >
              <TranslatableText
                text="Select from computer"
                language={language}
              />
            </Button>

            {imagePreview &&
              (loading ? (
                <Button className="w-full" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <TranslatableText text="Please wait" language={language} />
                </Button>
              ) : (
                <Button
                  onClick={createStoryHandler}
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-green-700"
                >
                  <TranslatableText text="Post" language={language} />
                </Button>
              ))}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

const ReelSingle = ({ story }) => {
  return (
    <Link to={`/story/${story?._id}`}>
      <section className="w-[77px] h-[77px] p-[2px] bg-gradient-to-tr from-[#5bfec0] to-[#ca37f2] rounded-full cursor-pointer hover:scale-105 transition-transform duration-200 shadow-md">
        <div className="flex items-center justify-center w-full h-full bg-white rounded-full dark:bg-black">
          <img
            src={story?.media}
            alt="reel"
            className="object-cover w-16 h-16 rounded-full"
          />
        </div>
      </section>
    </Link>
  )
}
