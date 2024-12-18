import React, { useState, useEffect } from 'react';
import { fetchUserProfileData, editProfile, changePassword } from '../../../api/users.js';
import toast from 'react-hot-toast';
import ForgotPassword from './ForgotPassword.jsx';

const UserProfile = () => {
  const [user, setUser] = useState();
  const [editing, setEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchUserProfileData();
        console.log(response)
        if (response.status === 200) {
          setUser(response.data.user);
          console.log(response.data.message);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, []);

  const handleEditProfile = () => setEditing(!editing);

  const handleSaveProfile = async () => {
    const updatedUser = { ...user };
    try {
      const response = await editProfile(updatedUser);
      if (response.status === 200) {
        toast.success(response.data.message);
        setEditing(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    try {
      const response = await changePassword(passwords);
      if (response.status === 200) {
        toast.success(response.data.message);
        setShowChangePassword(false);
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Error changing password');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Profile Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">
                {user?.username.split('')[0].toUpperCase()}
              </span>
            </div>
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">{user?.username}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 text-white px-4 py-2"
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Editing Profile */}
        {editing ? (
          <div className="mt-4">
            <div>
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="text"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <h3 className="text-xl font-semibold">General Information</h3>
              <p>Full Name: {user?.firstName} {user?.lastName}</p>
              <p>Email: {user?.email}</p>
              <p>Phone: {user?.mobile}</p>
            </div>

            {/* Security Section */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Security</h3>
              { !showChangePassword && <button
                onClick={() => setShowChangePassword(!showChangePassword)}
                className="bg-yellow-500 text-white px-4 py-2 mt-2"
              >
                Change Password
              </button>}
              {showChangePassword && (
                <div className="mt-4">
                  <div>
                    <label className="block text-gray-700">Old Password:</label>
                    <input
                      type="password"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-700">New Password:</label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-gray-700">Confirm New Password:</label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4 ">
                    <button
                      onClick={handlePasswordChange}
                      className="bg-yellow-600 text-white px-4 py-2 mt-4"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => setShowChangePassword(false)}
                      className="bg-gray-500 text-white px-4 py-2 mt-4 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
