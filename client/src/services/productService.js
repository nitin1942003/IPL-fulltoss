import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Replace with your backend URL

// Create a product and assign it to a team
export const createProductAndAssignToTeam = async (teamId, productData) => {
  try {
    const response = await axios.post(`${BASE_URL}/products/create-and-assign`, {
      teamId,
      ...productData,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get all products for a specific team
export const getAllProductsForTeam = async (teamId) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${teamId}`);
    return response.data.products;
  } catch (error) {
    handleError(error);
  }
};

// Get details of a single product by its ID
export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`${BASE_URL}/products/${productId}`);
    return response.data.product;
  } catch (error) {
    handleError(error);
  }
};

// Get favorite products for a user
export const getFavoriteProducts = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/favorites`);
    return response.data.favoriteProducts;
  } catch (error) {
    handleError(error);
  }
};

// Get cart products for a user
export const getCartProducts = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}/cart`);
    return response.data.cartProducts;
  } catch (error) {
    handleError(error);
  }
};

// Add a product to the user's cart
export const addProductToCart = async (userId, productId, quantity = 1) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/cart`, {
      userId,
      productId,
      quantity,
    });
    return response.data.cart;
  } catch (error) {
    handleError(error);
  }
};

// Add a product to the user's favorites
export const addProductToFavorites = async (userId, productId) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/favorites`, {
      userId,
      productId,
    });
    return response.data.favoriteProducts;
  } catch (error) {
    handleError(error);
  }
};

// Error handling helper function
const handleError = (error) => {
  if (error.response) {
    console.error('Error Response:', error.response.data);
    alert(error.response.data.message || 'An error occurred.');
  } else if (error.request) {
    console.error('No Response:', error.request);
    alert('No response from the server. Please try again.');
  } else {
    console.error('Error:', error.message);
    alert('Something went wrong. Please try again.');
  }
};
