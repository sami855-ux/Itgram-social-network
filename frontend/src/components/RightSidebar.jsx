import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { TranslatableText } from "@/utils/TranslatableText"
import SuggestedUsersWork from "./SuggestedUsersWork"
import SuggestedUsers from "./SuggestedUsers"
import person from "@/assets/person.png"
import LanguageSelector from "./LanguageSelector"
import { useLanguage } from "@/context/LanaguageContext"

const sliceText = (string) => {
  const sliceString = string.slice(0, 20)

  return sliceString + "..."
}

const RightSidebar = () => {
  const { language } = useLanguage()
  const { user } = useSelector((store) => store.auth)
  return (
    <div className="hidden pr-24 my-10 w-[420px] lg:block">
      <LanguageSelector />
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
            <Link to={`/profile/${user?._id}`}>
              <TranslatableText text={user?.username} language={language} />
            </Link>
          </h1>
          <span className="text-sm text-gray-600 capitalize">
            {(
              <TranslatableText
                text={sliceText(user?.bio)}
                language={language}
              />
            ) || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
      <SuggestedUsersWork />
    </div>
  )
}

export default RightSidebar
