import { sequelize } from "../src/config/database.js";
import { seedScenarioData } from "../src/services/seeder.service.js";

const runSeed = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');
        
        // Sync models first if needed
        await sequelize.sync({ alter: true });
        
        await seedScenarioData();
        console.log('Seeding complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

runSeed();
