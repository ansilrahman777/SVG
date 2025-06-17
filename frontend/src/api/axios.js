import axios from "axios";
import { parseJwt } from "../utils/jwt";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Interceptor example using parseJwt
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("access");
  const refreshToken = localStorage.getItem("refresh");

  if (token) {
    const decoded = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded && decoded.exp < currentTime + 60) {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/adminpanel/refresh/", {
          refresh: refreshToken
        });

        const newAccessToken = response.data.access;
        localStorage.setItem("access", newAccessToken);
      } catch (error) {
        console.error("Token refresh failed", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/admin-login";
      }
    }

    config.headers.Authorization = `Bearer ${localStorage.getItem("access")}`;
  }

  config.headers["Content-Type"] = "application/json";
  return config;
});

export default API;
