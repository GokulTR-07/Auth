import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressBar from "../../components/product/ProgressBar"; // Import the ProgressBar component
import PaymentSuccess from "/PaymentSuccess.gif";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receiptData = location.state?.receiptData || {}; // Access receiptData from location state

  return (
    <div className="container mx-auto my-10 p-5 max-w-7xl">
      <div className="p-6 md:p-8 rounded-lg shadow-lg border bg-gradient-to-r from-teal-100 to-teal-200 border-gray-200">
        <ProgressBar currentStep={3} /> {/* Add the ProgressBar component here */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6 text-green-800 tracking-wider uppercase text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            Payment Successful!
          </motion.h1>
          <motion.img
            src={PaymentSuccess}
            alt="Payment Successful"
            className="w-32 md:w-60 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          />
          <motion.p
            className="text-base md:text-lg text-gray-900 mb-8 text-center font-semibold tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
          >
            Thank you for your purchase. Your payment has been processed successfully. You can find the receipt below.
          </motion.p>

          {/* Receipt Section */}
          <motion.div
            className="bg-white p-4 md:p-6 rounded-lg shadow-md border border-gray-300 w-full max-w-lg mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800 tracking-wider uppercase">Receipt</h2>
            <p className="text-base md:text-lg text-gray-600 mb-2 tracking-wider">Order Number: <span className="font-bold">{receiptData.orderNumber}</span></p>
            <p className="text-base md:text-lg text-gray-600 mb-4 tracking-wider">Date: <span className="font-bold">{receiptData.date}</span></p>
            <ul className="mb-4">
              {receiptData.items && receiptData.items.map((item, index) => (
                <li key={index} className="flex justify-between tracking-wider font-bold mb-2 text-gray-700 md:text-lg text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{item.price}</span>
                </li>
              ))}
            </ul>
            <hr className="my-2" />
            <p className="text-lg md:text-xl mt-3 font-bold tracking-wider text-gray-800 flex justify-between">
              <span>Total</span>
              <span>{receiptData.total}</span>
            </p>
          </motion.div>

          <motion.div
            className="flex justify-center mt-6 md:mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
          >
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg hover:bg-blue-700 transition duration-200 tracking-widest font-bold"
            >
              Return to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
