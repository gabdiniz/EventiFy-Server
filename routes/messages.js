const {Router} = require("express");
const Message = require("../models/message");
const Friendship = require("../models/friendship");
const hasRole = require("../middleware/hasRole");
const { schemaMessage } = require("../utils/validate/schemas");

const router = Router();

router.get("/messages", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const {friendshipId} = req.query;
    const includeOptions = [
        { model: Friendship, as: 'friendship'}];
    try {
        const messages = await Message.findAll({where: {friendshipId}, include: includeOptions});
        if (messages) {
            return res.status(200).json(messages);
        } else {
            return res.status(404).json({message: "Bate-papo não encontrado."});
        }
    } catch (error) {
        return res.status(500).json({message: "Um erro aconteceu"});
    }
});

router.post("/messages", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaMessage, async (req, res) => {
    const { message, sender } = req.body;
    const { friendshipId } = req.query;

    try {
        const friendship = await Friendship.findByPk(friendshipId);

        if (friendship && !friendship.blocked) {
            const messages = await Message.create({
                message,
                friendshipId: friendshipId,
                sender,
                date: new Date(),
            });

            return res.status(201).json(messages);
        } else {
            return res.status(400).json({ error: "Esta amizade está bloqueada." });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
});



router.delete("/messages/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res)=> {
    try {
        const {id} = req.params;
        const messages = await Message.findByPk(id);
        if (messages){
            await messages.destroy();
            return res.status(200).json({message: "Mensagem deletada."});
        } else {
            return res.status(404).json({message: "Mensagem não encontrada."});
        }
    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro." });
    }
});

module.exports = router;