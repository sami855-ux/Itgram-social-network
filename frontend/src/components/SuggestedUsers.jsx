import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Suggested from "./Suggested"

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth)
  const navigate = useNavigate()

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-[15px] text-gray-800">
          Suggested for you
        </h1>
        <span
          onClick={() => {
            navigate("/explore/people")
          }}
          className="px-4 py-1 font-medium transition-all duration-150 ease-in-out border border-transparent cursor-pointer hover:border-gray-200 rounded-2xl hover:bg-gray-200"
        >
          See all
        </span>
      </div>
      {suggestedUsers.slice(0, 5).map((user, userId) => (
        <Suggested user={user} key={userId} />
      ))}
    </div>
  )
}

export default SuggestedUsers
