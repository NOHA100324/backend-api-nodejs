const express = require('express');
const productsController = require('../controllers/productsController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { parser } = require('../utils/cloudinary');
const router = express.Router();

router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.post('/', verifyToken, isAdmin, parser.single('imageFile'), productsController.createProduct);
router.put('/:id', verifyToken, isAdmin, parser.single('imageFile'), productsController.updateProduct);
router.patch('/:id/stock', verifyToken, productsController.deductStock);
router.delete('/:id', verifyToken, isAdmin, productsController.deleteProduct);

module.exports = router;

