const { Router } = require("express");
const Speaker = require("../models/speaker");
const Event = require("../models/event");
const EventSpeaker = require("../models/eventSpeaker");
const hasRole = require("../middleware/hasRole");
const QRCode = require("qrcode")
const { schemaEventSpeaker, schemaEventSpeakerPut } = require("../utils/validate/schemas");
const router = Router();

// Função de gerar QRCode
// Importante: contem o caminho para o site
async function generateCode(event, speaker) {
    try {
        const urlSite = "http://localhost:3001/"
        const qrCodeData = `${urlSite}palestrantes/checkin/${speaker.id}/${event.id}`
        const qrCode = await QRCode.toDataURL(qrCodeData);
        return qrCode;
    } catch (error) {
        throw new Error('Erro ao gerar o código QR.');
    }
}

//POST
router.post("/eventspeakers", hasRole(["superAdmin", "admin", "organizador"]), schemaEventSpeaker, async (req, res) => {
    const { speakerId, eventId } = req.body;

    try {
        const speaker = await Speaker.findByPk(speakerId);
        const event = await Event.findByPk(eventId);

        if (speaker) {
            if (event) {
                const eventspeaker = await EventSpeaker.findOne({ where: { speakerId, eventId } });
                if (eventspeaker) {
                    return res.status(400).json({ message: "Palestrante já cadastrado neste evento." })
                } else {
                    const qrCode = await generateCode(speaker, event);
                    const eventSpeaker = await EventSpeaker.create({ eventId: eventId, qrcode: qrCode, speakerId: speakerId });
                    return res.status(201).json(eventSpeaker);
                }
            } else {
                return res.status(404).json({ message: "Evento não encontrado." })
            }
        } else {
            return res.status(404).json({ message: "Palestrante não encontrado." })
        }
        
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});


//GET - de um e de todos
router.get("/eventspeakers", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id, eventId } = req.query;
    try {
        if (eventId) {
            const eventSpeaker = await EventSpeaker.findAll({ where: { eventId }, include: [Speaker] });
            if (eventSpeaker) {
                return res.status(200).json(eventSpeaker);
            } else {
                return res.status(404).json({ message: "Palestrante não cadastrado no evento" });
            }
        }
        if (id) {
            const eventSpeaker = await EventSpeaker.findByPk(id);
            if (eventSpeaker) {
                return res.status(200).json(eventSpeaker);
            } else {
                return res.status(404).json({ message: "qrcode não encontrado." });
            }
        }
        const eventSpeakers = await EventSpeaker.findAll();
        return res.status(200).json(eventSpeakers);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

router.get("/eventspeakers/checkin/:speakerId/:eventId", async (req, res) => {
    try {
        const { speakerId, eventId } = req.params;
        const eventspeaker = await EventSpeaker.findOne({ where: { speakerId, eventId }, include: [{ model: Speaker }, { model: Event }] });
        if (eventspeaker) {
            return res.json(eventspeaker);
        } else {
            return res.status(404).json({ message: "Cadastro não encontrado." })
        }

    } catch (error) {
        return res.status(500).json({ message: "Ocorreu um erro ao realizar o check-in." });
    }
});


// Removido put de QRCode em eventSpeaker

//DELETE
router.delete("/eventspeakers/:id", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) => {
    const eventSpeaker = await EventSpeaker.findOne({ where: { id: req.params.id } });
    try {
        if (eventSpeaker) {
            await EventSpeaker.destroy({ where: { id: req.params.id } });
            return res.json({ message: "qrcode deletado com sucesso." })
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

module.exports = router;