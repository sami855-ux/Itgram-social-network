import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { io } from "socket.io-client"
import { useEffect } from "react"

import ProtectedRoutes from "./components/ProtectedRoutes"
import ExplorePeople from "./components/ExplorePeople"
import EditProfile from "./components/EditProfile"
import StoryViewer from "./components/StoryViewer"
import MainLayout from "./components/MainLayout"
import ChatPage from "./components/ChatPage"
import Explore from "./components/Explore"
import PostJob from "./components/PostJob"
import Signup from "./components/Signup"
import Profile from "./components/Profile"
import Login from "./components/Login"
import Home from "./components/Home"

import { setSocket } from "./redux/socketSlice"
import { setOnlineUsers } from "./redux/chatSlice"
import { setLikeNotification } from "./redux/rtnSlice"
import PostedJobSeeker from "./components/PostedJobSeeker"
import { LanguageProvider } from "./context/LanaguageContext"
import Notification from "./components/Notfication"
import Dashboard from "./components/admin/dashboard"
import Users from "./components/admin/User"
import UserDetails from "./components/admin/UserDetails"
import Jobs from "./components/admin/Jobs"
import JobDetails from "./components/admin/JobsDetails"
import AdminLayout from "./components/admin/AdminLayout"

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <Home />
          </ProtectedRoutes>
        ),
      },

      {
        path: "/explore",
        element: (
          <ProtectedRoutes>
            <Explore />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/postJob",
        element: (
          <ProtectedRoutes>
            <PostJob />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/postedJob",
        element: (
          <ProtectedRoutes>
            <PostedJobSeeker />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/explore/people",
        element: (
          <ProtectedRoutes>
            <ExplorePeople />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/account/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/chat",
        element: (
          <ProtectedRoutes>
            <ChatPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/notification",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/story/:storyId",
    element: <StoryViewer />,
  },
  {
    path: "/admin", // ✅ no slash at start
    element: (
      <ProtectedRoutes>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "user",
        element: <Users />,
      },
      {
        path: "user/:id",
        element: <UserDetails />,
      },
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "job/detail/:id",
        element: <JobDetails />,
      },
    ],
  },
])

function App() {
  const { user } = useSelector((store) => store.auth)
  const { socket } = useSelector((store) => store.socketio)
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) {
      const socketio = io(import.meta.env.VITE_BASE_URL, {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      })
      dispatch(setSocket(socketio))

      socketio.on("connect", () => {
        dispatch(setSocket(socketio))
      })

      // listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        // Only close the socket if it was successfully connected
        if (socketio.connected) {
          socketio.disconnect()
        }
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])

  return (
    <LanguageProvider>
      <RouterProvider router={browserRouter} />
    </LanguageProvider>
  )
}

export default App
