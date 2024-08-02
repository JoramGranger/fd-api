const Customer = require('../models/Customer');
const User = require('../models/User');

// Get Customer Profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id }).populate('userId', '-password');
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update Customer Profile
exports.updateCustomerProfile = async (req, res) => {
  const { addresses, paymentMethods, preferredContactMethod, subscriptionStatus } = req.body;
  try {
    let customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    customer.addresses = addresses || customer.addresses;
    customer.paymentMethods = paymentMethods || customer.paymentMethods;
    customer.preferredContactMethod = preferredContactMethod || customer.preferredContactMethod;
/*     customer.subscriptionStatus = subscriptionStatus !== undefined ? subscriptionStatus : customer.subscriptionStatus; */
    customer.updatedAt = Date.now();

    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add to Wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    customer.wishlist.push(req.body.productId);
    await customer.save();

    res.json({ msg: 'Product added to wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Remove from Wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const customer = await Customer.findOne({ userId: req.user.id });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    customer.wishlist = customer.wishlist.filter(item => item.toString() !== req.body.productId);
    await customer.save();

    res.json({ msg: 'Product removed from wishlist' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Other customer-related controllers can go here (e.g., update payment methods, view order history)
