import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description:String ,
  image: String ,
  fileName: String,
  slug: String,
  price: Number,
  quantity: Number,
  featured: Boolean,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
}, { timestamps : true });

const Product = mongoose.models.Product  || mongoose.model('Product', ProductSchema);

export default Product;
