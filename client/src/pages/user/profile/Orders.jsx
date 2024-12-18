import React, { useState, useEffect } from "react";
import { getAllOrdersForUser, cancelOrder,cancelItem } from "../../../api/order";
import { Link, useNavigate } from "react-router-dom";
import Pagination from '../../../components/Pagination'
import toast from "react-hot-toast";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1)
  const limitPerPage = 2;
  const orderActionsByStatus = {
    Pending: ["Cancel Order"], // "Change Address", "View/Edit Details", 
    Shipped: ["Track Your Package", "View/Edit Details"],
    Delivered: ["Track Your Package", "View/Edit Details", "Return Item"],
    Cancelled: ["View/Edit Details"],
    Returned: ["View/Edit Details"],
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrdersForUser(currentPage,limitPerPage);
        setOrders([...response.data.orders]);
        setFilteredOrders(response.data.orders)
        setTotalPages(response.data.totalPages)
        window.scrollTo({top:0,behavior:'instant'})
      } catch (err) {
        console.log(err);
      }
    };
    fetchOrders();
  }, [currentPage]);

  const filterOrders = (tab) => {
    setActiveTab(tab);
    if (tab === "All Orders") {
      setFilteredOrders(orders);
    } else if (tab === "In-Progress Items") {
      setFilteredOrders(orders.filter(order => order.status === "Pending" || order.status === "Shipped"));
    } else {
      setFilteredOrders(orders.filter(order => order.status === tab.split(' ')[0]));
    }
  };

  const handleSearch = () => {
    setFilteredOrders(orders.filter(order => order.products.some(product => product.productId.name.toLowerCase().includes(searchTerm.toLowerCase())) || order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const handleOrderAction = async (orderId, action) => {
    try {
      if (action === "Cancel Order") {
        const response = await cancelOrder(orderId);
        if (response.status === 200) {
          toast.success(response.data.message);
          setFilteredOrders(filteredOrders.map(order => order._id === orderId ? { ...order, status: "Cancelled" } : order));
        }
      } else {
        navigate(`/profile/orders`);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const handleCancelItem = async (orderId, productId) => {
    try {
      const response = await cancelItem(orderId, productId);
      if (response.status === 200) {
        toast.success(response.data.message);
        setFilteredOrders(filteredOrders.map(order => order._id === orderId ? { ...order, products: order.products.filter(product => product.productId._id !== productId) } : order));
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100">
      <div className="mb-8 flex items-center justify-between">
      <p className="md:text-2xl text-sm font-semibold md:font-bold mb-6 text-gray-600">My Orders</p>
      <div className="flex items-center">
        <input type="text"  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search orders..." className="border outline-none border-gray-300 w-40 sm:w-52 md:w-60 lg:w-96 px-2 py-2 mr-2 mb-3" />
        <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mb-3">Search</button>
      </div>
      </div>

      
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {[
          "All Orders",
          `In-Progress Items`,
          "Delivered Items",
          "Cancelled Items",
          "Returned Items",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => filterOrders(tab)}
            className={`text-sm md:text-base px-4 py-2 ${activeTab === tab ? "bg-yellow-600 text-white" : "bg-yellow-500 hover:bg-yellow-600"} focus:outline-none border`}
          >
            {tab}
          </button>
        ))}
      </div>
      {filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-2xl font-bold text-gray-400 mb-4">No Orders Found</p>
          <p className="text-gray-600">You haven’t placed any orders yet. Explore products and place an order!</p>
          <button onClick={() => navigate("/shop")} className="mt-4 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-nowrap text-lg">Go to Shop</button>
        </div>
      )}

      <div>
      {filteredOrders.map((order, index) => (
        <div
          key={index}
          className="bg-white shadow-md  p-6 mb-6 border-t-2 border-gray-200"
        >
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div>
            <p className="text-gray-700 text-sm">Order Number: {order.orderNumber}</p>
            <p className="text-gray-700 text-sm">
              Ordered On:{" "}
              {new Date(order?.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}
            </p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">Total Price: {order.totalAmount}</p>
              <Link
                to={`/profile/orders/${order._id}`}
                className="text-blue-500 hover:underline text-sm"
              >
                View Details
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg font-semibold text-green-600">
              {order.status}
            </p>
            {/* {order.estimatedDelivery && (
              <p className="text-gray-600 text-sm">
                Estimated Delivery: {order.estimatedDelivery}
              </p>
            )} */}
          </div>

          {/* Items */}
          {order.products.map((item, itemIndex) => (
            <div 
            key={itemIndex}
            className="border-b border-gray-200 mb-3 flex justify-between items-center">
              <div
                className="flex flex-wrap items-center gap-4  pb-4"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${item.productId.images[0].url}`}
                  alt={item.productId.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.productId.name}</p>
                  <p className="text-gray-600 text-sm">{item.productId.category.name}</p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              { order.status !== "Cancelled" && order.products.length > 1 && <button
                onClick={() => handleCancelItem(order._id, item.productId._id)}
                className="h-fit md:mr-12 text-sm md:text-base px-4 py-2 border border-red-500 text-red-500 hover:text-white hover:bg-red-600 focus:outline-none"
              >
                Cancel item
              </button>}
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            {orderActionsByStatus[order.status].map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={() => handleOrderAction(order._id, action)}
                className={`text-sm md:text-base px-4 py-2 ${action === "Cancel Order" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}  text-white  focus:outline-none`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      ))}
      </div>

      {totalPages > 1 && filteredOrders.length > 0 && (
        <Pagination totalPages={totalPages} onPageChange={handlePageChange} />
      )}
    </div>
  );
};

export default MyOrders;
