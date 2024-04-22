const Coupon = require('../models/couponModel');
const validateMongoDbId = require('../utils/validateMongodbId');
const asyncHandler = require('express-async-handler');

// Create coupon

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error);
    }
})

// Get all coupons

const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons)
    } catch (error) {
        throw new Error(error);
    }
})

//update coupons

const updateCoupons = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateCoupons = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updateCoupons)
    } catch (error) {
        throw new Error(error);
    }
})


//delete coupons

const deleteCoupons = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteCoupons = await Coupon.findByIdAndDelete(id);
        res.json(deleteCoupons)
    } catch (error) {
        throw new Error(error);
    }
})



module.exports = { 
    createCoupon, 
    getAllCoupons,
    updateCoupons,
    deleteCoupons
};
