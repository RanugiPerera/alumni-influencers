import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import bcrypt from "bcrypt";

const User = sequelize.define("User", {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
            this.setDataValue('username', val.toLowerCase());
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
        set(val) {
            this.setDataValue('email', val.toLowerCase());
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM("student", "faculty", "admin"),
        defaultValue: "student"
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    emailVerificationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    emailVerificationTokenExpires: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
    },
    resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    indexes: [
        { fields: ['emailVerificationToken'] },
        { fields: ['resetPasswordToken'] },
        { fields: ['email'] }
    ],
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }
    }
});

User.prototype.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

export { User };