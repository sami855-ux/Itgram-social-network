import Post from "./Post"
import { useSelector } from "react-redux"

const Posts = () => {
  const { posts } = useSelector((store) => store.post)
  return (
    <div>
      {posts && posts.length > 0
        ? posts.map((post) => <Post key={post._id} post={post} />)
        : null}
    </div>
  )
}

export default Posts
