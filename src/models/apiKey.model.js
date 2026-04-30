import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

const ApiKey = sequelize.define("ApiKey", {
    key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    clientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.JSON, // e.g., ["read:alumni", "read:analytics"]
        allowNull: false,
        defaultValue: []
    },
    lastUsedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    usageCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

export { ApiKey };
