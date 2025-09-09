// lib/axios.js
import axios from "axios";

// Vercel automatically sets NEXT_PUBLIC_VERCEL_URL for all deployments.
const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3001";

const api = axios.create({
    baseURL,
    withCredentials: true,
});

export default api;
