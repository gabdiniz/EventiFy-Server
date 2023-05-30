const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");

const User = connection.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "participante",
        allowNull: false
    },
    newsLetter: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    resetToken: {
        type: DataTypes.STRING
    }
});

module.exports = User;