import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import Suggested from "./Suggested"

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth)
  const navigate = useNavigate()

  return (
    <div className="mt-24 mb-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-[15px] text-gray-700">
          Work related suggestion
        </h1>
      </div>
      {suggestedUsers.slice(0, 5).map((user, userId) => (
        <Suggested user={user} key={userId} />
      ))}
    </div>
  )
}

export default SuggestedUsers
