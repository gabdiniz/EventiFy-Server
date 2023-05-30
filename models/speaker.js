const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");

const Speaker = connection.define('speaker', {
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
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
  },
  education: {
    type: DataTypes.STRING,
  },
  avatar: {
    type: DataTypes.STRING,
  }
});

module.exports = Speaker;