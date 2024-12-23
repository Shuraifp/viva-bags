import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaList,
  FaBox,
  FaShoppingCart,
  FaShapes,
  FaTags,
  FaTicketAlt,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  const menuItems = [
    { name: "Overview", link: "/admin/overview", icon: <FaTachometerAlt /> },
    { name: "Customers", link: "/admin/customers", icon: <FaUsers /> },
    { name: "Categories", link: "/admin/categories", icon: <FaList /> },
    { name: "Brands", link: "/admin/brands", icon: <FaShapes /> },
    { name: "Products", link: "/admin/products", icon: <FaBox /> },
    { name: "Orders", link: "/admin/orders", icon: <FaShoppingCart /> },
    { name: "Offers", link: "#", icon: <FaTags /> },
    { name: "Coupons", link: "/admin/coupons", icon: <FaTicketAlt /> },
    { name: "Settings", link: "#", icon: <FaCog /> },
  ];

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
  };
  
  if(!activeItem){
    setActiveItem("Overview");
    navigate("/admin/overview")
  }

  return (
    <div
      className={`bg-gray-800 text-white mr-5 ${isOpen ? "w-56" : "w-16"} h-screen duration-300 relative`}
    >
  
      <div
        className={`bg-slate-500 text-gray-900 flex flex-col items-center justify-center font-extrabold py-4 transition-all duration-500 ${
          isOpen ? "h-20" : "h-36"
        }`}
      >
        {isOpen ? (
          <div className="flex items-center text-3xl">
            <span className="text-yellow-500">VIVA</span>
            <span className="text-black ml-1">BAGS</span>
          </div>
        ) : (
          <div className="text-yellow-500 text-2xl flex flex-col items-center">
            <span>V</span>
            <span>I</span>
            <span>V</span>
            <span>A</span>
          </div>
        )}
      </div>

      <button
        className="absolute top-4 right-[-12px] bg-gray-800 text-white rounded-full p-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "X" : "☰"}
      </button>

      <ul className="mt-4">
        {menuItems.map((item, index) => (
          <Link to={item.link} key={index}><li
            className={`flex items-center gap-4 px-4 py-3 cursor-pointer group ${
              activeItem === item.name
                ? "bg-gray-600 text-yellow-500" 
                : "hover:bg-gray-600 hover:text-yellow-500"
            }`}
            onClick={() => handleItemClick(item.name)} 
          >
            <span className="text-xl">{item.icon}</span>
            <span
              className={`text-md font-normal ${
                isOpen ? "opacity-100" : "hidden"
              }`}
            >
              {item.name}
            </span>
          </li></Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
