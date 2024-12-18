import { adminApiWithAuth as api } from "./axios";
import { apiWithoutAuth as apiNonSecure } from "./axios";


export const fetchProductsForUsers = async () => {
  try {
    const response = await apiNonSecure.get("/user/products");
    return response.data;
  } catch (error) {
    return error.response.data;
  };
};

export const fetchProductByIdForUsers = async (id) => {
  try {
    const response = await apiNonSecure.get(`/user/products/${id}`);
    return response;
  } catch (error) {
    return error.response;
  };
};

export const fetchProducts = async () => {
  try {
    const response = await api.get("/admin/products");
    return response.data;
  } catch (error) {
    return error.response.data;
  };
};

export const fetchProductById = async (id) => {
  try {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    return error.response.data;
  };
};

export const updateProduct = async (id, data) => {
  try {
    const response = await api.put(`/admin/products/update/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response)
    return response;
  } catch (error) {
    console.log(error)
    throw error
  };
}


export const addProduct = async (data) => {
  try {
    const response = await api.post("/admin/products", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    return error.response;
  };
}

export const toggleProductStatus = async (id) => {
  try {
    const response = await api.patch(`/admin/products/toggleStatus/${id}`);
    return response.data;
  } catch (error) {
    return error.response;
  };
};

export const getproductsFromSameCat = async (category) => {
  try{
    const response = await apiNonSecure.get(`/user/${category}/products`)
    return response.data
  } catch (error) {
    return error.response.data
  }
}


export const getSortedProducts = async (currentPage,limitPerPage,option) => {
  try{
    const response = await apiNonSecure.get(`/user/products`,{params:{currentPage,limitPerPage,option}})
    return response
  } catch (error) {
    console.log(error)
    return error.message  
  }
}