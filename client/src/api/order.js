import { userApiWithAuth as api } from './axios';
import { adminApiWithAuth as adminApi } from './axios';

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
    throw err
  }
}


export const getSingleOrder = async (id) => {
  try{
    const response = await api.get(`${API_URL}/user/orders/${id}`)
    return response
  } catch (err){
    throw err
  }
}


//      Cancel

export const cancelOrder = async (id) => {
  try{
    const response = await api.patch(`${API_URL}/user/orders/cancel/${id}`)
    return response
  } catch (err){
    throw err
  }
}

export const cancelItem = async (orderId, productId) => {
  try{
    const response = await api.patch(`${API_URL}/user/orders/cancel-item`,{orderId,productId})
    return response
  } catch (err){
    throw err
  }
}



//              Return

export const returnOrder = async (orderId, reason) => {
  try{
    const response = await api.patch(`${API_URL}/user/orders/return-order`,{orderId,reason})
    return response
  } catch (err){
    throw err
  }
}


export const requestReturnItem = async (orderId, productId, reason) => {
  try{
    const response = await api.patch(`${API_URL}/user/orders/return-item`,{orderId,productId,reason})
    return response
  } catch (err){
    throw err
  }
}




//                 Admin

export const updateOrderStatus = async (id, status) => {
  try{
    const response = await adminApi.patch(`${API_URL}/admin/orders/${id}`,{status})
    return response
  } catch (err){
    console.log(err)
    return err
  }
}


export const getAllOrders = async (currentPage,limitPerPage,filter,search) => {
  try{
    const response = await adminApi.get(`${API_URL}/admin/orders`,{params:{currentPage,limitPerPage,filter,search}})
    return response
  } catch (err){
    return err.message
  }
}

export const updateProductStatus = async (id, orderId, status) => {
  try{
    const response = await adminApi.patch(`${API_URL}/admin/orders/product/${id}`,{status,orderId})
    return response
  } catch (err){
    throw err
  }
}

export const countOrders = async () => {
  try{
    const response = await adminApi.get(`${API_URL}/admin/orders/count`)
    return response.data
  } catch (err){
    console.log(err)
    return err.message
  }
}


export const getReturnRequestedOrders = async () => {
  try{
    const response = await adminApi.get(`${API_URL}/admin/orders/return-requested`)
    return response
  } catch (err){
    throw err
  }
}


export const updateReturnStatus = async (orderId, productId, returnStatus) => {
  try{
    const response = await adminApi.patch(`${API_URL}/admin/orders/return/${orderId}`,{productId,returnStatus})
    return response
  } catch (err){
    throw err
  }
}