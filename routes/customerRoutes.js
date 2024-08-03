const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');

// Create a new customer
router.post('/', auth.protect, auth.admin, customerController.createCustomer);

// Get customer details by ID
router.get('/:userId', auth.protect, customerController.getCustomerById);

// Update customer details
router.put('/:customerId', auth.protect, customerController.updateCustomer);

// Delete a customer
router.delete('/:customerId', auth.protect, auth.admin, customerController.deleteCustomer);

// Add a payment method to a customer
router.post('/:customerId/payment-methods', auth.protect, customerController.addPaymentMethod);

// Remove a payment method from a customer
router.delete('/:customerId/payment-methods/:paymentMethodId', auth.protect, customerController.removePaymentMethod);

// Add a product to the wishlist
router.post('/:customerId/wishlist', auth.protect, customerController.addToWishlist);

// Remove a product from the wishlist
router.delete('/:customerId/wishlist/:productId', auth.protect, customerController.removeFromWishlist);

// Add a product to the cart
router.post('/:customerId/cart', auth.protect, customerController.addToCart);

// Remove a product from the cart
router.delete('/:customerId/cart/:productId', auth.protect, customerController.removeFromCart);

// Add an order to the order history
router.post('/:customerId/order-history', auth.protect, customerController.addToOrderHistory);

// Remove an order from the order history
router.delete('/:customerId/order-history/:orderId', auth.protect, customerController.removeFromOrderHistory);

module.exports = router;
