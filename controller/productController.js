const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

// Create product

const createProduct = asyncHandler(async (req, res) => {
    try {
        // Verificar se o produto já existe com o mesmo nome
        const existingProduct = await Product.findOne({ title: req.body.title });
        if (existingProduct) {
            return res.status(400).json({ message: "Já existe um produto com este nome" });
        }

        // Se o produto não existe, criar um novo
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json({ message: "Produto criado com sucesso", newProduct });
    } catch (error) {
        throw new Error(error);
    }
});


// Update Product

const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.json({ message: "Produto atualizado com sucesso", updatedProduct });
    } catch (error) {
        throw new Error(error);
    }
});


// Delete Product

const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.json({ message: "Produto deletado com sucesso", deletedProduct });
    } catch (error) {
        throw new Error(error);
    }
});




//Get a product

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        if (!findProduct) {
            return res.status(404).json({ message: "O produto não existe" });
        }
        res.json({ message: "Produto encontrado com sucesso", findProduct });
    } catch (error) {
        return res.status(400).json({ message: "ID do produto inválido" });
    }
});



// Get all products

const getAllProducts = asyncHandler(async (req, res) => {

    try {
        const getallproducts = await Product.find();
        res.json(getallproducts);
    } catch (error) {

    }
})


module.exports = { createProduct, getaProduct, getAllProducts, updateProduct, deleteProduct }


