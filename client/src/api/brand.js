import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";

export const getBrandsWithFilter = async (includeDeleted) => {
  const response = await api.get(`/admin/brands?includeDeleted=${includeDeleted}`);
  return response.data;
};

export const getBrands = async () => {
  const response = await apiNonSecure.get(`/user/brands?includeDeleted=${false}`);
  return response.data;
};

export const addBrand = async (name) => {
  const response = await api.post('/admin/brands/add', { name });
  return response.data;
};

export const editBrandname = async (id, name) => {
  const response = await api.put(`/admin/brands/update/${id}`, { name });
  return response.data;
};

export const toggleBrandStatus = async (id, isDeleted) => {
  const response = await api.patch(`/admin/brands/${id}`, { isDeleted });
  return response.data;
};