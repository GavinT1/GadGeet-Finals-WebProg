import axios from 'axios';

// Create an instance of axios with your backend URL
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Make sure this matches your Backend Port!
});

// Automatically add the Token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;