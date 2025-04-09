import mongoose from "mongoose"

const reelSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    video: {
      type: String, // This will hold the URL to the video (or you can store the file path if using local storage)
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    duration: {
      type: Number, // Video duration in seconds (optional)
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String },
      },
    ],
  },
  { timestamps: true }
)

const Reel = mongoose.model("Reel", reelSchema)

export default Reel
