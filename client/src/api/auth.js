import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const api = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },  
});


//        Admin


export const loginAdmin = async (email, password) => {
  try {
    const response = await api.post('/admin/auth/login', { email, password });
    return response; 
  } catch (error) {
    throw new Error(error.response?.data?.message || 'server not responded...');
  }
};



//        User


export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/user/auth/login', { email, password });
    return response; 
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn("User not found");
      return error.response; 
    }
    if(error.response?.status === 401) {
      console.warn("incorrect credentials");
      return error.response;
    }
    throw new Error(error.response?.data?.message || 'not needed...');
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/user/auth/register', userData);
    return response; 
  } catch (error) {
    console.log(error.response?.data?.message);
  }
};

