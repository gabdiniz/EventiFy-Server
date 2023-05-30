const Talk = require("../models/talk");
const { Router } = require("express");
const Event = require("../models/event");
const Speaker = require("../models/speaker");
const { schemaTalks, schemaTalksPut } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");

const router = Router();

router.post("/talks", hasRole(["superAdmin", "admin", "organizador"]), schemaTalks, async (req, res) => {
    const { name, startDate, endDate, eventId, speakerId } = req.body;
    try {
        const event = Event.findByPk(eventId)
        const speaker = Speaker.findByPk(speakerId)
        if (event) {
            if (speaker) {
                const talk = await Talk.create({ name, startDate, endDate, eventId, speakerId });
                return res.status(201).json(talk);
            } else {
                return res.status(404).json({ message: "Palestrante não encontrado." });
            }

        } else {
            return res.status(404).json({ message: "Evento não encontrado." });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.get("/talks", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id, eventId } = req.query;

    try {
        if (eventId) {
            const talk = await Talk.findAll({ where: { eventId }, order: [['startDate', 'ASC']] });
            if (talk) {
                return res.status(200).json(talk);
            } else {
                return res.status(404).json({ message: "Palestra não cadastrada no evento" });
            }
        }
        if (id) {
            const talk = await Talk.findByPk(id);
            if (talk) {
                return res.status(200).json(talk);
            } else {
                return res.status(404).json({ message: "Palestra não encontrada." });
            }
        }
        const talks = await Talk.findAll({
            order: [['startDate', 'ASC']]
        });
        return res.status(200).json(talks);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.put("/talks/:id", hasRole(["superAdmin", "admin", "organizador"]), schemaTalksPut, async (req, res) => {
    const { name, startDate, endDate, eventId, speakerId } = req.body;
    const talk = await Talk.findByPk(req.params.id);

    try {
        if (talk) {
            await Talk.update(
                { name, startDate, endDate, eventId, speakerId },
                { where: { id: req.params.id } }
            );
            return res.json({ message: "Palestra editada com sucesso!" });
        } else {
            return res.status(404).json({ message: "Palestra não encontrada." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

router.delete("/talks/:id", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) => {
    const talk = await Talk.findOne({ where: { id: req.params.id } });
    try {
        if (talk) {
            await Talk.destroy({ where: { id: req.params.id } });
            return res.json({ message: "Palestra deletada com sucesso." });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." });
    }
});

module.exports = router;