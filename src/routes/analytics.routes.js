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

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting endpoints
 */

/**
 * @swagger
 * /api/analytics/seed:
 *   post:
 *     summary: Seed analytics scenario data (Development)
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Scenario data seeded successfully
 *       500:
 *         description: Seeding failed
 */
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
/**
 * @swagger
 * /api/analytics/skills-gap:
 *   get:
 *     summary: Get skills gap data
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Skills gap data retrieved
 */
router.get("/skills-gap", getSkillsGapData);

/**
 * @swagger
 * /api/analytics/employment-trends:
 *   get:
 *     summary: Get employment trends data
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Employment trends data retrieved
 */
router.get("/employment-trends", getEmploymentTrends);

/**
 * @swagger
 * /api/analytics/graduation-metrics:
 *   get:
 *     summary: Get graduation metrics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Graduation metrics retrieved
 */
router.get("/graduation-metrics", getGraduationMetrics);

/**
 * @swagger
 * /api/analytics/bidding-trends:
 *   get:
 *     summary: Get bidding trends data
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Bidding trends data retrieved
 */
router.get("/bidding-trends", getBiddingTrends);

// Scoped access for protected analytics
/**
 * @swagger
 * /api/analytics/career-pathways:
 *   get:
 *     summary: Get career pathways data
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Career pathways data retrieved
 */
router.get("/career-pathways", isAuthenticated, authorizeScope("read:analytics"), getCareerPathways);

/**
 * @swagger
 * /api/analytics/usage-stats:
 *   get:
 *     summary: Get usage stats
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usage stats retrieved
 */
router.get("/usage-stats", isAuthenticated, authorizeScope("read:analytics"), getUsageStats);

/**
 * @swagger
 * /api/analytics/dashboard-summary:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved
 */
router.get("/dashboard-summary", isAuthenticated, authorizeScope("read:analytics"), getDashboardSummary);

/**
 * @swagger
 * /api/analytics/alumni:
 *   get:
 *     summary: Get list of alumni
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alumni list retrieved
 */
router.get("/alumni", isAuthenticated, authorizeScope("read:analytics"), getAlumniList);

export default router;
