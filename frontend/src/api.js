import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("solvehubUser");

  if (authData) {
    const parsedData = JSON.parse(authData);
    if (parsedData.token) {
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }
  }

  return config;
});

export default api;
