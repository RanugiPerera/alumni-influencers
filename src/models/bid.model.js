import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { User } from "./user.model.js";

const Bid = sequelize.define("Bid", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("winning", "losing", "won"),
        defaultValue: "winning"
    },
    bidDate: {
        type: DataTypes.DATEONLY, // Target date the bid is placed for (i.e. 'tomorrow')
        allowNull: false
    }
}, {
    indexes: [
        { fields: ['bidDate'] },
        { fields: ['userId', 'bidDate'] }
    ]
});

User.hasMany(Bid, { foreignKey: 'userId' });
Bid.belongsTo(User, { foreignKey: 'userId' });

export { Bid };
