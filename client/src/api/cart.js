import { userApiWithAuth as api } from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export const addToCart = async (productId, quantity, selectedSize) => {
  try{
      const response = await api.post(`${API_URL}/user/cart/add`, {
      productId,
      quantity,
      selectedSize
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchCart = async () => {
  try {
    const response = await api.get(`${API_URL}/user/cart`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (productId, quantity, selectedSize) => {
  try {
    const response = await api.put(`${API_URL}/user/cart/update`, {
      productId,
      quantity,
      selectedSize
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const removeFromCart = async (productId) => {
  try {
    const response = await api.delete(`${API_URL}/user/cart/remove/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
};


export const getCountOfCartItems = async () => {
  try {
    const response = await api.get(`${API_URL}/user/cart/count`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};


export const clearCart = async () => {
  try {
    console.log("Clearing cart...");
    const response = await api.delete(`/user/cart/clear`);
    return response;
  } catch (error) {
    return error.response.data;
  }
};
