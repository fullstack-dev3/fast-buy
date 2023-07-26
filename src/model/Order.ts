import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  orderItems: [
    {
      qty: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Product,
      }
    }
  ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true, default: "Paypal" },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
}, {timestamps: true});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;