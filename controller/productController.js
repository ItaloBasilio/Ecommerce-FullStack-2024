const Product = require('../models/productModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const validateMongoDbId = require('../utils/validateMongodbId');

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
    validateMongoDbId(id);
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
    validateMongoDbId(id);
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
    validateMongoDbId(id);
    try {



        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

// Get all products

const getAllProducts = asyncHandler(async (req, res) => {
    try {

        // Filtering
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el) => delete queryObj[el]);
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


        let query = Product.find(JSON.parse(queryStr));

        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //Limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ");
            query = query.select(fields);
        } else {
            query = query.select('-__v');
        }

        // pagination


        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error('This page does not exist');
        }
        console.log(page, limit, skip);



        const product = await query;
        res.json(product);
    } catch (error) {
        throw new Error(error);
    }
})

// Add Wishlist


const addToWishList = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);
        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            },
                {
                    new: true
                }
            );
            res.json(user);
        } else {
            let user = await User.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            },
                {
                    new: true
                }
            );
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
})


const rating = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    const { star, prodId } = req.body;

    try {
        const product = await Product.findById(prodId);
        let alreadyrated = product.ratings.find(
            (userId) => userId.postedBy.toString() === _id.toString()
        );
        if (alreadyrated) {
            const updateRating = await Product.updateOne(
                {
                    ratings: { $elemMatch: alreadyrated },
                },
                {
                    $set: { "ratings.$.star": star },
                },
                {
                    new: true
                }
            );
            // res.json(updateRating);

        } else {
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push: {
                    ratings: {
                        star,
                        postedBy: _id
                    }
                }
            },
                {
                    new: true
                }
            );
            // res.json(rateProduct)
        }

        const getAllRatings = await Product.findById(prodId);
        let totalRating = getAllRatings.ratings.length;
        let ratingsum = getAllRatings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating);
        let finalProduct = await Product.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating,
            },
            {
                new: true
            }
        );
        res.json(finalProduct);
    } catch (error) {
        throw new Error(error);
    }

});


module.exports = {
    createProduct,
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating
}


