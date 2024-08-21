// controllers/orderController.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
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

            // Update product stock and sold count
            product.stock -= item.quantity;
            product.sold += item.quantity;

            // Save the updated product
            await product.save();

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
            paymentMethod: req.body.paymentMethod, // Get payment method from request body
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

        // Validate status
        if (!['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Update the order status
        order.status = status;
        await order.save();

        // Notify the customer about the status update
        const customer = await User.findById(order.customer);
        if (customer) {
            const emailOptions = {
                to: customer.email,
                subject: 'Order Status Update',
                text: `Dear ${customer.name},\n\nYour order status has been updated to "${status}".\n\nBest regards,\nFortune Derma`
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

// Get all orders (admin access)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer').populate('items.product');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get all orders for a specific customer
exports.getOrdersByCustomer = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find orders for the specific customer
        const orders = await Order.find({ customer: userId }).populate('items.product');
        if (orders.length === 0) {
            return res.status(404).json({ msg: 'No orders found for this customer' });
        }

        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId)
            .populate('customer') // Populate customer details
            .populate('items.product'); // Populate product details in items

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Respond with the order details
        res.status(200).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};
