const Category = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

// Create Category

const createCategory = asyncHandler(async(req,res) => {
    try {
        const newCategory = await Category.create(req.body);
        res.json(newCategory);
    } catch (error) {
        throw new Error(error);
    }
})

//update Category

const updateCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updatedCategory);
    } catch (error) {
        throw new Error(error);
    }
})

//delete Category

const deleteCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await Category.findByIdAndDelete(id);
        res.json(deletedCategory);
    } catch (error) {
        throw new Error(error);
    }
})

// get a  Category

const getCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getaCategory = await Category.findById(id);
        res.json(getaCategory);
    } catch (error) {
        throw new Error(error);
    }
})

//get all Category

const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const allCategories = await Category.find();
        res.json(allCategories);
    } catch (error) {
        throw new Error(error);
    }
});




module.exports = { createCategory , updateCategory, deleteCategory, getCategory , getAllCategories };