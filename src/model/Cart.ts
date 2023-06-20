import mongoose from "mongoose";
import Product from "./Product";
import User from "./User";

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
}, { timestamps: true });

const Cart = mongoose.models.Cart || mongoose.model('Cart', CartSchema);

export default Cart;
