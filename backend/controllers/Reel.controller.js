import cloudinary from "../utils/cloudinary" // Assuming Cloudinary setup
import Reel from "../models/Reel"
import User from "../models/User"

export const addNewReel = async (req, res) => {
  try {
    const { caption, duration } = req.body
    const video = req.file
    const authorId = req.id

    if (!video) {
      return res.status(400).json({ message: "Video is required" })
    }

    // Upload the video to Cloudinary
    const cloudResponse = await cloudinary.uploader.upload(video.path, {
      resource_type: "video", // Specify that it's a video
    })

    const reel = await Reel.create({
      caption,
      video: cloudResponse.secure_url, // Cloudinary URL
      duration, // Optional: video duration
      author: authorId,
    })

    // Link the reel to the user
    const user = await User.findById(authorId)
    if (user) {
      user.reels.push(reel._id)
      await user.save()
    }

    return res.status(201).json({
      message: "Reel created successfully",
      reel,
      success: true,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}

export const likeReel = async (req, res) => {
  try {
    const reelId = req.params.id
    const userId = req.id

    const reel = await Reel.findById(reelId)

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" })
    }

    // Toggle like: If user has already liked, remove the like
    if (reel.likes.includes(userId)) {
      reel.likes = reel.likes.filter((like) => like.toString() !== userId)
    } else {
      reel.likes.push(userId)
    }

    await reel.save()

    return res.status(200).json({
      message: "Reel like updated successfully",
      likes: reel.likes.length,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const commentOnReel = async (req, res) => {
  try {
    const reelId = req.params.id
    const { comment } = req.body
    const userId = req.id

    const reel = await Reel.findById(reelId)

    if (!reel) {
      return res.status(404).json({ message: "Reel not found" })
    }

    const newComment = {
      user: userId,
      text: comment,
    }

    reel.comments.push(newComment)
    await reel.save()

    return res.status(201).json({
      message: "Comment added successfully",
      comments: reel.comments,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
export const getAllReels = async (req, res) => {
  try {
    const reels = await Reel.find()
      .populate("author", "username profilePicture") // Populate author details
      .sort({ createdAt: -1 }) // Sort by most recent

    return res.status(200).json(reels)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}
