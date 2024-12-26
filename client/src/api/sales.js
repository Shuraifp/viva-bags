import { adminApiWithAuth as api } from "./axios";

const API_URL = import.meta.env.VITE_API_URL;



export const generateSalesReport = async (filter, customDateRange) => {
  try {
    const response = await api.post(`${API_URL}/admin/sales/report`, {filter, customDateRange});
    return response;
  } catch (err) {
    throw err;
  }
};

export const downloadSalesReport = async (format, filter, customDateRange) => {
  try {
    const response = await api.post(`${API_URL}/admin/sales/download/${format}`, { filter, customDateRange }, { responseType: 'blob' });
    return response;
  } catch (err) {
    throw err;
  }
};