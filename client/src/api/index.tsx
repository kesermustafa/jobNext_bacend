import axios from "axios";
import {getDecryptedToken} from "../utils/tokenStorege.ts";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = getDecryptedToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            console.warn("Unauthorized → logout");
            localStorage.removeItem("token");
        }
        return Promise.reject(err);
    }
);

export default api;