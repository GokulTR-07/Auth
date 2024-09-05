import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { userContext } from "../../context/UserContext";
import ProgressBar from "../../components/product/ProgressBar";
import "./PaymentPage.css"; // Import the CSS file

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const { user } = useContext(userContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderID, cartItems } = location.state || {};

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePayment = async () => {
    if (paymentMethod) {
      const totalAmount = calculateTotal();

      try {
        const response = await axios.post("/create-order", {
          amount: totalAmount,
          currency: "INR",
          orderID,
        });

        const { id: order_id, amount, currency } = response.data;

        const options = {
          key: "rzp_test_E76kAtewr8q6e6",
          amount: amount,
          currency: currency,
          name: "ZPrincessSaffron",
          description: "Test Transaction",
          image: "https://example.com/logo.png",
          order_id: order_id,
          handler: async function (response) {
            const paymentDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              paymentMethod: paymentMethod,
            };

            try {
              const verifyResponse = await axios.post("/verify-payment", paymentDetails);
              if (verifyResponse.data.status === "success") {
                const receiptData = {
                  orderNumber: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  date: new Date().toLocaleDateString(),
                  items: cartItems.map((item) => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: `₹${item.price.toFixed(2)}`,
                  })),
                  total: `₹${(amount / 100).toFixed(2)}`,
                };

                navigate("/payment-success", { state: { receiptData } });
              } else {
                console.error("Payment verification failed");
              }
            } catch (error) {
              console.error("Error verifying payment:", error);
            }
          },
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.contact || "",
          },
          theme: {
            color: "#3399cc",
          },
          notes: {
            paymentMethod: paymentMethod,
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error("Payment failed", error);
      }
    } else {
      console.error("Invalid payment method");
    }
  };

  return (
    <div className="container">
      <ProgressBar className="progress-bar" currentStep={2} />
      <h1 className="page-title">Payment</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="card-title">Select Payment Method</h2>
          <div className="mb-6">
            <label className="select-label">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
              className="select-input"
            >
              <option value="">Select an option</option>
              <option value="creditCard">Credit Card</option>
              <option value="debitCard">Debit Card</option>
              <option value="upi">UPI</option>
            </select>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePayment}
              className="button"
            >
              Pay Now
            </button>
          </div>
        </motion.div>

        <motion.div
          className="order-summary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="summary-title">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-700 tracking-wider">No items in the cart.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.name}
                  className="item"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="item-img"
                  />
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                    <p className="item-price">Price: ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))
            )}
            {cartItems.length > 0 && (
              <div className="total">
                <span>Total</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;
