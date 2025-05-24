import { Outlet } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { fetchNotifications } from "@/redux/notification"

const MainLayout = () => {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchNotifications(user._id))
  }, [dispatch, user._id])

  return (
    <div>
      <LeftSidebar />
      <div>
        <Outlet />
      </div>
    </div>
  )
}

export default MainLayout
