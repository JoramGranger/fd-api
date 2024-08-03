const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentMethodSchema = new Schema({
  token: { type: String, required: true }, // Tokenized payment method
  methodType: { type: String, enum: ['card', 'mobile'], required: true }, // Type of payment method
  last4: { type: String }, // Last four digits of the card, if applicable
  network: { type: String }, // Network name (e.g., 'Visa', 'MasterCard'), if applicable
  mobileNumber: { type: String }, // Mobile number, if applicable
  expiryDate: { type: String }, // Expiration date, if applicable
});

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
    PaymentMethodSchema
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CustomerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Customer = mongoose.model('Customer', CustomerSchema);
module.exports = Customer;
