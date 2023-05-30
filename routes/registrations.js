const { Router } = require("express");
const Registration = require("../models/registration");
const Event = require("../models/event");
const User = require("../models/user");
const Profile = require("../models/profile");
const { schemaRegistrationPut, schemaRegistration } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const QRCode = require("qrcode");
const router = Router();
const PDFDocument = require("pdfkit");
const {format} = require("date-fns")

// Função de gerar QRCode
// Importante: contem o caminho para o site
async function generateCode(user, event) {
  const urlSite = "http://localhost:3001/"
  const qrCodeData = `${urlSite}cadastros/checkin/${user.id}/${event.id}`;

  try {
    const url = await QRCode.toDataURL(qrCodeData);
    return url;
  } catch (error) {
    throw new Error('Erro ao gerar o código QR.');
  }
}

router.get("/registrations", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { id } = req.query;
    if (id) {
      const registration = await Registration.findOne({
        include: [{
          model: User,
          attributes: { exclude: ['password'] },
        }, Event],
        where: { id }
      });
      if (registration) {
        return res.status(200).json(registration);
      }
      else {
        return res.status(404).json({ message: "Inscrição não encontrada." });
      }
    }
    const registrations = await Registration.findAll({
      include: [{
        model: User,
        attributes: { exclude: ['password'] },
      }, Event]
    });
    return res.status(200).json(registrations);
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
})

router.get("/registrations/user/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const registrations = await Registration.findAll({
      include: [{
        model: User,
        attributes: { exclude: ['password'] },
      }, Event],
      where: { userId: id }
    });
    return res.status(200).json(registrations);
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro." });
  }

})

router.get("/registrations/event/:eventId/user/:userId", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { userId, eventId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const evento = await Event.findByPk(eventId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const registration = await Registration.findOne({
      where: { userId, eventId }
    });
    return res.status(200).json(registration);
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro." });
  }

})

router.get("/registrations/participantes/:eventId", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { eventId } = req.params;

    const evento = await Event.findByPk(eventId);

    if (!evento) {
      return res.status(404).json({ message: "Evento não encontrado." });
    }

    const registration = await Registration.findAll({
      include: [{
        model: User,
        attributes: { exclude: ['password'] },
    }, Profile],
      where: { eventId }
    });
    return res.status(200).json(registration);
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
})

// Rota para listar os dados de checkin de um evento no front. Apenas para autorizados.
router.get("/registrations/participantes/total/:eventId", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) =>{
    const {eventId} = req.params;
    try{
      if(eventId){
        const eventData = await Registration.findAll({where: {eventId}, attributes: ['checkin']});
        if(eventData){
          return res.json(eventData);
        }else{
          return res.status(404).json({message:"Sem cadastros no evento."})
        }
      }else{
        return res.status(404).json({message:"Evento não encontrado"});
      }
    }catch(err){
      return res.status(500).json(err);
    }
})

//Rota de validação de checkin do usuário.
router.get("/registrations/checkin/:userId/:eventId",hasRole(["superAdmin", "admin", "organizador"]) ,async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const registration = await Registration.findOne({ where: { userId, eventId }, include: [{model: User, attributes: { exclude: ['password'] },}, {model:Event}, {model: Profile}]});
    if (registration) {
      return res.json(registration);
    } else {
      return res.status(404).json({ message: "Cadastro não encontrado." })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro ao realizar o check-in." });
  }
});

  // Rota de gerar pdf do registration  do usuário
  router.get("/registrations/pdf/:userId/:eventId", async (req, res) => {
    try {
      const doc = new PDFDocument();
  
      const { userId, eventId } = req.params;
  
      const registration = await Registration.findOne({
        where: { userId, eventId },
        include: [
          { model: User, attributes: { exclude: ['password'] } },
          { model: Event },
          { model: Profile },
        ],
      });
  
      if (!registration) {
        return res.status(404).json({ message: "Registro não encontrado." });
      }
  
      const qrCodeWidth = 150;
      const qrCodeHeight = 150;
      const qrCodeX = (doc.page.width - qrCodeWidth) / 2; // Centralizar horizontalmente
      const qrCodeY = 200;
  
      doc.image(registration.qrCode, qrCodeX, qrCodeY, {
        width: qrCodeWidth,
        height: qrCodeHeight,
      });
  
      const textY = qrCodeY + qrCodeHeight + 20; // Posição Y para os dados escritos
  
      doc.text(`Nome: ${registration.user.fullname}`, { align: 'center', y: textY });
      doc.text(`Email: ${registration.user.email}`, { align: 'center', y: textY + 20 });
  
      doc.text(`Evento: ${registration.event.name}`, { align: 'center', y: textY + 40 });
      doc.text(
        `Início do evento: ${format(
          new Date(registration.event.startDate),
          'dd/MM/yyyy HH:mm'
        )}`,
        { align: 'center', y: textY + 60 }
      );
      doc.text(
        `Fim do evento: ${format(
          new Date(registration.event.endDate),
          'dd/MM/yyyy HH:mm'
        )}`,
        { align: 'center', y: textY + 80 }
      );
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=qr_code.pdf');
      doc.pipe(res);
      doc.end();
    } catch (err) {
      console.log(err);
      return res.status(500).send({ message: "Erro ao gerar PDF." });
    }
  });
  
  
  



router.post("/registrations", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaRegistration, async (req, res) => {
  try {
    const { eventId, userId } = req.body;
    const event = await Event.findByPk(eventId);
    const user = await User.findByPk(userId);
    const profile = await Profile.findOne({where:{userId:user.id}});
    const checkin = false;
    const date = new Date();

    if (user) {
      if (event) {
        const registration = await Registration.findOne({ where: { userId, eventId } });
        if (registration) {
          return res.status(400).json({ message: "Usuario já cadastrado no evento" })
        } else {
          const qrCode = await generateCode(user, event);
          const novoRegistration = await Registration.create({ qrCode: qrCode, date, eventId, userId, profileId: profile.id, checkin });
          await novoRegistration.save();
          return res.status(201).json(novoRegistration);
        }
      }
      else {
        return res.status(404).json({ message: "Evento não encontrado. " });
      }
    }
    else {
      return res.status(404).json({ message: "Usuário não encontrado. " });
    }
  }

  catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ocorreu um erro." });
  }
});

router.put("/registrations/checkin/:userId/:eventId",hasRole(["superAdmin", "admin", "organizador"]) ,async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const registration = await Registration.findOne({ where: { userId, eventId }});
    if (registration) {
     await registration.update({checkin: true});
     return res.json(registration);
    } else {
      return res.status(404).json({ message: "Cadastro não encontrado." })
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu um erro ao realizar o check-in." });
  }
});

router.delete("/registrations/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
  try {
    const { id } = req.params;
    const registration = await Registration.findByPk(id);
    if (registration) {
      await registration.destroy();
      return res.status(200).json({ message: "Inscrição deletada." });
    }
    else {
      return res.status(404).json({ message: "Inscrição não encontrada." });
    }
  }
  catch (error) {
    return res.status(500).json({ message: "Ocorreu um erro. " });
  }
});

module.exports = router;