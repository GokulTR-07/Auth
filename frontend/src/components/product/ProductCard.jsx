import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from 'react-icons/fa';
import { motion } from "framer-motion";
import { CartContext } from "../../context/CartContext";
import CartIcon from "./CartIcon";
import CartModal from "./CartModel";
import { userContext } from "../../context/UserContext";
import axios from 'axios';
import saffron1 from "../../assets/Images/saffron-1.jpg";
import saffron2 from "../../assets/Images/saffron-2.jpg";

const ProductCard = () => {
  const { user } = useContext(userContext);
  const { cartItems, addToCart } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [selectedWeight, setSelectedWeight] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products'); // Adjust the endpoint based on your backend setup
        const productData = response.data.map((product, index) => ({
          ...product,
          img: index % 2 === 0 ? saffron1 : saffron2, // Assign images alternately or based on some logic
        }));
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const getDefaultQuantity = (productId, weight) => {
    if (user?.role === "wholesaler") {
      return weight === 2 ? 5 : 2;
    }
    return 1; // Default quantity for regular users
  };

  const handleAddToCart = (productId, e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    const weight = selectedWeight[productId] || 2; // Default to 2g if not selected
    const product = products.find((p) => p._id === productId);
    const variant = product.variants.find((v) => v.weight === weight);
    addToCart({
      ...product,
      quantity: quantities[`${productId}-${weight}`] || getDefaultQuantity(productId, weight),
      weight,
      ...variant,
    });
  };

  const handleBuyNow = (productId, e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    handleAddToCart(productId, e); // Add to cart first
    navigate('/checkout'); // Redirect to checkout
  };

  const handleWeightChange = (productId, weight) => {
    setSelectedWeight((prev) => ({
      ...prev,
      [productId]: weight,
    }));
    // Reset quantity when weight changes
    setQuantities((prev) => ({
      ...prev,
      [`${productId}-${weight}`]: getDefaultQuantity(productId, weight),
    }));
  };

  const handleIncrement = (productId) => {
    setQuantities((prev) => ({
      ...prev,
      [`${productId}-${selectedWeight[productId] || 2}`]: (prev[`${productId}-${selectedWeight[productId] || 2}`] || 0) + 1,
    }));
  };

  const handleDecrement = (productId) => {
    setQuantities((prev) => {
      const currentQuantity = prev[`${productId}-${selectedWeight[productId] || 2}`] || 0;
      return {
        ...prev,
        [`${productId}-${selectedWeight[productId] || 2}`]: Math.max(currentQuantity - 1, 1), // Ensure quantity doesn't go below 1
      };
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CartIcon itemCount={cartItems.length} onClick={handleOpenModal} />
      <CartModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <h2 className="text-center text-3xl font-bold mb-10">OUR PRODUCTS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product._id}
            className="bg-gradient-to-b from-[#96c1b8] to-[#719c91] rounded-lg shadow-lg p-4 flex items-center"
            initial={{ opacity: 0.5, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex-1 text-center">
              <h5 className="text-xl font-bold mb-2">{product.name}</h5>
              <p className="text-sm mb-2">{product.description}</p>
              <p className="text-sm mb-2">Origin: {product.productFeatures.origin}</p>
              <div className="flex justify-center mb-4">
                <button
                  className={`border p-2 rounded-l-lg ${selectedWeight[product._id] === 2 ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
                  onClick={() => handleWeightChange(product._id, 2)}
                >
                  2g
                </button>
                <button
                  className={`border p-2 rounded-r-lg ${selectedWeight[product._id] === 5 ? 'bg-gray-300' : 'bg-white'} hover:bg-gray-200`}
                  onClick={() => handleWeightChange(product._id, 5)}
                >
                  5g
                </button>
              </div>
              <div className="text-lg font-semibold mb-2">
                ₹{product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.price || 0}
              </div>
              <div className="text-sm mb-4">
                {product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock > 0
                  ? `In Stock (${product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock} available)`
                  : "Out of Stock"}
              </div>
              <div className="flex justify-center mb-4">
                <button
                  className="border p-2 rounded-l-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => handleDecrement(product._id)}
                >
                  -
                </button>
                <input
                  type="text"
                  value={quantities[`${product._id}-${selectedWeight[product._id] || 2}`] || getDefaultQuantity(product._id, selectedWeight[product._id] || 2)}
                  readOnly
                  className="border-t border-b p-2 text-center w-16"
                />
                <button
                  className="border p-2 rounded-r-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => handleIncrement(product._id)}
                >
                  +
                </button>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  className={`border p-2 rounded-lg text-white transition-colors duration-300 ${
                    product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock > 0
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => handleAddToCart(product._id, e)}
                  disabled={product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock <= 0}
                >
                  Add to Cart
                </button>
                <button
                  className={`border p-2 rounded-lg text-white transition-colors duration-300 ${
                    product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock > 0
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => handleBuyNow(product._id, e)}
                  disabled={product.variants.find((v) => v.weight === (selectedWeight[product._id] || 2))?.stock <= 0}
                >
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </motion.div>
        ))}
      </div>
      <Link to={"/chatbot"}>Bot</Link>
    </div>
  );
};

export default ProductCard;
