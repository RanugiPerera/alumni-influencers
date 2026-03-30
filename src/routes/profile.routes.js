import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { uploadProfileImage } from "../middlewares/upload.middleware.js";
import { createOrUpdateProfile, getMyProfile, deleteProfile } from "../controllers/profile.controller.js";

const router = express.Router();

// All profile routes require authentication
router.use(isAuthenticated);

router.post("/", uploadProfileImage.single('profileImage'), createOrUpdateProfile);
router.put("/", uploadProfileImage.single('profileImage'), createOrUpdateProfile);
router.get("/", getMyProfile);
router.delete("/", deleteProfile);

export default router;
