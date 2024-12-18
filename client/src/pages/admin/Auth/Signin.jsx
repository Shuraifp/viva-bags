import React, { useState,useContext } from 'react';
import { AuthContext } from '../../../context/AuthProvider';
import img from '../../../assets/used/6.avif';
import { loginAdmin } from '../../../api/auth';
import { useNavigate,Navigate } from 'react-router-dom';


const Login = () => {
  const {admin , addAdminCredentials} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;
    if(email === '' || password === '') {
      setError("Invalid credentials");
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(password)) {
      setError('Password must be at least 6 characters long and contain a number');
      return;
    }

    setError('');
    setIsLoading(true);

    loginAdmin(email, password)
      .then((response) => {
        setIsLoading(false);
        if (response.status === 200) {
          addAdminCredentials(response.data.accessToken, response.data.refreshToken, response.data.admin);
          navigate('/admin/overview');
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.message || 'An error occurred while logging in');
      });
  };

  return admin ? <Navigate to="/admin/overview" /> : (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex justify-center">
          <p className="text-2xl mx-auto font-semibold border border-gray-200 rounded-full px-3 text-gray-800 bg-white py-2 mb-5">
            Admin Login
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="w-full px-4 py-2 mt-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-2 mt-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
