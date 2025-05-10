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
    "http://localhost:5173",
    "https://instagram-clone-eight-theta.vercel.app/",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
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

app.use(express.static(path.join(__dirname, "/frontend/dist")))

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
// })

server.listen(PORT, () => {
  console.log(`Server listen at port ${PORT} ⚡`)
})
