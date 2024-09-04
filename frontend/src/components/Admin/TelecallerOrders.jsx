import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TelecallerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/admin/telecaller-orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching the orders:', error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">TeleCaller Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Business Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Product</th>
              <th className="px-4 py-2 border">Quantity</th>
              <th className="px-4 py-2 border">Price</th>
              <th className="px-4 py-2 border">Street Address</th>
              <th className="px-4 py-2 border">City</th>
              <th className="px-4 py-2 border">State</th>
              <th className="px-4 py-2 border">Zip Code</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="px-4 py-2 border">{order.name}</td>
                <td className="px-4 py-2 border">{order.businessName}</td>
                <td className="px-4 py-2 border">{order.email}</td>
                <td className="px-4 py-2 border">{order.phone}</td>
                <td className="px-4 py-2 border">{order.purchasedProduct}</td>
                <td className="px-4 py-2 border">{order.quantity}</td>
                <td className="px-4 py-2 border">{order.price}</td>
                <td className="px-4 py-2 border">{order.streetAddress}</td>
                <td className="px-4 py-2 border">{order.city}</td>
                <td className="px-4 py-2 border">{order.state}</td>
                <td className="px-4 py-2 border">{order.zipCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TelecallerOrders;
