import express from "express"

import isAuthenticated from "../middlewares/isAuthenticated.js"
import upload from "../middlewares/multer.js"
import {
  applyToJob,
  createJob,
  deleteJob,
  getAllJobs,
  getAppliedJobsByUser,
  getJobsByUser,
  unapplyFromJob,
} from "../controllers/job.controller.js"

const router = express.Router()

//Add job
router.post("/addJob", isAuthenticated, createJob)

//Get all job
router.get("/getall", isAuthenticated, getAllJobs)

// Get all the job for a user
router.get("/getJobsForUser", isAuthenticated, getJobsByUser)

//apply to the job
router
  .route("/applyJob/:jobId")
  .post(isAuthenticated, upload.single("image"), applyToJob)

//Delete job
router.delete("/delete/:jobId", isAuthenticated, deleteJob)

//Unapply job
router.delete("/unapply/:jobId", isAuthenticated, unapplyFromJob)

//Get user applied jobs
router.get("/getUserJob", isAuthenticated, getAppliedJobsByUser)

export default router
