const express = require('express');
const { 
    createUser, 
    loginUserControl, 
    getAllUser, 
    getUser, 
    deleteUser, 
    updateUser 
} = require('../controller/userController');
const {authMiddleware , isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();



router.post('/register', createUser);
router.post('/login', loginUserControl);
router.get('/all-users', getAllUser);
router.get('/:id', authMiddleware,isAdmin , getUser );
router.delete('/:id', deleteUser );
router.put('/edit-user',authMiddleware, updateUser );


module.exports = router;