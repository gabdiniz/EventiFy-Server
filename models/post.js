const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");
const Event = require("./event");
const User = require("./user");
const Profile = require("./profile");

const Post = connection.define('post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

User.hasMany(Post);
Post.belongsTo(User);
Post.belongsTo(Profile);
Post.belongsTo(Event);
Event.hasMany(Post);

module.exports = Post;
