import { useLanguage } from "@/context/LanaguageContext"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { TranslatableText } from "@/utils/TranslatableText"

const Comment = ({ comment }) => {
  const { language } = useLanguage()

  return (
    <div className="my-2">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={comment?.author?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <h1 className="text-sm font-bold">
          <TranslatableText
            text={comment?.author.username}
            language={language}
          />{" "}
          <span className="pl-1 font-normal">
            <TranslatableText text={comment?.text} language={language} />
          </span>
        </h1>
      </div>
    </div>
  )
}

export default Comment
