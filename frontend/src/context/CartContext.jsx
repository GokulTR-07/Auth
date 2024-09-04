import React, { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "./UserContext";

// Define a default pack size for wholesalers
const DEFAULT_PACK_SIZE = {
  2: 5, // Default pack size for 2g pack
  5: 2, // Default pack size for 5g pack
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load initial state from localStorage
    const savedItems = localStorage.getItem("cartItems");
    return savedItems ? JSON.parse(savedItems) : [];
  });

  const { user } = useContext(userContext);

  useEffect(() => {
    // Update localStorage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Example of addToCart function
const addToCart = (product) => {
  setCartItems((prevItems) => {
    const existingItemIndex = prevItems.findIndex(
      (item) => item._id === product._id && item.weight === product.weight
    );

    if (existingItemIndex >= 0) {
      // Update quantity if the item already exists
      const updatedItems = [...prevItems];
      updatedItems[existingItemIndex].quantity += product.quantity;
      return updatedItems;
    } else {
      // Add new item to cart
      return [...prevItems, product];
    }
  });
};


  

  const updateQuantity = (productId, weight, amount) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.id === productId && cartItem.weight === weight
          ? {
              ...cartItem,
              quantity: Math.max(
                cartItem.quantity + amount,
                (user && user.role === "wholesaler")
                  ? DEFAULT_PACK_SIZE[weight] || 1
                  : 1
              ),
            }
          : cartItem
      )
    );
  };

  const removeItem = (_id, weight) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item._id === _id && item.weight === weight))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
