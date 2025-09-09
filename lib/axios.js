// lib/axios.js
import axios from "axios";

let baseURL;

if (typeof window === "undefined") {
  // Running on server (SSR/API routes)
  baseURL = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
} else {
  // Running in browser → always use relative path
  baseURL = "";
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
