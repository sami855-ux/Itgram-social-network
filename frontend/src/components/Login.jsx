import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { setAuthUser } from "@/redux/authSlice"
import logo from "../assets/logo2.png"

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const signupHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/login`,
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      )
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user))
        navigate("/")
        toast.success(res.data.message)
        setInput({
          email: "",
          password: "",
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
    <div className="flex items-center justify-center w-screen h-screen background_image">
      <form
        onSubmit={signupHandler}
        className="flex flex-col gap-5 px-20 py-12 border border-gray-100 rounded-lg shadow-xl bg-slate-100"
      >
        <div className="my-4">
          <div className="flex items-center justify-center mb-2">
            <img
              src={logo}
              alt="logo"
              className="object-cover w-20 h-20 rounded-full"
            />
          </div>
          <p className="text-sm text-center">
            Login to see photos & videos from your friends
          </p>
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
        {loading ? (
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Login</Button>
        )}

        <span className="text-center">
          Dosent have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Signup
          </Link>
        </span>
      </form>
    </div>
  )
}

export default Login
