import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react"
import axios from "axios"

import EachStory from "./EachStory"

export default function StoryViewer() {
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
        return response.data.stories
      }
    } catch (error) {
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
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-gray-200">
      <span
        className="absolute cursor-pointer top-5 right-10 hover:text-gray-700"
        onClick={() => navigate(-1)}
      >
        <X />
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
        <div className="">
          <Loader2 className="w-14 h-14 animate-spin" />
        </div>
      ) : (
        <EachStory story={allStories[index]} />
      )}
    </div>
  )
}
