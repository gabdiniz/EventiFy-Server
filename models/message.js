const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const Friendship = require("./friendship");

const Message = connection.define('message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    message:{
        type: DataTypes.STRING,
        allowNull: false
    },
    sender: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});
Friendship.hasMany(Message, {
    onDelete: "CASCADE"
});
Message.belongsTo(Friendship);




module.exports = Message;