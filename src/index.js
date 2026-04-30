// src/index.js
import connectDB from "./config/database.js";


import app from "./app.js";
import { startCronJobs } from "./services/cron.service.js";

const startServer = async () => {
    try {
        await connectDB();
        
        // Seed initial scenario data (Keys, Users, Profiles)
        const { seedScenarioData } = await import("./services/seeder.service.js");
        await seedScenarioData();

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error;
        });

        // Start scheduled jobs
        startCronJobs();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.log("MySQL connection failed!!", error);
    }
}

startServer();