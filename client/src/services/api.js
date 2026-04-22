import axios from "axios";

const STORAGE_KEY = "task-track-auth";
const LEGACY_STORAGE_KEYS = ["task-time-auth", "token", "user"];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem(STORAGE_KEY);

  if (storedSession) {
    try {
      const parsedSession = JSON.parse(storedSession);

      if (parsedSession.token) {
        config.headers.Authorization = `Bearer ${parsedSession.token}`;
      }
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEY);
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
