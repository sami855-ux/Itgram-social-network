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
        <Story />
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home
