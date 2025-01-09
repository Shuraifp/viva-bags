import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSingleOrder, updateProductStatus, updateReturnStatus } from "../../api/order";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [isCustomerNotesOpen, setIsCustomerNotesOpen] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getSingleOrder(id);
        setOrder(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();
  }, [id]);
  console.log(order)
  const updateStatus = async (id, status) => {
    try {
      const response = await updateProductStatus(id, order._id, status)
        if(response.status === 200) {
          setOrder(response.data.order)
          toast.success(response.data.message)
        }
      } catch (error) {
        if (error.response){
            toast.error(error.response.data.message); 
        } else {
            toast.error(error.message);
        }
    }
  }

  const handleUpdateReturnStatus = async (id, status) => {
    try {
      const response = await updateReturnStatus(order._id, id, status)
        if(response.status === 200) {
          setOrder(response.data.order)
          toast.success(response.data.message)
        }
      } catch (error) {
          if (error.response){
            toast.error(error.response.data.message); 
        } else {
            toast.error(error.message);
        }
    }
  }
  
  return (
    <div className="min-h-[calc(100vh-80px)] p-6 flex justify-center overflow-y-scroll no-scrollbar">
      <div className="w-full max-w-6xl  space-y-2">
        {/* Order Header */}
        <div className="flex justify-between bg-white items-center border-b py-6 px-4  mb-2">
          <h2 className="text-2xl font-semibold">
            Order Number <span className="text-red-500">#{order?.orderNumber}</span>
          </h2>
        </div>

        <div className="flex justify-between bg-white items-center border-b py-4 px-4 pb-12 mb-2">
        {/* Items Summary */}
        <div className="bg-white p-4 w-full space-y-4">
          <h3 className="text-lg font-semibold mb-3">Items summary</h3>
          <table className="min-w-full border-separate border-spacing-y-1 border-spacing-x-0.5">
          <thead>
            <tr className="bg-yellow-500 text-left">
              <th className="p-2 border border-gray-200 text-center">Item</th>
              <th className="p-2 border border-gray-200 text-center">Quantity</th>
              <th className="p-2 border border-gray-200 text-center">Price</th>
              <th className="p-2 border border-gray-200 text-center">Total</th>
              <th className="p-2 border border-gray-200 text-center">Status</th>
              {(order?.isReturnRequested || order?.products.some(product => product.isReturnRequested)) && <th className="p-2 border border-gray-200 text-center">Return</th>}
            </tr>
          </thead>
          <tbody>
            {order?.products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200 flex gap-2">
                 <img
                   src={`${product.productId.images[0].url}`}
                   alt={product.productId.name}
                   className="w-20 h-20 object-cover rounded-md border border-yellow-200"
                 />
                 <div>
                   <span className="font-semibold text-gray-800">{product.productId.name}</span>
                   <p className=" text-gray-500 text-sm">{product.productId.category.name}</p>
                   <p className="text-sm" style={{ color: product.productId.color.hex }}>Color: {product.productId.color.name}</p>
                   <span className="text-gray-500 text-sm">Size: {product.productId.size}</span>
                 </div>
                </td>
                <td className="p-2 border border-gray-200 text-center">{product.quantity}</td>
                <td className="p-2 border border-gray-200 text-center">{product.productId.discountedPrice.toFixed(2)}</td>
                <td className="p-2 border border-gray-200 text-center">{(product.productId.discountedPrice * product.quantity).toFixed(2)}</td>
                <td className="text-center">
                  <select
                    value={product.status}
                    onChange={(e) => updateStatus(product.productId._id, e.target.value)}
                    className={`appearance-none bg-gray-200 hover:bg-gray-300 ${product.status === "Shipped" ? "text-yellow-500" : product.status === "Delivered" ? "text-green-500" : product.status === "Cancelled" ? "text-red-500" : 'text-gray-500'} border border-gray-200 text-center py-10 focus:ring-yellow-500 focus:border-yellow-500 block w-full m-0`}
                  >
                    <option value="Pending" className="text-gray-900">Pending</option>
                    <option value="Shipped" className="text-yellow-600">Shipped</option>
                    <option value="Delivered" className="text-green-600">Delivered</option>
                    <option value="Cancelled" className="text-red-600">Cancelled</option>
                    <option value="Returned" className="text-red-600">Returned</option>
                  </select>
              </td>
              {(order?.isReturnRequested || order?.products.some(product => product.isReturnRequested)) && <td className="text-center">
                  <select
                    value={product.returnStatus || 'None'}
                    onChange={(e) => handleUpdateReturnStatus(product.productId._id, e.target.value)}
                    className={`appearance-none  ${product.returnStatus === "Approved" ? "text-yellow-500" : product.returnStatus === "Completed" ? "text-green-500" : product.returnStatus === "Rejected" ? "text-red-500" : 'text-gray-500'} border border-gray-200 text-center focus:ring-yellow-500 focus:border-yellow-500 block w-full ${!product.isReturnRequested ? "py-10 bg-gray-200" : "py-2 h-[70px] bg-gray-200 hover:bg-gray-300"} m-0`}
                  >
                    <option value="None" className="text-gray-500">None</option>
                    <option disabled={product.returnStatus !== "Pending"} value="Pending" className="text-gray-900">Pending</option>
                    <option disabled={product.returnStatus === "Completed"} value="Approved" className="text-yellow-600">Approved</option>
                    <option disabled={product.returnStatus === "Completed"} value="Rejected" className="text-green-600">Rejected</option>
                    <option disabled={product.returnStatus === "Rejected" || product.returnStatus === "Pending"} value="Completed" className="text-red-600">Completed</option>
                  </select>
                  { product.isReturnRequested && 
                  <div
                  onClick={() => setIsCustomerNotesOpen(!isCustomerNotesOpen)}
                  className="text-center cursor-pointer relative"
                  >
                    <p className="text-gray-500 bg-gray-300 py-1 hover:bg-gray-400 hover:text-white mt-1 text-sm">Customer Notes</p>
                    { isCustomerNotesOpen &&
                    <div
                    className="absolute top-8 left-0 right-0 bg-gray-200 p-2 border border-gray-300 text-sm"
                    ><p className="text-left">{order.returnReason ? order.returnReason : product.returnReason}</p></div>}
                  </div>}
              </td>}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
        {/* Customer and Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <div className="md:col-span-4 mb-6 bg-white p-6 space-y-4 border border-gray-200">
            <h3 className="text-lg font-semibold mb-1 py-3">Customer And Order Details</h3>
            <p className="border-b py-3 flex justify-between mx-3">Customer Name: <span className="font-medium">{order?.address.fullName.toUpperCase()}</span></p>
            <p className="border-b py-3 flex justify-between mx-3">Phone Number: <span className="font-medium">{order?.address.mobile}</span></p>
            <p className="border-b py-3 flex justify-between mx-3">Payment Method: <span className="font-medium">{order?.paymentMethod}</span></p>
            <p className="border-b py-3 flex justify-between mx-3">Delivery: <span className="font-medium">Delivery</span></p>
          </div>
            <div className="md:col-span-2">
              {/* Order Summary */}
              <div className="bg-orange-200 rounded-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Order Created:</span>
                  <span>{new Date(order?.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
              })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Order Time:</span>
                  <span>{new Date(order?.createdAt).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{order?.products.reduce((total, product) => total + product.price * product.quantity, 0)}</span>
                </div>
                {order?.coupon.discountValue !== 0 && <div className="flex justify-between">
                  <span>Coupon Discount:</span>
                  <span className="text-green-600 font-medium">{order?.coupon.discountType === "percentage" ? `-${order?.coupon.discountValue}%` : `-₹${order?.coupon.discountValue}`}</span>
                </div>}
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span>{order?.shippingCost}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-2">
                  <span>Total:</span>
                  <span>{order?.totalAmount}</span>
                </div>
              </div>
            
              {/* Delivery Address */}
              <div className="bg-orange-200 p-6 mt-4 mb-6 border rounded-md border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Delivery Address</h3>
                <p>Address: <span className="font-medium">{order?.address.address}, {order?.address.locality}, {order?.address.state}, {order?.address.country}</span></p>
                <p>Pincode: <span className="font-medium">{order?.address.pincode}</span></p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default OrderDetails;
