import React, { useState, useEffect } from "react";
import { FaUsers, FaShoppingCart ,FaRupeeSign} from "react-icons/fa";
import { countUsers } from "../../../api/overview";
import { countOrders } from "../../../api/overview";
import { fetchChartData } from "../../../api/overview";
import Chart from "./Chart";
import toast from "react-hot-toast";
import TopProductsandCategories from "./TopProductsandCategories";

const DashboardContent = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await countUsers();
        setTotalUsers(response.data.count);

        const orderResponse = await countOrders();
        setTotalOrders(orderResponse.data.count);

        const revenueResponse = await fetchChartData('Yearly');
        setTotalRevenue(revenueResponse.data.totalPrices);
      } catch (error) {
        if (error.response){
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="overflow-y-auto no-scrollbar h-full pb-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 pl-3">
      
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-4">
          <FaUsers className="text-4xl text-yellow-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Total Users</h2>
            <p className="text-3xl font-bold text-gray-600">{totalUsers}</p>
          </div>
        </div>
      </div>

      
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-4">
          <FaShoppingCart className="text-4xl text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Orders This Month</h2>
            <p className="text-3xl font-bold text-gray-600">{totalOrders}</p>
          </div>
        </div>
      </div>

      
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out">
        <div className="flex items-center space-x-4">
          <FaRupeeSign className="text-4xl text-green-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Revenue</h2>
            <p className="text-3xl font-bold text-gray-600">{totalRevenue[2]?.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>

    
    
      <Chart />

      <TopProductsandCategories />
  
    </div>
  );
};

export default DashboardContent;
