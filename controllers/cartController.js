const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add an item to the cart
exports.addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        // Validate input
        if (!productId || !quantity) {
            return res.status(400).json({ message: 'Product ID and quantity are required' });
        }

        // Check if the cart exists
        let cart = await Cart.findOne({ customer: userId });
        if (!cart) {
            cart = new Cart({ customer: userId, items: [] });
        }

        // Find the product and its price
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if item already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex > -1) {
            // Update item quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity, price: product.price });
        }

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
};
// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Check if the cart exists
        const cart = await Cart.findOne({ customer: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove item from the cart
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart', error });
    }
};

// Update the quantity of an item in the cart
exports.updateCartItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        console.log("customer: ", userId);

        // Validate input
        if (quantity === undefined) {
            return res.status(400).json({ message: 'Quantity is required' });
        }
        
        // Check if the cart exists
        let cart = await Cart.findOne({ customer: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found', userId });
        }

        // Find and update the item
        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;

        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item in cart:', error);
        res.status(500).json({ message: 'Error updating item in cart', error });
    }
};

// Fetch the cart for a customer
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ customer: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart', error });
    }
};

// Clear all items from the cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the cart exists
        const cart = await Cart.findOne({ customer: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clear the items in the cart
        cart.items = [];
        cart.totalAmount = 0;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Error clearing cart', error });
    }
};

