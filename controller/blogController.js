const Blog = require('../models/blogModel');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongodbId');

// Create Blog

const createBlog = asyncHandler(async(req,res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)   
    }


})

// Update Blog

const updateBlog = asyncHandler(async(req,res) => {
    const { id } = req.params;
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body,{ 
            new:true 
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)   
    }

})

// Get blog

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try{
        const getBlog = await Blog.findById(id);
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: {numViews: 1},
            },
            { new: true}
        );
        res.json(updateViews);
    }catch(error){
        throw new Error(error);
    }
    
});

// get All Blog

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.json(blogs);
    } catch (error) {
        res.status(500);
        throw new Error('Internal server error');
    }
});


// Delete Blog

const deleteBlogById = asyncHandler(async (req, res) => {
    const { id } = req.params;
  
    const blog = await Blog.findByIdAndDelete(id);
  
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
  
    res.json({ message: 'Blog removed' });
  });

module.exports = { createBlog , updateBlog, getBlog , getAllBlogs , deleteBlogById  };