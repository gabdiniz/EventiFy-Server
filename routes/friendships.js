const { Router } = require("express");
const Friendship = require("../models/friendship");
const User = require("../models/user");
const { schemaFriendship, schemaFriendshipPut } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const Profile = require("../models/profile");
const { Op } = require("sequelize");

const router = Router();

router.get("/friendships", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { id, blocked } = req.query;
    const includeOptions = [
      { model: User, as: 'sender', include: [Profile] },
      { model: User, as: 'receiver', include: [Profile] }
    ];
    if (id) {
      if (blocked === "true") {
        const friendship = await Friendship.findAll({ where: { [Op.or]: [{ senderId: id }, { receiverId: id }] }, include: includeOptions });
        if (friendship) {
          return res.status(200).json(friendship);
        } else {
          return res.status(404).json({ message: "Amizade não encontrada." });
        }
      }
      else {
        const friendship = await Friendship.findAll({ where: { blocked: false, [Op.or]: [{ senderId: id }, { receiverId: id }] }, include: includeOptions });
        if (friendship) {
          return res.status(200).json(friendship);
        } else {
          return res.status(404).json({ message: "Amizade não encontrada." });
        }
      }
    }
    const friendships = await Friendship.findAll({ include: includeOptions });
    return res.status(200).json(friendships);
  } catch (error) {
    return res.status(500).json(error);
  }
});



router.post("/friendships", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaFriendship, async (req, res) => {
  try {
    const { senderId, receiverId, blocked } = req.body;
    const sender = await User.findByPk(senderId);
    const receiver = await User.findByPk(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const existingFriendship = await Friendship.findOne({
      where: {
        [Op.or]: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (existingFriendship) { // se existe amizade retorna erro
      return res.status(400).json({ message: "amizade já existe" });
    } else { // se não existe cria nova amizade
      const novoFriendship = await Friendship.create({ senderId: senderId, receiverId: receiverId, blocked });
      return res.status(201).json(novoFriendship);
    }

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
});

router.put("/friendships/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaFriendshipPut, async (req, res) => {
  try {
    const { blocked } = req.body;
    const { id } = req.params;
    const friendship = await Friendship.findByPk(id);
    if (friendship) {
      await friendship.update({ blocked });
      return res.status(200).json("Usuário editado. ");
    }
    else {
      return res.status(404).json({ message: "Usuário não encontrado. " });
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
});

router.delete("/friendships/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { id } = req.params;
    const friendship = await Friendship.findByPk(id);
    if (friendship) {
      await friendship.destroy();
      return res.status(200).json({ message: "Usuário deletado" });
    }
    else {
      return res.status(404).json({ message: "Usuário não encontrado. " });
    }
  }
  catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = router;