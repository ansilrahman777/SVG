import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

API.interceptors.request.use((config) => {
  if (!config.url.includes('adminpanel/login/')) {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  config.headers['Content-Type'] = 'application/json';

  return config;
});

export default API;
