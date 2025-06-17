import axios from 'axios';

const PublicAPI = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/accounts/',
});

export default PublicAPI;
