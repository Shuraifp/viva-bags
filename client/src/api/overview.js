import { adminApiWithAuth as api } from "./axios";

export const countUsers = async () => {
  return await api.get("/admin/users/count");
};

export const countOrders = async () => {
  return await api.get(`/admin/orders/count`);
};

export const countProducts = async () => {
  return await api.get(`/admin/products/count`);
};

export const countCategories = async () => {
  return await api.get(`/admin/categories/count`);
};

export const countBrands = async () => {
  return await api.get(`/admin/brands/count`);
};

export const countSoldProducts = async () => {
  return await api.get(`/admin/orders/sold-products`);
};

export const fetchChartData = async (timeframe, startDate, endDate) => {
  return await api.get(
    `/admin/chart-data?timeframe=${timeframe}&startDate=${startDate}&endDate=${endDate}`
  );
};

export const fetchTopSellingProductsandCategories = async () => {
  return await api.get("/admin/topSellings");
};
