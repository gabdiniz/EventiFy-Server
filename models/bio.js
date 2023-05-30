const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const User = require("./user");


const Bio = connection.define("bio", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    position: {
        type: DataTypes.STRING,
    },
    company: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
    }
})

User.hasOne(Bio);
Bio.belongsTo(User);

module.exports = Bio;