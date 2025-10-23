import { userApiWithAuth as api } from "./axios";

export const getWishlist = async () => {
  return await api.get("/user/wishlist");
};

export const addToWishlist = async (productId, size) => {
  return await api.post("/user/wishlist/add", {
    productId,
    size,
  });
};

export const removeFromWishlist = async (productId) => {
  return await api.delete(`/user/wishlist/remove/${productId}`);
};
