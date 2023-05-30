require("dotenv").config();
const User = require("../../models/user");
const bcrypt = require('bcryptjs');
const inquirer = require("inquirer");
const crypto = require('crypto');
const Profile = require("../../models/profile");
const Bio = require("../../models/bio");

inquirer
    .prompt([
        {
            type: "input",
            message: "Digite o email do novo super admin: ",
            name: "email",
        },
        {
            type: "password",
            message: "Digite a senha: ",
            name: "password",
        },
    ])
    .then(async (answers) => {
        answers.password = await bcrypt.hash(answers.password, 10);
        const nickname = answers.email.split('@')[0] + crypto.randomBytes(4).toString('hex');
        const profile = { nickname };
        const bio = {};

        const newUser = await User.create({
            ...answers,
            fullname: "Administrador Geral",
            role: "superAdmin",
            profile,
            bio
        },
            { include: [Profile, Bio] }
        );

    })
    .catch((error) => {
        console.error(error);
    });
