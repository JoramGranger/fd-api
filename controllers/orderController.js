// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const sendEmail = require('../utils/email');

// Create an order from the cart
exports.createOrderFromCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the customer's cart
        const cart = await Cart.findOne({ customer: userId });
        if (!cart) return res.status(404).json({ msg: 'Cart not found' });

        // Check if the cart is empty
        if (cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // Check for valid product availability and pricing
        let totalAmount = 0;
        const itemsWithDetails = [];
        for (const item of cart.items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ msg: `Product with ID ${item.product} not found` });
            }

            // Check if product is in stock
            if (product.stock < item.quantity) {
                return res.status(400).json({ msg: `Insufficient stock for product ${product.name}` });
            }

            // Calculate total amount
            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            // Add detailed item information to the order
            itemsWithDetails.push({
                product: item.product,
                name: product.name,
                quantity: item.quantity,
                price: product.price,
                itemTotal: itemTotal
            });
        }

        // Create a new order
        const order = new Order({
            customer: userId,
            items: itemsWithDetails,
            totalAmount,
            status: 'Pending', // Initial order status
            createdAt: new Date()
        });

        // Save the order
        await order.save();

        // Clear the cart after creating the order
        await Cart.findOneAndDelete({ customer: userId });

        // Send confirmation email to the customer
        const customer = await User.findById(userId);
        if (customer) {
            const emailOptions = {
                to: customer.email,
                subject: 'Order Confirmation',
                text: `Dear ${customer.name},\n\nThank you for your order! Your order number is ${order._id}. We will notify you when your order status changes.\n\nBest regards,\nYour Company`
            };
            await sendEmail(emailOptions);
        }

        // Respond with the created order
        res.status(201).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Update order status and notify customer
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Update the order status
        order.status = status;
        await order.save();

        // Notify the customer about the status update
        const customer = await Customer.findById(order.customer);
        if (customer) {
            const emailOptions = {
                to: customer.email,
                subject: 'Order Status Update',
                text: `Dear ${customer.name},\n\nYour order status has been updated to "${status}".\n\nBest regards,\nYour Company`
            };
            await sendEmail(emailOptions);
        }

        // Respond with the updated order
        res.status(200).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
