const { Router } = require("express");
const User = require("../models/user");
const hasRole = require("../middleware/hasRole");
const bcrypt = require('bcryptjs');
const Profile = require("../models/profile");
const Bio = require("../models/bio");
const { schemaUserPut, schemaProfilePut, schemaBioPut } = require("../utils/validate/schemas");

const router = Router();

router.get("/superadmin", hasRole(["superAdmin"]), async (req, res) => {

    try {
            const user = await User.findOne({
                include: [Profile, Bio],
                attributes: { exclude: ['password'] },
                where: {
                    role: "superAdmin"
                }
            });
            
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })
    }
});

router.put("/superadmin/:id", hasRole(["superAdmin"]), schemaUserPut, async (req, res) => {
    const { fullname, email, newsLetter } = req.body;
    let { password } = req.body;
    const { id } = req.params;
    const saltRounds = 10;

    try {

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." });
        }

        if(req.auth.id !== id) {
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

router.put("/superadmin/:id/profile", hasRole(["superAdmin"]),schemaProfilePut, async (req, res) => {
    const { id } = req.params;
    const { nickname, avatar, city } = req.body;

    try {

        const profile = await Profile.findOne({ where: { userId: id } });

        if (!profile) {
            return res.status(404).json({ message: "Profile não encontrado." });
        }

        if(req.auth.id !== id) {
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

router.put("/superadmin/:id/bio", hasRole(["superAdmin", "admin"]),schemaBioPut ,async (req, res) => {
    const { id } = req.params;
    const { position, company, description } = req.body;

    try {

        const bio = await Bio.findOne({ where: { userId: id } });

        if (!bio) {
            return res.status(404).json({ message: "Bio não encontrado." });
        }

        if(req.auth.id !== id) {
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

module.exports = router;