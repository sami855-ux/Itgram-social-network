"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import { Modal } from "../ui/modal"
import {
  Diamond,
  Bell,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Download,
  Eye,
  Check,
  X,
  FileText,
  Loader2,
  LogOut,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { setAuthUser } from "@/redux/authSlice"
import { toast } from "sonner"

export default function JobDetails() {
  const { id } = useParams()
  const [selectedResume, setSelectedResume] = useState(null)
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState([])
  const { stats, loading } = useSelector((store) => store.admin)

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

  const getInitials = (name) => {
    return name
      ?.split(" ")
      ?.map((n) => n[0])
      ?.join("")
      ?.toUpperCase()
  }

  const getAvatarColor = (index) => {
    const colors = [
      "bg-blue-500",
      "bg-emerald-500",
      "bg-violet-500",
      "bg-amber-500",
      "bg-rose-500",
    ]
    return colors[index % colors.length]
  }

  useEffect(() => {
    const data = stats?.jobs.filter((data) => data?._id === id)
    setSelectedJob(data[0])
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
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-slate-600">
            <a href="#" className="hover:text-teal-500">
              Jobs
            </a>
            <span className="mx-2">/</span>
            <span className="text-slate-800">{selectedJob.jobTitle}</span>
          </nav>
        </div>

        {/* Job Information */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="mb-2 text-2xl font-bold text-slate-800">
                  {selectedJob.jobTitle}
                </CardTitle>
                <p className="text-lg font-medium text-slate-600">
                  {selectedJob.companyName}
                </p>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-50 text-emerald-700 border-emerald-200"
              >
                Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
              <div className="flex items-center text-slate-600">
                <MapPin className="w-5 h-5 mr-3 text-slate-400" />
                <span>{selectedJob.city}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <DollarSign className="w-5 h-5 mr-3 text-slate-400" />
                <span>{selectedJob?.salaryRange?.max}</span>-
                <span>{selectedJob?.salaryRange?.min}</span>
              </div>
              <div className="flex items-center text-slate-600">
                <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                <span>
                  Posted: {new Date(selectedJob.createdAt).toDateString()}
                </span>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-slate-800">
                Job Description
              </h3>
              <p className="leading-relaxed text-slate-600">
                {selectedJob.jobDescription}
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">
                Requirements
              </h3>
              <ul className="space-y-1 list-disc list-inside text-slate-600">
                {selectedJob?.skillsRequired?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Applicants */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-slate-800">
                Applicants ({selectedJob?.applicants?.length})
              </CardTitle>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4" />
                <span>
                  {
                    selectedJob?.applicants?.filter(
                      (a) => a.status === "Pending"
                    ).length
                  }{" "}
                  pending review
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-slate-50 border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-left text-slate-500">
                      Resume
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedJob?.applicants?.map((applicant, index) => (
                    <tr
                      key={applicant.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar
                            className={`h-10 w-10 ${getAvatarColor(index)}`}
                          >
                            <AvatarFallback className="text-sm font-medium text-white">
                              {getInitials(applicant.user?.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {applicant.user?.username}
                            </p>
                            <p className="text-sm text-slate-600">
                              {applicant.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="text-[15px] text-gray-800">
                          {new Date().toDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewResume(applicant)}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Resume</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Modal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        title={
          selectedResume
            ? `${selectedResume?.user?.username}'s Resume`
            : "Resume"
        }
        className="max-w-4xl"
      >
        {selectedResume && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className={`h-12 w-12 ${getAvatarColor(0)}`}>
                  <AvatarFallback className="font-medium text-white">
                    {getInitials(selectedResume?.user?.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {selectedResume?.user?.username}
                  </h3>
                  <p className="text-slate-600">
                    {selectedResume?.user?.email}
                  </p>
                </div>
              </div>
            </div>

            <div className=" border rounded-lg w-[90%] h-96 border-slate-200 bg-slate-50 ">
              <img
                src={selectedResume.resume}
                alt=""
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
