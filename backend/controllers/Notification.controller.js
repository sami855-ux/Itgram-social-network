import Notification from "../models/Notification.model.js"
import mongoose from "mongoose"

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, post, story, job, message } = req.body

    const newNotif = new Notification({
      recipient,
      sender,
      type,
      post,
      story,
      job,
      message,
    })

    await newNotif.save()
    res.status(201).json(newNotif)
  } catch (error) {
    console.error("Create Notification Error:", error)
    res.status(500).json({ error: "Failed to create notification" })
  }
}

// Get all notifications for a user
export const getNotificationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId

    const notifs = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePicture")
      .populate("post", "image caption")
      .populate("story")
      .populate("job", "title")

    res.json(notifs)
  } catch (error) {
    console.error("Get Notifications Error:", error)
    res.status(500).json({ error: "Failed to fetch notifications" })
  }
}

// Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const notifId = req.params.id

    const updated = await Notification.findByIdAndUpdate(
      notifId,
      { isRead: true },
      { new: true }
    )

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json(updated)
  } catch (error) {
    console.error("Mark Read Error:", error)
    res.status(500).json({ error: "Failed to mark notification as read" })
  }
}

// Delete a notification
export const deleteNotification = async (req, res) => {
  try {
    const notifId = req.params.id

    const deleted = await Notification.findByIdAndDelete(notifId)

    if (!deleted) {
      return res.status(404).json({ error: "Notification not found" })
    }

    res.json({ message: "Notification deleted" })
  } catch (error) {
    console.error("Delete Notification Error:", error)
    res.status(500).json({ error: "Failed to delete notification" })
  }
}
