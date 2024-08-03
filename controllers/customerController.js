const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// Create a new customer
exports.createCustomer = async (req, res) => {
  try {
    const { userId, addresses, paymentMethods, orderHistory, wishlist, cart } = req.body;

    const newCustomer = new Customer({
      userId,
      addresses,
      paymentMethods,
      orderHistory,
      wishlist,
      cart
    });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
};

// Get customer details by userId
exports.getCustomerById = async (req, res) => {
  try {
    // Extract userId from request parameters
    const { userId } = req.params;
    
    // Debug logging to verify the value of userId
    console.log('Received userId:', userId);

    // Check if userId is undefined or null
    if (!userId) {
      return res.status(400).json({ message: 'userId parameter is missing' });
    }

    // Validate and convert userId to a MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid userId format' });
    }

    // Find customer by userId
    const customer = await Customer.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('orderHistory wishlist cart');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
};



// Update customer details
exports.updateCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const updates = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updates, { new: true });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Failed to update customer' });
  }
};

// Delete a customer
exports.deleteCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Failed to delete customer' });
  }
};

// Add a payment method to customer
exports.addPaymentMethod = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { paymentMethod } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.paymentMethods.push(paymentMethod);
    await customer.save();

    res.status(200).json({ message: 'Payment method added successfully', paymentMethods: customer.paymentMethods });
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({ message: 'Failed to add payment method' });
  }
};

// Remove a payment method from customer
exports.removePaymentMethod = async (req, res) => {
  try {
    const { customerId, paymentMethodId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.paymentMethods.id(paymentMethodId).remove();
    await customer.save();

    res.status(200).json({ message: 'Payment method removed successfully', paymentMethods: customer.paymentMethods });
  } catch (error) {
    console.error('Error removing payment method:', error);
    res.status(500).json({ message: 'Failed to remove payment method' });
  }
};

// Add a product to the wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { productId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.wishlist.includes(productId)) {
      customer.wishlist.push(productId);
      await customer.save();
    }

    res.status(200).json({ message: 'Product added to wishlist', wishlist: customer.wishlist });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// Remove a product from the wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { customerId, productId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.wishlist.pull(productId);
    await customer.save();

    res.status(200).json({ message: 'Product removed from wishlist', wishlist: customer.wishlist });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { productId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.cart.includes(productId)) {
      customer.cart.push(productId);
      await customer.save();
    }

    res.status(200).json({ message: 'Product added to cart', cart: customer.cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

// Remove a product from the cart
exports.removeFromCart = async (req, res) => {
  try {
    const { customerId, productId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.cart.pull(productId);
    await customer.save();

    res.status(200).json({ message: 'Product removed from cart', cart: customer.cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove from cart' });
  }
};

// Add an order to the order history
exports.addToOrderHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { orderId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    if (!customer.orderHistory.includes(orderId)) {
      customer.orderHistory.push(orderId);
      await customer.save();
    }

    res.status(200).json({ message: 'Order added to history', orderHistory: customer.orderHistory });
  } catch (error) {
    console.error('Error adding to order history:', error);
    res.status(500).json({ message: 'Failed to add to order history' });
  }
};

// Remove an order from the order history
exports.removeFromOrderHistory = async (req, res) => {
  try {
    const { customerId, orderId } = req.params;

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.orderHistory.pull(orderId);
    await customer.save();

    res.status(200).json({ message: 'Order removed from history', orderHistory: customer.orderHistory });
  } catch (error) {
    console.error('Error removing from order history:', error);
    res.status(500).json({ message: 'Failed to remove from order history' });
  }
};
