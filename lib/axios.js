// lib/axios.js
import axios from "axios";

// This logic automatically determines the correct URL for both local development and Vercel.
let API_BASE_URL;

if (process.env.VERCEL_ENV === 'production') {
    // In production, use the primary Vercel URL.
    API_BASE_URL = `https://${process.env.VERCEL_URL}`;
} else if (process.env.VERCEL_URL) {
    // In a preview deployment, use the temporary Vercel URL.
    API_BASE_URL = `https://${process.env.VERCEL_URL}`;
} else {
    // When running locally, use localhost.
    API_BASE_URL = "http://localhost:3001";
}

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export default api;
