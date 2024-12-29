import { adminApiWithAuth as api } from "./axios";
import { userApiWithAuth as userApi } from "./axios";


export const getCoupons = async (currentPage, limitPerPage, filter, sort ,search) => {
  try {
    const response = await api.get("/admin/coupons", {
      params: {
        currentPage,
        limitPerPage,
        filter,
        sort,
        search
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const addCoupon = async (data) => {
  try {
    const response = await api.post("/admin/coupons", data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateCoupon = async (id, data) => {
  try {
    const response = await api.put(`/admin/coupons/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteOrRestoreCoupon = async (id) => {
  try {
    const response = await api.patch(`/admin/coupons/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}


//                           User

export const getCouponsForUser = async (purchaseAmount) => {
  try {
    const response = await userApi.get("/user/coupons", {
      params: {
        purchaseAmount,
      },
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const applyCoupon = async (couponCode, orderValue) => {
  try {
    const response = await userApi.post("/user/coupons/apply", { couponCode, orderValue });
    return response;
  } catch (error) {
    throw error;
  }
}

export const removeCoupon = async (couponId) => {
  try {
    const response = await userApi.delete("/user/coupons/remove/" + couponId);
    return response;
  } catch (error) {
    throw error;
  }
}