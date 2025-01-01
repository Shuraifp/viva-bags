import { userApiWithAuth as api } from "./axios";


export const fetchWallet = async () => {
  try {
    const response = await api.get("/user/wallet");
    return response;
  } catch (error) {
    throw error;
  }
};

export const checkBalance = async (amount) => {
  try {
    const response = await api.post("/user/wallet/check", { amount });
    return response;
  } catch (error) {
    throw error;
  }
};