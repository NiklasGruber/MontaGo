import axios from "axios";

// Set base URL for all API calls
const authAxios = axios.create({
  baseURL: "https://montago.onrender.com/api", // gleiche Domain wie der WebService
  withCredentials: true
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
