const express = require('express');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createBlog } = require('../controller/blogController');
const router = express.Router();

router.post('/', authMiddleware, isAdmin, createBlog);


module.exports = router ;