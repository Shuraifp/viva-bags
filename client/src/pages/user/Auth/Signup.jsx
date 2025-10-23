import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import { useNavigate, Link ,Navigate } from "react-router-dom";
import bagImage from "../../../assets/used/6.avif";
import toast from 'react-hot-toast';
import axios from "axios";
import { Toaster } from 'react-hot-toast';
import google from '../../../assets/used/google.webp';
import { registerUser } from "../../../api/auth";
import { auth, provider } from '../../../firebase';
import { signInWithPopup } from 'firebase/auth';

const Signup = () => {
  const { user,addUserCredentials } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(59);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [referralCode, setReferralCode] = useState('');

  const handleBackClick = () => {
    navigate(-1);
  };


  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }
  }, [isOtpSent, timer]);

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleSendOtp = async () => {
    if (email === '' || password === '') {
      toast.error("Invalid credentials");
      return;
    }

    const usernamePattern = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernamePattern.test(username)) {
      toast.error("Username must be 3-15 characters long and can only include letters, numbers, and underscores.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}[\]|;:'",.<>?/\\`~-]{6,}$/;
    if (!passwordPattern.test(password)) {
      toast.error('Password must be 6 characters long and contain at least one letter and one number');
      return;
    }
    

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/auth/send-otp`, { email });
      if (response.data.success) {
        setIsOtpSent(true);
        setTimer(59);
        setIsResendDisabled(true);
      }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const handleResendOtp = () => {
    if (!isResendDisabled) {
      handleSendOtp();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (otp === "") {
      toast.error("No OTP was provided!");
      return;
    }
    const userData = {
      username,
      email,
      password,
      otp,
      referralCode
    };

    registerUser(userData)
      .then((response) => {
        if (response.status === 201) {
          addUserCredentials(response.data.accessToken, response.data.refreshToken, response.data.user);
          toast.success(response.data.message);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if(error.response){
          toast.error(error.response.data.message);
        }
        else{
          toast.error(error.message);
        }
      });
  };

  const handleGoogleAuth = async() => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userInfo = result.user;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/auth/login/firebase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInfo }),
      });
      const { accessToken , refreshToken, user} = await response.json();
      if(response.status === 200) {
        addUserCredentials(accessToken, refreshToken, user);
        toast.success("login successful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };
  return user ? <Navigate to="/" /> : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex-1 pr-8">
          <Toaster />

          {/* Back Button */}
          <div>
            <button
              type="button"
              onClick={handleBackClick}
              className="text-2xl text-gray-700 hover:text-gray-900 transition duration-200"
            >
              &#8592;
            </button>
          </div>

          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
            <span className="font-light">Sign Up for</span>{" "}
            <span className="text-yellow-500">VIVA</span>
            <span className="text-black ml-1">BAGS</span>
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-3">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password Field */}
            {!isOtpSent && (
              <div className="mb-3">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {/* OTP Field */}
            {isOtpSent && isResendDisabled && (
              <div className="mb-3">
                <label
                  htmlFor="otp"
                  className="block text-gray-700 text-sm font-medium mb-1"
                >
                  Enter OTP <span className="text-blue-400 font-normal ml-1">check your email for the OTP</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="block w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"
                  placeholder="Enter the OTP sent to your email"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {timer > 0
                    ? `Resend OTP in ${timer} seconds`
                    : "You can resend the OTP now."}
                </div>
              </div>
            )}

            {!isResendDisabled && (
              <div className="text-center mt-10 mb-12">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className={`text-sm ${
                    isResendDisabled
                      ? "text-gray-400"
                      : "text-yellow-500 hover:text-yellow-600"
                  } transition duration-200`}
                >
                  Resend OTP
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center w-full">
              {!isOtpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Send OTP
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-sm hover:bg-yellow-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  Sign Up
                </button>
              )}
              </div>

              <div className="flex items-center">
                <input 
                  type="text"
                  name='referralCode'
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Referral Code"
                  className="block w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 transition duration-200 ease-in-out"  
                />
              </div>
            </div>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6 text-center">
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
          <p className="mt-4 text-sm text-gray-600 text-center">Already have an account? <Link to="/signin" className="text-yellow-500 hover:text-yellow-600 transition duration-200">Sign In</Link></p>
        </div>

        <div className="hidden md:block flex-1">
          <img
            src={bagImage}
            alt="Bag"
            className="object-cover rounded-lg h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
