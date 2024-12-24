import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;


export const adminApiWithAuth = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },  
});

export const apiWithoutAuth = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },  
});

adminApiWithAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('adminAccessToken');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApiWithAuth.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    console.log(error);
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_URL}/admin/auth/refresh-token`,
          {},
          {
          headers: {
            authorization: `Bearer ${localStorage.getItem('adminRefreshToken')}`,
          },
        });
        
        const { newAccessToken } = refreshResponse.data;
        localStorage.setItem('adminAccessToken', newAccessToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return adminApiWithAuth(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

//                 user

export const userApiWithAuth = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },  
});

userApiWithAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('userAccessToken');
    if (accessToken) {
      config.headers['authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userApiWithAuth.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;
    console.log(error)
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log('refreshing token');
      try {
        const refreshResponse = await axios.post(
          `${API_URL}/admin/auth/refresh-token`,
          {},{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userRefreshToken')}`,
          },
        });
        
        const { newAccessToken } = refreshResponse.data;
        localStorage.setItem('userAccessToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return userApiWithAuth(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);