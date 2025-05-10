import { motion, AnimatePresence } from "framer-motion"
import { BadgeDollarSign, Loader2, MapPin, Search } from "lucide-react"
import { useEffect, useRef, useState, useMemo } from "react"
import { toast } from "sonner"
import axios from "axios"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { useLanguage } from "@/context/LanaguageContext"
import { TranslatableText } from "@/utils/TranslatableText"
import Empty from "./Empty"
import { readFileAsDataURL } from "@/lib/utils"
import person from "../assets/person.png"

export default function PostedJobSeeker() {
  const imageRef = useRef()
  const [query, setQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 10

  const [file, setFile] = useState("")
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loadingApply, setLoadingApply] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [jobId, setJobId] = useState("")
  const [allJobs, setAllJobs] = useState([])
  const [filteredJobs, setFilteredJobs] = useState([])
  const { language } = useLanguage()
  const [filters, setFilters] = useState({
    jobType: "",
    salary: {
      min: 0,
      max: 0,
    },
    sortOption: "",
  })

  const filteredJobsArr = useMemo(() => {
    let filtered = allJobs.filter((job) => {
      if (filters.jobType && job.employmentType !== filters.jobType) {
        return false
      }
      if (filters.salary && filters.salary.min && filters.salary.max) {
        const { min, max } = filters.salary
        if (job.salary) {
          const jobMinSalary = job.salary.min
          const jobMaxSalary = job.salary.max
          if (jobMaxSalary < min || jobMinSalary > max) {
            return false
          }
        }
      }
      return true
    })

    if (filters.sortOption) {
      switch (filters.sortOption) {
        case "newest":
          filtered = filtered.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
          break
        case "oldest":
          filtered = filtered.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          )
          break
        case "a-z":
          filtered = filtered.sort((a, b) =>
            a.jobTitle.localeCompare(b.jobTitle)
          )
          break
        case "z-a":
          filtered = filtered.sort((a, b) =>
            b.jobTitle.localeCompare(a.jobTitle)
          )
          break
        default:
          break
      }
    }

    return filtered
  }, [filters, allJobs])

  const displayData = query ? filteredJobs : filteredJobsArr
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * jobsPerPage
    const end = start + jobsPerPage
    return displayData.slice(start, end)
  }, [displayData, currentPage])

  const totalPages = Math.ceil(filteredJobsArr.length / jobsPerPage)

  const handleChange = (type) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType === type ? "" : type,
    }))
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
      const searchContent = `${job.jobTitle} ${job.companyName}`.toLowerCase()
      return query
        .toLowerCase()
        .split(" ")
        .every((word) => searchContent.includes(word))
    })
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

  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen px-4 py-10 sm:px-6 md:pl-[18%] md:pr-7"
    >
      <motion.h2
        className="text-2xl font-bold text-gray-900 capitalize"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TranslatableText text="Find your dream job" language={language} />
      </motion.h2>

      {/* Search Bar */}
      <motion.form
        className="w-full md:w-[80%] h-14 flex gap-2 items-center bg-white px-4 md:px-6 rounded-full my-5 shadow-md border border-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Job title or keywords..."
          className="bg-transparent h-full w-full px-2 md:px-4 text-[15px] outline-none"
        />
        {query && (
          <motion.p
            className="px-2 md:px-4 py-1 text-gray-700 cursor-pointer text-[15px] rounded-full hover:bg-gray-100"
            onClick={() => {
              setQuery("")
              setFilteredJobs(allJobs)
            }}
            whileHover={{ scale: 1.05 }}
          >
            <TranslatableText text="Clear" language={language} />
          </motion.p>
        )}
        <motion.button
          type="submit"
          className="h-10 px-4 md:px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full cursor-pointer text-[15px]"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <TranslatableText text="Search" language={language} />
        </motion.button>
      </motion.form>

      {/* Main content */}
      <div className="flex flex-col w-full gap-6 lg:flex-row h-fit">
        {/* Filter div */}
        {allJobs && allJobs.length > 0 ? (
          <motion.div
            className="w-full p-4 bg-white border border-gray-100 shadow-sm md:p-6 lg:w-80 min-h-96 rounded-xl"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="py-4 text-lg font-medium text-gray-800">
              <TranslatableText text={"Filter"} language={language} />
            </p>

            <section className="w-full">
              <p className="uppercase text-gray-800 text-[14px] font-semibold py-4">
                <TranslatableText text="job type" language={language} />
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                {[
                  "fulltime",
                  "parttime",
                  "internship",
                  "contract",
                  "freelance",
                ].map((type) => (
                  <motion.label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer"
                    whileHover={{ x: 3 }}
                  >
                    <input
                      type="checkbox"
                      checked={filters.jobType.includes(type)}
                      onChange={() => handleChange(type)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="capitalize">
                      <TranslatableText text={type} language={language} />
                    </span>
                  </motion.label>
                ))}
              </div>
              <p className="uppercase text-gray-800 text-[14px] font-semibold pb-5 pt-7">
                <TranslatableText text={"salary"} language={language} />
              </p>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <motion.select
                  name="max"
                  value={filters.salary.max}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      salary: {
                        ...filters.salary,
                        max: parseInt(e.target.value),
                      },
                    })
                  }}
                  className="w-full sm:w-24 py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px] focus:ring-2 focus:ring-blue-500/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <option value="">
                    <TranslatableText text={"Max"} language={language} />
                  </option>
                  <option value="500">500</option>
                  <option value="1000">1000</option>
                  <option value="1500">15000</option>
                  <option value="2500">more than 25000</option>
                </motion.select>
                <motion.select
                  name="min"
                  value={filters.salary.min}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      salary: {
                        ...filters.salary,
                        min: parseInt(e.target.value),
                      },
                    })
                  }}
                  className="w-full sm:w-24 py-2 border rounded-md border-gray-300 px-2 outline-none text-[14px] focus:ring-2 focus:ring-blue-500/50"
                  whileHover={{ scale: 1.02 }}
                >
                  <option value="">
                    <TranslatableText text={"Min"} language={language} />
                  </option>
                  <option value="100">100</option>
                  <option value="500">500</option>
                  <option value="1600">1600</option>
                  <option value="2000">2000</option>
                </motion.select>
              </div>
            </section>
          </motion.div>
        ) : null}

        {/* Job list div */}
        {isLoading ? (
          <motion.div
            className="flex items-center justify-center w-full h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-16 h-16 text-blue-500" />
            </motion.div>
          </motion.div>
        ) : allJobs && allJobs.length > 0 ? (
          <motion.div
            className="flex flex-col w-full gap-4 pt-6 h-fit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.section
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full lg:w-[85%] h-10 px-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
            >
              {allJobs.length > 0 && (
                <p className="font-semibold text-[15px]">
                  {allJobs.length}{" "}
                  <TranslatableText text={"jobs"} language={language} />
                </p>
              )}
              {allJobs.length > 0 && (
                <div className="mt-2 sm:mt-0">
                  <label
                    htmlFor="sort"
                    className="text-[15px] mr-3 text-gray-700"
                  >
                    <TranslatableText text={"Sort by"} language={language} />
                  </label>
                  <motion.select
                    id="sort"
                    value={filters.sortOption}
                    onChange={handleSort}
                    className="text-[15px] py-1 border border-gray-200 rounded-md px-4 outline-none focus:ring-2 focus:ring-blue-500/50"
                    whileHover={{ scale: 1.02 }}
                  >
                    <option value="newest">
                      <TranslatableText text={"Newest"} language={language} />
                    </option>
                    <option value="oldest">
                      <TranslatableText text={"Oldest"} language={language} />
                    </option>
                    <option value="a-z">
                      {language == "am" ? "ሀ ->ፐ" : "A → Z"}
                    </option>
                    <option value="z-a">
                      {language == "am" ? "ፐ -> ሀ" : "Z → A"}
                    </option>
                  </motion.select>
                </div>
              )}
            </motion.section>

            {/* Job lister container */}
            <div className="flex flex-col w-full lg:w-[85%] gap-4 h-fit">
              <AnimatePresence>
                {paginatedJobs && paginatedJobs.length > 0 ? (
                  paginatedJobs.map((job, jobIndex) => (
                    <Job
                      onOpen={setOpen}
                      job={job}
                      key={jobIndex}
                      setJobId={setJobId}
                    />
                  ))
                ) : (
                  <motion.p
                    className="py-4 text-gray-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <TranslatableText
                      text={"There is no jobs now"}
                      language={language}
                    />
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.div
                className="flex flex-col items-center w-full h-16 gap-4 sm:flex-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  className="py-2 text-white bg-blue-600 border border-blue-300 rounded-lg cursor-pointer disabled:text-slate-400 disabled:cursor-not-allowed px-7 disabled:bg-blue-200"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  whileHover={{ scale: currentPage === 1 ? 1 : 1.03 }}
                  whileTap={{ scale: currentPage === 1 ? 1 : 0.97 }}
                >
                  <TranslatableText text={"Previous"} language={language} />
                </motion.button>

                <span className="text-gray-700">
                  <TranslatableText text="Page" language={language} />{" "}
                  {currentPage}{" "}
                  <TranslatableText text="of" language={language} />{" "}
                  {totalPages}
                </span>

                <motion.button
                  className="py-2 text-white bg-blue-600 border border-blue-300 rounded-lg cursor-pointer px-7 disabled:text-slate-400 disabled:cursor-not-allowed disabled:bg-blue-200"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  whileHover={{ scale: currentPage === totalPages ? 1 : 1.03 }}
                  whileTap={{ scale: currentPage === totalPages ? 1 : 0.97 }}
                >
                  <TranslatableText text="Next" language={language} />
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center justify-center w-full h-fit"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Empty type="job" />
          </motion.div>
        )}
      </div>

      {/* Application Dialog */}
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false)
            setJobId("")
            setMessage("")
            setImagePreview("")
          }}
          className="max-w-md w-[90vw] sm:w-full"
        >
          <DialogHeader className="py-4 text-xl font-semibold text-center">
            <TranslatableText text={"Apply to the job"} language={language} />
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <label className="text-[14px] block font-medium">
              <TranslatableText
                text={"Write Your message"}
                language={language}
              />
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-200 focus:ring-2 focus:ring-blue-500/50"
              placeholder="message..."
            />
            {imagePreview && (
              <motion.div
                className="flex items-center justify-center w-full h-64 overflow-hidden rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <img
                  src={imagePreview}
                  alt="preview_img"
                  className="object-contain w-full h-full"
                />
              </motion.div>
            )}
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={fileChangeHandler}
            />
            <motion.div className="flex flex-col gap-3">
              <Button
                onClick={() => imageRef.current.click()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TranslatableText
                  text={"Attach your resume"}
                  language={language}
                />
              </Button>
              {imagePreview &&
                (loadingApply ? (
                  <Button disabled>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <TranslatableText
                      text={"Please wait..."}
                      language={language}
                    />
                  </Button>
                ) : (
                  <Button
                    onClick={handleApplyToJob}
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TranslatableText text={"Apply Now"} language={language} />
                  </Button>
                ))}
            </motion.div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

const Job = ({ onOpen, job, setJobId }) => {
  const { language } = useLanguage()
  return (
    <motion.section
      className="w-full p-4 transition-all bg-white border border-gray-200 cursor-pointer sm:p-6 rounded-xl hover:shadow-md"
      onClick={() => {
        onOpen(true)
        setJobId(`${job?._id}`)
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col w-full gap-4 sm:flex-row">
        <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
          <Avatar className="w-16 h-16 border-2 border-blue-100">
            <AvatarImage src={job.author?.profilePicture} alt="@shadcn" />
            <AvatarFallback>
              <img src={person} alt="default image" />
            </AvatarFallback>
          </Avatar>
        </motion.div>

        <article className="flex-1">
          <motion.h2
            className="py-1 text-lg font-bold text-gray-800 transition-colors hover:text-blue-600"
            whileHover={{ x: 2 }}
          >
            <TranslatableText text={job.jobTitle} language={language} />
          </motion.h2>
          <p className="text-[14px] pr-4 text-gray-600 line-clamp-2">
            <TranslatableText text={job.jobDescription} language={language} />
          </p>
          <p className="text-[15px] mt-1">
            <TranslatableText text="by" language={language} />{" "}
            <span className="font-medium text-blue-600">
              <TranslatableText
                text={job.author.username}
                language={language}
              />{" "}
            </span>
          </p>
        </article>
        <article className="py-2 pl-0 sm:pl-4">
          <p className="text-[14px] text-gray-700">
            <TranslatableText text="Company:" language={language} />{" "}
            <span className="font-medium text-blue-600 capitalize">
              <TranslatableText text={job.companyName} language={language} />{" "}
            </span>
          </p>
        </article>
      </div>
      <div className="flex flex-wrap items-center w-full gap-2 pt-4">
        <p className="text-[14px] text-gray-700 font-medium">
          <TranslatableText text="Skills required" language={language} />
        </p>
        {job.skillsRequired.map((skill, skillIndex) => (
          <Skills skill={skill} key={skillIndex} />
        ))}
      </div>
      <div className="flex flex-wrap w-full gap-2 pt-4">
        <motion.span
          className="text-[14px] px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium capitalize"
          whileHover={{ scale: 1.05 }}
        >
          <TranslatableText text={job.employmentType} language={language} />
        </motion.span>
        <motion.span
          className="text-[14px] px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <TranslatableText text="Onsite" language={language} />
        </motion.span>
        <motion.span
          className="text-[14px] flex gap-1 rounded-full bg-blue-100 items-center px-4 py-1 text-blue-700 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <MapPin color="#3b82f6" size={16} />
          <TranslatableText text={job.city} language={language} />,{" "}
          <TranslatableText text={job.country} language={language} />
        </motion.span>
        <motion.span
          className="text-[14px] flex gap-1 rounded-full bg-blue-100 items-center px-4 py-1 text-blue-700 font-medium"
          whileHover={{ scale: 1.05 }}
        >
          <BadgeDollarSign color="#3b82f6" size={16} />${job.salaryRange.max} -{" "}
          {job.salaryRange.min} birr/month
        </motion.span>
      </div>
      <motion.div
        className="pt-4 text-[14px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <span className="font-medium">
          <TranslatableText
            text={getTimeLeftUntil(job.deadline)}
            language={language}
          />
        </span>
        <p className="pt-2 text-[14px]">
          {job.applicants.length === 0 ? (
            <span className="text-red-500">
              <TranslatableText text="No applicants yet" language={language} />
            </span>
          ) : (
            <span className="text-green-600">
              {job.applicants.length}{" "}
              <TranslatableText text="applicants" language={language} />
            </span>
          )}
        </p>
      </motion.div>
    </motion.section>
  )
}

const Skills = ({ skill }) => {
  const { language } = useLanguage()
  return (
    <motion.span
      className="text-[14px] px-3 py-1 text-blue-700 font-medium rounded-full bg-blue-50"
      whileHover={{ scale: 1.05 }}
    >
      <TranslatableText text={skill} language={language} />
    </motion.span>
  )
}

export const getTimeLeftUntil = (futureDate) => {
  const now = new Date()
  const deadline = new Date(futureDate)
  const diff = deadline - now

  if (diff <= 0) return "Deadline passed"

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`
  if (hours > 0) return `${hours % 24} hour${hours % 24 > 1 ? "s" : ""} left`
  if (minutes > 0)
    return `${minutes % 60} minute${minutes % 60 > 1 ? "s" : ""} left`
  return `${seconds % 60} second${seconds % 60 > 1 ? "s" : ""} left`
}
