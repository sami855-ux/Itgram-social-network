import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("✅ Successfully connected to MongoDB!")
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message)
    process.exit(1) // Stop the server if MongoDB is not connected
  }
}

export default connectDB
