const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');


router.get('/profile', auth.protect, customerController.getCustomerProfile);
router.put('/profile', auth.protect, customerController.updateCustomerProfile);
router.post('/wishlist', auth.protect, customerController.addToWishlist);
router.delete('/wishlist', auth.protect, customerController.removeFromWishlist);

module.exports = router;
