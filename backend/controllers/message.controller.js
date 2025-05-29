import { Conversation } from "../models/conversation.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import Notification from "../models/Notification.model.js"

import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id
    const receiverId = req.params.id
    const { textMessage: message } = req.body
    const image = req.file || null

    let imageUrl = null

    // Validate that at least one of text or image is present
    if (!message && !image) {
      return res.status(400).json({
        success: false,
        error: "Either text message or image is required",
      })
    }

    // Process image if present
    if (image) {
      // Validate image type
      if (!image.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          error: "File must be an image",
        })
      }

      // Optimize image
      const optimizedImageBuffer = await sharp(image.buffer)
        .resize({ width: 1000, height: 1000, fit: "inside" })
        .toFormat("jpeg", { quality: 80 })
        .toBuffer()

      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
        "base64"
      )}`

      // Upload to Cloudinary
      const cloudResponse = await cloudinary.uploader.upload(fileUri, {
        folder: "chat_images",
        resource_type: "image",
        timestamp: Math.floor(Date.now() / 1000),
      })

      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({
          success: false,
          error: "Failed to upload image",
        })
      }

      imageUrl = cloudResponse.secure_url
    }

    // Check or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    })

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      })
    }

    // Create message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message || null,
      image: imageUrl || null,
    })

    // Append message to conversation
    if (newMessage) conversation.messages.push(newMessage._id)

    await Promise.all([conversation.save(), newMessage.save()])

    // Fetch sender details for notification
    const sender = await User.findById(senderId).select(
      "username profilePicture"
    )

    // Create appropriate notification message
    const notificationMessage = imageUrl
      ? message
        ? `${sender.username} sent you a message with an image`
        : `${sender.username} sent you an image`
      : `${sender.username} sent you a message`

    // Create a database notification
    const newNotification = await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "message",
      message: notificationMessage,
    })

    // Real-time delivery via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
      io.to(receiverSocketId).emit("notification", {
        ...newNotification.toObject(),
        senderDetails: sender,
      })
    }

    return res.status(201).json({
      success: true,
      newMessage,
    })
  } catch (error) {
    console.error("Error in sendMessage:", error)
    res.status(500).json({
      success: false,
      error: "Failed to send message",
      details: error.message,
    })
  }
}

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id
    const receiverId = req.params.id

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages")

    if (!conversation)
      return res.status(200).json({ success: true, messages: [] })

    return res
      .status(200)
      .json({ success: true, messages: conversation?.messages })
  } catch (error) {
    console.log(error)
  }
}

// DELETE /api/messages/:id
export const deleteMessage = async (req, res) => {
  const { id } = req.params

  try {
    const deletedMessage = await Message.findByIdAndDelete(id)

    if (!deletedMessage) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" })
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" })
  } catch (error) {
    console.error("Error deleting message:", error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}
