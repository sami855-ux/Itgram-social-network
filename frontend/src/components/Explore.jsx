import { Heart, MessageCircle } from "lucide-react"
import { useSelector } from "react-redux"

export default function Explore() {
  const { posts } = useSelector((store) => store.post)

  return (
    <div className="w-full min-h-screen pl-[5%] md:pl-[20%] py-10 pr-7">
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 justify-items-center">
        {posts.map((post, postId) => (
          <SingleImage key={postId} post={post} />
        ))}
      </div>
    </div>
  )
}

const SingleImage = ({ post }) => {
  return (
    <div key={post?._id} className="relative cursor-pointer group  md:h-96">
      <img
        src={post.image}
        alt="postimage"
        className="object-cover w-full my-2 rounded-sm aspect-square"
      />
      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 h-full w-full">
        <div className="flex items-center space-x-4 text-white">
          <button className="flex items-center gap-2 hover:text-gray-300">
            <Heart />
            <span>{post?.likes.length}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-gray-300">
            <MessageCircle />
            <span>{post?.comments.length}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
