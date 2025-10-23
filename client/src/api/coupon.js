import { adminApiWithAuth as api } from "./axios";
import { userApiWithAuth as userApi } from "./axios";

export const getCoupons = async (
  currentPage,
  limitPerPage,
  filter,
  sort,
  search
) => {
  return await api.get("/admin/coupons", {
    params: {
      currentPage,
      limitPerPage,
      filter,
      sort,
      search,
    },
  });
};

export const addCoupon = async (data) => {
  return await api.post("/admin/coupons", data);
};

export const updateCoupon = async (id, data) => {
  return await api.put(`/admin/coupons/${id}`, data);
};

export const deleteOrRestoreCoupon = async (id) => {
  return await api.patch(`/admin/coupons/${id}`);
};

//                           User

export const getCouponsForUser = async (purchaseAmount) => {
  return await userApi.get("/user/coupons", {
    params: {
      purchaseAmount,
    },
  });
};

export const applyCoupon = async (couponCode, orderValue) => {
  return await userApi.post("/user/coupons/apply", { couponCode, orderValue });
};

export const removeCoupon = async (couponId) => {
  return await userApi.delete("/user/coupons/remove/" + couponId);
};
