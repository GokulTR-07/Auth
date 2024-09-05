import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../context/UserContext";
import ProgressBar from "./ProgressBar"; // Assuming ProgressBar is in the same folder

const CheckoutPage = () => {
  const { cartItems, removeItem, updateQuantity } = useContext(CartContext);
  const { user } = useContext(userContext);
  const [progressStep, setProgressStep] = useState(1);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    mobile: "",
    landmark: "",
  });
  const [orderID, setOrderID] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const totalPrice = calculateTotalPrice();
      const orderData = {
        shippingDetails,
        items: cartItems.map(item => ({
          variantId: item._id, 
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        total: totalPrice,
        user: user,
      };


      const response = await axios.post("/orders", orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data && response.data._id) {
        setOrderID(response.data._id);
        setProgressStep(2); // Move to the next step in the progress bar
        navigate("/payment", {
          state: { orderID: response.data._id, cartItems },
        });
      } else {
        throw new Error("Failed to place order");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error placing order:", error);
    }
  };

  const handleIncrement = (id, weight) => {
    updateQuantity(id, weight, 1);
  };

  const handleDecrement = (id, weight) => {
    updateQuantity(id, weight, -1);
  };


  // Calculate Subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Calculate Total including delivery fee
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="container mx-auto my-10 p-5 max-w-7xl bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg">
      <ProgressBar currentStep={progressStep} /> {/* Updated ProgressBar usage */}

      <h1 className="text-3xl uppercase tracking-widest font-bold mb-6 text-gray-900 text-center py-3">Checkout</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Shipping Details */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 flex-1"
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl uppercase tracking-widest text-center font-semibold mb-6 text-gray-900">
            Shipping Details
          </h2>
          <div className="space-y-6 tracking-wider font-semibold">
            {/* Form Fields */}
            <div>
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm mb-2"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-gray-700 text-sm mb-2"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="landmark"
                className="block text-gray-700 text-sm mb-2"
              >
                Landmark
              </label>
              <input
                id="landmark"
                type="text"
                name="landmark"
                value={shippingDetails.landmark}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="city"
                  className="block text-gray-700 text-sm mb-2"
                >
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="zip"
                  className="block text-gray-700 text-sm mb-2"
                >
                  ZIP Code
                </label>
                <input
                  id="zip"
                  type="text"
                  name="zip"
                  value={shippingDetails.zip}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="state"
                  className="block text-gray-700 text-sm mb-2"
                >
                  State
                </label>
                <input
                  id="state"
                  type="text"
                  name="state"
                  value={shippingDetails.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-gray-700 text-sm mb-2"
                >
                  Country
                </label>
                <input
                  id="country"
                  type="text"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="mobile"
                className="block text-gray-700 text-sm mb-2"
              >
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                name="mobile"
                value={shippingDetails.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900"
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 font-semibold tracking-wider text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Save and Continue
              </button>
            </div>
          </div>
        </motion.form>

        {/* Cart Items */}
        <motion.div
          className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 flex-1 flex flex-col"
          initial={{ x: "100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-700">Your cart is empty.</p>
          ) : (
            <>
              <h2 className="text-xl uppercase tracking-widest text-center font-semibold mb-6 text-gray-900">
                Cart Items
              </h2>
              <div className="flex-1">
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center border-b pb-4 mb-4 relative"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-bold tracking-wider text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-700 mt-1">Price: ₹{item.price}</p>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              handleDecrement(item.id, item.weight)
                            }
                            className="bg-gray-300 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-400 transition duration-200"
                            disabled={item.quantity <= 1}
                            aria-label="Decrement quantity"
                          >
                            -
                          </button>
                          <p className="text-gray-700"> {item.quantity}</p>
                          <button
                            onClick={() =>
                              handleIncrement(item.id, item.weight)
                            }
                            className="bg-gray-300 text-gray-800 py-1 px-3 rounded-lg hover:bg-gray-400 transition duration-200"
                            aria-label="Increment quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-gray-700 mt-1">
                          Total: ₹{item.price * item.quantity}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id, item.weight)}
                        className="absolute lg:top-10 lg:right-2 right-0 text-red-500 hover:text-red-700 transition duration-200"
                        aria-label="Remove item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Cart Summary */}
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 tracking-wider text-lg font-semibold">
                    Subtotal
                  </p>
                  <p className="text-gray-900 text-lg font-semibold">
                    ₹{subtotal.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-700 tracking-wider text-lg font-semibold">
                    Delivery Fee
                  </p>
                  <p className="text-gray-900 text-lg font-semibold">
                    ₹{deliveryFee.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-700 tracking-wider text-lg font-semibold">Total</p>
                  <p className="text-gray-900 text-lg font-semibold">
                    ₹{total.toFixed(2)}
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
};

export default CheckoutPage;
