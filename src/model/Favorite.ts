import mongoose from "mongoose";
import Product from "./Product";
import User from './User';

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Product,
  },
}, { timestamps: true });

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);

export default Favorite;
