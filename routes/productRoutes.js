const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// pr
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/search', productController.extractProducts);
router.get('/category/:category', productController.getProductsByCategory);

// ptdr
router.post('/', auth.protect, auth.admin, upload.single('image'), productController.createProduct);
router.put('/:id', auth.protect, auth.admin, upload.single('image'), productController.updateProduct);
router.patch('/:id/stock', auth.protect, auth.admin, productController.updateProductStock);
router.delete('/:id', auth.protect, auth.admin, productController.deleteProduct);

module.exports =  router;