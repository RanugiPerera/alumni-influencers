import express from "express";
import { sessionConfig } from "./config/session.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use(sessionConfig);

app.use("/api/auth", authRoutes);

export default app;
