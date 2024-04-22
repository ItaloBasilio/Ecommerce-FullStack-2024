const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const validateMongodbId = require('../utils/validateMongodbId');
const cloudinaryUploadImg = require('../utils/cloudinary');
const fs = require('fs');

// Create Blog

const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error)
    }


})

// Update Blog

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error)
    }

})

// Get blog

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id)
    try {
        const getBlog = await Blog.findById(id).populate('likes').populate('dislikes');
        const updateViews = await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }

});

// get All Blog

const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error)
    }
});


// Delete Blog

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const deletedBlog = await Blog.findByIdAndDelete(id);
        res.json(deletedBlog);
    } catch (error) {
        throw new Error(error)
    }

});

// Like blog

const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the post
    const isLiked = blog?.isLiked;

    //find if the user has disliked the post
    const alreadyDislike = blog?.dislikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyDislike) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        },
            { new: true }
        );
        res.json(blog);
    } else if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        },
            { new: true }
        );
        res.json(blog);
    }
});


// disLike blog

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodbId(blogId);

    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);

    //find the login user
    const loginUserId = req?.user?._id;

    //find if the user has liked the post
    const isDisLiked = blog?.isDisLiked;

    //find if the user has disliked the post
    const alreadyliked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isliked: false
        },
            { new: true }
        );
        res.json(blog);
    } else if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisLiked: false
        },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisLiked: true
        },
            { new: true }
        );
        res.json(blog);
    }
});

//Upload Images Blog

const BlogUploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;             
    validateMongodbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImg(path, 'images'); 
        const urls = [];
        const files = req.files;
        for (const file of files) {
            const { path } = file; // Correção aqui
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);
            
        }
        const findBlog = await Blog.findByIdAndUpdate(
            id,
            {
                images: urls.map(file => {
                    return file
                })
            },
            {
                new: true
            }
        );
        res.json(findBlog);
    } catch (error) {
        throw new Error(error);   
    }
})





module.exports = { 
    createBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog, 
    likeBlog , 
    dislikeBlog,
    BlogUploadImages
};