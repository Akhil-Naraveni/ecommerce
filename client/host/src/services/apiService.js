// API Service with axios interceptors
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear and redirect to login
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Product API calls
export const productAPI = {
    getAll: () => apiClient.get('/products'),
    getOne: (id) => apiClient.get(`/products/${id}`)
};

// Cart API calls
export const cartAPI = {
    getItems: () => apiClient.get('/cart/cartitems'),
    addItem: (productId, quantity) => apiClient.post('/cart/cartitems', { productId, quantity }),
    updateItem: (itemId, quantity) => apiClient.put(`/cart/cartitems/${itemId}`, { quantity }),
    deleteItem: (itemId) => apiClient.delete(`/cart/cartitems/${itemId}`),
    clearCart: () => apiClient.delete('/cart/cartitems')
};

// Auth API calls
export const authAPI = {
    register: (name, email, password, confirmPassword) => 
        apiClient.post('/auth/register', { name, email, password, confirmPassword }),
    login: (email, password) => 
        apiClient.post('/auth/login', { email, password }),
    logout: () => {
        localStorage.removeItem('authToken');
        return Promise.resolve();
    }
};

export default apiClient;
