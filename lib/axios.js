import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // client API runs on same port
  withCredentials: true,            // 👈 send cookies with requests
});

export default api;