import { createContext, useContext, useState } from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "task-track-auth";

const readStoredSession = () => {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return { token: null, user: null };
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStoredSession().token);
  const [user, setUser] = useState(() => readStoredSession().user);

  const saveSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);

    if (nextToken && nextUser) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: nextToken,
          user: nextUser
        })
      );
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
  };

  const signup = async (formData) => {
    const response = await api.post("/auth/register", formData);
    return response.data;
  };

  const login = async (formData) => {
    const response = await api.post("/auth/login", formData);
    saveSession(response.data.token, response.data.user);
    return response.data;
  };

  const logout = () => {
    saveSession(null, null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        signup,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
