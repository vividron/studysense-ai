import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                console.error("Server error. Please try again later");
                error.type = "server";
                error.message = "Server error. Please try again later.";
            }
            else if (error.code === "ECONNABORTED") {
                console.error("Request timeout. Please try again later");
                error.message = "Request timed out. Please try again.";
                error.type = "timeout";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;