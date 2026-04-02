import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { uploadProfileImage } from "../middlewares/upload.middleware.js";
import { createOrUpdateProfile, getMyProfile, deleteProfile } from "../controllers/profile.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: User profile management
 */

// All profile routes require authentication
router.use(isAuthenticated);

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get currently logged in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *       404:
 *         description: Profile not found
 */
router.get("/", getMyProfile);

/**
 * @swagger
 * /api/profile:
 *   post:
 *     summary: Create or update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               linkedInUrl:
 *                 type: string
 *               professionalCourses:
 *                 type: string
 *                 description: JSON array string of courses
 *               licenses:
 *                 type: string
 *                 description: JSON array string of licenses
 *               certifications:
 *                 type: string
 *                 description: JSON array string of certifications
 *     responses:
 *       201:
 *         description: Profile created
 *       200:
 *         description: Profile updated
 */
router.post("/", uploadProfileImage.single('profileImage'), createOrUpdateProfile);

/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               linkedInUrl:
 *                 type: string
 *               professionalCourses:
 *                 type: string
 *               licenses:
 *                 type: string
 *               certifications:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put("/", uploadProfileImage.single('profileImage'), createOrUpdateProfile);

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 */
router.delete("/", deleteProfile);


export default router;
