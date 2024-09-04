import Order from "../models/order.js";
import TeleCaller from "../models/telecaller.js";
import Wholesaler from "../models/wholesaler.js";

// getting all the orders for admin dashboard

export const getAllUserOrders = async (req,res)=>{
  try {
    const allOrders = await Order.find({
      "user.role": "user"
    });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAllWholesalerOrders = async (req,res)=>{
  try {
    const allOrders = await Order.find({
      "user.role": "wholesaler"
    });
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getAllTelecallerOrders = async (req,res) => {
  try {
    const allOrders = await TeleCaller.find();
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }  
}


export const getDefaultDashboardData = async (req, res) => {
  try {
    const orders = await Order.find();

    const salesData = {};
    const revenueData = {};
    const productSales = {};

    orders.forEach((order) => {
      const month = new Date(order.createdAt).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });

      // Sales Data (Sum of items sold)
      if (!salesData[month]) salesData[month] = 0;
      order.cartItems.forEach((item) => {
        salesData[month] += item.quantity;
      });

      // Revenue Data (Sum of total amounts)
      if (!revenueData[month]) revenueData[month] = 0;
      revenueData[month] += order.total;

      // Top Selling Products
      order.cartItems.forEach((item) => {
        if (!productSales[item.variantId]) {
          productSales[item.variantId] = { name: item.name, quantity: 0, weight: item.weight };
        }
        productSales[item.variantId].quantity += item.quantity;
      });
    });

    // Convert productSales object to an array
    const productSalesArray = Object.values(productSales);

    res.json({
      salesData,
      revenueData,
      productSales: productSalesArray,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


