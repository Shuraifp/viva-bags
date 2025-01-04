import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import RightSidebar from "./RightSidebar";
import { fetchChartData } from "../../../api/overview";
import {Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement);

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [timeframe, setTimeframe] = useState("Yearly");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const fetchDataForTimeframe = async (selectedTimeframe, startDate, endDate) => {
    try {
      const response = await fetchChartData(selectedTimeframe, startDate, endDate);
      if(response.status === 200){
        console.log(response.data);
        setLabels(response.data.labels);
        setRevenueData(response.data.totalPrices);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateTimeframe = (selectedTimeframe) => {
    setTimeframe(selectedTimeframe);
    fetchDataForTimeframe(selectedTimeframe, customStartDate, customEndDate);
  };

  const handleCustomDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setCustomStartDate(value);
    } else {
      setCustomEndDate(value);
    }
  };

  console.log(revenueData);
  useEffect(() => {
    fetchDataForTimeframe(timeframe, customStartDate, customEndDate);
  }, [timeframe, customStartDate, customEndDate]);

  const lineChartData = {
    labels: labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sales and Revenue",
      },
    },
  };

  return (
    <>
    <div className="flex relative pl-3">
      <div className="w-full flex mt-8">
        <div className="w-3/4 pl-3 bg-gray-50 shadow-lg rounded-lg px-10">
          <div className="mt-4 mb-4">
            <div style={{ width: "100%", height: "50%" }}>
              <Line data={lineChartData} options={chartOptions} />
          
                <div className="mt-8">
                  <div className="flex justify-center gap-8">
                    
                      <button className={`py-2 px-4 hover:bg-gray-300 ${timeframe === 'Weekly' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => updateTimeframe("Weekly")}>
                        Weekly
                      </button>
                  
                      <button className={`py-2 px-4 hover:bg-gray-300 ${timeframe === 'Monthly' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => updateTimeframe("Monthly")}>
                        Monthly
                      </button>
                    
                      <button className={`py-2 px-4 hover:bg-gray-300 ${timeframe === 'Yearly' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => updateTimeframe("Yearly")}>
                        Yearly
                      </button>
                      <div className="relative inline-block">
                      <button className={`py-2 px-4 hover:bg-gray-300 ${timeframe === 'Custom' ? 'bg-gray-300' : 'bg-gray-100'}`} onClick={() => updateTimeframe("Custom")}>
                        Custom Date Range
                      </button>
                      {timeframe === 'Custom' && (
                        <div className="absolute bg-white border border-gray-300 mt-2 p-2 rounded shadow-md">
                          <input
                            type="date"
                            name="startDate"
                            value={customStartDate}
                            onChange={handleCustomDateChange}
                          />
                          <input
                            type="date"
                            name="endDate"
                            value={customEndDate}
                            onChange={handleCustomDateChange}
                          />
                          </div>
                        )}
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <RightSidebar />
        </div>
    </div>
    </div>
    </>
  );
};

export default Dashboard;