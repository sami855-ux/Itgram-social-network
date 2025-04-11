import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  MoreHorizontal,
} from "lucide-react"
import axios from "axios"

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { FaRegHeart } from "react-icons/fa"

export default function StoryViewer() {
  const { user } = useSelector((store) => store.auth)
  const [allStories, setAllStories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState(0)

  const { storyId } = useParams()
  const navigate = useNavigate()

  const fetchAllStories = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/story/all`
      )
      if (response.data.success) {
        console.log("Fetched stories:", response.data.stories)
        return response.data.stories
      }
    } catch (error) {
      console.error("Error fetching stories:", error)
      return null
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const loadStories = async () => {
      const fetchedStories = await fetchAllStories()
      if (fetchedStories) {
        setAllStories(fetchedStories)

        const indexFind = fetchedStories.findIndex(
          (story) => story._id === storyId
        )
        setIndex(indexFind)
      }
      setIsLoading(false)
    }

    loadStories()
  }, [])

  const handleNext = () => {
    setIndex((curr) => (curr === allStories.length - 1 ? 0 : curr + 1))
  }

  const handlePrev = () => {
    setIndex((curr) => (curr === 0 ? allStories.length - 1 : curr - 1))
  }

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-100">
      <span
        className="absolute cursor-pointer top-5 left-10 hover:text-gray-700"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      </span>
      <span
        className="absolute w-10 h-10 border border-gray-300  rounded-full flex justify-center items-center cursor-pointer top-[50%] left-[20%]  hover:bg-gray-600 hover:text-gray-300"
        onClick={handlePrev}
      >
        <ChevronLeft size={25} />
      </span>
      <span
        className="absolute w-10 h-10 border border-gray-300  rounded-full flex justify-center items-center cursor-pointer top-[50%] right-[20%] hover:bg-gray-600  hover:text-gray-300"
        onClick={handleNext}
      >
        <ChevronRight />
      </span>

      {isLoading === true ? (
        <div className="">Spinner</div>
      ) : (
        <div
          className="w-96 h-[90vh] bg-gray-300 rounded-2xl relative"
          key={allStories[index]?._id}
        >
          <img
            src={allStories[index]?.media}
            alt="story image"
            className="absolute z-10 object-cover w-full h-full rounded-2xl"
          />
          <div className="relative z-20 flex items-center justify-between w-full h-16 px-5 py-1 bg-gray-400/25 rounded-t-2xl">
            <section className="flex items-center h-full gap-4">
              <img
                src={allStories[index]?.author?.profilePicture}
                alt="user image"
                className="w-12 h-12 rounded-full"
              />
              <p className="font-semibold text-white capitalize">
                {allStories[index]?.author?.username}
              </p>
              <span className="text-[14px] text-white pt-1">
                {getTimeAgo(allStories[index]?.createdAt)}
              </span>
            </section>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal
                  className="text-white cursor-pointer"
                  size={30}
                />
              </DialogTrigger>
              <DialogContent className="flex flex-col items-center text-sm text-center">
                {allStories[index]?.author?._id !== user?._id && (
                  <Button
                    variant="ghost"
                    className="cursor-pointer w-fit text-[#ED4956] font-bold"
                  >
                    Unfollow
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="text-red-600 cursor-pointer w-fit"
                >
                  Report Inappropriate
                </Button>
                <Button variant="ghost" className="cursor-pointer w-fit">
                  About this content
                </Button>
                {user && user?._id === allStories[index]?.author._id && (
                  <Button
                    // onClick={deletePostHandler}
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
              <FaRegHeart
                size={"25px"}
                className="text-white cursor-pointer hover:text-gray-200"
              />

              <MessageCircle
                size={"25px"}
                className="text-white cursor-pointer hover:text-gray-200"
              />
            </section>
          </div>
        </div>
      )}
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
