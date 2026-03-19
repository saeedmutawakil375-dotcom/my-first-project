import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentChronicleUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_error) {
        localStorage.removeItem("currentChronicleUser");
      }
    }
    setLoading(false);
  }, []);

  const register = async (formData) => {
    const response = await api.post("/users/register", formData);
    localStorage.setItem("currentChronicleUser", JSON.stringify(response.data));
    setUser(response.data);
    return response.data;
  };

  const login = async (formData) => {
    const response = await api.post("/users/login", formData);
    localStorage.setItem("currentChronicleUser", JSON.stringify(response.data));
    setUser(response.data);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("currentChronicleUser");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      register,
      login,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
