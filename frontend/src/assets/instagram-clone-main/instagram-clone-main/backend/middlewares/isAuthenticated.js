import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      })
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    req.id = decoded.userId // Attach user ID to request for later use

    next() // Move on to the next middleware/controller
  } catch (error) {
    console.error("Auth Middleware Error:", error)

    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    })
  }
}

export default isAuthenticated
