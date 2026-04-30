import express from "express";
import { 
    getSkillsGapData, 
    getCareerPathways, 
    getUsageStats,
    getBiddingTrends,
    getDashboardSummary,
    getAlumniList,
    getEmploymentTrends,
    getGraduationMetrics
} from "../controllers/analytics.controller.js";
import { seedScenarioData } from "../services/seeder.service.js";
import { isAuthenticated, authorizeScope } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Development helper to seed data
router.post("/seed", async (req, res) => {
    try {
        await seedScenarioData();
        res.json({ message: "Scenario data seeded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Seeding failed", error: error.message });
    }
});


// Public access for analytics charts
router.get("/skills-gap", getSkillsGapData);
router.get("/employment-trends", getEmploymentTrends);
router.get("/graduation-metrics", getGraduationMetrics);
router.get("/bidding-trends", getBiddingTrends);

// Scoped access for protected analytics
router.get("/career-pathways", isAuthenticated, authorizeScope("read:analytics"), getCareerPathways);
router.get("/usage-stats", isAuthenticated, authorizeScope("read:analytics"), getUsageStats);
router.get("/dashboard-summary", isAuthenticated, authorizeScope("read:analytics"), getDashboardSummary);
router.get("/alumni", isAuthenticated, authorizeScope("read:analytics"), getAlumniList);

export default router;

