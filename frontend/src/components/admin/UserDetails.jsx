"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import {
  Diamond,
  Bell,
  Edit,
  Heart,
  MessageCircle,
  Calendar,
  Mail,
  User,
  Shield,
  Loader2,
  LogOut,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { fetchAdminStats } from "@/redux/adminSlice"
import { setAuthUser } from "@/redux/authSlice"

export default function UserDetails() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState("posts")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [user, setUser] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/${id}`
        )
        setUser(res.data)
        console.log(res.data)
      } catch (err) {
        console.error("Failed to fetch user:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [id])

  const handleAdmin = async () => {
    try {
      setIsUpdating(true)
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/toggle-admin/${id}`
      )

      if (res.data.success) {
        toast.success(res.data.message)
      }
      dispatch(fetchAdminStats())
    } catch (error) {
      console.log(error)
    } finally {
      setIsUpdating(false)
    }
  }
  const handleDeleteUser = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/delete/${id}`
      )

      toast.success(res.data.message)
      dispatch(fetchAdminStats())
      navigate("/admin/user")
    } catch (error) {
      console.log(error)
    }
  }

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getJoinedDate = (createdAt) => {
    const joinDate = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - joinDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 30) {
      return `Joined ${diffDays} days ago`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `Joined ${months} month${months > 1 ? "s" : ""} ago`
    } else {
      const years = Math.floor(diffDays / 365)
      return `Joined ${years} year${years > 1 ? "s" : ""} ago`
    }
  }

  const getInitials = (username) => {
    return username?.substring(0, 2).toUpperCase()
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <Badge
            variant="outline"
            className="text-purple-700 border-purple-200 bg-purple-50"
          >
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "job seeker":
        return (
          <Badge
            variant="outline"
            className="text-blue-700 border-blue-200 bg-blue-50"
          >
            <User className="w-3 h-3 mr-1" />
            Job Seeker
          </Badge>
        )
      default:
        return (
          <Badge
            variant="outline"
            className="bg-slate-50 text-slate-700 border-slate-200"
          >
            <User className="w-3 h-3 mr-1" />
            User
          </Badge>
        )
    }
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    )
  if (!user)
    return (
      <div className="flex items-center justify-center w-full h-screen">
        User not found
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
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            User Details
          </h1>
          <p className="text-slate-600">Manage user information and actions</p>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500">
              {user.profilePicture ? (
                <img
                  src={user.profilePicture || "/placeholder.svg"}
                  alt={user.username}
                  className="object-cover w-full h-full"
                />
              ) : (
                <AvatarFallback className="text-2xl font-bold text-white">
                  {getInitials(user.username)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {user.username}
              </h2>
              <p className="text-slate-600">{getJoinedDate(user.createdAt)}</p>
              <div className="mt-2">{getRoleBadge(user.role)}</div>
            </div>
          </div>
        </div>

        {/* User Information */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  User ID
                </p>
                <p className="font-mono text-sm text-slate-800">{user._id}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Username
                </p>
                <p className="text-slate-800">{user.username}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">Email</p>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{user.email}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">Role</p>
                <p className="capitalize text-slate-800">{user.role}</p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">Bio</p>
                <p className="text-slate-800">
                  {user.bio || "No bio provided"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-slate-500">
                  Last Updated
                </p>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <p className="text-slate-800">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-4">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {user.posts?.length}
              </p>
              <p className="text-sm text-slate-600">Posts</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {user.followers?.length}
              </p>
              <p className="text-sm text-slate-600">Followers</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {user.following?.length}
              </p>
              <p className="text-sm text-slate-600">Following</p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-slate-800">
                {user.bookmarks?.length}
              </p>
              <p className="text-sm text-slate-600">Bookmarks</p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button
                variant="default"
                onClick={handleAdmin}
                className={`${
                  isUpdating ? "bg-gray-800 cursor-not-allowed" : null
                }`}
              >
                {user.role === "admin" ? "Remove Admin" : "Promote to Admin"}
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleDeleteUser}
              >
                Delete User
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Activity */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-800">
              User Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="posts">
              <TabsList className="mb-6">
                <TabsTrigger
                  value="posts"
                  isActive={activeTab === "posts"}
                  onClick={setActiveTab}
                >
                  Posts ({user.posts.length})
                </TabsTrigger>
                <TabsTrigger
                  value="comments"
                  isActive={activeTab === "comments"}
                  onClick={setActiveTab}
                >
                  Comments
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" activeValue={activeTab}>
                {user.posts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {user.posts.map((post) => (
                      <Card
                        key={post._id}
                        className="transition-shadow border-none shadow-md hover:shadow-lg"
                      >
                        <CardContent className="p-0">
                          {post.image && (
                            <div className="overflow-hidden rounded-t-lg aspect-square">
                              <img
                                src={post.image || "/placeholder.svg"}
                                alt={post.caption}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div className="p-4">
                            <p className="mb-3 text-slate-800">
                              {post.caption}
                            </p>
                            <div className="flex items-center justify-between text-sm text-slate-500">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes.length}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments.length}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="mb-6">
                      <img
                        src="/placeholder.svg?height=200&width=200"
                        alt="No posts illustration"
                        className="object-contain w-48 h-48 mx-auto"
                      />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-slate-800">
                      No Posts Yet
                    </h3>
                    <p className="mb-6 text-slate-600">
                      This user has not created any posts.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" activeValue={activeTab}>
                <div className="py-12 text-center">
                  <div className="mb-6">
                    <img
                      src="/placeholder.svg?height=200&width=200"
                      alt="No comments illustration"
                      className="object-contain w-48 h-48 mx-auto"
                    />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-slate-800">
                    No Comments Yet
                  </h3>
                  <p className="mb-6 text-slate-600">
                    This user has not made any comments.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
