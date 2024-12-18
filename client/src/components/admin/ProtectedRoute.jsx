// import React from "react";
// import { Navigate } from "react-router-dom";
// import { isTokenExpired } from "../../utils";

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("adminAccessToken");

//   if (!token || isTokenExpired(token)) {
//     return <Navigate to="/admin/signin" />;
//   }

//   return children;
// };

// export default ProtectedRoute;
