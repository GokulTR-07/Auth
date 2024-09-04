import React, { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext'; // Adjust path if needed

const CartIcon = ({ onClick }) => {
  const { cartItems } = useContext(CartContext);

  // Calculate total quantity in the cart
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button
      className="fixed top-10 right-4 bg-white border border-gray-300 rounded-full p-2 shadow-lg z-50"
      onClick={onClick}
    >
      <div className="relative">
        <FaShoppingCart size={24} className="text-gray-900 dark:text-white" />
        {totalQuantity > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-medium text-white bg-red-600 rounded-full">
            {totalQuantity}
          </span>
        )}
      </div>
    </button>
  );
};

export default CartIcon;
