import { userApiWithAuth as api } from './axios';

const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (data) => {
  try{
    console.log(data)
    const response = await api.post(`${API_URL}/user/order/add`, data)
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const getAllOrdersForUser = async (currentPage,limitPerPage) => {
  try{
    const response = await api.get(`${API_URL}/user/orders`,{params:{currentPage,limitPerPage}})
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const countOrders = async () => {
  try{
    const response = await api.get(`${API_URL}/admin/orders/count`)
    return response.data
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const getSingleOrder = async (id) => {
  try{
    const response = await api.get(`${API_URL}/user/orders/${id}`)
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const getAllOrders = async (currentPage,limitPerPage,filter) => {
  try{
    const response = await api.get(`${API_URL}/admin/orders`,{params:{currentPage,limitPerPage,filter}})
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const updateOrderStatus = async (id, status) => {
  try{
    const response = await api.patch(`${API_URL}/admin/orders/${id}`,{status})
    return response
  } catch (err){
    console.log(err)
    return err
  }
}


export const cancelOrder = async (id) => {
  try{
    const response = await api.delete(`${API_URL}/user/orders/cancel/${id}`)
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const cancelItem = async (orderId, productId) => {
  try{
    const response = await api.delete(`${API_URL}/user/orders/cancel-item`,{params:{orderId, productId}})
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}