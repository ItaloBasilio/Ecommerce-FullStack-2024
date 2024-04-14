const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');




const createProduct = asyncHandler(async(req,res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);  
    }
    res.json({
        message: "It's product post route"
    })
});


//Get a product

const getaProduct = asyncHandler(async(req,res) => {
    const {id} = req.params;
    try {
       const findProduct = await Product.findById(id);
       res.json(findProduct);
    } catch (error) {
       throw new Error(error); 
    }
})

// Get all products

const getAllProducts = asyncHandler(async( req,res )=>{

    try {
        const getallproducts = await Product.find();
        res.json(getallproducts);
    } catch (error) {
        
    }
})


module.exports = {createProduct , getaProduct, getAllProducts}


