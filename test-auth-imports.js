import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "./src/controllers/auth.controller.js";
import { registerValidation } from "./src/validators/auth.validator.js";
import { isAuthenticated } from "./src/middlewares/auth.middleware.js";

console.log("express:", typeof express);
console.log("registerUser:", typeof registerUser);
console.log("registerValidation:", typeof registerValidation);
console.log("isAuthenticated:", typeof isAuthenticated);
