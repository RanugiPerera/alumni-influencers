import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('\n MySQL connected via Sequelize !!!');
        // Sync models with database
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error("MySQL connection failed", error);
        process.exit(1);
    }
};

export { sequelize };
export default connectDB;