const express = require('express');
const { 
    createUser, 
    loginUserControl, 
    getAllUser, 
    getUser, 
    deleteUser, 
    updateUser, 
    blockUser,
    unblockUser
} = require('../controller/userController');
const {authMiddleware , isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();



router.post('/register', createUser);
router.post('/login', loginUserControl);
router.get('/all-users', getAllUser);
router.get('/:id', authMiddleware,isAdmin , getUser );
router.delete('/:id', deleteUser );
router.put('/edit-user',authMiddleware, updateUser );
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser );
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser );

module.exports = router;