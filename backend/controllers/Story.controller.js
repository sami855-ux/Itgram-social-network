import sharp from "sharp"

import { getReceiverSocketId, io } from "../socket/socket.js"
import cloudinary from "../utils/cloudinary.js"
import { User } from "../models/user.model.js"
import Story from "../models/Story.js"

export const addStory = async (req, res) => {
  try {
    const { caption } = req.body
    const image = req.file
    const authorId = req.id

    if (!image) return res.status(400).json({ message: "Image required" })

    // Optimize image
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer()

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`

    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      timestamp: Math.floor(Date.now() / 1000),
    })

    const story = await Story.create({
      caption,
      media: cloudResponse.secure_url,
      author: authorId,
    })

    const user = await User.findById(authorId).select(
      "followers stories username profilePicture"
    )
    if (user) {
      user.stories.push(story._id)
      await user.save()
    }

    await story.populate({ path: "author", select: "username profilePicture" })

    // Notify followers
    if (user?.followers?.length > 0) {
      const notifications = user.followers.map(async (followerId) => {
        const notification = await Notification.create({
          recipient: followerId,
          sender: authorId,
          type: "story",
          message: `${user.username} has posted a new story.`,
          story: story._id,
        })
      })

      await Promise.all(notifications)
    }

    return res.status(201).json({
      message: "New story is added successfully",
      story,
      success: true,
    })
  } catch (error) {
    console.error("Error adding story:", error)
    return res.status(500).json({
      success: false,
      message: "Server error while adding story",
    })
  }
}

export const commentOnStory = async (req, res) => {
  try {
    const { storyId } = req.params
    const { text } = req.body
    const userId = req.id

    const story = await Story.findById(storyId)
    if (!story) return res.status(404).json({ message: "Story not found" })

    story.comments.push({ user: userId, text })
    await story.save()

    res.status(200).json({
      success: true,
      message: "Comment added",
      comments: story.comments,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find()
      .populate("author", "username profilePicture _id") // Include user ID along with username and profile picture
      .populate("comments.user", "username _id")
      .select("media")
      .select("createdAt")
      .select("caption")

    res.status(200).json({
      success: true,
      stories,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// --- Like Story ---
export const likeStory = async (req, res) => {
  try {
    const userId = req.id
    const storyId = req.params.id

    const story = await Story.findById(storyId)
    if (!story) {
      return res
        .status(404)
        .json({ message: "Story not found", success: false })
    }

    // Add like
    await story.updateOne({ $addToSet: { likes: userId } })

    // Notify if the user liking isn't the story owner
    const storyOwnerId = story.author.toString()
    if (storyOwnerId !== userId) {
      const user = await User.findById(userId).select("username profilePicture")

      const notification = {
        type: "like",
        userId,
        userDetails: user,
        storyId,
        message: "Your story was liked",
      }

      const socketId = getReceiverSocketId(storyOwnerId)
      if (socketId) io.to(socketId).emit("notification", notification)
    }

    return res.status(200).json({ message: "Story liked", success: true })
  } catch (err) {
    console.error("Like story error:", err)
    res.status(500).json({ message: "Server error", success: false })
  }
}

// --- Dislike Story ---
export const dislikeStory = async (req, res) => {
  try {
    const userId = req.id
    const storyId = req.params.id

    const story = await Story.findById(storyId)
    if (!story) {
      return res
        .status(404)
        .json({ message: "Story not found", success: false })
    }

    // Remove like
    await story.updateOne({ $pull: { likes: userId } })

    // Notify if the user disliking isn't the story owner
    const storyOwnerId = story.author.toString()
    if (storyOwnerId !== userId) {
      const user = await User.findById(userId).select("username profilePicture")

      const notification = {
        type: "dislike",
        userId,
        userDetails: user,
        storyId,
        message: "Your story was unliked",
      }

      const socketId = getReceiverSocketId(storyOwnerId)
      if (socketId) io.to(socketId).emit("notification", notification)
    }

    return res.status(200).json({ message: "Story disliked", success: true })
  } catch (err) {
    console.error("Dislike story error:", err)
    res.status(500).json({ message: "Server error", success: false })
  }
}
