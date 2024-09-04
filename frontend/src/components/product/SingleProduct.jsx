import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { CartContext } from "../../context/CartContext";
import CartIcon from "./CartIcon";
import CartModel from "./CartModel";
import axios from "axios";
import saffron1 from "/saffron-1.jpg"; // Sample images
import saffron2 from "/saffron-2.jpg";

function SingleProduct() {
  const { addToCart, cartItems } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(2); // Default weight
  const [currentProductIndex, setCurrentProductIndex] = useState(0); // Track current product
  const [clickCount, setClickCount] = useState(0); // Track the number of clicks
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Fetching all products. Adjust endpoint or parameters as needed
        const response = await axios.get("/products"); // Example endpoint
        const products = response.data;

        // Assuming the API returns an array of products
        if (products.length > 0) {
          const productData = products[currentProductIndex];
          console.log("Fetching product data:", productData);
          // Dynamically assign images based on some condition
          productData.img = productData._id === '66d2e6ed20b726ac685d2649' ? saffron1 : saffron2; 
          setProduct(productData);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [currentProductIndex]); // Re-fetch when currentProductIndex changes

  // Handle background color change based on currentProductIndex
  const getBackgroundColor = () => {
    return currentProductIndex === 0
      ? "bg-gradient-to-b from-[#746d9f] to-[#110845c5]" : 
      "bg-gradient-to-b from-[#96c1b8] to-[#719c91]" ;
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleAddToCart = () => {
    if (product) {
      const selectedVariant = product.variants?.find(
        (v) => v.weight === selectedWeight
      );
      const productToAdd = {
        ...product,
        quantity,
        weight: selectedWeight,
        ...selectedVariant,
      };
      addToCart(productToAdd);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout"); // Redirect to checkout
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleSwitchProduct = () => {
    setClickCount((prevCount) => {
      const newCount = prevCount + 1;
      setCurrentProductIndex((prevIndex) => {
        const direction = newCount % 2 === 1 ? 1 : -1; // Toggle between next (1) and previous (-1)
        const newIndex = prevIndex + direction;
        // Ensure the newIndex is within bounds
        return newIndex < 0 ? 0 : newIndex >= 2 ? 1 : newIndex; // Assuming only 2 products
      });
      return newCount;
    });
  };

  if (!product) return <div>Loading...</div>;

  const currentPrice =
    product.variants?.find((v) => v.weight === selectedWeight)?.price || "";

  const stockInfo = product.variants?.find((v) => v.weight === selectedWeight)?.stock;

  return (
    <>
      <CartIcon itemCount={cartItems.length} onClick={handleOpenModal} />
      <CartModel isOpen={isModalOpen} onClose={handleCloseModal} />

      <div className={`w-full h-screen ${getBackgroundColor()}`}>
        <div className="h-[20vh] flex justify-center items-center px-8 space-x-4">
          <button
            className={`py-2.5 px-6 rounded-full font-bold tracking-widest ${
              currentProductIndex === 0
                ? "bg-white text-black"
                : "bg-[#00000066] text-white scale-90"
            }`}
            onClick={() => setCurrentProductIndex(0)}
          >
            KASHMIR SAFFRON
          </button>
          <button
            className={`py-2.5 px-6 rounded-full font-bold tracking-widest ${
              currentProductIndex === 1
                ? "bg-white text-black"
                : "bg-[#00000066] text-white scale-90"
            }`}
            onClick={() => setCurrentProductIndex(1)}
          >
            SPAIN SAFFRON
          </button>
        </div>
        <div className="h-[60vh] flex justify-between px-8">
          <div className="flex-1">
            <h1 className="text-3xl uppercase font-extrabold text-white tracking-[0.3rem]">
              {product.name}
            </h1>
            <p className="text-white font-bold tracking-wider mt-5">
              {product.description}
            </p>
            <p className="text-white font-medium tracking-wider mt-4">
              {product.content}
            </p>
            
            <div className="mt-4 space-x-4">
              <button
                className={`border font-bold h-[60px] w-[60px] rounded-full shadow-md active:scale-95 ${
                  selectedWeight === 2 ? "bg-teal-400 text-white" : ""
                }`}
                onClick={() => setSelectedWeight(2)}
              >
                2 g
              </button>
              <button
                className={`border font-bold h-[60px] w-[60px] rounded-full shadow-md active:scale-95 ${
                  selectedWeight === 5 ? "bg-teal-400 text-white" : ""
                }`}
                onClick={() => setSelectedWeight(5)}
              >
                5 g
              </button>
            </div>

            <div className="text-sm tracking-wider mt-4 text-white">
              {stockInfo > 0
                ? `In Stock (${stockInfo} available)`
                : "Out of Stock"}
            </div>
          </div>
          <div className="flex-1">
            <div className="w-full ml-20">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-80 rounded-lg"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between items-end w-[20vw]">
            <div className="flex items-center space-x-4">
              <button
                className="text-3xl font-medium h-[40px] w-[40px] rounded-sm border border-[#0937096f] bg-white active:scale-95"
                onClick={decrementQuantity}
              >
                -
              </button>
              <span className="font-medium text-lg ">{quantity}</span>
              <button
                className="text-2xl font-medium h-[40px] w-[40px] rounded-sm border border-[#0937096f] bg-white active:scale-95"
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
            <div
              className="h-[150px] w-[40px] bg-[#e3dddd7b] flex justify-center items-center mt-[10vh] text-black cursor-pointer"
              onClick={handleSwitchProduct}
            >
              <FaChevronRight />
            </div>
          </div>
        </div>
        <div className="h-[20vh] flex justify-between items-center px-[20vh]">
          <button
            className="py-3.5 px-7 text-lg tracking-widest font-bold rounded-full border-none bg-white shadow-md"
            onClick={handleAddToCart}
          >
            ADD TO CART
          </button>
          <h1 className="text-3xl tracking-wider text-white drop-shadow-md">
            <span className="text-3xl font-semibold ">Price :</span> ₹{currentPrice}
          </h1>
          <button
            className="py-3.5 px-7 text-lg tracking-widest font-bold rounded-full border-none bg-white shadow-md"
            onClick={handleBuyNow}
          >
            BUY NOW
          </button>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;

