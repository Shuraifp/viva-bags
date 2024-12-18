import React, { useState } from 'react';
// import { sendResetPasswordEmail, resetPassword } from '../../../api/users.js'; 
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);

  const handleSendResetEmail = async () => {
    try {
      const response = await sendResetPasswordEmail({ email });
      if (response.status === 200) {
        toast.success(response.data.message);
        setIsTokenSent(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to send reset email');
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await resetPassword({ resetToken, newPassword });
      if (response.status === 200) {
        toast.success(response.data.message);
        setEmail('');
        setResetToken('');
        setNewPassword('');
        setIsTokenSent(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="bg-white shadow-md w-[400px] h-[300px] p-6">
        {!isTokenSent ? (
          <div>
            <h3 className="text-xl font-semibold text-center py-4">Forgot Password</h3>
            <p className='py-3 text-center'>Enter your email address to receive a reset link.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full mt-2 p-2 border border-gray-300"
            />
            <div className='flex justify-between gap-2'>
              <button
                onClick={handleSendResetEmail}
                className="bg-yellow-500 hover:bg-yellow-600 text-white w-1/2 px-4 py-2 mt-4"
              >
                Send Reset Email
              </button>
              <Link to={'/signin'}
                className="bg-gray-500 hover:bg-gray-600 text-center text-white w-1/2 px-4 py-2 mt-4"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold">Reset Password</h3>
            <p>Enter the reset token and your new password.</p>
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Enter reset token"
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="block w-full mt-2 p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={handleResetPassword}
              className="bg-green-500 text-white px-4 py-2 mt-4"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
