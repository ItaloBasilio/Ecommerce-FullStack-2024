const { generateToken } = require('../config/jwtToken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendEmail = require('./emailController');

//Create User
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Criar um novo usuario
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        // usuário já existe
        throw new Error('Usuário já existe');
    }
});


//Login User
const loginUserControl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Checar se o usuario existe ou nao
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id);
        const updateUser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new: true }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000,
        })


        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    } else {
        throw new Error('Email ou senha incorretos');
    }
});



// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) throw new Error('No Refresh Token present in db or not matched')
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        // console.log(decoded);
        if (err || user._id.toString() !== decoded.id) throw new Error('Invalid Refresh Token');
        const acessToken = generateToken(user?._id);
        res.json({ acessToken });
    })
})


// Logout functionality

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // retornar status 204
    }
    await User.findOneAndUpdate({ refreshToken: refreshToken }, { // corrigir aqui
        refreshToken: '',
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
});





// update a user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodbId(_id);
    try {
        const updateUser = await User.findByIdAndUpdate(
            _id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },
            { new: true }
        );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Retornar todos os usuarios
const getAllUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// Retornar um usuario apenas
const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const getUser = await User.findById(id);
        res.json(getUser);
    } catch (error) {
        throw new Error(error);
    }
});

// Excluir um usuario apenas
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    } catch (error) {
        throw new Error(error);
    }
});

const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const block = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        );
        res.json(block);
    } catch (error) {
        throw new Error(error);
    }
});

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        );
        res.json(unblock);
    } catch (error) {
        throw new Error(error);
    }
});

//UpdatePassword

const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongodbId(_id);
    const user = await User.findById(_id);
    let resetToken = null;
    if (password) {
        user.password = password;
        resetToken = await user.createPasswordResetToken(); // Adiciona o token e a data de expiração
        await user.save(); // Salva as alterações
    }
    res.json({ // Retorna um JSON com o usuário e o token, apenas se este último foi gerado
        ...user.toJSON(),
        passwordResetToken: resetToken,
        passwordResetExpires: user.passwordResetExpires
    });
});


//Forgot Password

const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found with this email");
    try {
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Olá ${user.firstname}, tudo bem? Você solicitou o reset de senha. Esse link é válido por 10 minutos à partir de agora.<a href="http://localhost:4000/api/user/reset-password/${token}"><br><br>Redefinir minha senha agora!</a>`;
        const data = {
            to: email,
            text: "Hello User",
            subject: "Esqueci minha senha 😥",
            htm: resetURL,
        };
        sendEmail(data);
        res.json(token);
 
   } catch (error) {
        throw new Error(error);
    }

})

//Reset password

const resetPassword = asyncHandler(async(req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt: Date.now()}
    })
    if(!user) throw new Error("Token Expired. Please try again later");
    user.password = password;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();
    res.json(user);
})


module.exports = {
    createUser,
    loginUserControl,
    getAllUser,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword
};
