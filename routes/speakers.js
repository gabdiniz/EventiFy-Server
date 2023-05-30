const Speaker = require("../models/speaker");
const { Router } = require("express");
const { schemaSpeaker, schemaSpeakerPut } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const Talk = require("../models/talk");
const EventSpeaker = require("../models/eventSpeaker");

const router = Router();

router.post("/speakers", hasRole(["superAdmin", "admin", "organizador"]), schemaSpeaker, async (req, res) => {
    try {
        const { fullname, description, position, company, education, avatar } = req.body;
        const novoSpeaker = await Speaker.create(
            { fullname, description, position, company, education, avatar }
        );
        return res.status(201).json(novoSpeaker);
    }
    catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.get("/speakers", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const speaker = await Speaker.findByPk(id);
            if (speaker) {
                return res.status(200).json(speaker);
            } else {
                return res.status(404).json({ message: "Palestrante não encontrado." });
            }
        }
        const speakers = await Speaker.findAll({order: [['fullname', 'ASC']]});
        return res.status(200).json(speakers);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.put("/speakers/:id", hasRole(["superAdmin", "admin", "organizador"]), schemaSpeakerPut, async (req, res) => {
    const { fullname, description, position, company, education, avatar } = req.body;
    const speaker = await Speaker.findByPk(req.params.id);

    try {
        if (speaker) {
            await Speaker.update(
                { fullname, description, position, company, education, avatar },
                { where: { id: req.params.id } }
            );
            return res.json({ message: "Palestrante editado com sucesso!" });
        } else {
            return res.status(404).json({ message: "Palestrante não encontrado." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.delete("/speakers/:id", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) => {
    const speaker = await Speaker.findByPk(req.params.id);

    try {
        if (speaker) {
            await Talk.destroy({where: {speakerId: req.params.id}}); // remove primeiro o histórico na tabela talks
            await EventSpeaker.destroy({where: {speakerId: req.params.id}}); // depois remove o histórico na tabela EventSpeaker
            await speaker.destroy(); // por fim remove o speaker
            return res.json({ message: "Palestrante removido com sucesso!" });
        } else {
            return res.status(404).json({ message: "Palestrante não encontrado." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

module.exports = router;