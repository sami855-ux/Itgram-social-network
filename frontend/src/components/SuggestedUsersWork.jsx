import { useEffect, useState } from "react"
import axios from "axios"

import Suggested from "./Suggested"
import { TranslatableText } from "@/utils/TranslatableText"
import { useLanguage } from "@/context/LanaguageContext"
import Empty from "./Empty"

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const { language } = useLanguage()

  const getRecruiters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/getRecruiters`,
        { withCredentials: true }
      )
      if (response.data.success) {
        setSuggestedUsers(response.data.user.slice(0, 6))
      }
    } catch (error) {
      console.error("Error fetching recruiters:", error)
      throw error
    }
  }

  useEffect(() => {
    getRecruiters()
  }, [])

  return (
    <div className="mt-24 mb-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-[15px] text-gray-800">
          <TranslatableText text={"Suggested for Work"} language={language} />
        </h1>
      </div>
      {suggestedUsers && suggestedUsers.length > 0 ? (
        suggestedUsers
          .slice(0, 5)
          .map((user, userId) => <Suggested user={user} key={userId} />)
      ) : (
        <Empty type="default" />
      )}
    </div>
  )
}

export default SuggestedUsers
