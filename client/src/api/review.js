import { userApiWithAuth as api } from "./axios";

export const addReview = async (productId, rating, comment) => {
  return await api.post("/user/reviews/add", { productId, rating, comment });
};

export const getReviews = async (productId) => {
  return await api.get(`/user/reviews/${productId}`);
};
