import sharp from "sharp"

import { getReceiverSocketId, io } from "../socket/socket.js"
import { Comment } from "../models/comment.model.js"
import cloudinary from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js"
import { User } from "../models/user.model.js"
import Notification from "../models/Notification.model.js"

export const addNewPost = async (req, res) => {
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
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    })
    const user = await User.findById(authorId)
    if (user) {
      user.posts.push(post._id)
      await user.save()
    }

    await post.populate({ path: "author", select: "-password" })

    return res.status(201).json({
      message: "New post added",
      post,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      })
    return res.status(200).json({
      posts,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username, profilePicture",
        },
      })
    return res.status(200).json({
      posts,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const likePost = async (req, res) => {
  try {
    const currentUserId = req.id
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }

    // Add user ID to the post's likes if not already liked
    await post.updateOne({ $addToSet: { likes: currentUserId } })
    await post.save()

    const postOwnerId = post.author.toString()

    // Don't notify yourself
    if (postOwnerId !== currentUserId) {
      const sender = await User.findById(currentUserId).select(
        "username profilePicture name"
      )

      // Save to database
      const newNotification = await Notification.create({
        recipient: postOwnerId,
        sender: currentUserId,
        type: "like",
        post: postId,
        message: `${sender.username} liked your post`,
      })

      // Emit to socket
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", {
          ...newNotification.toObject(),
          senderDetails: sender,
        })
      }
    }

    return res.status(200).json({ message: "Post liked", success: true })
  } catch (error) {
    console.error("Error in likePost:", error)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}

export const dislikePost = async (req, res) => {
  try {
    const currentUserId = req.id
    const postId = req.params.id

    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }

    // Remove like
    await post.updateOne({ $pull: { likes: currentUserId } })
    await post.save()

    const user = await User.findById(currentUserId).select(
      "username profilePicture name"
    )
    const postOwnerId = post.author.toString()

    // Don't notify if the user is unliking their own post
    if (postOwnerId !== currentUserId) {
      // Send real-time notification
      const postOwnerSocketId = getReceiverSocketId(postOwnerId)
      if (postOwnerSocketId) {
        io.to(postOwnerSocketId).emit("notification", {
          ...dbNotification.toObject(),
          senderDetails: user,
        })
      }
    }

    return res.status(200).json({ message: "Post disliked", success: true })
  } catch (error) {
    console.error("Error in dislikePost:", error)
    return res
      .status(500)
      .json({ message: "Internal server error", success: false })
  }
}

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.id
    const { text } = req.body

    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "Text is required", success: false })
    }

    const post = await Post.findById(postId).populate("author", "name")
    if (!post) {
      return res.status(404).json({ message: "Post not found", success: false })
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    })

    await comment.populate("author", "username profilePicture")

    post.comments.push(comment._id)
    await post.save()

    // 🔔 Send notification to post author (if commenter is not the author)
    if (post.author._id.toString() !== userId.toString()) {
      const sender = await User.findById(userId)

      await Notification.create({
        recipient: post.author._id,
        sender: userId,
        type: "comment",
        post: postId,
        message: `${sender.username} commented on your post.`,
      })
    }

    return res.status(201).json({
      message: "Comment added",
      comment,
      success: true,
    })
  } catch (error) {
    console.error("Error adding comment:", error)
    res.status(500).json({
      message: "Something went wrong while adding the comment",
      success: false,
    })
  }
}
export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    )

    if (!comments)
      return res
        .status(404)
        .json({ message: "No comments found for this post", success: false })

    return res.status(200).json({ success: true, comments })
  } catch (error) {
    console.log(error)
  }
}

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const authorId = req.id

    const post = await Post.findById(postId)
    if (!post)
      return res.status(404).json({ message: "Post not found", success: false })

    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId)
      return res.status(403).json({ message: "Unauthorized" })

    // delete post
    await Post.findByIdAndDelete(postId)

    // remove the post id from the user's post
    let user = await User.findById(authorId)
    user.posts = user.posts.filter((id) => id.toString() !== postId)
    await user.save()

    // delete associated comments
    await Comment.deleteMany({ post: postId })

    return res.status(200).json({
      success: true,
      message: "Post deleted",
    })
  } catch (error) {
    console.log(error)
  }
}

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id
    const currentUserId = req.id

    // Check if the post exists
    const existingPost = await Post.findById(postId).populate("author", "name")
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      })
    }

    // Check if the user exists
    const currentUser = await User.findById(currentUserId)
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const isBookmarked = currentUser.bookmarks.includes(postId)

    if (isBookmarked) {
      // Remove bookmark
      await User.updateOne(
        { _id: currentUserId },
        { $pull: { bookmarks: postId } }
      )

      return res.status(200).json({
        success: true,
        type: "unsaved",
        message: "Post removed from bookmarks",
      })
    } else {
      // Add to bookmarks
      await User.updateOne(
        { _id: currentUserId },
        { $addToSet: { bookmarks: postId } }
      )

      const recipientId = existingPost.author._id
      const senderName = currentUser.username

      // Avoid self-notification
      if (recipientId.toString() !== currentUserId.toString()) {
        await Notification.create({
          recipient: recipientId,
          sender: currentUserId,
          type: "message",
          post: postId,
          message: `${senderName} bookmarked your post.`,
        })
      }

      return res.status(200).json({
        success: true,
        type: "saved",
        message: "Post bookmarked successfully",
      })
    }
  } catch (error) {
    console.error("Error in bookmarkPost controller:", error)

    return res.status(500).json({
      success: false,
      message: "Something went wrong while bookmarking the post",
    })
  }
}

export const isPostBookmarked = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.id

    const user = await User.findById(userId)

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" })

    const isBookmarked = user.bookmarks.includes(postId)

    return res.status(200).json({ success: true, isBookmarked })
  } catch (err) {
    console.error("Error checking bookmark:", err)
    res.status(500).json({ success: false, message: "Server error" })
  }
}
