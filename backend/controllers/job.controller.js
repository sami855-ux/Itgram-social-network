import cloudinary from "../utils/cloudinary.js"
import Job from "../models/jobs.model.js"
import mongoose from "mongoose"
import sharp from "sharp"

// 1. Create a new job post

export const createJob = async (req, res) => {
  try {
    const {
      jobTitle,
      role,
      category,
      companyName,
      jobDescription,
      city = "addis abeba",
      country = "Ethiopa",
      employmentType = "fulltime",
      deadline,
      salary, // from frontend
      skills, // from frontend
    } = req.body

    const author = req.id // Ensure author is correctly fetched

    // Validate required fields
    if (
      !jobTitle?.trim() ||
      !role?.trim() ||
      !category?.trim() ||
      !companyName?.trim() ||
      !jobDescription?.trim()
    ) {
      return res
        .status(400)
        .json({ error: "Please fill in all required fields" })
    }

    // Validate employment type
    const validTypes = ["fulltime", "freelance", "contract", "internship"]
    if (!validTypes.includes(employmentType)) {
      return res.status(400).json({ error: "Invalid employment type" })
    }

    // Optional: validate salary range
    if (
      salary &&
      (typeof salary.min !== "number" || typeof salary.max !== "number")
    ) {
      return res
        .status(400)
        .json({ error: "Salary range must contain valid numbers" })
    }

    // Check if the same job (same jobTitle, companyName, and author) already exists
    const existingJob = await Job.findOne({
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      author: author,
    })

    if (existingJob) {
      return res.status(400).json({
        error: "You have already posted a job with the same title and company",
      })
    }

    // Create the new job
    const newJob = new Job({
      jobTitle: jobTitle.trim(),
      role: role.trim(),
      category: category.trim(),
      companyName: companyName.trim(),
      jobDescription: jobDescription.trim(),
      city: city.trim(),
      country: country.trim(),
      employmentType,
      deadline,
      salaryRange: salary,
      skillsRequired: skills,
      author,
    })

    // Save the job to the database
    const savedJob = await newJob.save()

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: savedJob,
    })
  } catch (error) {
    console.error("Error creating job:", error)
    res
      .status(500)
      .json({ success: false, error: "Server error while creating job" })
  }
}

// 2. Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("author", "username profilePicture")

    res.status(200).json({ success: true, jobs: jobs })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    res
      .status(500)
      .json({ success: false, error: "Server error while fetching jobs" })
  }
}

// 3. Get jobs posted by a specific user
export const getJobsByUser = async (req, res) => {
  try {
    const userId = req.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const jobs = await Job.find({ author: userId })
    res.status(200).json({ success: true, jobs: jobs })
  } catch (error) {
    console.error("Error fetching user jobs:", error)
    res.status(500).json({ error: "Server error while fetching user jobs" })
  }
}

// 4. Add an applicant to a job
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const { message } = req.body
    const userId = req.id
    const image = req.file

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    const alreadyApplied = job?.applicants?.some(
      (applicant) => applicant?.user?.toString() === userId.toString()
    )
    if (alreadyApplied) {
      return res
        .status(400)
        .json({ error: "You have already applied to this job" })
    }

    if (!image) {
      return res.status(400).json({ error: "Resume image is required" })
    }

    if (!message) {
      return res.status(400).json({ error: "Message is required" })
    }

    if (!image.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "Resume must be an image" })
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
      folder: "resumes",
      resource_type: "image",
      timestamp: Math.floor(Date.now() / 1000),
    })

    console.log("Debug values before push:", {
      user: userId,
      message,
      resumeUrl: cloudResponse?.secure_url,
    })

    if (!cloudResponse || !cloudResponse.secure_url) {
      return res.status(500).json({ error: "Failed to upload resume image" })
    }

    const applicant = {
      user: userId,
      message: message || "",
      resume: cloudResponse.secure_url,
    }

    console.log("Final applicant to push:", applicant)

    job.applicants.push(applicant)

    await job.save()

    res.status(200).json({
      message: "Application submitted successfully",
      resumeUrl: cloudResponse.secure_url,
      success: true,
    })
  } catch (error) {
    console.error("Error applying to job:", error)
    res.status(500).json({ error: "Server error while applying to job" })
  }
}

// 5. Get a single job by ID
export const getSingleJob = async (req, res) => {
  try {
    const jobId = req.params.jobId

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" })
    }

    const job = await Job.findById(jobId)
      .populate("author", "name email")
      .populate("applicants.user", "name email")

    if (!job) return res.status(404).json({ error: "Job not found" })

    res.status(200).json(job)
  } catch (error) {
    console.error("Error fetching job:", error)
    res.status(500).json({ error: "Server error while fetching job" })
  }
}

export const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const userId = req.id

    // Validate job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    if (job.author.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized to delete this job" })
    }

    await Job.findByIdAndDelete(jobId)

    res.status(200).json({
      message: "Job deleted successfully",
      success: true,
    })
  } catch (error) {
    console.error("Error deleting job:", error)
    res.status(500).json({ error: "Server error while deleting job" })
  }
}
// Get jobs that is applied by the user
export const getAppliedJobsByUser = async (req, res) => {
  try {
    const userId = req.id

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" })
    }

    const jobs = await Job.find({ "applicants.user": userId })
      .select("-applicants.resume")
      .populate("author", "-password")

    res.status(200).json({
      message: "Jobs applied to by user",
      success: true,
      count: jobs.length,
      jobs,
    })
  } catch (error) {
    console.error("Error getting applied jobs:", error)
    res.status(500).json({ error: "Server error while fetching applied jobs" })
  }
}

//User for unapply
export const unapplyFromJob = async (req, res) => {
  try {
    const jobId = req.params.jobId
    const userId = req.id

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ error: "Invalid job ID" })
    }

    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ error: "Job not found" })
    }

    const hasApplied = job.applicants.some(
      (applicant) => applicant.user.toString() === userId.toString()
    )

    if (!hasApplied) {
      return res.status(400).json({ error: "You have not applied to this job" })
    }

    job.applicants = job.applicants.filter(
      (applicant) => applicant.user.toString() !== userId.toString()
    )

    await job.save()

    res.status(200).json({
      success: true,
      message: "Successfully removed your application from this job",
    })
  } catch (error) {
    console.error("Error unapplying from job:", error)
    res.status(500).json({ error: "Server error while unapplying from job" })
  }
}
