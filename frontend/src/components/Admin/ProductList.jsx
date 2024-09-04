import React, { useState, useEffect } from 'react';
import axios from 'axios';
import saffron1 from "../../assets/Images/saffron-1.jpg";
import saffron2 from "../../assets/Images/saffron-2.jpg";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editedProduct, setEditedProduct] = useState({
    name: '',
    description: '',
    content: '',
    variants: [{ weight: '', price: '', stock: '' }],
    rating : ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products'); // Adjust the endpoint as needed
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditedProduct({ ...product });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...editedProduct.variants];
    newVariants[index] = { ...newVariants[index], [name]: value };
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      variants: newVariants
    }));
  };

  const handleAddVariant = () => {
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      variants: [...prevProduct.variants, { weight: '', price: '', stock: '' }]
    }));
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`/products/${editProduct._id}`, editedProduct);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === response.data._id ? response.data : product
        )
      );
      setEditProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleCancelClick = () => {
    setEditProduct(null);
  };

  const getProductImage = (index) => {
    // Use different images for different products based on index or some identifier
    return index % 2 === 0 ? saffron1 : saffron2;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={getProductImage(index)}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            {editProduct && editProduct._id === product._id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  className="block w-full mb-2 p-3 border border-gray-300 rounded"
                />
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="block w-full mb-2 p-3 border border-gray-300 rounded"
                />
                <textarea
                  name="content"
                  value={editedProduct.content}
                  onChange={handleInputChange}
                  placeholder="Content"
                  className="block w-full mb-2 p-3 border border-gray-300 rounded"
                />
                <div className="mb-4">
                  {editedProduct.variants.map((variant, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="number"
                        name="weight"
                        value={variant.weight}
                        onChange={(e) => handleVariantChange(index, e)}
                        placeholder="Weight"
                        className="block w-full mb-1 p-3 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        name="price"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, e)}
                        placeholder="Price"
                        className="block w-full mb-1 p-3 border border-gray-300 rounded"
                      />
                      <input
                        type="number"
                        name="stock"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, e)}
                        placeholder="Stock"
                        className="block w-full mb-1 p-3 border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                  <button
                    onClick={handleAddVariant}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                  >
                    Add Variant
                  </button>
                </div>
                <input
                  type="number"
                  name="rating"
                  value={editedProduct.rating}
                  onChange={handleInputChange}
                  placeholder="Rating"
                  className="block w-full mb-2 p-3 border border-gray-300 rounded"
                />
                <button
                  onClick={handleSaveClick}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelClick}
                  className="ml-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.description}</p>
                <p className="text-gray-900 font-semibold mb-2">Price: ₹{product.variants[0].price}</p>
                <p className="text-gray-600 mb-4">Rating: {product.rating}</p>
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
