import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import Story from "../models/Story.js"
import { User } from "../models/user.model.js"

export const addStory = async (req, res) => {
  try {
    const { caption } = req.body
    const image = req.file
    const authorId = req.id

    if (!image) return res.status(400).json({ message: "Image required" })

    // image upload
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer()

    // buffer to data uri
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
    const user = await User.findById(authorId)
    if (user) {
      user.stories.push(story._id)
      await user.save()
    }

    await story.populate({ path: "author", select: "-password" })

    return res.status(201).json({
      message: "New Story is added successfully",
      story,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const likeStory = async (req, res) => {
  try {
    const { storyId } = req.params
    const userId = req.id

    const story = await Story.findById(storyId)
    if (!story) return res.status(404).json({ message: "Story not found" })

    const alreadyLiked = story.likes.includes(userId)

    if (alreadyLiked) {
      story.likes.pull(userId)
    } else {
      story.likes.push(userId)
    }

    await story.save()

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: story.likes.length,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
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
      .populate("comments.user", "username _id") // Include user ID for the commenters as well
      // Assuming you also have an image field in the Story model
      .select("media") // Select the image field from the Story model (if it exists)

    res.status(200).json({
      success: true,
      stories,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
