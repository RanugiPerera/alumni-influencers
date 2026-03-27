import session from "express-session";
import connectSessionSequelize from "connect-session-sequelize";
import { sequelize } from "./database.js";

const SequelizeStore = connectSessionSequelize(session.Store);

export const sessionConfig = session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStore({
        db: sequelize,
    }),
    cookie: {
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    }
});