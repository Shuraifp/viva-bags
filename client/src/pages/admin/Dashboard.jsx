import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { adminApiWithAuth as api } from "../../api/axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.post('/admin/auth/validate-token')
    .then(response => {
      console.log(response)
      setIsAuthenticated(response.data.isAuthenticated);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error validating token:", error);
      if (error.response && error.response.status === 403 && error.response.data.message === 'Invalid refresh token') {
        console.log('perr')
        localStorage.removeItem("adminRefreshToken");
        localStorage.removeItem("adminAccessToken");
        localStorage.removeItem("admin");
      }
      setIsLoading(false);  
      navigate('/admin/signin');
    });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  return isAuthenticated ? (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/admin/signin" />
  );
};

export default AdminDashboard;

