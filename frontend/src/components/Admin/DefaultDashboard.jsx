import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DefaultDashboard = ({ isDarkMode }) => {
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    axios
      .get("/admin/default-analytics")
      .then((response) => {
        const { salesData, revenueData, productSales } = response.data || {};

        // Prepare data for Line Chart (Sales Data)
        setLineChartData({
          labels: Object.keys(salesData || {}),
          datasets: [
            {
              label: "Sales",
              data: Object.values(salesData || {}),
              borderColor: isDarkMode ? "#9d4edd" : "#8884d8",
              backgroundColor: isDarkMode
                ? "rgba(157, 77, 237, 0.2)"
                : "rgba(136, 132, 216, 0.2)",
            },
          ],
        });

        // Prepare data for Bar Chart (Revenue Data)
        setBarChartData({
          labels: Object.keys(revenueData || {}),
          datasets: [
            {
              label: "Revenue",
              data: Object.values(revenueData || {}),
              backgroundColor: isDarkMode
                ? "rgba(75, 192, 192, 0.6)"
                : "rgba(75, 192, 192, 0.6)",
              borderColor: isDarkMode ? "#4bc0c0" : "#4bc0c0",
              borderWidth: 1,
            },
          ],
        });

        // Prepare data for Pie Chart (Top Selling Products)
        const products = (Array.isArray(productSales) ? productSales : [])
          .filter((product) => product.name && product.quantity)
          .map((product) => ({
            name: product.name,
            quantity: product.quantity,
            weight: product.weight,  // Assuming weight is available in the backend data
          }));

        setPieChartData({
          labels: products.map((product) => product.name),
          datasets: [
            {
              label: "Top Selling Products",
              data: products.map((product) => product.quantity),
              backgroundColor: isDarkMode
                ? ["#ff6b6b", "#4ecdc4", "#f9ca24", "#d1d8e0"]
                : ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
              borderColor: isDarkMode ? "#343a40" : "#fff",
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, [isDarkMode]);

  // Render charts only if data is available
  return (
    <div
      className={`p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Analytics Overview
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Sales Data</h3>
          {lineChartData ? (
            <Line data={lineChartData} options={{ responsive: true }} />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Revenue Data</h3>
          {barChartData ? (
            <Bar data={barChartData} options={{ responsive: true }} />
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Pie Chart (Top Selling Products) */}
        <div className="p-4 bg-white shadow-lg rounded-lg dark:bg-gray-800 dark:text-gray-200">
          <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
          {pieChartData ? (
            <Pie data={pieChartData} options={{ responsive: true }} />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultDashboard;
