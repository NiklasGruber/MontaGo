import axios from "axios";

// Set base URL for all API calls
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Automatically attach JWT token to Authorization header
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

export default authAxios;
