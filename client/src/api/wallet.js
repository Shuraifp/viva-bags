import { userApiWithAuth as api } from "./axios";


export const fetchWallet = async () => {
  try {
    const response = await api.get("/user/wallet");
    return response;
  } catch (error) {
    throw error;
  }
};