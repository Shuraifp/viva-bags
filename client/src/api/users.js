import { adminApiWithAuth as api } from "./axios";
import { userApiWithAuth as userApi } from "./axios";

export const fetchUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const editUserStatus = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/changeStatus/${userId}`, {});
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

//                User

export const fetchUserProfileData = async () => {
  return await userApi.get(`/user/profile`);
};

export const editProfile = async (data) => {
  try {
    const response = await userApi.patch(`/user/profile`, data);
    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const changePassword = async (data) => {
  try {
    const response = await userApi.patch(`/user/change-password`, data);
    return response;
  } catch (error) {
    console.log(error);
    return error.response;
  }
};

export const sendResetPasswordEmail = async (data) => {
  return await userApi.post(`/user/auth/send-resetEmail`, data);
};

export const resetPassword = async (data) => {
  return await userApi.post(`/user/auth/reset-password`, data);
};
