import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

const CartModel = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const slideIn = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' },
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    navigate('/checkout');
  };

  const handleRemoveItem = (item) => {
    removeItem(item._id, item.weight); // Pass both id and weight
  };

  const handleQuantityChange = (item, delta) => {
    // Update quantity with delta (-1 or 1)
    updateQuantity(item.id, item.weight, delta);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 overflow-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={slideIn}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-lg mx-auto mt-10 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg"
      >
        <button
          className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={onClose}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Cart</h2>
        <div className="max-h-[60vh] overflow-y-auto">
          {cartItems.length === 0 ? (
            <p className="text-gray-700 dark:text-gray-300">
              {window.location.reload()}
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <div key={`${item.id}-${item.weight}`} className="flex items-center border-b border-gray-200 dark:border-gray-700 py-4">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Weight: {item.weight}g</p>
                  <p className="text-gray-600 dark:text-gray-400">₹{item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded"
                      onClick={() => handleQuantityChange(item, -1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded"
                      onClick={() => handleQuantityChange(item, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="mr-4 text-red-500 border border-red-500 hover:text-red-600 rounded-full p-0.5"
                  onClick={() => handleRemoveItem(item)}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="mt-4">
            <button
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartModel;
