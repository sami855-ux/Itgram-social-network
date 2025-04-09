import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth)
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-[15px] text-gray-700">
          Suggested for you
        </h1>
        <span className="font-medium cursor-pointer border border-transparent transition-all ease-in-out duration-150 hover:border-gray-200 rounded-2xl hover:bg-gray-200 py-1 px-4">
          See all
        </span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user?._id}`}>
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="text-sm font-semibold capitalize text-gray-800">
                  <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-[13px] text-gray-600">
                  Suggested for you
                </span>
              </div>
            </div>
            <span className="text-[#2da3f2] text-xs font-semibold cursor-pointer hover:text-[#3495d6]">
              Follow
            </span>
          </div>
        )
      })}
    </div>
  )
}

export default SuggestedUsers
