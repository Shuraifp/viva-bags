import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";


export const getOffers = async (currentPage, limitPerPage, filter, sort ,search) => {
  try {
    const response = await api.get("/admin/offers", {
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

export const addOffer = async (data) => {
  try {
    const response = await api.post("/admin/offers", data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const updateOffer = async (id, data) => {
  try {
    const response = await api.put(`/admin/offers/${id}`, data);
    return response;
  } catch (error) {
    throw error;
  }
}

export const deleteOrRestoreOffer = async (id) => {
  try {
    const response = await api.patch(`/admin/offers/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
}


export const getCategoriesAndProducts = async () => {
  try {
    const response = await api.get("/admin/offers/categories-and-products");
    return response;
  } catch (error) {
    throw error;
  }
}


export const applyNewOffer = async (payload) => {
  try {
    const response = await api.post("/admin/offers/apply", payload);
    return response;
  } catch (error) {
    throw error;
  }
}

export const removeOffer = async (payload) => {
  try {
    const response = await api.post(`/admin/offers/remove`, payload);
    return response;
  } catch (error) {
    throw error;
  }
}



//                       User 
export const offerForBanner = async () => {
  try {
    const response = await apiNonSecure.get("/user/offers");
    return response;
  } catch (error) {
    throw error;
  }
}