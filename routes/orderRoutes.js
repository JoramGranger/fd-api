// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Order operations
router.post('/from-cart', auth.protect, orderController.createOrderFromCart); // Create order from cart

module.exports = router;
