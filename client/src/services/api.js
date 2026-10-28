import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // Send and receive HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to format errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred. Please try again.',
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };
    return Promise.reject(customError);
  }
);

export default api;
