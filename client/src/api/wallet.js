import { userApiWithAuth as api } from "./axios";

export const fetchWallet = async () => {
  return await api.get("/user/wallet");
};

export const checkBalance = async (amount) => {
  return await api.post("/user/wallet/check", { amount });
};

export const addMoneyToWallet = async (data) => {
  return await api.post("/user/wallet/add", data);
};
