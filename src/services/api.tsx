import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

//INterceptor che aggiiunge il token
api.interceptors.request.use((config) =>{
    const token = localStorage.getItem("acces_token");
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});