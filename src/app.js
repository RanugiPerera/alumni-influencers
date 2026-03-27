import express from "express";
import { sessionConfig } from "./config/session.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import bidRoutes from "./routes/bid.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet()); // Security headers
app.use(cors({
  origin: "http://localhost:3000", // Allow frontend origins
  credentials: true 
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: "Too many authentication requests from this IP, please try again after 15 minutes"
});

app.use(express.json());
app.use(sessionConfig);

// Serve uploads statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use("/api/auth", authLimiter, authRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/bids", bidRoutes);

export default app;
