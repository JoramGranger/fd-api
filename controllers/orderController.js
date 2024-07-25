// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrderFromCart = async (req, res) => {
    try {
        const customer = req.user.id;

        // Find and remove the cart
        const cart = await Cart.findOneAndDelete({ customer });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        // Create the order from the cart
        const order = new Order({
            customer,
            items: cart.items,
            totalAmount: cart.totalAmount
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
