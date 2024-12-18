import React, { useState, useEffect } from "react";
import { fetchUsers, editUserStatus } from "../../api/users"; 
import toast from "react-hot-toast";
import ConfirmationModal from "../../components/admin/ConfirmationModal";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToBlock, setUserToBlock] = useState(null);
  const [userToUnBlock, setUserToUnBlock] = useState(null);

  
  useEffect(() => {
    const getUsers = async () => {
      try {
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        toast.error(err)
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [updated]);

  const toggleBlock = async (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === id ? { ...user, blocked: !user.blocked } : user
      )
    );
    try {
      const res = await editUserStatus(id);
      setUpdated(!updated)
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, blocked: !user.blocked } : user
        )
      );
    }
  };
  

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="bg-gray-100 p-4">
      <ConfirmationModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onConfirm={() => {
        if (userToBlock) toggleBlock(userToBlock);
        if (userToUnBlock) toggleBlock(userToUnBlock);
        setIsModalOpen(false);
        setUserToBlock(null);
        setUserToUnBlock(null);
      }}
       message={`Are you sure  you want to ${userToBlock ? "Block" : "Unblock"} this user ?`}
       buttonText={userToBlock ? "Block" : "Unblock"}
       />
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead className="text-white">
            <tr>
              <th className="px-4 py-2 text-left bg-gray-700">SL</th>
              <th className="px-4 py-2 text-left bg-gray-600">Username</th>
              <th className="px-4 py-2 text-left bg-gray-700">Email</th>
              <th className="px-4 py-2 text-left bg-gray-600">Status</th>
              <th className="px-4 py-2 text-left bg-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, index) => (
              <tr
                key={user._id}
                className={`border-b ${user.isBlocked ? "bg-red-50" : "bg-white"}`}
              >
                <td className="px-4 w-20 py-3">{index + 1}</td>
                <td className="px-4 min-w-28 py-2">{user.username}</td>
                <td className="px-4 min-w-40 py-2">{user.email}</td>
                <td className="px-4 min-w-28 py-2">
                  <span
                    className={`px-2 py-2 rounded text-md ${
                      user.isBlocked
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>
                <td className="px-4 py-1">
                    <button
                      className={`${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white px-3 py-1 rounded text-md`}
                      onClick={() => {
                        if (user.isBlocked) {
                          setUserToUnBlock(user._id);
                          setIsModalOpen(true);
                        } else {
                          setUserToBlock(user._id);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
