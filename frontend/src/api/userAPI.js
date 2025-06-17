import axios from 'axios';
import { parseJwt } from '../utils/jwt';  // your JWT decoder helper

const UserAPI = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

UserAPI.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access');
  const refreshToken = localStorage.getItem('refresh');

  if (token) {
    const decoded = parseJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);

    // Refresh if token expires in less than 60 seconds
    if (decoded && decoded.exp < currentTime + 60) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/api/accounts/refresh/', {
          refresh: refreshToken,
        });
        localStorage.setItem('access', response.data.access);
      } catch (error) {
        console.error('Token refresh failed', error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/user-login';  // redirect to login page
      }
    }
    config.headers.Authorization = `Bearer ${localStorage.getItem('access')}`;
  }

  config.headers['Content-Type'] = 'application/json';
  return config;
});

export default UserAPI;
