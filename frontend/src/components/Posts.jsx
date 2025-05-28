import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Post from "./Post"
import Empty from "./Empty"

const Loader = () => (
  <div className="flex items-center justify-center h-40">
    <div className="w-10 h-10 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
)

const Posts = () => {
  const { posts } = useSelector((store) => store.post)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {posts && posts.length > 0 ? (
        posts.map((post) => <Post key={post._id} post={post} />)
      ) : (
        <Empty type="post" />
      )}
    </div>
  )
}

export default Posts
