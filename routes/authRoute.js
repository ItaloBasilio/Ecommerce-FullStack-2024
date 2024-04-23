const express = require('express');
const { 
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
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon
} = require('../controller/userController');
const {authMiddleware , isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);

router.put('/reset-password/:token', resetPassword);
router.put('/password', authMiddleware, updatePassword)

router.post('/login', loginUserControl);
router.post('/admin-login', loginAdmin);
router.post('/cart', authMiddleware, userCart);
router.post('/cart/applycoupon', authMiddleware, applyCoupon)

router.get('/all-users', getAllUser);
router.get('/refresh', handleRefreshToken );
router.get('/logout', logout );

router.get('/wishlist', authMiddleware, getWishList );
router.get('/cart', authMiddleware, getUserCart );

router.get('/:id', authMiddleware,isAdmin , getUser );
router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete('/:id', deleteUser );


router.put('/edit-user',authMiddleware, updateUser );
router.put('/save-address',authMiddleware, saveAddress );
router.put('/block-user/:id',authMiddleware, isAdmin, blockUser );
router.put('/unblock-user/:id',authMiddleware, isAdmin, unblockUser );




module.exports = router;