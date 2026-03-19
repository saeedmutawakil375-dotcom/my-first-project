import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("currentChronicleUser");

  if (authData) {
    const parsedData = JSON.parse(authData);
    if (parsedData.token) {
      config.headers.Authorization = `Bearer ${parsedData.token}`;
    }
  }

  return config;
});

export default api;
