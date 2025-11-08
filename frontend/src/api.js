import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getProducts = () => api.get('/products');
export const getCart = () => api.get('/cart');
export const addToCart = (productId, quantity = 1) => api.post('/cart', { productId, quantity });
export const updateCartItem = (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity });
export const removeCartItem = (cartItemId) => api.delete(`/cart/${cartItemId}`);
export const checkout = (data) => api.post('/checkout', data);
export const getUser = () => api.get('/user')

export default api;
