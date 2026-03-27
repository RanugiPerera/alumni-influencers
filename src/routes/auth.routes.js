import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/auth.controller.js";

import { registerValidation } from "../validators/auth.validator.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidation, registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", isAuthenticated, logoutUser);
router.get("/profile", isAuthenticated, (req, res) => {
  res.json({
    message: "Secure profile data",
    userId: req.session.userId
  });
});

export default router;