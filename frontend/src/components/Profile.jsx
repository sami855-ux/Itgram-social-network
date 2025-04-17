import {
  AtSign,
  BadgeDollarSign,
  CalendarCheck,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Plus,
} from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
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
  const [enterdSkill, setEnterdSkill] = useState("")
  const navigate = useNavigate()

  const { userProfile, user } = useSelector((store) => store.auth)
  const isLoggedInUserProfile = user?._id === userProfile?._id

  const isFollowing = false

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
      // Send the follow/unfollow request to the backend
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      )

      // Handle the response
      if (response.data.success) {
        console.log(response.data.message) // "Followed successfully" or "Unfollowed successfully"
      } else {
        console.log(response.data.message) // Error message
      }
    } catch (error) {
      console.error("Error in follow/unfollow:", error)
      alert("An error occurred while processing your request")
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
      }
    } catch (error) {
      console.log(error.message)
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
    <div className="flex justify-center max-w-5xl pl-10 mx-auto">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="w-32 h-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>
                <img src={person} alt="default image" />
              </AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="px-4 text-xl">{userProfile?.username}</span>
                <p className="h-8 capitalize hover:bg-gray-200 bg-[#c8ddf4] font-medium text-gray-800 text-[15px] pt-1 px-4 rounded-3xl ">
                  {userProfile.role}
                </p>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        variant="secondary"
                        className="h-8 hover:bg-gray-200"
                      >
                        Edit profile
                      </Button>
                    </Link>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className="h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-[#c9dce9] hover:bg-[#3192d2] h-8 text-gray-800"
                      onClick={() => {
                        followOrUnfollowUser(userId)
                      }}
                    >
                      {follow ? "unfollow" : "follow"}
                    </Button>

                    <Button
                      className="bg-[#eff2f3] text-gray-800 hover:bg-[#ccdbe5] h-8"
                      onClick={() => {
                        navigate("/chat")
                      }}
                    >
                      Message
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-10">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  <span className="text-gray-700">posts</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  <span className="text-gray-700">followers</span>
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  <span className="text-gray-700">following</span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-light capitalize">
                  {userProfile?.bio || "bio here..."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <AtSign />{" "}
                  <span className="pl-1">{userProfile?.username}</span>{" "}
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-2 my-1 cursor-pointer ${
                activeTab === "posts"
                  ? "font-bold border border-gray-200 rounded-3xl bg-blue-400 px-4 text-white py-1"
                  : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-2 my-1 cursor-pointer ${
                activeTab === "saved"
                  ? "font-bold border border-gray-200 rounded-3xl bg-blue-400 px-4 text-white py-1"
                  : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            {user?.role === "recruiter" && user?._id === userId && (
              <span
                className={`py-2 my-1 cursor-pointer uppercase ${
                  activeTab === "Jobs Posted by you"
                    ? "font-bold border border-gray-200 rounded-3xl bg-blue-400 px-4 text-white py-1"
                    : ""
                }`}
                onClick={() => handleTabChange("Jobs Posted by you")}
              >
                Jobs Posted by you
              </span>
            )}{" "}
            {user?.role === "job seeker" && user?._id === userId && (
              <span
                className={`py-2 my-1 cursor-pointer uppercase ${
                  activeTab === "Jobs you have applied"
                    ? "font-bold border border-gray-200 rounded-3xl bg-blue-400 px-4 text-white py-1"
                    : ""
                }`}
                onClick={() => handleTabChange("Jobs you have applied")}
              >
                Jobs you have applied
              </span>
            )}
          </div>
          <div
            className={`${
              activeTab === "Jobs Posted by you" ||
              activeTab === "Jobs you have applied"
                ? '"flex flex-col w-[100%] gap-2 h-fit'
                : "grid grid-cols-3 gap-1"
            } mt-2`}
          >
            {displayedPost && displayedPost.length > 0 ? (
              displayedPost?.map((post, postIndex) => {
                if (activeTab === "Jobs Posted by you") {
                  return (
                    <Job
                      key={postIndex}
                      job={post}
                      setDeleteOpen={setDeleteOpen}
                      setJobId={setJobId}
                      setEditOpen={setEditOpen}
                    />
                  )
                }
                if (activeTab === "Jobs you have applied") {
                  return (
                    <JobApplied
                      key={postIndex}
                      job={post}
                      setJobId={setJobId}
                      setUnapplyOpen={setUnapplyOpen}
                    />
                  )
                }

                return (
                  <div
                    key={post?._id}
                    className="relative cursor-pointer group"
                  >
                    <img
                      src={post.image}
                      alt="postimage"
                      className="object-cover w-full my-2 rounded-sm aspect-square"
                    />
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                      <div className="flex items-center space-x-4 text-white">
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <Heart />
                          <span>{post?.likes.length}</span>
                        </button>
                        <button className="flex items-center gap-2 hover:text-gray-300">
                          <MessageCircle />
                          <span>{post?.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <>
                <p className=" text-ray-700">There is no data</p>
                <img
                  src={koala}
                  alt=""
                  className={`${
                    activeTab === "Jobs Posted by you" ||
                    activeTab === "Jobs you have applied"
                      ? "w-44 h-44 mx-auto"
                      : "w-44 h-44 mt-7"
                  }`}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <>
          {/* //overlay */}
          <Dialog open={isModalOpen}>
            <DialogContent onInteractOutside={() => setIsModalOpen(false)}>
              <DialogHeader className="font-semibold text-center">
                Add the skill you want
              </DialogHeader>
              <div className="flex items-center gap-3"></div>
              <Input
                value={enterdSkill}
                onChange={(e) => setEnterdSkill(e.target.value)}
                className="border-none focus-visible:ring-transparent"
                placeholder="Enter the skill..."
              />

              <Button
                className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] px-7"
                onClick={handleAddSkill}
              >
                Add
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}

      <Dialog open={isOpen}>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader className="font-semibold text-center">
            Applied user
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.profilePicture} alt="img" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xs font-semibold">{user?.username}</h1>
              <span className="text-xs text-gray-600">Bio here...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen}>
        <DialogContent
          className="py-8 border-red-400 px-7"
          onInteractOutside={() => setDeleteOpen(false)}
        >
          <DialogHeader className="font-semibold text-center text-red-600">
            Delete Job
          </DialogHeader>
          <div className="flex items-center gap-3">
            <div>
              <p className="py-4 text-xs font-semibold">
                Do you want to delete this job ?
              </p>

              <Button
                className="mt-4 text-gray-900 bg-gray-200 h-7"
                onClick={() => setDeleteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="mt-4 text-red-900 bg-gray-200 h-7"
                onClick={handleDeleteJob}
              >
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={unapplyOpen}>
        <DialogContent
          className="py-8 border-red-400 px-7"
          onInteractOutside={() => setUnapplyOpen(false)}
        >
          <DialogHeader className="font-semibold text-center text-red-600">
            Unapply from this job
          </DialogHeader>
          <div className="flex items-center gap-3">
            <div>
              <p className="py-4 text-[14px] font-semibold">
                Do you want to Unapply from this job ?
              </p>

              <Button
                className="mt-4 mr-4 text-gray-900 bg-gray-200 h-7"
                onClick={() => setUnapplyOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="mt-4 text-red-900 bg-gray-200 h-7"
                onClick={handleRemoveUser}
              >
                Unapply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen}>
        <DialogContent
          className="min-h-screen py-8 overflow-scroll border-blue-700 max-w-[550px]"
          onInteractOutside={() => setEditOpen(false)}
        >
          <DialogHeader className="text-lg font-semibold text-center">
            Edit Job
          </DialogHeader>
          <div className="flex items-center gap-3 w-fit">
            <div className="border border-gray-200 rounded-lg  w-[100%] min-h-[550px] p-4">
              <div className="w-full py-4 h-fit">
                <div className="w-[90%] flex flex-col gpa-1 my-2">
                  <InputOne
                    label="job description"
                    value={jobInput.jobDescription}
                    onHandleChange={handleChange}
                  />
                </div>
              </div>

              {/* Additional Information */}

              <div className="w-full py-4 h-fit">
                <section className="flex flex-col">
                  <label className="text-[14px] text-gray-800 mb-1">
                    Employment type
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
                      <span className="text-[14px]">Fulltime</span>
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
                      <span className="text-[14px]">Freelance</span>
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
                      <span className="text-[14px]">Contract</span>
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
                      <span className="text-[14px]">Internship</span>
                    </section>
                  </div>
                </section>

                {/* Job placement */}
                <div className="w-[90%] flex gap-2 my-2">
                  <section className="flex flex-col w-1/2 gap-1">
                    <span className="text-[14px] text-gray-800 mb-1">
                      Job placement
                    </span>
                    <select
                      name="Job placement"
                      value={jobInput.jobPlacement}
                      onChange={handleChange}
                      className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                    >
                      <option value="">Select option</option>
                      <option value="onsite">Onsite</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </section>

                  <section className="flex flex-col w-1/2 gap-1">
                    <span className="text-[14px] text-gray-800 mb-1">
                      Job experience
                    </span>
                    <select
                      name="Job experience"
                      value={jobInput.jobExperience}
                      onChange={handleChange}
                      className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                    >
                      <option value="">Select option</option>
                      <option value="no">No experience</option>
                      <option value="1-2">1-2 years</option>
                      <option value="2-4">2-4 years</option>
                      <option value="4-8">4-8 years</option>
                      <option value=">8">more than 8 years</option>
                    </select>
                  </section>
                </div>

                {/* Company Information */}
                <h2 className="pt-5 text-lg font-semibold">
                  Company Information
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
                    Location
                  </h2>

                  <div className="w-[90%] flex gap-2 my-2">
                    <section className="flex flex-col w-1/2 gap-1">
                      <span className="text-[14px] text-gray-800 mb-1">
                        City
                      </span>
                      <select
                        name="city"
                        value={jobInput.city}
                        onChange={handleChange}
                        className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                      >
                        <option value="">Select option</option>
                        <option value="addis abeba">Addis abeba</option>
                        <option value="bhair dar">Bhair dar</option>
                        <option value="debre brihan">Debre brihan</option>
                      </select>
                    </section>

                    <section className="flex flex-col w-1/2 gap-1">
                      <span className="text-[14px] text-gray-800 mb-1">
                        Country
                      </span>
                      <select
                        name="country"
                        value={jobInput.country}
                        onChange={handleChange}
                        className="py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px]"
                      >
                        <option value="">Select option</option>
                        <option value="ethiopia">Ethiopia</option>
                        <option value="kenya">Kenya</option>
                        <option value="sudan">Sudan</option>
                        <option value="egypt">Egypt</option>
                        <option value="other">other</option>
                      </select>
                    </section>
                  </div>
                  <h2 className="font-semibold text-[16px] pt-5 pb-2 text-gray-900">
                    About job
                  </h2>
                  <section className="flex flex-col w-full gap-1 pt-3">
                    <span className="text-[14px] text-gray-800">
                      Skill required
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
                      Salary range
                    </span>
                    <section className="flex items-center w-full gap-3 h-fit">
                      <span className="font-medium text-[14px] text-gray-800 capitalize">
                        Max salary
                      </span>
                      <input
                        type="number"
                        name={"max salary"}
                        value={jobInput.salary.max}
                        onChange={handleChange}
                        className="w-44 text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
                      />
                      <span className="font-medium text-[14px] text-gray-800 capitalize">
                        Min salary
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
                    Deadline date
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

            <Button
              className="mt-4 mr-4 text-gray-900 bg-gray-200 h-7"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="mt-4 text-red-900 bg-gray-200 h-7"
              onClick={handleRemoveUser}
            >
              Edit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const Job = ({ onOpen, job, setDeleteOpen, setJobId, setEditOpen }) => {
  return (
    <>
      <section
        className="flex flex-col w-full px-4 py-5 mt-4 border cursor-pointer bg-slate-100 h-fit rounded-xl hover:bg-gray-100"
        onClick={() => {
          onOpen(true)
        }}
      >
        <div className="flex w-full gap-2 h-fit">
          <article className="w-[420px]">
            <h2 className="py-1 text-lg font-semibold text-gray-800">
              {job.jobTitle}
            </h2>
            <p className="text-[14px] pr-4">{job.jobDescription}</p>
          </article>
        </div>
        <div className="flex w-full gap-1 pt-4 h-fit">
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold capitalize">
            {job.employmentType}
          </span>
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold">
            Onsite
          </span>
          <span className="text-[14px] capitalize flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#173e8a] font-semibold">
            <MapPin color="#4b75df" size={18} />
            {job.city}, {job.country}
          </span>
          <span className="text-[14px] flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#14377d] font-semibold">
            <BadgeDollarSign color="#4b75df" size={18} />${job.salaryRange.min}{" "}
            - {job.salaryRange.max}/month
          </span>
          <span className="text-[14px] flex gap-1  items-center px-4 py-1  text-[#14377d] font-semibold">
            {getTimeLeftUntil(job.deadline)}
          </span>
        </div>
        <p className="pt-3  text-[14px] text-gray-700">
          {job.applicants.length === 0 ? (
            <span className="text-red-500">
              No user applied to your job yet
            </span>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="font-bold text-[15px] text-green-600 capitalize hover:underline">
                {" "}
                {job.applicants.length} applicants
              </span>
              {job.applicants.map((user, userIndex) => {
                return (
                  <section className="" key={userIndex}>
                    {user.message}
                  </section>
                )
              })}
            </div>
          )}
        </p>
      </section>
      <Button
        className="ml-4 mr-4 bg-red-500 h-9"
        onClick={() => {
          setDeleteOpen(true)
          setJobId(job?._id)
        }}
      >
        Delete the Job
      </Button>
      <Button
        className="mt-4 bg-blue-500 mb-7 h-9 "
        onClick={() => {
          setJobId(job?._id)
          setEditOpen(true)
        }}
      >
        {" "}
        Edit the Job
      </Button>
    </>
  )
}

const Skills = ({ skill }) => {
  return (
    <section className="w-fit capitalize px-2 text-[#4c1ac8] font-medium flex items-center justify-center text-[14px] rounded-2xl capitalize">
      {skill}
    </section>
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
  return (
    <>
      <section className="flex flex-col w-full p-5 my-4 border cursor-pointer bg-slate-100 h-fit rounded-xl hover:bg-gray-100">
        <div className="flex w-full gap-2 h-fit">
          <article className="w-[420px]">
            <h2 className="py-1 text-lg font-semibold text-gray-800">
              {job.jobTitle}
            </h2>
            <p className="text-[14px] pr-4">{job.jobDescription}</p>
          </article>
        </div>
        <div className="flex w-full gap-1 pt-4 h-fit">
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold capitalize">
            {job.employmentType}
          </span>
          <span className="text-[14px] px-3 py-1 rounded-3xl bg-blue-100 text-[#4b75df] font-semibold">
            Onsite
          </span>
          <span className="text-[14px] capitalize flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#173e8a] font-semibold">
            <MapPin color="#4b75df" size={18} />
            {job.city}, {job.country}
          </span>
          <span className="text-[14px] flex gap-1 rounded-3xl bg-blue-100 items-center px-4 py-1  text-[#14377d] font-semibold">
            <BadgeDollarSign color="#4b75df" size={18} />${job.salaryRange.min}{" "}
            - {job.salaryRange.max}/month
          </span>
          <span className="text-[14px] flex gap-1  items-center px-4 py-1  text-[#14377d] font-semibold">
            {getTimeLeftUntil(job.deadline)}
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
        Remove from applicants
      </Button>
    </>
  )
}

const InputOne = ({ label, value, onHandleChange }) => {
  return (
    <>
      <span className="font-medium text-[14px] text-gray-800 capitalize">
        {label}
      </span>
      <input
        type="text"
        name={label}
        value={value}
        onChange={onHandleChange}
        className="w-full text-[14px] px-3 py-1 my-2 border border-gray-300 rounded-md outline-none focus-visible:ring-transparent"
      />
    </>
  )
}

export default Profile
