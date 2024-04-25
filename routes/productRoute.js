const express = require('express');
const {
    createProduct,
    getaProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    addToWishList,
    rating,
    uploadImages,
    deleteImages
} = require('../controller/productController');
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

// Rotas protegidas que requerem autenticação e autorização de administrador
router.post('/', createProduct); // Rota para criar um produto
router.put('/upload/', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImages);
// Rota para obter um produto por ID
router.get('/:id', getaProduct);

//Rota para lista de favoritos
router.put('/wishlist', authMiddleware, addToWishList)
router.put('/rating', authMiddleware, rating)
// Middleware de autenticação aplicado antes das rotas protegidas
router.use(authMiddleware);

// Middleware de verificação de administrador aplicado antes das rotas protegidas
router.use(isAdmin);


router.put('/:id',authMiddleware, isAdmin, updateProduct); // Rota para atualizar um produto por ID
router.delete('/:id', authMiddleware, isAdmin, deleteProduct); // Rota para excluir um produto por ID
router.delete('/delete-img/:id',authMiddleware, isAdmin, deleteImages); // Rota para excluir um produto por ID

// Rota para obter todos os produtos (não requer autenticação ou autorização de administrador)
router.get('/', getAllProducts);

module.exports = router;
