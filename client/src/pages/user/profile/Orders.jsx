import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { getAllOrdersForUser, cancelOrder,cancelItem } from "../../../api/order";
import { Link, useNavigate } from "react-router-dom";
import Pagination from '../../../components/Pagination'
import toast from "react-hot-toast";

const MyOrders = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1)
  const [orderStatus, setOrderStatus] = useState({});
  const limitPerPage = 2;
  const orderActionsByStatus = {
    Pending: ["Cancel Order","View Details"], 
    Shipped: ["View Details"],
    Delivered: ["View Details"],
    Cancelled: ["View Details"]
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersForUser(currentPage,limitPerPage);
      setOrders([...response.data.orders]);
      // setOrderStatus({...response.data.orders.map(order => order.products.length > 1 ? { ...order, status: "In-Progress Items" } : { ...order, status: order.products[0].status })});
      setFilteredOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
      window.scrollTo({top:0,behavior:'instant'})
    } catch (err) {
      if(err.response){
        if(err.response.status === 401 && err.response.data.message === "User is blocked"){
          logout();
        }
      }
    }
  };

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
      } else if (action === "View Details") {
        navigate(`/profile/orders/${orderId}`);
      }
       else {
        navigate(`/profile/orders`);
      }
    } catch (err) {
        toast.error(err.data.message);
      
    }
  };

  const handleCancelItem = async (orderId, productId) => {
    try {
      const response = await cancelItem(orderId, productId);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchOrders();
      }
    } catch (err) {
      toast.error(err.response.data.message);
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
      {filteredOrders.length === 0 && activeTab === "All Orders" && (
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
                // to={}
                className="text-blue-500 hover:underline text-sm"
              >
                Download Invoice
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
              { order.products.length > 1 ? item.status !== "Cancelled" && order.status !== "Cancelled" ? 
              <button
                onClick={() => {
                  if (order.status === "Delivered") {
                    handleReturnItem(order._id, item.productId._id);
                  } else {
                    handleCancelItem(order._id, item.productId._id)
                  }
                }}
                className="h-fit md:mr-12 text-sm md:text-base px-4 py-2 border border-red-500 text-red-500 hover:text-white hover:bg-red-600 focus:outline-none"
              >
                {order.status === "Delivered" ? "Return Item" : "Cancel Item"}
              </button> : <p className="text-sm md:text-base md:mr-12 text-red-500">Cancelled</p> : ""}
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            { order.status !== "Cancelled" && orderActionsByStatus[order.status].map((action, actionIndex) => (
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
