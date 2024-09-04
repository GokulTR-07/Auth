import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    phone: "",
    email: "", // Added email to the initial state
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the current user profile data from the backend
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile", {
          withCredentials: true, // To include cookies in the request
        });
        if (response.data) {
          setPersonalInfo(response.data);
        } else {
          console.error("No user data found.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) => {
      const updatedInfo = {
        ...prevInfo,
        [name]: value,
      };
      console.log("Updated personal info:", updatedInfo);
      return updatedInfo;
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/profile", personalInfo, {
        withCredentials: true, // Include cookies for authentication
      });

      if (response.status === 200) {
        setIsEditing(false); // Exit edit mode after saving
      } 
    } catch (error) {
      console.error("Error saving profile data:", error);
      // Optionally show an error message
    }
  };

  const handleCancel = () => {
    // Reload the profile data to reset any unsaved changes
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile", {
          withCredentials: true, // To include cookies in the request
        });
        if (response.data) {
          setPersonalInfo(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
    setIsEditing(false); // Exit edit mode
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>

      <div className="bg-white p-6 rounded-lg space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={personalInfo.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handleInputChange}
                disabled
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={personalInfo.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                  isEditing ? "bg-white" : "bg-gray-100"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-indigo-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-600"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-600"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600"
            >
              Edit
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
