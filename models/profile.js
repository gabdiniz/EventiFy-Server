const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const User = require("./user");

const Profile = connection.define('profile', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    avatar: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
    }
});

User.hasOne(Profile);
Profile.belongsTo(User);

module.exports = Profile;