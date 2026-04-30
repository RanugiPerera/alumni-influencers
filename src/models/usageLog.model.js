import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const UsageLog = sequelize.define("UsageLog", {
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    clientIdentifier: {
        type: DataTypes.STRING, // API Key name or User ID
        allowNull: false
    },
    endpoint: {
        type: DataTypes.STRING,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    },
    statusCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ipAddress: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export { UsageLog };
