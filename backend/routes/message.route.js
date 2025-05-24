import express from "express"

import {
  deleteMessage,
  getMessage,
  sendMessage,
} from "../controllers/message.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"

const router = express.Router()

router.route("/send/:id").post(isAuthenticated, sendMessage)
router.route("/all/:id").get(isAuthenticated, getMessage)

router.delete("/:id", deleteMessage)

export default router
