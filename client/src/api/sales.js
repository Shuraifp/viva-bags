import { adminApiWithAuth as api } from "./axios";

const API_URL = import.meta.env.VITE_API_URL;

export const generateSalesReport = async (filter, customDateRange) => {
  return await api.post(`${API_URL}/admin/sales/report`, {
    filter,
    customDateRange,
  });
};

export const downloadSalesReport = async (format, filter, customDateRange) => {
  return await api.post(
    `${API_URL}/admin/sales/download/${format}`,
    { filter, customDateRange },
    { responseType: "blob" }
  );
};
