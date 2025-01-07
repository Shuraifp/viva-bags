import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { getAllOrdersForUser, cancelOrder,cancelItem, requestReturnItem , returnOrder} from "../../../api/order";
import { useNavigate } from "react-router-dom";
import Pagination from '../../../components/Pagination'
import toast from "react-hot-toast";
import { createRazorpayOrder } from '../../../api/payment.js'
import { updatePaymentStatus, downloadInvoice } from "../../../api/order";

const MyOrders = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState({});
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1)
  const limitPerPage = 2;
  const orderActionsByStatus = {
    Pending: ["View Details","Cancel Order"], 
    Shipped: ["View Details"],
    Delivered: ["View Details","Return Order"],
    Cancelled: ["View Details"],
    Returned: ["View Details",'Refund'],
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrdersForUser(currentPage,limitPerPage,activeTab);
      setOrders([...response.data.orders]);
      setFilteredOrders(response.data.orders)
      setTotalPages(response.data.totalPages)
      window.scrollTo({top:0,behavior:'instant'})
    } catch (err) {
      if(err.response){
        if(err.response.status === 401 && err.response.data.message === "User is blocked"){
          logout();
        } else {
          toast.error(err.response.data.message);
        }
      } else {
        toast.error(err.message);
      }
    }
  };

  const handleRazorpayPayment = async (orderId, total,selectedAddress) => {
    
    try {
      const response = await createRazorpayOrder(total);
      const { id, amount } = response.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount.toString(), 
        currency: 'INR',
        order_id: id,
        handler: function (response) {
          updatePaymentStatus(orderId,'Completed');
          navigate('/success')
        },
        prefill: {
          name: selectedAddress?.firstName + ' ' + selectedAddress?.lastName,
          email: selectedAddress?.email,
          contact: selectedAddress?.mobile,
        },
        theme: {
          color: '#F7B800', 
        },
        modal: {
          ondismiss: async () => {
            toast.error("Payment Failed.");
          },
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error initiating Razorpay payment:'+ err);
      toast.error('An error occurred. Please try again.');
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
       else if (action === "Return Items") {
        const response = await returnOrder(orderId, reason);
        if (response.status === 200) {
          toast.success(response.data.message);
          setFilteredOrders(filteredOrders.map(order => order._id === orderId ? response.data.order : order));
        }
      }
    } catch (err) {
        if(err.response){
          toast.error(err.response.data.message);
        } else {
          toast.error(err.message);
        }
    }
  };

  const handleCancelItem = async (orderId, productId) => {
    try {
      const response = await cancelItem(orderId, productId);
      if (response.status === 200) {
        toast.success(response.data.message);
        const updatedOrders = orders.map(order => order._id === orderId ? response.data.order : order);
        setOrders([...updatedOrders]);
        setFilteredOrders([...updatedOrders]);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleReturnItem = async (orderId, productId, reason) => {
    try {
      const response = await requestReturnItem(orderId,productId, reason);
      if (response.status === 200) {
        toast.success(response.data.message);
        const updatedOrders = orders.map(order => order._id === orderId ? response.data.order : order);
        setOrders([...updatedOrders]);
        setFilteredOrders([...updatedOrders]);
      }
    } catch (err) {
      if (err.response) {
          toast.error(err.response.data.message);
      } else {
          toast.error(err.message);
      }
    }
  }

  const handleReasonSubmit = (e) => {
    e.preventDefault();
    if (reason === "") {
      toast.error("Please enter a reason");
      return;
    } else if (reason.length > 100 && reason.length < 5) {
      toast.error("Reason must be between 5 and 100 characters");
      return;
    }
    if(selectedOrderId.action){
      handleOrderAction(selectedOrderId.orderId, "Return Items");
    } else {
      handleReturnItem(selectedOrderId.orderId, selectedOrderId.productId, reason);
    }
    setIsModalOpen(false);
    setSelectedOrderId({});
    setReason("");
  };

  const getInvoice = async (orderId) => {
    try {
      const response = await downloadInvoice(orderId);
      console.log(response.data)
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(pdfBlob);
      link.download = `Invoice_${orderId}.pdf`;
      link.click();
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100">

      {/* modal  */}
      {isModalOpen && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Return Item</h2>
                <form onSubmit={handleReasonSubmit}>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-600">
                        Reason for Return
                    </label>
                    <textarea
                        id="reason"
                        className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write your reason here..."
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    ></textarea>
                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => {
                                setReason('');
                                setIsModalOpen(false);
                                setSelectedOrderId({});
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>}
      
      
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
          `In-Progress`,
          "Completed",
          "Cancelled",
          "Returned",
          'Failed to Process'
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
            { order?.status !== "Cancelled" && order?.status !== "Returned" && order?.paymentStatus === "Completed" && 
              <p
                onClick={() => getInvoice(order._id)}
                className="text-blue-500 hover:underline text-sm"
              >
                Download Invoice
              </p>}
            </div>
          </div>

          <div className="mb-6">
            <p className={`text-lg font-semibold ${order.status === 'Cancelled' || order.status === 'Returned' ? 'text-red-600' : 'text-green-600'}`}>
              {order.status}
            </p>
          </div>

          {/* Items */}
          {order?.products.map((item, itemIndex) => (
            <div 
            key={itemIndex}
            className="border-b border-gray-200 mb-3 flex justify-between items-center">
              <div
                className="flex flex-wrap items-center gap-4  pb-4"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${item?.productId?.images[0].url}`}
                  alt={item.productId?.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.productId?.name}</p>
                  <p className="text-gray-600 text-sm">{item.productId?.category.name}</p>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                </div>
              </div>
              { order.status !== "Cancelled" && order.status !== "Returned"  ? 
              item.status !== "Cancelled" && item.status !== "Returned" ? 
              <button
                onClick={() => {
                  if (item.status === "Delivered") {
                    setSelectedOrderId({orderId: order._id, productId: item.productId._id});
                    setIsModalOpen(true);
                  } else {
                    handleCancelItem(order._id, item.productId._id)
                  }
                }}
                className={`h-fit md:mr-12 text-sm md:text-base px-4 py-2 ${item.isReturnRequested || order.paymentStatus === 'Failed' ? "" : "border border-red-500 text-red-500 hover:text-white hover:bg-red-600 focus:outline-none"}`}
              >
                {order.paymentStatus === 'Failed' ? '' : order.status === "Delivered" ? item.isReturnRequested  ?  item.returnStatus === "Pending" ? "Requested for Return" : item.returnStatus === "Approved" ? "Return Approved" : item.returnStatus === "Completed" ? "Return Completed" : "Return Rejected" :  "Return Item" : "Cancel Item"}
              </button> : <p className="text-sm md:text-base md:mr-12 text-red-500">{item.status}</p> : ""}
            </div>
          ))}

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            { order.paymentStatus !== 'Failed' ? orderActionsByStatus[order.status].map((action, actionIndex) => (
              <button
                key={actionIndex}
                disabled={order.isReturnRequested && action === "Return Order"}
                onClick={action === "Return Order" ? () => {setSelectedOrderId({orderId: order._id,action}); setIsModalOpen(true);} : () => handleOrderAction(order._id, action)}
                className={`text-sm md:text-base px-4 py-2 ${action === "Cancel Order" || action === "Return Order" || action === 'Refund' ? order.isReturnRequested ? order.returnStatus === "Responded" ? "" : "bg-white text-blue-500 border border-blue-500 cursor-default" : "bg-red-500 hover:bg-red-600 text-white" : "bg-yellow-500 hover:bg-yellow-600 text-white"}  focus:outline-none`}
              >
                {order.isReturnRequested && (action === "Return Order" || action === "Refund") 
                ? order.returnStatus === "Pending" 
                  ? "Requested for Return" 
                  : order.returnStatus === "Approved" 
                    ? "Return Approved" 
                    : order.returnStatus === "Rejected" 
                      ? "Return Rejected" 
                      : order.returnStatus === "Completed"
                      ? "Refunded"
                      : "" 
                : action}
              </button>
            ))
            : <button
            onClick={() => handleRazorpayPayment(order._id, order.totalAmount,order.address)}
            className={`text-sm md:text-base px-4 py-2 border border-blue-500 hover:border-blue-600 text-blue-500 focus:outline-none`}
            >
              <p>Retry Payment</p>
            </button>
              }
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
