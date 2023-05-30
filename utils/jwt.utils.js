const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '1d') => {
    const token = jwt.sign(
        { id: user.id, role: user.role, email: user.email},
        process.env.JWT_SECRET,
        { expiresIn }
    );
    return token;
};

const resetToken = (email, expiresIn = '1h') => {
    const token = jwt.sign(
        {email},
        process.env.JWT_SECRET,
        { expiresIn }
    );
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

module.exports = {
    generateToken,
    verifyToken,
    resetToken
};
