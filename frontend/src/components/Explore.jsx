import { FaRegHeart } from "react-icons/fa"
import { MessageCircle } from "lucide-react"
import { useSelector } from "react-redux"

import image from "../assets/backgroundone.png"
import { useState } from "react"

export default function Explore() {
  const { posts } = useSelector((store) => store.post)
  return (
    <div className="w-full min-h-screen pl-[20%] py-10 pr-7">
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-3 justify-items-center">
        {posts.map((post, postId) => (
          <SingleImage key={postId} post={post} />
        ))}
      </div>
    </div>
  )
}

const SingleImage = ({ post }) => {
  const [onHover, setOnHover] = useState(false)
  return (
    <div
      className="w-[100%] h-72 bg-gray-200   relative"
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <img src={post.image} alt="" className="w-full h-full overflow-hidden " />
      <section
        className={`${
          onHover ? "opacity-100" : "opacity-0"
        } absolute top-0 left-0 flex items-center justify-center w-full h-full gap-4 bg-gray-800/50  transition-all ease-in-out duration-200 cursor-pointer`}
      >
        <FaRegHeart className="text-white" size={35} />
        <MessageCircle className="text-white" size={35} />
      </section>
    </div>
  )
}
