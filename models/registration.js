const { connection } = require("../db/db");
const { DataTypes } = require("sequelize");

const User = require("./user");
const Profile = require("./profile");
const Event = require("./event");

const Registration = connection.define("registration", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    checkin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    qrCode: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            len:[1, 5000]
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

User.hasMany(Registration);
Profile.hasMany(Registration);
Event.hasMany(Registration);
Registration.belongsTo(User);
Registration.belongsTo(Event);
Registration.belongsTo(Profile);

module.exports = Registration;
