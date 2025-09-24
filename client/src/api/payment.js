import { userApiWithAuth as api } from './axios';

const API_URL = import.meta.env.VITE_API_URL;


export const createRazorpayOrder = async (amount) => {
  try {
    const response = await api.post(`${API_URL}/user/razorpay/order`, {
      amount
    });
    return response;
  } catch (err) {
    throw err;
  }
};


// export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
//   try {
//     const response = await api.post(`${API_URL}/user/razorpay/verify`, {
//       razorpayOrderId,
//       razorpayPaymentId,
//       razorpaySignature,
//     });
//     return response.data; 
//   } catch (err) {
//     throw err;
//   }
// };


// export const refundPayment = async (paymentId, amount) => {
//   try {
//     const response = await adminApi.post(`${API_URL}/admin/razorpay/refund`, {
//       paymentId, 
//       amount,   
//     });
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };


// export const getPaymentDetails = async (paymentId) => {
//   try {
//     const response = await adminApi.get(`${API_URL}/admin/razorpay/payment/${paymentId}`);
//     return response;
//   } catch (err) {
//     throw err;
//   }
// };
