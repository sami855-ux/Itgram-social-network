import { useSelector } from "react-redux"

import image from "../assets/person.png"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Loader2 } from "lucide-react"

export default function ExplorePeople() {
  const { suggestedUsers } = useSelector((store) => store.auth)
  return (
    <div className="w-full min-h-screen pl-[20%] py-10 pr-7 flex flex-col items-center gap-4">
      <div className="w-full py-1">
        <h1 className="">Suggested</h1>
      </div>

      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers.map((user, userId) => (
          <SingleUser key={userId} user={user} />
        ))
      ) : (
        <p className="text-gray-700 text-[15px]">There is no user to suggest</p>
      )}
    </div>
  )
}

const SingleUser = ({ user }) => {
  return (
    <section className="h-20  w-[600px] flex items-center justify-between px-2">
      <div className="flex items-center h-full gap-3 w-fit">
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="post_image" />
          <AvatarFallback>
            {/* Default image or fallback */}
            <img src={image} alt="default_image" />
          </AvatarFallback>
        </Avatar>
        <section className="flex flex-col justify-center h-full w-fit ">
          <h2 className="font-semibold text-[15px] capitalize">
            {user.username}
          </h2>
          <p className="text-gray-700 text-[14px]">{user?.bio}</p>
          <p className="text-gray-700 text-[14px]">suggested for you</p>
        </section>
      </div>
      {/* <button className="px-6 py-1 text-white bg-blue-600 border border-blue-600 rounded-lg">
        Follow
      </button> */}
      <Button className="bg-blue-600 px-7">
        {/* <Loader2 className="w-4 h-4 mr-2 animate-spin" /> */}
        Follow
      </Button>
    </section>
  )
}
