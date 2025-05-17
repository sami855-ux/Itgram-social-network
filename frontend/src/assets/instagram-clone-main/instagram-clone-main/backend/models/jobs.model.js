import mongoose from "mongoose"

const jobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: "addis abeba",
  },
  country: {
    type: String,
    default: "Ethiopa",
  },

  employmentType: {
    type: String,
    enum: ["fulltime", "freelance", "contract", "internship"],
    default: "fulltime",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deadline: {
    type: Date,
  },
  salaryRange: {
    min: Number,
    max: Number,
  },
  skillsRequired: [
    {
      type: String,
    },
  ],
  applicants: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      message: { type: String, default: "" },
      resume: { type: String, required: true },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Job", jobSchema)
