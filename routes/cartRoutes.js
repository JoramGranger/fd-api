// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Cart operations
router.post('/:userId/add', auth.protect, cartController.addToCart);
router.get('/:userId', auth.protect, cartController.getCart);
router.delete('/:userId/remove/:productId', auth.protect, cartController.removeFromCart);
router.delete('/:userId/clear', auth.protect, cartController.clearCart);
router.put('/:userId/update/:productId', auth.protect, cartController.updateCartItem);

module.exports = router;
