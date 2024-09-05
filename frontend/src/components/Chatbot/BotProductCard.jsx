import React from 'react';
import { useNavigate } from 'react-router-dom';

const BotProductCard = ({ product }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = () => {
    navigate(`/singleproduct`); // Navigate to the product section
  };

  return (
    <div
      className="relative w-44 h-64 bg-white shadow-lg cursor-pointer transition-transform transform hover:scale-105"
      onClick={handleClick}
    >
      <div className="w-full h-2/3 bg-gray-200 overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-white px-4 py-2 flex flex-col justify-end">
        <div className="text-lg font-semibold text-gray-800">{product.name}</div>
        <div className="absolute bottom-0 left-0 w-full bg-blue-400 text-white text-center py-2 transform -translate-y-20 transition-transform group-hover:translate-y-0">
          Click to Know more
        </div>
      </div>
    </div>
  );
};

export default BotProductCard;
