// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:"http://localhost:5001", // default fallback
  withCredentials: true, // optional: if you use cookies/sessions
});

// Optionally set default headers
axiosInstance.defaults.headers.common["Content-Type"] = "application/json";

export default axiosInstance;
