"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Pagination } from "../ui/pagination"
import {
  Diamond,
  Bell,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Building,
  Clock,
  Tag,
  Loader2,
  LogOut,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"
import { toast } from "sonner"

export default function Jobs() {
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 6
  const { stats, loading } = useSelector((state) => state.admin)
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()

  // Calculate pagination
  const totalJobs = jobs.length
  const totalPages = Math.ceil(totalJobs / jobsPerPage)
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = jobs.slice(startIndex, endIndex)

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

  const handleJobClick = (jobId) => {
    // In a real app, this would use router navigation
    navigate(`/admin/job/detail/${jobId}`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatSalary = (salaryRange) => {
    return `$${salaryRange.min.toLocaleString()} - $${salaryRange.max.toLocaleString()}`
  }

  const getEmploymentTypeBadge = (type) => {
    const badges = {
      fulltime: "bg-emerald-50 text-emerald-700 border-emerald-200 capitalize",
      parttime: "bg-blue-50 text-blue-700 border-blue-200 capitalize",
      contract: "bg-amber-50 text-amber-700 border-amber-200 capitalize",
      internship: "bg-purple-50 text-purple-700 border-purple-200 capitalize",
    }
    return (
      badges[type] || "bg-slate-50 text-slate-700 border-slate-200 capitalize"
    )
  }

  const getCategoryColor = (category) => {
    const colors = {
      Programming: "bg-blue-100 text-blue-800",
      Design: "bg-pink-100 text-pink-800",
      Marketing: "bg-green-100 text-green-800",
      Sales: "bg-yellow-100 text-yellow-800",
      Management: "bg-purple-100 text-purple-800",
    }
    return colors[category] || "bg-slate-100 text-slate-800"
  }

  const getInitials = (username) => {
    return username.substring(0, 2).toUpperCase()
  }

  const isDeadlineNear = (deadline) => {
    const deadlineDate = new Date(deadline)
    const now = new Date()
    const diffTime = deadlineDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0
  }

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) < new Date()
  }

  useEffect(() => {
    setJobs(stats?.jobs)
  }, [stats])

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
            <Link to="/admin/user" className="font-medium text-slate-800">
              Users
            </Link>
            <Link
              to="/admin/jobs"
              className="pb-1 transition-colors border-b-2 border-teal-500 text-slate-600 hover:text-slate-800"
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
          <h1 className="mb-2 text-3xl font-bold text-slate-800">Jobs</h1>
          <p className="text-slate-600">Manage job postings and applications</p>
          <div className="flex items-center mt-4 space-x-4 text-sm text-slate-600">
            <span>Total Jobs: {totalJobs}</span>
            <span>•</span>
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
          {currentJobs.map((job) => (
            <Card
              key={job._id}
              className="transition-all transform border-none shadow-lg cursor-pointer hover:shadow-xl hover:-translate-y-1"
              onClick={() => handleJobClick(job._id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <CardTitle className="mb-1 text-lg font-bold text-slate-800 line-clamp-2">
                      {job.jobTitle}
                    </CardTitle>
                    <div className="flex items-center mb-2 space-x-2">
                      <Building className="w-4 h-4 text-slate-400" />
                      <p className="font-medium text-slate-600">
                        {job.companyName}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getEmploymentTypeBadge(job.employmentType)}
                  >
                    {job.employmentType}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(job.category)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {job.category}
                  </Badge>
                  {isDeadlineNear(job.deadline) && (
                    <Badge
                      variant="outline"
                      className="text-orange-700 border-orange-200 bg-orange-50"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                  {isDeadlinePassed(job.deadline) && (
                    <Badge
                      variant="outline"
                      className="text-red-700 border-red-200 bg-red-50"
                    >
                      Expired
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {job.city}, {job.country}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
                    {formatSalary(job.salaryRange)}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    Posted {formatDate(job.createdAt)}
                  </div>

                  {/* Skills Preview */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.skillsRequired.slice(0, 2).map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {job.skillsRequired.length > 2 && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-slate-50 text-slate-700 border-slate-200"
                      >
                        +{job.skillsRequired.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Recruiter Info */}
                  <div className="flex items-center pt-2 space-x-2 border-t border-slate-100">
                    <Avatar className="w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-500">
                      {job.author.profilePicture ? (
                        <img
                          src={job.author.profilePicture || "/placeholder.svg"}
                          alt={job.author.username}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <AvatarFallback className="text-xs text-white">
                          {getInitials(job.author.username)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-xs text-slate-500">
                      by {job.author.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-slate-600">
                      <Users className="w-4 h-4 mr-2 text-slate-400" />
                      {job.applicants.length} applicant
                      {job.applicants.length !== 1 ? "s" : ""}
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Empty State */}
        {jobs.length === 0 && (
          <div className="py-12 text-center">
            <div className="mb-6">
              <img
                src="/placeholder.svg?height=200&width=200"
                alt="No jobs illustration"
                className="object-contain w-48 h-48 mx-auto"
              />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-slate-800">
              No Jobs Posted Yet
            </h3>
            <p className="mb-6 text-slate-600">
              There are currently no job postings available.
            </p>
            <Button variant="outline">Refresh</Button>
          </div>
        )}
      </main>
    </div>
  )
}
