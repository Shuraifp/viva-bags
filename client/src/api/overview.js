import { adminApiWithAuth as api } from "./axios";

export const countUsers = async () => {
  try {
    const response = await api.get('/admin/users/count');
    return response;
  } catch (error) {
    throw error;
  };
}

export const countOrders = async () => {
  try{
    const response = await api.get(`/admin/orders/count`)
    return response
  } catch (err){
    throw err
  }
}

export const countProducts = async () => {
  try{
    const response = await api.get(`/admin/products/count`)
    return response
  } catch (err){
    throw err
  }
}

export const countCategories = async () => {
  try{
    const response = await api.get(`/admin/categories/count`)
    return response
  } catch (err){
    throw err
  }
}

export const countBrands = async () => {
  try{
    const response = await api.get(`/admin/brands/count`)
    return response
  } catch (err){
    throw err
  }
}

export const countSoldProducts = async () => {
  try{
    const response = await api.get(`/admin/orders/sold-products`)
    return response
  } catch (err){
    throw err
  }
}

export const fetchChartData = async (timeframe, startDate, endDate) => {
  try {
    const response = await api.get(`/admin/chart-data?timeframe=${timeframe}&startDate=${startDate}&endDate=${endDate}`);
    return response;
  } catch (error) {
    throw error;
  }
}


export const fetchTopSellingProductsandCategories = async () => {
  try {
    const response = await api.get('/admin/topSellings');
    return response;
  } catch (error) {
    throw error;
  }
}