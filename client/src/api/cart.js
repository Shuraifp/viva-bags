import { userApiWithAuth as api } from "./axios";

const API_URL = import.meta.env.VITE_API_URL;

export const addToCart = async (productId, quantity, selectedSize) => {
  return await api.post(`${API_URL}/user/cart/add`, {
    productId,
    quantity,
    selectedSize,
  });
};

export const fetchCart = async () => {
  return await api.get(`${API_URL}/user/cart`);
};

export const updateCart = async (productId, quantity, selectedSize) => {
  return await api.put(`${API_URL}/user/cart/update`, {
    productId,
    quantity,
    selectedSize,
  });
};

export const removeFromCart = async (productId) => {
  return await api.delete(`${API_URL}/user/cart/remove/${productId}`);
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
