import { useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = ({activeItem, setActiveItem}) => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const menuItems = [
    {
      label: "My Details",
      path: "/profile/profileInfo"
    },
    {
      label: "My Orders",
      path: "/profile/orders"
    },
    {
      label: "My Address book",
      path: "/profile/address"
    },
    {
      label: "Wallet",
      path: "/profile/wallet"
    },
    {
      label: "Logout",
      path: "/"
    }  
  ];
  
  const handleItemClick = (itemName) => {
    if(itemName !== 'Logout'){
      setActiveItem(itemName);
      navigate(menuItems.find(item => item.label === itemName).path);
    } else{
      logout();
      navigate('/')
      toast.success('Logged out successfully')
    }
  };

  return (
    <div className="w-full sm:w-1/4 md:w-64 bg-gray-500 p-4 pt-0 my-4 md:min-h-screen shadow-lg transform transition-transform duration-300 ease-in-out">
      <h2 className="text-2xl font-semibold p-8 border-b text-white border-yellow-500">My Account</h2>
      <nav className="p-4">
        {menuItems.map((item) => (
          <p
            key={item.label}
            onClick={() => handleItemClick(item.label)}
            className={`block py-2 px-4 rounded text-white transition-all duration-100 transform ${ 
              activeItem === item.label ?
              'bg-white text-yellow-600 translate-x-2' : 
              'hover:bg-white hover:text-yellow-600 hover:translate-x-2'}`}
          >
            {item.label}
          </p>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
