const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog ,getAllBlogs, deleteBlog, likeBlog, dislikeBlog, BlogUploadImages,  } = require('../controller/blogController');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 2), blogImgResize, BlogUploadImages);
router.put('/likes', authMiddleware, likeBlog);
router.put('/dislikes',authMiddleware, dislikeBlog)
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id',authMiddleware, isAdmin, getBlog)
router.get('/',authMiddleware, isAdmin, getAllBlogs);
router.delete('/:id',authMiddleware, isAdmin, deleteBlog )


module.exports = router ;