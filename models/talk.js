const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const Speaker = require("./speaker");
const Event = require("./event");

const Talk = connection.define("talk", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    }, 
    startDate:{
        type: DataTypes.DATE,
        allowNull:false
    }, 
    endDate:{
        type: DataTypes.DATE,
        allowNull:false
    },

})

Event.hasMany(Talk)

Speaker.hasMany(Talk)


module.exports = Talk;