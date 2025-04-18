import { CalendarCheck, Clock, Plus } from "lucide-react"
import { useState } from "react"
import axios from "axios"

import { Dialog, DialogContent, DialogHeader } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { toast } from "sonner"

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
    <div className="w-full min-h-screen pl-[18%] py-10 pr-7">
      <form onSubmit={handelCreateJob}>
        <h2 className="py-4 text-xl font-semibold text-gray-800">Post a Job</h2>
        <div className="flex w-full gap-2 h-fit">
          <div className="border border-gray-200 rounded-lg w-full lg:w-[60%] min-h-[550px] p-4">
            <section className="">
              <h2 className="text-lg font-semibold">Basic Information</h2>
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
              <h2 className="text-lg font-semibold">Additional Information</h2>
            </section>

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
                    <span className="text-[14px] text-gray-800 mb-1">City</span>
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
          <section className="hidden lg:flex flex-col p-3 py-5 bg-[#d3dae3] rounded-lg h-44 w-80 ml-4">
            <h2 className="font-semibold text-[15px] text-gray-900">
              Place of work if accepted into this job vacancy
            </h2>
            <p className="text-[14px] text-gray-800 pt-4">
              You can fill manually, if your work address is different from the
              head office address
            </p>
          </section>
        </div>

        <div className="flex items-center justify-between w-[70%] h-16 py-4">
          <Button className="px-10 text-gray-900 bg-gray-400 hover:bg-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="px-10 bg-blue-600 hover:bg-blue-500">
            Post a job
          </Button>
        </div>
      </form>
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
    </div>
  )
}

const Skills = ({ skill }) => {
  return (
    <section className="w-fit px-4 py-2 bg-[#a8c4f6] flex items-center justify-center text-[14px] rounded-2xl capitalize">
      {skill}
    </section>
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
