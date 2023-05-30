const { Router } = require("express");
const Event = require("../models/event");
const { schemaEvent, schemaEventPut } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const Location = require("../models/location");
const router = Router();

router.get("/events", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const event = await Event.findOne({ where: { id }, include: [Location] });
            if (event) {
                return res.status(200).json(event);
            } else {
                return res.status(404).json({ message: "Evento não encontrado." });
            }
        }
        const events = await Event.findAll({ include: [Location], order: [['startDate', 'ASC']] });
        return res.status(200).json(events);


    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })

    }
});

router.post("/events", hasRole(["superAdmin", "admin", "organizador"]), schemaEvent, async (req, res) => {
    const { name, startDate, endDate, vacancies, segment, description, header, locationId, userId } = req.body;
    try {

        const newEvent = await Event.create({ name, startDate, endDate, vacancies, segment, description, header, locationId, userId })
        return res.status(201).json(newEvent)

    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })
    }

})

router.put("/events/:id", hasRole(["superAdmin", "admin", "organizador"]), schemaEventPut, async (req, res) => {
    const { name, startDate, endDate, vacancies, segment, description, header, locationId, userId } = req.body;
    try {
        const event = await Event.findByPk(req.params.id)
        if (event) {
            await event.update(
                { name, startDate, endDate, vacancies, segment, description, header, locationId, userId },
                { where: { id: req.params.id } }
            );
            return res.json({ message: "O evento foi editado.", event });

        } else {
            return res.status(404).json({ message: "ID não encontrado." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })
    }

})

router.delete("/events/:id", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) => {
    const { id } = req.params;
    const event = await Event.findOne({ where: { id } })
    try {
        if (event) {
            event.destroy()
            return res.status(200).json({ message: "O evento foi removido" })
        } else {
            return res.status(404).json({ message: "Evento com o ID informado não foi encontrado " });

        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })
    }

})



module.exports = router;