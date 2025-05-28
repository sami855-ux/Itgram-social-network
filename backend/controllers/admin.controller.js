import { User } from "../models/user.model.js"
import Job from "../models/jobs.model.js"
import { Post } from "../models/post.model.js"

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalJobs = await Job.countDocuments()
    const totalPosts = await Post.countDocuments()

    // Recent job applications
    const jobsWithApplicants = await Job.find({
      "applicants.0": { $exists: true },
    })
      .sort({ "applicants.appliedAt": -1 })
      .limit(5)
      .populate("applicants.user", "username email")
      .select("jobTitle applicants")

    const recentActions = []

    for (let job of jobsWithApplicants) {
      job.applicants.forEach((app) => {
        recentActions.push({
          user: app.user?.username || "Unknown",
          jobTitle: job.jobTitle,
          status: "Applied",
          date: new Date(app.appliedAt).toISOString().split("T")[0],
          avatar: app.user?.username
            ? app.user.username
                .split(" ")
                .map((n) => n[0].toUpperCase())
                .join("")
            : "??",
        })
      })
    }

    recentActions.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Full user and job data
    const users = await User.find().populate("posts")
    const jobs = await Job.find().populate("author applicants.user")

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalPosts,
      recentActions: recentActions.slice(0, 5),
      users,
      jobs,
    })
  } catch (err) {
    console.error("Error in getAdminStats:", err)
    res.status(500).json({ message: "Failed to fetch admin stats" })
  }
}
