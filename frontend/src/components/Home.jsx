import { Outlet } from "react-router-dom"

import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"
import Feed from "./Feed"
import Story from "./Story"
import LanguageSelector from "./LanguageSelector"

const Home = () => {
  useGetAllPost()
  useGetSuggestedUsers()

  return (
    <div className="flex">
      <div className="flex-grow w-[330px]">
        <div className="flex items-center justify-center w-full gap-3 px-16 py-2 border-b border-gray-200 h-fit md:hidden">
          <p className="text-xl font-semibold">ItGram</p>
        </div>
        <Story />
        <div className="flex items-center justify-center w-full gap-3 px-16 py-2 border-b border-gray-200 h-fit md:hidden">
          <LanguageSelector />
        </div>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
