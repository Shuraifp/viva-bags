import { apiWithoutAuth as apiNonSecure } from "./axios";

export const contactUs = async (data) => {
  return await apiNonSecure.post(`/user/contact-us`, data);
};