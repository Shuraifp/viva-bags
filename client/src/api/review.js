import { userApiWithAuth as api } from "./axios";


export const addReview = async (productId, rating, comment) => {
  try {
    const response = await api.post("/user/reviews/add", { productId, rating, comment });
    return response;
  } catch (error) {
    throw error;
  };
};


export const getReviews = async (productId) => {
  try {
    const response = await api.get(`/user/reviews/${productId}`);
    return response;
  } catch (error) {
    throw error;
  };
};