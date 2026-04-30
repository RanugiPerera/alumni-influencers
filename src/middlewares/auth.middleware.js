import { ApiKey } from "../models/apiKey.model.js";

export const isAuthenticated = async (req, res, next) => {
  // 1. Check for session first
  if (req.session && req.session.userId) {
    req.authMethod = "session";
    req.clientId = `user_${req.session.userId}`;
    return next();
  }

  // 2. Check for API key in Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const key = authHeader.split(" ")[1];
    
    try {
      const apiKeyRecord = await ApiKey.findOne({ where: { key, isActive: true } });
      if (apiKeyRecord) {
        req.authMethod = "apikey";
        req.apiKeyRecord = apiKeyRecord;
        req.clientId = apiKeyRecord.clientName;
        
        // Update last used
        apiKeyRecord.lastUsedAt = new Date();
        apiKeyRecord.usageCount += 1;
        await apiKeyRecord.save();
        
        return next();
      }
    } catch (error) {
      console.error("API Key auth error:", error);
    }
  }

  return res.status(401).json({ message: "Not authenticated" });
};

export const authorizeScope = (requiredScope) => {
  return (req, res, next) => {
    // Session users (admins/faculty) might have all permissions or we check role
    if (req.authMethod === "session") {
        // role check for university staff
        // For universities, we assume they have access to everything if logged in
        return next();
    }

    if (req.authMethod === "apikey") {
        const scopes = req.apiKeyRecord.permissions || [];
        if (scopes.includes(requiredScope)) {
            return next();
        }
    }

    return res.status(403).json({ message: `Insufficient permissions. Required scope: ${requiredScope}` });
  };
};
