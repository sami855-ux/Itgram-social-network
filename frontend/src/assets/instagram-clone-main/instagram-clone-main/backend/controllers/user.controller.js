import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import dotenv from "dotenv"

import getDataUri from "../utils/datauri.js"
import { User } from "../models/user.model.js"
import cloudinary from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js"

dotenv.config()

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body

    if (!username || !email || !password || !role) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      })
    }
    const user = await User.findOne({ email })
    if (user) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "job seeker",
    })
    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      })
    }
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      })
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      })
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    })

    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId)
        if (post.author.equals(user._id)) {
          return post
        }
        return null
      })
    )
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
      role: user.role,
    }
    return res
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      })
  } catch (error) {
    console.log(error)
  }
}
export const logout = async (_, res) => {
  try {
    return res.cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks")
    return res.status(200).json({
      user,
      success: true,
    })
  } catch (error) {
    console.log(error)
  }
}

export const editProfile = async (req, res) => {
  try {
    const userId = req.id
    const { bio, gender } = req.body
    const profilePicture = req.file
    let cloudResponse

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture)
      cloudResponse = await cloudinary.uploader.upload(fileUri)
    }

    const user = await User.findById(userId).select("-password")
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      })
    }
    if (bio) user.bio = bio
    if (gender) user.gender = gender
    if (profilePicture) user.profilePicture = cloudResponse.secure_url

    await user.save()

    return res.status(200).json({
      message: "Profile updated.",
      success: true,
      user,
    })
  } catch (error) {
    console.log(error)
  }
}
export const getSuggestedUsers = async (req, res) => {
  try {
    // Step 1: Get the current user
    const currentUser = await User.findById(req.id)

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    // Step 2: Get list of user IDs the current user is following
    const following = currentUser.following || []

    // Step 3: Find users that are NOT the current user and NOT in the following list
    const suggestedUsers = await User.find({
      _id: { $ne: req.id, $nin: following },
    }).select("-password")

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}

export const followOrUnfollow = async (req, res) => {
  try {
    const followerId = req.id // The ID of the user who wants to follow/unfollow
    const targetUserId = req.params.id // The ID of the user being followed/unfollowed

    if (followerId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      })
    }

    const user = await User.findById(followerId) // Get the user who is following/unfollowing
    const targetUser = await User.findById(targetUserId) // Get the user being followed/unfollowed

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      })
    }

    // Check if the user is already following the target user
    const isFollowing = user.following.includes(targetUserId)

    if (isFollowing) {
      // If already following, unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: followerId } }
        ),
      ])
      return res
        .status(200)
        .json({ message: "Unfollowed successfully", success: true })
    } else {
      // If not following, follow logic
      await Promise.all([
        User.updateOne(
          { _id: followerId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: followerId } }
        ),
      ])
      return res
        .status(200)
        .json({ message: "Followed successfully", success: true })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    })
  }
}

export const checkFollowing = async (req, res) => {
  const currentUserId = req.id
  const targetUserId = req.params.id

  try {
    const currentUser = await User.findById(currentUserId)
    const isFollowing = currentUser.following.includes(targetUserId)

    res.json({ success: true, isFollowing })
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
}

export const getUsersForMessaging = async (req, res) => {
  console.log("hi")
  try {
    const userId = req.id
    console.log(req.id)

    const currentUser = await User.findById(userId)

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const followingIds = currentUser.following || []

    const followedUsers = await User.find({
      _id: { $in: followingIds },
    }).select("-password")

    const unfollowedUsers = await User.find({
      _id: { $ne: userId, $nin: followingIds },
    }).select("-password")

    const allUsers = [...followedUsers, ...unfollowedUsers]

    return res.status(200).json({
      success: true,
      users: allUsers,
    })
  } catch (error) {
    console.error("Error getting users for messaging:", error)
    res.status(500).json({ message: "Server Error", success: false })
  }
}

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ message: "Search query is required" })
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
      ],
    }).select("-password")

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" })
    }

    return res.status(200).json({ success: true, users })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Server error" })
  }
}
export const getRecruiters = async (req, res) => {
  try {
    const currentUserId = req.id

    const recruiters = await User.find({
      role: "recruiter",
      _id: { $ne: currentUserId }, // exclude current user
    }).select("-password")

    res.status(200).json({ user: recruiters, success: true })
  } catch (error) {
    console.error("Failed to fetch recruiters:", error)
    res.status(500).json({ message: "Server error while fetching recruiters" })
  }
}
