import React, { createContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCartCount, setWishlistCount } from "../redux/cartwishlistSlice";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  
    const storedAdmin = localStorage.getItem("admin");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);
  

  const logout = () => {
    localStorage.removeItem("userRefreshToken");
    localStorage.removeItem("userAccessToken");
    localStorage.removeItem("user");
    dispatch(setCartCount(0));
    dispatch(setWishlistCount(0));
    setUser(null);
  };
  
  const addUserCredentials = (accessToken, refreshToken, user) => {
    localStorage.setItem("userAccessToken", accessToken);
    localStorage.setItem("userRefreshToken", refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch(setCartCount(user.cartCount));
    dispatch(setWishlistCount(user.wishlistCount));
    setUser(user);
  }
  const addAdminCredentials = (accessToken, refreshToken, admin) => {
    localStorage.setItem("adminAccessToken", accessToken);
    localStorage.setItem("adminRefreshToken", refreshToken);
    localStorage.setItem('admin', JSON.stringify(admin));
    setAdmin(admin);
  }
  const adminLogout = () => {
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminAccessToken");
    localStorage.removeItem("admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ user, logout, admin, adminLogout,addUserCredentials,addAdminCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};
