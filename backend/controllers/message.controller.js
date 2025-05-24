import { Conversation } from "../models/conversation.model.js"
import { getReceiverSocketId, io } from "../socket/socket.js"
import { Message } from "../models/message.model.js"
import { User } from "../models/user.model.js"
import Notification from "../models/Notification.model.js"

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id
    const receiverId = req.params.id
    const { textMessage: message } = req.body

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
      message,
    })

    // Append message to conversation
    if (newMessage) conversation.messages.push(newMessage._id)

    await Promise.all([conversation.save(), newMessage.save()])

    // Fetch sender details for notification
    const sender = await User.findById(senderId).select(
      "username profilePicture"
    )

    // Create a database notification
    const newNotification = await Notification.create({
      recipient: receiverId,
      sender: senderId,
      type: "message",
      message: `${sender.username} sent you a message`,
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
    res.status(500).json({ success: false, message: "Failed to send message" })
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
