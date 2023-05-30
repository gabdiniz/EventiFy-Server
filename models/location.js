const { DataTypes } = require("sequelize");
const { connection } = require("../db/db");

const Location = connection.define("location", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    cep: {
        type: DataTypes.STRING(9),
        allowNull: false,
    },
    uf: {
        type: DataTypes.STRING(2),
        allowNull: false,
    },
    cidade: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bairro: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    endereco: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    complemento: {
        type: DataTypes.STRING,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,

    }


})
module.exports = Location;