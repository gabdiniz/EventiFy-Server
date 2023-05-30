const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const  User  = require("./user");


const Friendship = connection.define("friendship", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

    blocked: {
        type: DataTypes.BOOLEAN,
    },
});

Friendship.belongsTo(User, {
    foreignKey: {
        name: "senderId",
        allowNull: false,
    },
    as: "sender",
});

Friendship.belongsTo(User, {
    foreignKey: {
        name: "receiverId",
        allowNull: false,
    },
    as: "receiver",
});

module.exports = Friendship;
