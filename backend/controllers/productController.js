import Product from "../models/product.js";


export const getProducts = async (req,res) =>{
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const updateProduct = async (req,res) =>{
  const productId = req.params.id;
  const updatedData = req.body;

  try {
    const product = await Product.findByIdAndUpdate(productId, updatedData, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: 'Server error' });
  }
}
