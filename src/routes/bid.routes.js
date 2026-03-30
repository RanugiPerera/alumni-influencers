import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { placeBid, getBidStatus } from "../controllers/bid.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/", placeBid);
router.get("/status", getBidStatus);

export default router;
