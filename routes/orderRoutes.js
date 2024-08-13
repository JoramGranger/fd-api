// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// Route to create an order from the cart
router.post('/:userId', auth.protect, orderController.createOrderFromCart);

// Route to update order status
router.put('/:orderId/update', auth.protect, auth.admin, orderController.updateOrderStatus);

// Route to get all orders (admin access)
router.get('/', auth.protect, auth.admin, orderController.getAllOrders);

// Route to get all orders for a specific customer
router.get('/my/:userId', auth.protect, orderController.getOrdersByCustomer);


module.exports = router;
