const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asynchandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

// Create Blog

const createBlog = asynchandler(async(req,res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)   
    }


})

module.exports = { createBlog };