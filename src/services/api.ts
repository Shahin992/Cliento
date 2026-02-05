import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'https://api.example.com',
  timeout: 10000,
});
