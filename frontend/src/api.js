import axios from "axios";

const resolveApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    const { hostname, port } = window.location;
    const isLocalPreview =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

    if (isLocalPreview && port !== "5000") {
      return "http://localhost:5000/api";
    }
  }

  return "/api";
};

const api = axios.create({
  baseURL: resolveApiBaseUrl()
});

api.interceptors.request.use((config) => {
  const authData = localStorage.getItem("atlasWireUser");

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      if (parsedData.token) {
        config.headers.Authorization = `Bearer ${parsedData.token}`;
      }
    } catch (_error) {
      localStorage.removeItem("atlasWireUser");
    }
  }

  return config;
});

export default api;
