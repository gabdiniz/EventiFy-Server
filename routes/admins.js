const { Router } = require("express");
const User = require("../models/user");
const hasRole = require("../middleware/hasRole");
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const Profile = require("../models/profile");
const Bio = require("../models/bio");
const { schemaUser } = require("../utils/validate/schemas");

const router = Router();

router.get("/admins", hasRole(["superAdmin", "admin"]), async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const user = await User.findOne({
                include: [Profile, Bio],
                attributes: { exclude: ['password'] },
                where: { id }
            });
            if (user) {
                return res.status(200).json(user);
            } else {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
        }

        const users = await User.findAll({
            include: [Profile, Bio],
            attributes: { exclude: ['password'] },
            where: {
                role: "admin"
            }
        });

        return res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Um erro aconteceu" })
    }
});

router.post("/admins", hasRole(["superAdmin"]), schemaUser,async (req, res) => {
    const { fullname, email, password } = req.body;
    const saltRounds = 10;

    try {
        const user = await User.findOne({where: { email}});
        
        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const nickname = email.split('@')[0] + crypto.randomBytes(4).toString('hex');
        const profile = { nickname };
        const bio = {};

        const newUser = await User.create({
            id: uuidv4(),
            fullname,
            email,
            password: hashedPassword,
            role: "admin",
            profile,
            bio
        },
            { include: [Profile, Bio] }
        );
        
        delete newUser.dataValues.password; // remove o password antes de retornar a requisição.
        return res.status(201).json({ message: "Administrador criado com sucesso!", newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Um erro ocorreu.' });
    }
});

router.put("/admins/:id", hasRole(["superAdmin", "admin"]), async (req, res) => {
    const { fullname, email, newsLetter } = req.body;
    let { password } = req.body;
    const { id } = req.params;
    const saltRounds = 10;

    try {

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        if (req.auth.id !== id) {
            return res.status(404).json({ message: "Usuário editado deve ser o mesmo logado." });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            password = hashedPassword;
        }

        await user.update({
            fullname,
            email,
            password,
            newsLetter
        });

        delete user.dataValues.password; // remove o password antes de retornar a requisição.
        return res.status(200).json({ message: "Usuario editado com sucesso!", user });
    } catch (error) {
        return res.status(500).json({ message: "Um erro ocorreu." });
    }
});

router.put("/admins/:id/profile", hasRole(["superAdmin", "admin"]), async (req, res) => {
    const { id } = req.params;
    const { nickname, avatar, city } = req.body;

    try {

        const profile = await Profile.findOne({ where: { userId: id } });

        if (!profile) {
            return res.status(404).json({ message: "Profile não encontrado." });
        }

        if (req.auth.id !== id) {
            return res.status(404).json({ message: "Usuário editado deve ser o mesmo logado." });
        }

        if (nickname) {
            const nicknameInvalid = await Profile.findAll({ where: { nickname } });
            if (nicknameInvalid.length > 0) {
                return res.status(400).json({ message: "Este nickname já está cadastrado." });
            }
        }

        await profile.update({
            nickname,
            avatar,
            city
        })

        return res.status(200).json({ message: "Perfil editado com sucesso!", profile });
    } catch (error) {
        return res.status(500).json({ message: "Um erro ocorreu." });
    }
});

router.put("/admins/:id/bio", hasRole(["superAdmin", "admin"]), async (req, res) => {
    const { id } = req.params;
    const { position, company, description } = req.body;

    try {

        const bio = await Bio.findOne({ where: { userId: id } });

        if (!bio) {
            return res.status(404).json({ message: "Bio não encontrado." });
        }

        if (req.auth.id !== id) {
            return res.status(404).json({ message: "Usuário editado deve ser o mesmo logado." });
        }

        await bio.update({
            position,
            company,
            description
        })

        return res.status(200).json({ message: "Bio editado com sucesso!", bio });
    } catch (error) {
        return res.status(500).json({ message: "Um erro ocorreu." });
    }
});

router.delete("/admins/:id", hasRole(["superAdmin"]), async (req, res) => {
    const { id } = req.params;

    try {

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        if (user.dataValues.role === "superAdmin") {
            return res.status(401).json({ message: "Sem permissão para excluir este usuário." })
        }

        await Profile.destroy({ where: { userId: id } });
        await Bio.destroy({ where: { userId: id } });
        await user.destroy();

        return res.status(200).json({ message: "Usuario deletado com sucesso!", user });
    } catch (error) {
        return res.status(500).json({ message: "Um erro ocorreu." });
    }
});

module.exports = router;