import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail
} from "../controllers/auth.controller.js";

import { registerValidation } from "../validators/auth.validator.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);

export default router;