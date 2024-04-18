const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog, updateBlog, getBlog ,getAllBlogs, deleteBlogById,  } = require('../controller/blogController');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);
router.put('/:id', authMiddleware, isAdmin, updateBlog);
router.get('/:id',authMiddleware, isAdmin, getBlog)
router.get('/',authMiddleware, isAdmin, getAllBlogs);
router.delete('/:id',authMiddleware, isAdmin, deleteBlogById )

module.exports = router ;