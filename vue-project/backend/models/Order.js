const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Link to the User model
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: { // Reference to the original product
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: { // We can add payment logic later
    type: Boolean,
    required: true,
    default: false,
  },
  status: {
    type: String,
    required: true,
    default: 'Processing', // e.g., Processing, Shipped, Delivered
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Order', orderSchema);