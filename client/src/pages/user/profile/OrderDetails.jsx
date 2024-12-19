import React, { useState, useEffect } from "react";
import { useParams ,Link} from "react-router-dom";
import { getSingleOrder } from "../../../api/order";

const OrderDetails = () => {
  const { orderId :id } = useParams();
  const [order, setOrder] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const orderstatusus = {
    1: "Pending",
    2: "Shipped",
    3: "Delivered",
    4: "Cancelled"
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getSingleOrder(id);
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrder();
  }, [id]);
  console.log(order)
  
  useEffect(() => {
    if (order) {
      for (let i = 0; i < Object.keys(orderstatusus).length; i++) {
        if (order.status === Object.values(orderstatusus)[i]) {
          setStatusIndex(i);
          break;
        }
      }
    }
  }, [order]);
  
  console.log(statusIndex)

  const subtotal = order?.products.reduce((acc, item) => acc + item.productId.discountedPrice * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;
  return (
    <div className="p-4 md:p-8 bg-gray-100">
      {/* Progress Section */}
      <div className="bg-white shadow p-4 mb-6">

        <div className="flex flex-wrap justify-between mb-4">
          <div>
            <p className="text-gray-400 font-bold text-2xl mb-2">Order: #{order?.orderNumber}</p>
            <p className="text-gray-700 text-sm">
              {new Date(order?.createdAt).toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
          <div className="flex items-start ">
            <Link
              // to={`/profile/orders/${order?._id}`}
              className="text-blue-500 hover:underline text-sm"
            >
              Download Invoice
            </Link>
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4">Progress</h2>
        <div className="flex items-center justify-between space-x-4">
          {order?.status !== "Cancelled" && ["Order Placed", "Processing", "Shipping", "Delivered"].map((step, index) => (
            <div
              key={index}
              className={`flex-1 text-center py-2 border ${
                index <= statusIndex + 1 ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-200 text-gray-500"
              } rounded-sm`}
            >
              <span className="block text-sm font-medium">{step}</span>
            </div>
          ))}
          {order?.status === "Cancelled" && (
            <div className="flex-1 text-center py-2 border bg-red-50 border-red-500 rounded-sm">
              <span className="block text-sm font-medium text-red-500">Cancelled</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white shadow p-4 mb-6 overflow-x-auto">
        { order?.products.length > 1 ? <h2 className="text-lg font-semibold mb-4">Products</h2> :
        <h2 className="text-lg font-semibold mb-4">Product</h2>
      }
        <table className="min-w-full border-separate border-spacing-y-1 border-spacing-x-0.5">
          <thead>
            <tr className="bg-yellow-500 text-left">
              <th className="p-2 border border-gray-200 text-center">Item</th>
              <th className="p-2 border border-gray-200 text-center">Quantity</th>
              <th className="p-2 border border-gray-200 text-center">Price</th>
              <th className="p-2 border border-gray-200 text-center">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order?.products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border border-gray-200 flex gap-2">
                 <img
                   src={`${import.meta.env.VITE_API_URL}${product.productId.images[0].url}`}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment and Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Payment Section */}
        <div className="bg-white shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Payment</h2>
          <ul>
            <li className="flex justify-between py-1">
              <span>Subtotal:</span>
              <span>{subtotal}</span>
            </li>
            <li className="flex justify-between py-1 line-through">
              <span>Discount :</span>
            </li>
            <li className="flex justify-between py-1">
              <span>Shipping Cost:</span>
              <span>{shipping}</span>
            </li>
            <li className="flex justify-between py-1 font-semibold">
              <span>Total:</span>
              <span>{total}</span>
            </li>
          </ul>
        </div>

        {/* Customer Details */}
        <div className="bg-white shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Customer</h2>
          <div className="mb-4">
            <h3 className="text-sm font-medium">General Information</h3>
            <p>{order?.user.username}</p>
            <p>{order?.user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Shipping Address</h3>
            <p>{order?.address.address}</p>
            <p>{order?.address.locality} {order?.address.state}</p>
            <p>{order?.address.pincode}</p>
            <p>{order?.address.country}</p>
            <p>{order?.address.mobile}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
