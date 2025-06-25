import axios from "axios";

// Set base URL for all API calls
const authAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // gleiche Domain wie der WebService
  withCredentials: true
});

console.log("Axios instance created with base URL:", import.meta.env.VITE_API_URL);

// Automatically attach JWT token to Authorization header
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    if (config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Axios Token instance created with base URL:", import.meta.env.VITE_API_URL);
    }
  }
  return config;
});

export default authAxios;
