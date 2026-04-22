import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "task-track-auth";
const LEGACY_STORAGE_KEYS = ["task-time-auth", "token", "user"];

const clearLegacySessionKeys = () => {
  LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
};

const readStoredSession = () => {
  const storedValue = localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    return { token: null, user: null };
  }

  try {
    const parsedValue = JSON.parse(storedValue);

    return {
      token: parsedValue?.token || null,
      user: parsedValue?.user || null
    };
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => readStoredSession().token);
  const [user, setUser] = useState(() => readStoredSession().user);

  useEffect(() => {
    clearLegacySessionKeys();

    const syncSessionFromStorage = () => {
      const storedSession = readStoredSession();

      setToken((currentToken) => {
        return currentToken === storedSession.token ? currentToken : storedSession.token;
      });

      setUser((currentUser) => {
        const currentUserText = JSON.stringify(currentUser);
        const nextUserText = JSON.stringify(storedSession.user);

        return currentUserText === nextUserText ? currentUser : storedSession.user;
      });
    };

    const handleStorageChange = (event) => {
      if (!event.key || event.key === STORAGE_KEY || LEGACY_STORAGE_KEYS.includes(event.key)) {
        syncSessionFromStorage();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSessionFromStorage();
      }
    };

    const intervalId = window.setInterval(syncSessionFromStorage, 1000);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", syncSessionFromStorage);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", syncSessionFromStorage);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const saveSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    clearLegacySessionKeys();

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
