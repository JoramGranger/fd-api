// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// Cart operations
router.post('/add', auth.protect, cartController.addToCart); // Add to cart
router.get('/', auth.protect, cartController.getCart); // Get cart
router.delete('/clear', auth.protect, cartController.clearCart); // Clear cart

module.exports = router;
