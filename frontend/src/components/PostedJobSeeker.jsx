import { BadgeDollarSign, Loader2, MapPin, Search } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import styles from "./PostedJobSeeker.module.css"
import { readFileAsDataURL } from "@/lib/utils"
import person from "../assets/person.png"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"

export default function PostedJobSeeker() {
  const imageRef = useRef()
  const [query, setQuery] = useState("")
  const [file, setFile] = useState("")
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loadingApply, setLoadingApply] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [jobId, setJobId] = useState("")
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const [filters, setFilters] = useState({
    jobType: "",
    salary: {
      min: 0,
      max: 0,
    },
    sortOption: "",
  })

  const handleChange = (value) => {
    setFilters({ ...filters, jobType: value })
  }
  const handleSort = (e) => {
    setFilters({ ...filters, sortOption: e.target.value })
  }
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataURL(file)
      setImagePreview(dataUrl)
    }
  }
  const handleApplyToJob = async () => {
    const formData = new FormData()
    formData.append("message", message)
    if (imagePreview) formData.append("image", file)

    try {
      setLoadingApply(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/applyJob/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        setOpen(false)
        setJobId("")
        setMessage("")
        setImagePreview("")
      }
    } catch (error) {
      toast.error(error.response.data.error)
    } finally {
      setLoadingApply(false)
    }
  }

  const handleGetAllJobs = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/getall`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        console.log(res.data)
        return res.data.jobs
      }
    } catch (error) {
      console.log(error.message)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e) => {
    setQuery(e.target.value)

    e.preventDefault()

    if (!query) {
      setFilteredJobs(allJobs)
      return
    }

    const data = allJobs.filter((job) => {
      return `${job.jobTitle}${job.companyName}`.includes(query)
    })

    console.log(query, data)

    setFilteredJobs(data)
  }

  useEffect(() => {
    const getJobs = async () => {
      const data = await handleGetAllJobs()
      setAllJobs(data)
      setFilteredJobs(data)
    }

    getJobs()
  }, [])

  return (
    <div className="w-full min-h-screen pl-[18%] py-10 pr-7">
      <h2 className="text-xl font-semibold text-gray-900 capitalize">
        Find you dream job
      </h2>
      {/* Search Bar */}
      <form className="w-[80%] h-14 flex gap-2 items-center bg-slate-100 px-4 rounded-[34px] my-5">
        <Search size={20} />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Job title or keywords..."
          className="bg-transparent h-full w-[80%] px-4 text-[15px] outline-none"
        />
        <p
          className="px-2 mx-2 text-gray-700 cursor-pointer text-[15px]"
          onClick={() => {
            setQuery("")
          }}
        >
          Clear
        </p>
        <button
          type="submit"
          className="h-10 px-6 bg-blue-700 text-white rounded-3xl cursor-pointer text-[15px]"
        >
          Search
        </button>
      </form>

      {/* Main content */}
      <div className="flex w-full gap-4 h-fit">
        {/* Filter div */}
        <div className=" w-80 min-h-96 p-7">
          <p className="py-4 text-gray-800">Filter</p>

          <section className="w-full">
            <p
              className="uppercase text-gray-800 text-[14px] font-semibold py-4"
              onClick={() => {
                setFilters({ ...filters, jobType: "" })
              }}
            >
              job type
            </p>
            <div className="flex flex-col gap-2">
              <label className={`${styles["custom-checkbox"]}`}>
                <input
                  type="checkbox"
                  checked={filters.jobType === ""}
                  onChange={() => {
                    handleChange("")
                  }}
                />
                <span className={`${styles.checkmark}`}></span>
                All
              </label>
              <label className={`${styles["custom-checkbox"]}`}>
                <input
                  type="checkbox"
                  checked={filters.jobType === "fulltime"}
                  onChange={() => {
                    handleChange("fulltime")
                  }}
                />
                <span className={`${styles.checkmark}`}></span>
                Full time
              </label>
              <label className={`${styles["custom-checkbox"]}`}>
                <input
                  type="checkbox"
                  checked={filters.jobType === "freelance"}
                  onChange={() => {
                    handleChange("freelance")
                  }}
                />
                <span className={`${styles.checkmark}`}></span>
                Freelance
              </label>
              <label className={`${styles["custom-checkbox"]}`}>
                <input
                  type="checkbox"
                  checked={filters.jobType === "contract"}
                  onChange={() => {
                    handleChange("contract")
                  }}
                />
                <span className={`${styles.checkmark}`}></span>
                Contract
              </label>
              <label className={`${styles["custom-checkbox"]}`}>
                <input
                  type="checkbox"
                  checked={filters.jobType === "internship"}
                  onChange={() => {
                    handleChange("internship")
                  }}
                />
                <span className={`${styles.checkmark}`}></span>
                Internship
              </label>
            </div>
            <p className="uppercase text-gray-800 text-[14px] font-semibold pb-5 pt-7">
              salary
            </p>
            <div className="flex items-center gap-3">
              <select
                name="max"
                // value={filters.jobPlacement}
                // onChange={handleChange}
                className="w-24 py-2 border rounded-md border-gray-300 px-1 outline-none text-[14px]"
              >
                <option value="">Max</option>
                <option value="onsite">500</option>
                <option value="remote">1000</option>
                <option value="hybrid">15000</option>
                <option value="hybrid"> more than 25000 </option>
              </select>
              <select
                name="max"
                // value={filters.jobPlacement}
                // onChange={handleChange}
                className="w-24 py-2 border rounded-md border-gray-300 px-1 outline-none text-[14px]"
              >
                <option value="">Min</option>
                <option value="onsite">100</option>
                <option value="remote">500</option>
                <option value="hybrid">1600</option>
                <option value="hybrid">2000</option>
              </select>
            </div>
          </section>
        </div>
        {/* Job list div */}{" "}
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-96">
            <Loader2 className="w-16 h-16 animated-spin" />
          </div>
        ) : (
          <div className="flex flex-col w-full gap-2 pt-9 h-fit">
            <section className="flex items-center justify-between w-[85%] h-10 px-2">
              {allJobs.length > 0 && (
                <p className="font-semibold text-[15px]">
                  {allJobs.length} jobs
                </p>
              )}
              {allJobs.length > 0 && (
                <div className="">
                  <label
                    htmlFor="sort"
                    className="text-[15px] mr-3 text-gray-700"
                  >
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={filters.sortOption}
                    onChange={handleSort}
                    className="text-[15px] py-1 border border-gray-200 rounded-md px-1 outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popular">Most Popular</option>
                    <option value="a-z">A → Z</option>
                    <option value="z-a">Z → A</option>
                  </select>
                </div>
              )}
            </section>
            {/* Job lister container */}
            <div className="flex flex-col w-[85%] gap-2 h-fit">
              {filteredJobs && filteredJobs.length > 0 ? (
                filteredJobs.map((job, jobIndex) => (
                  <Job
                    onOpen={setOpen}
                    job={job}
                    key={jobIndex}
                    setJobId={setJobId}
                  />
                ))
              ) : (
                <p className="py-4 text-gray-800">There is no jobs now</p>
              )}

              {allJobs.length > 0 && (
                <div className="flex items-center w-full h-16 gap-3 pt-5">
                  <PageNumber number={1} />
                  <PageNumber number={2} />
                  <PageNumber number={3} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} className="w-[500px]">
        <DialogContent
          onInteractOutside={() => {
            setOpen(false)
            setJobId("")
            setMessage("")
            setImagePreview("")
          }}
        >
          <DialogHeader className="py-4 text-xl font-semibold text-center">
            Apply to the job
          </DialogHeader>
          <label htmlFor="" className="text-[14px] block">
            Write Your message
          </label>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-200 focus-visible:ring-transparent"
            placeholder="message..."
          />
          {imagePreview && (
            <div className="flex items-center justify-center w-full h-64">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          )}
          <input
            ref={imageRef}
            type="file"
            className="hidden"
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] "
          >
            Attach your resume
          </Button>
          {imagePreview &&
            (loadingApply ? (
              <Button>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button
                onClick={handleApplyToJob}
                type="submit"
                className="w-full"
              >
                Apply Now
              </Button>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}
/* eslint-disable-next-line */
const PageNumber = ({ number }) => {
  const isActive = false
  return (
    <span
      className={`${
        isActive
          ? "border-blue-600 bg-blue-600 text-white"
          : "text-gray-800 border-gray-200"
      } flex items-center justify-center w-8 h-8   border  rounded-full text-[14px] cursor-pointer`}
    >
      {number}
    </span>
  )
}

//eslint-disable-next-line
const Job = ({ onOpen, job, setJobId }) => {
  return (
    <section
      className="flex flex-col w-full p-5 border border-blue-100 cursor-pointer h-fit rounded-xl hover:bg-gray-100"
      onClick={() => {
        onOpen(true)
        //eslint-disable-next-line
        setJobId(`${job?._id}`)
      }}
    >
      <div className="flex w-full gap-2 h-fit">
        <Avatar className="w-16 h-16 border border-gray-400">
          {/* eslint-disable-next-line */}
          <AvatarImage src={job.author?.profilePicture} alt="@shadcn" />
          <AvatarFallback>
            <img src={person} alt="default image" />
          </AvatarFallback>
        </Avatar>

        <article className="w-[420px]">
          <h2 className="py-1 text-lg font-semibold text-gray-800">
            {/* eslint-disable-next-line */}
            {job.jobTitle}
          </h2>
          {/* eslint-disable-next-line */}
          <p className="text-[14px] pr-4">{job.jobDescription}</p>
          <p className="text-[15px]">
            by <span className="text-blue-600">{job.author.username} </span>
          </p>
        </article>
        <article className="py-9 pl-7">
          <p className="text-[14px] text-gray-700">
            Company name:{" "}
            <span className="text-blue-600 capitalize">{job.companyName} </span>
          </p>
        </article>
      </div>
      <div className="flex items-center w-full gap-2 pt-5 h-fit">
        <p className="text-[14px] text-gray-700">Skills required</p>
        {job.skillsRequired.map((skill, skillIndex) => (
          <Skills skill={skill} key={skillIndex} />
        ))}
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
          {/* eslint-disable-next-line */}
          <BadgeDollarSign color="#4b75df" size={18} />${job.salaryRange.min} -{" "}
          {/* eslint-disable-next-line */}
          {job.salaryRange.max}/month
        </span>
      </div>
      <span className="text-[14px] flex gap-1 items-center  pt-4  text-[#14377d] font-semibold">
        {/* eslint-disable-next-line */}
        {getTimeLeftUntil(job.deadline)}
      </span>
      <p className="pt-3  text-[14px] text-gray-700">
        {/* eslint-disable-next-line */}
        {job.applicants.length === 0 ? (
          <span className="text-red-500">No user applied to this job yet</span>
        ) : (
          <span className="text-green-600">
            {" "}
            {/* eslint-disable-next-line */}
            {job.applicants.length} applicants applied to this job until now
          </span>
        )}
      </p>
    </section>
  )
}
/* eslint-disable-next-line */
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

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left to apply`
  if (hours > 0)
    return `${hours % 24} hour${hours % 24 > 1 ? "s" : ""} left to apply`
  if (minutes > 0)
    return `${minutes % 60} minute${minutes % 60 > 1 ? "s" : ""} left to apply`
  return `${seconds % 60} second${seconds % 60 > 1 ? "s" : ""} left to apply`
}
