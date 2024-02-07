import mysql2 from 'mysql2';

const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: "mysql",
        timezone: "-03:00",
        port: process.env.DB_PORT,
        dialectModule: mysql2,
    }
);

async function authenticate(connection) {
    try {
        await connection.authenticate();
        console.log("Conexão estabelecida com sucesso!");
    } catch (err) {
        console.log("Um erro inesperado aconteceu: ", err);
    }
}

module.exports = { connection, authenticate };