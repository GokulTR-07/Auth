import mongoose from "mongoose";
const { Schema } = mongoose;

const orderSchema = new Schema({
  shippingDetails: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    landmark: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true },
    mobile: { type: String, required: true },
  },
  cartItems: [{
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    weight: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    name: { type: String }, // Ensure this is required
    _id: { type: mongoose.Schema.Types.ObjectId } // Ensure this is required
  }],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Processed', 'Accepted', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processed',
  },
  user: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: String,
  },
  payment: {
    paymentId: String, // Payment ID from payment gateway
    paymentMethod: {
      type: String,
      enum: ['creditCard', 'debitCard', 'upi'],
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending',
    },
    transactionId: String, // Transaction ID from payment gateway (if applicable)
    signature: String, // Payment signature (if applicable)
  },
  receiptData: {
    orderNumber: String, // Receipt order number
    paymentId: String, // Payment ID
    signature: String, // Payment signature
    date: { type: Date, default: Date.now }, // Payment date
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
