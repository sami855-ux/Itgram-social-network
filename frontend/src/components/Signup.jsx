import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
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
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    meetsRequirements: false,
  })
  const [showRequirements, setShowRequirements] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const navigate = useNavigate()

  // Password requirements checklist
  const requirements = [
    { id: 1, text: "At least 8 characters", regex: /.{8,}/ },
    { id: 2, text: "Contains a number", regex: /\d/ },
    {
      id: 3,
      text: "Contains a special character",
      regex: /[!@#$%^&*(),.?":{}|<>]/,
    },
    { id: 4, text: "Contains uppercase letter", regex: /[A-Z]/ },
    { id: 5, text: "Contains lowercase letter", regex: /[a-z]/ },
  ]

  const checkPasswordStrength = (password) => {
    let score = 0
    requirements.forEach((req) => {
      if (req.regex.test(password)) score += 20
    })

    setPasswordStrength({
      score,
      meetsRequirements: score >= 60, // At least 3 requirements met
    })
  }

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    setInput((prev) => ({ ...prev, [name]: value }))

    if (name === "password") {
      checkPasswordStrength(value)
      setShowRequirements(value.length > 0)
    }
  }

  const signupHandler = async (e) => {
    e.preventDefault()

    if (!validateEmail(input.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (!passwordStrength.meetsRequirements) {
      toast.error("Password doesn't meet requirements")
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
        navigate("/login")
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
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

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
                Join Our Community
              </motion.h2>
              <motion.p
                className="mt-1 text-sm text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Create your account to get started
              </motion.p>
            </motion.div>

            <form onSubmit={signupHandler} className="space-y-5">
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <Input
                  type="text"
                  name="username"
                  value={input.username}
                  onChange={changeEventHandler}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all hover:border-gray-300"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all hover:border-gray-300"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  onFocus={() => setShowRequirements(true)}
                  onBlur={() =>
                    setShowRequirements(
                      input.password.length === 0 ? false : true
                    )
                  }
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all hover:border-gray-300"
                  required
                />

                {showRequirements && (
                  <div className="mt-2 space-y-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-2 rounded-full ${
                          passwordStrength.score < 40
                            ? "bg-red-500"
                            : passwordStrength.score < 80
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${passwordStrength.score}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {passwordStrength.score < 40
                        ? "Weak"
                        : passwordStrength.score < 80
                        ? "Moderate"
                        : "Strong"}
                    </div>

                    <ul className="mt-2 space-y-1 text-xs text-gray-600">
                      {requirements.map((req) => (
                        <li
                          key={req.id}
                          className={`flex items-center ${
                            req.regex.test(input.password)
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {req.regex.test(input.password) ? (
                            <svg
                              className="w-4 h-4 mr-1.5 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 mr-1.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          )}
                          {req.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              <motion.div
                className="flex flex-col gap-2"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={input.role}
                  onChange={changeEventHandler}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500/80 focus:border-transparent transition-all hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjY3N2E4ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+')] bg-no-repeat bg-[center_right_0.75rem] bg-[length:1rem]"
                  required
                >
                  <option value="">Select option</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="job seeker">Job seeker</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="pt-2"
              >
                {loading ? (
                  <Button
                    disabled
                    className="w-full py-3 text-white transition-all rounded-lg shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg"
                  >
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </Button>
                ) : (
                  <motion.button
                    type="submit"
                    disabled={!passwordStrength.meetsRequirements}
                    className={`relative w-full py-3 overflow-hidden font-medium text-white transition-all rounded-lg shadow-md ${
                      passwordStrength.meetsRequirements
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    whileHover={{
                      y: passwordStrength.meetsRequirements ? -1 : 0,
                    }}
                    whileTap={{
                      scale: passwordStrength.meetsRequirements ? 0.98 : 1,
                    }}
                  >
                    <span className="relative z-10">Sign Up</span>
                    {passwordStrength.meetsRequirements && (
                      <motion.span
                        className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-700 to-purple-700 group-hover:opacity-100"
                        initial={{ opacity: 0 }}
                      />
                    )}
                  </motion.button>
                )}
              </motion.div>

              <motion.div
                className="mt-6 text-sm text-center text-gray-500"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="relative font-medium text-blue-600 transition-colors hover:text-blue-800 group"
                >
                  <span>Login</span>
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

export default Signup
