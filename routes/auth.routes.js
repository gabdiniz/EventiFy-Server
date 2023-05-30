const express = require('express');
const authController = require('../controllers/auth.controller');
const { schemaUser } = require('../utils/validate/schemas');

const router = express.Router();

router.post('/login', authController.login);
router.post('/cadastro', schemaUser, authController.cadastro);
router.post('/reset-password', authController.recuperarSenha);
router.post('/change-password', authController.trocarSenha);

module.exports = router;