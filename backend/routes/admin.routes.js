import express from "express"
import { getAdminStats } from "../controllers/admin.controller.js"
import isAuthenticated from "../middlewares/isAuthenticated.js"

const router = express.Router()

// Route: GET /api/admin/stats
router.get("/stats", isAuthenticated, getAdminStats)

export default router
