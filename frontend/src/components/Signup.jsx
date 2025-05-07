import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import logo from "../assets/logo2.png"

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const navigate = useNavigate()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signupHandler = async (e) => {
    e.preventDefault()

    if (!validateEmail(input.email)) {
      alert("Please enter a valid email address")
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/register`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        navigate("/")
        toast.success(res.data.message)
        setInput({
          username: "",
          email: "",
          password: "",
          role: "",
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [])

  return (
    <div className="flex items-center justify-center w-screen h-screen background_image ">
      <form
        onSubmit={signupHandler}
        className="flex flex-col gap-5 px-20 py-4 border border-gray-100 rounded-lg shadow-2xl bg-slate-100"
      >
        <div className="my-4">
          <div className="flex items-center justify-center mb-2">
            <img
              src={logo}
              alt="logo"
              className="object-cover w-20 h-20 rounded-full"
            />
          </div>
          <p className="py-1 text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>
        <div>
          <span className="font-medium">Username</span>
          <Input
            type="text"
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className="my-2 border border-gray-400 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <span className="font-medium">Email</span>
          <Input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="my-2 border border-gray-400 focus-visible:ring-transparent"
          />
        </div>
        <div>
          <span className="font-medium">Password</span>
          <Input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="my-2 border border-gray-400 focus-visible:ring-transparent"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-medium">Role</span>
          <select
            name="role"
            value={input.role}
            onChange={changeEventHandler}
            className="py-2 border border-gray-400 outline-none text-[15px]"
          >
            <option value="">Select option</option>
            <option value="recruiter">Recruiter</option>
            <option value="job seeker">Job seeker</option>
          </select>
        </div>
        {loading ? (
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  )
}

export default Signup
