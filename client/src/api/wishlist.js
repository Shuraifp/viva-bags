import { userApiWithAuth as api } from "./axios";



export const getWishlist = async () => {
  try {
    const response = await api.get('/user/wishlist');
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  try {
    const response = await api.post('/user/wishlist/add', {
      productId,
    });
    return response;
  } catch (error) {
    throw error;
  }
}

export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/user/wishlist/remove/${productId}`);
    return response;
  } catch (error) {
    throw error;
  }
}