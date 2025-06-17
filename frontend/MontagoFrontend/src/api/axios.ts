import axios from "axios";

// Set base URL for all API calls
const authAxios = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ adjust if needed
});

// Automatically attach JWT token to Authorization header
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export default authAxios;
