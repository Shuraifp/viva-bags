import { adminApiWithAuth as api } from "./axios";
import { userApiWithAuth as userApi } from "./axios";


export const fetchUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    return error.response;
};
}

export const editUserStatus = async (userId) => {
  try {
    const response = await api.patch(`/admin/users/changeStatus/${userId}`,{});
    return response.data;
  } catch (error) {
    console.log(error)
    return error.response.data;
  };
}

export const countUsers = async () => {
  try {
    const response = await api.get('/admin/users/count');
    return response.data;
  } catch (error) {
    console.log(error)
    return error.response.data;
  };
}

export const fetchUserProfileData = async () => {
  try {
    const response = await userApi.get(`/user/profile`);
    return response;
  } catch (error) {
    throw error;
  };
}

export const editProfile = async (data) => {
  try {
    const response = await userApi.patch(`/user/profile`, data);
    return response;
  } catch (error) {
    console.log(error)
    return error.response;
  };
}

export const changePassword = async (data) => {
  try {
    const response = await userApi.patch(`/user/change-password`, data);
    return response;
  } catch (error) {
    console.log(error)
    return error.response;
  };
}