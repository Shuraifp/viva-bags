import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";

export const fetchProductsForUsers = async () => {
  try {
    const response = await apiNonSecure.get("/user/products");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchProductByIdForUsers = async (id) => {
  try {
    const response = await apiNonSecure.get(`/user/products/${id}`);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchProducts = async () => {
  try {
    const response = await api.get("/admin/products");
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateProduct = async (id, data) => {
  return await api.put(`/admin/products/update/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addProduct = async (data) => {
  return await api.post("/admin/products", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const toggleProductStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/products/toggleStatus/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const getproductsFromSameCat = async (category) => {
  return await apiNonSecure.get(`/user/categories/${category}/products`);
};

export const getSortedProducts = async (
  currentPage,
  limitPerPage,
  option,
  searchQuery,
  category,
  filterOptions
) => {
  return await apiNonSecure.get(`/user/products/sorted`, {
    params: {
      currentPage,
      limitPerPage,
      option,
      searchQuery,
      category,
      filterOptions,
    },
  });
};

export const getFiltercount = async () => {
  return await apiNonSecure.get(`/user/products/count`);
};
