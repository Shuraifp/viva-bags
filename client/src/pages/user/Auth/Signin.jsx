import React, { useState,useContext } from 'react'
import { AuthContext } from '../../../context/AuthProvider';
import { useNavigate, Link, Navigate } from 'react-router-dom'
import bagImage from '../../../assets/used/6.avif'
import google from '../../../assets/used/google.webp';
import { loginUser } from '../../../api/auth';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast'
import { auth, provider } from '../../../firebase';
import { signInWithPopup } from 'firebase/auth';

const Signin = () => {
  const { user,addUserCredentials } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleBackClick = () => {
    navigate('/');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (e.target.email.value === '' || e.target.password.value === '') {
      toast.error("Invalid credentials");
      return;
    }

    loginUser(email, password)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          addUserCredentials(response.data.accessToken, response.data.refreshToken, response.data.user);
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error('An error occurred. Please try again.');
      });
  };

  const handleGoogleAuth = async() => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      const token = await result.user.getIdToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/auth/login/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: token,
        },
      });
      
      const { accessToken , refreshToken, user} = await response.json();
      if(response.status === 200) {
        addUserCredentials(accessToken, refreshToken, user);
        toast.success("Login successful");
        navigate("/");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  return user ? <Navigate to="/" /> : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <Toaster />
        <div className="flex-1 pr-8">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-8">
            <span className="font-light">Login to</span> 
            <span className="text-yellow-500">VIVA</span>
            <span className="text-black ml-1">BAGS</span>
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out" 
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out" 
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <button 
                type="submit" 
                className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Login
              </button>
            </div>

            <div className="text-center mt-1">
              <Link to="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-600 transition duration-200">Forgot Password?</Link>
            </div>

            <div className="mt-1 text-center">
              <button
                type="button"
                onClick={handleBackClick}
                className="text-sm text-gray-700 hover:text-gray-900 transition duration-200"
              >
                &#8592; Back to home
              </button>
            </div>
          </form>

          {/* Google OAuth Button */}
        <div className="mt-3 text-center">
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center w-full border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200"
            >
              <img
                src={google}
                alt="Google Logo"
                className="h-12 w-12 mr-2"
              />
              <span className="text-gray-600 font-medium">Sign Up with Google</span>
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">Are you new here? <Link to="/signup" className="text-yellow-500 hover:text-yellow-600 transition duration-200">Sign Up</Link></p>
        </div>

        <div className="flex-1">
          <img 
            src={bagImage} 
            alt="Duffel Bag" 
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default Signin;
