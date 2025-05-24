import express from "express"
import {
  createNotification,
  getNotificationsForUser,
  markAsRead,
  deleteNotification,
} from "../controllers/Notification.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

// Create a new notification
router.post("/", isAuthenticated, createNotification)

// Get all notifications for a specific user
router.get("/:userId", isAuthenticated, getNotificationsForUser)

// Mark a notification as read
router.patch("/read/:id", markAsRead)

// Delete a notification
router.delete("/:id", isAuthenticated, deleteNotification)

export default router
