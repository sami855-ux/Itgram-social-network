import { useState, useMemo } from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Input } from "../ui/input"
import { Pagination } from "../ui/pagination"
import { Diamond, Search, Bell, Loader2, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"
import { toast } from "sonner"

export default function Users() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const { stats, loading } = useSelector((state) => state.admin)

  const users = stats?.users || []

  const dispatch = useDispatch()

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
  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    console.log(stats)
    if (!searchTerm) return users
    const term = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
    )
  }, [users, searchTerm])

  // Paginate users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredUsers, currentPage])

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
      "bg-indigo-500",
    ]
    return colors[index % colors.length]
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
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
            <Link
              to="/admin"
              className="transition-colors text-slate-600 hover:text-slate-800"
            >
              Dashboard
            </Link>
            <Link
              to="/admin/user"
              className="pb-1 font-medium border-b-2 border-teal-500 text-slate-800"
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
        <div className="flex flex-col justify-between mb-8 space-y-4 md:flex-row md:items-center md:space-y-0">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-slate-800">Users</h1>
            <p className="text-slate-600">
              Manage user accounts and permissions
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <Input
              placeholder="Search users..."
              className="pl-10 bg-white border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
            />
          </div>
        </div>

        <Card className="overflow-hidden border shadow-sm border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      User
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Email
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Role
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {paginatedUsers.map((user, index) => (
                    <tr
                      key={user._id || index}
                      className="transition-colors cursor-pointer hover:bg-slate-50"
                      onClick={() => navigate(`/admin/user/${user._id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar
                            className={`h-10 w-10 ${getAvatarColor(index)}`}
                          >
                            {user?.profilePicture ? (
                              <AvatarImage
                                src={user.profilePicture}
                                alt={user.username}
                              />
                            ) : (
                              <AvatarFallback className="text-sm font-medium text-white">
                                {getInitials(user.username)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-slate-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800 capitalize"
                              : user.role === "recruiter"
                              ? "bg-blue-100 text-blue-800 capitalize"
                              : "bg-amber-100 text-amber-800 capitalize"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center bg-white border rounded-lg shadow-sm border-slate-200">
            <Search className="w-12 h-12 mx-auto text-slate-400" />
            <h3 className="mt-2 text-lg font-medium text-slate-900">
              No users found
            </h3>
            <p className="mt-1 text-slate-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)}
            </span>{" "}
            of <span className="font-medium">{filteredUsers.length}</span>{" "}
            results
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
    </div>
  )
}
