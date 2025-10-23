import { userApiWithAuth as api } from "./axios";
import { adminApiWithAuth as adminApi } from "./axios";

export const createOrder = async (data) => {
  try {
    console.log(data);
    const response = await api.post(`/user/order/add`, data);
    return response;
  } catch (err) {
    console.log(err);
    return err.message;
  }
};

export const getAllOrdersForUser = async (
  currentPage,
  limitPerPage,
  activeTab
) => {
  return await api.get(`/user/orders`, {
    params: { currentPage, limitPerPage, activeTab },
  });
};

export const getSingleOrder = async (id) => {
  return await api.get(`/user/orders/${id}`);
};

export const downloadInvoice = async (id) => {
  return await api.get(`/user/orders/invoice/${id}`, {
    responseType: "arraybuffer",
  });
};

//      Cancel

export const cancelOrder = async (id, reason) => {
  return await api.patch(`/user/orders/cancel/${id}`, { reason });
};

export const cancelItem = async (orderId, itemId, reason) => {
  return await api.patch(`/user/orders/cancel-item`, {
    orderId,
    itemId,
    reason,
  });
};

//              Return

export const returnOrder = async (orderId, reason) => {
  return await api.patch(`/user/orders/return-order`, { orderId, reason });
};

export const requestReturnItem = async (orderId, itemId, reason) => {
  return await api.patch(`/user/orders/return-item`, {
    orderId,
    itemId,
    reason,
  });
};

export const updatePaymentStatus = async (id, paymentStatus) => {
  return await api.patch("/user/orders/update-payment", { id, paymentStatus });
};

//                 Admin

export const updateOrderStatus = async (id, status) => {
  return await adminApi.patch(`/admin/orders/${id}`, { status });
};

export const getAllOrders = async (
  currentPage,
  limitPerPage,
  filter,
  search
) => {
  try {
    const response = await adminApi.get(`/admin/orders`, {
      params: { currentPage, limitPerPage, filter, search },
    });
    return response;
  } catch (err) {
    return err.message;
  }
};

export const updateProductStatus = async (id, orderId, status) => {
  return await adminApi.patch(`/admin/orders/product/${id}`, {
    status,
    orderId,
  });
};

export const getReturnRequestedOrders = async () => {
  return await adminApi.get(`/admin/orders/return-requested`);
};

export const updateReturnStatus = async (orderId, itemId, returnStatus) => {
  return await adminApi.patch(`/admin/orders/return/${orderId}`, {
    itemId,
    returnStatus,
  });
};
