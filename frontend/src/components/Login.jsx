import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
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
        if (res.data.user.role === "admin") {
          navigate("/admin")
        } else {
          navigate("/")
        }
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
      // navigate("/")
    }
  }, [])

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/subtle-dots.png')] opacity-10"></div>

        {/* Floating bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100/40"
            initial={{
              x: Math.random() * 100,
              y: Math.random() * 100,
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              opacity: 0.3,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center justify-center w-full h-full"
        >
          <motion.div
            initial={{ y: -20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md px-8 py-10 mx-4 bg-white border shadow-2xl rounded-xl backdrop-blur-sm bg-opacity-90 border-white/20"
          >
            <motion.div
              className="flex flex-col items-center mb-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <motion.div
                className="p-1 rounded-full shadow-lg bg-gradient-to-r from-blue-100 to-purple-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.img
                  src={logo}
                  alt="logo"
                  className="w-20 h-20 rounded-full border-[3px] border-white"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring" }}
                />
              </motion.div>
              <motion.h2
                className="mt-5 text-2xl font-bold text-gray-800"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Welcome Back
              </motion.h2>
              <motion.p
                className="mt-1 text-sm text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Sign in to continue your journey
              </motion.p>
            </motion.div>

            <form onSubmit={signupHandler} className="space-y-5">
              {[
                { name: "email", label: "Email", type: "email", delay: 0.6 },
                {
                  name: "password",
                  label: "Password",
                  type: "password",
                  delay: 0.7,
                },
              ].map((field, i) => (
                <motion.div
                  key={field.name}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: field.delay }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    name={field.name}
                    value={input[field.name]}
                    onChange={changeEventHandler}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all hover:border-gray-300"
                    required
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="pt-2"
              >
                {loading ? (
                  <Button
                    disabled
                    className="w-full py-3 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg"
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </Button>
                ) : (
                  <motion.button
                    type="submit"
                    className="relative w-full py-3 overflow-hidden font-medium text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg group"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10">Login</span>
                    <motion.span
                      className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-700 to-purple-700 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                    />
                  </motion.button>
                )}
              </motion.div>

              <motion.div
                className="mt-6 text-sm text-center text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="relative font-medium text-blue-600 transition-colors hover:text-blue-800 group"
                >
                  <span>Sign up</span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Login
