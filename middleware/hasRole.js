const User = require("../models/user");
const { verifyToken } = require('../utils/jwt.utils')

function hasRole(roles) {
    return async (req, res, next) => {
        const header = req.headers.authorization;

        try {
            if (!header) {
                return res.status(401).json({ message: "Cabeçalho não configurado" });
            }

            const [authType, token] = header.split(" ");

            if (authType !== "Bearer") {
                return res.status(401).json({ error: "Tipo de autenticação não permitida" });
            }

            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ message: "Token inválido" });
            }

            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "Usuário fornecido no token não foi encontrado." });
            }

            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Role não autorizado para esta rota" });
            }

            if (decoded.role !== user.dataValues.role) {
                return res.status(403).json({ message: "Role do token difere do role do usuário" });
            }
            
            req.auth = decoded

            return next();

        } catch (error) {
            res.status(500).json({ message: "Um erro ocorreu." });
        }
    };
}

module.exports = hasRole;