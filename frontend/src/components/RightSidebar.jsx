import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import SuggestedUsersWork from "./SuggestedUsersWork"
import SuggestedUsers from "./SuggestedUsers"
import person from "@/assets/person.png"

const sliceText = (string) => {
  const sliceString = string.slice(0, 20)

  return sliceString + "..."
}

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth)
  return (
    <div className="hidden pr-24 my-10 w-[420px] lg:block">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-16 h-16">
            <AvatarImage src={user?.profilePicture} alt="profile_picture" />
            <AvatarFallback>
              {/* Default image or fallback */}
              <img src={person} alt="default_image" />
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="text-[15px] font-semibold capitalize">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-sm text-gray-600 capitalize">
            {sliceText(user?.bio) || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
      <SuggestedUsersWork />
    </div>
  )
}

export default RightSidebar
