const express = require('express');
const { createCoupon , getAllCoupons, updateCoupons, deleteCoupons } = require('../controller/couponController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin,  createCoupon)
router.get('/', authMiddleware, isAdmin, getAllCoupons)
router.put('/:id', authMiddleware, isAdmin, updateCoupons)
router.delete('/:id', authMiddleware, isAdmin, deleteCoupons)

module.exports = router;