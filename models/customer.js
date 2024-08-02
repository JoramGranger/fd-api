const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    unique: true 
  },
  addresses: [
    {
      type: String, 
      required: false 
    }
  ],
  paymentMethods: [
    {
      type: { type: String, required: false }, // e.g., 'credit card', 'PayPal'
      details: { type: String, required: false } // Tokenized or encrypted details
    }
  ],
  orderHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  cart: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  /* preferredContactMethod: { type: String, default: 'email' }, // 'email', 'phone', etc.
  loyaltyPoints: { type: Number, default: 0 },
  customerNotes: { type: String, default: '' },
  preferredLanguage: { type: String, default: 'en' },
  subscriptionStatus: { type: Boolean, default: false },
  accountBalance: { type: Number, default: 0 }, */
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
