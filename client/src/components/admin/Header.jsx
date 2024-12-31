import React, { useState,useContext,useEffect } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { FaBell } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { getReturnRequestedOrders } from "../../api/order";

const Header = () => {
  const { adminLogout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState([]);

  useEffect(() => {
    const getPendingReturnOrders = async () => {
      try {
        const response = await getReturnRequestedOrders();
        setPendingOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getPendingReturnOrders();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const logout = () => {
    adminLogout();
    navigate("/admin/signin");
  };
  console.log(pendingOrders)
  return (
    <header className="bg-gradient-to-r min-h-[12vh] from-gray-900 to-indigo-800 shadow-xl p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-100 md:text-3xl md:ml-6">Dashboard</h1>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <div
        onClick={() => setIsNotificationOpen(!isNotificationOpen)}
        className="flex items-center space-x-2 text-white hover:text-yellow-400 cursor-pointer transition-all duration-300 relative">
          {pendingOrders.length > 0 && <div className="absolute bottom-4 left-6 w-6 h-5 bg-red-500 text-[12px] rounded-full flex items-center justify-center">{pendingOrders.length}</div>}
          <FaBell className="text-2xl" />
          <span className="text-sm ">Notifications</span>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src="https://via.placeholder.com/40"
            alt="Admin Avatar"
            onClick={toggleDropdown}
            className="w-10 h-10 rounded-full hover:ring-4 hover:ring-yellow-400 transition-all duration-300"
          />
          {/* Status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
        </div>
      </div>
      {/* Notification Dropdown */}
      {isNotificationOpen && (
        <div className="absolute right-24 top-14 w-56 bg-white shadow-lg rounded-lg z-10 pt-6">
            <div className="block w-full text-left text-sm px-4 py-2 text-gray-400 border-b border-gray-200">Orders Requested for Return</div>
          <ul className="py-2">
          { pendingOrders.length > 0 ? pendingOrders.map((order) => (
            <Link to={`/admin/orders/${order._id}`}><li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => {
                setPendingOrders([])
                setIsNotificationOpen(false)
              }}>
                {order.orderNumber}
              </button>
            </li></Link>)) 
           : 
              <li>
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                  No Notification
                </button>
              </li>}
          </ul>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-6 mt-36 w-48 bg-white shadow-lg rounded-lg z-10">
          <ul className="py-2">
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>
                Profile
              </button>
            </li>
            <li>
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={logout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

    </header>
  );
};

export default Header;
