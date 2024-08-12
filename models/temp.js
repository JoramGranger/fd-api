const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


router.post('/:customerId/add', cartController.addToCart);
router.delete('/:customerId/remove/:productId', cartController.removeFromCart);
router.put('/:customerId/update/:productId', cartController.updateCartItem);
router.get('/:customerId', cartController.getCart);

module.exports = router;
