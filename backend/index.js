import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"

import connectDB from "./utils/db.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import storyRoutes from "./routes/story.route.js"
import jobRoutes from "./routes/job.route.js"
import notificationRoute from "./routes/notification.route.js"
import adminRoutes from "./routes/admin.routes.js"
import { app, server } from "./socket/socket.js"

dotenv.config()
//mongodb://localhost:27017/itgram
// CONFIGURATION
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

const corsOptions = {
  origin: [
    "https://itgram-social-network-w6pm.vercel.app",
    "https://instagram-clone-ybbi.vercel.app",
    "http://localhost:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}

app.use(cors(corsOptions))

//MONGOOSE
connectDB()

//ROUTES
app.use("/api/v1/user", userRoute)
app.use("/api/v1/post", postRoute)
app.use("/api/v1/message", messageRoute)
app.use("/api/v1/story", storyRoutes)
app.use("/api/v1/job", jobRoutes)
app.use("/api/v1/notifications", notificationRoute)
app.use("/api/v1/admin", adminRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist")))

server.listen(PORT, () => {
  console.log(`Server listen at port ${PORT} ⚡`)
})
