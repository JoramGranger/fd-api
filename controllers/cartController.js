// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const customer = req.user.id; // Assuming user is authenticated and user ID is available in req.user.id

        let cart = await Cart.findOne({ customer });
        if (!cart) {
            cart = new Cart({ customer });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: 'Product not found' });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].price = product.price; // Update price if needed
        } else {
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getCart = async (req, res) => {
    try {
        const customer = req.user.id;
        const cart = await Cart.findOne({ customer }).populate('items.product');
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const customer = req.user.id;
        await Cart.findOneAndDelete({ customer });
        res.status(200).json({ msg: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
