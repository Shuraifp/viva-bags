import { userApiWithAuth as api } from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export const addAddress = async (newAddress) => {
  try{
    const response = await api.post(`${API_URL}/user/address/add`, {
    newAddress
  });
  return response;
  } catch (error) {
    return error.response.data;
  }
}


export const editAddress = async (id,updatedAddress) => {
  try{
    const response = await api.put(`${API_URL}/user/address/edit/${id}`, {
    updatedAddress
  });
  return response;
  } catch (error) {
    return error.response.message;
  }
}


export const getAddresses = async () => {
  try{
    const response = await api.get(`${API_URL}/user/address`);
  return response;
  } catch (error) {
    throw error;
  }
}


export const deleteAddress = async (id) => {
  try{
    const response = await api.delete(`${API_URL}/user/address/delete/${id}`);
  return response;
  } catch (error) {
    return error.response.data;
  }
}

export const changeDefaultAddress = async (id) => {
  try{
    const response = await api.patch(`${API_URL}/user/address/default/${id}`);
  return response;
  } catch (error) {
    return error.response.data;
  }
}