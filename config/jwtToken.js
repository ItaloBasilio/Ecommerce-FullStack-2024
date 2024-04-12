const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    // Configurando a expiração do Token
    const expiresIn = '3d'; // Expiração em 3 dias
    const issuedAt = Math.floor(Date.now() / 1000); // Data de emissão em segundos
    return jwt.sign({ id, iat: issuedAt }, process.env.JWT_SECRET, { expiresIn: "3d" });
};

module.exports = { generateToken };
