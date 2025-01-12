import { th } from 'date-fns/locale';
import { userApiWithAuth as api } from './axios';
import { adminApiWithAuth as adminApi } from './axios';


export const createOrder = async (data) => {
  try{
    console.log(data)
    const response = await api.post(`/user/order/add`, data)
    return response
  } catch (err){
    console.log(err)
    return err.message
  }
}

export const getAllOrdersForUser = async (currentPage,limitPerPage,activeTab) => {
  try{
    const response = await api.get(`/user/orders`,{params:{currentPage,limitPerPage,activeTab}})
    return response
  } catch (err){
    throw err
  }
}


export const getSingleOrder = async (id) => {
  try{
    const response = await api.get(`/user/orders/${id}`)
    return response
  } catch (err){
    throw err
  }
}


export const downloadInvoice = async (id) => {
  try{
    const response = await api.get(`/user/orders/invoice/${id}`, { responseType: 'arraybuffer' });
    return response;
  } catch (err){
    throw err
  }
}

//      Cancel

export const cancelOrder = async (id, reason) => {
  try{
    const response = await api.patch(`/user/orders/cancel/${id}`,{reason})
    return response
  } catch (err){
    throw err
  }
}

export const cancelItem = async (orderId, itemId,reason) => {
  try{
    const response = await api.patch(`/user/orders/cancel-item`,{orderId,itemId,reason})
    return response
  } catch (err){
    throw err
  }
}



//              Return

export const returnOrder = async (orderId, reason) => {
  try{
    const response = await api.patch(`/user/orders/return-order`,{orderId,reason})
    return response
  } catch (err){
    throw err
  }
}


export const requestReturnItem = async (orderId, itemId, reason) => {
  try{
    const response = await api.patch(`/user/orders/return-item`,{orderId,itemId,reason})
    return response
  } catch (err){
    throw err
  }
}


export const updatePaymentStatus = async (id, paymentStatus) => {
  try{
    const response = await api.patch('/user/orders/update-payment',{id,paymentStatus})
    return response
  } catch (err){
    throw err
  }
}



//                 Admin

export const updateOrderStatus = async (id, status) => {
  try{
    const response = await adminApi.patch(`/admin/orders/${id}`,{status})
    return response
  } catch (err){
    throw err
  }
}


export const getAllOrders = async (currentPage,limitPerPage,filter,search) => {
  try{
    const response = await adminApi.get(`/admin/orders`,{params:{currentPage,limitPerPage,filter,search}})
    return response
  } catch (err){
    return err.message
  }
}

export const updateProductStatus = async (id, orderId, status) => {
  try{
    const response = await adminApi.patch(`/admin/orders/product/${id}`,{status,orderId})
    return response
  } catch (err){
    throw err
  }
}


export const getReturnRequestedOrders = async () => {
  try{
    const response = await adminApi.get(`/admin/orders/return-requested`)
    return response
  } catch (err){
    throw err
  }
}


export const updateReturnStatus = async (orderId, itemId, returnStatus) => {
  try{
    const response = await adminApi.patch(`/admin/orders/return/${orderId}`,{itemId,returnStatus})
    return response
  } catch (err){
    throw err
  }
}


