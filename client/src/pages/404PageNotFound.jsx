import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = ({msg}) => {
  const [message, setMessage] = useState("Oops! The page you're looking for doesn't exist.");
  const navigate = useNavigate();
  if(msg){
    setMessage(msg)
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="text-center p-10 shadow-lg bg-white">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 text-white bg-yellow-600 shadow-md hover:bg-yellow-500 transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
