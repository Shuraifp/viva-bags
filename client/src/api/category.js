import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";

export const getCategoriesWithFilter = async (includeDeleted) => {
  const response = await api.get(`/admin/categories?includeDeleted=${includeDeleted}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiNonSecure.get(`/user/categories?includeDeleted=${false}`);
  return response.data;
};

export const addCategory = async (name) => {
  const response = await api.post('/admin/categories/add', { name });
  return response.data;
};

export const editCategoryname = async (id, name) => {
  const response = await api.put(`/admin/categories/update/${id}`, { name });
  return response.data;
};

export const toggleCategoryStatus = async (id, isDeleted) => {
  const response = await api.patch(`/admin/categories/${id}`, { isDeleted });
  return response.data;
};