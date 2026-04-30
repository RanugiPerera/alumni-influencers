import { UsageLog } from "../models/usageLog.model.js";

export const trackUsage = (req, res, next) => {
    // We wait for the response to finish to log the status code
    res.on("finish", async () => {
        try {
            await UsageLog.create({
                clientIdentifier: req.clientId || "anonymous",
                endpoint: req.originalUrl,
                method: req.method,
                statusCode: res.statusCode,
                ipAddress: req.ip
            });
        } catch (error) {
            console.error("Failed to log usage:", error);
        }
    });
    next();
};
