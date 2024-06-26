import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Permite a Axios enviar cookies en las solicitudes
});

export default api;
