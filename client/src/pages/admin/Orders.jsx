import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus } from "../../api/order";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [statusUpdate, setStatusUpdate] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState('');
  const [searchPressed, setSearchPressed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders(currentPage, itemsPerPage, filter, search);
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching orders:"+ error);
      }
    }

    fetchOrders();
  }, [currentPage, filter, statusUpdate, searchPressed]);
  

  const changeStatus = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(orderId, newStatus );
      if(response.status === 200){
        setStatusUpdate(!statusUpdate);
        toast.success(response.data.message);
      } else {
        console.log(response)
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  }
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };
console.log(orders)
  return (
    <div className="p-6 bg-gray-100 h-screen relative">
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="mr-2 font-medium">Filter:</label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="border border-gray-300 p-2 py-1 rounded-md"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => setSearchPressed(!searchPressed)}
            className="px-3 py-3  text-nowrap text-white bg-gray-600 hover:bg-gray-700">
            <FaSearch />
          </button>
          <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by offer code"
              className="border border-gray-300 p-2 ml-1"
            />
        </div>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="text-white text-left">
            <th className="py-2 px-4 bg-gray-700">SL</th>
            <th className="py-2 px-4 bg-gray-600">Order Number</th>
            <th className="py-2 px-4 bg-gray-700">Ordered By</th>
            <th className="py-2 px-4 bg-gray-600">Payment Method</th>
            <th className="py-2 px-4 bg-gray-700">Ordered On</th>
            <th className="py-2 px-4 bg-gray-600">Status</th>
            <th className="py-2 px-4 bg-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((item, index) => (
            <tr
              key={index}
              className={`border-b ${
                item.status === "Cancelled" || item.status === "Returned" ? "bg-orange-100" : "bg-white"
              }`}
            >
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">{item.orderNumber}</td>
              <td className="py-2 px-4">{item.user.username}</td>
              <td className="py-2 px-4">{item.paymentMethod}</td>
              <td className="py-2 px-4">{new Date(item.createdAt).toLocaleString().split(",")[0]}</td>
              <td className="py-2 px-4">
                <select 
                value={item.status}
                onChange={(e) => changeStatus(item._id, e.target.value)}
                className="border border-gray-300 p-2 rounded-sm"
                >
                  <option value="Pending" disabled={["Delivered", "Cancelled", "Returned"].includes(item.status)}>Pending</option>
                  <option value="Shipped" disabled={["Delivered", "Cancelled", "Returned"].includes(item.status)}>Shipped</option>
                  <option value="Delivered" disabled={["Cancelled", "Returned","Pending"].includes(item.status)}>Delivered</option>
                  <option value="Cancelled" disabled={item.status==="Returned" || item.products.some((product) => product.status === "Delivered")}>Cancelled</option>
                  <option value="Returned" disabled={item.status!=="Delivered"}>Returned</option>
                </select>
              </td>
              <td className="py-2 px-4 space-x-2">
                <Link to={`/admin/orders/${item._id}`}>
                  <button className="bg-yellow-700 text-white px-3 py-1 rounded-md">
                    View/Edit
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center items-center mt-4">
        <nav className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageClick(index + 1)}
              className={`px-3 py-1 ${
                currentPage === index + 1
                  ? "bg-gray-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default OrderManagement;
