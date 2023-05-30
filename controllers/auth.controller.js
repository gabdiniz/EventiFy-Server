
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { generateToken, resetToken, verifyToken } = require('../utils/jwt.utils')
const transporter = require('../db/emailConfig');
const crypto = require('crypto');
const Profile = require('../models/profile');
const Bio = require('../models/bio');


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);


        if (!isValidPassword) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        const token = generateToken(user);

        return res.status(200).json({ token });
    } catch (error) {
        return res.status(500).json({ message: 'Um erro ocorreu.' });
    }
};

const cadastro = async (req, res) => {
    const { fullname, email, password, newsLetter } = req.body;
    const saltRounds = 10;

    try {
        const user = await User.findOne({where: { email}});
        
        if (user) {
            return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const nickname = email.split('@')[0] + crypto.randomBytes(4).toString('hex');
        const profile = { nickname };
        const bio = {};

        const newUser = await User.create({
            id: uuidv4(),
            fullname,
            email,
            password: hashedPassword,
            newsLetter,
            profile,
            bio
        },
            { include: [Profile, Bio] }
        );

        delete newUser.dataValues.password; // remove o password antes de retornar a requisição.
        return res.status(201).json({ message: "Usuário criado com sucesso!", newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

const recuperarSenha = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'E-mail não cadastrado, faça seu cadastro ou informe um e-mail válido.' });
        }

        const token = resetToken(email);

        await user.update({ resetToken: token }); // Salvar o resetToken no modelo User

        const resetUrl = `http://144.22.168.166:3000/recuperar-senha?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: 'Redefinição de senha',
            text: `Você solicitou a redefinição de senha. Clique no link a seguir para redefinir sua senha: ${resetUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Erro ao enviar e-mail de recuperação de senha', error });
            }
            return res.status(200).json({ message: 'E-mail de recuperação de senha enviado com sucesso' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao processar a solicitação de recuperação de senha' });
    }
};

const trocarSenha = async (req, res) => {
    const { password, token } = req.body;
    const saltRounds = 10;

    try {
        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Token inválido, faça uma nova solicitação." });
        }
        
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const user = await User.findOne({ where: { email: decoded.email } });

        await user.update({ resetToken: null, password: hashedPassword });

        return res.status(200).json({ message: 'Senha alterada com sucesso.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Um erro aconteceu.' });
    }
};


module.exports = { login, cadastro, recuperarSenha, trocarSenha };