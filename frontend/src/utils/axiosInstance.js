import axios from "axios";

import { BASE_URL } from "./apiPaths";


const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Set a timeout of 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor to add token to headers if available
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/"; // Redirect to login page
      } else if (error.response.status === 500) {
        console.error("Server error:", error.response.data);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
