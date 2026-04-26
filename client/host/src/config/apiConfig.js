// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/products`,
    GET_ONE: (id) => `${API_BASE_URL}/products/${id}`,
  },
  CART: {
    GET_ITEMS: `${API_BASE_URL}/cart/cartitems`,
    ADD_ITEM: `${API_BASE_URL}/cart/cartitems`,
    UPDATE_ITEM: (itemId) => `${API_BASE_URL}/cart/cartitems/${itemId}`,
    DELETE_ITEM: (itemId) => `${API_BASE_URL}/cart/cartitems/${itemId}`,
    CLEAR_CART: `${API_BASE_URL}/cart/cartitems`,
  },
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  }
};

export default API_BASE_URL;
