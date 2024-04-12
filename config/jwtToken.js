const jwt = require('jsonwebtoken');

const generateToken=(id) => {
    //Expiração do Token
    return jwt.sign({id}, process.env.JWT_SECRET,{ expiresIn:'3d' });
};

module.exports = { generateToken };