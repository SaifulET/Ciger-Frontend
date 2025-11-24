import axios from "axios";

const api = axios.create({
  baseURL:"https://ciger-backend-2.onrender.com",
  // baseURL:"http://localhost:5001",
   // optional
});

export default api;
