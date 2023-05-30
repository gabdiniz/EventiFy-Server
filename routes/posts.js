const { Router } = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const Event = require("../models/event");
const { schemaPostPut, schemaPost } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const Profile = require("../models/profile");
const Media = require("../models/media");
const Friendship = require("../models/friendship");
const { Op } = require("sequelize");



const router = Router();

//Create - rota para criar um post
router.post("/posts", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaPost, async (req, res) => {
    const { message, eventId, userId, profileId } = req.body;

    try {
        if (eventId) {
            const event = Event.findByPk(eventId)
            if (!event) {
                return res.status(404).json({ message: "Evento não encontrado" });
            }
        }

        const user = User.findByPk(userId)
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado." })
        }

        if (user && eventId) {
            const post = await Post.create({ message, date: new Date(), eventId, userId, profileId });
            return res.status(201).json(post)
        } else {
            const post = await Post.create({ message, date: new Date(), userId, profileId });
            return res.status(201).json(post)
        }

    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }

})


//Read = Rota para listar todos posts e listar um
router.get("/posts", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id, usuarioLogado } = req.query;
    try {
        if (id) {
            const post = await Post.findOne({
                where: { id },
                include: [{
                    model: User,
                    attributes: { exclude: ['password'] },
                }, Profile, Event, Media]
            });
            if (post) {
                return res.status(200).json(post);
            } else {
                return res.status(404).json({ message: "Post não encontrado." });
            }
        }

        if (usuarioLogado) { // se enviar o usuário logado na aplicação
            // faz uma consulta na tabela de amigos e retorna todos os amigos do usuário logado, desde que não esteja bloqueado.
            const friendships = await Friendship.findAll({ 
                where: {
                    [Op.or]: [
                        { senderId: usuarioLogado },
                        { receiverId: usuarioLogado }
                    ],
                    blocked: 0
                }
            });

            // armazena os ids dos amigos em um array
            const friendIds = friendships.map(friendship =>
                friendship.senderId === usuarioLogado ? friendship.receiverId : friendship.senderId
            );

            const posts = await Post.findAll({
                // na consulta de posts incluimos uma condição, todos os posts dos ids armazenados no array anterior 
                where:{ userId: { [Op.in]: friendIds }}, 
                include: [{
                    model: User,
                    attributes: { exclude: ['password'] },
                }, Profile, Event, Media],
                order: [['createdAt', 'DESC']]
            });
            // retorna todos os posts dos amigos
            return res.status(200).json(posts);
        }

        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: { exclude: ['password'] },
            }, Profile, Event, Media],
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

router.get("/posts/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id } = req.params;
    try {

        const evento = await Event.findByPk(id);

        if (!evento) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: { exclude: ['password'] },
            }, Profile, Event, Media],
            where: { eventId: id },
            order: [['createdAt', 'DESC']]
        });
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

//Update: atualizar um post

router.put("/posts/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaPostPut, async (req, res) => {
    try {
        const { message } = req.body;
        const post = await Post.findByPk(req.params.id);
        if (post) {
            await post.update({ message });
            return res.status(200).json({ message: "Post editado." });
        } else {
            return res.status(400).json({ message: "Post não encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

//Delete = rota que deleta um post

router.delete("/posts/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const post = await Post.findOne({ where: { id: req.params.id } });
    try {
        if (post) {
            await Post.destroy({ where: { id: req.params.id } });
            return res.json({ message: "Post deletado com sucesso." })
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});







module.exports = router;