import { Badge, CalendarCheck, Clock, Plus, X } from "lucide-react"
import { useState } from "react"
import axios from "axios"

import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"

export default function PostJob() {
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
  const [isLoading, setIsLoading] = useState(false)
  const [enterdSkill, setEnterdSkill] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handelCreateJob = async (e) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/job/addJob`,
        jobInput,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.error)
    } finally {
      setIsLoading(false)
      setJobInput({
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
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen pl-[18%] py-10 pr-7"
    >
      <motion.form
        onSubmit={handelCreateJob}
        initial={{ y: 20 }}
        animate={{ y: 0 }}
      >
        <motion.h2
          className="py-4 text-2xl font-bold text-gray-800"
          whileHover={{ x: 2 }}
        >
          Post a Job
        </motion.h2>

        <div className="flex flex-col w-full gap-6 lg:flex-row h-fit">
          {/* Main Form */}
          <motion.div
            className="border border-gray-200 rounded-xl w-full lg:w-[70%] p-6 bg-white shadow-sm"
            whileHover={{ y: -2 }}
          >
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Basic Information
              </h2>
            </motion.section>

            <div className="w-full py-4 space-y-6">
              <InputOne
                label="job title"
                value={jobInput.jobTitle}
                onHandleChange={handleChange}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputOne
                  label="role"
                  value={jobInput.role}
                  onHandleChange={handleChange}
                />
                <InputOne
                  label="category"
                  value={jobInput.category}
                  onHandleChange={handleChange}
                />
              </div>

              <InputOne
                label="job description"
                value={jobInput.jobDescription}
                onHandleChange={handleChange}
                textarea
              />
            </div>

            {/* Additional Information */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Additional Information
              </h2>
            </motion.section>

            <div className="w-full py-4 space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Employment type
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      type: "fulltime",
                      icon: <CalendarCheck size={18} />,
                      label: "Fulltime",
                    },
                    {
                      type: "freelance",
                      icon: <Clock size={18} />,
                      label: "Freelance",
                    },
                    {
                      type: "contract",
                      icon: <Clock size={18} />,
                      label: "Contract",
                    },
                    {
                      type: "internship",
                      icon: <Clock size={18} />,
                      label: "Internship",
                    },
                  ].map((item) => (
                    <motion.div
                      key={item.type}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        type="button"
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                          jobInput.employmentType === item.type
                            ? "border-blue-600 bg-blue-100 text-blue-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleEmployment(item.type)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Job placement
                  </label>
                  <select
                    name="Job placement"
                    value={jobInput.jobPlacement}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="onsite">Onsite</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Job experience
                  </label>
                  <select
                    name="Job experience"
                    value={jobInput.jobExperience}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="no">No experience</option>
                    <option value="1-2">1-2 years</option>
                    <option value="2-4">2-4 years</option>
                    <option value="4-8">4-8 years</option>
                    <option value=">8">more than 8 years</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Company Information
              </h2>
            </motion.section>

            <div className="w-full py-4 space-y-6">
              <InputOne
                label="company name"
                value={jobInput.companyName}
                onHandleChange={handleChange}
              />

              <h3 className="text-lg font-semibold text-gray-800">Location</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    City
                  </label>
                  <select
                    name="city"
                    value={jobInput.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="addis abeba">Addis abeba</option>
                    <option value="bhair dar">Bhair dar</option>
                    <option value="debre brihan">Debre brihan</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={jobInput.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select option</option>
                    <option value="ethiopia">Ethiopia</option>
                    <option value="kenya">Kenya</option>
                    <option value="sudan">Sudan</option>
                    <option value="egypt">Egypt</option>
                    <option value="other">other</option>
                  </select>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-800">
                  About job
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Skills required
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <motion.button
                        type="button"
                        className="flex items-center justify-center w-8 h-8 text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
                        onClick={() => setIsModalOpen(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Plus size={18} />
                      </motion.button>

                      <AnimatePresence>
                        {jobInput.skills.map((skill, skillIndex) => (
                          <motion.div
                            key={skillIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            layout
                          >
                            <Badge className="flex items-center gap-2 px-3 py-1 text-blue-700 bg-blue-100 hover:bg-blue-200">
                              {skill}
                              <button
                                type="button"
                                onClick={() => {
                                  setJobInput({
                                    ...jobInput,
                                    skills: jobInput.skills.filter(
                                      (_, i) => i !== skillIndex
                                    ),
                                  })
                                }}
                                className="text-blue-700 hover:text-blue-900"
                              >
                                <X size={14} />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Salary range
                    </label>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="block mb-1 text-xs text-gray-500">
                          Minimum salary
                        </label>
                        <div className="relative">
                          <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
                            $
                          </span>
                          <input
                            type="number"
                            name="min salary"
                            value={jobInput.salary.min}
                            onChange={handleChange}
                            className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block mb-1 text-xs text-gray-500">
                          Maximum salary
                        </label>
                        <div className="relative">
                          <span className="absolute text-gray-500 transform -translate-y-1/2 left-3 top-1/2">
                            $
                          </span>
                          <input
                            type="number"
                            name="max salary"
                            value={jobInput.salary.max}
                            onChange={handleChange}
                            className="w-full py-2 pl-8 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Deadline date
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      value={jobInput.deadline}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Side Panel */}
          <motion.div
            className="sticky flex-col hidden p-6 lg:flex bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl h-fit top-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="mb-3 font-semibold text-gray-800">
              Place of work if accepted into this job vacancy
            </h2>
            <p className="text-sm text-gray-600">
              You can fill manually, if your work address is different from the
              head office address
            </p>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center justify-end gap-4 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="button"
            variant="outline"
            className="px-8 py-3 text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setJobInput({
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
            }}
          >
            Reset
          </Button>
          <Button
            type="submit"
            className="px-8 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
                Posting...
              </span>
            ) : (
              "Post Job"
            )}
          </Button>
        </motion.div>
      </motion.form>

      {/* Add Skill Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
              <DialogHeader className="text-lg font-semibold">
                Add Required Skill
              </DialogHeader>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Input
                  value={enterdSkill}
                  onChange={(e) => setEnterdSkill(e.target.value)}
                  placeholder="Enter skill name..."
                  className="focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddSkill()
                    }
                  }}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddSkill}>Add Skill</Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const InputOne = ({ label, value, onHandleChange, textarea = false }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 capitalize">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={label}
          value={value}
          onChange={onHandleChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
          rows={4}
        />
      ) : (
        <input
          type="text"
          name={label}
          value={value}
          onChange={onHandleChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      )}
    </div>
  )
}
