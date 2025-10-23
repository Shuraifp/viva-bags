import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";

export const getOffers = async (
  currentPage,
  limitPerPage,
  filter,
  sort,
  search
) => {
  return await api.get("/admin/offers", {
    params: {
      currentPage,
      limitPerPage,
      filter,
      sort,
      search,
    },
  });
};

export const addOffer = async (data) => {
  return await api.post("/admin/offers", data);
};

export const updateOffer = async (id, data) => {
  return await api.put(`/admin/offers/${id}`, data);
};

export const deleteOrRestoreOffer = async (id) => {
  return await api.patch(`/admin/offers/${id}`);
};

export const getCategoriesAndProducts = async () => {
  return await api.get("/admin/offers/categories-and-products");
};

export const applyNewOffer = async (payload) => {
  return await api.post("/admin/offers/apply", payload);
};

export const removeOffer = async (payload) => {
  return await api.post(`/admin/offers/remove`, payload);
};

//                       User
export const offerForBanner = async () => {
  return await apiNonSecure.get("/user/offers");
};
