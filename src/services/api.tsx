import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

//INterceptor che aggiiunge il token
api.interceptors.request.use((config) =>{
    const token = localStorage.getItem("access_token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor che gestisce token scaduto/non valido
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);