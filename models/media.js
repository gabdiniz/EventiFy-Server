const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const  Post  = require("./post");

const Media = connection.define("media", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
});


Post.hasMany(Media)
Media.belongsTo(Post)

module.exports = Media;