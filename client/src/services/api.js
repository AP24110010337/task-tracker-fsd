import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api"
});

api.interceptors.request.use((config) => {
  const storedSession = localStorage.getItem("task-track-auth");

  if (storedSession) {
    try {
      const parsedSession = JSON.parse(storedSession);

      if (parsedSession.token) {
        config.headers.Authorization = `Bearer ${parsedSession.token}`;
      }
    } catch (error) {
      localStorage.removeItem("task-track-auth");
    }
  }

  return config;
});

export default api;

