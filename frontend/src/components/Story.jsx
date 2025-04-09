import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { readFileAsDataURL } from "@/lib/utils"
import { setStory } from "@/redux/storySlice"
import { Textarea } from "./ui/textarea"
import logo from "../assets/logo2.png"
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

  const createStoryHandler = async (e) => {
    const formData = new FormData()
    formData.append("caption", caption)
    if (imagePreview) formData.append("image", file)
    try {
      setLoading(true)
      const res = await axios.post(
        "http://localhost:3000/api/v1/story/add-story",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setStory([res.data.story, ...stories])) // [1] -> [1,2] -> total element = 2
        toast.success(res.data.message)
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
      setCaption("")
      setImagePreview("")
    }
  }

  const fetchAllStories = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/v1/story/all") // Update the endpoint URL if necessary
      if (response.data.success) {
        console.log("Fetched stories:", response.data.stories)
        return response.data.stories // Return the stories if needed
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      return null // Or handle the error in a way that fits your app
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
      <div className="REEL max-w-full h-28 pl-[28%] flex items-center gap-3 overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-400">
        <section
          className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full cursor-pointer"
          onClick={handleModal}
        >
          <Plus />
        </section>

        {allStories.map((story) => (
          <ReelSingle key={story._id} story={story} />
        ))}
      </div>

      {isModalOpen && (
        <>
          {/* //overlay */}
          <Dialog open={isModalOpen}>
            <DialogContent onInteractOutside={() => setIsModalOpen(false)}>
              <DialogHeader className="font-semibold text-center">
                Create New Story
              </DialogHeader>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="img" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xs font-semibold">{user?.username}</h1>
                  <span className="text-xs text-gray-600">Bio here...</span>
                </div>
              </div>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="border-none focus-visible:ring-transparent"
                placeholder="Write a caption..."
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
                Select from computer
              </Button>
              {imagePreview &&
                (loading ? (
                  <Button>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    onClick={createStoryHandler}
                    type="submit"
                    className="w-full"
                  >
                    Post
                  </Button>
                ))}
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}

const ReelSingle = ({ story }) => {
  return (
    <section className="w-16 h-16 p-[2px] bg-gradient-to-tr from-[#5bfec0] to-[#ca37f2] rounded-full cursor-pointer">
      <div className="w-full h-full bg-white dark:bg-black rounded-full flex items-center justify-center">
        <img
          src={story.media}
          alt="reel"
          className="w-14 h-14 rounded-full object-cover"
        />
      </div>
    </section>
  )
}
