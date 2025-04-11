import { Outlet } from "react-router-dom"

import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"
import Feed from "./Feed"
import Story from "./Story"

const Home = () => {
  useGetAllPost()
  useGetSuggestedUsers()

  return (
    <div className="flex">
      <div className="flex-grow w-[400px]">
        <div className="flex items-center justify-between w-full h-16 gap-3 px-16 py-2 border-b border-gray-200 md:hidden">
          <h2 className="text-2xl text-semibold">Itgram</h2>
          <input
            type="text"
            placeholder="Search..."
            className="h-10 px-3 border border-gray-300 outline-none w-66 rounded-2xl"
          />
        </div>
        <Story />
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
