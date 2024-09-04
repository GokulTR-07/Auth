import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  MdWbSunny,
  MdNightlight,
  MdDashboard,
  MdPeople,
  MdLocalOffer,
  MdAssessment,
  MdShoppingCart,
  MdPerson,
  MdNotifications,
} from "react-icons/md";
import { IoPersonCircleOutline, IoSettings } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import axios from "axios";

const AdminDashboard = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOrderDropdownOpen, setIsOrderDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleOrderDropdown = () => {
    setIsOrderDropdownOpen(!isOrderDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
      // Redirect to login page
      navigate("/"); 
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div
      className={`flex h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 fixed h-full ${
          isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-700"
        } shadow-lg`}
      >
        <div className="p-6 text-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">
            Admin Dashboard
          </h1>
        </div>
        <nav className="mt-10 space-y-2">
          <Link
          onClick={() => setSelectedCategory("dashboard")}
          to={"/admin/dashboard"}
            className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 ${
              selectedCategory === "dashboard"
                ? "bg-indigo-600 text-white"
                : isDarkMode
                ? "hover:bg-gray-700 text-gray-200"
                : "hover:bg-indigo-600 text-gray-700 hover:text-white"
            }`}
          >
            <MdDashboard size={24} className="mr-3" />
            Dashboard
          </Link>
          <div className="relative">
            <a
              onClick={toggleOrderDropdown}
              className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 cursor-pointer ${
                selectedCategory === "orders"
                  ? "bg-indigo-600 text-white"
                  : isDarkMode
                  ? "hover:bg-gray-700 text-gray-200"
                  : "hover:bg-indigo-600 text-gray-700 hover:text-white"
              }`}
            >
              <MdShoppingCart size={24} className="mr-3" />
              Orders
            </a>
            {isOrderDropdownOpen && (
              <div
                className={`mt-2 pl-6 space-y-1 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-700"
                } shadow-lg rounded-lg z-10`}
              >
                <Link
                  to='/admin/user-orders'
                  onClick={() => setSelectedCategory("userOrders")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 rounded-t-lg ${
                    selectedCategory === "userOrders"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  User Orders
                </Link>
                <Link
                  to='/admin/wholesaler-orders'
                  onClick={() => setSelectedCategory("wholesalerOrders")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 ${
                    selectedCategory === "wholesalerOrders"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  WholeSaler Orders
                </Link>
                <Link
                  to='/admin/telecaller-orders'
                  onClick={() => setSelectedCategory("telecallerOrders")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 rounded-b-lg ${
                    selectedCategory === "telecallerOrders"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  TeleCaller Orders
                </Link>
              </div>
            )}
          </div>

          <Link
              to='/admin/all-products'
            onClick={() => setSelectedCategory("products")}
            className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 ${
              selectedCategory === "products"
                ? "bg-indigo-600 text-white"
                : isDarkMode
                ? "hover:bg-gray-700 text-gray-200"
                : "hover:bg-indigo-600 text-gray-700 hover:text-white"
            }`}
          >
            <MdLocalOffer size={24} className="mr-3" />
            Products
          </Link>
          <div className="relative">
            <a
              onClick={toggleUserDropdown}
              className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 cursor-pointer ${
                isDarkMode
                  ? "hover:bg-gray-700 text-gray-200"
                  : "hover:bg-indigo-600 text-gray-700 hover:text-white"
              }`}
            >
              <MdPeople size={24} className="mr-3" />
              Users
            </a>
            {isUserDropdownOpen && (
              <div
                className={`mt-2 pl-6 space-y-1 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-700"
                } shadow-lg rounded-lg z-10`}
              >
                <Link
                  to='/admin/all-users'
                  onClick={() => setSelectedCategory("allUsers")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 rounded-t-lg ${
                    selectedCategory === "allUsers"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  All Users
                </Link>
                <Link
                  to='/admin/all-marketers'
                  onClick={() => setSelectedCategory("allMarketers")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 ${
                    selectedCategory === "allMarketers"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  All Marketers
                </Link>
                <Link
                  to='/admin/all-wholesalers'
                  onClick={() => setSelectedCategory("allWholesalers")}
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 rounded-b-lg ${
                    selectedCategory === "allWholesalers"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "text-gray-200"
                      : "text-gray-700"
                  }`}
                >
                  All Wholesalers
                </Link>
              </div>
            )}
          </div>
          <Link
              to='/admin/analytics'
            onClick={() => setSelectedCategory("analytics")}
            className={`flex items-center py-2.5 px-4 rounded-lg transition duration-200 ${
              selectedCategory === "analytics"
                ? "bg-indigo-600 text-white"
                : isDarkMode
                ? "hover:bg-gray-700 text-gray-200"
                : "hover:bg-indigo-600 text-gray-700 hover:text-white"
            }`}
          >
            <MdAssessment size={24} className="mr-3" />
            Analytics
          </Link>
        </nav>

        {/* Profile Section */}
        <div className="absolute bottom-0 w-full border-t border-gray-200">
          <div
            className="p-4 text-center cursor-pointer"
            onClick={toggleProfileDropdown}
          >
            <div
              className={`flex items-center justify-center space-x-2 p-2 rounded-lg transition duration-200 ${
                isDarkMode
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <MdPerson size={24} />
              <span className="font-medium">Admin</span>
            </div>
            {isProfileDropdownOpen && (
              <div
                className={`mt-2 p-2 ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-700"
                } shadow-lg rounded-lg z-10`}
              >
                <Link
                  to={"/admin/profile"}
                  onClick={() => setSelectedCategory("profile")}
                  className={`flex mb-1 items-center justify-center py-2.5 px-4 rounded-lg transition duration-200 ${
                    selectedCategory === "profile"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "hover:bg-gray-700 text-gray-200"
                      : "hover:bg-indigo-600 text-gray-700 hover:text-white"
                  }`}
                >
                  Profile
                  <IoPersonCircleOutline size={23} className="ml-1" />
                </Link>
                <Link
                  to={"/admin/settings"}
                  onClick={() => setSelectedCategory("settings")}
                  className={`flex mb-1 items-center justify-center py-2.5 px-4 rounded-lg transition duration-200 ${
                    selectedCategory === "settings"
                      ? "bg-indigo-600 text-white"
                      : isDarkMode
                      ? "hover:bg-gray-700 text-gray-200"
                      : "hover:bg-indigo-600 text-gray-700 hover:text-white"
                  }`}
                >
                  Settings
                  <IoSettings size={20} className="ml-1" />
                </Link>
                <a
                  className={`block py-2 px-4 hover:bg-indigo-600 hover:text-white transition duration-200 rounded-b-lg`}
                >
                <button
                  onClick={handleLogout}
                >
                  Logout
                </button>
                </a>
                
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 ml-64 p-8 overflow-y-auto ${
          isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-800"
        }`}
      >
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Notification Icon */}
            <button className="p-2 rounded-full bg-gray-800 text-white">
              <MdNotifications size={24} />
            </button>
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-yellow-400" : "bg-gray-800"
              } text-white`}
            >
              {isDarkMode ? (
                <MdWbSunny size={24} />
              ) : (
                <MdNightlight size={24} />
              )}
            </button>
            {/* Enroll a Marketer Button */}
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-full shadow-md hover:shadow-lg transition duration-200">
              <Link to={"/register-marketer"}>Enroll a Marketer</Link>
            </button>
          </div>
        </div>
        
        <div>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
