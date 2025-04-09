import express from "express"

import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"
import {
  addStory,
  commentOnStory,
  getAllStories,
  likeStory,
} from "../controllers/Story.controller.js"

const router = express.Router()

//Add story
router
  .route("/add-story")
  .post(isAuthenticated, upload.single("image"), addStory)
// comment to the story
router.post("/comment/:storyId", isAuthenticated, commentOnStory)
// like the story
router.post("/like/:storyId", isAuthenticated, likeStory)
// get all stories
router.get("/all", getAllStories)

export default router
