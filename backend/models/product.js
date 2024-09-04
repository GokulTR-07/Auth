import mongoose from 'mongoose';
const { Schema } = mongoose;

const variantSchema = new Schema({
  weight: { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
}, { _id: true }); // Enables automatic generation of _id for each variant

const productSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  content: String,
  variants: [variantSchema],
  productFeatures: Object,
  category: [String],
  rating: Number,
  img: String,
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
export default Product;
