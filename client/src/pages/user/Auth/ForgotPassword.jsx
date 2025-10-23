import { useState, useEffect } from 'react';
import { sendResetPasswordEmail, resetPassword } from '../../../api/users';
import toast from 'react-hot-toast';
import { Link,useParams, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const {token} = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isTokenSent, setIsTokenSent] = useState(false);

  useEffect(() => {
    if (token) {
      setResetToken(token);
      setIsTokenSent(true);
    }
  }, [token]);

  const handleSendEmail = async () => {
    try {
      const response = await sendResetPasswordEmail({ email });
      if (response.status === 200) {
        console.log(response.data);
        toast.success(response.data.message);
        setIsTokenSent(true);
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!passwordPattern.test(newPassword)) {
      toast.error('Password must be at least 6 characters long and contain a number');
      return;
    }
    try {
      const response = await resetPassword({ resetToken, newPassword });
      if (response.status === 200) {
        toast.success(response.data.message);
        setEmail('');
        setResetToken('');
        setNewPassword('');
        setIsTokenSent(false);
        navigate('/signin');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if(error.response){
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <div className="bg-white shadow-md w-[400px] h-[300px] p-6">
        {!isTokenSent ? (
          <div>
            <h3 className="text-xl font-semibold text-center pt-4">Reset Password</h3>
            <p className='pb-3 px-4 text-gray-400 text-sm text-center'>Or if you don't have one, you can create a new password</p>
            <p className='py-3 text-gray-500 text-center'>Enter your email address to receive a reset link.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="block w-full mt-2 p-2 border border-gray-300"
            />
            <div className='flex justify-between gap-2'>
              <button
                onClick={handleSendEmail}
                className="bg-yellow-500 hover:bg-yellow-600 text-white w-1/2 px-4 py-2 mt-4"
              >
                Send Email
              </button>
              <Link to={'/signin'}
                className="bg-gray-500 hover:bg-gray-600 text-center text-white w-1/2 px-4 py-2 mt-4"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : resetToken ? (
          <div className='text-center'>
            <h3 className="text-xl font-semibold">Reset Password</h3>
            <p className="py-3 text-gray-500">Enter your new password.</p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="block w-full mt-2 p-2 border border-gray-300"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="block w-full mt-2 p-2 border border-gray-300"
            />
            <div className='flex justify-between gap-2'>
            <button
              onClick={handleResetPassword}
              className="bg-yellow-500 hover:bg-yellow-600 text-white w-1/2 px-4 py-2 mt-4"
            >
              Reset Password
            </button>
            <Link to={'/signin'}
                className="bg-gray-500 hover:bg-gray-600 text-center text-white w-1/2 px-4 py-2 mt-4"
              >
                Back to Login
            </Link>
            </div>
          </div>
        ) : (
          <div className='flex h-full items-center justify-center'>
            <div><p className="py-3 text-yellow-500 font-semibold text-center text-3xl">Check your email.</p>
            <p className='text-gray-500 text-center'>Reset link was sent to your email.</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
