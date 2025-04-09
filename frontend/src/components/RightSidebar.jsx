import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import SuggestedUsers from "./SuggestedUsers"

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth)
  return (
    <div className="pr-32 my-10 w-fit">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h1 className="text-[15px] font-semibold capitalize">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-sm text-gray-600 capitalize">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  )
}

export default RightSidebar
