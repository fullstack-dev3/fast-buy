import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name : String,
  description :String ,
  image : String ,
  slug : String
}, { timestamps : true });

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export default Category;
