import session from "express-session";
import MongoStore from "connect-mongo";

if (!process.env.MONGO_URI) {
  throw new Error("❌ MONGO_URI is undefined. Check .env loading.");
}

export const sessionConfig = session({
  name: "sid",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }
});