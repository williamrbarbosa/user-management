import axios from "axios";
import Cookies from "js-cookie";

type ApiError = { error: string; message: string; statusCode: number };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = accessToken;
    }
    // Don't override Content-Type if it's FormData - let browser set boundary
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      if ((response && status === 419) || status === 401) {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("user");
        Cookies.remove("accessToken");

        const path = window.location.pathname;
        const href = window.location.href;
        if (!window.location.href.includes("/login")) {
          window.location.href = href.replace(path, "/login");
        }
        return Promise.reject(data);
      }

      if (
        status === 400 ||
        status === 409 ||
        status === 422 ||
        status === 412 ||
        status === 503 ||
        status === 500
      ) {
        return Promise.reject(data);
      }

      return response;
    }

    // if response is undefined (ex: Network error)
    console.error("Network error, no response from server:", error);
    return Promise.reject(error);
  },
);

export default api;

export type { ApiError };
