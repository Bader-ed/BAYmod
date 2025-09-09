// lib/axios.js
import axios from "axios";

// This is the key change. We check if the Vercel URL is available.
// If it is, we use it. If not (i.e., we're in local development),
// we fall back to the localhost URL.
const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default api;
