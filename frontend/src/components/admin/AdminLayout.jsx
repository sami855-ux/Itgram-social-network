import { fetchAdminStats } from "@/redux/adminSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAdminStats())
  }, [dispatch])

  return (
    <div className="w-full">
      <Outlet />
    </div>
  )
}
