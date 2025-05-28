import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import {
  Diamond,
  Users,
  Briefcase,
  CheckCircle,
  UserCheck,
  Bell,
  Loader2,
  LogOut,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"
import { setSelectedPost } from "@/redux/postSlice"
import { toast } from "sonner"

export default function Dashboard() {
  const { stats, loading } = useSelector((state) => state.admin)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setAuthUser(null))

        navigate("/login")
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )

  return (
    <div className="min-h-screen bg-slate-50 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 px-6 py-4 bg-white border-b shadow-sm border-slate-200">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500">
              <Diamond className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">ITGram</span>
          </div>

          <nav className="items-center space-x-8 md:flex">
            <a
              href="#"
              className="pb-1 font-medium border-b-2 border-teal-500 text-slate-800"
            >
              Dashboard
            </a>
            <Link
              to="/admin/user"
              className="transition-colors text-slate-600 hover:text-slate-800"
            >
              Users
            </Link>
            <Link
              to="/admin/jobs"
              className="transition-colors text-slate-600 hover:text-slate-800"
            >
              Jobs
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              className="relative p-2 transition-colors text-slate-600 hover:text-teal-500"
              onClick={logoutHandler}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8 mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-slate-800">Dashboard</h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3 ">
          {[
            {
              title: "Total Users",
              value: stats?.totalUsers,
              icon: <Users className="w-8 h-8 text-white" />,
              color: "from-blue-600 to-blue-400",
            },
            {
              title: "Posted Images",
              value: stats?.totalPosts,
              icon: <Briefcase className="w-8 h-8 text-white" />,
              color: "from-emerald-600 to-emerald-400",
            },
            {
              title: "Posted Jobs",
              value: stats?.totalJobs,
              icon: <CheckCircle className="w-8 h-8 text-white" />,
              color: "from-violet-600 to-violet-400",
            },
          ].map((metric, index) => (
            <Card
              key={index}
              className="overflow-hidden transition-shadow border-gray-200 shadow-lg hover:shadow-xl"
            >
              <CardContent className="p-0 ">
                <div className="flex items-stretch">
                  <div
                    className={`bg-gradient-to-br ${metric.color} p-6 flex items-center justify-center`}
                  >
                    {metric.icon}
                  </div>
                  <div className="flex-1 p-6 bg-white">
                    <p className="text-sm font-medium text-slate-500">
                      {metric.title}
                    </p>
                    <p className="mt-1 text-3xl font-bold text-slate-800">
                      {metric.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="overflow-hidden border-none shadow-lg">
          <CardHeader className="px-6 py-5 bg-white border-b border-slate-100">
            <CardTitle className="text-xl font-bold text-slate-800">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats?.recentActions.length > 0 ? (
                    stats?.recentActions.map((activity, index) => (
                      <tr
                        key={index}
                        className="transition-colors hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar
                              className={`h-8 w-8 ${
                                index % 3 === 0
                                  ? "bg-blue-500"
                                  : index % 3 === 1
                                  ? "bg-emerald-500"
                                  : "bg-violet-500"
                              }`}
                            >
                              <AvatarFallback className="text-xs text-white">
                                {activity.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-800">
                              {activity.user}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {activity.jobTitle}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="outline"
                            className={
                              activity.status === "Accepted"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            }
                          >
                            {activity.status === "Accepted" ? (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                <span>{activity.status}</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Briefcase className="w-3 h-3 mr-1" />
                                <span>{activity.status}</span>
                              </div>
                            )}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {activity.date}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <p className="text-gray-700 py-7 px-7">
                      There is no recent action yet
                    </p>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
