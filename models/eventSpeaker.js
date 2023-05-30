const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const Speaker = require("./speaker");
const Event = require("./event");

const EventSpeaker = connection.define("eventSpeaker", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    qrcode: {
        type: DataTypes.TEXT,
        validate:{
            len: [1,5000]
        },
        
    }
});

EventSpeaker.belongsTo(Speaker);
EventSpeaker.belongsTo(Event);
Event.hasMany(EventSpeaker);

module.exports = EventSpeaker;