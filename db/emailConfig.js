const nodemailer = require('nodemailer');

// Configurações de autenticação do Gmail
const emailConfig = {
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    }
  };

// Crie um transporte de e-mail usando as configurações acima
const transporter = nodemailer.createTransport(emailConfig);

module.exports = transporter;