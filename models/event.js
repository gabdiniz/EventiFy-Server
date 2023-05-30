const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const Location = require("./location");
const User = require("./user");

const Event = connection.define("event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    vacancies: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    segment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING(2500),
        allowNull: false,
    },
    header: {
        type: DataTypes.STRING,
        allowNull: false,
    },
})
Event.belongsTo(Location);
User.hasOne(Event)

module.exports = Event;