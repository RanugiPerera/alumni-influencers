import express from "express";
import { Bid } from "../models/bid.model.js";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Publicly accessible endpoints for AR client and students
 */

/**
 * @swagger
 * /api/public/alumni-of-the-day:
 *   get:
 *     summary: Get the current highlighted Alumni of the Day
 *     tags: [Public]
 *     responses:
 *       200:
 *         description: Profile of the current Alumni of the Day
 *       404:
 *         description: No winner found for today
 */
router.get("/alumni-of-the-day", async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Find the winning bid for today
        const winningBid = await Bid.findOne({
            where: { 
                bidDate: today,
                status: "won"
            },
            include: [{
                model: User,
                include: [{
                    model: Profile,
                    as: 'profile'
                }]
            }]
        });

        if (!winningBid || !winningBid.User || !winningBid.User.profile) {
            return res.status(404).json({ message: "No Alumni of the Day scheduled for today." });
        }

        const profile = winningBid.User.profile;
        const user = winningBid.User;

        res.json({
            alumniOfTheDay: {
                username: user.username,
                linkedInUrl: profile.linkedInUrl,
                profileImage: profile.profileImage,
                certifications: profile.certifications,
                licenses: profile.licenses,
                professionalCourses: profile.professionalCourses,
                bidAmount: winningBid.amount,
                pocketedAmount: winningBid.pocketedAmount
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching daily winner", error: error.message });
    }
});

export default router;
