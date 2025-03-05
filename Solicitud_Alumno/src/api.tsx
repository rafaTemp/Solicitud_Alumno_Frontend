import axios from 'axios';

const api = axios.create({
  baseURL: 'http://docvalle.duckdns.org/api',
  //baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true, // Esto es crucial para usar cookies con Sanctum
});
//Agregar un interceptor para incluir el token en los encabezados de las solicitudes
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
export default api;