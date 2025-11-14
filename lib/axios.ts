import axios from "axios";

const api = axios.create({
  baseURL:"https://ciger-backend-2.onrender.com",
  withCredentials: true, // optional
});

export default api;
