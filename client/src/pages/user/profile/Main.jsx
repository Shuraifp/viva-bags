import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import Sidebar from "./Sidebar";
import Footer from '../../../components/Footer'
import { useNavigate, Outlet, Navigate, Link } from "react-router-dom";
import { userApiWithAuth } from "../../../api/axios";
import { getCountOfCartItems } from "../../../api/cart";
import Navbar from "../../../components/Navbar";

const UserProfile = ({ children }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [user, setUser] = useState(null);
  const [cartCount, setCartCount] =useState(0)
  const [activeItem, setActiveItem] = useState('Dashboard')

  useEffect(() => {
    userApiWithAuth
      .post('/user/auth/validate-token')
      .then((response) => {
        setIsAuthenticated(response.data.isAuthenticated);
        // setUser(response.data.currentUser);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error validating token:"+error);
        setIsLoading(false);
      });

      const getCartCount = async () => {
        try {
          const response = await getCountOfCartItems();
          setCartCount(response.data)
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      };
      getCartCount()
  }, []);
  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? (
    <div className="bg-gray-100 min-h-screen flex flex-col">
    <Navbar />
      <div className="flex">
        <Sidebar user={user} activeItem={activeItem} setActiveItem={setActiveItem}/>
        <div className="flex-1 px-4">
          <Outlet />
        </div>
      </div>
        <Footer />
    </div>
  ) : (
    <Navigate to="/signin" />
  );
};

export default UserProfile;
