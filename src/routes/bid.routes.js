import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { placeBid, getBidStatus } from "../controllers/bid.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bids
 *   description: Bidding system for Alumni of the Day
 */

router.use(isAuthenticated);

/**
 * @swagger
 * /api/bids:
 *   post:
 *     summary: Place a bid for tomorrow's Alumni of the Day
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Bid amount (must be higher than current highest bid)
 *     responses:
 *       201:
 *         description: Bid placed successfully
 *       400:
 *         description: Invalid amount or bid too low
 *       403:
 *         description: Monthly win limit reached
 */
router.post("/", placeBid);

/**
 * @swagger
 * /api/bids/status:
 *   get:
 *     summary: Get user's upcoming bids
 *     tags: [Bids]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming bids
 */
router.get("/status", getBidStatus);


export default router;
