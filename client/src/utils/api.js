import axios from 'axios';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`, // Update with your actual backend URL
  withCredentials: true, // Enable cookies for cross-origin requests
});

// Helper function to handle errors and provide consistent logging
const handleRequestError = (error, message) => {
  console.error(`${message}:`, error);
  throw error;
};

// Example function to check session status
export const checkSession = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/test-session`, {
      withCredentials: true,
    });
    console.log("Session response:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Session failed");
  }
};

// Login function using session-based authentication
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/user/login', loginData, {
      withCredentials: true, // This ensures cookies are sent and received
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};


// Logout function to end session
export const logoutUser = async () => {
  try {
    // Use the 'api' instance which is configured with baseURL "${import.meta.env.VITE_SERVER_URL}/api"
    // Adjust the endpoint path if needed (e.g., if logout route is at /auth/logout)
    const response = await api.get('/auth/logout');
    console.log("Logout successful:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Logout failed");
  }
};

// Register a new user
export const registerUser = async (registerData) => {
  try {
    const response = await api.post('/user/register', registerData);
    console.log("Registration response:", response.data);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Registration failed");
  }
};

// Get all properties
export const getAllProperties = async () => {
  try {
    const response = await api.get('/residency/allresd');
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch properties");
  }
};

// Get a specific property
export const getProperty = async (id) => {
  try {
    const response = await api.get(`/residency/${id}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch property details");
  }
};

// Make an offer on a property
export const makeOffer = async (offerData) => {
  try {
    const response = await api.post('/buyer/makeOffer', offerData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to make offer");
  }
};

// Update property
export const updateProperty = async (id, updatedData) => {
  try {
    const response = await api.put(`/residency/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to update property");
  }
};

// Get offers for a specific property
export const getPropertyOffers = async (propertyId) => {
  try {
    const response = await api.get(`/buyer/offers/property/${propertyId}`);
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to fetch property offers");
  }
};

// In your api.js file
export const createResidencyWithFiles = async (formData) => {
  try {
    const response = await api.post('/residency/createWithFile', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleRequestError(error, "Failed to create property with files");
  }
};

