import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import RightSidebar from "./RightSidebar"
import useGetAllPost from "@/hooks/useGetAllPost"
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers"
import Feed from "./Feed"
import Story from "./Story"
import LanguageSelector from "./LanguageSelector"

export default function Home() {
  useGetAllPost()
  useGetSuggestedUsers()

  return (
    <div className="relative flex min-h-screen">
      {/* Mobile Menu Overlay */}

      {/* Main Content */}
      <div className="flex-grow w-[330px]">
        <Story />
        <div className="items-center justify-center hidden w-full gap-3 px-16 py-2 border-b border-gray-200 md:flex h-fit md:hidden">
          <LanguageSelector />
        </div>
        <Feed />
        <Outlet />
      </div>
      <RightSidebar />
    </div>
  )
}
