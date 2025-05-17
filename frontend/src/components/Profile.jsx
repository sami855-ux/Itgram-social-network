import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  AtSign,
  BadgeDollarSign,
  CalendarCheck,
  Clock,
  Heart,
  Loader,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  Send,
  X,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import useGetUserProfile from "@/hooks/useGetUserProfile"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import person from "../assets/person.png"
import koala from "../assets/koala.png"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { toast } from "sonner"
import { Input } from "./ui/input"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"

const Profile = () => {
  const params = useParams()
  const userId = params.id

  useGetUserProfile(userId)

  const [activeTab, setActiveTab] = useState("posts")
  const [follow, setFollow] = useState(false)
  const [postedJob, setPostedJob] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [unapplyOpen, setUnapplyOpen] = useState(false)
  const [jobId, setJobId] = useState("")
  const [appliedJobs, setAppliedJobs] = useState([])
  const [editOpen, setEditOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [enterdSkill, setEnterdSkill] = useState("")
  const [editedJob, setEditedJob] = useState([])
  const [editLoading, setEditLoading] = useState(false)
  const [resumeOpen, setResumeOpen] = useState(false)
  const [resume, setResume] = useState("")
  const navigate = useNavigate()

  const { userProfile, user } = useSelector((store) => store.auth)
  const isLoggedInUserProfile = user?._id === userProfile?._id
  const { language } = useLanguage()

  const [jobInput, setJobInput] = useState({
    jobTitle: "",
    role: "",
    category: "",
    jobDescription: "",
    employmentType: "",
    jobPlacement: "",
    jobExperience: "",
    companyName: "",
    city: "",
    country: "",
    skills: [],
    salary: {
      max: 0,
      min: 0,
    },
    deadline: "",
  })

  const handleChange = (e) => {
    const name = e.target.name

    switch (name) {
      case "job title":
        setJobInput({ ...jobInput, jobTitle: e.target.value })
        break
      case "role":
        setJobInput({ ...jobInput, role: e.target.value })
        break
      case "category":
        setJobInput({ ...jobInput, category: e.target.value })
        break
      case "job description":
        setJobInput({ ...jobInput, jobDescription: e.target.value })
        break
      case "Job placement":
        setJobInput({ ...jobInput, jobPlacement: e.target.value })
        break
      case "Job experience":
        setJobInput({ ...jobInput, jobExperience: e.target.value })
        break
      case "company name":
        setJobInput({ ...jobInput, companyName: e.target.value })
        break
      case "city":
        setJobInput({ ...jobInput, city: e.target.value })
        break
      case "country":
        setJobInput({ ...jobInput, country: e.target.value })
        break
      case "max salary":
        setJobInput({
          ...jobInput,
          salary: { ...jobInput.salary, max: parseInt(e.target.value) },
        })
        break
      case "min salary":
        setJobInput({
          ...jobInput,
          salary: { ...jobInput.salary, min: parseInt(e.target.value) },
        })
        break
      case "deadline":
        setJobInput({ ...jobInput, deadline: e.target.value })
        break
      default:
        console.log("Error")
        break
    }
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  const handleAddSkill = () => {
    // 1. Check if the skill is already picked
    const skillEntered = enterdSkill.trim()
    setEnterdSkill("")

    if (!skillEntered) return

    const isContained = jobInput.skills.includes(skillEntered)
    if (isContained) return

    // 2. Add the skill
    setJobInput({
      ...jobInput,
      skills: [...jobInput.skills, skillEntered],
    })

    setIsModalOpen(false)
  }

  const handleEmployment = (text) => {
    setJobInput({ ...jobInput, employmentType: text })
  }

  const followOrUnfollowUser = async (targetUserId) => {
    try {
      setIsLoading(true)

      // Send the follow/unfollow request to the backend
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      )
      const isFollowed = await checkIfFollowed(targetUserId)
      setIsFollowing(isFollowed)

      // Handle the response
      if (response.data.success) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message) // Error message
      }
    } catch (error) {
      toast.error("Error in follow/unfollow:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkIfFollowed = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/isfollowing/${userId}`,
        { withCredentials: true }
      )

      if (response.data.success) {
        setFollow(response.data.isFollowing) // true or false
      } else {
        console.warn("Unexpected response:", response.data.message)
        setFollow(false)
      }
    } catch (error) {
      console.error("Error checking follow status:", error)
      setFollow(false)
    }
  }

  const handlePostedJobs = async () => {
    if (user?.role !== "recruiter") return

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/getJobsForUser`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        setPostedJob(res.data.jobs)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDeleteJob = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/delete/${jobId}`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setJobId("")
        setDeleteOpen(false)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleGetAppliedJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/getUserJob`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        setAppliedJobs(res.data.jobs)
        console.log(appliedJobs)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleRemoveUser = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/unapply/${jobId}`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setUnapplyOpen(false)
        setJobId("")
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleGetSingleJob = async () => {
    setEditLoading(true)
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/getJob/${jobId}`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setEditedJob(res.data.job)
        setJobId("")
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleUpdateJob = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/update/${jobId}`,
        jobInput,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setJobId("")
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || "Something went wrong"
      )
    }
  }

  const displayedPost =
    activeTab === "posts"
      ? userProfile?.posts
      : activeTab === "Jobs Posted by you"
      ? postedJob
      : activeTab === "Jobs you have applied"
      ? appliedJobs
      : userProfile?.bookmarks

  useEffect(() => {
    checkIfFollowed()
    handlePostedJobs()
    handleGetAppliedJobs()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center max-w-5xl mx-auto"
    >
      <div className="flex flex-col w-full gap-10 p-6">
        {/* Profile Header */}
        <motion.div
          className="grid grid-cols-1 gap-8 p-6 bg-white shadow-sm md:grid-cols-2 rounded-xl"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <motion.section
            className="flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
          >
            <Avatar className="w-32 h-32 border-4 border-blue-100">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>
                <img src={person} alt="default" className="w-full h-full" />
              </AvatarFallback>
            </Avatar>
          </motion.section>

          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <motion.span
                  className="text-2xl font-bold"
                  whileHover={{ x: 2 }}
                >
                  <TranslatableText
                    text={userProfile?.username}
                    language={language}
                  />
                </motion.span>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge className="h-8 text-blue-700 capitalize bg-blue-100">
                    <TranslatableText
                      text={userProfile.role}
                      language={language}
                    />
                  </Badge>
                </motion.div>

                {isLoggedInUserProfile ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/account/edit">
                      <Button variant="outline" className="h-8">
                        <TranslatableText
                          text="Edit profile"
                          language={language}
                        />
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className={`h-8 ${
                          follow
                            ? "bg-gray-100 text-gray-800"
                            : "bg-blue-100 text-blue-700"
                        }`}
                        onClick={() => followOrUnfollowUser(userId)}
                      >
                        {follow ? (
                          <TranslatableText
                            text="Unfollow"
                            language={language}
                          />
                        ) : (
                          <TranslatableText text="Follow" language={language} />
                        )}
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        className="h-8"
                        onClick={() => navigate("/chat")}
                      >
                        <TranslatableText text="Message" language={language} />
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-6">
                {[
                  { count: userProfile?.posts.length, text: "posts" },
                  { count: userProfile?.followers.length, text: "followers" },
                  { count: userProfile?.following.length, text: "following" },
                ].map((item, index) => (
                  <motion.p
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1"
                  >
                    <span className="font-semibold">{item.count}</span>
                    <span className="text-gray-600">
                      <TranslatableText text={item.text} language={language} />
                    </span>
                  </motion.p>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-700">
                  {userProfile?.bio || (
                    <TranslatableText text="No bio yet" language={language} />
                  )}
                </span>
                <motion.div whileHover={{ x: 2 }}>
                  <Badge variant="outline" className="w-fit">
                    <AtSign size={14} />
                    <span className="ml-1">
                      <TranslatableText
                        text={userProfile?.username}
                        language={language}
                      />
                    </span>
                  </Badge>
                </motion.div>
              </div>
            </div>
          </motion.section>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="sticky top-0 z-10 bg-white border-b border-gray-200"
          initial={{ y: -10 }}
          animate={{ y: 0 }}
        >
          <div className="flex items-center justify-center gap-4 py-3 overflow-x-auto">
            {[
              "posts",
              "saved",
              ...(user?.role === "recruiter" && user?._id === userId
                ? ["Jobs Posted by you"]
                : []),
              ...(user?.role === "job seeker" && user?._id === userId
                ? ["Jobs you have applied"]
                : []),
            ].map((tab) => (
              <motion.span
                key={tab}
                className={`px-4 py-1 text-sm cursor-pointer rounded-full whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-blue-600 text-white font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => handleTabChange(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TranslatableText text={tab} language={language} />
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className={`${
            activeTab === "Jobs Posted by you" ||
            activeTab === "Jobs you have applied"
              ? "w-full h-fit flex flex-col gap-3"
              : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          } `}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <AnimatePresence>
            {displayedPost && displayedPost.length > 0 ? (
              displayedPost.map((post, postIndex) => {
                if (activeTab === "Jobs Posted by you") {
                  return (
                    <motion.div
                      key={postIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: postIndex * 0.05 }}
                    >
                      <Job
                        job={post}
                        setDeleteOpen={setDeleteOpen}
                        setJobId={setJobId}
                        setEditOpen={setEditOpen}
                        handleGetSingleJob={handleGetSingleJob}
                        setResumeOpen={setResumeOpen}
                        setResume={setResume}
                      />
                    </motion.div>
                  )
                }
                if (activeTab === "Jobs you have applied") {
                  return (
                    <motion.div
                      key={postIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: postIndex * 0.05 }}
                    >
                      <JobApplied
                        job={post}
                        setJobId={setJobId}
                        setUnapplyOpen={setUnapplyOpen}
                      />
                    </motion.div>
                  )
                }

                return (
                  <motion.div
                    key={post?._id}
                    className="relative overflow-hidden rounded-lg aspect-square"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: postIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img
                      src={post.image}
                      alt="post"
                      className="object-cover w-full h-full"
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="flex items-center gap-6 text-white">
                        <motion.div
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Heart size={20} />
                          <span>{post?.likes.length}</span>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-1"
                          whileHover={{ scale: 1.1 }}
                        >
                          <MessageCircle size={20} />
                          <span>{post?.comments.length}</span>
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>
                )
              })
            ) : (
              <motion.div
                className="flex flex-col items-center justify-center py-12 col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    transition: { duration: 2, repeat: Infinity },
                  }}
                >
                  <img
                    src={koala}
                    alt="No content"
                    className="w-40 h-40 mx-auto"
                  />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-gray-700">
                  <TranslatableText
                    text="No content found"
                    language={language}
                  />
                </h3>
                <p className="mt-1 text-gray-500">
                  <TranslatableText
                    text="When you create content, it will appear here"
                    language={language}
                  />
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent>
                <DialogHeader className="text-lg font-semibold">
                  <TranslatableText
                    text="Add a new skill"
                    language={language}
                  />
                </DialogHeader>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Input
                    value={enterdSkill}
                    onChange={(e) => setEnterdSkill(e.target.value)}
                    placeholder="Enter skill name..."
                    className="focus-visible:ring-blue-500"
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <TranslatableText text="Cancel" language={language} />
                    </Button>
                    <Button onClick={handleAddSkill}>
                      <TranslatableText text="Add" language={language} />
                    </Button>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}

          {unapplyOpen && (
            <Dialog open={unapplyOpen} onOpenChange={setUnapplyOpen}>
              <DialogContent className="max-w-md rounded-lg">
                <DialogHeader className="mb-4 text-lg font-semibold text-gray-800">
                  <TranslatableText
                    text="Are you sure you want to withdraw your application?"
                    language={language}
                  />
                </DialogHeader>
                <p className="mb-6 text-gray-600">
                  <TranslatableText
                    text="This action cannot be undone."
                    language={language}
                  />
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setUnapplyOpen(false)}
                    className="px-4 py-2 text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                  >
                    <TranslatableText text="Cancel" language={language} />
                  </button>
                  <button
                    onClick={handleRemoveUser}
                    className="px-4 py-2 text-white transition-colors bg-red-600 rounded-md hover:bg-red-700"
                  >
                    <TranslatableText
                      text="Withdraw Application"
                      language={language}
                    />
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Resume Preview Modal */}
          {resumeOpen && (
            <Dialog open={resumeOpen} onOpenChange={setResumeOpen}>
              <DialogContent className="max-w-3xl">
                <DialogHeader className="text-lg font-semibold">
                  <TranslatableText text="Resume Preview" language={language} />
                </DialogHeader>
                <img
                  src={resume}
                  alt="Resume"
                  className="w-full border rounded-lg"
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Delete Job Modal */}
          {deleteOpen && (
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
              <DialogContent className="border-red-100">
                <DialogHeader className="text-lg font-semibold text-red-600">
                  <TranslatableText text="Delete Job" language={language} />
                </DialogHeader>
                <p className="py-4">
                  <TranslatableText
                    text="Are you sure you want to delete this job?"
                    language={language}
                  />
                </p>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteOpen(false)}
                  >
                    <TranslatableText text="Cancel" language={language} />
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteJob}>
                    <TranslatableText text="Delete" language={language} />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Job Panel */}
          {editOpen && (
            <motion.div
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setEditOpen(false)
                setJobId("")
                setEditLoading(false)
              }}
            />
          )}

          {editLoading ? (
            <div className="fixed top-0 right-0 z-50 flex items-center justify-center w-full h-screen max-w-lg bg-white">
              <Loader className="w-12 h-12 animate-spin" />
            </div>
          ) : (
            editOpen && (
              <motion.div
                className="fixed top-0 right-0 z-50 w-full h-screen max-w-lg overflow-y-auto bg-white shadow-xl"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25 }}
              >
                <div className="fixed top-0 right-0 z-20 h-screen bg-white w-[50%] p-6 overflow-scroll">
                  <form onSubmit={handleUpdateJob}>
                    <h2 className="py-4 text-xl font-semibold text-gray-800">
                      <TranslatableText text="Edit a Job" language={language} />
                    </h2>
                    <div className="flex w-full gap-2 h-fit">
                      <div className="w-[100%] min-h-[550px] p-4">
                        <section className="">
                          <h2 className="text-lg font-semibold">
                            <TranslatableText
                              text="Basic Information"
                              language={language}
                            />
                          </h2>
                        </section>

                        <div className="w-full py-4 h-fit">
                          <div className="w-[90%] flex flex-col gpa-1 my-2">
                            <InputOne
                              label="job title"
                              value={jobInput.jobTitle}
                              onHandleChange={handleChange}
                            />
                          </div>
                          <div className="w-[90%] flex gap-2 my-2">
                            <section className="flex flex-col w-1/2 gap-1">
                              <InputOne
                                label="role"
                                value={jobInput.role}
                                onHandleChange={handleChange}
                              />
                            </section>
                            <section className="flex flex-col w-1/2 gap-1">
                              <InputOne
                                label="category"
                                value={jobInput.category}
                                onHandleChange={handleChange}
                              />
                            </section>
                          </div>
                          <div className="w-[90%] flex flex-col gpa-1 my-2">
                            <InputOne
                              label="job description"
                              value={jobInput.jobDescription}
                              onHandleChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Additional Information */}
                        <section className="">
                          <h2 className="text-lg font-semibold">
                            <TranslatableText
                              text="Additional Information"
                              language={language}
                            />
                          </h2>
                        </section>

                        <div className="w-full py-4 h-fit">
                          <section className="flex flex-col">
                            <label className="text-[14px] text-gray-800 mb-1">
                              <TranslatableText
                                text="Employment type"
                                language={language}
                              />
                            </label>
                            <div className="flex h-12 gap-2">
                              <section
                                className={`${
                                  jobInput.employmentType === "fulltime"
                                    ? "border-blue-600 bg-blue-300"
                                    : null
                                } flex items-center justify-center h-10 gap-2 transition-all duration-100 ease-out border-2 border-gray-300 rounded-md cursor-pointer w-28 `}
                                onClick={() => {
                                  handleEmployment("fulltime")
                                }}
                              >
                                <CalendarCheck size={19} />
                                <span className="text-[14px]">
                                  <TranslatableText
                                    text="Fulltime"
                                    language={language}
                                  />
                                </span>
                              </section>
                              <section
                                className={`${
                                  jobInput.employmentType === "freelance"
                                    ? "border-blue-600 bg-blue-300"
                                    : null
                                } flex items-center justify-center h-10 gap-2 transition-all duration-100 ease-out border-2 border-gray-300 rounded-md cursor-pointer w-28 `}
                                onClick={() => {
                                  handleEmployment("freelance")
                                }}
                              >
                                <Clock size={19} />
                                <span className="text-[14px]">
                                  <TranslatableText
                                    text="Freelance"
                                    language={language}
                                  />
                                </span>
                              </section>
                              <section
                                className={`${
                                  jobInput.employmentType === "contract"
                                    ? "border-blue-600 bg-blue-300"
                                    : null
                                } flex items-center justify-center h-10 gap-2 transition-all duration-100 ease-out border-2 border-gray-300 rounded-md cursor-pointer w-28 `}
                                onClick={() => {
                                  handleEmployment("contract")
                                }}
                              >
                                <Clock size={19} />
                                <span className="text-[14px]">
                                  <TranslatableText
                                    text="Contract"
                                    language={language}
                                  />
                                </span>
                              </section>
                              <section
                                className={`${
                                  jobInput.employmentType === "internship"
                                    ? "border-blue-600 bg-blue-300"
                                    : null
                                } flex items-center justify-center h-10 gap-2 transition-all duration-100 ease-out border-2 border-gray-300 rounded-md cursor-pointer w-28 `}
                                onClick={() => {
                                  handleEmployment("internship")
                                }}
                              >
                                <Clock size={19} />
                                <span className="text-[14px]">
                                  <TranslatableText
                                    text="Internship"
                                    language={language}
                                  />
                                </span>
                              </section>
                            </div>
                          </section>

                          {/* Job placement */}
                          <div className="w-[90%] flex gap-2 my-2">
                            <section className="flex flex-col w-1/2 gap-1">
                              <span className="text-[14px] text-gray-800 mb-1">
                                <TranslatableText
                                  text="Job placement"
                                  language={language}
                                />
                              </span>
                              <select
                                name="Job placement"
                                value={jobInput.jobPlacement}
                                onChange={handleChange}
                                className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                              >
                                <option value="">
                                  <TranslatableText
                                    text="Select option"
                                    language={language}
                                  />
                                </option>
                                <option value="onsite">
                                  <TranslatableText
                                    text="Onsite"
                                    language={language}
                                  />
                                </option>
                                <option value="remote">
                                  <TranslatableText
                                    text="Remote"
                                    language={language}
                                  />
                                </option>
                                <option value="hybrid">
                                  <TranslatableText
                                    text="Hybrid"
                                    language={language}
                                  />
                                </option>
                              </select>
                            </section>

                            <section className="flex flex-col w-1/2 gap-1">
                              <span className="text-[14px] text-gray-800 mb-1">
                                <TranslatableText
                                  text="Job experience"
                                  language={language}
                                />
                              </span>
                              <select
                                name="Job experience"
                                value={jobInput.jobExperience}
                                onChange={handleChange}
                                className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                              >
                                <option value="">
                                  <TranslatableText
                                    text="Select option"
                                    language={language}
                                  />
                                </option>
                                <option value="no">
                                  <TranslatableText
                                    text="No experience"
                                    language={language}
                                  />
                                </option>
                                <option value="1-2">
                                  <TranslatableText
                                    text="1-2 years"
                                    language={language}
                                  />
                                </option>
                                <option value="2-4">
                                  <TranslatableText
                                    text="2-4 years"
                                    language={language}
                                  />
                                </option>
                                <option value="4-8">
                                  <TranslatableText
                                    text="4-8 years"
                                    language={language}
                                  />
                                </option>
                                <option value=">8">
                                  <TranslatableText
                                    text="more than 8 years"
                                    language={language}
                                  />
                                </option>
                              </select>
                            </section>
                          </div>

                          {/* Company Information */}
                          <h2 className="pt-5 text-lg font-semibold">
                            <TranslatableText
                              text="Company Information"
                              language={language}
                            />
                          </h2>

                          <div className="w-full py-4 h-fit">
                            <div className="w-[90%] flex flex-col gpa-1 my-2">
                              <InputOne
                                label="company name"
                                value={jobInput.companyName}
                                onHandleChange={handleChange}
                              />
                            </div>
                            <h2 className="font-semibold text-[16px] py-2 text-gray-900">
                              <TranslatableText
                                text="Location"
                                language={language}
                              />
                            </h2>

                            <div className="w-[90%] flex gap-2 my-2">
                              <section className="flex flex-col w-1/2 gap-1">
                                <span className="text-[14px] text-gray-800 mb-1">
                                  <TranslatableText
                                    text="City"
                                    language={language}
                                  />
                                </span>
                                <select
                                  name="city"
                                  value={jobInput.city}
                                  onChange={handleChange}
                                  className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                                >
                                  <option value="">
                                    <TranslatableText
                                      text="Select option"
                                      language={language}
                                    />
                                  </option>
                                  <option value="addis abeba">
                                    <TranslatableText
                                      text="Addis abeba"
                                      language={language}
                                    />
                                  </option>
                                  <option value="bhair dar">
                                    <TranslatableText
                                      text="Bhair dar"
                                      language={language}
                                    />
                                  </option>
                                  <option value="debre brihan">
                                    <TranslatableText
                                      text="Debre brihan"
                                      language={language}
                                    />
                                  </option>
                                </select>
                              </section>

                              <section className="flex flex-col w-1/2 gap-1">
                                <span className="text-[14px] text-gray-800 mb-1">
                                  <TranslatableText
                                    text="Country"
                                    language={language}
                                  />
                                </span>
                                <select
                                  name="country"
                                  value={jobInput.country}
                                  onChange={handleChange}
                                  className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                                >
                                  <option value="">
                                    <TranslatableText
                                      text="Select option"
                                      language={language}
                                    />
                                  </option>
                                  <option value="ethiopia">
                                    <TranslatableText
                                      text="Ethiopia"
                                      language={language}
                                    />
                                  </option>
                                  <option value="kenya">
                                    <TranslatableText
                                      text="Kenya"
                                      language={language}
                                    />
                                  </option>
                                  <option value="sudan">
                                    <TranslatableText
                                      text="Sudan"
                                      language={language}
                                    />
                                  </option>
                                  <option value="egypt">
                                    <TranslatableText
                                      text="Egypt"
                                      language={language}
                                    />
                                  </option>
                                  <option value="other">
                                    <TranslatableText
                                      text="other"
                                      language={language}
                                    />
                                  </option>
                                </select>
                              </section>
                            </div>
                            <h2 className="font-semibold text-[16px] pt-5 pb-2 text-gray-900">
                              <TranslatableText
                                text="About job"
                                language={language}
                              />
                            </h2>
                            <section className="flex flex-col w-full gap-1 pt-3">
                              <span className="text-[14px] text-gray-800">
                                <TranslatableText
                                  text={"Skill required"}
                                  language={language}
                                />
                              </span>
                              <div className="flex flex-wrap items-center w-full gap-2 min-h-14">
                                <section
                                  className="w-7 h-7 bg-[#618bd3] flex items-center justify-center rounded-full capitalize cursor-pointer"
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  <Plus size={15} />
                                </section>
                                {jobInput.skills && jobInput.skills.length > 0
                                  ? jobInput.skills.map((skill, skillIndex) => (
                                      <Skills skill={skill} key={skillIndex} />
                                    ))
                                  : null}
                              </div>
                            </section>
                            <section className="flex flex-col w-full gap-1 pt-3">
                              <span className="text-[14px] text-gray-800 font-semibold">
                                <TranslatableText
                                  text="Salary range"
                                  language={language}
                                />
                              </span>
                              <section className="flex items-center w-full gap-3 h-fit">
                                <span className="font-medium text-[14px] text-gray-800 capitalize">
                                  <TranslatableText
                                    text="Max salary"
                                    language={language}
                                  />
                                </span>
                                <input
                                  type="number"
                                  name={"max salary"}
                                  value={jobInput.salary.max}
                                  onChange={handleChange}
                                  className="w-44 text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
                                />
                                <span className="font-medium text-[14px] text-gray-800 capitalize">
                                  <TranslatableText
                                    text="Min salary"
                                    language={language}
                                  />
                                </span>
                                <input
                                  type="number"
                                  name={"min salary"}
                                  value={jobInput.salary.min}
                                  onChange={handleChange}
                                  className="w-44 text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
                                />
                              </section>
                            </section>
                            <span className="font-medium text-[14px] text-gray-800 capitalize block pt-4">
                              <TranslatableText
                                text="Deadline date"
                                language={language}
                              />
                            </span>
                            <input
                              type="date"
                              name={"deadline"}
                              value={jobInput.deadline}
                              onChange={handleChange}
                              className="w-44 text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between w-[100%] h-16 py-4">
                      <Button
                        className="px-10 text-gray-900 bg-gray-400 hover:bg-gray-300"
                        onClick={() => setEditOpen(false)}
                      >
                        <TranslatableText text="Cancel" language={language} />{" "}
                      </Button>
                      <Button
                        type="submit"
                        className="px-10 bg-blue-600 hover:bg-blue-500"
                      >
                        <TranslatableText
                          text="Edit a job"
                          language={language}
                        />
                      </Button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const Job = ({
  job,
  setDeleteOpen,
  setJobId,
  setEditOpen,
  setResume,
  setResumeOpen,
}) => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const acceptRef = useRef("Accept Applicant")

  const handleAccept = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/${job?._id}/hired`
      )

      if (response.data.success) {
        toast.success("Job marked as hired!")
        acceptRef.current = "Accepted"
      } else {
        toast.error("Failed to update job status.")
      }
    } catch (error) {
      console.error("Error marking job as hired:", error)
      toast.error("Server error occurred. Please try again.")
    }
  }

  return (
    <motion.div
      className="w-full p-6 bg-white border border-gray-100 shadow-sm w-fit rounded-xl"
      whileHover={{ y: -5 }}
    >
      <div className="flex flex-col gap-4">
        <motion.h2
          className="text-xl font-bold text-gray-800 transition-colors hover:text-blue-600"
          whileHover={{ x: 2 }}
        >
          <TranslatableText text={job.jobTitle} language={language} />
        </motion.h2>

        <p className="text-gray-600">
          <TranslatableText text={job.jobDescription} language={language} />
        </p>

        <div className="flex flex-wrap gap-2">
          <Badge className="text-blue-700 bg-blue-100">
            <TranslatableText text={job.employmentType} language={language} />
          </Badge>
          <Badge className="text-blue-700 bg-blue-100">
            <TranslatableText text="Onsite" language={language} />
          </Badge>
          <Badge className="text-blue-700 bg-blue-100">
            <MapPin size={16} className="mr-1" />
            <TranslatableText text={job.city} language={language} />,{" "}
            <TranslatableText text={job.country} language={language} />
          </Badge>
          <Badge className="text-blue-700 bg-blue-100">
            <BadgeDollarSign size={16} className="mr-1" />${job.salaryRange.min}{" "}
            - ${job.salaryRange.max}/
            <TranslatableText text="month" language={language} />
          </Badge>
          <Badge className="text-blue-700 bg-blue-100">
            <Clock size={16} className="mr-1" />
            <TranslatableText
              text={getTimeLeftUntil(job.deadline)}
              language={language}
            />
          </Badge>
        </div>

        {job.applicants.length > 0 && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="font-semibold text-green-600">
              {job.applicants.length}{" "}
              <TranslatableText text="applicants" language={language} />
            </h3>

            {job.applicants.map((message, index) => (
              <motion.div
                key={index}
                className="p-5 transition-shadow bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start flex-1 gap-4">
                    <a
                      href={`/profile/${message.user?._id}`}
                      className="shrink-0"
                    >
                      <Avatar className="transition-all w-14 h-14 ring-2 ring-blue-100 hover:ring-blue-300">
                        <AvatarImage
                          src={message.user?.profilePicture}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
                          <img
                            src={person}
                            alt="default"
                            className="w-6 h-6 opacity-70"
                          />
                        </AvatarFallback>
                      </Avatar>
                    </a>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-800">
                          <TranslatableText
                            text={message.user.username}
                            language={language}
                          />
                        </h4>
                        <span className="px-2 py-1 text-xs text-blue-600 rounded-full bg-blue-50">
                          New applicant
                        </span>
                      </div>

                      <p className="mt-1 text-gray-600 line-clamp-2">
                        {message.message}
                      </p>

                      <div className="flex gap-3 mt-3">
                        <button
                          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 group"
                          onClick={() => {
                            setResume(message.resume)
                            setResumeOpen(true)
                          }}
                        >
                          <TranslatableText
                            text="View resume"
                            language={language}
                          />
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <a
                          href={`/profile/${message.user?._id}`}
                          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-800"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Message</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Link to={`/profile/${message.user?._id}`}>
                      <Button
                        variant="default"
                        className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                        onClick={handleAccept}
                      >
                        {acceptRef.current}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex gap-3 mt-4">
          <Button
            variant="destructive"
            onClick={() => {
              setJobId(job._id)
              setDeleteOpen(true)
            }}
          >
            <TranslatableText text="Delete Job" language={language} />
          </Button>
          <Button
            onClick={() => {
              setJobId(job._id)
              setEditOpen(true)
            }}
          >
            <TranslatableText text="Edit Job" language={language} />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced Skills Component
const Skills = ({ skill }) => {
  const { language } = useLanguage()
  return (
    <motion.span
      className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full w-fit"
      whileHover={{ scale: 1.05 }}
    >
      <TranslatableText text={skill} language={language} />
    </motion.span>
  )
}

export const getTimeLeftUntil = (futureDate) => {
  const now = new Date()
  const deadline = new Date(futureDate)
  const diff = deadline - now // difference in milliseconds

  if (diff <= 0) return "Deadline passed"

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left `
  if (hours > 0) return `${hours % 24} hour${hours % 24 > 1 ? "s" : ""} left `
  if (minutes > 0)
    return `${minutes % 60} minute${minutes % 60 > 1 ? "s" : ""} left `
  return `${seconds % 60} second${seconds % 60 > 1 ? "s" : ""} left `
}

const JobApplied = ({ job, setJobId, setUnapplyOpen }) => {
  const { language } = useLanguage()
  return (
    <>
      <section className="flex flex-col w-full p-5 my-4 border cursor-pointer bg-slate-100 h-fit rounded-xl hover:bg-gray-100">
        <div className="flex w-full gap-2 h-fit">
          <article className="w-[420px]">
            <h2 className="py-1 text-lg font-semibold text-gray-800">
              <TranslatableText text={job.jobTitle} language={language} />
            </h2>
            <p className="text-[14px] pr-4">
              <TranslatableText text={job.jobDescription} language={language} />
            </p>
          </article>
        </div>
        <div className="flex w-full gap-1 pt-4 h-fit">
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold capitalize">
            <TranslatableText text={job.employmentType} language={language} />
          </span>
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold">
            <TranslatableText text="Onsite" language={language} />
          </span>
          <span className="text-[14px] capitalize flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#173e8a] font-semibold">
            <MapPin color="#4b75df" size={18} />
            <TranslatableText text={job.city} language={language} />,{" "}
            <TranslatableText text={job.country} language={language} />
          </span>
          <span className="text-[14px] flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#14377d] font-semibold">
            <BadgeDollarSign color="#4b75df" size={18} />${job.salaryRange.min}{" "}
            - {job.salaryRange.max}/
            <TranslatableText text={"month"} language={language} />
          </span>
          <span className="text-[14px] flex gap-1  items-center px-4 py-1  text-[#14377d] font-semibold">
            <TranslatableText
              text={getTimeLeftUntil(job.deadline)}
              language={language}
            />
          </span>
        </div>
      </section>

      <Button
        className="mt-1 bg-blue-500 h-9 "
        onClick={() => {
          setJobId(job?._id)
          setUnapplyOpen(true)
        }}
      >
        {" "}
        <TranslatableText text="Remove from applicants" language={language} />
      </Button>
    </>
  )
}

const InputOne = ({ label, value, onHandleChange }) => {
  const { language } = useLanguage()
  return (
    <>
      <span className="font-medium text-[14px] text-gray-800 capitalize">
        <TranslatableText text={label} language={language} />
      </span>
      <input
        type="text"
        name={<TranslatableText text={label} language={language} />}
        value={value}
        onChange={onHandleChange}
        className="w-full text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
      />
    </>
  )
}

export default Profile
