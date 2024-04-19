const express = require('express');
const { createCategory, updateCategory, deleteCategory, getCategory, getAllCategories   } = require('../controller/blogCategoryController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, isAdmin,  createCategory);
router.put('/:id', authMiddleware, isAdmin,  updateCategory);
router.delete('/:id', authMiddleware, isAdmin,  deleteCategory);
router.get('/:id', authMiddleware, isAdmin, getCategory)
router.get('/',authMiddleware, isAdmin, getAllCategories)

module.exports = router;