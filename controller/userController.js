const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');


const createUser = asyncHandler(async (req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if(!findUser){
        // Criar um novo usuario
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        //usuario ja existe
        throw new Error('Usuario já existe');
    }
});

module.exports= { createUser } ;