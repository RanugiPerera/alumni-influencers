import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";

const Profile = sequelize.define("Profile", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    linkedInUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { 
            isUrl: true,
            contains: "linkedin.com"
        }
    },
    professionalCourses: {
        type: DataTypes.JSON, // Array of strings or objects
        defaultValue: []
    },
    licenses: {
        type: DataTypes.JSON, 
        defaultValue: []
    },
    certifications: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    profileImage: {
        type: DataTypes.STRING, // URL mapping to uploads folder
        allowNull: true
    },
    alumniOfTheDayWins: {
        type: DataTypes.JSON, // array of ISO date strings marking when they won
        defaultValue: []
    },
    eventsAttended: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    programme: {
        type: DataTypes.STRING,
        allowNull: true
    },
    graduationYear: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    industrySector: {
        type: DataTypes.STRING,
        allowNull: true
    },
    currentRole: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

// Associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { Profile };
